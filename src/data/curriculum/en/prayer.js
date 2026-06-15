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
    { id: 'prayer-origin', ref: 'Genesis 4:26', passageId: 'Genesis 4:26', position: 'origin',
      connection: 'Prayer starts early in the story: in the days of Enosh, people began to call on the name of the LORD. From the beginning, we reach for God with words.' },
    { id: 'prayer-unfolding', ref: 'Jeremiah 29:12-13', passageId: 'Jeremiah 29:12-13', position: 'unfolding',
      connection: 'And God promises the reach is not in vain: you will call on me and I will listen; you will seek me and find me, when you seek with all your heart.' },
    { id: 'prayer-moment', ref: 'Matthew 6:9-13', passageId: 'Matthew 6:9-13', position: 'moment',
      connection: 'Then Jesus does the unthinkable — He hands us the words and a name to use: Our Father. The God of heaven is addressed as Father, and the door stands open.' },
    { id: 'prayer-aftermath', ref: 'Hebrews 4:16', passageId: 'Hebrews 4:16', position: 'aftermath',
      connection: 'Hebrews tells us how to come now: with confidence to the throne of grace, because our High Priest has gone in ahead of us — to find mercy and help in time of need.' },
    { id: 'prayer-consummation', ref: 'Revelation 8:3-4', passageId: 'Revelation 8:3-4', position: 'consummation',
      connection: 'And no prayer is lost: in heaven they rise like incense before the throne — every cry you ever prayed, kept, and answered.' },
  ],

  thread: 'Prayer is access to the Father, opened wide by Christ the High Priest.',
  closing: '', // TODO: Rhema closing script
};
