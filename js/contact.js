document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitButton = form ? form.querySelector('button[type="button"]') : null;

  if (!form || !submitButton) return;

  const currentPage = window.location.pathname.split('/').pop() || 'contact.html';
  const isChinesePage = currentPage.includes('_cn');

  submitButton.addEventListener('click', event => {
    event.preventDefault();

    const name = form.name.value.trim();
    const company = form.company.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      alert(isChinesePage ? '姓名、电子邮件和咨询内容为必填项。' : 'お名前・メールアドレス・お問い合わせ内容は必須です。');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert(isChinesePage ? '请输入有效的邮箱地址。' : '正しいメールアドレスを入力してください。');
      return;
    }

    const to = 'info@yinchung.com';
    const subject = encodeURIComponent(isChinesePage ? `咨询: ${name}` : `お問い合わせ: ${name}`);
    const body = encodeURIComponent(
      isChinesePage
        ? `姓名: ${name}\n\n公司名称: ${company || '无'}\n\n邮箱: ${email}\n\n咨询内容:\n${message}`
        : `お名前: ${name}\n\n会社名: ${company || 'なし'}\n\nメールアドレス: ${email}\n\nお問い合わせ内容:\n${message}`
    );

    const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  });
});
