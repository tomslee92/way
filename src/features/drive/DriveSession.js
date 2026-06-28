import { createElement as h, useEffect, useState } from 'react';
import { useRhema } from '../memorization/useRhema.js';
import { useVoiceActivity } from './useVoiceActivity.js';
import { usePlayer } from './usePlayer.js';
import { DriveRung } from './driveLadder.js';
import RhemaIndicator from '../memorization/RhemaIndicator.js';
import { markRecalled } from '../../lib/library.js';
import '../memorization/session.css'; // tokens + the Rhema orb
import './drive.css';

// The Drive Mode surface (drivemode-spec §10): glanceable, screen-off-friendly,
// strict tonal B&W. The Rhema orb is the only visual; silence and space dominate.
// Nothing must be read or precisely tapped while moving — large targets, the minimum
// of them, and (Tier 2) the gaps advance on their own when you finish reciting.

const T = {
  en: {
    title: 'Listen & recite',
    lede: 'Put the screen away. I’ll read; you recite — out loud, from the heart.',
    begin: 'Begin',
    beginQuiet: 'Begin without voice',
    follow: 'Follow the words',
    followNote: 'Shows the verse while we’re still learning it, then clears for recall. For when you’re not moving.',
    micNote: '“Begin” asks for your microphone so I can tell when you’ve finished — I only listen for that you spoke, never what.',
    done: 'Done',
    completeTitle: 'Beautifully carried.',
    completeLede: 'Rest in it. The Word is yours.',
    empty: 'Nothing is queued for a drive right now.',
    back: 'Back',
    pause: 'Pause',
    play: 'Play',
    repeat: 'Repeat',
    skip: 'Skip',
    slower: 'Slower',
    faster: 'Faster',
    paused: 'Paused',
    speaking: 'Rhema is reading',
    ready: 'Your turn — recite',
    listening: 'Listening for you…',
  },
  ko: {
    title: '듣고 외우기',
    lede: '화면은 내려놓으세요. 제가 읽을게요. 소리 내어, 마음에 담긴 그대로 외워 보세요.',
    begin: '시작',
    beginQuiet: '음성 없이 시작',
    follow: '본문 따라 보기',
    followNote: '익히는 동안에는 본문을 보여 주고, 외울 때는 사라져요. 움직이지 않을 때를 위한 기능이에요.',
    micNote: '‘시작’은 마이크 권한을 요청해요. 다 외우셨는지 알기 위해서예요. 무엇을 말했는지가 아니라, 말했다는 사실만 들어요.',
    done: '마치기',
    completeTitle: '아름답게 담아내셨어요.',
    completeLede: '그 안에 머무세요. 이 말씀은 이제 당신의 것이에요.',
    empty: '지금은 운전 모드로 외울 구절이 없어요.',
    back: '뒤로',
    pause: '일시정지',
    play: '재생',
    repeat: '다시',
    skip: '다음',
    slower: '느리게',
    faster: '빠르게',
    paused: '잠시 멈춤',
    speaking: '레마가 읽고 있어요',
    ready: '이제 외워 보세요',
    listening: '듣고 있어요…',
  },
};

