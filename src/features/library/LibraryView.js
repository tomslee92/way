import { createElement as h, useState, useEffect, useCallback } from 'react';
import { listLibrary, setMemorizing, declareMemorized } from '../../lib/library.js';
import { dueReviews } from './review.js';
import ReviewInvitation from './ReviewInvitation.js';
import './library.css';

// Library view (library-spec §2). Three honest states — Saved, Memorizing,
// Memorized — each shown by its dot (DESIGN.md §6) and a tiny eyebrow label.
//
// Status is the user's testimony, never a session outcome, and the app never
// demotes (rule #1, #2): opening a Saved verse to memorize is the user starting
// (saved → memorizing); declaring Memorized is the user's word; a Memorized
// verse only ever offers to move back, never slips back on its own. The footer
// states this plainly. Memorizing reuses MemorizationSession — no new flow.

const FILTERS = ['all', 'saved', 'memorizing', 'memorized'];

const T = {
  en: {
    title: 'Your library',
    add: 'Add a verse',
    drive: 'Listen & recite',
    signout: 'Sign out',
    declare: 'Memorized',
    moveback: 'Move to memorizing',
    back: 'Back',
    loading: 'Loading…',
    empty: 'Verses you choose to carry will live here. Add your first.',
    footer:
      'A verse becomes “memorized” when you say so. Rhema may invite you back over time — but never moves it for you.',
    error: 'Couldn’t load your library. Try again.',
    filter: { all: 'All', saved: 'Saved', memorizing: 'Memorizing', memorized: 'Memorized' },
    status: { saved: 'Saved', memorizing: 'Memorizing', memorized: 'Memorized' },
  },
  ko: {
    title: '내 서재',
    add: '구절 추가',
    drive: '듣고 외우기',
    signout: '로그아웃',
    declare: '암송 완료',
    moveback: '암송 중으로 옮기기',
    back: '뒤로',
    loading: '불러오는 중…',
    empty: '간직할 구절이 여기에 모입니다. 첫 구절을 더해 보세요.',
    footer:
      '구절은 당신이 그렇게 말할 때 ‘암송 완료’가 됩니다. 레마가 가끔 다시 초대할 수 있지만, 당신을 대신해 옮기지는 않아요.',
    error: '서재를 불러오지 못했어요. 다시 시도해 주세요.',
    filter: { all: '전체', saved: '저장됨', memorizing: '암송 중', memorized: '암송 완료' },
    status: { saved: '저장됨', memorizing: '암송 중', memorized: '암송 완료' },
  },
};

export default function LibraryView({
  language = 'en',
  onMemorize,
  onReview,
  onAdd,
  onDrive,
  onSignOut,
  onExit,
}) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  // Dismissed invitations — session-only; declining a review changes nothing (§3).
  const [dismissed, setDismissed] = useState(() => new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listLibrary();
      setItems(rows || []);
    } catch (e) {
      setError(e?.code || e?.message || 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = items.reduce(
    (a, it) => {
      a.all += 1;
      a[it.status] = (a[it.status] || 0) + 1;
      return a;
    },
    { all: 0, saved: 0, memorizing: 0, memorized: 0 }
  );
  const shown = filter === 'all' ? items : items.filter((it) => it.status === filter);

  // Open to memorize/revisit. A Saved verse becomes Memorizing because the user
  // is starting it (user-initiated, not a session outcome). Memorizing/Memorized
  // open without any status change.
  async function openItem(item) {
    if (item.status === 'saved') {
      setBusyId(item.id);
      try {
        await setMemorizing(item.id);
      } catch (e) {
        console.warn('[Way] status update skipped:', e?.message || e);
      }
      setBusyId(null);
    }
    onMemorize(item);
  }

  async function declare(item) {
    setBusyId(item.id);
    try {
      await declareMemorized(item.id);
      await load();
    } catch (e) {
      setError(e?.code || e?.message || 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function moveBack(item) {
    setBusyId(item.id);
    try {
      await setMemorizing(item.id);
      await load();
    } catch (e) {
      setError(e?.code || e?.message || 'error');
    } finally {
      setBusyId(null);
    }
  }

  function renderItem(item) {
    return h(
      'div',
      { key: item.id, className: 'lib-item' },
      h(
        'button',
        {
          className: 'lib-item__open',
          type: 'button',
          disabled: busyId === item.id,
          onClick: () => openItem(item),
        },
        h('span', { className: 'status-dot', 'data-status': item.status }),
        h(
          'span',
          { className: 'lib-item__main' },
          h('span', { className: 'lib-item__ref' }, item.ref_display),
          h('span', { className: 'lib-item__status' }, t.status[item.status])
        )
      ),
      h(
        'div',
        { className: 'lib-item__actions' },
        item.status === 'memorizing'
          ? h(
              'button',
              {
                className: 'btn btn--quiet',
                type: 'button',
                disabled: busyId === item.id,
                onClick: () => declare(item),
              },
              t.declare
            )
          : null,
        item.status === 'memorized'
          ? h(
              'button',
              {
                className: 'btn btn--quiet',
                type: 'button',
                disabled: busyId === item.id,
                onClick: () => moveBack(item),
              },
              t.moveback
            )
          : null
      )
    );
  }

  let body;
  if (loading) {
    body = h('p', { className: 'library__note' }, t.loading);
  } else if (error) {
    body = h('p', { className: 'library__note' }, t.error);
  } else if (!items.length) {
    body = h('p', { className: 'library__note' }, t.empty);
  } else {
    body = h(
      'div',
      null,
      h(
        'div',
        { className: 'lib-filter', role: 'tablist' },
        FILTERS.map((f) =>
          h(
            'button',
            {
              key: f,
              className: 'btn btn--quiet',
              type: 'button',
              role: 'tab',
              'data-on': filter === f ? 'true' : undefined,
              onClick: () => setFilter(f),
            },
            counts[f] ? `${t.filter[f]} · ${counts[f]}` : t.filter[f]
          )
        )
      ),
      h('div', { className: 'lib-items' }, shown.map(renderItem)),
      h('p', { className: 'library__footer' }, t.footer)
    );
  }

  // Show the most-overdue review invitation that hasn't been dismissed this visit.
  const dueList = items.length ? dueReviews(items).filter((it) => !dismissed.has(it.id)) : [];
  const invite = dueList[0];

  return h(
    'section',
    { className: 'library view-in', lang },
    h(
      'header',
      { className: 'library__bar' },
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
      h('p', { className: 'library__kicker' }, 'Way'),
      onSignOut
        ? h('button', { className: 'btn btn--quiet', type: 'button', onClick: onSignOut }, t.signout)
        : h('span', { className: 'library__spacer' })
    ),
    h('h1', { className: 'library__title' }, t.title),
    invite
      ? h(ReviewInvitation, {
          item: invite,
          language,
          onRevisit: onReview,
          onDismiss: () =>
            setDismissed((prev) => {
              const next = new Set(prev);
              next.add(invite.id);
              return next;
            }),
        })
      : null,
    h('button', { className: 'btn btn--primary library__add', type: 'button', onClick: onAdd }, t.add),
    // Practice the whole queue hands-free (drivemode-spec §3) — shown once there's
    // something to carry.
    onDrive && items.length
      ? h('button', { className: 'btn btn--quiet library__drive', type: 'button', onClick: onDrive }, t.drive)
      : null,
    body
  );
}
