import {
  createClient,
  ListenLiveClient,
  LiveTranscriptionEvents,
  SOCKET_STATES,
} from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { AssemblyAI, RealtimeTranscript } from 'assemblyai';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, ListenLiveClient> = new Map();
  private keepAlive;
  private user: User;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async handleConnection(client: Socket) {
    client.on('user_login', async (data: string) => {
      console.log('🚀 ~ ChatGateway ~ client.on ~ user_login:', data);
      this.user = JSON.parse(data);
    });
    client.on('start_taking', () => {
      this.setupDeepgram(client);
    });

    client.on('stop_taking', () => {
      this.handleDisconnect(client);
    });
  }

  setupDeepgram(client: Socket) {
    const apiKey = this.configService.get<string>('DEEPGRAM_API_KEY');
    const deepgram = createClient(apiKey);
    const connection = deepgram.listen.live({
      smart_format: true,
      model: 'nova-3',
      language: 'en-US',
    });

    if (this.keepAlive) clearInterval(this.keepAlive);
    this.keepAlive = setInterval(() => {
      console.log('deepgram: keepalive');
      connection.keepAlive();
    }, 10 * 1000);

    connection.on(LiveTranscriptionEvents.Open, () => {
      console.log('deepgram connected');
      connection.on(LiveTranscriptionEvents.Close, () => {
        console.log('Connection closed.');
      });
      connection.on(LiveTranscriptionEvents.Transcript, async (data) => {
        console.log('transcription: ', data.channel.alternatives[0].transcript);
        const message = data.channel.alternatives[0].transcript;
        if (message && this.user) {
          client.emit('transcription', message);
          await this.prisma.message.create({
            data: {
              userId: this.user.id,
              message: message,
            },
          });
          const messages = await this.userService.findAllMessages();
          client.emit('messages', JSON.stringify(messages));
        }
      });
      connection.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log(data);
      });
      connection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
      });
    });

    client.on('audio_chunk', (chunk: ArrayBuffer) => {
      console.log('🚀 ~ ChatGateway ~ client.on ~ audio_chunk:', chunk);
      if (connection.getReadyState() === SOCKET_STATES.open) {
        connection.send(chunk);
      }
    });

    this.clients.set(client.id, connection);
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
    const connection = this.clients.get(client.id);
    if (!connection) return;
    connection.requestClose();
    if (this.keepAlive) clearInterval(this.keepAlive);
  }
}
