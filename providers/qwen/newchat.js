/**
 * Qwen New Chat
 * @param {Object} context - Execution context
 * @returns {Promise<Object>} - Result object
 */
(async (context = {}) => {
  const btn = document.querySelector('div.sidebar-entry-fixed-list-content');
  if (!btn) throw new Error('New chat button not found');
  btn.click();
  await new Promise(r => setTimeout(r, 500));
  return { ok: true };
})();