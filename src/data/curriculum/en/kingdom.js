// "The Kingdom of God" — curated topic (English). Anchor-and-orbit per the
// curated-topics-draft. English verse text is fetched LIVE via /api/bible (ESV)
// using `ref` — never stored (ESV license; verify-don't-assert). Rhema teaching
// scripts (opening / connection / closing) are TODO — authored by Toms.
//
// passageId === ref here: the ESV API resolves reference strings directly.

export default {
  id: 'kingdom',
  language: 'en',
  title: 'The Kingdom of God',
  subtitle: 'His unmistakable center.',

  memoryVerses: [
    { id: 'kingdom-at-hand', ref: 'Mark 1:15', passageId: 'Mark 1:15', label: 'The kingdom is at hand' },
  ],

  orbit: [
    { id: 'kingdom-origin', ref: '2 Samuel 7:16', passageId: '2 Samuel 7:16', position: 'origin', connection: '' },
    { id: 'kingdom-unfolding', ref: 'Daniel 7:13-14', passageId: 'Daniel 7:13-14', position: 'unfolding', connection: '' },
    { id: 'kingdom-moment', ref: 'Luke 17:20-21', passageId: 'Luke 17:20-21', position: 'moment', connection: '' },
    { id: 'kingdom-aftermath', ref: 'Colossians 1:13', passageId: 'Colossians 1:13', position: 'aftermath', connection: '' },
    { id: 'kingdom-consummation', ref: 'Revelation 11:15', passageId: 'Revelation 11:15', position: 'consummation', connection: '' },
  ],

  thread: 'The reign God always promised arrives in the person of the King.',
  closing: '', // TODO: Rhema closing script
};
