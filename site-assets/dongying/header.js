/* The copied source initializes contact.html as its company column. */
(() => {
  const markContact = () => {
    if (!location.pathname.endsWith('/contact.html')) return;
    document.querySelectorAll('#navCenter .item').forEach(item => {
      for (const name of [...item.classList]) if (name.startsWith('itemSelected')) item.classList.remove(name);
    });
    document.getElementById('navContact')?.classList.add('itemSelected');
    document.querySelector('#navContact a')?.setAttribute('aria-current', 'page');
  };
  document.addEventListener('DOMContentLoaded', markContact);
  window.addEventListener('load', markContact);
})();
