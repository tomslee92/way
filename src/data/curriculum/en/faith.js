// "Faith" — curated topic (English). Anchor-and-orbit per the curated-topics-
// draft. Uses the PRIMARY anchor (John 6:29) — the alt anchor (Mark 9:23) would
// collide with the Moment orbit station. English text fetched LIVE via
// /api/bible (ESV). Rhema scripts are TODO.

export default {
  id: 'faith',
  language: 'en',
  title: 'Faith',
  subtitle: 'The ground of it all.',

  memoryVerses: [
    { id: 'faith-believe', ref: 'John 6:29', passageId: 'John 6:29', label: 'Believe in him whom he sent' },
  ],

  orbit: [
    { id: 'faith-origin', ref: 'Genesis 15:6', passageId: 'Genesis 15:6', position: 'origin', connection: '' },
    { id: 'faith-unfolding', ref: 'Habakkuk 2:4', passageId: 'Habakkuk 2:4', position: 'unfolding', connection: '' },
    { id: 'faith-moment', ref: 'Mark 9:23', passageId: 'Mark 9:23', position: 'moment', connection: '' },
    { id: 'faith-aftermath', ref: 'Romans 5:1', passageId: 'Romans 5:1', position: 'aftermath', connection: '' },
    { id: 'faith-consummation', ref: 'Hebrews 12:1-2', passageId: 'Hebrews 12:1-2', position: 'consummation', connection: '' },
  ],

  thread: 'The faith Abraham began finds its author and finisher in Jesus.',
  closing: '', // TODO: Rhema closing script
};
