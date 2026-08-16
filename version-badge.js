/* JiduOS 版本徽标 — 动态读取 version.json,发版只改 version.json,网站自动跟随显示当前版本
   按官网铁律:新交互放独立 .js,不碰压缩 HTML 内联 style/script */
(function () {
  'use strict';
  var title = document.querySelector('.download-box .dl-name');
  if (!title) return;
  fetch('version.json')
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (!data || !data.version) return;
      var badge = document.createElement('span');
      badge.className = 'version-badge';
      badge.textContent = 'v' + data.version;
      title.appendChild(badge);
    })
    .catch(function () { /* 静默失败,不显示徽标 */ });
})();
