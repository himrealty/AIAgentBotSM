/**
 * Claude Get Chats List
 * @param {Object} context - Execution context
 * @returns {Promise<string>} - Formatted list of chats
 */
(async (context = {}) => {
  const chats = [...document.querySelectorAll('a[href*="/chat/"]')];
  if (!chats.length) throw new Error('No chats found');

  return chats.map((el, i) => {
    const title = el.querySelector('span.sr-only')?.innerText?.trim() || `Chat ${i}`;
    const href = el.href;
    return `${i}: ${title} (${href})`;
  }).join('\n');
})();
