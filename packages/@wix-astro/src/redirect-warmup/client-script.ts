import { redirects } from '@wix/redirects';
import { isCookieWarmedUp, LOCALSTORAGE_PREWARM_REDIRECT_KEY, LOCALSTORAGE_DIRECT_LOGIN_URL_KEY } from '@wix/astro/redirect-warmup';

// Function to check if we need to pre-warm
async function checkAndExecutePreWarm(): Promise<void> {
  // Check if we already pre-warmed recently
  if (isCookieWarmedUp()) {
    return;
  }

  // If we get here, we need to pre-warm
  console.log('Executing redirect session pre-warm');
  localStorage.removeItem(LOCALSTORAGE_PREWARM_REDIRECT_KEY);
  try {
    await preWarmRedirectSession();

    // Store the current timestamp
    localStorage.setItem(LOCALSTORAGE_PREWARM_REDIRECT_KEY, Date.now().toString());
  } catch(ex) {
    console.error('Error during redirect session pre-warm:', ex);
  }
}

async function preWarmRedirectSession() {
  const [resultWithCreateCookie, resultWithDirectURL] = await Promise.all([
    redirects.createRedirectSession({
      login: {}
    }),
    redirects.createRedirectSession({
      login: {},
      preferences: {
        maintainIdentity: false,
      }
    })
  ]);

  const urlToRedirect = resultWithCreateCookie.redirectSession?.fullUrl;
  localStorage.setItem(LOCALSTORAGE_DIRECT_LOGIN_URL_KEY, JSON.stringify(resultWithDirectURL));

  if (!urlToRedirect) {
    return new Error('No redirect URL found');
  }

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = urlToRedirect;
  const promise = new Promise(resolve => iframe.onload = resolve);
  document.body.appendChild(iframe);
  return promise;
}

// Run the check function instead of calling preWarmRedirectSession directly
checkAndExecutePreWarm();
