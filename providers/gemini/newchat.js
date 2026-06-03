/**
 * Gemini New Chat
 * @param {Object} context - Execution context
 * @returns {Promise<string>} - Result message
 */
(async (context = {}) => {
  const newChatBtn = document.querySelector('a[href="/app"]');
  if (!newChatBtn) throw new Error('New chat button not found');

  newChatBtn.click();
  await new Promise(r => setTimeout(r, 1500));

  const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
  if (!editor) throw new Error('Editor not ready after new chat');

  return 'New chat created successfully';
})();
