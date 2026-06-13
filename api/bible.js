// GET /api/bible — multi-provider Scripture proxy. Routes by language so the
// client never holds an API key or knows which provider served a verse.
//
//   en → Crossway ESV API (api.esv.org)         — ESV_API_KEY,   header "Authorization: Token <key>"
//   ko → not offered. The personal library is English-only: there is no licensed
//        API source for 개역개정 (Korean Bible Society copyright). Korean Scripture
//        lives in the CURATED curriculum as verified seed text, which never goes
//        through this proxy. The ko branch below is kept (returns a clear error)
//        and re-enableable if 개역개정 is ever licensed via API.Bible.
//
// Every response is normalized to one shape, regardless of provider:
//   kind=lookup   &id=<passageId>      -> { reference, text, passageId, translation, language }
//   kind=search   &q=<text>            -> { results:  [{ reference, passageId, preview }] }
//   kind=books                         -> { books:    [{ id, name }] }
//   kind=chapters &book=<bookId>       -> { chapters: [{ id, number }] }
//   kind=verses   &chapter=<chapterId> -> { verses:   [{ passageId, reference }] }
//
// The ESV API license forbids storing verse text — which matches our own rule:
// never persist Scripture, always re-fetch live (library-spec §5). So text
// responses are sent no-store; only structural lists (books/chapters/verses)
// are CDN-cached.

const TRANSLATIONS = { en: 'ESV', ko: '개역개정' };

// Korean (API.Bible) bible id — intentionally empty: 개역개정 has no licensed API
// source, so Korean personal lookups are not offered (they return a clear
// error). Set this only if a licensed Korean bible is ever wired up.
const KO_BIBLE_ID = '';

// English canonical books + chapter counts. The ESV API has no book/chapter
// list endpoint, so the structure is static; verse counts are derived live
// from the reference parser (no per-chapter table needed).
const BOOKS_EN = [
  ['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36],
  ['Deuteronomy', 34], ['Joshua', 24], ['Judges', 21], ['Ruth', 4],
  ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25],
  ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13],
  ['Esther', 10], ['Job', 42], ['Psalms', 150], ['Proverbs', 31],
  ['Ecclesiastes', 12], ['Song of Solomon', 8], ['Isaiah', 66], ['Jeremiah', 52],
  ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12], ['Hosea', 14],
  ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4], ['Micah', 7],
  ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3], ['Haggai', 2],
  ['Zechariah', 14], ['Malachi', 4], ['Matthew', 28], ['Mark', 16], ['Luke', 24],
  ['John', 21], ['Acts', 28], ['Romans', 16], ['1 Corinthians', 16],
  ['2 Corinthians', 13], ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4],
  ['Colossians', 4], ['1 Thessalonians', 5], ['2 Thessalonians', 3],
  ['1 Timothy', 6], ['2 Timothy', 4], ['Titus', 3], ['Philemon', 1],
  ['Hebrews', 13], ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5],
  ['2 John', 1], ['3 John', 1], ['Jude', 1], ['Revelation', 22],
];

function httpError(status, code) {
  const e = new Error(code);
  e.status = status;
  e.code = code;
  return e;
}

// — English provider: Crossway ESV API (api.esv.org) —

const ESV_BASE = 'https://api.esv.org/v3/passage';
function esvHeaders() {
  return { Authorization: `Token ${process.env.ESV_API_KEY}` };
}

async function esvText(q, extra = {}) {
  const params = new URLSearchParams({
    q,
    'include-passage-references': 'false',
    'include-verse-numbers': 'false',
    'include-first-verse-numbers': 'false',
    'include-footnotes': 'false',
    'include-headings': 'false',
    'include-short-copyright': 'false',
    'include-passage-horizontal-lines': 'false',
    'include-heading-horizontal-lines': 'false',
    ...extra,
  });
  const r = await fetch(`${ESV_BASE}/text/?${params}`, { headers: esvHeaders() });
  if (!r.ok) throw httpError(502, 'esv_failed');
  return r.json();
}

