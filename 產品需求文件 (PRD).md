# **產品需求文件 (PRD) | 智慧產業數據管道與 AI 自動化驗證系統 MVP**

## **1\. 文件基本資訊**

* **產品名稱：** 智慧產業數據管道與 AI 自動化驗證系統 MVP (Smart-Data Pipeline & AI Harness System)  
* **文件版本：** v1.0  
* **建立日期：** 2026-06-24  
* **主要作者：** 資深軟體架構師 / 宣伯的技術導師  
* **目標讀者：** 宣伯（全棧獨立開發者）、技術面試官  
* **參考背景報告：** "2025-2026 台灣職場程式語言熱門度與薪資趨勢深度報告.md"

## **2\. 產品概述與背景 (Product Overview)**

### **2.1 背景說明**

邁入 2026 年，企業內部充斥著大量的非結構化數據（例如：精密製造工廠的機台異常日誌、醫療與長照機構的臨床生理監測與交班紀錄）。雖然隨著大型語言模型（LLM）的普及，處理代碼與文本的成本大幅降低，但企業在實際導入 AI 系統時面臨最大的痛點為：**「AI 容易產生幻覺、輸出格式不穩定，且產出的數據容易隨時間劣化」**。

為了能對接台中在地積極轉型的製造業與醫療長照體系，本產品旨在解決此痛點，提供一個穩定、安全且具備自動化校對機制的 AI 數據管道。

### **2.2 產品定位**

本產品是一款專為智慧製造與醫療長照場景設計的**輕量級自動化數據管道 (ETL)**。系統利用 Python 與 SQL 將原始數據進行清洗並存入關係型資料庫，隨後透過「上下文工程」串接 AI 進行深度摘要與異常預警，並最核心地導入「裝具工程 (Harness Engineering)」自動化驗證腳本，確保 AI 產出的資訊符合 ![][image1] 的商業邏輯與安全邊界。

## **3\. 產品核心目標 (Product Objectives)**

* **展現硬實力：** 證明開發者具備 2026 年市場採用率極高的 Python（採用率 ![][image2]）與 SQL（採用率 ![][image3]）完整整合與數據工程開發能力。  
* **落地裝具工程：** 在系統中建立「自動化驗證安全護欄」，證明自己不是只會寫簡單的 Prompt，而是具備控制 AI 品質、防範 AI 產出「熵爆炸」的架構化人才。  
* **解決在地痛點：** 作品具備高度靈活性，能直接套用於台中在地的精密機械設備監控或長照照護數據追蹤，解決企業轉型痛點，爭取市場上約 ![][image4] 至 ![][image5] 的「AI 溢價」高薪職缺。

## **4\. 系統架構與資料流 (Architecture & Data Flow)**

系統的資料處理管道（Data Pipeline）依循以下四個核心節點運行：

\[原始數據輸入 (.log/.csv)\]   
         │  
         ▼  
\[Python ETL 數據清洗\]   
         │  
         ▼  
\[寫入關係型資料庫 (SQL)\]   
         │  
         ▼  
\[AI 上下文編排 (Claude Sonnet API)\] ─── (參考 AGENTS.md / SPEC.md 規則)  
         │  
         ▼  
\[裝具工程 (Harness) 自動化驗證腳本\] ─── (不合規 ➔ 攔截並重試)  
         │  
         ▼  
\[最終結構化 JSON 輸出 / 前端展示\]

1. **數據輸入 (Ingestion)：** 模擬自動監控並讀取工廠/醫院的原始未結構化 .log 或 .csv 檔案。  
2. **數據清洗與儲存 (ETL & SQL)：** 使用 Python 清洗格式、排除雜訊與極端異常值，並穩定寫入關係型資料庫（SQL）儲存歷史紀錄。  
3. **AI 上下文編排 (Context & AI Orchestration)：** 撈取最新數據，結合系統維護的 SPEC.md 與 AGENTS.md 長期記憶背景，送至 Claude Sonnet API 進行異常分析與提取。  
4. **自動化驗證護欄 (Harness Engineering)：** 透過 Python 撰寫的自動化驗證腳本，強制對 AI 回傳的 JSON 格式與數值範圍進行校對，確保數據正確才輸出。

## **5\. 功能需求規格 (Functional Requirements)**

### **5.1 功能需求矩陣表**

