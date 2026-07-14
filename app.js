// Shopee AI Social Scheduler - Application Logic

// Global Error Catching for Troubleshooting
window.onerror = function(message, source, lineno, colno, error) {
  const errMsg = `系統發生錯誤: ${message} (於 ${source}:${lineno})`;
  console.error(errMsg, error);
  if (typeof showToast === 'function') {
    showToast(errMsg, "error");
  } else {
    alert(errMsg);
  }
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  const errMsg = `異步操作失敗: ${event.reason}`;
  console.error(errMsg);
  if (typeof showToast === 'function') {
    showToast(errMsg, "error");
  } else {
    alert(errMsg);
  }
});

// ==========================================
// 1. Initial State & Configuration
// ==========================================

let brandSettings = {
  name: "小林手作烘焙",
  color: "#EE4D2D",
  ta: "20-40 歲，熱愛下午茶、講究健康低糖的上班族與年輕媽媽",
  tones: ["溫暖親切"],
  forbidden: ["最便宜", "絕無僅有", "買一送一"]
};

let appSettings = {
  mode: "mock", // "mock" or "api"
  provider: "openai", // "openai" or "openrouter"
  apiKey: "",
  openrouterKey: "",
  model: "gpt-4o-mini",
  supabaseUrl: "https://czpvcbelvqatyakmvwey.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6cHZjYmVsdnFhdHlha212d2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MTQyOTUsImV4cCI6MjA5OTQ5MDI5NX0.oeN1s3XXDjA-cIFOmi5e7DYiXdhdoavumgljFNGISgo"
};

let posts = [];
let activeScreen = "library";
let activePreviewPlatform = "shopee_feed";
let generatedCopies = {};
let currentMonth = new Date(2026, 6, 1); // July 2026

let supabaseClient = null;

// Default pre-seeded posts (July 2026) to make the app feel alive instantly
const seedPosts = [
  {
    id: "seed-shopee",
    brand_id: "default",
    platform: "shopee_feed",
    content: "🧡【小林手作烘焙 ✨ 蝦皮限時新品首發】🧡\n\n大人的療癒，從一口濃郁開始！🍰\n\n為大家介紹今日主打新品：經典「減糖生乳捲」！\n經過長達三個月的研發，使用日本進口鮮奶油，搭配減糖配方，低負擔享受！\n\n✨ 關注賣場現領 $20 優惠券\n🛒 全館下單滿 $199 即享超商免運優惠！\n\n#小林手作烘焙 #減糖生乳捲 #蝦皮動態 #限時優惠 #下午茶首選",
    scheduled_at: "2026-07-13T12:00",
    status: "published",
    created_at: "2026-07-12T11:00:00Z"
  },
  {
    id: "seed-1",
    brand_id: "default",
    platform: "facebook",
    content: "【小林手作烘焙 ✨ 經典生乳捲新品開箱】\n\n「大人的療癒，從一口濃郁開始。」❤️\n\n我們一直在思考，如何讓生乳捲既有日本鮮奶油的濃郁香氣，又能保持清爽不膩口的風味？\n經過長達三個月的研發，這款「經典減糖生乳捲」正式與大家見面了！\n\n使用日本進口中沢鮮奶油，搭配減糖配方，專為熱愛甜點又講究健康的你研發。每一口都像雲朵般輕盈，完全無負擔！\n\n不論是上班族的下午茶，還是媽媽們的悠閒時光，這款生乳捲都是最完美的陪伴。🥰\n\n👉 預購連結：shopee.tw/lincraftbakery/roll\n💡 小叮嚀：每日手工限量製作，預購從速喔！\n\n#小林手作烘焙 #減糖生乳捲 #手作烘焙 #下午茶首選",
    scheduled_at: "2026-07-12T14:00",
    status: "published",
    created_at: "2026-07-11T10:00:00Z"
  },
  {
    id: "seed-2",
    brand_id: "default",
    platform: "instagram",
    content: "🧁 芒果小戚風夏日限定登場！🥭\n\n首句就要抓住眼球：夏日最芒的療癒來了！🧡\n\n夏天就是要吃芒果！小林嚴選當季新鮮愛文芒果，搭配細緻戚風蛋糕體，吃得到香甜果肉與爽口鮮奶油的完美比例！\n\n✨ 嚴選特色：\n1. 當日產地直達愛文芒果，香氣十足\n2. 獨家減糖海綿蛋糕，濕潤蓬鬆\n3. 專為下午茶設計，小巧精緻無負擔\n\n限時限量，芒果控絕對不能錯過！趕緊手刀預約！👇\n🛒 shopee.tw/lincraftbakery/mango\n\n#小林手作烘焙 #夏季限定 #芒果戚風 #下午茶 #手作甜點 #芒果控",
    scheduled_at: "2026-07-13T16:30",
    status: "scheduled",
    created_at: "2026-07-12T09:00:00Z"
  },
  {
    id: "seed-3",
    brand_id: "default",
    platform: "line_oa",
    content: "【限時免運通知】🚚\n\n哈囉！這週想吃甜點嗎？🧁\n\n小林手作限時免運活動開跑！即日起至本週日，全館下單滿 $199 即享超商免運！\n\n超划算推薦：新品「減糖生乳捲」免運直接帶回家！吃甜甜，心情也甜甜！\n\n點擊下方連結搶先預購，數量有限，售完為止：\n👉 shopee.tw/lincraftbakery",
    scheduled_at: "2026-07-14T10:00",
    status: "draft",
    created_at: "2026-07-13T02:00:00Z"
  },
  {
    id: "seed-4",
    brand_id: "default",
    platform: "threads",
    content: "如果生乳捲可以有第5個切片，你們會留給誰？🤔\n\n今天做了一條新品減糖生乳捲，主打一個鮮奶油加爆但完全不膩。自己切了四片，看著空空的盤子突然有點哲學思考。\n\n大家下午茶最喜歡配紅茶還是黑咖啡？留言告訴我，抽一個送你一整條生乳捲試吃！👇",
    scheduled_at: "2026-07-20T15:00",
    status: "scheduled",
    created_at: "2026-07-13T05:00:00Z"
  }
];

// ==========================================
// 2. Initialize App
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  applyBrandColors(brandSettings.color);
  setupEventListeners();
  updateBrandBadge();
  
  // Initialize Supabase client
  initSupabase();
  
  // Load data asynchronously from Supabase if configured, otherwise render immediately
  if (supabaseClient) {
    loadAllFromSupabase().then(() => {
      renderScreen();
      updateStatusSidebar();
    });
  } else {
    renderScreen();
    updateStatusSidebar();
  }
});

