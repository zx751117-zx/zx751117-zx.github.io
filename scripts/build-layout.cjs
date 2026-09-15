const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

// HTML templates are the source of truth. Generated scripts are served directly
// by any static host, and insert the layout before the original page initializes.
for (const part of ['header', 'footer']) {
  const html = fs.readFileSync(path.join(root, `${part}.html`), 'utf8');
  const output = `/* Generated from ${part}.html by scripts/build-layout.cjs. */
(() => {
  const script = document.currentScript;
  const root = new URL('../../', script.src).href;
  const template = document.createElement('template');
  template.innerHTML = ${JSON.stringify(html)}.replaceAll('{{ROOT}}', root);
  if (${JSON.stringify(part)} === 'header') {
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
`;
  const target = path.join(root, 'site-assets', 'layout', `${part}.js`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
}
console.log('Built shared header and footer for all pages.');
