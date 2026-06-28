import { createElement as h } from 'react';
import './auth.css';

// First-run onboarding: one choice — which language. Saved to the profile, and
// changeable anytime via the EN/한국어 toggle. Two equal choice tiles, not a
// competing primary CTA — the user simply picks and continues.
const T = {
  en: { kicker: 'Way', title: 'Choose your language' },
  ko: { kicker: 'Way', title: '언어를 선택하세요' },
};

export default function Onboarding({ language = 'en', onChoose }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];

  return h(
    'main',
    { className: 'auth', lang },
    h(
      'div',
      { className: 'auth__box view-in' },
      h('p', { className: 'auth__kicker' }, t.kicker),
      h('h1', { className: 'auth__title' }, t.title),
      h(
        'div',
        { className: 'onboard__choices' },
        h(
          'button',
          { className: 'onboard__choice', type: 'button', lang: 'en', onClick: () => onChoose('en') },
          'English'
        ),
        h(
          'button',
          { className: 'onboard__choice', type: 'button', lang: 'ko', onClick: () => onChoose('ko') },
          '한국어'
        )
      )
    )
  );
}