// Load data from LocalStorage
// Merge with default values to preserve Supabase prefilled URL and Key if not in localStorage yet
function loadData() {
  const savedBrand = localStorage.getItem("shopee_brand_settings");
  if (savedBrand) {
    brandSettings = JSON.parse(savedBrand);
  }
  
  const savedSettings = localStorage.getItem("shopee_settings");
  if (savedSettings) {
    appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
  }
  
  const savedPosts = localStorage.getItem("shopee_posts");
  if (savedPosts) {
    posts = JSON.parse(savedPosts);
  } else {
    posts = [...seedPosts];
    savePosts();
  }
}

function savePosts() {
  localStorage.setItem("shopee_posts", JSON.stringify(posts));
}

// Apply brand custom colors dynamically to document root
function applyBrandColors(color) {
  document.documentElement.style.setProperty("--shopee-orange", color);
  document.documentElement.style.setProperty("--shopee-orange-hover", darkenColor(color, 10));
  document.documentElement.style.setProperty("--shopee-orange-light", lightenColor(color, 90));
  
  // Custom box shadows and badges
  document.documentElement.style.setProperty("--shopee-preferred-orange", color);
  
  const rootStyle = document.createElement("style");
  rootStyle.id = "custom-brand-style";
  rootStyle.innerHTML = `
    .logo-icon { background: linear-gradient(135deg, ${color} 0%, ${lightenColor(color, 30)} 100%); }
    .btn-primary { box-shadow: 0 4px 12px ${color}40; }
    .btn-primary:hover { box-shadow: 0 6px 16px ${color}55; }
    .tone-pill.active { box-shadow: 0 4px 10px ${color}40; }
  `;
  const existing = document.getElementById("custom-brand-style");
  if (existing) existing.remove();
  document.head.appendChild(rootStyle);
}

// Helper: darken color hex
function darkenColor(hex, percent) {
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
  let r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);
  r = Math.max(0, Math.round(r * (1 - percent / 100)));
  g = Math.max(0, Math.round(g * (1 - percent / 100)));
  b = Math.max(0, Math.round(b * (1 - percent / 100)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper: lighten color hex
function lightenColor(hex, percent) {
  hex = hex.replace(/^\s*#|\s*$/g, "");
  if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
  let r = parseInt(hex.substr(0, 2), 16),
      g = parseInt(hex.substr(2, 2), 16),
      b = parseInt(hex.substr(4, 2), 16);
  r = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Update brand badge in header
function updateBrandBadge() {
  const badgeDot = document.getElementById("header-brand-color");
  const badgeName = document.getElementById("header-brand-name");
  
  if (badgeDot && badgeName) {
    badgeDot.style.backgroundColor = brandSettings.color;
    badgeName.textContent = brandSettings.name || "未設定品牌";
  }
}

// Update connection status card in sidebar
function updateStatusSidebar() {
  const dot = document.getElementById("ai-status-dot");
  const text = document.getElementById("ai-status-text");
  
  if (dot && text) {
    if (appSettings.mode === "api") {
      const provider = appSettings.provider || "openai";
      const key = provider === "openai" ? appSettings.apiKey : appSettings.openrouterKey;
      
      if (key) {
        dot.className = "status-dot";
        text.textContent = provider === "openai" ? "OpenAI 連線" : "OpenRouter 連線";
      } else {
        dot.className = "status-dot mock";
        text.textContent = "API 未設定";
      }
    } else {
      dot.className = "status-dot mock";
      text.textContent = "模擬模式";
    }
  }
  
  // Database status
  const dbDot = document.getElementById("db-status-dot");
  const dbText = document.getElementById("db-status-text");
  if (dbDot && dbText) {
    if (supabaseClient) {
      dbDot.className = "status-dot";
      dbText.textContent = "Supabase 雲端";
    } else {
      dbDot.className = "status-dot mock";
      dbText.textContent = "本機快取";
    }
  }
}

// ==========================================
// 3. Navigation & Screen Rendering
// ==========================================

function setupEventListeners() {
  // Sidebar Navigation
  document.querySelectorAll(".sidebar-menu .menu-item").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".sidebar-menu .menu-item").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      
      activeScreen = button.getAttribute("data-screen");
      renderScreen();
    });
  });
  
  // Settings Modals
  document.getElementById("open-settings-btn").addEventListener("click", openSettingsModal);
  document.getElementById("btn-close-settings").addEventListener("click", closeSettingsModal);
  document.getElementById("btn-cancel-settings").addEventListener("click", closeSettingsModal);
  document.getElementById("btn-save-settings").addEventListener("click", saveSettings);
  
  document.getElementById("setting-api-provider").addEventListener("change", (e) => {
    updateModelOptions(e.target.value);
  });
  
  document.getElementById("btn-mode-mock").addEventListener("click", () => toggleSettingsMode("mock"));
  document.getElementById("btn-mode-api").addEventListener("click", () => toggleSettingsMode("api"));
  
  // Brand Studio Page
  const saveBrandBtn = document.getElementById("btn-save-brand");
  if (saveBrandBtn) saveBrandBtn.addEventListener("click", saveBrandStudioSettings);
  
  // Brand Tone Pills Multi-selection
  document.querySelectorAll("#brand-tone-selector .tone-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      pill.classList.toggle("active");
    });
  });
  
  // Generator Checkboxes Click Animation & Class toggles
  document.querySelectorAll(".checkbox-card").forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    card.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
      }
      if (checkbox.checked) {
        card.classList.add("checked");
      } else {
        card.classList.remove("checked");
      }
    });
  });
  
  // Generator Preview Platform Tabs
  document.querySelectorAll(".preview-tabs .preview-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".preview-tabs .preview-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      activePreviewPlatform = tab.getAttribute("data-platform");
      updatePreviewPhoneMockup();
    });
  });
  
  // Generator Run Actions
  document.getElementById("btn-generate-post").addEventListener("click", runAIGeneration);
  document.getElementById("btn-confirm-schedule").addEventListener("click", confirmScheduleGeneration);
  document.getElementById("btn-discard-generation").addEventListener("click", discardGeneration);
  
  // Editable Preview Content synchronization
  const editablePreview = document.getElementById("preview-editable-content");
  editablePreview.addEventListener("input", () => {
    generatedCopies[activePreviewPlatform] = editablePreview.innerText;
  });
  
  // Library view toggle buttons
  document.getElementById("btn-view-calendar").addEventListener("click", () => toggleLibraryView("calendar"));
  document.getElementById("btn-view-list").addEventListener("click", () => toggleLibraryView("list"));
  
  // Calendar Nav
  document.getElementById("calendar-prev-btn").addEventListener("click", () => adjustMonth(-1));
  document.getElementById("calendar-next-btn").addEventListener("click", () => adjustMonth(1));
  
  // Post Edit Modal Close
  document.getElementById("btn-close-post").addEventListener("click", closePostModal);
  document.getElementById("btn-cancel-post").addEventListener("click", closePostModal);
  document.getElementById("btn-delete-post").addEventListener("click", deletePostAction);
  document.getElementById("btn-save-post").addEventListener("click", savePostAction);
}

