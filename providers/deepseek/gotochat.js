/**
 * DeepSeek Go To Chat
 * @param {Object} context - Execution context
 * @param {number} context.chatIndex - Index of chat to open
 * @returns {Promise<Object>} - Result object with title
 */
(async (context = {}) => {
  const index = parseInt(context.chatIndex) || 0;

  const chats = document.querySelectorAll('a._546d736');
  if (index >= chats.length) {
    return { error: `Index ${index} out of range. Max: ${chats.length - 1}` };
  }

  chats[index].click();
  await new Promise(r => setTimeout(r, 500));

  const title = chats[index].querySelector('div.c08e6e93')?.innerText?.trim();
  return { ok: true, index, title };
})();
