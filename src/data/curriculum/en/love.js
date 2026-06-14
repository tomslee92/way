// "Love" — curated topic (English). Anchor-and-orbit per the curated-topics-
// draft. English text fetched LIVE via /api/bible (ESV) using `ref` — never
// stored. Rhema teaching scripts are TODO (authored by Toms).

export default {
  id: 'love',
  language: 'en',
  title: 'Love',
  subtitle: 'The heart of the Law.',

  memoryVerses: [
    { id: 'love-one-another', ref: 'John 13:34', passageId: 'John 13:34', label: 'Love one another' },
    { id: 'love-great-commandment', ref: 'Matthew 22:37-39', passageId: 'Matthew 22:37-39', label: 'The great commandment' },
    { id: 'love-greater-love', ref: 'John 15:12-13', passageId: 'John 15:12-13', label: 'Greater love' },
    { id: 'love-your-enemies', ref: 'Matthew 5:44', passageId: 'Matthew 5:44', label: 'Love your enemies' },
    { id: 'love-abide', ref: 'John 15:9', passageId: 'John 15:9', label: 'Abide in my love' },
  ],

  orbit: [
    { id: 'love-origin', ref: 'Deuteronomy 6:5', passageId: 'Deuteronomy 6:5', position: 'origin', connection: '' },
    { id: 'love-unfolding', ref: 'Leviticus 19:18', passageId: 'Leviticus 19:18', position: 'unfolding', connection: '' },
    { id: 'love-moment', ref: 'Matthew 22:37-40', passageId: 'Matthew 22:37-40', position: 'moment', connection: '' },
    { id: 'love-aftermath', ref: '1 John 4:10', passageId: '1 John 4:10', position: 'aftermath', connection: '' },
    { id: 'love-consummation', ref: 'Revelation 21:3', passageId: 'Revelation 21:3', position: 'consummation', connection: '' },
  ],

  thread: 'The love commanded in the Law is the love embodied at the cross.',
  closing: '', // TODO: Rhema closing script
};
