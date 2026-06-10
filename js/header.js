document.addEventListener('DOMContentLoaded', async () => {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isChinesePage = currentPage.includes('_cn');
  const headerFile = isChinesePage ? 'header_cn.html' : 'header.html';

  const pageMap = {
    'index.html': 'index_cn.html',
    'product.html': 'product_cn.html',
    'solution.html': 'solution_cn.html',
    'news.html': 'news_cn.html',
    'company.html': 'company_cn.html',
    'contact.html': 'contact_cn.html'
  };

  try {
    const response = await fetch(headerFile);
    if (!response.ok) throw new Error(`Failed to load header: ${response.statusText}`);

    placeholder.innerHTML = await response.text();

    const navLinks = placeholder.querySelectorAll('nav a');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });

    const langButtons = placeholder.querySelectorAll('[data-lang]');
    const currentLang = isChinesePage ? 'cn' : 'ja';

    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const requestedLang = button.dataset.lang;
        if (requestedLang === currentLang) return;

        let targetPage;
        if (requestedLang === 'cn') {
          targetPage = pageMap[currentPage] || 'index_cn.html';
        } else {
          targetPage = Object.keys(pageMap).find(key => pageMap[key] === currentPage) || 'index.html';
        }

        window.location.href = targetPage;
      });
    });
  } catch (error) {
    console.error(error);
  }
});
