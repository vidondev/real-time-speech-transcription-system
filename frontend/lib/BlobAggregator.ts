export class BlobAggregator {
  private chunks: Uint8Array[] = [];
  private intervalId: number | null = null;

  /**
   * 创建一个 Blob 聚合器实例
   * @param callback 当 Blob 生成时的回调函数
   * @param interval 聚合间隔（毫秒），默认为 1000ms
   */
  constructor(
    private callback: (blob: Blob) => void,
    private interval: number = 1000
  ) {
    console.log("aaa");
  }

  /**
   * 启动聚合器
   */
  start(): void {
    console.log("start", this.intervalId);
    if (!this.intervalId) {
      this.intervalId = window.setInterval(() => {
        this.aggregate();
      }, this.interval);
      console.log("start 2", this.intervalId);
    }
  }

  /**
   * 停止聚合器
   * @param flush 是否处理剩余数据
   */
  stop(flush: boolean = false): void {
    console.log("stop", this.intervalId);
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
      if (flush) this.aggregate();
    }
  }

  /**
   * 添加 Uint8Array 数据到缓冲区
   * @param data 要添加的二进制数据
   */
  addData(data: Uint8Array): void {
    this.chunks.push(data);
  }

  /**
   * 执行聚合操作
   */
  private aggregate(): void {
    console.log("🚀 ~ BlobAggregator ~ aggregate ~ chunks:", this.chunks);

    if (this.chunks.length === 0) return;

    // 创建 Blob 并触发回调
    const blob = new Blob(this.chunks, {
      type: "audio/webm;codecs=opus",
    });
    this.callback(blob);

    // 清空当前数据块
    this.chunks = [];
  }
}
export class AudioBlobConverter {
  private buffer: Uint8Array[] = []; // 緩衝區，存儲收集到的 Uint8Array
  private intervalId: number | null = null; // 定時器的 ID

  // 開始收集數據，並每秒生成 Blob
  startCollecting(onBlobReady: (blob: Blob) => void) {
    // 每 1000 毫秒（1 秒）執行一次
    this.intervalId = window.setInterval(() => {
      if (this.buffer.length === 0) {
        return; // 如果沒有數據，跳過
      }

      // 合併所有 Uint8Array 到一個大的 Uint8Array
      const totalLength = this.buffer.reduce((acc, arr) => acc + arr.length, 0);
      const mergedArray = new Uint8Array(totalLength);
      let offset = 0;

      for (const arr of this.buffer) {
        mergedArray.set(arr, offset);
        offset += arr.length;
      }

      // 生成 Blob（直接傳遞緩衝區的數據，無需合併）
      const blob = new Blob(this.buffer, {
        type: "audio/webm;codecs=opus",
      });

      // 調用回傳函數返回 Blob
      onBlobReady(blob);

      // 清空緩衝區
      this.buffer = [];
    }, 1000);
  }

  // 添加數據到緩衝區
  addData(data: Uint8Array) {
    this.buffer.push(data);
  }

  // 停止收集
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

type BlobCallback = (blob: Blob) => void;

interface BlobCollectorOptions {
  blobType?: string;
}

export class BlobCollector {
  private chunks: Uint8Array[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    private callback: BlobCallback,
    private options: BlobCollectorOptions = {}
  ) {}

  start() {
    if (this.intervalId !== null) return;

    this.intervalId = setInterval(() => {
      this.processChunks();
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addData(data: Uint8Array) {
    this.chunks.push(data);
  }

  private processChunks() {
    if (this.chunks.length === 0) return;

    // 计算总长度并合并数据
    const totalBytes = this.chunks.reduce((sum, arr) => sum + arr.length, 0);
    const merged = new Uint8Array(totalBytes);

    let offset = 0;
    for (const chunk of this.chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    // 生成 Blob
    const blob = new Blob([merged], {
      type: this.options.blobType || "application/octet-stream",
    });

    // 触发回调并重置
    this.callback(blob);
    this.chunks = [];
  }
}
