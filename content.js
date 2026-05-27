// content.js - Dark Mode Toggle Pro
// 注入深色模式样式，适配各大网站

const STORAGE_KEY  = "dmt_enabled";
const CLASS_NAME   = "dmt-dark";

let injected = false;
let styleEl  = null;

// ===== 通用深色模式 CSS =====
function buildCSS() {
  return `
/* ===== 基础重置 ===== */
.${CLASS_NAME} {
  --dmt-bg:        #1a1a2e !important;
  --dmt-bg-alt:    #16213e !important;
  --dmt-bg-card:   #1e2a45 !important;
  --dmt-text:      #e0e0e0 !important;
  --dmt-text-dim:  #a0a0b0 !important;
  --dmt-border:    #2a3a5c !important;
  --dmt-link:      #7eb8ff !important;
  --dmt-hover:     #253354 !important;
}

/* ===== 页面背景 ===== */
.${CLASS_NAME},
.${CLASS_NAME} body,
.${CLASS_NAME} html {
  background-color: var(--dmt-bg) !important;
  color: var(--dmt-text) !important;
}

/* ===== 文字颜色 ===== */
.${CLASS_NAME} *,
.${CLASS_NAME} *::before,
.${CLASS_NAME} *::after {
  color: inherit !important;
}

.${CLASS_NAME} p,
.${CLASS_NAME} span,
.${CLASS_NAME} div,
.${CLASS_NAME} li,
.${CLASS_NAME} td,
.${CLASS_NAME} th,
.${CLASS_NAME} label,
.${CLASS_NAME} a {
  color: var(--dmt-text) !important;
}

/* ===== 链接 ===== */
.${CLASS_NAME} a:link,
.${CLASS_NAME} a:visited {
  color: var(--dmt-link) !important;
}
.${CLASS_NAME} a:hover {
  color: #a0d0ff !important;
}

/* ===== 背景色覆盖 ===== */
.${CLASS_NAME} div,
.${CLASS_NAME} section,
.${CLASS_NAME} article,
.${CLASS_NAME} main,
.${CLASS_NAME} aside,
.${CLASS_NAME} header,
.${CLASS_NAME} footer,
.${CLASS_NAME} nav {
  background-color: transparent !important;
}
.${CLASS_NAME} body > div,
.${CLASS_NAME} body > main,
.${CLASS_NAME} body > article {
  background-color: var(--dmt-bg) !important;
}

/* ===== 卡片/容器 ===== */
.${CLASS_NAME} [class*="card"],
.${CLASS_NAME} [class*="item"],
.${CLASS_NAME} [class*="box"],
.${CLASS_NAME} [class*="panel"],
.${CLASS_NAME} [class*="container"] {
  background-color: var(--dmt-bg-card) !important;
  border-color: var(--dmt-border) !important;
}

/* ===== 输入框/文本域 ===== */
.${CLASS_NAME} input,
.${CLASS_NAME} textarea,
.${CLASS_NAME} select,
.${CLASS_NAME} [contenteditable="true"] {
  background-color: var(--dmt-bg-alt) !important;
  color: var(--dmt-text) !important;
  border-color: var(--dmt-border) !important;
}

/* ===== 按钮 ===== */
.${CLASS_NAME} button,
.${CLASS_NAME} [role="button"],
.${CLASS_NAME} input[type="button"],
.${CLASS_NAME} input[type="submit"] {
  background-color: var(--dmt-bg-card) !important;
  color: var(--dmt-text) !important;
  border-color: var(--dmt-border) !important;
}
.${CLASS_NAME} button:hover,
.${CLASS_NAME} [role="button"]:hover {
  background-color: var(--dmt-hover) !important;
}

/* ===== 表格 ===== */
.${CLASS_NAME} table {
  background-color: var(--dmt-bg-card) !important;
  border-color: var(--dmt-border) !important;
}
.${CLASS_NAME} th,
.${CLASS_NAME} td {
  background-color: var(--dmt-bg-card) !important;
  border-color: var(--dmt-border) !important;
}

/* ===== 代码块 ===== */
.${CLASS_NAME} pre,
.${CLASS_NAME} code,
.${CLASS_NAME} [class*="code"] {
  background-color: #0d1117 !important;
  color: #c9d1d9 !important;
  border-color: var(--dmt-border) !important;
}

/* ===== 图片/视频降低亮度 ===== */
.${CLASS_NAME} img,
.${CLASS_NAME} video,
.${CLASS_NAME} canvas {
  filter: brightness(0.85) !important;
}
.${CLASS_NAME} img:hover,
.${CLASS_NAME} video:hover {
  filter: brightness(1) !important;
}

/* ===== 滚动条 ===== */
.${CLASS_NAME} ::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.${CLASS_NAME} ::-webkit-scrollbar-track {
  background: var(--dmt-bg-alt) !important;
}
.${CLASS_NAME} ::-webkit-scrollbar-thumb {
  background: #3a4a6c !important;
  border-radius: 4px !important;
}

/* ===== 百度专属适配 ===== */
/* 百度首页 & 搜索结果页 */
.${CLASS_NAME} #head,
.${CLASS_NAME} #s_top_wrap,
.${CLASS_NAME} .s-top-wrap,
.${CLASS_NAME} .head-box,
.${CLASS_NAME} .s_form,
.${CLASS_NAME} .s_form_wrapper {
  background-color: var(--dmt-bg) !important;
}
.${CLASS_NAME} .result,
.${CLASS_NAME} .c-container,
.${CLASS_NAME} .content-right,
.${CLASS_NAME} [class*="result"] {
  background-color: var(--dmt-bg-card) !important;
  border-color: var(--dmt-border) !important;
}
.${CLASS_NAME} .t,
.${CLASS_NAME} .c-title,
.${CLASS_NAME} h3 a {
  color: var(--dmt-link) !important;
}
.${CLASS_NAME} .c-abstract,
.${CLASS_NAME} .c-span-last {
  color: var(--dmt-text-dim) !important;
}
/* 百度搜索框 */
.${CLASS_NAME} #kw,
.${CLASS_NAME} .s_ipt,
.${CLASS_NAME} [id^="kw"] {
  background-color: var(--dmt-bg-alt) !important;
  color: var(--dmt-text) !important;
  border-color: var(--dmt-border) !important;
}
/* 百度百科 */
.${CLASS_NAME} .lemmaWgt-searchHeader,
.${CLASS_NAME} .main-content {
  background-color: var(--dmt-bg) !important;
}

/* ===== GitHub 适配 ===== */
.${CLASS_NAME}.platform-github .markdown-body {
  color: var(--dmt-text) !important;
}
.${CLASS_NAME}.platform-github [class*="bgColor"] {
  background-color: var(--dmt-bg) !important;
}

/* ===== 知乎适配 ===== */
.${CLASS_NAME} .Card,
.${CLASS_NAME} [class*="ContentItem"] {
  background-color: var(--dmt-bg-card) !important;
}

/* ===== B站适配 ===== */
.${CLASS_NAME} .bili-header,
.${CLASS_NAME} .bili-footer,
.${CLASS_NAME} .video-info {
  background-color: var(--dmt-bg) !important;
}

/* ===== 滚动条 Firefox ===== */
.${CLASS_NAME} * {
  scrollbar-color: #3a4a6c var(--dmt-bg-alt) !important;
}
`;
}