// Toggle screens
function renderScreen() {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  
  const titleEl = document.getElementById("current-screen-title");
  const descEl = document.getElementById("current-screen-desc");
  
  if (activeScreen === "library") {
    document.getElementById("screen-library").classList.add("active");
    titleEl.textContent = "內容庫與排程";
    descEl.textContent = "管理與發布您的社群貼文";
    renderLibrary();
  } else if (activeScreen === "generator") {
    document.getElementById("screen-generator").classList.add("active");
    titleEl.textContent = "AI 貼文生成器";
    descEl.textContent = "為各社群平台一鍵生成專屬文案";
    initGeneratorScreen();
  } else if (activeScreen === "brand") {
    document.getElementById("screen-brand").classList.add("active");
    titleEl.textContent = "品牌定調中心";
    descEl.textContent = "定調您的品牌人設，讓 AI 寫出有靈魂的文案";
    loadBrandStudioForm();
  }
}

// ==========================================
// 4. Toast System
// ==========================================

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === "error") icon = '<i class="fa-solid fa-circle-xmark"></i>';
  if (type === "warning") icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Auto remove after 3s
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================
// 5. System Settings Modal Logic
// ==========================================

function openSettingsModal() {
  const provider = appSettings.provider || "openai";
  document.getElementById("setting-api-provider").value = provider;
  document.getElementById("setting-api-key").value = appSettings.apiKey || "";
  document.getElementById("setting-openrouter-key").value = appSettings.openrouterKey || "";
  document.getElementById("setting-supabase-url").value = appSettings.supabaseUrl || "";
  document.getElementById("setting-supabase-key").value = appSettings.supabaseKey || "";
  
  updateProviderUI(provider);
  updateModelOptions(provider, appSettings.model);
  
  toggleSettingsMode(appSettings.mode);
  document.getElementById("modal-settings").classList.add("active");
}

function updateProviderUI(provider) {
  if (provider === "openai") {
    document.getElementById("group-openai-settings").style.display = "block";
    document.getElementById("group-openrouter-settings").style.display = "none";
  } else {
    document.getElementById("group-openai-settings").style.display = "none";
    document.getElementById("group-openrouter-settings").style.display = "block";
  }
}

function closeSettingsModal() {
  document.getElementById("modal-settings").classList.remove("active");
}

function toggleSettingsMode(mode) {
  document.getElementById("btn-mode-mock").classList.remove("active");
  document.getElementById("btn-mode-api").classList.remove("active");
  
  if (mode === "mock") {
    document.getElementById("btn-mode-mock").classList.add("active");
    document.getElementById("api-settings-group").style.display = "none";
  } else {
    document.getElementById("btn-mode-api").classList.add("active");
    document.getElementById("api-settings-group").style.display = "block";
  }
}

function saveSettings() {
  const selectedMode = document.getElementById("btn-mode-mock").classList.contains("active") ? "mock" : "api";
  const provider = document.getElementById("setting-api-provider").value;
  const key = document.getElementById("setting-api-key").value.trim();
  const orKey = document.getElementById("setting-openrouter-key").value.trim();
  const model = document.getElementById("setting-api-model").value;
  const sbUrl = document.getElementById("setting-supabase-url").value.trim();
  const sbKey = document.getElementById("setting-supabase-key").value.trim();
  
  if (selectedMode === "api") {
    if (provider === "openai" && !key) {
      showToast("啟用 API 模式必須輸入 OpenAI API Key！", "warning");
      return;
    }
    if (provider === "openrouter" && !orKey) {
      showToast("啟用 API 模式必須輸入 OpenRouter API Key！", "warning");
      return;
    }
  }
  
  appSettings.mode = selectedMode;
  appSettings.provider = provider;
  appSettings.apiKey = key;
  appSettings.openrouterKey = orKey;
  appSettings.model = model;
  appSettings.supabaseUrl = sbUrl;
  appSettings.supabaseKey = sbKey;
  
  localStorage.setItem("shopee_settings", JSON.stringify(appSettings));
  
  // Re-initialize Supabase client
  initSupabase();
  if (supabaseClient) {
    loadAllFromSupabase().then(() => {
      renderScreen();
      updateStatusSidebar();
    });
  } else {
    loadData();
    renderScreen();
    updateStatusSidebar();
  }
  
  closeSettingsModal();
  showToast("系統設定儲存成功！");
}

// ==========================================
// 6. Brand Studio Logic
// ==========================================

function loadBrandStudioForm() {
  document.getElementById("brand-name").value = brandSettings.name || "";
  document.getElementById("brand-color").value = brandSettings.color || "#EE4D2D";
  document.getElementById("brand-color-hex").textContent = brandSettings.color || "#EE4D2D";
  document.getElementById("brand-ta").value = brandSettings.ta || "";
  document.getElementById("brand-forbidden").value = (brandSettings.forbidden || []).join(", ");
  
  // Set color text dynamic update
  document.getElementById("brand-color").addEventListener("input", (e) => {
    document.getElementById("brand-color-hex").textContent = e.target.value;
  });
  
  // Active tone pills
  document.querySelectorAll("#brand-tone-selector .tone-pill").forEach(pill => {
    const tone = pill.getAttribute("data-tone");
    if ((brandSettings.tones || []).includes(tone)) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });
}

async function saveBrandStudioSettings() {
  const name = document.getElementById("brand-name").value.trim();
  const color = document.getElementById("brand-color").value;
  const ta = document.getElementById("brand-ta").value.trim();
  const forbiddenStr = document.getElementById("brand-forbidden").value;
  
  // Select active tones
  const tones = [];
  document.querySelectorAll("#brand-tone-selector .tone-pill.active").forEach(pill => {
    tones.push(pill.getAttribute("data-tone"));
  });
  
  if (!name || !ta || tones.length === 0) {
    showToast("請填寫品牌名稱、目標客群與至少選擇一種語氣！", "error");
    return;
  }
  
  const forbidden = forbiddenStr.split(",")
    .map(w => w.trim())
    .filter(w => w.length > 0);
    
  const brandId = brandSettings.id;
  brandSettings = { id: brandId, name, color, ta, tones, forbidden };
  
  localStorage.setItem("shopee_brand_settings", JSON.stringify(brandSettings));
  applyBrandColors(color);
  updateBrandBadge();
  
  if (supabaseClient) {
    await syncBrandToSupabase();
  }
  
  showToast("品牌設定儲存成功，視覺系統已同步！");
}

