import { createElement as h, useState } from 'react';
import { sendMagicLink, signInWithProvider } from '../../lib/auth.js';
import './auth.css';

// Sign in — OAuth (Google / Apple / Kakao) + passwordless magic link. Only the
// personal library is gated; the curated experience stays open. OAuth redirects
// the browser to the provider and back, where the session is picked up (same
// post-auth routing as the magic link). The provider buttons deliberately carry
// brand color — a scoped exception to the strict-B&W rule (DESIGN §0), confined
// to this screen.

const T = {
  en: {
    kicker: 'Way',
    title: 'Carry your own verses',
    invite:
      'Sign in to save verses to your library and let Rhema invite you back over time.',
    google: 'Continue with Google',
    apple: 'Continue with Apple',
    kakao: 'Continue with Kakao',
    or: 'or',
    placeholder: 'you@example.com',
    send: 'Send link',
    sending: 'Sending…',
    cancel: 'Back',
    sentTitle: 'Check your email',
    sent: (email) => `We sent a sign-in link to ${email}. Open it on this device to continue.`,
    resend: 'Use a different email',
    error: 'That didn’t go through. Check the address and try again.',
    oauthError: 'Couldn’t start that sign-in. Try another way.',
  },
  ko: {
    kicker: 'Way',
    title: '내 구절을 간직하기',
    invite: '로그인하면 구절을 서재에 저장하고, 레마가 시간이 지나 다시 초대해 드려요.',
    google: 'Google로 계속하기',
    apple: 'Apple로 계속하기',
    kakao: '카카오로 계속하기',
    or: '또는',
    placeholder: 'you@example.com',
    send: '링크 보내기',
    sending: '보내는 중…',
    cancel: '뒤로',
    sentTitle: '이메일을 확인해 주세요',
    sent: (email) => `${email}로 로그인 링크를 보냈어요. 이 기기에서 링크를 열어 계속해 주세요.`,
    resend: '다른 이메일 사용',
    error: '전송되지 않았어요. 주소를 확인하고 다시 시도해 주세요.',
    oauthError: '로그인을 시작하지 못했어요. 다른 방법을 시도해 주세요.',
  },
};

// Provider marks. Google's is multicolor by guideline; Apple/Kakao inherit the
// button's text color via currentColor.
const GoogleIcon = () =>
  h(
    'svg',
    { className: 'oauth__icon', viewBox: '0 0 48 48', width: 18, height: 18, 'aria-hidden': 'true' },
    h('path', {
      fill: '#EA4335',
      d: 'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z',
    }),
    h('path', {
      fill: '#4285F4',
      d: 'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z',
    }),
    h('path', {
      fill: '#FBBC05',
      d: 'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z',
    }),
    h('path', {
      fill: '#34A853',
      d: 'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z',
    })
  );

