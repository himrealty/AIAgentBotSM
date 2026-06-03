/**
 * Gemini Image Generation
 * @param {Object} context - Execution context
 * @param {string} context.message - Prompt for image
 * @returns {Promise<string>} - Image URL
 */
(async (context = {}) => {
  const IMGBB_API_KEY = '869e0902a9c1bb20fd3cbab30f912c44';

  const tempMessage = context.message || '';
  if (!tempMessage) throw new Error('No prompt');

  const editor = document.querySelector('.ql-editor');
  if (!editor) throw new Error('Editor not found');

  editor.innerText = tempMessage;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.dispatchEvent(new Event('change', { bubbles: true }));

  await new Promise(r => setTimeout(r, 500));

  const sendBtn = document.querySelector('mat-icon[fonticon="arrow_upward"]')?.closest('button');
  if (!sendBtn) throw new Error('Send button not found');
  sendBtn.click();

  const beforeCount = document.querySelectorAll('img[src^="blob:"]').length;
  let blobUrl = null;

  // Wait for image to appear
  while (true) {
    await new Promise(r => setTimeout(r, 500));
    const currentCount = document.querySelectorAll('img[src^="blob:"]').length;
    if (currentCount > beforeCount) {
      const img = document.querySelectorAll('img[src^="blob:"]')[currentCount - 1];
      blobUrl = img.src;
      break;
    }
  }

  // Convert blob to base64
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });

  // Upload to imgbb
  const formData = new URLSearchParams();
  formData.append('key', IMGBB_API_KEY);
  formData.append('image', base64);
  formData.append('name', `gemini_${Date.now()}.png`);

  const uploadRes = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });

  const uploadData = await uploadRes.json();

  if (!uploadData.success) {
    throw new Error(`Upload failed: ${uploadData.error?.message || 'Unknown'}`);
  }

  return uploadData.data.url;
})();
