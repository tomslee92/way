import { createElement as h, useState, useEffect } from 'react';
import {
  searchScripture,
  lookupScripture,
  listBooks,
  listChapters,
  listVerses,
} from '../../lib/bible.js';
import './library.css';

// Add a verse (library-spec §6). Two entry paths into the same memorization
// flow — a search bar and a book → chapter → verse browse — both via /api/bible.
// Lands on the verified verse with Memorize as the default primary action and
// Save (to the library, status 'saved') as the quiet alternative. The "Read it
// in context" door (§4) is added in a later step; no dead UI here.

const T = {
  en: {
    add: 'Add a verse',
    search: 'Search',
    browse: 'Browse',
    placeholder: 'Search a reference or a word',
    invite: 'Find a verse to carry. Search a reference like John 8:58, or browse the books.',
    memorize: 'Memorize',
    save: 'Save',
    back: 'Back',
    looking: 'Looking…',
    empty: 'No matches yet. Try a reference like John 8:58.',
    policy: '',
  },
  ko: {
    add: '구절 추가',
    search: '검색',
    browse: '찾아보기',
    placeholder: '구절이나 단어를 검색하세요',
    invite: '간직할 구절을 찾아보세요. 요한복음 8:58처럼 검색하거나, 성경을 펴서 찾아보세요.',
    memorize: '암송',
    save: '저장',
    back: '뒤로',
    looking: '찾는 중…',
    empty: '아직 결과가 없어요. 요한복음 8:58처럼 검색해 보세요.',
    policy: '개인 구절은 영어(ESV)로 제공돼요. 한국어 구절은 추천 주제에서 만나보세요.',
  },
};

function errMsg(code, ko) {
  if (code === 'korean_unconfigured') {
    return ko
      ? '한국어 성경은 아직 연결되지 않았어요. 곧 준비할게요.'
      : 'Korean lookup isn’t connected yet — it’s coming. English verses work now.';
  }
  if (code === 'not_found') {
    return ko
      ? '찾지 못했어요. 요한복음 8:58처럼 입력해 보세요.'
      : 'We couldn’t find that. Try a reference like John 8:58.';
  }
  return ko ? '성경을 불러오지 못했어요. 다시 시도해 주세요.' : 'Couldn’t reach Scripture. Try again.';
}

