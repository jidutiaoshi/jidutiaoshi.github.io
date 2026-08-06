/* JiduOS 客户案例数据 — 新增案例只需在 CASES 数组加一项 */
const CASES = [
  {
    "img": "/case-shot-1.jpg",
    "badge": "EXTREME",
    "badgeClass": "badge-extreme",
    "date": "2026.07",
    "title": "605 帧 · 57°C · <span class=\"hl\">零掉帧</span>",
    "specs": [
      "12600KF",
      "RTX 5060",
      "32G 3600MHz"
    ],
    "data": [
      {
        "n": "605 FPS",
        "nClass": "",
        "l": "优化后帧率"
      },
      {
        "n": "57°C",
        "nClass": "up",
        "l": "满载温度"
      }
    ],
    "desc": "帧率翻了 4 倍，温度仅 57°C。客户原话:\"可以，非常nice，帧率也上去了\""
  },
  {
    "img": null,
    "badge": "PRO",
    "badgeClass": "badge-pro",
    "date": "2026.06",
    "title": "Low帧 <span class=\"hl\">+87%</span>，团战纹丝不动",
    "specs": [
      "12600KF",
      "RTX 5060",
      "32G 3600MHz",
      "电竞优化 ¥199"
    ],
    "data": [
      {
        "n": "80-150",
        "nClass": "",
        "l": "优化前 FPS"
      },
      {
        "n": "150-200",
        "nClass": "up",
        "l": "优化后 FPS"
      }
    ],
    "desc": "三角洲行动 · 团战/爆破/烟雾弹——帧率纹丝不动。客户:\"帧率高了30到40帧很稳定\""
  },
  {
    "img": "/case-shot-2.jpg",
    "badge": "ULTRA",
    "badgeClass": "badge-ultra",
    "date": "2026.07",
    "title": "631 帧 · 65°C · <span class=\"hl\">拉满不炸</span>",
    "specs": [
      "极限特调 ¥268",
      "系统重装",
      "驱动精调"
    ],
    "data": [
      {
        "n": "100-180",
        "nClass": "",
        "l": "优化前 FPS"
      },
      {
        "n": "631",
        "nClass": "up",
        "l": "优化后 FPS"
      }
    ],
    "desc": "帧率 +250%，长时间游戏不掉帧"
  },
  {
    "img": null,
    "badge": "BASIC",
    "badgeClass": "badge-basic",
    "date": "2026.05",
    "title": "温度 <span class=\"hl\">-8°C</span>，帧率 +30%",
    "specs": [
      "笔记本 RTX 4060",
      "系统优化 ¥100"
    ],
    "data": [
      {
        "n": "85°C",
        "nClass": "hot",
        "l": "优化前温度"
      },
      {
        "n": "77°C",
        "nClass": "up",
        "l": "优化后温度"
      }
    ],
    "desc": "后台进程少了、CPU不空转，发热量就下来了。不撞温度墙，帧率自然稳。"
  },
  {
    "img": "/case-thermal.jpg",
    "badge": "DIAGNOSE",
    "badgeClass": "badge-diagnose",
    "date": "2026.06",
    "title": "疑难杂症 · <span class=\"hl\">逐个击破</span>",
    "specs": [
      "诊断 ¥100 起",
      "修不好不收费"
    ],
    "data": [
      {
        "n": "i7+3070",
        "nClass": "",
        "l": "掉帧修复"
      },
      {
        "n": "蓝屏",
        "nClass": "",
        "l": "驱动冲突"
      },
      {
        "n": "鼠标飘",
        "nClass": "",
        "l": "MSI中断"
      }
    ],
    "desc": "内存时序优化 · DDU清理驱动 · 40档精调 · MSI中断优化 · 命中率 30%→55%"
  }
];

/* 渲染:页面加载后用数据生成案例卡片(覆盖写死内容;写死 DOM 保留供无 JS 爬虫) */
(function renderCases() {
  const grid = document.querySelector('.cases-grid');
  if (!grid || typeof CASES === 'undefined' || !CASES.length) return;
  grid.innerHTML = CASES.map(function (c) {
    var img = c.img
      ? '<div class="case-card-img"><img loading="lazy" decoding="async" src="' + c.img + '" alt="案例截图"></div>'
      : '';
    var badge = '<div class="case-card-badge ' + c.badgeClass + '" data-date="' + c.date + '">' + c.badge + '</div>';
    var specs = c.specs.map(function (s) { return '<span>' + s + '</span>'; }).join('');
    var data = c.data.map(function (d) {
      return '<div class="cd"><div class="cd-n' + (d.nClass ? ' ' + d.nClass : '') + '">' + d.n + '</div><div class="cd-l">' + d.l + '</div></div>';
    }).join('');
    return '<div class="case-card">' + img +
      '<div class="case-card-body">' + badge +
      '<h3>' + c.title + '</h3>' +
      (specs ? '<div class="case-card-spec">' + specs + '</div>' : '') +
      (data ? '<div class="case-card-data">' + data + '</div>' : '') +
      '<p class="case-card-desc">' + c.desc + '</p></div></div>';
  }).join('');
})();