// ==========================================
// 7. AI Post Generator Logic
// ==========================================

function initGeneratorScreen() {
  document.getElementById("post-topic").value = "";
  
  // Set default schedule time to today + 2 hours
  const now = new Date();
  now.setHours(now.getHours() + 2);
  now.setMinutes(0);
  
  // Format to string ISO 'YYYY-MM-DDTHH:MM'
  const offset = now.getTimezoneOffset();
  const localTime = new Date(now.getTime() - (offset * 60 * 1000));
  document.getElementById("post-schedule-time").value = localTime.toISOString().slice(0, 16);
  
  // Hide confirm section
  document.getElementById("generation-confirm-card").style.display = "none";
  
  // Clear preview editable
  document.getElementById("preview-editable-content").innerText = "";
  
  // Load brand defaults to preview header
  document.getElementById("preview-brand-name").textContent = brandSettings.name || "蝦皮購物";
  document.getElementById("preview-avatar").textContent = (brandSettings.name || "蝦").substring(0, 1);
  document.getElementById("preview-avatar").style.backgroundColor = brandSettings.color;
  
  // Set default preview tab
  document.querySelectorAll(".preview-tabs .preview-tab").forEach(t => t.classList.remove("active"));
  const defaultTab = document.querySelector(".preview-tabs .preview-tab.shopee");
  if (defaultTab) defaultTab.classList.add("active");
  activePreviewPlatform = "shopee_feed";
  updatePreviewPhoneMockup();
}

async function runAIGeneration() {
  try {
    const topicEl = document.getElementById("post-topic");
    const scheduleTimeEl = document.getElementById("post-schedule-time");
    
    if (!topicEl || !scheduleTimeEl) {
      showToast("系統元件載入失敗，請重新整理頁面！", "error");
      return;
    }

    const topic = topicEl.value.trim();
    const scheduleTime = scheduleTimeEl.value;
    
    // Validate Selected Platforms safely
    const selectedPlatforms = [];
    const checkPlatform = (id, val) => {
      const el = document.getElementById(id);
      if (el && el.checked) {
        selectedPlatforms.push(val);
      }
    };
    
    checkPlatform("platform-shopee", "shopee_feed");
    checkPlatform("platform-facebook", "facebook");
    checkPlatform("platform-instagram", "instagram");
    checkPlatform("platform-threads", "threads");
    checkPlatform("platform-line", "line_oa");
    
    if (!topic) {
      showToast("請輸入貼文主題！", "error");
      return;
    }
    if (selectedPlatforms.length === 0) {
      showToast("請至少勾選一個發布平台！", "error");
      return;
    }
    if (!scheduleTime) {
      showToast("請設定排程時間！", "error");
      return;
    }
    
    // Show loader overlay safely
    const loader = document.getElementById("loading-overlay");
    const loaderText = document.getElementById("loading-text");
    if (loader) {
      loader.classList.add("active");
    }
    if (loaderText) {
      loaderText.textContent = "AI 正在戴上「品牌面具」，分析受眾中...";
    }
    
    // Simulate multi-stage generation with loading texts
    const interval1 = setTimeout(() => {
      if (loaderText) loaderText.textContent = "正在嚴格排除品牌禁忌詞庫...";
    }, 800);
    
    const interval2 = setTimeout(() => {
      if (loaderText) loaderText.textContent = "正在針對各平台規範進行寫作優化...";
    }, 1600);
    
    try {
      // Wait for the simulated lag (2.5s total)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      generatedCopies = {};
      
      const hasApiKey = (appSettings.provider === "openai" && appSettings.apiKey) || 
                        (appSettings.provider === "openrouter" && appSettings.openrouterKey);
      
      if (appSettings.mode === "api" && hasApiKey) {
        // Call OpenAI/OpenRouter API in parallel for each platform
        for (const platform of selectedPlatforms) {
          generatedCopies[platform] = await callOpenAIForPlatform(topic, platform);
        }
      } else {
        // Generate with local mock engine
        for (const platform of selectedPlatforms) {
          generatedCopies[platform] = generateMockCopy(topic, platform);
        }
      }
      
      // Set active tab to the first selected platform
      activePreviewPlatform = selectedPlatforms[0];
      document.querySelectorAll(".preview-tabs .preview-tab").forEach(tab => {
        tab.classList.remove("active");
        if (tab.getAttribute("data-platform") === activePreviewPlatform) {
          tab.classList.add("active");
        }
      });
      
      // Hide loader
      if (loader) loader.classList.remove("active");
      
      // Show confirm card and update preview mockup
      const confirmCard = document.getElementById("generation-confirm-card");
      if (confirmCard) confirmCard.style.display = "block";
      
      updatePreviewPhoneMockup();
      showToast("文案生成成功，請於右側手機預覽審核！");
      
    } catch (apiError) {
      clearTimeout(interval1);
      clearTimeout(interval2);
      if (loader) loader.classList.remove("active");
      console.error("API call error: ", apiError);
      
      // Fallback to local mock engine instead of failing completely!
      showToast("雲端 API 請求失敗，已自動切換為本地模擬引擎生成文案！", "warning");
      
      generatedCopies = {};
      for (const platform of selectedPlatforms) {
        generatedCopies[platform] = generateMockCopy(topic, platform);
      }
      
      activePreviewPlatform = selectedPlatforms[0];
      document.querySelectorAll(".preview-tabs .preview-tab").forEach(tab => {
        tab.classList.remove("active");
        if (tab.getAttribute("data-platform") === activePreviewPlatform) {
          tab.classList.add("active");
        }
      });
      
      const confirmCard = document.getElementById("generation-confirm-card");
      if (confirmCard) confirmCard.style.display = "block";
      
      updatePreviewPhoneMockup();
    }
  } catch (err) {
    const loader = document.getElementById("loading-overlay");
    if (loader) loader.classList.remove("active");
    console.error("AI Generation Critical Error: ", err);
    showToast(`生成失敗: ${err.message}`, "error");
  }
}

