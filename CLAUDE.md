# JiduOS 官网 — 交接文档（务必先读完再动手）

抖音主播「极度调试」的电竞优化服务官网。所有改动都要**能上线、不把站改崩**。

## 项目结构

- 独立 git 仓库，**分支是 `main`**（不是 master）。commit 后 `git push origin main` = 自动部署 GitHub Pages → CNAME `jiduos.cn` → Cloudflare CDN（**缓存 4 小时**）。
- 5 个页面（**全部单行压缩，无源文件，禁止用编辑工具改它们**）：
  - `index.html`（首页）、`pricing.html`、`cases.html`、`contact.html`、`404.html`
- 外部文件（**所有新增视觉/动效都放这里**）：
  - `enhance.css` — 全站增强层，覆盖内联 CSS。**唯一允许改的样式文件**。
  - `starfield.js` — Canvas 2D 星座网络背景（300 粒子+连线+视差），自建 canvas。
  - `typing.js`、`utils.js`、`sw.js` — 小工具 / Service Worker。

## 铁律（违反 = 整站崩，已回滚 5 次）

1. **绝不直接编辑压缩 HTML 里的内联 `<style>` / `<script>`**。一个字符错全站白屏。
2. 新视觉 → 写进 `enhance.css`；新交互 → 写独立 `.js`；需要时在 HTML 里**只加一行引用**（`<link>` 或 `<script src>`），且这一行要在**最后一个 `</body>` 之前**（除非是样式，放 `<head>`）。
3. 每次改完 HTML 都要验证 div 配对（哪怕只加了一行）：
   ```
   node -e "const h=require('fs').readFileSync('index.html','utf8');const o=(h.match(/<div[ >]/g)||[]).length,c=(h.match(/<\/div>/g)||[]).length;console.log(o,c,o===c)"
   ```
   同理验证 CSS 花括号配平。
4. **绝不在宿主机跑会改系统的脚本**。只做静态站文件改动 + 本地渲染验证。
5. 不要 `git add -A`（会误加 node_modules）。用 `git add` 指定文件。
6. 不要动 `node_modules/`、`.git/`。
7. **绝不写 `html{overflow-x:hidden}` 或 `overflow-x:clip`**(2026-08-05 事故:Chromium 中 html 上任何非 visible 的 overflow-x 会把滚动容器从视口切到 html 元素,导致滚轮滚动失效,线上回滚级事故)。横向溢出必须修根因(如 `.page-hero::before` 用 `width:min(500px,70vw)`),禁止用 html overflow 兜底。
8. **CSS 改动验证清单**(改 enhance.css 后全跑):a) `scrollWidth` 无横向溢出;b) Playwright 真实滚轮输入 `page.mouse.wheel` 后 `scrollY>0`(程序化 `scrollTo` 不能替代);c) 键盘 `End` 键可滚动;d) div 配对 + 花括号平衡。
9. **push 后 Cloudflare CDN 缓存 4 小时**:`cf-cache-status: HIT` 时用户 Ctrl+Shift+R 绕不过边缘缓存,需 Cloudflare 手动 Purge Cache 或明确告知等待,不要误判为改动没生效。

## 设计令牌（enhance.css `:root` / 内联 `:root`）

- 品牌青 `--cyan:#0cf`，金色 `--gold:#d4a840`，深底 `--bg:#030609`，亮色主题 `data-theme="light"`。
- 字体：标题/正文 `'Inter','Noto Sans SC','Microsoft YaHei'`；展示数字 Space Grotesk。
- 缓动：`--ease-spring` `--ease-smooth` `--ease-out-expo`。
- 卡片风格：极简 1px 细边 `rgba(255,255,255,.04)`、16px 圆角、无阴影、悬停微抬。对标 championos，不是大红大紫。

## 审美方向（2026-07-30 之后确立）

「**精度仪器面板**」路线，不是游戏风霓虹：
- 工程网格背景、极光渐变、边缘光晕、卡片内凹高光
- HUD 角括号、section 顶部刻度线、hero 统计项上方居中刻度
- 少动效：滚动渐显（`.fade-up`/`.fade-up.show`，内联 CSS 已有，IntersectionObserver 触发）、按钮流光、微抬悬停
- 金色只用于极少量点缀（如数字发光），青色为主

## 当前状态

- 最近完成：hero 3 个统计项刻度对齐修复、case 徽章日期（2026.06/2026.07）恢复（此前被 tagSweep 覆盖）。
- hero 左侧大标题 + 3 个统计项（计数器动画，`data-target` + `data-suffix`）+ 3 个 CTA。
- 导航透明、preloader（微信/QQ 浏览器跳过）、主题切换、SW/PWA 都已就绪。
- 详情见 `findings.md`（竞品/设计研究）、`progress.md`（会话日志）、`task_plan.md`（阶段表）。

## 本地预览 & 验证

- 起本地服务：`node -e "require('http').createServer((q,s)=>{const fs=require('fs'),p=require('path'),f='.'+p.normalize(decodeURIComponent(q.url.split('?')[0]));f==='./'&&(f='./index.html');try{s.end(fs.readFileSync(f))}catch{s.end('nf')}}).listen(8899,()=>console.log('http://127.0.0.1:8899'))"`
- Playwright 在 `node_modules/playwright`，浏览器用 Edge：`executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'`（chromium 壳未装）。headless 截图+查 console 错误验证。

## 日常维护

- 每天跑百度推送：`cd d:/AI && node _baidu-push.js`（token 在 memory，此站无操作可跳过）
- 上线后提醒用户 Ctrl+Shift+R 强刷（CDN 4h 缓存，或 Cloudflare 手动清缓存）。