export default function DriveSession({ playlist, language = 'en', loop = false, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  const rhema = useRhema();
  const vad = useVoiceActivity();
  const [useVad, setUseVad] = useState(false);
  const [started, setStarted] = useState(false);
  const [followText, setFollowText] = useState(false); // show the words while encoding (stationary use)

  const player = usePlayer({
    playlist: playlist || [],
    rhema,
    vad,
    useVad,
    loop,
    onRecall: (id) => markRecalled(id).catch(() => {}),
  });

  // Wire hardware media keys (steering-wheel / Bluetooth) to the calm controls so a
  // moving user never touches the screen (drivemode-spec §10).
  useEffect(() => {
    if (!started || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return undefined;
    const ms = navigator.mediaSession;
    try {
      if (typeof MediaMetadata !== 'undefined') {
        ms.metadata = new MediaMetadata({ title: player.reference || 'Way', artist: 'Way · Rhema' });
      }
      ms.setActionHandler('play', player.playPause);
      ms.setActionHandler('pause', player.playPause);
      ms.setActionHandler('nexttrack', player.skip);
      ms.setActionHandler('previoustrack', player.back);
    } catch {
      /* not all browsers honor every action */
    }
    return () => {
      try {
        ['play', 'pause', 'nexttrack', 'previoustrack'].forEach((a) => ms.setActionHandler(a, null));
      } catch {
        /* noop */
      }
    };
  }, [started, player.reference, player.playPause, player.skip, player.back]);

  // Release the mic + audio graph on unmount.
  useEffect(
    () => () => {
      player.exit();
      vad.release();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function leave() {
    player.exit();
    vad.release();
    if (onExit) onExit();
  }

  async function begin(withVoice) {
    rhema.unlock(); // counts the tap as the gesture that unlocks playback
    if (withVoice && vad.supported) {
      const granted = await vad.requestPermission();
      setUseVad(granted);
    } else {
      setUseVad(false);
    }
    setStarted(true);
    player.start();
  }

  const bar = h(
    'header',
    { className: 'drive__bar' },
    h('button', { className: 'btn btn--quiet', type: 'button', onClick: leave }, t.back),
    h('p', { className: 'drive__kicker' }, 'Way'),
    h('span', { className: 'drive__spacer', 'aria-hidden': 'true' })
  );

  if (!playlist || !playlist.length) {
    return h('section', { className: 'drive view-in', lang }, bar, h('p', { className: 'drive__note' }, t.empty));
  }

  // — The start gate: a deliberate tap that unlocks audio and (opt-in) the mic. —
  if (!started) {
    return h(
      'section',
      { className: 'drive drive--gate view-in', lang },
      bar,
      h('div', { className: 'drive__gate' },
        h('h1', { className: 'drive__title' }, t.title),
        h('p', { className: 'drive__lede' }, t.lede),
        h('button', { className: 'btn btn--primary drive__begin', type: 'button', onClick: () => begin(true) }, t.begin),
        vad.supported
          ? h('button', { className: 'btn btn--quiet', type: 'button', onClick: () => begin(false) }, t.beginQuiet)
          : null,
        // Optional, off by default: follow the words while encoding (for stationary use).
        h(
          'button',
          {
            className: 'drive__toggle',
            type: 'button',
            role: 'switch',
            'aria-checked': followText ? 'true' : 'false',
            onClick: () => setFollowText((v) => !v),
          },
          h('span', { className: 'drive__toggle-box', 'aria-hidden': 'true' }, followText ? '✓' : ''),
          t.follow
        ),
        h('p', { className: 'drive__micnote' }, followText ? t.followNote : null),
        vad.supported ? h('p', { className: 'drive__micnote' }, t.micNote) : null
      )
    );
  }

  // — Completed. —
  if (player.status === 'done') {
    return h(
      'section',
      { className: 'drive view-in', lang },
      bar,
      h('div', { className: 'drive__gate' },
        h('h1', { className: 'drive__title' }, t.completeTitle),
        h('p', { className: 'drive__lede' }, t.completeLede),
        h('button', { className: 'btn btn--primary drive__begin', type: 'button', onClick: leave }, t.done)
      )
    );
  }

  // — Running. —
  const paused = player.status === 'paused';
  const orbState = paused
    ? 'idle'
    : player.phase === 'speaking'
    ? 'speaking'
    : player.listening
    ? 'listening'
    : 'idle';
  const statusText = paused
    ? t.paused
    : player.phase === 'speaking'
    ? t.speaking
    : player.listening
    ? t.listening
    : t.ready;
  const rungName = player.rungLabel ? player.rungLabel[lang] : '';

  // "Follow the words": show the verse only while encoding (Absorb / Echo); it clears
  // the moment retrieval begins, so it never hands over the answer (drivemode-spec §2).
  const showText = followText && player.rungLevel != null && player.rungLevel <= DriveRung.ECHO;
  const followBody = showText
    ? (playlist[player.verseIndex] && playlist[player.verseIndex].passage.text
        ? playlist[player.verseIndex].passage.text.replace(/\n/g, ' ')
        : '')
    : '';

  const ctrl = (key, onClick, glyph, opts = {}) =>
    h(
      'button',
      {
        className: `drive__ctrl${opts.primary ? ' drive__ctrl--primary' : ''}`,
        type: 'button',
        onClick,
        'aria-label': t[key],
        title: t[key],
      },
      h('span', { className: 'drive__glyph', 'aria-hidden': 'true' }, glyph),
      h('span', { className: 'drive__ctrllabel' }, t[key])
    );

  return h(
    'section',
    { className: 'drive drive--run view-in', lang },
    bar,
    h(
      'div',
      { className: 'drive__stage' },
      h(RhemaIndicator, { state: orbState, label: statusText }),
      h('p', { className: 'drive__ref' }, player.reference),
      h(
        'p',
        { className: 'drive__meta' },
        rungName,
        player.total > 1 ? h('span', { className: 'drive__count' }, ` · ${player.verseIndex + 1} / ${player.total}`) : null
      ),
      showText ? h('p', { className: 'drive__follow-text' }, followBody) : null
    ),
    h(
      'div',
      { className: 'drive__controls' },
      ctrl('repeat', player.repeat, '↻'),
      ctrl(paused ? 'play' : 'pause', player.playPause, paused ? '▶' : '❚❚', { primary: true }),
      ctrl('skip', player.skip, '⇥')
    ),
    h(
      'div',
      { className: 'drive__pace' },
      ctrl('slower', player.slower, '−'),
      h('span', { className: 'drive__rate', 'aria-hidden': 'true' }, `${player.rate.toFixed(2)}×`),
      ctrl('faster', player.faster, '+')
    )
  );
}