async function esvLookup(id) {
  const d = await esvText(id);
  const text = ((d.passages && d.passages[0]) || '').trim();
  if (!d.canonical || !text) throw httpError(404, 'not_found');
  return {
    reference: d.canonical,
    text,
    passageId: d.canonical,
    translation: 'ESV',
    language: 'en',
  };
}

async function esvSearch(q) {
  const params = new URLSearchParams({ q, 'page-size': '20' });
  const r = await fetch(`${ESV_BASE}/search/?${params}`, { headers: esvHeaders() });
  if (!r.ok) throw httpError(502, 'esv_failed');
  const d = await r.json();
  const results = (d.results || []).map((x) => ({
    reference: x.reference,
    passageId: x.reference,
    preview: (x.content || '').trim(),
  }));
  return { results };
}

function esvBooks() {
  return { books: BOOKS_EN.map(([name]) => ({ id: name, name })) };
}

function esvChapters(book) {
  const found = BOOKS_EN.find(([name]) => name === book);
  if (!found) throw httpError(400, 'unknown_book');
  const count = found[1];
  // Single-chapter books: one entry whose id is the bare book name, so the
  // verse step queries the whole book (avoids "Obadiah 1" parsing as verse 1).
  if (count === 1) return { chapters: [{ id: book, number: 1 }] };
  const chapters = [];
  for (let n = 1; n <= count; n += 1) chapters.push({ id: `${book} ${n}`, number: n });
  return { chapters };
}

async function esvVerses(chapter) {
  // A bare book name (single-chapter book) vs. "Book N" (a real chapter).
  const single = BOOKS_EN.some(([name]) => name === chapter);
  const d = await esvText(chapter);
  const range = d.parsed && d.parsed[0];
  if (!range) throw httpError(404, 'not_found');
  const count = range[1] % 1000; // verse-id = BBCCCVVV; last 3 digits = verse
  const verses = [];
  for (let v = 1; v <= count; v += 1) {
    const reference = single ? `${chapter} ${v}` : `${chapter}:${v}`;
    verses.push({ passageId: reference, reference });
  }
  return { verses };
}

// "Read it in context" (§4): the verse's surrounding paragraph — never other
// verses or connections. A ±3-verse window approximates the paragraph (the ESV
// API has no paragraph-of-verse endpoint); ESV clamps the upper bound to the
// chapter, we clamp the lower to verse 1.
function parseRef(id) {
  if (id.includes(':')) {
    const m = id.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (!m) throw httpError(400, 'bad_ref');
    return { book: m[1], chapter: Number(m[2]), verse: Number(m[3]), single: false };
  }
  const m = id.match(/^(.+?)\s+(\d+)$/); // single-chapter book, e.g. "Jude 5"
  if (!m) throw httpError(400, 'bad_ref');
  return { book: m[1], verse: Number(m[2]), single: true };
}

async function esvContext(id) {
  const p = parseRef(id);
  const lo = Math.max(1, p.verse - 3);
  const hi = p.verse + 3;
  const span = lo === hi ? `${lo}` : `${lo}-${hi}`;
  const range = p.single ? `${p.book} ${span}` : `${p.book} ${p.chapter}:${span}`;
  const d = await esvText(range, { 'include-verse-numbers': 'true' });
  const text = ((d.passages && d.passages[0]) || '').trim();
  if (!d.canonical || !text) throw httpError(404, 'not_found');
  return { reference: d.canonical, text, passageId: id };
}

