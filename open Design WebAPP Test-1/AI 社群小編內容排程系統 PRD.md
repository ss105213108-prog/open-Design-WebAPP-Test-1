# **📝 AI 社群小編內容排程系統 — 產品需求文件 (PRD)**

**專案狀態：** 規劃階段 (MVP 1.0)

**編寫人：** 資深工程師導師

**目標讀者：** 獨立開發者、產品經理、前端/全端工程師、設計師

## **💡 導師的前導讀：為什麼我們需要這份 PRD？**

哈囉！恭喜你邁出了開發全端 Web 應用的第一步！

這套 **「AI 社群小編內容排程系統」** 是一個非常經典且具備商業價值的專案。它完美結合了**品牌管理 (Brand Studio)**、**人工智慧 (OpenAI)**、**雲端資料庫 (Supabase)** 與**行銷行事曆 (Calendar Dashboard)**。

這份 PRD 是我們整個開發旅程的「航海地圖」。不論你是要自己動手寫程式，還是要跟設計師、合作夥伴溝通，這份文件都能確保大家在同一個頻道上。我們用最白話、最符合邏輯的方式，把每一個功能、畫面和資料夾抽屜都定義清楚！

## **一、 專案概述與核心價值**

### **1.1 產品定位 (Product Positioning)**

這是一個**為個人創作者、社群小編與中小企業設計的「一站式 AI 社群行銷生成與排程管理工具」**。

使用者只需設定一次「品牌特徵」，系統就能扮演該品牌的專屬虛擬小編，針對相同主題快速生成適合不同社群平台（Facebook、Instagram、Threads、LINE OA）的文案，並提供可視化的排程月曆進行審稿、修改與管理。

### **1.2 系統四大核心角色分工**

系統的運作就像是一間高效率的數位行銷工作室，四個角色各司其職：

| 角色名稱 | 角色定位（通俗解釋） | 本專案中的核心任務 |
| :---- | :---- | :---- |
| **使用者 (User)** | 操作畫面的品牌小編 | 1\. 輸入與儲存品牌設定。 2\. 輸入貼文主題，選擇目標發布平台與排程時間。 3\. 審核、微調與排程貼文。 |
| **前端網頁 (Frontend)** | 看得到、按得到的精美介面 | 1\. 提供 Brand Studio 表單與 AI 產文操作區。 2\. 渲染貼文在不同平台的手機模擬預覽效果。 3\. 呈現排程月曆與代辦看板（如：「等待審稿 6 篇」）。 |
| **OpenAI (AI Engine)** | 隨時待命的超強文案寫手 | 1\. 接收品牌特徵與主題。 2\. 戴上「品牌面具」，依據不同平台規範生成精準的文案。 |
| **Supabase (Backend/DB)** | 安全可靠的雲端數位保險箱 | 1\. 永久儲存品牌的基本設定資料。 2\. 儲存所有已生成、待審核、已排程的貼文內容與發布時間。 |

## **二、 核心使用者故事與流程 (User Story & Workflow)**

### **2.1 使用者故事 (User Story)**

「作為一名身兼數職的品牌社群小編，我希望能夠**輸入一次品牌設定，就能一鍵將同一個主題轉化為符合 FB、IG、LINE OA 不同調性的文案草稿**，並能在一個**排程行事曆**中看見所有待審貼文，這樣我就可以省去重複寫作、切換視窗與手動紀錄排程的痛苦。」

### **2.2 系統整體運作流程**

graph TD  
    A\[小編填寫/更新品牌資料\] \--\>|儲存| B\[(Supabase: brands 表)\]  
    C\[小編輸入貼文主題 \+ 勾選平台\] \--\>|點擊生成| D\[網頁前端\]  
    B \--\>|讀取品牌個性| D  
    D \--\>|打包 Prompt 發送| E\[OpenAI API\]  
    E \--\>|回傳各平台文案草稿| D  
    D \--\>|手機預覽畫面| F\[小編進行審核、微調文字、選擇時間\]  
    F \--\>|點擊確認排程| G\[(Supabase: posts 表)\]  
    G \--\>|拉取資料| H\[排程月曆 & 待辦看板\]

