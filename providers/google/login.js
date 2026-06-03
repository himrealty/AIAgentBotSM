/**
 * Google Login - Email and Password
 * @param {Object} context - Execution context
 * @param {string} context.email - Google email
 * @param {string} context.password - Google password
 * @returns {Promise<string>} - Login status
 */
(async (context = {}) => {
  const email = context.email;
  const password = context.password;
  
  if (!email) throw new Error('No email provided');
  if (!password) throw new Error('No password provided');
  
  const waitForElement = async (selectors, timeoutMs = 15000) => {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) return el;
      }
      await new Promise(r => setTimeout(r, 300));
    }
    return null;
  };

  const findButtonByText = texts => {
    const normalized = s => (s || '').toString().trim().toLowerCase();
    const elements = [...document.querySelectorAll('button,div,input[type="button"],input[type="submit"],span')];
    for (const el of elements) {
      const text = normalized(el.textContent || el.value || el.getAttribute('aria-label'));
      if (!text) continue;
      for (const target of texts) {
        if (text === target.toLowerCase()) return el;
      }
    }
    return null;
  };

  const clickButton = (texts) => {
    const button = findButtonByText(texts);
    if (button) {
      button.click();
      button.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
      return true;
    }
    return false;
  };

  const emailInput = await waitForElement([
    'input[type="email"]',
    'input[name="identifier"]',
    'input#identifierId',
    'input[name="Email"]',
    'input[autocomplete="email"]'
  ]);
  if (!emailInput) throw new Error('Email input not found');
  
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(emailInput, email);
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  emailInput.focus();
  
  console.log('✅ Email entered');
  
  const nextClicked = clickButton(['Next', 'next', '下一步', 'Suivant', 'Weiter', '다음']);
  if (!nextClicked) {
    emailInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, keyCode: 13, which: 13 }));
    emailInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, keyCode: 13, which: 13 }));
  }

  // Step 2: Password
  const passwordInput = await waitForElement([
    'input[type="password"]',
    'input[name="password"]',
    'input[name="Passwd"]',
    'input[autocomplete="current-password"]'
  ], 25000);
  if (!passwordInput) throw new Error('Password input not found');

  setter.call(passwordInput, password);
  passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
  passwordInput.focus();
  
  console.log('✅ Password entered');
  
  const submitClicked = clickButton(['Next', 'next', 'Sign in', 'Sign in', '로그인', '로그인', 'Se connecter']);
  if (!submitClicked) {
    passwordInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, keyCode: 13, which: 13 }));
    passwordInput.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true, keyCode: 13, which: 13 }));
  }
  
  return 'Login successful - password submitted';
})();