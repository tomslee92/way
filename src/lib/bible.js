// Scripture lookup via our /api/bible proxy. Language-first: the proxy routes
// to the right provider (Crossway ESV API for English, API.Bible for Korean)
// and normalizes every response, so no API key or provider GUID ever reaches
// the client. Verse TEXT is always fetched live, never stored (library-spec §5;
// also required by the ESV API license).

export const TRANSLATIONS = { en: 'ESV', ko: '개역개정' };

export function translationFor(language) {
  return TRANSLATIONS[language === 'ko' ? 'ko' : 'en'];
}

// Reverse of translationFor — a stored library item knows its translation but
// not its language; this routes its re-fetch to the right provider.
const LANGUAGE_BY_TRANSLATION = { ESV: 'en', 개역개정: 'ko' };
export function languageFor(translation) {
  return LANGUAGE_BY_TRANSLATION[translation] || 'en';
}

async function call(params) {
  const res = await fetch(`/api/bible?${new URLSearchParams(params)}`);
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok) {
    const err = new Error(data.error || `bible_${res.status}`);
    err.code = data.error || `http_${res.status}`;
    err.status = res.status;
    throw err;
  }
  return data;
}

// Keyword or reference search → { results: [{ reference, passageId, preview }] }.
export function searchScripture(language, q) {
  return call({ lang: language, kind: 'search', q });
}

// Fetch one verse's verified text → { reference, text, passageId, translation, language }.
export function lookupScripture(language, passageId) {
  return call({ lang: language, kind: 'lookup', id: passageId });
}

// Browse: books → chapters → verses. Each returns ids to pass to the next call.
export function listBooks(language) {
  return call({ lang: language, kind: 'books' });
}
export function listChapters(language, book) {
  return call({ lang: language, kind: 'chapters', book });
}
export function listVerses(language, chapter) {
  return call({ lang: language, kind: 'verses', chapter });
}