## **三、 功能需求規格 (Functional Requirements)**

系統主要分為四個核心模組，建議採用左側靜態導覽列 (Sidebar) 的結構來進行頁面切換。

### **3.1 品牌定調中心 (Brand Studio)**

這是 AI 寫出靈魂文案的基礎。小編在此處輸入一次資料後，系統會永久保存。

* **品牌基礎欄位**：  
  * **品牌名稱**（文字輸入框，如 小林手作烘焙）。  
  * **品牌色調**（顏色選擇器 Color Picker，儲存 Hex Code 如 \#FF6B00，可用於系統 UI 的客製化點綴）。  
  * **目標客群 (TA)**（長文字輸入框，例如：20-40 歲，熱愛下午茶、講究健康低糖的上班族與年輕媽媽）。  
  * **說話語氣 (Tone & Voice)**（下拉單選或多選，如：溫暖親切、專業嚴謹、幽默搞笑、熱情活力）。  
  * **品牌禁忌詞**（文字輸入框，以半形逗號分隔，例如：最便宜, 絕無僅有, 買一送一）。  
* **操作邏輯**：點擊「儲存品牌設定」後，將資料寫入 Supabase。下次進入頁面或啟動 AI 產文時，系統應自動載入最新設定。

### **3.2 AI 貼文生成器 (AI Post Generator)**

* **任務輸入區**：  
  * **今日主題**：長文字輸入框（例如：介紹這週新上市的減糖生乳捲，主打日本鮮奶油）。  
  * **目標平台**：複選框 (Checkbox) — Facebook、Instagram、Threads、LINE OA。  
* **生成機制**：  
  * 當小編點擊「產生社群貼文」，前端應顯示酷炫的 Loading 動畫，同時發送 Request。  
  * AI 必須針對**每一個被勾選的平台**生成獨立的文案草稿。  
* **模擬預覽區 (Preview Studio)**：  
  * 以卡片或模擬手機外框的方式，並排展示生成的文案。  
  * 小編可以直接在預覽框內「手動修改」文案細節。

### **3.3 內容庫與排程管理 (Library & Calendar)**

* **數據儀表板看板**：  
  * 在最上方顯眼處，放置貼文狀態摘要卡片（例如：本週貼文草稿：等待審稿 6 篇）。  
* **多視角檢視**：  
  * **行事曆檢視 (Calendar View)**：以月/週為單位，將排程貼文以小卡片形式標記在對應日期上。  
  * **清單檢視 (List View)**：以時間軸或表格形式列出所有貼文。  
* **狀態與管理 (CRUD)**：  
  * 點擊任一排程卡片，可跳出彈窗 (Modal) 編輯內容、更換排程時間或更動狀態。  
  * 貼文狀態應分為三階段：等待審稿 (Draft) ![][image1] 已排程 (Scheduled) ![][image1] 已發布 (Published)。  
  * 支援一鍵刪除、一鍵封存。

## **四、 貼文平台生成規範 (Platform Copywriting Guidelines)**

為了讓 AI 產生的貼文真正「接地氣」，系統在調用 OpenAI 時必須約束以下寫作規範：

| 平台名稱 | 核心寫作規範與調性 | 預期輸出結構 |
| :---- | :---- | :---- |
| **Facebook** | 適合敘事、講故事、說明背景與細節，語氣較具公信力與親和力。 | 1\. 吸睛的標題。 2\. 故事化或知識性的內文（大約 ![][image2] 字）。 3\. 適合的對象。 4\. 活動詳情與 CTA。 |
| **Instagram** | 圖像思考，文字首句必須在 ![][image3] 秒內抓住眼球，段落要極度分明，善用表情符號。 | 1\. 爆款警句開頭。 2\. 重點列點（使用 Emoji 當作 Bullet Points）。 3\. 強烈的行動呼籲 (CTA)。 4\. 尾端自動帶入 ![][image4] 個精準 Hashtags。 |
| **LINE OA** | 綠色對話框環境，文字必須極短、極直接。重點在於福利、提醒與點擊連結。 | 1\. 第一行直接點出福利/通知（例如：限時折扣！）。 2\. ![][image5] 句簡短亮點介紹。 3\. 報名/購買連結與清楚引導。 |
| **Threads** | 碎碎念、口語化、具備討論度與共鳴感的短文，不宜過度商業化。 | 1\. 口語化的提問或觀點（![][image6] 字內）。 2\. 引發下方留言討論的互動式結尾。 |