const AppleIcon = () =>
  h(
    'svg',
    {
      className: 'oauth__icon',
      viewBox: '0 0 14 18',
      width: 15,
      height: 18,
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    h('path', {
      d: 'M13.5 13.8c-.25.57-.54 1.1-.88 1.58-.46.66-.84 1.12-1.13 1.37-.45.42-.94.63-1.46.65-.37 0-.82-.11-1.34-.32-.52-.21-1-.32-1.44-.32-.46 0-.95.11-1.49.32-.54.21-.97.33-1.3.34-.5.02-1-.2-1.49-.66-.31-.27-.71-.75-1.19-1.43-.51-.73-.94-1.57-1.27-2.53-.35-1.04-.53-2.05-.53-3.04 0-1.13.25-2.11.74-2.93.38-.66.9-1.18 1.55-1.56.65-.38 1.35-.58 2.11-.59.39 0 .91.12 1.55.36.64.24 1.05.36 1.23.36.13 0 .59-.14 1.36-.43.73-.26 1.35-.37 1.86-.33 1.37.11 2.4.65 3.08 1.62-1.23.74-1.83 1.78-1.82 3.11.01 1.04.39 1.9 1.13 2.59.34.32.71.57 1.13.74-.09.26-.19.51-.3.76zM10.6.36c0 .85-.31 1.64-.93 2.38-.75.87-1.66 1.38-2.65 1.3-.01-.1-.02-.21-.02-.32 0-.81.36-1.68.98-2.4.31-.36.71-.66 1.2-.9.49-.24.95-.37 1.39-.39.01.11.02.22.02.33z',
    })
  );

const KakaoIcon = () =>
  h(
    'svg',
    {
      className: 'oauth__icon',
      viewBox: '0 0 24 24',
      width: 18,
      height: 18,
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    h('path', {
      d: 'M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.86 5.18 4.66 6.56-.2.72-.74 2.68-.84 3.1-.13.52.19.51.4.37.16-.1 2.6-1.77 3.66-2.49.7.1 1.42.16 2.12.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z',
    })
  );

const PROVIDERS = [
  { id: 'google', mark: GoogleIcon, key: 'google' },
  { id: 'apple', mark: AppleIcon, key: 'apple' },
  { id: 'kakao', mark: KakaoIcon, key: 'kakao' },
];

// Which providers to surface. Defaults to all three; set VITE_OAUTH_PROVIDERS
// (comma-separated, e.g. "google,kakao") to roll them out incrementally and hide
// any not yet configured in Supabase. Empty string → magic link only.
const ENABLED_PROVIDERS = (import.meta.env.VITE_OAUTH_PROVIDERS ?? 'google,apple,kakao')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const VISIBLE_PROVIDERS = PROVIDERS.filter((p) => ENABLED_PROVIDERS.includes(p.id));

export default function SignIn({ language = 'en', onCancel }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('enter'); // enter | sending | sent
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    const addr = email.trim();
    if (!addr) return;
    setPhase('sending');
    setError(null);
    try {
      await sendMagicLink(addr);
      setPhase('sent');
    } catch {
      setError(t.error);
      setPhase('enter');
    }
  }

  // On success the browser redirects to the provider; nothing to do here.
  async function oauth(provider) {
    setError(null);
    try {
      await signInWithProvider(provider);
    } catch {
      setError(t.oauthError);
    }
  }

  if (phase === 'sent') {
    return h(
      'main',
      { className: 'auth', lang },
      h(
        'div',
        { className: 'auth__box view-in' },
        h('p', { className: 'auth__kicker' }, t.kicker),
        h('h1', { className: 'auth__title' }, t.sentTitle),
        h('p', { className: 'auth__invite' }, t.sent(email.trim())),
        h(
          'button',
          {
            className: 'btn btn--quiet auth__cancel',
            type: 'button',
            onClick: () => {
              setPhase('enter');
              setEmail('');
            },
          },
          t.resend
        )
      )
    );
  }

  return h(
    'main',
    { className: 'auth', lang },
    h(
      'form',
      { className: 'auth__box view-in', onSubmit: submit },
      h('p', { className: 'auth__kicker' }, t.kicker),
      h('h1', { className: 'auth__title' }, t.title),
      h('p', { className: 'auth__invite' }, t.invite),
      VISIBLE_PROVIDERS.length
        ? h(
            'div',
            { className: 'oauth' },
            VISIBLE_PROVIDERS.map((p) =>
              h(
                'button',
                {
                  key: p.id,
                  className: `oauth__btn oauth__btn--${p.id}`,
                  type: 'button',
                  onClick: () => oauth(p.id),
                },
                p.mark(),
                h('span', null, t[p.key])
              )
            )
          )
        : null,
      VISIBLE_PROVIDERS.length
        ? h('div', { className: 'auth__divider' }, h('span', null, t.or))
        : null,
      h('input', {
        className: 'auth__input',
        type: 'email',
        required: true,
        value: email,
        placeholder: t.placeholder,
        'aria-label': t.placeholder,
        autoComplete: 'email',
        onChange: (e) => setEmail(e.target.value),
      }),
      error ? h('p', { className: 'auth__error' }, error) : null,
      h(
        'button',
        { className: 'btn btn--primary auth__send', type: 'submit', disabled: phase === 'sending' },
        phase === 'sending' ? t.sending : t.send
      ),
      onCancel
        ? h(
            'button',
            { className: 'btn btn--quiet auth__cancel', type: 'button', onClick: onCancel },
            t.cancel
          )
        : null
    )
  );
}
