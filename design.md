# 蝦皮購物 (Shopee Taiwan) 官方網站設計系統與介面規範 (Design System & UI/UX Specifications)

本文件整理並分析了**蝦皮購物官方網站 (https://shopee.tw/)** 的 UI/UX 設計系統、視覺風格、色彩計畫、字體排版、版面佈局及核心組件規範，以作為設計與前端開發的參考指南。

---

## 1. 設計理念與風格 (Design Philosophy & Style)

蝦皮購物的設計語言核心為 **「簡單 (Simple)、快樂 (Happy)、共同 (Together)」**。
*   **高資訊密度 (High Density):** 作為典型亞洲大型電商平台，介面強調「商品即內容」，以極高的資訊密度呈現，讓使用者能在單一畫面上快速瀏覽多個品項。
*   **模組化設計 (Modular Grid):** 網頁由可重用的卡片（Card）、列表（List）與區塊（Section）構成，便於營運團隊因應不同的節慶與促銷活動（如雙 11、618）進行即時版面佈置。
*   **直觀的促銷導向 (Promotion-Driven):** 運用強烈的色彩對比（如經典蝦皮橘與亮黃、紅色標籤）和倒數計時等動態元素，營造搶購氣氛，激發消費者的購買慾望。

---

## 2. 色彩計畫 (Color Palette)

蝦皮的色彩規範以「蝦皮橘」為核心，並搭配輔助色與狀態色，以維持品牌一致性與清晰的介面層級。

### 核心品牌色 (Brand Colors)
| 顏色名稱 | 視覺預覽 | 十六進位色碼 (Hex) | RGB 數值 | 應用場景 |
| :--- | :--- | :--- | :--- | :--- |
| **蝦皮橘 (Shopee Orange)** | <span style="color:#EE4D2D; font-size: 20px;">■</span> | `#EE4D2D` | `rgb(238, 77, 45)` | 品牌主調、主要按鈕（如：立即購買、搜尋）、價格文字、高亮選取狀態。 |
| **漸層橘 (Shopee Gradient)** | `#F53D2D` 到 `#FF6633` | 漸層色 | 促銷 Banner 背景、重大活動視覺設計，使整體視覺顯得輕盈流暢。 |

### 功能與輔助色 (Functional & Secondary Colors)
| 顏色名稱 | 視覺預覽 | 十六進位色碼 (Hex) | 應用場景 |
| :--- | :--- | :--- | :--- |
| **商城紅 (Shopee Mall Red)** | <span style="color:#D0011B; font-size: 20px;">■</span> | `#D0011B` | 蝦皮商城相關標籤（Mall）、商城專屬字樣、正品保障提示。 |
| **促銷黃 (Promo Yellow)** | <span style="color:#FFD100; font-size: 20px;">■</span> | `#FFD100` | 折扣比例背景標籤（如：30% OFF）、限時特賣搶購進度條背景。 |
| **優選橘/黃 (Preferred Tag)** | <span style="color:#F69113; font-size: 20px;">■</span> | `#F69113` | 「蝦皮優選 (Preferred)」與「蝦皮優選+」卡片標籤。 |
| **連結藍 (Link Blue)** | <span style="color:#0055AA; font-size: 20px;">■</span> | `#0055AA` | 頁尾文字連結、部分輔助提示連結。 |

### 中性色 (Neutral Colors - 背景與文字)
| 顏色名稱 | 視覺預覽 | 十六進位色碼 (Hex) | 應用場景 |
| :--- | :--- | :--- | :--- |
| **網頁底色 (Light Gray BG)** | <span style="color:#F5F5F5; font-size: 20px;">■</span> | `#F5F5F5` | 整體網站背景，以襯托白色的商品卡片與內容區塊。 |
| **區塊底色 (White BG)** | <span style="color:#FFFFFF; font-size: 20px;">■</span> | `#FFFFFF` | 商品卡片背景、主要內容區塊、搜尋框背景。 |
| **主要文字 (Dark Gray)** | <span style="color:#212121; font-size: 20px;">■</span> | `#212121` | 主要商品名稱、文章標題、主文字。 |
| **次要文字 (Medium Gray)** | <span style="color:#757575; font-size: 20px;">■</span> | `#757575` | 銷量、商品分類標題、次要文字、未選取選單。 |
| **輔助文字/框線 (Light Gray)** | <span style="color:#00000022; font-size: 20px;">■</span> | `#E8E8E8` / `#00000014` | 卡片框線、分隔線、輸入框預設邊框。 |

---

## 3. 字體排版規範 (Typography)

蝦皮網頁版使用系統預設的無襯線字體，確保在各平台上的流暢閱讀體驗。

*   **字型家族 (Font Family):**
    ```css
    font-family: "Helvetica Neue", Helvetica, Arial, 文泉驛正黑, "WenQuanYi Zen Hei", "Hiragino Sans GB", "儷黑 Pro", "LiHei Pro", "Heiti TC", 微軟正黑體, "Microsoft JhengHei", sans-serif;
    ```
*   **字重設定 (Font Weight):**
    *   **Regular (400):** 用於商品名稱描述、銷量展示、一般說明。
    *   **Medium (500):** 用於子標題、導覽列選單。
    *   **Bold (700):** 用於價格、主要標題、強調字樣。

### 文字層級樣式 (Text Styles)
| 層級名稱 | 字型大小 (Font Size) | 字重 (Weight) | 應用場景 |
| :--- | :--- | :--- | :--- |
| **H1 (首頁大標/強促銷)** | `24px` - `28px` | Bold (700) | 特殊活動大標、彈出廣告主體標題。 |
| **H2 (區塊大標)** | `18px` - `20px` | Medium (500) | 「限時特賣」、「每日新發現」、「分類」等區塊標題。 |
| **Body (商品標題)** | `14px` | Regular (400) | 商品卡片內的主標題（最大兩行限制，超出以 `...` 截斷）。 |
| **Price (主要價格)** | `16px` - `20px` | Bold (700) | 商品售價（蝦皮橘色，帶 `$` 符號）。 |
| **Sub (次要說明/銷量)** | `12px` | Regular (400) | 「已售出 X 件」、商品產地、頁尾說明。 |
| **Tag (標籤文字)** | `10px` | Regular (400) / Bold | 卡片上的促銷標籤（如：免運、蝦皮優選、10%蝦幣回饋）。 |

---

## 4. 版面佈局與網格系統 (Layout & Grid System)

網頁版設計採用固定寬度與響應式格狀佈局相結合的方式：

*   **最大容器寬度 (Max Container Width):** 桌面端核心內容區域固定為 **`1200px`**，在超寬螢幕下水平置中，防止內容拉伸影響閱讀。
*   **網格間距 (Gutter & Spacing):** 採用以 **`8px` 為基礎的網格系統**：
    *   卡片間距：`10px` 或 `12px`
    *   區塊與區塊垂直間距：`20px`
    *   內邊距 (Padding)：常用的有 `8px`、`12px`、`16px`、`24px`
*   **欄位配置 (Desktop Grid):**
    *   **每日新發現 (Daily Discover):** 採 **6 欄佈局**（一行展示 6 張商品卡片，單卡寬度約為 `190px`）。
    *   **分類 (Categories):** 採 **10 欄佈局**（兩行共 20 個分類圓角正方形圖示）。
    *   **限時特賣 (Flash Sale):** 採 **6 欄佈局**，並可橫向滑動或點擊換頁。

---

## 5. 核心 UI 組件規範 (Core Components)

### 5.1 頁頭導覽 (Global Header)
整個頁頭為網站的最核心導覽，固定於最上方，主要分為兩層：
1.  **頂部公用列 (Top Navigation Bar - 高度約 `34px`):**
    *   **背景色:** 蝦皮橘色 (`#ee4d2d`)。
    *   **左側:** 賣家中心、開始賣東西、下載、追蹤我們（社群連結）。
    *   **右側:** 通知總覽、說明中心、繁體中文（切換語系）、會員名稱/註冊登入。
2.  **搜尋列區塊 (Search Bar Section - 高度約 `85px`):**
    *   **背景色:** 蝦皮橘色 (`#ee4d2d`)。
    *   **左側:** 蝦皮購物白色 Logo（購物袋與字樣）。
    *   **中間:** 寬大的白色背景搜尋框，內置蝦皮橘色放大鏡搜尋按鈕。搜尋框下方附帶一排當下熱搜的關鍵字連結（如：iPhone 15、Switch、免運）。
    *   **右側:** 購物車圖示，滑鼠懸浮時會展開購物車預覽卡片，右上角帶有顯眼的白色字體、紅色底圓形 Badge 顯示購物車數量。

### 5.2 輪播與橫幅 (Hero Banner Carousel)
*   **左側大輪播 (佔 65% 寬度):** 自動播放的促銷橫幅。
    *   圖片尺寸比例：通常為 `800 x 400`。
    *   下方有小圓點（Dot Indicators）標示目前頁數，左右有半透明灰色圓形切換按鈕。
*   **右側雙橫幅 (佔 35% 寬度):** 上下堆疊的兩張靜態促銷圖。
    *   圖片尺寸比例：通常為 `400 x 195`。

### 5.3 分類網格 (Categories Grid)
*   **背景色:** 白色。
*   **外框:** 細灰色邊框。
*   **內容:** 一格一格正方形，內含圓形圖示（Icon）與下方一行類別文字。滑鼠懸浮時會有些微的陰影上升效果。

### 5.4 限時特賣組件 (Flash Sale Component)
*   **標題列:** 包含「限時特賣」Logo、倒數計時器（時、分、秒以黑色底、白色字呈現，中間以冒號分隔）與右側的「查看全部 >」連結。
*   **卡片設計:**
    *   右上角標示黃色折角「折價標籤」（如：-50%）。
    *   下方有蝦皮橘色的促銷價格。
    *   **搶購進度條:** 一個高度為 `12px` 的灰色膠囊型背景條，內部覆蓋橘紅色/火紅色的已搶購進度，並疊加「快搶光了」或「已售出 XX%」的白色微型文字。

### 5.5 商城組件 (Shopee Mall Showcase)
*   **紅色商城標誌:** 使用 `#D0011B` 展現高品質形象。
*   左側有大型品牌廣告橫幅，右側為精選商城品牌卡片或商城特價商品。

### 5.6 商品卡片組件 (Product Card)
這是全站最核心的組件，承載著極高的點擊轉換任務。
*   **結構:**
    *   **圖片區 (1:1 比例):**
        *   頂部左上角常有「蝦皮優選 (Preferred)」橘色標籤，或「商城 (Mall)」紅色標籤。
        *   頂部右上角有黃色「折價標籤」（如：`50% 折`）。
        *   底部可能會有「免運費」、「24h」等半透明微型 Overlay 標籤。
    *   **內容區 (文字高度約 `80px`):**
        *   **商品名稱:** 最多顯示 2 行（通常設定為 `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;`），字體大小為 `12px`，顏色為灰色或深灰色。
        *   **促銷標籤列:** 商品名稱下方常會有一排彩色的外框標籤（如：`10%回饋`、`滿199免運`），字體通常為 `10px` 紅色或橘色。
        *   **價格列:** 商品售價以蝦皮橘色呈現，價格字體較大且粗。
        *   **評分與銷售額:** 「已售出 4.2k」等文字，靠右對齊或置於價格下方，字體小且為灰色，與價格形成對比。
        *   **所在地點:** 位於卡片最底部，如「新北市板橋區」或「海外」，幫助買家評估運送時間。

---

## 6. 微交互與狀態規範 (Micro-interactions & States)

為提供流暢的電商操作體驗，設計系統中包含了細緻的狀態轉變：

*   **滑鼠懸浮 (Hover States):**
    *   **商品卡片 (Product Card Hover):** 當滑鼠移至商品卡片上時，卡片會輕微向上平移 `1px` 到 `2px`，並在卡片四周產生淡淡的投影（box-shadow），讓卡片在畫面上「浮起來」，同時商品標題顏色可能轉變為蝦皮橘色。
    *   **按鈕 (Button Hover):** 蝦皮橘背景的按鈕在懸浮時，背景色會稍微變深（如變為 `#d73f22`），或者透明度稍降。
    *   **文字連結 (Link Hover):** 下方搜尋詞、頁尾連結懸浮時，會從原本的灰色/黑色轉變為蝦皮橘色。
*   **骨架屏 (Skeleton Screens / Shimmer Effects):**
    *   在加載大量商品卡片（如無限滾動或切換分類）時，會先展示帶有淡灰色漸層閃爍動畫的卡片骨架，而非傳統的 loading 轉圈，提升感官速度。
*   **購物車動態 (Cart Badge Animation):**
    *   點擊「加入購物車」時，右上角的購物車數量 Badge 會產生短暫的縮放抖動動畫（Scale Zoom In/Out），提供明確的反饋。

---

## 7. 響應式與適配性設計 (Responsive & Adaptive Design)

*   **桌面端與行動端分離策略:** 蝦皮針對 PC 端和 App/行動瀏覽器端採用了不同的佈局邏輯。PC 端著重於大螢幕下的 1200px 多欄位展示；行動瀏覽器則注重單欄或雙欄商品瀑布流，並優化了手指滑動的手勢操作（Gestures）。
*   **行動端 (Mobile Web / App Layout):**
    *   **頂部:** 簡化為極簡搜尋欄與右側聊天/購物車圖示。
    *   **主體:** 瀑布流（2 欄商品卡片），方便單手滑動。
    *   **底部:** 固定式的 Tab 導覽列（首頁、直播、聊聊、通知、我的）。

---

## 8. CSS 設計系統實踐（模擬變數）

在實作蝦皮風格的介面時，建議定義以下 CSS 自訂屬性（Variables）：

```css
:root {
  /* 品牌色 */
  --shopee-orange: #ee4d2d;
  --shopee-orange-hover: #d73f22;
  --shopee-mall-red: #d0011b;
  --shopee-promo-yellow: #ffd100;
  --shopee-preferred-orange: #f69113;

  /* 文字顏色 */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-placeholder: #0000003c;
  
  /* 背景與框線 */
  --bg-main: #f5f5f5;
  --bg-card: #ffffff;
  --border-color: rgba(0, 0, 0, 0.09);
  
  /* 陰影 */
  --shadow-hover: 0 1px 20px 0 rgba(0, 0, 0, 0.05);
  
  /* 字體大小 */
  --font-xs: 10px;
  --font-sm: 12px;
  --font-md: 14px;
  --font-lg: 16px;
  --font-xl: 20px;
  
  /* 佈局 */
  --container-width: 1200px;
  --border-radius-sm: 2px;
  --border-radius-md: 4px;
  --transition-normal: all 0.2s ease;
}
```

---

*本文件基於對蝦皮台灣 (Shopee Taiwan) 官方網站設計特徵的分析編寫。版權與商標歸蝦皮購物所有。*
