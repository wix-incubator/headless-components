import { members } from '@wix/members';
import { useCallback } from 'react';

const MEMBER_STORAGE_KEY = 'member-store';

export function useWixClient() {
  const getIsLoggedIn = useCallback(async () => {
    try {
      const member = await members.getCurrentMember();

      return !!member;
    } catch (error) {
      return false;
    }
  }, []);

  const login = useCallback(async () => {
    const returnUrl = encodeURIComponent(window.location.pathname);
    const loginUrl = `/api/auth/login?returnToUrl=${returnUrl}`;

    const insideIframe = window.self !== window.top;
    if (!insideIframe) {
      // dev machine url has been opened outside the picasso iframe
      window.location.href = loginUrl;
      return;
    }

    // we are on a different domain, we need to ask for storage access,
    // otherwise we won't be able to access session cookie
    document
      .hasStorageAccess()
      .catch(() => false)
      .then((hasAccess) => {
        if (hasAccess) {
          return true;
        }

        // in case access is not granted, we need to clear partitioned cookies
        // otherwise after storage access is granted, we will be getting duplicated cookies.
        document.cookie =
          'wixSession=; max-age=0; Secure; SameSite=None; Partitioned';
        document.cookie =
          'XSRF-TOKEN=; max-age=0; Secure; SameSite=None; Partitioned';

        return document
          .requestStorageAccess()
          .then(() => true)
          .catch(() => false);
      })
      .then((accessGranted) => {
        if (accessGranted) {
          const loginWindow = window.open(loginUrl, '_blank');
          reloadOnceLoggedIn(loginWindow!);
        }
      });
  }, []);

  const logout = useCallback(async () => {
    // Clear localStorage immediately
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(MEMBER_STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing member state from localStorage:', error);
      }
    }

    // Create a form programmatically and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/logout';
    form.setAttribute('data-astro-reload', '');

    // Hide the form
    form.style.display = 'none';

    // Add the form to the document
    document.body.appendChild(form);

    // Submit the form
    form.submit();

    // Clean up - remove the form after submission
    setTimeout(() => {
      document.body.removeChild(form);
    }, 100);
  }, []);

  return {
    getIsLoggedIn,
    login,
    logout,
  };
}

function reloadOnceLoggedIn(loginWindow: Window) {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((row) => row.startsWith('wixSession='));

  if (cookie) {
    const jsonString = decodeURIComponent(cookie.split('=')[1] ?? '');
    const parsed = JSON.parse(jsonString);

    if (parsed?.tokens?.refreshToken?.role === 'member') {
      loginWindow.close();
      window.location.reload();

      return;
    }
  }

  setTimeout(() => reloadOnceLoggedIn(loginWindow), 1_000);
}
