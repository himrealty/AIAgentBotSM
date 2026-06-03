/**
 * Qwen Get Chats List
 * @param {Object} context - Execution context
 * @returns {Promise<Array>} - Array of chat objects
 */
(async (context = {}) => {
  const items = document.querySelectorAll('a.chat-item-drag-link');
  return Array.from(items).map((el, idx) => ({
    index: idx,
    title: el.querySelector('.chat-item-drag-link-content-tip-text')?.innerText?.trim() || 'Untitled',
    href: el.getAttribute('href') || ''
  }));
})();