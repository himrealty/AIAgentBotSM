(async () => {
  const { tempMessage } = await chrome.storage.local.get('tempMessage');
  if (!tempMessage) throw new Error('No message');

  // Step 1 — snapshot current response count
  const before = document.querySelectorAll('p.font-claude-response-body').length;

  // Step 2 — type message
  const editor = document.querySelector('[data-testid="chat-input"]');
  if (!editor) throw new Error('Chat input not found');
  editor.focus();
  document.execCommand('insertText', false, tempMessage);
  await new Promise(r => setTimeout(r, 300));

  // Step 3 — send
  const sendBtn = document.querySelector('button[aria-label="Send message"]');
  if (!sendBtn) throw new Error('Send button not found');
  sendBtn.click();

  // Step 4 — wait for a NEW response paragraph to appear
  const getNewResponse = () => {
    const paras = document.querySelectorAll('p.font-claude-response-body');
    return paras.length > before ? paras[paras.length - 1]?.innerText : null;
  };

  let appeared = false;
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (getNewResponse()) { appeared = true; break; }
  }
  if (!appeared) throw new Error('Timeout waiting for response to appear');

  // Step 5 — wait for response to stabilize (stop streaming)
  let last = '';
  let stable = 0;
  while (stable < 3) {
    await new Promise(r => setTimeout(r, 1000));
    const current = getNewResponse();
    if (current === last) stable++;
    else { stable = 0; last = current; }
  }

  await chrome.storage.local.set({ tempOutput: last || '(no response)' });
})();
