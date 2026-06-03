/**
 * Claude Go To Chat
 * @param {Object} context - Execution context
 * @param {number} context.chatIndex - Index of chat to open
 * @returns {Promise<string>} - Result message
 */
(async (context = {}) => {
  const index = parseInt(context.chatIndex) || 0;

  const chats = [...document.querySelectorAll('a[href*="/chat/"]')];
  if (!chats.length) throw new Error('No chats found');
  if (index >= chats.length) throw new Error(`Chat index ${index} out of range (${chats.length} chats)`);

  const target = chats[index];
  const title = target.querySelector('span.sr-only')?.innerText?.trim() || `Chat ${index}`;
  target.click();

  // Wait for input to be ready
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    if (document.querySelector('[data-testid="chat-input"]')) break;
  }

  return `navigated to: ${title}`;
})();
