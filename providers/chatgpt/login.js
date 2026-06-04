// Combined ChatGPT login flow: email -> password -> totp
// This file consolidates the three-step flow so server code can call `login`.

(async (context = {}) => {
  const email = context.email || '';
  const password = context.password || '';
  const totp = context.totp || '';

  const setInputValue = (input, value) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    if (setter) setter.call(input, value);
    else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  // Ensure on chatgpt base
  if (!window.location.href.includes('chatgpt.com')) {
    window.location.href = 'https://chatgpt.com';
    await new Promise(r => setTimeout(r, 3000));
  }

  // Step 1: enter email
  if (!email) throw new Error('Email is required for login');
  console.log('ChatGPT Login: Step 1 - entering email');
  const loginBtn = document.querySelector('button[data-testid="login-button"]');
  if (loginBtn) { loginBtn.click(); await new Promise(r => setTimeout(r, 2000)); }

  const emailInput = document.querySelector('input[id="email"]');
  if (!emailInput) {
    const userMenu = document.querySelector('[data-testid="user-menu"]') || document.querySelector('nav a[href="/gpts"]');
    if (userMenu) return { ok: true, message: 'Already logged in', step: 1 };
    throw new Error('Email input not found on chatgpt.com');
  }
  emailInput.focus();
  setInputValue(emailInput, email);
  await new Promise(r => setTimeout(r, 500));
  const continueBtn = document.querySelector('button[type="submit"]');
  if (!continueBtn) throw new Error('Continue button not found after entering email');
  continueBtn.click();
  await new Promise(r => setTimeout(r, 2000));

  // If redirected to Google or password page, attempt password step
  if (window.location.href.includes('accounts.google.com') || window.location.href.includes('chatgpt.com')) {
    // Step 2: handle Google password if available
    if (password) {
      console.log('ChatGPT Login: Step 2 - entering password');
      await new Promise(r => setTimeout(r, 1000));
      const identifierNextBtn = document.querySelector('#identifierNext button');
      if (identifierNextBtn) { identifierNextBtn.click(); await new Promise(r => setTimeout(r, 2000)); }

      const passwordInput = document.querySelector('input[name="Passwd"]');
      if (!passwordInput) {
        const totpInput = document.querySelector('input[name="totpPin"]');
        if (totpInput) {
          return { ok: true, message: 'Proceed to TOTP', step: 2, nextStep: 'totp' };
        }
        const userMenu = document.querySelector('[data-testid="user-menu"]');
        if (userMenu) return { ok: true, message: 'Already logged in', step: 2 };
        throw new Error('Password input not found on Google login page');
      }

      passwordInput.focus();
      setInputValue(passwordInput, password);
      await new Promise(r => setTimeout(r, 500));
      const passwordNextBtn = document.querySelector('#passwordNext button');
      if (!passwordNextBtn) throw new Error('Password Next button not found');
      passwordNextBtn.click();
      await new Promise(r => setTimeout(r, 3000));

      const totpInputAfter = document.querySelector('input[name="totpPin"]');
      if (totpInputAfter) return { ok: true, message: 'Password accepted, proceed to TOTP', step: 2, nextStep: 'totp' };
      const userMenuAfter = document.querySelector('[data-testid="user-menu"]');
      if (userMenuAfter) return { ok: true, message: 'Login successful', step: 2 };
    }
  }

  // Step 3: TOTP
  if (totp) {
    if (!window.location.href.includes('accounts.google.com')) {
      throw new Error('Not on Google 2FA page; cannot submit TOTP');
    }
    console.log('ChatGPT Login: Step 3 - entering TOTP');
    await new Promise(r => setTimeout(r, 1000));
    const totpInput = document.querySelector('input[name="totpPin"]');
    if (!totpInput) {
      const userMenu = document.querySelector('[data-testid="user-menu"]') || document.querySelector('nav a[href="/gpts"]');
      if (userMenu) return { ok: true, message: 'Already logged in (no TOTP)', step: 3 };
      throw new Error('TOTP input not found on 2FA page');
    }
    totpInput.focus();
    setInputValue(totpInput, totp);
    await new Promise(r => setTimeout(r, 500));
    const nextBtn = document.querySelector('#totpNext button') || document.querySelector('button[type="submit"]');
    if (!nextBtn) throw new Error('TOTP submit button not found');
    nextBtn.click();
    await new Promise(r => setTimeout(r, 3000));
    const userMenu = document.querySelector('[data-testid="user-menu"]') || document.querySelector('nav a[href="/gpts"]');
    if (userMenu) return { ok: true, message: 'Login successful with TOTP', step: 3 };
    throw new Error('TOTP submission completed but login not detected');
  }

  // Final check: are we logged in?
  const finalUserMenu = document.querySelector('[data-testid="user-menu"]') || document.querySelector('nav a[href="/gpts"]');
  if (finalUserMenu) return { ok: true, message: 'Login complete or already authenticated', step: 'done' };

  return { ok: true, message: 'Email submitted; follow through with password/TOTP as needed', step: 1 };
})();
