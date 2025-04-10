export const LOCALSTORAGE_PREWARM_REDIRECT_KEY = 'wixRedirectSessionLastPreWarm';
export const LOCALSTORAGE_DIRECT_LOGIN_URL_KEY = 'wixLoginDirectUrl';

export function isCookieWarmedUp(): boolean {
  // Check if we already pre-warmed recently
  const lastPreWarmTimeString = localStorage.getItem(LOCALSTORAGE_PREWARM_REDIRECT_KEY);
  const currentTime = Date.now();

  // If we have a stored timestamp, check if it's been less than a week
  if (lastPreWarmTimeString) {
    const lastPreWarmTime = parseInt(lastPreWarmTimeString, 10);
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    if (currentTime - lastPreWarmTime < oneWeekMs) {
      return true; // Was pre-warmed within the last week
    }
  }

  return false; // We need to pre-warm
}
