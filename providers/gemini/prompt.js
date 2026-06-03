// providers/gemini/prompt.js
/**
 * Gemini Prompt Execution
 * @param {Object} context - Execution context
 * @param {string} context.message - Message to send
 * @returns {Promise<string>} - Response text
 */
(async (context = {}) => {
  const promptText = context.message || 'Hello';

  // Count existing response panels before sending
  const before = document.querySelectorAll('div.markdown.markdown-main-panel').length;

  // Find the editable content area
  const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
  if (!editor) {
    throw new Error('Editor element not found');
  }

  // Focus and insert text
  editor.focus();
  document.execCommand('insertText', false, promptText);
  await new Promise(r => setTimeout(r, 300));

  // Click send button
  const sendBtn = document.querySelector('button[aria-label="Send message"]');
  if (!sendBtn) {
    throw new Error('Send button not found');
  }
  sendBtn.click();

  // Function to get newest response
  const getNewResponse = () => {
    const divs = document.querySelectorAll('div.markdown.markdown-main-panel');
    return divs.length > before ? divs[divs.length - 1]?.innerText?.trim() : null;
  };

  // Wait for response to appear (max 30 seconds)
  let appeared = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    if (getNewResponse()) { 
      appeared = true; 
      break; 
    }
  }
  if (!appeared) { 
    throw new Error('Timeout waiting for response');
  }

  // Wait for response to stabilize (stop changing/streaming)
  let last = '', stable = 0;
  while (stable < 3) {
    await new Promise(r => setTimeout(r, 1000));
    const cur = getNewResponse();
    if (cur === last) stable++;
    else { 
      stable = 0; 
      last = cur; 
    }
  }

  return last;
})();
