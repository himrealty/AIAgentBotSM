/**
 * Gemini Go To Chat
 * @param {Object} context - Execution context
 * @param {number} context.chatIndex - Index of chat to open
 * @returns {Promise<string>} - Result message
 */
(async (context = {}) => {
  const targetIndex = parseInt(context.chatIndex) || 0;

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
      return `Switched to chat ${targetIndex}: ${title}`;
    }
  }
  throw new Error('Editor not ready after loading chat');
})();
