/**
 * ChatGPT Go To Chat
 * @param {Object} context - Execution context
 * @param {number} context.chatIndex - Index of chat to open
 * @returns {Promise<Object>} - Result object
 */
(async (context = {}) => {
  const idx = parseInt(context.chatIndex) || 0;
  const items = document.querySelectorAll('a[href*="/c/"]');
  
  if (!items.length) throw new Error('No chats found');
  if (idx >= items.length) throw new Error(`Index ${idx} out of range (max ${items.length - 1})`);
  
  items[idx].click();
  await new Promise(r => setTimeout(r, 500));
  
  return { ok: true, index: idx };
})();