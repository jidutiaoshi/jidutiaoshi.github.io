# JiduOS 官网打磨计划

## 目标
全站 UI/UX 升级：视觉设计、功能完整性、内容准确性。5 页（index/pricing/cases/contact/404）。

## 阶段

| # | 阶段 | 状态 | 负责技能 |
|---|------|------|---------|
| 1 | 建立规划文件 | complete | planning-with-files |
| 2 | 自动化视觉审计 | complete | webapp-testing (CDP JSON问题,改用先前诊断数据) |
| 3 | 设计令牌+签名元素 | in_progress | frontend-design |
| 4 | Bug 修复 | pending | debug |
| 5 | 实施改进 | pending | — |
| 6 | 验证部署 | pending | — |

## 审计结果 (来自先前诊断)
- 全站 accent: #0cf ✅
- 全站 div 平衡 ✅
- 图片加载正常 ✅
- 旧96项已清除 ✅
- 内容含111+/14色/v2.1 ✅

## 当前状态
- 暗色主题 (#030609) + 青色强调 (#0cf)
- Noto Sans SC + Space Grotesk 字体
- 3D 透视粒子星场背景
- 左对齐 Hero，静态标题，仪器读数风格数据
- 全站 div/CSS 括号平衡 ✅
- 已去 section 编号 ✅

## 已知问题
- CDN 缓存 4 小时，导致用户刷新看不到更新
- `body::after` 噪音网格已移除但需验证
- 主题切换 JS 需验证正确性

## 遇到的错误
| 错误 | 尝试次数 | 解决方案 |
|------|---------|---------|
| WebGL 星场失败 | 4 | 改用 Canvas 2D 3D 投影 |
| CSS 编辑损坏页面 | 多次 | 改用外部文件 + node 脚本 |
| body::after noise 去不掉 | 3 | 最终用 !important 覆盖 |
| 红色残留 | 2 | 逐个搜索替换 |
| CDN 缓存用户看不到更新 | N/A | 指导 Ctrl+Shift+R |
