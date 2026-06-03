(async () => {
  const chats = [...document.querySelectorAll('a[href*="/chat/"]')];
  if (!chats.length) throw new Error('No chats found');

  const list = chats.map((el, i) => {
    const title = el.querySelector('span.sr-only')?.innerText?.trim() || `Chat ${i}`;
    const href = el.href;
    return `${i}: ${title} (${href})`;
  });

  await chrome.storage.local.set({ tempOutput: list.join('\n') });
})();
