document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('footer-placeholder');
  if (!placeholder) return;

  try {
    const response = await fetch('footer.html');
    if (!response.ok) throw new Error(`Failed to load footer: ${response.statusText}`);
    placeholder.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
});
