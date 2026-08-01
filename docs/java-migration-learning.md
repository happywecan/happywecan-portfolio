# Java 後端遷移學習筆記

## 遷移原則

Java Spring Boot 現在是主要後端，在完整 Compose 中使用 `8001`。Python FastAPI
只保留為 `legacy-python` profile，供遷移期間比對舊資料契約。

## 第一課：一個請求如何進入 Spring Boot

呼叫 `GET /healthz` 時，流程如下：

```text
瀏覽器或 Next.js
    -> Spring Boot 內建 Web Server
    -> HealthController.health()
    -> HealthResponse
    -> Jackson 轉成 JSON
```

### Application

`PortfolioApiApplication` 是程式入口。`@SpringBootApplication` 會啟動 Spring，
並掃描同一個 package 及其子 package 內的 Controller、Service 和其他元件。

### Controller

`@RestController` 告訴 Spring：這個類別負責 HTTP API，回傳值要寫入 response body。
`@GetMapping("/healthz")` 則把 GET 請求對應到 `health()` 方法。

### record

`HealthResponse` 使用 Java `record` 表示不可變的資料物件：

```java
public record HealthResponse(String status) {}
```

Spring Boot 內建的 Jackson 會把它序列化成：

```json
{"status":"ok"}
```

這與現有 FastAPI `/healthz` 的契約相同，所以前端不必知道後端已經換語言。

## Maven 基礎

`pom.xml` 是 Maven 專案的核心設定檔。POM 是 Project Object Model 的縮寫，
主要描述：

- 專案名稱、版本與 Java 版本
- 使用哪些 dependencies
- 如何編譯、測試與封裝
- 使用哪些 build plugins

本專案使用 Maven Wrapper：

- Windows：`mvnw.cmd`
- macOS/Linux：`mvnw`
- Wrapper 設定：`.mvn/wrapper/maven-wrapper.properties`

因此團隊成員不必各自安裝 Maven，也能使用專案指定的相同 Maven 版本。

常見 Maven lifecycle：

```text
validate -> compile -> test -> package -> verify -> install -> deploy
```

例如執行 `package` 時，Maven 會依序完成前面的編譯與測試，最後在 `target`
目錄產生可以執行的 JAR。

## 常用指令

在 `backend-java` 目錄執行：

```powershell
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

啟動後測試：

```powershell
Invoke-RestMethod http://localhost:8080/healthz
```

或從專案根目錄使用 Docker：

```powershell
docker compose -f docker-compose.java.yml up --build
```

Docker 模式的網址是 `http://localhost:8002/healthz`。

## 接下來

## 第二課：Portfolio 唯讀 API

本階段加入兩支與 Python 版本相同路徑的 API：

```text
GET /api/portfolio
GET /api/portfolio/{id}
```

請求會依序經過：

```text
PortfolioController
    -> PortfolioService
    -> PortfolioRepository
    -> MongoDB portfolio collection
```

### Document

`PortfolioDocument` 描述 MongoDB document。Java 使用 `imageUrl`，但資料庫原本的欄位
是 `image_url`，所以用 `@Field("image_url")` 建立映射。

Document 是資料庫模型，不直接拿來當 API response。這樣資料庫結構和公開 API
可以各自演進。

### Repository

`PortfolioRepository` 繼承 `MongoRepository`。Spring Data 會在執行時自動建立實作，
因此不需要自行撰寫一般的 `findById()`。

以下方法名稱也會被 Spring Data 解析成查詢：

```java
findAllByOrderByCreatedAtDesc()
```

意思是取得全部資料，並依 `createdAt` 由新到舊排序。

### Service

`PortfolioService` 放應用程式規則：

- 驗證字串是不是合法 MongoDB ObjectId
- 呼叫 Repository
- 找不到資料時拋出例外
- 把 Document 轉成 `PortfolioResponse`

Controller 不應承擔這些規則，否則功能增加後會變得難以測試。

### Controller 與 DTO

`PortfolioController` 只負責 HTTP 路由與呼叫 Service。`PortfolioResponse` 是 API DTO，
使用 `@JsonProperty("image_url")` 維持 Next.js 現有的 snake_case 契約。

```text
Java imageUrl -> JSON image_url
Java createdAt -> JSON created_at
MongoDB _id -> JSON id
```

### 統一錯誤格式

`GlobalExceptionHandler` 把 Java exception 轉成 HTTP status 與 JSON：

```json
{"detail":"Invalid portfolio id: invalid"}
```

因此 Next.js 現有的 `errorData.detail` 不需要修改。

### 測試分工

- `PortfolioServiceTest`：測試規則，不連真實 MongoDB
- `PortfolioControllerTest`：模擬 HTTP，保護狀態碼與 JSON 欄位
- `PortfolioApiApplicationTests`：確認整個 Spring context 可以啟動

目前 Maven 共執行 9 個測試，全部通過。外部測試 MongoDB 的即時唯讀驗證曾逾時；
待該資料庫可連線時，可再次啟動 Java 後端並呼叫 `/api/portfolio` 驗證真實資料。

## 完整重構後的延伸學習

Portfolio 寫入、Blog 發佈流程、Skill/Hobby CRUD、Settings、Contact、Newsletter、
Upload、Spring Security 與 JWT 均已完成。接下來適合依序深入：

1. 為每個 Service 補更多 domain edge-case 測試。
2. 使用 Testcontainers 執行真實 MongoDB integration test。
3. 將圖片儲存抽換成 Google Cloud Storage。
4. 加入 audit log、request ID、metrics 與結構化 logging。
5. 當資料關聯需求增加時，以 PostgreSQL/JPA 建立第二個練習分支。
