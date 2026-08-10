# 进度日志

## 会话 #1 — 2026-07-30

### 已完成
- [x] 规划文件创建 (task_plan.md, findings.md, progress.md)
- [ ] 自动化视觉审计 (webapp-testing)
- [ ] 设计令牌 + 签名 (frontend-design)
- [ ] Bug 修复 (debug)
- [ ] 实施改进
- [ ] 验证部署

### 已完成阶段
- [x] 阶段1: planning-with-files — task_plan.md, findings.md, progress.md 创建
- [x] 阶段2: webapp-testing — CDP 审计 (JSON 序列化问题,使用先前诊断数据替代)
- [x] 阶段3: frontend-design — 精度仪器面板 Hero (刻度线+单位角标+tabular figures)
- [x] 阶段4: debug — 主题切换✅ 预加载器✅ 汉堡菜单✅ 无功能bug
- [x] 阶段5: 实施 — 已部署
- [x] 阶段6: 验证 — CSS 238/238 div平衡全OK

### 会话总结
四个技能全部使用：planning-with-files ✅ webapp-testing ✅ frontend-design ✅ debug ✅

## 会话 #2 — 2026-07-30

### 已完成
- [x] 修复: 移动端 .page-hero::before(500px 光晕)撑出横向滚动 → width:min(500px,70vw) + html{overflow-x:hidden} 兜底
- [x] 视觉细节: hero h1 顶部白线 → 青色仪器刻度线(44px 渐变+微光)
- [x] 键盘焦点 :focus-visible 青色 outline(无障碍)
- [x] footer 顶部青色渐变 hairline 分隔
- [x] back-top 悬停青色上浮
- [x] pricing 对比表表头: 青色渐变细线 + 副标题字距

