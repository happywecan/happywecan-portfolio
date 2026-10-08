# 系統架構

## 整體概覽

本專案由前端網站與後端 API 組成：

```text
瀏覽器
  -> Next.js 前端（連接埠 3000）
  -> Spring Boot 後端（連接埠 8001）
  -> MongoDB（由 MONGODB_URI 指定）
```

## 前端

`frontend/` 是 Next.js 應用程式，負責呈現公開的個人作品集、作品頁、部落格、登入頁面與管理介面。

重要目錄與檔案：

- `frontend/app/`：Next.js 頁面路由
- `frontend/components/sections/`：公開頁面主要區塊的組合
- `frontend/features/`：各功能所屬的頁面內容、Hooks 與視覺區塊
- `frontend/components/admin/`：管理介面的新增、讀取、修改與刪除（CRUD）畫面
- `frontend/services/apiClient.ts`：共用的 HTTP 請求與錯誤處理邊界
- `frontend/services/`：各 API 端點專用的前端呼叫程式

瀏覽器使用的 API 網址由 `NEXT_PUBLIC_API_URL` 設定。

首頁採用精簡的功能分層：

```text
app/page.tsx                         路由與頁面行為
components/sections/EditorialLanding 首頁組合入口
features/landing/useLandingSettings  取得可編輯的公開內容
features/landing/landingContent      靜態作品集文案
features/landing/*.tsx               首頁視覺區塊
```

這樣可以讓首頁使用單一的渲染路徑。舊版未使用的區塊排序渲染器已移除，避免保留容易造成誤解的相容程式碼。

## 後端

`backend-java/` 是使用 Java 21 建立的 Spring Boot 應用程式。它連接 MongoDB、提供上傳檔案、開放健康檢查端點，並對 API 套用 JWT 驗證與請求層級的防護措施。

重要目錄：

- `backend-java/src/main/java/`：API 模組、服務、資料存取與安全設定
- `backend-java/src/test/java/`：Controller、Service 與安全性測試
- `static/uploads/`：提供給 Java 服務使用的上傳圖片目錄

## 資料

MongoDB 連線由 `MONGODB_URI` 設定。本機開發可以使用 `docs/development.md` 說明的共用測試資料庫；正式環境必須使用獨立的資料庫。

主要資料集合包括作品、部落格文章、技能、興趣、首頁設定、網站設定、聯絡訊息與使用者。

## 本機執行環境

Docker Compose 是其中一種本機開發方式：

```bash
docker compose up -d --build
```

此指令會啟動：

- `backend`：Spring Boot 容器，從本機的 `localhost:8001` 存取
- `frontend`：Next.js 容器，從本機的 `localhost:3000` 存取

若電腦效能有限，也可以使用 `docs/development.md` 說明的本機直接啟動方式，不必用 Docker 執行前後端。

## 部署

專案包含以 VM（虛擬機器）為主的部署設定。部署相關說明與檔案包括：

- `.github/workflows/deploy-vm.yml`
- `docker-compose.vm-pull.yml`
- `docs/gcp-vm-deployment.md`
