# 專案學習路線：從瀏覽器到雲端

這份計畫把目前的個人網站當成實作教材，循序看懂 React / Next.js、Java / Spring Boot、MongoDB，以及網站部署所需的基礎設施。目標不是背完所有程式碼，而是能追蹤一個功能的資料流、解釋各層責任，並安全地修改與驗證它。

## 怎麼使用這份計畫

- 一次完成一個階段；先理解現有程式，再做小改動。
- 每階段都要能用自己的話回答「它解決什麼問題？資料從哪裡來、往哪裡去？」
- 遇到陌生語法先記下來，沿著呼叫方向追蹤，不必一次讀懂整個檔案。
- 練習時使用測試資料庫與本機環境；不要把密碼、Token 或正式資料放進 Git。
- 完成一個階段後，在下方勾選，並記下仍不清楚的問題。

## 0. 先建立全貌：這個網站由什麼組成？

閱讀：

1. `README.md`
2. `docs/architecture.md`
3. `docs/development.md`
4. `frontend/package.json` 與 `backend-java/pom.xml`（先看技術與啟動指令，不用逐項研究依賴）

理解：瀏覽器、Next.js 前端、Spring Boot API、MongoDB 各自負責什麼；本機開發與正式部署有什麼不同。

完成標準：能畫出「瀏覽器 → 前端 → 後端 → 資料庫」的簡圖，並指出前後端使用的語言、框架與連接埠。

## 1. 啟動網站：程式如何在本機跑起來？

閱讀：

1. `scripts/dev-local.sh`
2. `scripts/dev-backend-local.sh`、`scripts/dev-frontend-local.sh`
3. `docker-compose.yml`
4. `.env.example`

理解：Node.js 與 Java 如何啟動、環境變數如何傳入、健康檢查為何重要，以及 Compose 如何安排服務依賴。先使用較輕量的本機啟動方式，再理解 Docker 設定。

完成標準：能啟動前後端、打開首頁、找到 API 健康檢查位置，並能安全地停止服務。不要把 `.env` 的實際內容貼到公開文件或提交到 Git。

## 2. 找到首頁入口：Next.js 如何組成畫面？

依序閱讀：

1. `frontend/app/page.tsx`
2. `frontend/components/sections/EditorialLanding.tsx`
3. `frontend/features/landing/`
4. `frontend/components/layout/`
5. `frontend/app/globals.css`

理解：路由頁面、版面容器、功能區塊與樣式的分工；從首頁入口一路追到實際顯示的區塊。

完成標準：能指出首頁的組合入口，並追蹤一個可見區塊是在哪個元件建立、使用哪些資料。

## 3. React 基礎：元件如何回應資料與操作？

建議先看較完整、容易追蹤的聯絡表單：

1. `frontend/components/sections/ContactSection.tsx`
2. 留意 `useState`、`useEffect`、事件處理函式與表單提交
3. 對照 `frontend/features/landing/` 中不依賴表單的展示元件

理解：元件、props、state、事件、受控輸入、條件渲染與副作用。每次只追蹤一個 state：它在哪裡建立、何時更新、更新後畫面如何變化。

完成標準：能說明表單載入、送出中、成功與失敗等狀態如何影響畫面。

## 4. 前端 API：瀏覽器如何把資料送到後端？

依序閱讀：

1. `frontend/services/contactService.ts`
2. `frontend/services/apiClient.ts`
3. `frontend/components/sections/ContactSection.tsx` 的提交流程

理解：HTTP 請求、URL、JSON、狀態碼、共用 API client、錯誤處理，以及 `NEXT_PUBLIC_API_URL` 的用途。注意前端型別能協助開發，但不是伺服器端的安全驗證。

完成標準：能從按下送出開始，依序指出呼叫了哪個函式、送出什麼資料，以及如何處理回應或錯誤。

## 5. Java / Spring Boot：API 如何接收請求？

先看應用程式入口與健康檢查，再沿著聯絡表單 API 閱讀：

1. `backend-java/src/main/java/com/happywecan/portfolio/PortfolioApiApplication.java`
2. `backend-java/src/main/java/com/happywecan/portfolio/HealthController.java`
3. `backend-java/src/main/java/com/happywecan/portfolio/contact/web/ContactController.java`
4. `backend-java/src/main/java/com/happywecan/portfolio/contact/web/ContactRequest.java`

理解：Spring Boot 啟動、Controller 路由、HTTP request/response、JSON 對應 Java record，以及 Bean Validation（例如必填、Email 格式與長度限制）。

完成標準：能指出哪個類別接收 `POST /api/contactme`，輸入資料如何驗證，成功時回傳什麼。