| **功能群組** | **功能 ID** | **功能名稱** | **優先級** | **需求詳細描述** | **技術依據 / 備註** |

| **數據管道** | FR-001 | Python 自動化清理 (ETL) | **P0** | 系統需自動監控特定目錄，讀取未結構化文字，利用 Python 進行格式標準化、異常值濾除。 | Python 採用率 ![][image2]，數據處理首選。 |

| **數據管道** | FR-002 | SQL 結構化數據庫儲存 | **P0** | 清洗後的數據儲存至關係型資料庫，建立標準 Index，並提供高效的 SQL 查詢 API。 | SQL 採用率 ![][image3]，數據管理標準。 |

| **AI 整合** | FR-003 | 策略性上下文管理 (Context Eng.) | **P0** | 系統自動維護 AGENTS.md 背景規則，將業務指標與限制轉化為 AI 的運行背景，送至 Claude Sonnet API。 | 上下文工程管理，控制 LLM 長期記憶。 |

| **安全護欄** | FR-004 | 裝具工程自動化驗證 (Harness) | **P0** | **本專案核心！** 撰寫 Python 驗證腳本，強制檢查 AI 回傳的 JSON 欄位是否完備、數值是否異常。不合規即進行攔截與重試。 | 裝具工程思維，防止 AI 代碼與邏輯劣化。 |

| **安全護欄** | FR-005 | 三層邊界權限管控 (Boundary) | **P1** | 針對系統操作、Schema 修改與隱私資訊流向進行嚴格邊界管控。 | 導入 Always / Ask / Never 邏輯安全防範。 |

## **6\. 非功能性需求與邊界管控 (Non-Functional Requirements)**

### **6.1 三層邊界系統細則 (Three-Tier Boundary System)**

為確保系統在智慧醫療或精密製造場景運行的數據安全，核心架構必須實踐以下防護：

* **Always (始終執行)：** 數據清洗格式檢查、Linter 代碼語法驗證、以及 AI 輸出格式自動化校對校準。  
* **Ask (必須詢問)：** 當 AI 分析發現異常分數超過臨界點（例如臨界值 ![][image6] 分）、或偵測到需要修改關係型資料庫 Schema 時，系統必須暫停並彈出二次確認，由人工審查後方可執行。  
* **Never (嚴格禁止)：** 嚴禁系統將包含個人隱私資訊 (PII) 或企業未經授權的敏感原始 Log 傳送至外部公共模型，防範資安洩漏。

### **6.2 系統性能與現代開發工具鏈**

* **輕量高效依賴管理：** 本專案的環境與套件管理必須採用由 Rust 編寫的 **uv 工具鏈**（其在 2026 年的開發者喜愛度達 ![][image7]），利用其極速特性確保開發敏捷性。  
* **可容器化部署與擴充：** 系統必須完整支援 **Docker** 容器化打包，確保在任何測試環境下（不論是開發本地、面試官電腦或雲端伺服器）都能一鍵編排運行，並能無縫對接 **Airflow** 自動化調度。

## **7\. MVP 開發實作時程表 (Sprint Milestones)**

* **Week 1 (ETL 與數據儲存)：**  
  * 使用 uv 初始化專案環境。  
  * 撰寫 Python 清洗腳本，讀取模擬的產業原始數據。  
  * 設計基礎 SQL Schema 並成功實作寫入。  
* **Week 2 (AI 整合與上下文編編)：**  
  * 串接 Claude Sonnet API。  
  * 撰寫系統提示詞與 SPEC.md、AGENTS.md。  
  * 建立結構化 JSON 輸出機制。  
* **Week 3 (裝具工程防護)：**  
  * 撰寫核心 Harness 驗證腳本。  
  * 刻意給予極端或錯誤數據，測試系統自動攔截、重新呼叫 API、以及修正 AI 幻覺與格式錯誤的功能。  
