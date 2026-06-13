import { createElement as h, useState } from 'react';
import { sendMagicLink } from '../../lib/auth.js';
import './auth.css';

// Sign in — passwordless magic link. Only the personal library is gated; the
// curated experience stays open. Two states: enter an email, then "check your
// email." The session itself completes when the emailed link is opened (the app
// reloads at its origin and the Supabase client picks up the session).

const T = {
  en: {
    kicker: 'Way',
    title: 'Carry your own verses',
    invite:
      'Sign in to save verses to your library and let Rhema invite you back over time.',
    placeholder: 'you@example.com',
    send: 'Send link',
    sending: 'Sending…',
    cancel: 'Back',
    sentTitle: 'Check your email',
    sent: (email) => `We sent a sign-in link to ${email}. Open it on this device to continue.`,
    resend: 'Use a different email',
    error: 'That didn’t go through. Check the address and try again.',
  },
  ko: {
    kicker: 'Way',
    title: '내 구절을 간직하기',
    invite: '로그인하면 구절을 서재에 저장하고, 레마가 시간이 지나 다시 초대해 드려요.',
    placeholder: 'you@example.com',
    send: '링크 보내기',
    sending: '보내는 중…',
    cancel: '뒤로',
    sentTitle: '이메일을 확인해 주세요',
    sent: (email) => `${email}로 로그인 링크를 보냈어요. 이 기기에서 링크를 열어 계속해 주세요.`,
    resend: '다른 이메일 사용',
    error: '전송되지 않았어요. 주소를 확인하고 다시 시도해 주세요.',
  },
};

export default function SignIn({ language = 'en', onCancel }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('enter'); // enter | sending | sent
  const [error, setError] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const addr = email.trim();
    if (!addr) return;
    setPhase('sending');
    setError(false);
    try {
      await sendMagicLink(addr);
      setPhase('sent');
    } catch {
      setError(true);
      setPhase('enter');
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
      h('input', {
        className: 'auth__input',
        type: 'email',
        required: true,
        value: email,
        placeholder: t.placeholder,
        'aria-label': t.placeholder,
        autoFocus: true,
        autoComplete: 'email',
        onChange: (e) => setEmail(e.target.value),
      }),
      error ? h('p', { className: 'auth__error' }, t.error) : null,
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