## 6. 後端分層與資料庫：資料如何保存？

接著沿著同一個請求閱讀：

1. `backend-java/src/main/java/com/happywecan/portfolio/contact/service/ContactService.java`
2. `backend-java/src/main/java/com/happywecan/portfolio/contact/repository/ContactRepository.java`
3. `backend-java/src/main/java/com/happywecan/portfolio/contact/domain/ContactDocument.java`
4. `backend-java/src/main/resources/application.properties`

理解：Controller 負責 HTTP 邊界、Service 負責應用流程、Repository 負責資料存取、Document 描述 MongoDB 文件；也要留意資料清理、通知寄送與設定值的責任分界。

完成標準：能從收到請求追到 MongoDB 儲存，解釋每一層為什麼存在，以及 `MONGODB_URI` 如何提供連線設定。

## 7. 測試與安全：怎麼知道改動沒弄壞功能？

閱讀：

1. `backend-java/src/test/java/` 中與 Contact 或 Controller 相近的測試
2. `backend-java/src/main/java/com/happywecan/portfolio/security/`
3. `backend-java/src/main/java/com/happywecan/portfolio/config/RequestIdFilter.java`
4. `backend-java/src/main/java/com/happywecan/portfolio/config/WebConfig.java`

理解：單元測試與 Web/API 測試的差異、驗證錯誤如何呈現、公開與受保護 API 的差異，以及 CORS、JWT、請求識別碼等概念。讀安全程式碼時，不要為了測試而放寬正式設定。

完成標準：能找到一項既有行為對應的測試，並說明它驗證了什麼，以及測試失敗能告訴我們什麼。

## 8. 容器與部署包裝：程式如何被交付？

閱讀：

1. `backend-java/Dockerfile`
2. `frontend/Dockerfile`
3. `docker-compose.yml`
4. `docs/docker-runtime.md`

理解：映像與容器、建置階段與執行階段、連接埠映射、volume、服務健康檢查，以及本機設定與正式設定的差別。

完成標準：能說明一個容器如何建置、如何取得設定、如何連到另一個服務，以及資料放在容器外或容器內的差異。

## 9. 上雲基礎：網站正式運作還需要什麼？

先閱讀概念與目前專案文件，不要直接執行部署：

1. `render.yaml`
2. `docs/gcp-vm-deployment.md`、`docs/gcp-cloud-run.md`
3. `docs/nginx-vm.conf`、`docs/happywecan.com.conf`
4. `.github/workflows/` 中的部署 workflow（若存在）

理解：DNS 與網域、HTTPS/TLS、反向代理、CI/CD、雲端環境變數與密鑰、健康檢查、日誌、備份、資源費用與回復部署。雲端部署可能改變正式服務狀態或產生費用；學習時先閱讀、畫流程、檢查設定，未確認前不執行部署或變更資源。

完成標準：能畫出使用者請求如何到達網站與 API，指出資料庫與上傳檔案放在哪裡，並列出至少三項正式環境需要保護或監控的設定。

## 10. 小型實作：用一個安全改動驗收理解

選一項低風險練習：調整表單的錯誤提示、改善欄位驗證訊息、補一個測試，或為健康檢查補充說明。先描述預期行為，再找出前後端涉及的檔案，完成修改後跑相應檢查並檢視差異。

完成標準：能解釋改動的原因、資料流、驗證方式，以及可能影響的範圍；不確定時先停在可回復的小步驟。

## 學習紀錄

| 階段 | 完成 | 我已能解釋 | 還想問的問題 |
|---|---|---|---|
| 0. 專案全貌 | [ ] |  |  |
| 1. 本機啟動 | [ ] |  |  |
| 2. 首頁組成 | [ ] |  |  |
| 3. React 基礎 | [ ] |  |  |
| 4. 前端 API | [ ] |  |  |
| 5. Spring Boot API | [ ] |  |  |
| 6. 後端與 MongoDB | [ ] |  |  |
| 7. 測試與安全 | [ ] |  |  |
| 8. Docker | [ ] |  |  |
| 9. 上雲 Infra | [ ] |  |  |
| 10. 小型實作 | [ ] |  |  |

## 專案主要資料流速查

```text
聯絡表單元件
  -> contactService
  -> apiClient（HTTP / JSON / 錯誤處理）
  -> ContactController（路由與請求驗證）
  -> ContactService（應用流程）
  -> ContactRepository（資料存取）
  -> ContactDocument（MongoDB 文件）
```

每一課都沿著這條路線前進一小段；看懂後，再把同樣方法用在作品集、部落格、管理介面與檔案上傳功能。