export default function AddVerse({ language = 'en', onMemorize, onSave, onExit }) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const t = T[lang];
  // The personal library is English-only: there is no licensed 개역개정 source
  // to serve arbitrary verses. Korean Scripture lives in the curated topics, so
  // every lookup here is English (ESV) regardless of the app's UI language.
  const SCRIPTURE_LANG = 'en';

  const [tab, setTab] = useState('search');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const [books, setBooks] = useState([]);
  const [bookSel, setBookSel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterSel, setChapterSel] = useState(null);
  const [verses, setVerses] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [verseLoading, setVerseLoading] = useState(false);
  const [error, setError] = useState(null);

  // Language drives the provider and the text — start clean when it changes.
  useEffect(() => {
    setResults([]);
    setSearched(false);
    setQuery('');
    setSelected(null);
    setBooks([]);
    setBookSel(null);
    setChapters([]);
    setChapterSel(null);
    setVerses([]);
    setError(null);
  }, [language]);

  // Load the book list whenever Browse is active for the current language.
  useEffect(() => {
    if (tab !== 'browse') return undefined;
    let alive = true;
    setBrowseLoading(true);
    setError(null);
    listBooks(SCRIPTURE_LANG)
      .then((d) => alive && setBooks(d.books || []))
      .catch((e) => alive && setError(e.code || 'lookup_failed'))
      .finally(() => alive && setBrowseLoading(false));
    return () => {
      alive = false;
    };
  }, [tab]);

  async function doSearch(e) {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setSearched(true);
    setError(null);
    setResults([]);
    try {
      const d = await searchScripture(SCRIPTURE_LANG, q);
      setResults(d.results || []);
    } catch (er) {
      setError(er.code || 'lookup_failed');
    } finally {
      setSearching(false);
    }
  }

  async function openBook(b) {
    setBookSel(b);
    setChapterSel(null);
    setChapters([]);
    setVerses([]);
    setBrowseLoading(true);
    setError(null);
    try {
      const d = await listChapters(SCRIPTURE_LANG, b.id);
      setChapters(d.chapters || []);
    } catch (e) {
      setError(e.code || 'lookup_failed');
    } finally {
      setBrowseLoading(false);
    }
  }

  async function openChapter(c) {
    setChapterSel(c);
    setVerses([]);
    setBrowseLoading(true);
    setError(null);
    try {
      const d = await listVerses(SCRIPTURE_LANG, c.id);
      setVerses(d.verses || []);
    } catch (e) {
      setError(e.code || 'lookup_failed');
    } finally {
      setBrowseLoading(false);
    }
  }

  function browseBack() {
    if (chapterSel) {
      setChapterSel(null);
      setVerses([]);
    } else if (bookSel) {
      setBookSel(null);
      setChapters([]);
    }
  }

  async function openVerse(passageId) {
    setVerseLoading(true);
    setError(null);
    try {
      const v = await lookupScripture(SCRIPTURE_LANG, passageId);
      setSelected(v);
    } catch (e) {
      setError(e.code || 'lookup_failed');
    } finally {
      setVerseLoading(false);
    }
  }

  // — small render helpers —

  function row(key, primary, secondary, onClick) {
    return h(
      'li',
      { key },
      h(
        'button',
        { className: 'lib-row', type: 'button', onClick },
        h('span', { className: 'lib-row__ref' }, primary),
        secondary ? h('span', { className: 'lib-row__peek' }, secondary) : null
      )
    );
  }

  function note(text) {
    return h('p', { className: 'addverse__note' }, text);
  }

  // — the verse preview (landed) —
  if (selected) {
    return h(
      'section',
      { className: 'addverse view-in', lang },
      h(
        'header',
        { className: 'addverse__bar' },
        h(
          'button',
          { className: 'btn btn--quiet', type: 'button', onClick: () => setSelected(null) },
          t.back
        ),
        h('p', { className: 'addverse__kicker' }, t.add.toUpperCase()),
        h('span', { className: 'addverse__spacer' })
      ),
      h(
        'div',
        { className: 'preview' },
        h('p', { className: 'preview__ref' }, selected.reference),
        h('p', { className: 'preview__text' }, selected.text),
        h(
          'div',
          { className: 'preview__actions' },
          h(
            'button',
            { className: 'btn btn--primary', type: 'button', onClick: () => onMemorize(selected) },
            t.memorize
          ),
          h(
            'button',
            { className: 'btn btn--quiet', type: 'button', onClick: () => onSave(selected) },
            t.save
          )
        )
      )
    );
  }

  // — search / browse —
  let body;
  if (verseLoading) {
    body = note(t.looking);
  } else if (tab === 'search') {
    body = h(
      'div',
      { className: 'addverse__panel' },
      h(
        'form',
        { className: 'addverse__search', onSubmit: doSearch },
        h('input', {
          className: 'addverse__input',
          type: 'search',
          value: query,
          placeholder: t.placeholder,
          'aria-label': t.placeholder,
          onChange: (e) => setQuery(e.target.value),
          autoFocus: true,
        }),
        h('button', { className: 'btn btn--primary', type: 'submit' }, t.search)
      ),
      searching
        ? note(t.looking)
        : error
        ? note(errMsg(error, lang === 'ko'))
        : results.length
        ? h(
            'ul',
            { className: 'lib-list' },
            results.map((r) => row(r.passageId, r.reference, r.preview, () => openVerse(r.passageId)))
          )
        : note(searched ? t.empty : t.invite)
    );
  } else {
    // browse drill-down: books → chapters → verses
    let list;
    if (browseLoading) {
      list = note(t.looking);
    } else if (error) {
      list = note(errMsg(error, lang === 'ko'));
    } else if (!bookSel) {
      list = h(
        'ul',
        { className: 'lib-list' },
        books.map((b) => row(b.id, b.name, null, () => openBook(b)))
      );
    } else if (!chapterSel) {
      list = h(
        'ul',
        { className: 'lib-list' },
        chapters.map((c) => row(String(c.id), `${bookSel.name} ${c.number}`, null, () => openChapter(c)))
      );
    } else {
      list = h(
        'ul',
        { className: 'lib-list' },
        verses.map((v) => row(v.passageId, v.reference, null, () => openVerse(v.passageId)))
      );
    }

    body = h(
      'div',
      { className: 'addverse__panel' },
      bookSel
        ? h(
            'button',
            { className: 'btn btn--quiet', type: 'button', onClick: browseBack },
            `← ${chapterSel ? bookSel.name : t.browse}`
          )
        : null,
      list
    );
  }

  return h(
    'section',
    { className: 'addverse view-in', lang },
    h(
      'header',
      { className: 'addverse__bar' },
      h('button', { className: 'btn btn--quiet', type: 'button', onClick: onExit }, t.back),
      h('p', { className: 'addverse__kicker' }, t.add.toUpperCase()),
      h('span', { className: 'addverse__spacer' })
    ),
    // English-only personal library — tell Korean users where Korean lives.
    lang === 'ko' ? h('p', { className: 'addverse__policy' }, t.policy) : null,
    h(
      'div',
      { className: 'addverse__tabs', role: 'tablist' },
      h(
        'button',
        {
          className: 'btn btn--quiet',
          type: 'button',
          role: 'tab',
          'data-on': tab === 'search' ? 'true' : undefined,
          onClick: () => setTab('search'),
        },
        t.search
      ),
      h(
        'button',
        {
          className: 'btn btn--quiet',
          type: 'button',
          role: 'tab',
          'data-on': tab === 'browse' ? 'true' : undefined,
          onClick: () => setTab('browse'),
        },
        t.browse
      )
    ),
    body
  );
}