async function dispatchEn(kind, { q, id, book, chapter }) {
  switch (kind) {
    case 'lookup':
      if (!id) throw httpError(400, 'missing_id');
      return { out: await esvLookup(id), text: true };
    case 'context':
      if (!id) throw httpError(400, 'missing_id');
      return { out: await esvContext(id), text: true };
    case 'search':
      if (!q) throw httpError(400, 'missing_q');
      return { out: await esvSearch(q), text: true };
    case 'books':
      return { out: esvBooks(), text: false };
    case 'chapters':
      if (!book) throw httpError(400, 'missing_book');
      return { out: esvChapters(book), text: false };
    case 'verses':
      if (!chapter) throw httpError(400, 'missing_chapter');
      return { out: await esvVerses(chapter), text: false };
    default:
      throw httpError(400, 'unknown_kind');
  }
}

// — Korean provider: API.Bible (scripture.api.bible) — pending key + bible id —

const AB_BASE = 'https://api.scripture.api.bible/v1';
function koReady() {
  return Boolean(process.env.API_BIBLE_KEY && KO_BIBLE_ID);
}
async function abGet(path) {
  const r = await fetch(`${AB_BASE}/bibles/${KO_BIBLE_ID}${path}`, {
    headers: { 'api-key': process.env.API_BIBLE_KEY },
  });
  if (!r.ok) throw httpError(502, 'apibible_failed');
  return (await r.json()).data;
}

async function dispatchKo(kind, { q, id, book, chapter }) {
  switch (kind) {
    case 'lookup': {
      if (!id) throw httpError(400, 'missing_id');
      const d = await abGet(
        `/passages/${encodeURIComponent(id)}?content-type=text&include-verse-numbers=false`
      );
      const text = String(d.content || '').trim();
      if (!text) throw httpError(404, 'not_found');
      return {
        out: { reference: d.reference, text, passageId: id, translation: '개역개정', language: 'ko' },
        text: true,
      };
    }
    case 'search': {
      if (!q) throw httpError(400, 'missing_q');
      const d = await abGet(`/search?query=${encodeURIComponent(q)}&limit=20`);
      const results = (d.verses || []).map((v) => ({
        reference: v.reference,
        passageId: v.id,
        preview: String(v.text || '').trim(),
      }));
      return { out: { results }, text: true };
    }
    case 'books': {
      const d = await abGet('/books');
      return { out: { books: (d || []).map((b) => ({ id: b.id, name: b.name })) }, text: false };
    }
    case 'chapters': {
      if (!book) throw httpError(400, 'missing_book');
      const d = await abGet(`/books/${encodeURIComponent(book)}/chapters`);
      const chapters = (d || [])
        .filter((c) => c.number !== 'intro')
        .map((c) => ({ id: c.id, number: c.number }));
      return { out: { chapters }, text: false };
    }
    case 'verses': {
      if (!chapter) throw httpError(400, 'missing_chapter');
      const d = await abGet(`/chapters/${encodeURIComponent(chapter)}/verses`);
      const verses = (d || []).map((v) => ({ passageId: v.id, reference: v.reference }));
      return { out: { verses }, text: false };
    }
    default:
      throw httpError(400, 'unknown_kind');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  const { lang = 'en', kind = 'lookup', q, id, book, chapter } = req.query || {};
  try {
    let result;
    if (lang === 'en') {
      if (!process.env.ESV_API_KEY) throw httpError(500, 'esv_unconfigured');
      result = await dispatchEn(kind, { q, id, book, chapter });
    } else if (lang === 'ko') {
      if (!koReady()) throw httpError(503, 'korean_unconfigured');
      result = await dispatchKo(kind, { q, id, book, chapter });
    } else {
      throw httpError(400, 'unknown_lang');
    }
    // Structural lists may be CDN-cached; Scripture text is never stored.
    res.setHeader(
      'Cache-Control',
      result.text ? 'no-store' : 's-maxage=86400, stale-while-revalidate'
    );
    res.status(200).json(result.out);
  } catch (err) {
    const status = err.status || 502;
    if (status >= 500 && status !== 503) console.error('[api/bible]', err.code || err.message);
    res.status(status).json({ error: err.code || 'lookup_failed' });
  }
}

export { TRANSLATIONS };