// Generate high quality mock copy client-side
function generateMockCopy(topic, platform) {
  const brandName = brandSettings.name || "蝦皮購物";
  const ta = brandSettings.ta || "一般受眾";
  const toneStr = (brandSettings.tones || ["溫暖親切"]).join("、");
  
  let copy = "";
  
  // Safe replacements for forbidden words
  let cleanTopic = topic;
  const wordMap = {
    "最便宜": "超級划算",
    "絕無僅有": "極其珍貴",
    "買一送一": "買二免一優惠",
    "第一名": "好評如潮",
    "最頂級": "精選上等"
  };
  
  // Replace custom brand forbidden words
  brandSettings.forbidden.forEach(word => {
    const regex = new RegExp(word, "g");
    const replacement = wordMap[word] || "誠意優惠";
    cleanTopic = cleanTopic.replace(regex, replacement);
  });
  
  if (platform === "shopee_feed") {
    copy = `🧡【${brandName} ✨ 蝦皮限時新品首發】🧡\n\n大人的療癒，從一口濃郁開始！🍰\n\n為您介紹今日主打：${cleanTopic}！\n這是我們特別為【${ta}】精心研發的口味，融入 ${toneStr} 的情感細節調配，減糖清爽無負擔！\n\n✨ 關注賣場現領折價券，立即點擊下方商品連結選購吧！\n🛒 預購連結：shopee.tw/${brandName.toLowerCase()}\n\n#${brandName} #蝦皮動態 #新品上市 #手作烘焙 #下午茶推薦`;
  } else if (platform === "facebook") {
    copy = `【${brandName} ✨ 質感新品登場】\n\n「生活裡的儀式感，從細微的甜意開始。」🧁\n\n今天想和大家聊聊我們新推出的主題：${cleanTopic}。\n\n我們深知對於【${ta}】而言，在忙碌的生活步調中，要找到一份兼顧美味且讓人放鬆的享受是多麼不易。因此，我們堅持用最誠摯的初心調配這款新品。\n\n我們融入了 ${toneStr} 的情感注入每一個細節，希望能讓您在咬下的第一口，就感受到溫暖的問候。🧡\n\n歡迎與我們一同品味這份精心烘焙的驚喜！\n\n🛒 點擊看詳情：shopee.tw/${brandName.toLowerCase()}\n💌 私訊我們了解更多新品資訊！`;
  } else if (platform === "instagram") {
    copy = `✨ 夏日爆款新品！夏日的美味指南請收下！ 🥭\n\n對於【${ta}】來說，下午茶不只要好吃，更要吃得精緻無負擔！這一次我們為您帶來：\n\n📌 新品重點亮點：\n🔔 主題特色：${cleanTopic}\n💡 口感：滑順輕盈，散發自然清甜\n🍃 特性：清爽減糖配方，低負擔享受\n\n以 ${toneStr} 的態度為您烘焙，一口就被療癒！快把美味分享給姊妹吧 🥳\n\n👇 手刀下單傳送門：\n👉 點擊個人檔案 Link tree\n\n#${brandName} #手作甜點 #限時預購 #下午茶時光 #美味推薦 #烘焙日常`;
  } else if (platform === "threads") {
    copy = `如果只能選一個甜點當成今天的犒賞，你們會選什麼？🤔\n\n今天剛做好了這款新品：${cleanTopic}。主打一個料滿實在，用料是我們特別為【${ta}】精心調整的口味，保證吃一口就停不下來。\n\n大家平時比較喜歡配無糖綠茶還是拿鐵咖啡？下方留言告訴我，小編隨機送你新品試吃！ 👇`;
  } else if (platform === "line_oa") {
    copy = `【${brandName} 獨家新品快報】🎉\n\n專為【${ta}】量身打造的新品上市囉！\n\n主打「${cleanTopic}」，兼顧美味與健康！\n\n小林以 ${toneStr} 的心意為您準備，全家大小都能吃得安心！\n\n現正熱烈預購中，加入購物車即享專屬新品小禮物：\n👉 shopee.tw/lincraftbakery`;
  }
  
  return copy;
}

