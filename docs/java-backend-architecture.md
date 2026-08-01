# Java 後端架構與營運說明

## 模組

| 模組 | 公開功能 | 後台功能 | MongoDB collection |
|---|---|---|---|
| Admin | 登入 | 取得目前管理員 | `users` |
| Portfolio | 列表、單筆 | 新增、修改、刪除 | `portfolio` |
| Blog | 已發佈列表、單筆、數量 | 草稿列表、CRUD | `blog_posts` |
| Skill | 列表 | CRUD | `skills` |
| Hobby | 列表 | CRUD | `hobbies` |
| Settings | Hero、全站設定 | 更新設定 | `settings` |
| Contact | 送出表單 | 列表、已讀／已回覆、刪除 | `contacts` |
| Newsletter | 訂閱 | 列表、啟用／停用、刪除 | `newsletter_subscribers` |
| Upload | 圖片讀取 | 圖片上傳 | 檔案儲存 |

## Package 原則

每個業務模組使用相同結構：

```text
domain       MongoDB document
repository   Spring Data 存取
service      規則、狀態轉換、交易邊界
web          Controller、request、response
```

跨模組能力放在：

```text
config       CORS、靜態資源
security     JWT 與 HTTP 權限
shared       共用錯誤格式
```

## API 權限

公開：

```text
GET  /healthz
GET  /api/portfolio/**
GET  /api/blog/**
GET  /api/skills
GET  /api/hobbies
GET  /api/settings/**
POST /api/contactme
POST /api/subscribe
POST /api/admin/token
GET  /static/uploads/**
```

其餘端點預設需要合法 Bearer JWT。使用「預設拒絕」可避免未來新增管理 API 時
忘記加上權限。

## Blog 發佈規則

- 公開列表只查詢 `is_published=true`。
- `/api/blog/all` 需要 JWT。
- 草稿第一次發佈時自動設定 `published_at`。
- 修改文章會保留 `created_at` 並更新 `updated_at`。

## 設定資料

Hero 與 Site Settings 使用同一個 `settings` collection，以 `settings_id` 區分。
這一模組採用 Map/Document，是因為 Site Settings 是大量、會持續新增的 CMS 文案欄位；
其他核心資料仍使用強型別 Java model。

## 圖片儲存

本機與 VM Docker 將 `static/uploads` 掛載到 Java 容器 `/app/uploads`。
Cloud Run 的容器檔案系統不是永久儲存；正式採用 Cloud Run 時應把 UploadService
替換為 Google Cloud Storage 實作，或將上傳功能部署在具有 persistent disk 的 VM。

## 環境變數

| 變數 | 用途 |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `SECRET_KEY` | JWT HMAC secret，至少 32 bytes |
| `ADMIN_USER` | 空資料庫首次建立管理員 |
| `ADMIN_PASSWORD` | 首次管理員密碼，至少 12 字元 |
| `CORS_ORIGINS` | 允許的前端網址，以逗號分隔 |
| `UPLOAD_DIR` | 圖片永久目錄 |
| `MAIL_*` | SMTP 通知 |
| `CONTACT_NOTIFY_TO` | 聯絡通知收件者 |

營運與防護機制包含：

- `/actuator/health/liveness` 與 `/actuator/health/readiness`；readiness 會實際檢查 MongoDB。
- 每個回應都帶 `X-Request-Id`，方便從使用者回報追查伺服器紀錄。
- 登入、聯絡表單與 Newsletter 訂閱依來源 IP 限流。
- 圖片同時驗證副檔名、MIME、檔案大小及內容簽章。

## 遷移策略

主要 `docker-compose.yml` 已改用 Java。Python 仍保留為 `legacy-python` profile，
方便比對舊資料契約；確認正式環境一段時間後再移除 Python 原始碼與 dependencies。
