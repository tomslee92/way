// "Prayer" — curated topic (English). Anchor-and-orbit per the curated-topics-
// draft. English text fetched LIVE via /api/bible (ESV). Rhema scripts are TODO.

export default {
  id: 'prayer',
  language: 'en',
  title: 'Prayer',
  subtitle: 'The believer’s breath.',

  memoryVerses: [
    { id: 'prayer-ask', ref: 'Matthew 7:7', passageId: 'Matthew 7:7', label: 'Ask, seek, knock' },
    { id: 'prayer-in-secret', ref: 'Matthew 6:6', passageId: 'Matthew 6:6', label: 'Pray in secret' },
    { id: 'prayer-lords-prayer', ref: 'Matthew 6:9-13', passageId: 'Matthew 6:9-13', label: 'The Lord’s Prayer' },
    { id: 'prayer-abide-ask', ref: 'John 15:7', passageId: 'John 15:7', label: 'Ask whatever you wish' },
    { id: 'prayer-believe-received', ref: 'Mark 11:24', passageId: 'Mark 11:24', label: 'Believe you have received' },
    { id: 'prayer-always', ref: 'Luke 18:1', passageId: 'Luke 18:1', label: 'Always pray, don’t lose heart' },
  ],

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
