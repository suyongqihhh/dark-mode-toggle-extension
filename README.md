# 🌓 Dark Mode Toggle Pro

> 一键切换网页深色/浅色模式，支持百度、知乎、B站等大型网站深度适配。

[English](#english) | 简体中文

---

## ✨ 功能特性

- 🌙 **一键切换** — 点击弹出窗口中的开关，立即切换当前标签页的深色/浅色模式
- ⌨️ **快捷键** — `Ctrl + Shift + D` 全局切换，无需打开弹出窗口
- 🎨 **智能适配** — 针对百度、知乎、B站等大型网站进行深度 CSS 适配，避免样式错乱
- 🔄 **状态记忆** — 每个网站的开关状态独立记忆，刷新页面不丢失
- 🌐 **全站适用** — 匹配 `<all_urls>`，几乎支持所有网站
- 💡 **非侵入式** — 通过注入 CSS 类名实现，不修改原站代码，随时可关闭

## 📸 截图

> 安装后，浏览器工具栏会出现一个 🌓 图标，点击即可弹出控制面板。

## 🚀 安装方法

### 方法一：从 Release 安装（即将推出）
前往 [Releases 页面](https://github.com/suyongqihhh/dark-mode-toggle-extension/releases) 下载打包好的 `.crx` 或 `.zip` 文件。

### 方法二：从源码安装（推荐）
1. 克隆本仓库到本地：
   ```bash
   git clone https://github.com/suyongqihhh/dark-mode-toggle-extension.git
   ```
2. 打开 Chrome / Edge / 360 浏览器，进入扩展管理页面：
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. 开启右上角的「**开发者模式**」
4. 点击「**加载已解压的扩展**」，选择本项目文件夹
5. 完成！🌓 图标会出现在工具栏上

## 📖 使用方法

| 操作 | 方式 |
|------|------|
| 切换当前网页 | 点击工具栏 🌓 图标，在弹出窗口中拨动开关 |
| 全局快捷键 | 按 `Ctrl + Shift + D`（可在浏览器快捷键设置中修改）|
| 快捷打开网站 | 弹出窗口底部有百度/GitHub/知乎/B站 快捷按钮 |
| 关闭深色模式 | 再次点击开关或按快捷键即可恢复 |

## 🛠️ 技术实现

- **Manifest V3** — 使用最新的 Chrome 扩展规范
- **Content Script 注入** — 向页面注入 CSS 类名 `dmt-dark`，通过 CSS 变量实现全局深色主题
- **网站适配规则** — 在 `content.js` 中针对百度、知乎、B站等网站编写了定点适配规则
- **Service Worker 后台** — `background.js` 处理全局快捷键和消息传递
- **Storage Sync** — 使用 `chrome.storage.sync` 跨设备同步开关状态

## 📁 项目结构

```
dark-mode-toggle-extension/
├── manifest.json          # 扩展配置（Manifest V3）
├── content.js             # 注入页面的深色模式逻辑（301行）
├── popup.html             # 弹出窗口 UI
├── popup.js               # 弹出窗口交互逻辑
├── background.js          # 后台 Service Worker
├── icons/
│   ├── icon16.png        # 16x16 图标
│   ├── icon48.png        # 48x48 图标
│   └── icon128.png       # 128x128 图标
├── gen_icons.py          # 图标生成脚本（Pillow）
├── gen_icons_aa.py       # 图标生成脚本（抗锯齿版）
└── gen_icons_v2.py       # 图标生成脚本 v2
```

## 🌐 支持的网站（深度适配）

| 网站 | 适配情况 |
|------|----------|
| 百度（搜索/贴吧/知道） | ✅ 完整适配 |
| 知乎 | ✅ 完整适配 |
| B站（哔哩哔哩） | ✅ 完整适配 |
| GitHub | ✅ 完整适配 |
| 其他网站 | ✅ 通用深色模式 |

> 如果你的常用网站显示效果不理想，欢迎提交 Issue 或 PR！

## 🤝 贡献

欢迎贡献代码、报告 Bug 或提出新功能建议！

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- 图标设计：使用 Python Pillow 自动生成
- 灵感来源：各主流浏览器的深色模式实现

---

## English

### 🌓 Dark Mode Toggle Pro

One-click toggle dark/light mode for all websites, with deep adaptation for Baidu, Zhihu, Bilibili and more.

### Features

- One-click toggle via popup
- Global shortcut: `Ctrl + Shift + D`
- Smart CSS injection with site-specific rules
- Per-site state memory (via `chrome.storage.sync`)
- Works on `<all_urls>`

### Install from source

1. Clone this repo
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the folder
5. Done! The 🌓 icon appears in your toolbar.

### Contributing

PRs welcome! Feel free to open issues for bugs or feature requests.

---

⭐ If you like this extension, please give it a star!