(async () => {
  const { tempMessage } = await chrome.storage.local.get('tempMessage');
  if (!tempMessage) throw new Error('No message to send');
  
  const ta = document.querySelector('textarea');
  if (!ta) throw new Error('Textarea not found');
  
  // Type message
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, '');
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  setter.call(ta, tempMessage);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
  
  // ONLY Enter key — no button click
  ta.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  
  // Wait for response
  let lastLength = 0, stableCount = 0;
  const getText = () => {
    const nodes = document.querySelectorAll('[class*="message"], [class*="assistant"]');
    return nodes.length ? nodes[nodes.length-1].innerText : '';
  };
  const initial = getText();
  
  while (true) {
    await new Promise(r => setTimeout(r, 500));
    const current = getText();
    if (current !== initial && current.length === lastLength && current.length > 0) {
      stableCount++;
      if (stableCount >= 3) {
        await chrome.storage.local.set({ tempOutput: current });
        break;
      }
    } else {
      stableCount = 0;
    }
    lastLength = current.length;
  }
})();