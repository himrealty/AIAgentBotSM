(async () => {
  const { tempChatIndex } = await chrome.storage.local.get('tempChatIndex');
  const idx = parseInt(tempChatIndex) || 0;
  const items = document.querySelectorAll('a[href*="/c/"]');
  
  if (!items.length) throw new Error('No chats found');
  if (idx >= items.length) throw new Error(`Index ${idx} out of range (max ${items.length - 1})`);
  
  items[idx].click();
  await new Promise(r => setTimeout(r, 500));
  
  await chrome.storage.local.set({ tempOutput: JSON.stringify({ ok: true, index: idx }) });
})();