## **五、 資料庫欄位設計 (Supabase Database Schema)**

### **5.1 品牌個性資料表 (Table: brands)**

**作用**：存放品牌的基礎人設與調性，每個用戶/品牌擁有一筆紀錄。

| 欄位名稱 (Column) | 資料型態 (Type) | 屬性 | 備註說明 |
| :---- | :---- | :---- | :---- |
| id | uuid | Primary Key, Default: gen\_random\_uuid() | 品牌唯一的識別身分碼 |
| name | varchar(255) | Not Null | 品牌/商家名稱 |
| color\_code | varchar(7) | Nullable | 品牌 Hex 顏色碼（例如 \#FF6B00） |
| target\_audience | text | Not Null | 目標受眾描述 |
| tone\_voice | varchar(100) | Not Null | 語氣（親切、專業等） |
| forbidden\_words | text\[\] | Default: '{}' | 禁忌詞陣列 |
| updated\_at | timestamp with time zone | Default: now() | 資料最後更新時間 |

### **5.2 貼文管理資料表 (Table: posts)**

**作用**：存放所有 AI 生成與小編手動編輯過的貼文資料。

| 欄位名稱 (Column) | 資料型態 (Type) | 屬性 | 備註說明 |
| :---- | :---- | :---- | :---- |
| id | uuid | Primary Key, Default: gen\_random\_uuid() | 貼文識別碼 |
| brand\_id | uuid | Foreign Key (brands.id) | 指向該貼文所屬的品牌 |
| platform | varchar(50) | Not Null | 發布平台（如 facebook, instagram, line\_oa） |
| title | varchar(255) | Nullable | 貼文大標題（非必填） |
| content | text | Not Null | 貼文文案主體 |
| scheduled\_at | timestamp with time zone | Not Null | 預計發布的時間 |
| status | varchar(50) | Default: 'draft' | 狀態：draft (等審), scheduled (排程), published (已發) |
| created\_at | timestamp with time zone | Default: now() | 貼文產生時間 |

## **六、 AI 提示詞工程設計 (OpenAI Prompt Engineering)**

系統後端或 API 串接層在呼叫 OpenAI API（推薦使用 gpt-4o 或 gpt-4o-mini）時，必須將系統 Prompt (System) 與使用者輸入 (User) 進行如下結構化的打包：

\================================================================================  
【SYSTEM PROMPT】  
\================================================================================  
你是一位擁有 15 年經驗的社群行銷總監與爆款文案大師。  
現在，你必須完全化身為指定品牌的專屬小編，以該品牌的專一語調進行創作。

請嚴格遵守以下【品牌設定】：  
\- 品牌名稱：{{brand.name}}  
\- 目標受眾 (TA)：{{brand.target\_audience}}  
\- 說話調性與語氣：{{brand.tone\_voice}}  
\- 絕對禁止出現的「禁忌詞/字」：{{brand.forbidden\_words}}（若有包含，請用同義詞替代，絕對不可直接露出）

請在寫作時，將上述品牌個性深深烙印在你的文字中，不要出現任何與品牌人設相違背的語氣。

\================================================================================  
【USER PROMPT】  
\================================================================================  
請針對主題：【 {{user.topic}} 】，為以下社群平台撰寫文案草稿：  
平台：【 {{user.platform}} 】

