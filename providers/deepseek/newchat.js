/**
 * DeepSeek New Chat
 * @param {Object} context - Execution context
 * @returns {Promise<Object>} - Result object
 */
(async (context = {}) => {
  const btn = document.querySelector('div._5a8ac7a.a084f19e');
  if (!btn) {
    return { error: 'New chat button not found' };
  }
  btn.click();
  await new Promise(r => setTimeout(r, 500));
  return { ok: true, action: 'newchat' };
})();
