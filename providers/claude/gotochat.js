(async () => {
  const { tempChatIndex } = await chrome.storage.local.get('tempChatIndex');
  const index = parseInt(tempChatIndex) || 0;

  const chats = [...document.querySelectorAll('a[href*="/chat/"]')];
  if (!chats.length) throw new Error('No chats found');
  if (index >= chats.length) throw new Error(`Chat index ${index} out of range (${chats.length} chats)`);

  const target = chats[index];
  const title = target.querySelector('span.sr-only')?.innerText?.trim() || `Chat ${index}`;
  target.click();

  // Wait for input to be ready
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (document.querySelector('[data-testid="chat-input"]')) break;
  }

  await chrome.storage.local.set({ tempOutput: `navigated to: ${title}` });
})();
