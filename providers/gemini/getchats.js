/**
 * Gemini Get Chats List
 * @param {Object} context - Execution context
 * @returns {Promise<Array>} - Array of chat objects
 */
(async (context = {}) => {
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

  return chats;
})();
