(async () => {
  const btn = document.querySelector('[data-testid="create-new-chat-button"]');
  if (!btn) throw new Error('New chat button not found');
  btn.click();
  await new Promise(r => setTimeout(r, 500));
  await chrome.storage.local.set({ tempOutput: JSON.stringify({ ok: true }) });
})();