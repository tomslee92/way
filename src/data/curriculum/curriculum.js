// Curated topics — top-level entry.
//
// A curated topic is an anchor-and-orbit grouping (see HANDOFF.md): the user
// memorizes the *anchor* verse via the existing fading method, and the *orbit*
// walks the canonical arc (origin → unfolding → moment → aftermath →
// consummation — the Emmaus-road shape of Luke 24:27) during the optional,
// replayable revelation walk. The orbit serves the anchor; nothing here is
// memorized except the anchor.
//
// Topics live in per-language folders (./en, ./ko), one file per topic, so
// adding a topic is a surgical, conflict-free change. This module just selects
// the right language set and resolves audio URLs.

import enTopics from './en/index.js';
import koTopics from './ko/index.js';

const byLanguage = { en: enTopics, ko: koTopics };

// All curated topics for a language, in display order (defaults to English).
export function getTopics(language) {
  return byLanguage[language === 'ko' ? 'ko' : 'en'];
}

// One topic by id for a language, or undefined if not found.
export function getTopic(id, language) {
  return getTopics(language).find((t) => t.id === id);
}

// Audio URL convention for the pre-generated curriculum voice (Phase 2).
//
// Curriculum voice is deterministic — identical for every user and replay — so
// it is generated once and served as static MP3 from /audio. The generator
// writes to this path and the revelation player reads from it, so the two can
// never drift. Deriving URLs from ids (rather than storing them in the topic
// data) keeps the topic files clean: changing the audio scheme touches only
// this one function.
//
// fieldId is one of: 'opening' | 'closing' | '<orbitId>-text' | '<orbitId>-connection'.
export function audioPath(topicId, language, fieldId) {
  return `/audio/${topicId}/${language}/${fieldId}.mp3`;
}
