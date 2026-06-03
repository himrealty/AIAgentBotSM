/**
 * ChatGPT Get Chats List
 * @param {Object} context - Execution context
 * @returns {Promise<Array>} - Array of chat objects
 */
(async (context = {}) => {
  const items = document.querySelectorAll('a[href*="/c/"]');
  return Array.from(items).map((el, idx) => ({
    index: idx,
    title: el.querySelector('span[dir="auto"]')?.innerText?.trim() || 'Untitled',
    href: el.getAttribute('href') || ''
  }));
})();