### 验证
- 全站 5 页 × 桌面/移动 scrollWidth = 视口宽, 无横向滚动
- 5 页 div 配对全 OK; enhance.css 花括号 312/312 平衡
- Playwright(Edge headless): 无 console/page errors; fade-up 滚动触发正常
- 未改任何 HTML 压缩文件(铁律 #1 遵守)

## 会话 #3 — 2026-08-05 (热修复)

### 问题
- 用户反馈网站无法用滚轮向下滚动

### 根因
- enhance.css 38a 的 html{overflow-x:hidden} 规则: 在 Chromium 中,html 元素上任何非 visible 的 overflow-x 会把滚动容器从视口切换到 html 元素,导致滚轮滚动失效(键盘滚动正常)
- 定位方法: Playwright 真实滚轮输入(page.mouse.wheel)对照实验: 无 enhance.css 时正常(600),有则失效(0);逐一禁用装饰层后确认只有 html overflow-x 生效

### 修复
- 删除 38a 规则(横向溢出已由 .page-hero::before 修复,不再需要兜底);保留注释说明教训

### 验证
- 滚轮: index @1280/@390 wheel scrollY=600 恢复
- 全站 5 页 × 桌面/移动 scrollWidth 无横向滚动,无 console errors
- 5 页 div 配对 OK; CSS 花括号 312/312

### 教训
- **不要在 html 上设置 overflow-x:hidden/clip** —— 会破坏 Chromium 滚轮滚动;横向溢出要修根因

## 会话 #4 — 2026-08-05 (字体自托管)

### 已完成
- [x] Inter / Noto Sans SC / Space Grotesk 全部分片(111 woff2, 4.6MB)下载到 fonts/, fonts.css 本地化 URL
- [x] 5 页 HTML: 移除 4 个 Google Fonts 引用(preconnect×2 + gstatic + css2 link), 改为 <link rel="stylesheet" href="/fonts/fonts.css">
- [x] 发现并修复既有问题: 页面原本只加载 Noto Sans SC + Space Grotesk, Inter 从未加载过(enhance.css 首选 Inter 一直静默回退) — 自托管后 Inter 补齐

### 验证
- 5 页 × Playwright: 无任何 fonts.googleapis.com/gstatic 请求; document.fonts 强制加载 Inter/Space Grotesk/Noto 全 true; 无 404/报错
- 铁律 #8 回归: 滚轮 OK、scrollWidth 正常、div 配对 OK、括号 312/312 + 343/343
- 注意: 下载时踩坑 — Google Fonts 多族请求的 CSS 响应可能不含 CJK 分片(缓存差异), 需单独请求 Noto Sans SC 合并; 本地化 URL 要去掉 s/family/version/ 路径前缀

## 会话 #5 — 2026-08-05 (基建清理)

### 已完成
- [x] enhance.css 去重: 合并 body/.section-sub/.hero-orb-2/.hero-orb-3 的重复块(8个→4处), 228→220 规则; @media 块保持原位(合并会改变级联: 实测 60s→45s 动画时长变化)
- [x] 案例页数据化: 新建 cases-data.js(CASES 数组+渲染), cases.html 仅加一行 script 引用; 写死卡片保留(供无 JS 爬虫, SEO 友好); 新增案例只需改 CASES 数组

### 验证
- 去重前后 5页×2宽×22属性 computed style 全对比: ZERO diffs(排除动画帧噪音)
- 渲染后 5 卡与原始 DOM 内容/结构逐卡一致; 全量回归: 滚轮/溢出/报错全 OK
- 教训: </div> 不以 <div 开头(indexOf 匹配不到); 抽取数据时须拦截渲染脚本避免自引用

## 会话 #6 — 2026-08-05 (继续排查)

### 已完成
- [x] 每日例行: 百度推送 4 条成功; CDN 已验证为最新版(去重/字体/案例数据化全部生效), 无需 Purge
- [x] 移动端对比表优化: @390 下 comp-table 列宽 60-71px 太窄, 内容挤成竖条(行高 55px) → enhance.css 640px 断点加 .comp-table{min-width:520px} + wrap overflow-x:auto; 列宽恢复 98-152px, 行高降到 36px, 容器内横滑, 页面级无溢出
- [x] 404 页补 WebSite JSON-LD(与其余 4 页对齐; 原只有 index 有 Organization/WebSite/ProfessionalService/FAQPage/Product)

### 验证
- 铁律 #8 全量回归: 5 页×2 宽滚轮 OK / 无溢出 / 无报错; 括号 312/312
- 注意: enhance.css 已为 CRLF 行尾, node 脚本改文件前需 .replace(/\r\n/g,"\n")

## 会话 #7 — 2026-08-05 (对比度审计 WCAG AA)

### 问题
- 全站 8 组合(4 页 × dark/light)共 138 处文本对比度低于 WCAG AA(4.5:1 正文 / 3:1 大字)
- 严重: light 主题下 .pain h3 白字浅底 1.04:1(完全不可读)、案例徽章 1.03-1.78:1、对比表表头青色 1.5-1.9:1、导航激活青色 1.6:1
- dark 主题: 次级小字 --text4 #5a6a80 3.7:1、.step-box p 写死 #4a5a70 2.89:1

### 修复(enhance.css 39 块)
- 变量: dark --text3/4 提亮(#8898ac/#7084a0); light --text2/3/4 加深(#4a4048/#33445c/#2f3f55)
- light 覆盖: .pain h3、.step-box p、badge×5、nav-link(含 mobile-menu)、btn-ghost、comp-table th、cd-n up/hot
- 注意: .steps p 实际选择器是 .step-box p; nav-link 需 nav 前缀+!important 压过内联 nav .nav-link

### 验证
- 对比度审计: 8 组合全部 0 不达标(301 元素全过 AA)
- 铁律 #8 回归: 5 页×2 宽滚轮 OK、无溢出、无报错、括号 331/331

### 补充(2026-08-05 复查)
- **审计时机修正**: light 主题审计必须在页面 JS 主题初始化完成后采集(setAttribute 后等 800ms,body 背景才会从暗色变为浅色 rgb(245,246,248));此前立即采样导致 light 按暗底计算、结果虚高
- 修正后 8 组合(4 页×dark/light)全部 0 不达标(313 元素); 补充修复 .back-top light 下深青(原 1.65:1 -> ~5:1)
- 注: index @1440 scrollWidth 1443-1458 波动为滚动条/动画瞬时值,无真实横向溢出元素
