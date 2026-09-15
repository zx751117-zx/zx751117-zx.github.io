/* Generated from footer.html by scripts/build-layout.cjs. */
(() => {
  const script = document.currentScript;
  const root = new URL('../../', script.src).href;
  const template = document.createElement('template');
  template.innerHTML = "<footer id=\"dongying-footer\">\r\n  <div class=\"container\">\r\n    <div class=\"footer-grid\">\r\n      <div>\r\n        <div class=\"footer-title\"><img src=\"{{ROOT}}site-assets/dongying/logo.png\" alt=\"DONGYING ロゴ\" class=\"footer-logo\"></div>\r\n        <p>融合通信の未来をつなぐ</p>\r\n      </div>\r\n\r\n      <div class=\"footer-links\"></div>\r\n\r\n      <div class=\"footer-contact\">\r\n        <p>京都本社：〒610-1102 京都府京都市西京区御陵大枝山町1-17-12</p>\r\n        <p>電話：<a href=\"tel:0752030940\">075-203-0940</a></p>\r\n        <p>東京事務所：〒104-0041 東京都中央区新富1-13-24 LMベルコート新富町501室</p>\r\n        <p>メール：<a href=\"mailto:info@yinchung.com\">info@yinchung.com</a></p>\r\n      </div>\r\n\r\n\r\n    </div>\r\n\r\n    <div class=\"copy\">\r\n      Copyright © 2026 TOEISOSEI  CO., LTD\n    </div>\r\n  </div>\r\n</footer>\r\n".replaceAll('{{ROOT}}', root);
  if ("footer" === 'header') {
    const activeId = script.dataset.activeNav;
    template.content.querySelectorAll('#navCenter .item').forEach(item => {
      for (const name of [...item.classList]) if (name.startsWith('itemSelected')) item.classList.remove(name);
      item.querySelector('a')?.removeAttribute('aria-current');
      if (item.id === activeId) {
        item.classList.add('itemSelected');
        item.querySelector('a')?.setAttribute('aria-current', 'page');
      }
    });
  }
  script.after(template.content);
})();
