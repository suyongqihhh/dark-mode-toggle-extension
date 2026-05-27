// background.js - Dark Mode Toggle Pro
// 处理快捷键 & 全局消息

// ===== 快捷键：Ctrl+Shift+D =====
try {
  chrome.commands?.onCommand?.addListener((cmd) => {
    if (cmd === "toggle-dark") {
      broadcast("toggle");
    }
  });
} catch {}

// ===== 监听来自 popup 的消息 =====
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "toggle") {
    broadcast("toggle");
    sendResponse({ ok: true });
  }
  if (msg.type === "state") {
    // content script 上报状态，可持久化
    try { chrome.storage.sync.set({ dmt_enabled: msg.enabled }); } catch {}
  }
  return true;
});

// ===== 向所有活跃 tab 广播消息 =====
function broadcast(type) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (!tab.id) return;
      chrome.tabs.sendMessage(tab.id, { type }, (_res) => {
        // 忽略没有 content script 的 tab
        if (chrome.runtime.lastError) {}
      });
    });
  });
}
