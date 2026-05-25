// Scripture lookup via our /api/bible proxy, which keeps the API.Bible key
// server-side. Default translations per CLAUDE.md; bible ids are filled in
// once the relevant API.Bible bibles are confirmed for the account.

export const DEFAULT_BIBLES = {
  en: { name: 'ESV', id: '' }, // English Standard Version
  ko: { name: 'NKRV 개역개정', id: '' }, // 개역개정
};

/**
 * Fetch a passage by reference.
 * @param {string} bibleId - API.Bible bible id (see DEFAULT_BIBLES).
 * @param {string} passageId - e.g. 'JHN.14.6'.
 * @returns {Promise<object>} the API.Bible passage payload.
 */
export async function fetchPassage(bibleId, passageId) {
  const params = new URLSearchParams({ bibleId, passageId });
  const res = await fetch(`/api/bible?${params}`);

  if (!res.ok) {
    throw new Error(`Bible request failed: ${res.status}`);
  }
  return res.json();
}