// Call real OpenAI API
async function callOpenAIForPlatform(topic, platform) {
  const systemPrompt = `你是一位擁有 15 年經驗的社群行銷總監與爆款文案大師。
現在，你必須完全化身為指定品牌的專屬小編，以該品牌的專一語調進行創作。

請嚴格遵守以下【品牌設定】：
- 品牌名稱：${brandSettings.name}
- 目標受眾 (TA)：${brandSettings.ta}
- 說話調性與語氣：${brandSettings.tones.join("、")}
- 絕對禁止出現的「禁忌詞/字」：${brandSettings.forbidden.join("、")}（若有包含，請用合適的同義詞替代，絕對不可直接露出）

請在寫作時，將上述品牌個性深深烙印在你的文字中，不要出現任何與品牌人設相違背的語氣。`;

  const userPrompt = `請針對主題：【 ${topic} 】，為以下社群平台撰寫文案草稿：
平台：【 ${platform.toUpperCase()} 】

請嚴格遵循該平台的寫作規範：
1. 若平台是 SHOPEE_FEED（蝦皮動態）：強調導購，開頭使用顯眼符號，多宣傳免運、關注禮、滿額折等促銷福利，附帶 5 個以上熱門 Hashtags。
2. 若平台是 Facebook：重視故事性與認同感，段落完整，文末給予暖心 CTA（行動呼籲）。
3. 若平台是 Instagram：首句必須是爆款標題，多用表情符號，段落清晰，文末附上 5-10 個相關的 Hashtags。
4. 若平台是 LINE OA：字數限制在 150 字內，前三行必須點出關鍵痛點或福利，結尾直接附上連結引導。
5. 若平台是 Threads：口語、幽默、有探討空間，像朋友之間的閒聊。

【輸出限制】：
- 直接輸出文案內容，不要包含任何「好的，這是為您生成的文案」等無關寒暄，也不要加任何引號包裝。
- 嚴禁使用品牌禁忌詞。`;

  const provider = appSettings.provider || "openai";
  let endpoint = "https://api.openai.com/v1/chat/completions";
  let apiKey = appSettings.apiKey;
  let headers = {
    "Content-Type": "application/json"
  };

  if (provider === "openrouter") {
    endpoint = "https://openrouter.ai/api/v1/chat/completions";
    apiKey = appSettings.openrouterKey;
    headers["HTTP-Referer"] = "http://localhost:8081";
    headers["X-Title"] = "Shopee Social Scheduler";
  }

  headers["Authorization"] = `Bearer ${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: appSettings.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "AI API request failed");
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Update the simulated phone screen UI based on current settings and generated copy
function updatePreviewPhoneMockup() {
  const container = document.getElementById("phone-screen-container");
  const appTitle = document.getElementById("preview-app-title");
  const brandNameText = document.getElementById("preview-brand-name");
  const avatarText = document.getElementById("preview-avatar");
  const contentArea = document.getElementById("preview-editable-content");
  const imagePlaceholder = document.getElementById("preview-image-placeholder");
  
  // Set default values from state
  brandNameText.textContent = brandSettings.name || "蝦皮購物";
  avatarText.textContent = (brandSettings.name || "蝦").substring(0, 1);
  avatarText.style.backgroundColor = brandSettings.color;
  
  // Reset classes
  container.className = "phone-screen";
  contentArea.style.display = "block";
  imagePlaceholder.style.display = "flex";
  
  const copy = generatedCopies[activePreviewPlatform] || "";
  contentArea.innerText = copy;
  
  if (activePreviewPlatform === "shopee_feed") {
    container.classList.add("shopee-feed-style");
    appTitle.textContent = "蝦皮動態 (Shopee Feed)";
  } else if (activePreviewPlatform === "facebook") {
    container.classList.add("fb-style");
    appTitle.textContent = "Facebook";
  } else if (activePreviewPlatform === "instagram") {
    container.classList.add("ig-style");
    appTitle.textContent = "Instagram Feed";
  } else if (activePreviewPlatform === "threads") {
    container.classList.add("threads-style");
    appTitle.textContent = "Threads";
    imagePlaceholder.style.display = "none"; // Threads text first
  } else if (activePreviewPlatform === "line_oa") {
    container.classList.add("line-style");
    appTitle.textContent = brandSettings.name || "LINE 官方帳號";
    imagePlaceholder.style.display = "none";
    
    // In LINE style we convert the editable content into a speech bubble
    contentArea.className = "post-bubble";
    contentArea.id = "preview-editable-content";
    return;
  }
  
  // Reset standard content editable classes
  contentArea.className = "post-editable-content";
}

async function confirmScheduleGeneration() {
  const scheduleTime = document.getElementById("post-schedule-time").value;
  
  // Insert posts
  const selectedPlatforms = Object.keys(generatedCopies);
  if (selectedPlatforms.length === 0) return;
  
  for (const platform of selectedPlatforms) {
    const newPost = {
      id: "post-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
      brand_id: brandSettings.id || "default",
      platform: platform,
      content: generatedCopies[platform],
      scheduled_at: scheduleTime,
      status: "scheduled",
      created_at: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    if (supabaseClient) {
      await syncPostToSupabase(newPost);
    }
  }
  
  savePosts();
  showToast(`成功排程 ${selectedPlatforms.length} 篇社群貼文！`);
  
  // Clear inputs
  discardGeneration();
  
  // Redirect to Library
  document.querySelectorAll(".sidebar-menu .menu-item").forEach(btn => btn.classList.remove("active"));
  const libraryBtn = document.querySelector(".sidebar-menu [data-screen='library']");
  if (libraryBtn) libraryBtn.classList.add("active");
  activeScreen = "library";
  renderScreen();
}

function discardGeneration() {
  generatedCopies = {};
  document.getElementById("post-topic").value = "";
  document.getElementById("generation-confirm-card").style.display = "none";
  document.getElementById("preview-editable-content").innerText = "";
  updatePreviewPhoneMockup();
}

// ==========================================
// 8. Library & Calendar Logic
// ==========================================

let activeLibraryView = "calendar";

function toggleLibraryView(view) {
  activeLibraryView = view;
  document.getElementById("btn-view-calendar").classList.remove("active");
  document.getElementById("btn-view-list").classList.remove("active");
  
  if (view === "calendar") {
    document.getElementById("btn-view-calendar").classList.add("active");
    document.getElementById("calendar-view-section").style.display = "block";
    document.getElementById("list-view-section").style.display = "none";
  } else {
    document.getElementById("btn-view-list").classList.add("active");
    document.getElementById("calendar-view-section").style.display = "none";
    document.getElementById("list-view-section").style.display = "block";
  }
  
  renderLibrary();
}

function renderLibrary() {
  updateStatsCounters();
  if (activeLibraryView === "calendar") {
    renderCalendar();
  } else {
    renderListView();
  }
}

function updateStatsCounters() {
  let draftCount = 0;
  let scheduledCount = 0;
  let publishedCount = 0;
  
  posts.forEach(post => {
    if (post.status === "draft") draftCount++;
    else if (post.status === "scheduled") scheduledCount++;
    else if (post.status === "published") publishedCount++;
  });
  
  document.getElementById("stat-count-draft").textContent = draftCount;
  document.getElementById("stat-count-scheduled").textContent = scheduledCount;
  document.getElementById("stat-count-published").textContent = publishedCount;
}

// Monthly Calendar Logic
function renderCalendar() {
  const cellsGrid = document.getElementById("calendar-cells");
  if (!cellsGrid) return;
  
  cellsGrid.innerHTML = "";
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth(); // 0-11
  
  // Set month title
  document.getElementById("calendar-month-title").textContent = `${year} 年 ${month + 1} 月`;
  
  // Get first day of the month
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  
  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  // Get last day of previous month
  const prevLastDay = new Date(year, month, 0).getDate();
  
  // Calculate cells (prev month prefix, current month days, next month suffix)
  // Total grid items = 42 (6 rows * 7 columns) or less if fitting
  let dayCells = [];
  
  // Prev month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    dayCells.push({
      day: prevLastDay - i,
      monthType: "prev",
      dateObj: new Date(year, month - 1, prevLastDay - i)
    });
  }
  
  // Current month days
  for (let d = 1; d <= lastDay; d++) {
    dayCells.push({
      day: d,
      monthType: "current",
      dateObj: new Date(year, month, d)
    });
  }
  
  // Next month padding days to fill 42 cells
  const remaining = 42 - dayCells.length;
  for (let n = 1; n <= remaining; n++) {
    dayCells.push({
      day: n,
      monthType: "next",
      dateObj: new Date(year, month + 1, n)
    });
  }
  
  // Render cell divs
  dayCells.forEach(cellInfo => {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    if (cellInfo.monthType !== "current") {
      cell.classList.add("other-month");
    }
    
    // Check if cell represents "today"
    const today = new Date();
    if (
      cellInfo.dateObj.getDate() === today.getDate() &&
      cellInfo.dateObj.getMonth() === today.getMonth() &&
      cellInfo.dateObj.getFullYear() === today.getFullYear()
    ) {
      cell.classList.add("today");
    }
    
    cell.innerHTML = `<span class="day-number">${cellInfo.day}</span>`;
    
    const eventsContainer = document.createElement("div");
    eventsContainer.className = "cell-events";
    
    // Filter posts for this date safely using local timezone year/month/day
    const y = cellInfo.dateObj.getFullYear();
    const m = (cellInfo.dateObj.getMonth() + 1).toString().padStart(2, "0");
    const d = cellInfo.dateObj.getDate().toString().padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`; // YYYY-MM-DD
    const daysPosts = posts.filter(post => {
      if (!post.scheduled_at) return false;
      return post.scheduled_at.startsWith(dateStr);
    });
    
    daysPosts.forEach(post => {
      const eventBadge = document.createElement("div");
      
      let platformIcon = '<i class="fa-brands fa-facebook"></i>';
      let classType = "event-fb";
      if (post.platform === "shopee_feed") {
        platformIcon = '<i class="fa-solid fa-bag-shopping"></i>';
        classType = "event-shopee";
      } else if (post.platform === "instagram") {
        platformIcon = '<i class="fa-brands fa-instagram"></i>';
        classType = "event-ig";
      } else if (post.platform === "line_oa") {
        platformIcon = '<i class="fa-brands fa-line"></i>';
        classType = "event-line";
      } else if (post.platform === "threads") {
        platformIcon = '<i class="fa-brands fa-threads"></i>';
        classType = "event-threads";
      }
      
      eventBadge.className = `calendar-event ${classType}`;
      
      // Cut string logic
      const snip = (post.content || "").substring(0, 8);
      eventBadge.innerHTML = `${platformIcon} <span>${snip}...</span>`;
      
      eventBadge.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid double click triggers
        openPostModal(post.id);
      });
      
      eventsContainer.appendChild(eventBadge);
    });
    
    cell.appendChild(eventsContainer);
    cellsGrid.appendChild(cell);
  });
}

