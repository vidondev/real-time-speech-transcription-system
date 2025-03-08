export type UserResponse = User;
export type MessageListResponse = Message[];

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  message: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
}
