(async () => {
  const data = await chrome.storage.local.get('tempChatIndex');
  const targetIndex = data.tempChatIndex || 0;
  
  await new Promise(r => setTimeout(r, 500));
  const allItems = document.querySelectorAll('a.gem-nav-list-item');
  
  const validChats = [];
  for (const item of allItems) {
    const href = item.getAttribute('href');
    if (href && href.startsWith('/app/') && href !== '/app') {
      validChats.push(item);
    }
  }
  
  if (targetIndex >= validChats.length) {
    throw new Error(`Chat index ${targetIndex} not found. Only ${validChats.length} chats available`);
  }
  
  const titleSpan = validChats[targetIndex].querySelector('.title-text');
  const title = titleSpan ? titleSpan.textContent.trim() : 'Untitled';
  validChats[targetIndex].click();
  
  // Wait for editor to load
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
    if (editor) {
      await chrome.storage.local.set({ tempOutput: `Switched to chat ${targetIndex}: ${title}` });
      return;
    }
  }
  throw new Error('Editor not ready after loading chat');
})();