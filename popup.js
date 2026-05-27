// popup.js - Dark Mode Toggle Pro

const toggleEl    = document.getElementById("toggle");
const statusText  = document.getElementById("statusText");
const shortcutLink = document.getElementById("shortcutLink");

// ===== 获取当前 tab 状态 =====
function getCurrentTab(cb) {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => cb(tabs[0]));
  } catch { cb(null); }
}

// ===== 更新 UI =====
function updateUI(enabled) {
  toggleEl.checked = enabled;
  statusText.textContent = enabled ? "深色模式" : "浅色模式";
  statusText.className   = "status-text" + (enabled ? " on" : "");
}

// ===== 初始化状态 =====
getCurrentTab((tab) => {
  if (!tab) return;
  try {
    chrome.tabs.sendMessage(tab.id, { type: "getState" }, (res) => {
      if (chrome.runtime.lastError) {
        // content script 可能未加载，用 storage 状态
        chrome.storage.sync.get("dmt_enabled", (r) => updateUI(!!r.dmt_enabled));
      } else {
        updateUI(!!(res && res.enabled));
      }
    });
  } catch {
    chrome.storage.sync.get("dmt_enabled", (r) => updateUI(!!r.dmt_enabled));
  }
});

// ===== 开关切换 =====
toggleEl.addEventListener("change", () => {
  getCurrentTab((tab) => {
    if (!tab) return;
    try {
      chrome.tabs.sendMessage(tab.id, { type: "toggle" }, (res) => {
        if (chrome.runtime.lastError) {
          // content script 未注入，reload
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
          }, () => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { type: "toggle" });
            }, 500);
          });
        }
      });
    } catch {}
  });
  // 乐观更新 UI
  setTimeout(() => getCurrentTab((t) => {
    if (!t) return;
    chrome.tabs.sendMessage(t.id, { type: "getState" }, (r) => {
      if (r) updateUI(!!r.enabled);
    });
  }), 400);
});

// ===== 快捷网站按钮 =====
document.querySelectorAll(".site-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.url;
    getCurrentTab((tab) => {
      if (tab && tab.url && !tab.url.startsWith("chrome")) {
        // 当前已有 tab，直接跳转
        chrome.tabs.update(tab.id, { url });
      } else {
        chrome.tabs.create({ url });
      }
    });
  });
});

// ===== 快捷键提示 =====
shortcutLink.addEventListener("click", (e) => {
  e.preventDefault();
  getCurrentTab((tab) => {
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { type: "toggle" });
    setTimeout(() => getCurrentTab((t) => {
      if (!t) return;
      chrome.tabs.sendMessage(t.id, { type: "getState" }, (r) => {
        if (r) updateUI(!!r.enabled);
      });
    }), 300);
  });
});
