import { DriveRung } from './driveLadder.js';
import { listLibrary } from '../../lib/library.js';
import { dueReviews } from '../library/review.js';
import { lookupScripture, languageFor } from '../../lib/bible.js';
import { getTopic } from '../../data/curriculum/curriculum.js';

// Assemble the verses a drive session walks (drivemode-spec §3). A playlist entry is
// { passage:{text, language, reference}, libraryId, startLevel, capLevel } — where the
// rungs a verse runs depend on its state: a review starts high (lead-in → from memory),
// a learning verse starts low and is NOT pushed to free recall in one drive (§3).

const CONFIG = {
  reviewCap: 5, // most-overdue reviews to include
  learnCap: 3, // in-progress verses to include
  totalCap: 7, // ceiling on one drive
};

// One curated (or any pre-fetched) verse → a single-verse playlist. The passage text
// is already in hand (VerseLanding fetched ESV live / used stored 개역개정), so this is
// synchronous and works for everyone, signed in or not. A brand-new verse climbs
// Absorb → Echo → Fill-the-gap only.
export function singleVersePlaylist(passage) {
  return [
    {
      passage: {
        text: passage.text,
        language: passage.language === 'ko' ? 'ko' : 'en',
        reference: passage.reference || passage.refDisplay,
      },
      libraryId: null,
      startLevel: DriveRung.ABSORB,
      capLevel: DriveRung.FILL_GAP,
    },
  ];
}

// Every memory verse in a curated topic → a playlist, for a continuous listen-and-
// recite pass that cycles through the whole topic until stopped (DriveSession loops
// it). English verse text is fetched live (ESV); Korean is the stored 개역개정 text.
// Verses whose text can't be loaded are skipped. Each verse climbs Absorb → Echo →
// Fill-the-gap — enough support for repeated exposure without over-long passes.
export async function buildTopicPlaylist(topicId, language) {
  const lang = language === 'ko' ? 'ko' : 'en';
  const topic = getTopic(topicId, lang);
  if (!topic || !topic.memoryVerses) return [];

  const entries = await Promise.all(
    topic.memoryVerses.map(async (v) => {
      let text = v.text || null;
      if (!text) {
        try {
          const r = await lookupScripture(lang, v.ref);
          text = r && r.text ? r.text : null;
        } catch {
          text = null;
        }
      }
      if (!text) return null;
      return {
        passage: { text, language: lang, reference: v.ref },
        libraryId: null,
        startLevel: DriveRung.ABSORB,
        capLevel: DriveRung.FILL_GAP,
      };
    })
  );
  return entries.filter(Boolean);
}

// Resolve a library row into a playlist entry, fetching its verified text live (never
// stored). Returns null if the text can't be loaded, so the caller can skip it.
async function entryForItem(item, { startLevel, capLevel }) {
  try {
    const lang = languageFor(item.translation);
    const v = await lookupScripture(lang, item.passage_id);
    if (!v || !v.text) return null;
    return {
      passage: { text: v.text, language: lang === 'ko' ? 'ko' : 'en', reference: item.ref_display },
      libraryId: item.id,
      startLevel,
      capLevel,
    };
  } catch {
    return null;
  }
}

// The signed-in drive playlist: due reviews (start high) + in-progress verses (start
// low), live-fetched, capped, interleaved review-first. Library is English-only, so
// these are ESV verses. Returns [] if nothing is queued or the library is unavailable.
export async function buildLibraryPlaylist() {
  let memorized = [];
  let memorizing = [];
  try {
    [memorized, memorizing] = await Promise.all([
      listLibrary({ status: 'memorized' }),
      listLibrary({ status: 'memorizing' }),
    ]);
  } catch {
    return [];
  }

  const due = dueReviews(memorized).slice(0, CONFIG.reviewCap);
  const learning = (memorizing || []).slice(0, CONFIG.learnCap);

  const reviewEntries = await Promise.all(
    due.map((it) => entryForItem(it, { startLevel: DriveRung.LEAD_IN, capLevel: DriveRung.FREE_RECALL }))
  );
  const learnEntries = await Promise.all(
    learning.map((it) => entryForItem(it, { startLevel: DriveRung.ABSORB, capLevel: DriveRung.LEAD_IN }))
  );

  // Review first (the point of the drive), then learning, capped.
  return [...reviewEntries, ...learnEntries].filter(Boolean).slice(0, CONFIG.totalCap);
}
