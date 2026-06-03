// prompt.js
(async () => {
  const { tempMessage } = await chrome.storage.local.get('tempMessage');
  if (!tempMessage) throw new Error('No message to send');

  const editor = document.querySelector('#prompt-textarea');
  if (!editor) throw new Error('Editor not found');

  editor.focus();
  editor.innerText = tempMessage;
  editor.dispatchEvent(new Event('input', { bubbles: true }));

  await new Promise(r => setTimeout(r, 300));

  const sendBtn = document.querySelector('#composer-submit-button');
  if (!sendBtn) throw new Error('Send button not found');
  sendBtn.click();

  const getLatestAssistantMessage = () => {
    const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
    if (messages.length === 0) return null;
    const lastMsg = messages[messages.length - 1];
    const textDiv = lastMsg.querySelector('.markdown');
    return textDiv ? textDiv.innerText : null;
  };

  const beforeMsg = getLatestAssistantMessage();
  let lastText = '';
  let stableCount = 0;

  while (true) {
    await new Promise(r => setTimeout(r, 500));
    const currentMsg = getLatestAssistantMessage();
    if (currentMsg && currentMsg !== beforeMsg) {
      if (currentMsg === lastText && currentMsg.length > 10) {
        await chrome.storage.local.set({ tempOutput: currentMsg });
        break;
      }
      lastText = currentMsg;
    }
  }
})();