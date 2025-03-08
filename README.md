# Real-time Speech-transcription system

## 技術選型

- **前端**: Next.js (React 框架)
  - 選擇原因: 支持 SSR/SSG/優化首頁加載，內置 API 路由簡化全棧開發，和 React 無縫集成。
- **后端**: NestJS
  - 選擇原因: 模塊化架構提升可維護性，原生支持 Typescript，完善的 Websocket 集成能力。
- **数据库**: PostgreSQL + Prisma
  - 選擇原因: 關係型數據庫保證數據一致性，Prisma 的 Type-safe 查詢減少 SQL 錯誤。

### 架构设计

- **用 WebSocket 作為溝通橋樑**
  - 前端 -> 後端: 傳輸編碼音頻塊
  - 後端 -> 前端：推送 Deepgram 實時轉錄結果

### 主要面臨的挑战

- 需要了解如何使用 MediaRecorder 將用戶的聲音通過 websocket 傳送到服務器，再由服務器通過調用 deepgram api 進行語音轉譯
- 需要了解如何使用 Deepgram 進行語音轉譯
- 學習將項目 Docker 化
- 以及如何部署到 k8s
