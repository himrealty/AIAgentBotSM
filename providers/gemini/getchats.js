(async () => {
  await new Promise(r => setTimeout(r, 500));
  const allItems = document.querySelectorAll('a.gem-nav-list-item');
  
  const chats = [];
  for (const item of allItems) {
    const href = item.getAttribute('href');
    if (href && href.startsWith('/app/') && href !== '/app') {
      const titleSpan = item.querySelector('.title-text');
      const title = titleSpan ? titleSpan.textContent.trim() : 'Untitled';
      chats.push({ index: chats.length, title, href });
    }
  }
  
  await chrome.storage.local.set({ tempOutput: JSON.stringify(chats, null, 2) });
})();