* **Week 4 (容器化與展示交付)：**  
  * 利用 Docker 封裝整個數據管道系統。  
  * 撰寫遵循「Cake 三步驟法則」的精美 GitHub Readme，準備進行成果展示。

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAZCAYAAAB3oa15AAAC6ElEQVR4Xu2WTaiMURjH32muIoQYw3y985GmG4VmIfKxQVmwGQtlYUmyoi5KNpY2uiXlI1kpSSwupVtk7gYLKymxIJJuEjUWxPX7z5xz75lz574zt7sYZf71dM7zf57z8Tzvc855g6CP/xiJRGJRoVBIViqVeb7NRblcXuxzPUcYhmeQt8gd5Llvt8C2Ban5fCRKpVLW51zk8/mlmUxmTVTmWHQ1spm5VqLG2ti/ZLPZderTbsvlcmfT6fRya08mkwtZ5xR+37DvmxoZAX1OBpxHfvo2gQlXmYx9pn9Pm0COYYp7fjvgXyCXTfvStReLxSVwo9qkoQbQhwniKe1H2vcS+uPMdSFokwAfcWVVNcmgx8iE74D9gHjkoMPNRx9BPhhKG7mJfLI+AvqgeNmls7kKY2+4PnAnXR3/Gj6bXK4jogIwG/3FQls9ftj6m43qq7TUdCqVWqGgGFuUrtYPIHQSAwbwGQq6yHwLOgTwDqkrey6vzFl/+nvV1xyuj5lX/B7pnJ8F9Gv2dpHdngcBW1VlZvWu0SGAelQAKifbnykAfA5bzsxXpRsz2W6UFz55nQXrNyvMJQCN7RSAX+c+2PsR/K7pdpPQPxE2S3I86KacehkA9o3IGDdhaPRzBPRausqpq6u0xwHoklBJWf2r649+W2fH6m3RIYA5H2LZXd6BzsGlwJwDwfdHf8BDl7F6W3QIYBT5w6Q7Pf6q9edzr6f/PfQeLvNAqpYHXd5CL7F5sSfhB0D/rp+8aVC9hc2Xc8L/TVD08K+oyyf2itNDA1fPN1/LBlSrcL+DqUMXw36axXdZHwd6+C7mmrdQC5Qs79a6j98y12cSzj09TdwsMOEGuDe0z2iPh806ve78Eggx+KPIFWz71SI/xDs+DcBXkZF2dz5rPMR2yyRSJTbj+ZkVNCFfars2F/XTp8DZxCF8d3sBNmC+6CP81vo2wdjHkJqkXZC9RryL//y4zoZ/Pvroo48+/h38BWe6CHYZVS0cAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAADfklEQVR4Xu1WTUhUURR+gxZFRX/YJDPOndGF6M6GCqLARUH2B1rRwmVQGyEisE1EEG0jDCOEChdREZWLXCUYuIgIbOWmgjRGokVJkRKFTt/nO9eOZ54zI21czAcf791zzr33nHvPPfcGQQUV/BfS6fQa51wtv1anUNXY2LjBClcsEFAHmENQj/AdtXpBLJVKdUPfi/9qq7SIgVVaEI/H1yUSia2+jcnSGPBcMplcq+2WAwyxCQ7twBiJbDa7yuqh+wKbg2K7G/Nd1j6IzS1wDPKklkeipqZmPYx/YqABfPvAO+Dvurq6Y94G7TYwD85yVWH7SROyET2mBYLZApspONyP71vwvbWBbAKslWY1/nsw9mt8J2WOSfC79qsoJDAGRHKwo9aGcrAXuhMkHGylE/g/SUeLrSBsr8Amr2VoN4EPAkkn8eElv94GY19c6BDM92kpNk8BOBgGyVq5Bga9i5XaqWWcBPJXTBst18C4m2HzJiKwWnCcack2Ux/tEV0U0O70/xL4c98uC2UGdppnRMvQ5zbYHYRnNBISAFMsKrA59N+vZDm/IzzL2ifoLriwYJQPBpbJZHah42EXHs6ewBSTKMDuSaliUiKwPNihZOOyUFVYxFO+wEDeAo4sKw0J2ebjWiaTXg2idyOGiW/o81AMPCs2MFY/yuw5Migo7fi/D06Bo2CTsS8NdJoGc2AmQpehzsqXQn19/UbYDyErnG/D4YcMDAGetfYekkULO8XsQLuPO4nvHnDY9ikJdPrszBlQui46ZeXFIOV+JhWW7TGwk2OAbdbWA7pBXdq5y+i/V5ox6G96XRSYVufR4YwWOjkXKVP60+GTZ3C5gRHsKxcuneIZ++qWTifaLHpdoH1NFxTr2yL4+wNGA83Nzau93IWp+Eet0DykxDNFp7W8GKTCHdAyXh1O3WMWTENbLLAw/SawRb4VgJOi03bfllyejbrh3b8XSGRgnFz0E17mwjdg3ldQOTvfgiUKkxSM61bB86jv0lTxwjMPbjsfn3SKz6kP6HSEcmvIMwf9HPjD6ggJ4hfs7nmZFI8XLnzZPAZnwEu6n4cEPdzQ0LDN6iRbusQOv27I2hSAuQ/DdrATAbZavYdUpEM6JcqB9GPBaLcPWw85Fs+wK/uszgP6j+BT+PjOmStqJSMmT6qCTPHgAmG34uXeoRVUUEEFFRB/ATWo8t7R3AiYAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAADu0lEQVR4Xu1WS0iVQRS+Fy2KXlCZ+bpz71WQrI3cHiBF0QOEHtADKly0q6A2FdkuKHERQQujBCmipEURalQ7ycoWtbGVBFGUYYRERJFShtn3+Z+5nnv80xttXNwPDjNzHjPnnJk5M5FIDjn8F+Lx+CznXBFbK1PIq6ysnGeZ0xYIaBeoH0HdQttj5YJoLBarh/wS+vlWaBEF5WlGYWHhnJKSkkWaJ4iWl5cvweLrI8YmG3AnysrKVpCsDM4OQF4remsQwGnrA3Qug3rBL9X8UBQUFMyF8ndM1IG2BXQVNIzFd2g9LBYH/ynohej1gzZqnckA3SbOi2nukjD/SiPvAxXJMJ/68Ok52g9o37MFfbV+/RUSGB0lcbLtVgeO7IOsi7qKzcXvgK4oXhjyMWczKOUZ6J+CXW9xcfFijsWHR3p+6vg+AXl1Vjvlwcn0omEQR14mEolCzUfA10maZ8G5YTvIY+h56C8Ff5Mf8+hDp1sXBYzrfF8Cv+/HWSGbwDDpcdAoqNNnjUEy63DysNXXgE4jbS3fAjr9fu7S0tLZ2ifITrigYGQPBgYnV8NwqwsuZ1PEFAYsshz8TxLcMOgkqBV02xzPDMhOdIodnXsLGsJ8j60u+O/Ar0c3D8nam0qlZgi/GtT9T8eQkG3erXniSEMkqJhjYBbBOwv6KfIROuIdCAN0ilxQFEZp7/mwS4L3LJlMLtD6BhNKO/o3QV9APaBlRn9qwGjQBVUvwTGcWoj+Q1BrRUXFfGR0P50lSZbTCdBwKrAQ/m/YbtZ8DTlF6Z2SxLYwkWhrQF3WZkrA6KNeGG0zgnmiMwx5mwQ3ACcqx63HIffwjQ1MTgmTklH5NCB/oEs71q+F/loZRiG/6GVhiMLgGAwOaqaTLMek9KP/2akqRUjm+ESk9Sz0HdP8LAKj4xm/C4wbY5lPRuiaY/DvB5Q6qqqqZnq+C47iL58hjsMmQkZXuaAYTJB50CEbGN8v8pxJlgePoS0WfFZMYH73wgGFLXxX/FjO8og+Bhg3uODS1ig9f+/SRYaLi8N9So/z3YMs7nmserHwu+kLxgXDp80hJtKPJ9ntNLjt/HzSKX6nXsNoG/leQZw7z4BB7aAjoG+wOaerogs+sj9gf83zCCaOwaI9g/YGaCismkrB6OJ/1Mq4g5AdFT10XafVmQB+NqG4E1SHxTdYuQeLAY8ddA6wb+WTgceI86PdA8fLrFyuRTt2ZZ2VebjgHWzD+q+ceaKmM6LypbLHMw3uMhM62acghxxyyCEHiz+HdQ3AUfk85QAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAAC5ElEQVR4Xu2Vy2tTQRTGc0mFiooPjKF53TwWoSg+CCriQhAVXFiEIooI/hGCYvduxYUiFFEURGhRXFhx4aJYEMGFKBbFB6iLCooIhWTZ+vtyZ5LJ9MaWQqGLfHCY85x7HjNzE4keVgmKxeImlqSvd4FPv69bMdRqtTWFQuFmGIZvobFcLrfF9xHK5fJG7BO+Pg7JbDabo4pDBAz4RgdBpVLZhs+BRExH0F+ApkulUpq9LsN/YT2phI1LgG0n+jcqoCM4Djh+hGagX9A8m51GHbg+6IrYXkLvoVHoM6rd1p7JZLYqKXR3JfPhMvIkdF0JIv9g/Yn9HesHNaK9+0IECiTooKtUcgpW5Y5uDr8jjjwI/VE8YoCtBl9nvSR7KpVaD/9YeidGHb0B22d1sVCwqWpSvNUjN9xEjJ+SGHR8BqDv0LS6RRG74GehEdmr1eoG+DF1zvjvgaYW65RFQGuvmXm3qmCDOjSP/oRkMxYl0Tp/TlHqUs0c6FfQfcxBPp/fAf/QFgz/BN2QjV8KdJY6zhObzNkPSjZj6pZYqwD4s9BvurePdRT9OWfPxUf4P9DB/dAnNg+tTh9eSmJx8J8GurY3jJ6Tv+l0ep3r2xVKxk9KYJPjy0xMl+Ki6ZYK3F6IbucwYpL1qnw6QzyYyp6T2AvfttRR+jAjtQe++QJAr/HfLDvrM+SSF9aGHsAwepvGlaB0Gikvd1Z83OE3t24Kamg8Vm9hR2gPvJJRUirGuRC3Cs4TtADF6JUeJZG1RtWHfNt+0Gw6qyfBxihJk+w3W4ALZ4TNA+/4u4ld6dZtGYfD6EH1qdVy4zeDfMf+XkwxdXW2vVsEdQvfo64Ov378J6ApdVs6+PHQeRtbcM9JDE1oM+uLfDiMflkP0J9hbfDxU4mFh7d54GP0upFDxM3ojZMMf8/5jy4fut6M8xiJne921cPohX/q6w2SZsRfoUf+7V9RqAPdkrbQpErOf7iHHnpY7fgH9pHkV/7Dmx0AAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAADBElEQVR4Xu2Vy2tUMRTG5zIKiorPOnQeNzNTZSiKDwYVF26KCi6sBRFEBf8BVxUquncligtFLIooiFBRXFhx4aJQUKGgKBbBB6gLBUUKhSm4sf19cxOb3t6xVSh0MR8ccvLlJDk55yRJpZqYJygWiyto0nHeBzaL4tycoVqtLgzD8Iox5hXSl8/nV8VthHK5vJzx/jifhCCXy63GuLWtrW1tfNBDoHHsdqYSIgJ/EhkulUoZInIa/QNtlxy2JgFjm+Bf6gBTJicBwxfIEHId+YycSMU2ZoMi/FPkDdKLvIfa4saz2ewaOQV3U302LtMfQC7JQfpfaL8x/pr2LYHIT66eACbsx3CkUChsdBz9ceRJJpNZ4nG/sd3t9duRn9qYbsBYFb1Ge0rjLS0tS9EfiPfmKKKXURc4riG0Gca/TJSeOqxjA1pcfbXWiXbPptVE0R1WtEjRZvRR5IzGK5XKMvQ+Rc7ab0UGZ4yUh4AiXec66IutY+cdZ9MiJ1odZ51VqhSlqi3o58hthgNlAP2eOxz6Q7hON/+fweRd1ME7ImAcZ9PUyLFxlYM49CPID+Zup+2FP+bszWxT6EPXGmcOMPkoiz2m7YAO3LitwxkdS0L8aeDg20z0nIz4NTwjdLXtZj0p6xz9ff/pmC5Fj42WDrghjG7nQbpp2guymTrlL9BmxrsQs01lHDalruADEz0dQ9iv1LjNTik2LYI2062KcTXrXLf6YULx21s3iIwpPZOzI7gUuoKXM3LKeLcd/VroPUF/YF975bvf/7u0mRwL7ZtkFx3Vk+DZuOfiEzWac7yDl8J6wXv2vmNnG0U7wKGLLLzeEa7GkF7vK9EiX1nkhuPsl1Oj3eFsHBQtbPf4nA6OfT8yqGiLQ79rvLdxCmzIR5h4lbYbeYac03vm28F1IN+RO9geph1j80Op6cVbL/gEXjeyUwd0vwz6Lf/w08DHXGCzLuR4o9AKut6kc6/sGl11E73wj+K8Rdqm+CNy338r5xyKQCOnHVRjOJWJ80000cR8xQS+7uCtdci9igAAAABJRU5ErkJggg==>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAZCAYAAADe1WXtAAABr0lEQVR4Xu2TP0vDUBTFU1RQVFS0ljZtkrZC6aQYVFwURASHDhYEoYOj38Cikx/CyUWcCorfQRBcHFzsogjqICiIINSx9XfTl/CMpdChWw8c3rvnnnvz/sUweugqHMcZt217PplMmuGchkg2m53Gt8y8L5z8A0zn8IvGZ4x3jKthD5pD7gbewxP4iDQX9nkgcYThUNeIP2GFab+m1S3LWtfivPIdE0Z83cA0gXgLS4FoeAUv8Nk/img0OqIa5DVPXPmqiURiSi/2EjQvBGJTF3OwMsaM0uK+R33oCtbIu3pxu6YNWJRYito0bYTrpaBs/z/TujKXlafQUdNMJjPGZT2k02nbjzG+ixl9TzTmmx01FZCowB+Sr4xV+CRmaSb5jrfvg1UNmqY5yTSiGgS33eqicrncKPG1LCaVSi0EjQQ8myE4o2titLV3ajWf3jdHNKt5/CcVPL0AiEV4Kc0lpnCRJvuG/qCbvjf0U9d1ByRmZwdoNcYl3edBXYxsQ369C1mlX6gDfQ1+yA5otCM+PrJthD4egNWtYCrBLXWuLRGLxYbxbtB0V+bhfA89dAG/pGaGh2ICkJ4AAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAZCAYAAAB6v90+AAADR0lEQVR4Xu2Wu2tUQRTGd9kIiooRiWvYzd7dpAgpRMKigg9sVGKhhREE8wfEIpWCooUgklKR+EBSKBYWoqiFsTEQMY2ipBBFEUQjUVAQURRsjP4+74zMntxNNhEkxX5wmJnzPvfMzJ1Uqo46/gnFYnFhFEXNGq0sQKa9vX2pZc5bUNBuaIKirjKOWblDulAoHEJ+jnmDFVYAR425XG6F5c8EnPdAOyy/GoiRJ9YWdYRlxsrhf0DepTnjego4ZvNC5zz0TL5CfiJKpdIalH9B73H2NiQCPMnn86utjYD+d3QOW34SWlpa1so/9NHF+gI7HerAG3dFCw3MB/D/kPGdctEoO3ztCu2qguR7Mdwjosjt+hrMN+LkBdRp9UEamyNKsIbC0uidhR6HTNZ90HPiZbVuampawvqeRq9jfSuXmjrlgUF/Am+I5PdavkAy65DfqaUwn7B0w6RdByex36p1NptdzHo0vBRY9/i583Pbr2sCBvsMSwf0QrlcXmD4qdbW1mXIbpHY5loKS8XdPS3dVHDYsSs7+52ex3rCd4Ttv0g6gexgFF8Yc4cObltb20rLT7kbCflxzWssTEjb61mdiuIzGib/Rv6ZZrRb/IeF36luzmobWuBwP05eWb7fCgTe5nmzKKwC+nAqii0dWZnBlKud+RXoMzQGdRj9ZGibofwAum5lUbwVTqWCm2wuhakYCnuJ7VMrs3Bn+W+ntD1ZD6qTjBugEWuTCAJ2oTwJHbUyeHft9pxtYe7DDRPnPrTKyi3QHQqvduVHvE1uqaNwxsumBYoDShY6kCD7VjD/OKf7hx/F3ZwW6AxC11Sg1tqSdCFn9RyUeMXrgnV/eCYLwcVTFTrcGI4q2SQD+M0JpMJOaE6SjdbGIKPCtJ08g/VFXfuhkoe2ob0siHHZFOa7Vx2l+PXxtVphFsX4sarCToa/BQV3/HHPY94N/XT8kB4Ra7nXc/AXxpQdgO/e8EPUdAxw1AF9cgGrvv/CH25IKkjyKH7I/iDopen0HekRUPGKdxfGiD3PgjqIrM/pMY2GrU4S0vrpFuKXwJQH6v+A+wg3lYeVeSB/Dd0oxjdrt5XPV/gfecXjOIS2Pd3Khs+zOuqoo446ZsJvYgf4YGX4UV4AAAAASUVORK5CYII=>