import { pkceChallenge } from './pkce-challenge.js';
import { redirects } from '@wix/redirects';
import { loadFrame, addPostMessageListener } from './iframeUtils.js';
import { biHeaderGenerator } from './bi-header-generator.js';
import { wixContext } from '@wix/sdk-context';

const DEFAULT_API_URL = 'readonly.wixapis.com';

export interface OauthPKCE {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export interface OauthData extends OauthPKCE {
  originalUri: string;
  redirectUri: string;
}

export interface OauthPKCE {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export interface Token {
  value: string;
}

export interface AccessToken extends Token {
  expiresAt: number;
}

export enum TokenRole {
  NONE = 'none',
  VISITOR = 'visitor',
  MEMBER = 'member',
}

const generatePKCE = (): OauthPKCE => {
  const pkceState = pkceChallenge();
  return {
    codeChallenge: pkceState.code_challenge,
    codeVerifier: pkceState.code_verifier,
    state: pkceChallenge().code_challenge,
  };
};

const getAuthorizationUrlWithOptions = async (
  oauthData: Partial<OauthData>,
  responseMode: 'fragment' | 'web_message' | 'query',
  prompt: 'login' | 'none',
  sessionToken?: string,
) => {
  const { redirectSession } =
    await redirects.createRedirectSession({
      auth: {
        authRequest: {
          redirectUri: oauthData.redirectUri,
          ...(oauthData.redirectUri && {
            redirectUri: oauthData.redirectUri,
          }),
          codeChallenge: oauthData.codeChallenge,
          codeChallengeMethod: 'S256',
          responseMode,
          responseType: 'code',
          scope: 'offline_access',
          state: oauthData.state,
          clientId: wixContext['clientId'] as string,
          ...(sessionToken && { sessionToken }),
        },
        prompt: redirects.Prompt[prompt],
      },
    });
  return {
    authUrl: redirectSession!.fullUrl!,
    authorizationEndpoint: redirectSession!.urlDetails!.endpoint,
    sessionToken: redirectSession!.sessionToken,
  };
};


export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string | null;
  token_type: string;
  scope?: string | null;
}
const fetchTokens = async (
  payload: any,
  headers = {} as Record<string, string>,
): Promise<TokenResponse> => {
  const res = await fetch(`https://${DEFAULT_API_URL}/oauth2/token`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      ...biHeaderGenerator({
        entityFqdn: 'wix.identity.oauth.v1.refresh_token',
        methodFqn: 'wix.identity.oauth2.v1.Oauth2Ng.Token',
        packageName: '@wix/sdk',
      }),
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  if (res.status !== 200) {
    let responseJson: unknown | undefined;
    try {
      responseJson = await res.json();
    } catch {}

    throw new Error(
      `Failed to fetch tokens from OAuth API: ${res.statusText}. request id: ${res.headers.get('x-request-id')}. ${responseJson ? `Response: ${JSON.stringify(responseJson)}` : ''}`,
    );
  }
  const json = await res.json();
  return json;
};

function getCurrentDate() {
  return Math.floor(Date.now() / 1000);
}

function createAccessToken(
  accessToken: string,
  expiresIn: number,
): AccessToken {
  const now = getCurrentDate();
  return { value: accessToken, expiresAt: Number(expiresIn) + now };
}

const getMemberTokens = async (
  code: string,
  state: string,
  oauthData: Partial<OauthData>,
) => {
  if (!code || !state) {
    throw new Error('Missing code or _state');
  } else if (state !== oauthData.state) {
    throw new Error('Invalid _state');
  }

  const tokensResponse = await fetchTokens({
    clientId: wixContext['clientId'],
    grantType: 'authorization_code',
    ...(oauthData.redirectUri && { redirectUri: oauthData.redirectUri }),
    code,
    codeVerifier: oauthData.codeVerifier,
  });

  return {
    accessToken: createAccessToken(
      tokensResponse.access_token!,
      tokensResponse.expires_in!,
    ),
    refreshToken: {
      value: tokensResponse.refresh_token!,
      role: TokenRole.MEMBER,
    },
  };
};

export const getMemberTokensForDirectLogin = async (sessionToken: string) => {
  const oauthPKCE = generatePKCE();
  const { authUrl } = await getAuthorizationUrlWithOptions(
    oauthPKCE,
    'web_message',
    'none',
    sessionToken,
  );
  const iframePromise = addPostMessageListener(oauthPKCE.state);
  const iframeEl = loadFrame(authUrl!);
  return iframePromise
    .then((res: any) => {
      return getMemberTokens(res.code, res.state, oauthPKCE);
    })
    .finally(() => {
      if (document.body.contains(iframeEl)) {
        iframeEl.parentElement?.removeChild(iframeEl);
      }
    });
};

