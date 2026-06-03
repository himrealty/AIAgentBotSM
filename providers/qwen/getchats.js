(async () => {
  const items = document.querySelectorAll('a.chat-item-drag-link');
  const result = Array.from(items).map((el, idx) => ({
    index: idx,
    title: el.querySelector('.chat-item-drag-link-content-tip-text')?.innerText?.trim() || 'Untitled',
    href: el.getAttribute('href') || ''
  }));
  await chrome.storage.local.set({ tempOutput: JSON.stringify(result) });
})();