function adjustMonth(val) {
  currentMonth.setMonth(currentMonth.getMonth() + val);
  renderCalendar();
}

// List View Logic
function renderListView() {
  const container = document.getElementById("list-view-section");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 40px; margin-bottom: 12px; color: var(--text-light);"></i>
        <p>目前沒有任何排程貼文，前往「AI 貼文生成器」建立吧！</p>
      </div>
    `;
    return;
  }
  
  // Sort posts by date descending
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.scheduled_at) - new Date(a.scheduled_at);
  });
  
  sortedPosts.forEach(post => {
    const item = document.createElement("div");
    item.className = "post-list-item";
    
    // Platform styles
    let pClass = "fb";
    let pIcon = '<i class="fa-brands fa-facebook"></i>';
    let pText = "Facebook";
    
    if (post.platform === "shopee_feed") {
      pClass = "shopee";
      pIcon = '<i class="fa-solid fa-bag-shopping"></i>';
      pText = "蝦皮動態";
    } else if (post.platform === "instagram") {
      pClass = "ig";
      pIcon = '<i class="fa-brands fa-instagram"></i>';
      pText = "Instagram";
    } else if (post.platform === "line_oa") {
      pClass = "line";
      pIcon = '<i class="fa-brands fa-line"></i>';
      pText = "LINE OA";
    } else if (post.platform === "threads") {
      pClass = "threads";
      pIcon = '<i class="fa-brands fa-threads"></i>';
      pText = "Threads";
    }
    
    // Date formatting
    const d = new Date(post.scheduled_at);
    const dateFormatted = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    
    // Status text
    let statusLabel = "等待審稿";
    if (post.status === "scheduled") statusLabel = "已排程";
    if (post.status === "published") statusLabel = "已發布";
    
    const contentSnippet = (post.content || "").replace(/\n/g, " ");
    
    item.innerHTML = `
      <div class="list-platform-icon ${pClass}">
        ${pIcon}
      </div>
      <div class="list-post-content">
        <h4>${pText} 發文</h4>
        <p>${contentSnippet}</p>
      </div>
      <div class="list-post-date">
        <i class="fa-regular fa-clock" style="margin-right: 4px;"></i>
        <span>${dateFormatted}</span>
      </div>
      <div>
        <span class="status-badge ${post.status}">${statusLabel}</span>
      </div>
      <div class="list-actions">
        <button class="action-icon-btn edit-btn" title="編輯"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="action-icon-btn delete delete-btn" title="刪除"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    
    // Handlers
    item.querySelector(".edit-btn").addEventListener("click", () => openPostModal(post.id));
    item.querySelector(".delete-btn").addEventListener("click", () => deletePostImmediate(post.id));
    
    container.appendChild(item);
  });
}

// ==========================================
// 9. Post Edit/Delete Modals Logic
// ==========================================

function openPostModal(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  
  document.getElementById("modal-post-id").value = post.id;
  document.getElementById("modal-post-content").value = post.content || "";
  document.getElementById("modal-post-date").value = post.scheduled_at || "";
  document.getElementById("modal-post-status").value = post.status || "draft";
  
  // Platform Display
  const platformDisp = document.getElementById("modal-post-platform-display");
  let pIcon = '<i class="fa-brands fa-facebook" style="color: var(--shopee-fb-blue)"></i>';
  let pText = "Facebook";
  if (post.platform === "shopee_feed") {
    pIcon = '<i class="fa-solid fa-bag-shopping" style="color: var(--shopee-orange)"></i>';
    pText = "蝦皮動態";
  } else if (post.platform === "instagram") {
    pIcon = '<i class="fa-brands fa-instagram" style="color: #dc2743"></i>';
    pText = "Instagram";
  } else if (post.platform === "line_oa") {
    pIcon = '<i class="fa-brands fa-line" style="color: var(--shopee-line-green)"></i>';
    pText = "LINE OA";
  } else if (post.platform === "threads") {
    pIcon = '<i class="fa-brands fa-threads" style="color: var(--shopee-threads-black)"></i>';
    pText = "Threads";
  }
  
  platformDisp.innerHTML = `${pIcon} <span>${pText}</span>`;
  document.getElementById("modal-post").classList.add("active");
}

function closePostModal() {
  document.getElementById("modal-post").classList.remove("active");
}

async function savePostAction() {
  const id = document.getElementById("modal-post-id").value;
  const content = document.getElementById("modal-post-content").value;
  const date = document.getElementById("modal-post-date").value;
  const status = document.getElementById("modal-post-status").value;
  
  if (!content || !date) {
    showToast("貼文內容與排程時間不可為空！", "error");
    return;
  }
  
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex !== -1) {
    posts[postIndex].content = content;
    posts[postIndex].scheduled_at = date;
    posts[postIndex].status = status;
    
    savePosts();
    
    if (supabaseClient) {
      await syncPostToSupabase(posts[postIndex]);
    }
    
    renderLibrary();
    closePostModal();
    showToast("貼文更新成功！");
  }
}

async function deletePostAction() {
  const id = document.getElementById("modal-post-id").value;
  if (confirm("您確定要刪除這篇貼文嗎？此操作無法復原。")) {
    if (supabaseClient) {
      await deletePostFromSupabase(id);
    }
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderLibrary();
    closePostModal();
    showToast("貼文已刪除！", "warning");
  }
}

async function deletePostImmediate(id) {
  if (confirm("您確定要刪除這篇貼文嗎？此操作無法復原。")) {
    if (supabaseClient) {
      await deletePostFromSupabase(id);
    }
    posts = posts.filter(p => p.id !== id);
    savePosts();
    renderLibrary();
    showToast("貼文已刪除！", "warning");
  }
}

