// Review scheduling (library-spec §3). Spaced, warm, NON-gating invitations to
// revisit memorized verses. Driven entirely by the two timestamps in the data
// model — declared_memorized_at and last_recalled_at — with NO review counter
// and NO score (§5). The interval grows with the memorization's maturity. This
// only decides when to *invite*; it never judges how a recall went, and it
// never changes a status (the app never demotes).

const DAY = 86400000;

// Growing interval: the longer a verse has been memorized, the more spread out
// the invitations (3d → 1w → 2w → 1mo → quarterly). Tunable.
export function reviewIntervalMs(declaredAt, now) {
  const age = now - new Date(declaredAt).getTime();
  if (age < 7 * DAY) return 3 * DAY;
  if (age < 30 * DAY) return 7 * DAY;
  if (age < 90 * DAY) return 14 * DAY;
  if (age < 365 * DAY) return 30 * DAY;
  return 90 * DAY;
}

function referenceMs(item) {
  const declaredAt = new Date(item.declared_memorized_at).getTime();
  return item.last_recalled_at ? new Date(item.last_recalled_at).getTime() : declaredAt;
}

// Is a memorized verse due for a review invitation?
export function isDue(item, now = Date.now()) {
  if (!item || item.status !== 'memorized' || !item.declared_memorized_at) return false;
  return now - referenceMs(item) >= reviewIntervalMs(item.declared_memorized_at, now);
}

// Memorized verses due for review, most overdue first.
export function dueReviews(items, now = Date.now()) {
  return (items || [])
    .filter((it) => isDue(it, now))
    .map((it) => ({
      item: it,
      overdue: now - referenceMs(it) - reviewIntervalMs(it.declared_memorized_at, now),
    }))
    .sort((a, b) => b.overdue - a.overdue)
    .map((x) => x.item);
}

// Warm, approximate "it's been ___" phrase for the invitation copy.
export function sinceLabel(refMs, now, lang = 'en') {
  const ko = lang === 'ko';
  const days = Math.max(1, Math.round((now - refMs) / DAY));

  if (days < 7) {
    if (days === 1) return ko ? '하루' : 'a day';
    return ko ? `${days}일` : `${days} days`;
  }
  if (days < 30) {
    const weeks = Math.round(days / 7);
    if (weeks <= 1) return ko ? '일주일' : 'a week';
    return ko ? `${weeks}주` : `${weeks} weeks`;
  }
  if (days < 365) {
    const months = Math.round(days / 30);
    if (months <= 1) return ko ? '한 달' : 'a month';
    return ko ? `${months}개월` : `${months} months`;
  }
  const years = Math.round(days / 365);
  if (years <= 1) return ko ? '일 년' : 'a year';
  return ko ? `${years}년` : `${years} years`;
}
