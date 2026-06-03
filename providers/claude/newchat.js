/**
 * Claude New Chat
 * @param {Object} context - Execution context
 * @returns {Promise<string>} - Result message
 */
(async (context = {}) => {
  const btn = document.querySelector('a[aria-label="New chat"]');
  if (!btn) throw new Error('New chat button not found');
  btn.click();

  // Wait for input to be ready
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (document.querySelector('[data-testid="chat-input"]')) break;
  }

  return 'new chat opened';
})();
