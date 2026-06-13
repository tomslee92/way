// "Prayer" — curated topic (English). Anchor-and-orbit per the curated-topics-
// draft. English text fetched LIVE via /api/bible (ESV). Rhema scripts are TODO.

export default {
  id: 'prayer',
  language: 'en',
  title: 'Prayer',
  subtitle: 'The believer’s breath.',

  anchor: {
    ref: 'Matthew 7:7',
    passageId: 'Matthew 7:7',
    speaker: 'Jesus',
    opening: '', // TODO: Rhema opening script
  },

  orbit: [
    { id: 'prayer-origin', ref: 'Genesis 4:26', passageId: 'Genesis 4:26', position: 'origin', connection: '' },
    { id: 'prayer-unfolding', ref: 'Jeremiah 29:12-13', passageId: 'Jeremiah 29:12-13', position: 'unfolding', connection: '' },
    { id: 'prayer-moment', ref: 'Matthew 6:9-13', passageId: 'Matthew 6:9-13', position: 'moment', connection: '' },
    { id: 'prayer-aftermath', ref: 'Hebrews 4:16', passageId: 'Hebrews 4:16', position: 'aftermath', connection: '' },
    { id: 'prayer-consummation', ref: 'Revelation 8:3-4', passageId: 'Revelation 8:3-4', position: 'consummation', connection: '' },
  ],

  thread: 'Prayer is access to the Father, opened wide by Christ the High Priest.',
  closing: '', // TODO: Rhema closing script
};