請嚴格遵循該平台的寫作規範：  
1\. 若平台是 Facebook：重視故事性與認同感，段落完整，文末給予暖心 CTA。  
2\. 若平台是 Instagram：首句必須是爆款標題，多用表情符號，段落清晰，文末附上 5-10 個相關的 Hashtags。  
3\. 若平台是 LINE OA：字數限制在 150 字內，前三行必須點出關鍵痛點或福利，結尾直接附上報名連結引導。  
4\. 若平台是 Threads：口語、幽默、有探討空間，像朋友之間的閒聊。

【輸出限制】：  
\- 直接輸出文案內容，不要包含任何「好的，這是為您生成的文案」等無關寒暄。  
\- 嚴禁使用品牌禁忌詞。

## **七、 非功能性需求與安全性 (Non-Functional & Security)**

1. **API Key 安全防護**：  
   * **絕對禁止**將 OpenAI 的 apiKey 或 Supabase 的 service\_role\_key 直接寫在前端代碼（如 App.jsx 或 index.html）中。  
   * 必須透過後端（如 Vercel Serverless Functions、Node.js Server 或 Supabase Edge Functions）進行中轉代理，確保金鑰隱藏在環境變數 .env 中。  
2. **API 錯誤防禦 (Graceful Degradation)**：  
   * 若 OpenAI API 發生延遲或超出額度限制（Quota Exceeded），系統不可崩潰。  
   * 前端應捕捉錯誤並顯示親切的提示訊息：「AI 小編可能去喝咖啡了，您可以先自行輸入文字，或稍後再試！」，同時自動啟用空白輸入框供小編手動創作。  
3. **無障礙與響應式設計 (RWD)**：  
   * 內容庫月曆在手機版上，應自動切換為「垂直排程清單 (List View)」，避免月曆表格在小螢幕上擠壓變形。

## **八、 導師陪跑：MVP 三階段開發建議（小白打怪指南）**

想把這個專案完美做出來，千萬不要想著一天之內全部寫完。我們像玩遊戲一樣，拆成三個階段來攻克：

### **🎯 第一階段：畫出骨架 (純前端 UI 搭建)**

* **任務**：先不串接任何 AI 和資料庫。  
* **成果**：用 React/Tailwind（或 HTML）把 Brand Studio 的表單、發文的輸入框、以及右側的手機預覽外框畫出來。  
* **驗證**：手動輸入文字時，預覽框能即時同步顯示，畫面看起來有模有樣。

### **🎯 第二階段：裝上記憶 (Supabase 資料庫對接)**

* **任務**：註冊 Supabase，創建 brands 和 posts 兩張表。  
* **成果**：寫程式讓小編在 Brand Studio 按下「儲存」時，資料能寫入 Supabase；重新整理網頁後，表單能自動抓取回原本存好的品牌設定。  
* **驗證**：在 Supabase 後台能看見小編儲存的資料，代表記憶成功！

### **🎯 第三階段：注入靈魂 (OpenAI AI 串接)**

* **任務**：寫一個簡單的後端路由或調用 API，把「品牌設定」+「今日主題」打包成 Prompt 送給 OpenAI。  
* **成果**：按下「產生貼文」，等 3 秒鐘，畫面上真的跳出 AI 為你量身打造的各平台文案。  
* **驗證**：拿去給身邊做社群的朋友試用，聽聽他們的讚嘆聲！

