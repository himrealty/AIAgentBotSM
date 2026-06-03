/**
 * DeepSeek Get Chats List
 * @param {Object} context - Execution context
 * @returns {Promise<Array>} - Array of chat objects
 */
(async (context = {}) => {
  const chats = document.querySelectorAll('a._546d736');
  if (!chats.length) {
    return [];
  }
  return Array.from(chats).map((chat, index) => ({
    index,
    title: chat.querySelector('div.c08e6e93')?.innerText?.trim() || 'No title',
    href:  'https://chat.deepseek.com' + chat.getAttribute('href')
  }));
})();
