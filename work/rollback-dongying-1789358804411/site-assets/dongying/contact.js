/* The source Dongying form composes an email in the visitor's mail app. */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const field of ['name', 'email', 'message']) {
      const input = form.elements.namedItem(field);
      input.setCustomValidity(input.value.trim() ? '' : 'この項目を入力してください。');
    }
    if (!form.reportValidity()) return;
    const value = field => form.elements.namedItem(field).value.trim();
    const subject = encodeURIComponent(`お問い合わせ: ${value('name')}`);
    const body = encodeURIComponent(`お名前: ${value('name')}\n\n会社名: ${value('company') || 'なし'}\n\nメールアドレス: ${value('email')}\n\nお問い合わせ内容:\n${value('message')}`);
    window.location.href = `mailto:info@yinchung.com?subject=${subject}&body=${body}`;
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
});
