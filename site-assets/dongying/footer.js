/* Keep the footer readable when the original fixed-width page scrolls sideways. */
(() => {
  const footer = document.getElementById('dongying-footer');
  if (!footer) return;
  let pending = false;
  const align = () => {
    footer.style.transform = `translateX(${window.scrollX}px)`;
    pending = false;
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(align); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  align();
})();
