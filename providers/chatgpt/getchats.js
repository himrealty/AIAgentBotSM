(async () => {
  const items = document.querySelectorAll('a[href*="/c/"]');
  const result = Array.from(items).map((el, idx) => ({
    index: idx,
    title: el.querySelector('span[dir="auto"]')?.innerText?.trim() || 'Untitled',
    href: el.getAttribute('href') || ''
  }));
  await chrome.storage.local.set({ tempOutput: JSON.stringify(result) });
})();