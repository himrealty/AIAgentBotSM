(async () => {
  const newChatBtn = document.querySelector('a[href="/app"]');
  if (!newChatBtn) throw new Error('New chat button not found');
  
  newChatBtn.click();
  await new Promise(r => setTimeout(r, 1500));
  
  const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
  if (!editor) throw new Error('Editor not ready after new chat');
  
  await chrome.storage.local.set({ tempOutput: 'New chat created successfully' });
})();