// ==========================================
// 10. Supabase Syncing Logic
// ==========================================

function initSupabase() {
  const { createClient } = window.supabase || {};
  if (createClient && appSettings.supabaseUrl && appSettings.supabaseKey) {
    try {
      supabaseClient = createClient(appSettings.supabaseUrl, appSettings.supabaseKey);
      console.log("Supabase Client initialized successfully!");
    } catch (e) {
      console.error("Failed to initialize Supabase:", e);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
    console.log("Supabase credentials missing or SDK not loaded. Running in local cache mode.");
  }
}

async function loadAllFromSupabase() {
  if (!supabaseClient) return false;
  try {
    const loader = document.getElementById("loading-overlay");
    const loaderText = document.getElementById("loading-text");
    if (loader) {
      loader.classList.add("active");
      loaderText.textContent = "正在與 Supabase 雲端資料庫同步中...";
    }

    // 1. Fetch Brand Settings
    const { data: brands, error: brandError } = await supabaseClient
      .from("brands")
      .select("*")
      .limit(1);

    if (brandError) throw brandError;

    if (brands && brands.length > 0) {
      const b = brands[0];
      brandSettings = {
        id: b.id,
        name: b.name,
        color: b.color_code || "#EE4D2D",
        ta: b.target_audience,
        tones: b.tone_voice ? b.tone_voice.split(",") : ["溫暖親切"],
        forbidden: b.forbidden_words || []
      };
      localStorage.setItem("shopee_brand_settings", JSON.stringify(brandSettings));
      applyBrandColors(brandSettings.color);
      updateBrandBadge();
    } else {
      // No brand in DB, push local settings to create first record
      await syncBrandToSupabase();
    }

    // 2. Fetch Posts
    if (brandSettings.id) {
      const { data: dbPosts, error: postsError } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("brand_id", brandSettings.id);

      if (postsError) throw postsError;

      if (dbPosts) {
        posts = dbPosts.map(p => ({
          id: p.id,
          brand_id: p.brand_id,
          platform: p.platform,
          content: p.content,
          scheduled_at: p.scheduled_at ? p.scheduled_at.slice(0, 16) : "",
          status: p.status,
          created_at: p.created_at
        }));
        savePosts();
      }
    }

    if (loader) loader.classList.remove("active");
    return true;
  } catch (e) {
    console.error("Supabase load error:", e);
    if (document.getElementById("loading-overlay")) {
      document.getElementById("loading-overlay").classList.remove("active");
    }
    showToast("同步 Supabase 雲端失敗，切換為本地快取模式！", "warning");
    return false;
  }
}

async function syncBrandToSupabase() {
  if (!supabaseClient) return;
  try {
    const brandPayload = {
      name: brandSettings.name || "小林手作烘焙",
      color_code: brandSettings.color || "#EE4D2D",
      target_audience: brandSettings.ta || "無描述",
      tone_voice: (brandSettings.tones || []).join(","),
      forbidden_words: brandSettings.forbidden || [],
      updated_at: new Date().toISOString()
    };

    if (brandSettings.id) {
      const { error } = await supabaseClient
        .from("brands")
        .update(brandPayload)
        .eq("id", brandSettings.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseClient
        .from("brands")
        .insert([brandPayload])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        brandSettings.id = data[0].id;
        localStorage.setItem("shopee_brand_settings", JSON.stringify(brandSettings));
      }
    }
  } catch (e) {
    console.error("Supabase brand sync error:", e);
    showToast("同步品牌設定至雲端失敗！", "error");
  }
}

async function syncPostToSupabase(post) {
  if (!supabaseClient) return;
  try {
    if (!brandSettings.id) {
      await syncBrandToSupabase();
    }

    const isoScheduledAt = post.scheduled_at ? new Date(post.scheduled_at).toISOString() : new Date().toISOString();

    const postPayload = {
      brand_id: brandSettings.id,
      platform: post.platform,
      content: post.content,
      scheduled_at: isoScheduledAt,
      status: post.status
    };

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id);

    if (isUuid) {
      const { error } = await supabaseClient
        .from("posts")
        .upsert({ id: post.id, ...postPayload });
      if (error) throw error;
    } else {
      const { data, error } = await supabaseClient
        .from("posts")
        .insert([postPayload])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        const idx = posts.findIndex(p => p.id === post.id);
        if (idx !== -1) {
          posts[idx].id = data[0].id;
          posts[idx].brand_id = data[0].brand_id;
          savePosts();
        }
      }
    }
  } catch (e) {
    console.error("Supabase post sync error:", e);
    showToast("同步貼文至雲端失敗！", "warning");
  }
}

async function deletePostFromSupabase(postId) {
  if (!supabaseClient) return;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
  if (!isUuid) return;
  try {
    const { error } = await supabaseClient
      .from("posts")
      .delete()
      .eq("id", postId);
    if (error) throw error;
  } catch (e) {
    console.error("Supabase delete post error:", e);
    showToast("從雲端刪除貼文失敗！", "error");
  }
}

function updateModelOptions(provider, selectedModel = "") {
  const modelSelect = document.getElementById("setting-api-model");
  if (!modelSelect) return;
  modelSelect.innerHTML = "";
  
  let models = [];
  if (provider === "openai") {
    models = [
      { value: "gpt-4o-mini", text: "gpt-4o-mini (推薦，速度快省額度)" },
      { value: "gpt-4o", text: "gpt-4o (效果最好)" }
    ];
  } else if (provider === "openrouter") {
    models = [
      { value: "deepseek/deepseek-v4-flash", text: "DeepSeek V4 Flash (推薦，速度極快)" },
      { value: "deepseek/deepseek-v4-flash:free", text: "DeepSeek V4 Flash (免費版)" },
      { value: "google/gemini-2.5-pro", text: "Gemini 2.5 Pro (繁中寫作最優)" },
      { value: "google/gemini-2.5-flash", text: "Gemini 2.5 Flash" },
      { value: "anthropic/claude-3.5-sonnet", text: "Claude 3.5 Sonnet (文筆流暢)" },
      { value: "meta-llama/llama-3.3-70b-instruct", text: "Llama 3.3 70B (強大開源)" },
      { value: "openai/gpt-4o-mini", text: "GPT-4o Mini" }
    ];
    // If selectedModel is empty or not found in OpenRouter models, default to DeepSeek V4 Flash
    const exists = models.some(m => m.value === selectedModel);
    if (!exists) {
      selectedModel = "deepseek/deepseek-v4-flash";
    }
  }
  
  models.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.value;
    opt.textContent = m.text;
    if (m.value === selectedModel) {
      opt.selected = true;
    }
    modelSelect.appendChild(opt);
  });
}