**祝開發順利！有任何程式碼實作、資料庫 SQL 語句或 API 串接的問題，隨時叫我，導師一直在這陪你！**

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAZCAYAAADe1WXtAAAAq0lEQVR4XmNgGAWjYGCBsrKyrLy8fLeCggIHuhzZQElJiR9o6GYg1kSXowjIycmVgzC6OMVAUVHRTEZGRgVdHA5ERUV5gN6RJBUDXfsISCcBDedEN5MBGOgVIAWkYqCB/4H4FVB/PLqZZAFxcXFuoIF9WF1JJmABGjgVSDOiS5ALWIDeXQjEHugSZAOgd6WBrtwsJSUlgi5HNjA2NmYFGizEQEWvj4JRQAAAAF1pKp6Jr3nrAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAWCAYAAACBtcG5AAACzUlEQVR4Xu2YT4iNYRTG75cUIcJ13b/f/afJBrlJCgthZWpqEjWKHQurWYyUvYXUZGeiSRYUZWU3iwlRiNTYkBoboiRTM9HE+D0z79Hba+ZSU4bP99Tpe89zzvdO5/nO++dOJpMiRYoU/yeiYrG4Jo7jfKPRWBcGPUSKk7eD8aIwaGi1WovJ2VqtVleFscSBQp9gj7DL2GvsZCYQByGq8PexEWwAewm1xc8BUaVSOUDsg5trFP96vV5fGeQlA3RcCRG6PF8dOAV3wjjXbRLtZqlUWioOUc7iv5Kolge3D24S6pj8ZrOZ1UeBH7ScRIHC9lLgl3hmKU5D4mHD2Wx2ufOHXTdt9HLy8UyXPi8UCmuZp8V4HLuNeEssD75T85mfNER0U9McdZYT77xxjN86ofLGSVgn6rgTrkfvIdwVyxFMVPsQiUa5XN6FAC9qtVpsnOuoucSbUndhp9qJ57+bKNBtqymuO545CD4jwHo/DvftV+LxvDBf8bTfug/RqXEYN+RyuWXt4gsGd82QIH24kTj5vyHepfmIR/wx3b7JuZFOcrirEsrPE4gd114d8n8FnFg/DhFXfFvx5rtstV2EHO/cwIZ0IzBO2wm4xTPn5y4IVJROy4BTsVNYr/N/OjA6OjpW4N/FJih8WzzHgeFiE8r3eR/6ELPF3So4g40xb78bv8O6w9w/DnenexYH1wsVKyHUTc7XBXqMr73Zy7Gryih7ZpHcnYwnsSF/qbklravK9BYwG1z+XPGIv7ubOe5hT7E94sKkhYD2ln6K32CE7XnYgMbidJXBf4MQg8bx3mm4cZ7b7V3iR+C+wh2Sr18WjO/ILCdRUIEU/JECL/LsxR5g5+yXhEFfHHuPXSP3MM8JxDqY8brAW2afsB7yHvIc8e+RiQM/v8oU2oUd1TIL4wYtL5bQfuXNdgoaNJ/E02GRafMPhBQpUqRI8W/gO0aM4sjEsh1kAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAABp0lEQVR4Xu2UO0sDQRSFd/EBoqAiS4zZ7CYhjWksFhQsxMJGfIAptLCxsvAP2Nn5BywsBAliJxYprCwk2PoDbCwiBKxsxFgoPr67zC7jsIkQQZscOOzeM+feubMzs5bVxb8il8uN+L4/WygUvCAI+szxJGSz2QkePbqWSqUGM5nMWCxQ9AzW4TG8gI+avyXw1eCz53lVnkcq/5VJV0OD67oDCDfFYtFROTar2IIzcZUWUMU/dTLRMkO2jNsEFbigJzmOMyTdw0ldNyEdw8DUQzAwKl0nGVQXK6auo21xCqThfZJBFd81dR1SPJ/PT+NdgofwwIo2WJYty++0OPtyia+Ob49JfJ7rxKdyYiyEKYKnTosngbwmbPz6sySBvAf40W5DbSkOy4auQzzySbd1UZqVXHnv5eUcLuoGdRSbCZPGUB5ZXbVUKvVHuuTBtzCQq8rGXHPthyMD8YYwipV2orpKRxrvNfTxKFYX8j2+ocp0C6/gJtyHL5bxz0Ar02VFCmjaDmyoieXq33naDQ0hPypOzpwqvvbtx/MDxCs5kssk8+Z4F3+HL6KQdjC9YxqsAAAAAElFTkSuQmCC>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAWCAYAAABtwKSvAAABfUlEQVR4Xu2WPUvEQBCGE+4URbGREOHusglcYzoJWFlYaOUHaGFjKdjbWCqWdmJhcWAh/gFrbaz9DRYKByK2Z6P48QxJYB0UQS5gjjwwbPadIZnJTjbrOBUVFX/BxWq24Pv+WKPRmLS1UuB53rgxphcEwQVjBzvFXlqt1qqO/fdkxXzYRmHLTrpi5UKKIflE66Vk4IqJomiW9lrCTrBjR20IpSH7Zu5YnT2KMowbzM9lR9OxP1CTlc1W97eXUNdC4VDMM9bFIu2zqOPvhGF40Gw2R6V4CtpHe2Jc0MG8KJ/YEa0XDgk9YO/fJZWDf1raMkmSIaVLuz46X1fJ5V671rwQXN7WDg/atkWSuTfpFr1i6zbiI2Zd64IUyn1vGLewTa4vGa90XF/Jvpdr+WHGcTyc6yZts1f0OTveRnzEzGg9hwIOZYWwHtdH7XZ7Qsf0HZJa5GFT+Vz6nwTeSnkCAJfkuxR0ZtKjzG1Q1hOAIIdKiljL+nte+ysqKgaPT3TaTOepp1dGAAAAAElFTkSuQmCC>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAWCAYAAAC2ew6NAAABdElEQVR4Xu2Uu0rEQBSGE3YFRUEsQpDc01kuQYRFsLETG7ewsLTzDazE0kasFCx8AK1txEIs9QXEBxDUVu28fAcTnBzSrCskQj74ycw/Z2f/uSSW1dLyf+h4nufHcbwURdGsHmwMhLtDD+gJfRJ4HdvWdbVCsB7qG/0+ekcDs65WHMeZItCVSNqFT/8NfYRhuGzW14nNMR8Q6Ih2tzAJ+SpXAH/1p7R+5C6W7qPspoQlaGb6TcOW3USnWZaN6cEKOrKgfFEdPVjg+75nGac2EkmSRFyFe3nqsQq6LOaY+l1CTLiuO0nYHbznqruNv0/tuPaHJk3TaSa7ZLJrPVYFtXPoUO863gp6tMq7K6e0ZfR/h/yZ7A46k8DiEXghP65K5EWjfk37giyC39/w3EQbtC+KeUeCibYlqBxhbsmxngRBMF8qNCDoIjU97Rcw557sLHqRL4seHxomGkTfL4/WLWFmdH0tGB98HVJ0/ieXv6WlpTl8AQ9yVM4cT6oGAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAABqklEQVR4Xu2UvUoDQRSFd1FBUPEHliDE3fysBAVR3EIQsbJQsBEECxufQhux8wVSK8HCxk7UTiRoFx/AVlshhUIsDFG/m50Nw5CsikFQcuGQveecO/fuZmYsqxP/IexkMunz22UKEkEQ9KCPe543m0qlhkw9CtHwzGcyGdfUJGzXdScxnWK6B6OmAX0VvgzOwaH4WGxQ9zDICPyJWkM84l3RDVMQNfAC3sFDs2ZwVYbZ4tGW3Pd9hwEK8raa5wzciqYom/yZurnIUw8KA4RKs2ZKu6CoV+fVcHmVysJveJcMTxGUdS62GfkmjY50TvHiLzqO00/9sOSyju6ROhlK52Kboe3ENKv7FX7ejDz/hWYT7Wp28FmzdDo93ZZmv/0ZW20QOS43uVxuoNUGgTv+VjO0BbjLRCLRp/OyCFrBCs9et+SefohDj2z9is7ZTL4MWQWPPM/oogR8DX4jyuX2IL/WbxHykslR99qok7dQE5monx+taBc88SZ7XvhZS+oebYQX7sg7cCUesI9/22px18ZGNpsdo3hdFjL/myjk+mJnLqpma6beib8TH9XVrcQLijE5AAAAAElFTkSuQmCC>