// ===== 注入/移除样式 =====
function enableDarkMode() {
  if (injected) return;
  styleEl = document.createElement("style");
  styleEl.id = "dmt-dark-style";
  styleEl.textContent = buildCSS();
  (document.head || document.documentElement).appendChild(styleEl);
  document.documentElement.classList.add(CLASS_NAME);

  // 给 html 加平台 class（方便精准适配）
  detectPlatform();

  injected = true;
  saveState(true);
  notifyPopup("on");
}

function disableDarkMode() {
  if (!injected) return;
  if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
  document.documentElement.classList.remove(CLASS_NAME);
  styleEl  = null;
  injected = false;
  saveState(false);
  notifyPopup("off");
}

function toggleDarkMode() {
  injected ? disableDarkMode() : enableDarkMode();
}

// ===== 平台检测（加 class 方便 CSS 精准适配）=====
function detectPlatform() {
  const host = location.hostname;
  const html = document.documentElement;
  if (host.includes("baidu.com"))      html.classList.add("platform-baidu");
  if (host.includes("github.com"))      html.classList.add("platform-github");
  if (host.includes("zhihu.com"))       html.classList.add("platform-zhihu");
  if (host.includes("bilibili.com"))    html.classList.add("platform-bilibili");
  if (host.includes("csdn.net"))        html.classList.add("platform-csdn");
  if (host.includes("juejin.cn"))       html.classList.add("platform-juejin");
  if (host.includes("douyin.com"))      html.classList.add("platform-douyin");
  if (host.includes("weibo.com"))       html.classList.add("platform-weibo");
}

// ===== 状态持久化 =====
function saveState(on) {
  try { chrome.storage.sync.set({ [STORAGE_KEY]: on }); } catch {}
}

function loadState(cb) {
  try {
    chrome.storage.sync.get(STORAGE_KEY, (r) => cb(!!r[STORAGE_KEY]));
  } catch { cb(false); }
}

// ===== 通知 popup 当前状态 =====
function notifyPopup(state) {
  try {
    chrome.runtime.sendMessage({ type: "state", enabled: state === "on" });
  } catch {}
}

// ===== 监听来自 popup/background 的消息 =====
try {
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "toggle")  toggleDarkMode();
    if (msg.type === "getState") sendResponse({ enabled: injected });
    if (msg.type === "forceOn")  enableDarkMode();
    if (msg.type === "forceOff") disableDarkMode();
    return true;
  });
} catch {}

// ===== 页面加载时恢复状态 =====
loadState((on) => {
  if (on) enableDarkMode();
});
