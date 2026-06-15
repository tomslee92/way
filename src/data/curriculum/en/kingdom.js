// "The Kingdom of God" — curated topic (English). A cluster of red-letter
// sayings and parables of the kingdom. Most share the topic thread (the Davidic
// kingdom arc, below); a few parables that draw on a distinct OT image carry
// their OWN thread (new birth → Ezekiel 36; the mustard seed → the great tree of
// Ezekiel 17 / Daniel 4). English text fetched live (ESV). DRAFT — Toms vouches.

const station = (id, ref, position) => ({ id, ref, passageId: ref, position });

export default {
  id: 'kingdom',
  language: 'en',
  title: 'The Kingdom of God',
  subtitle: 'His unmistakable center.',

  memoryVerses: [
    { id: 'kingdom-at-hand', ref: 'Mark 1:15', passageId: 'Mark 1:15', label: 'The kingdom is at hand' },
    {
      id: 'kingdom-born-again',
      ref: 'John 3:3',
      passageId: 'John 3:3',
      label: 'Born again to see it',
      orbit: [
        station('born-origin', 'Ezekiel 36:25-27', 'origin'),
        station('born-unfolding', 'Jeremiah 31:33', 'unfolding'),
        station('born-moment', 'John 3:5-7', 'moment'),
        station('born-aftermath', 'Titus 3:5', 'aftermath'),
        station('born-consummation', 'Revelation 21:5', 'consummation'),
      ],
    },
    {
      id: 'kingdom-mustard-seed',
      ref: 'Matthew 13:31-32',
      passageId: 'Matthew 13:31-32',
      label: 'Like a mustard seed',
      orbit: [
        station('mustard-origin', 'Ezekiel 17:22-23', 'origin'),
        station('mustard-unfolding', 'Daniel 4:10-12', 'unfolding'),
        station('mustard-moment', 'Mark 4:30-32', 'moment'),
        station('mustard-aftermath', 'Colossians 1:6', 'aftermath'),
        station('mustard-consummation', 'Revelation 11:15', 'consummation'),
      ],
    },
    { id: 'kingdom-leaven', ref: 'Matthew 13:33', passageId: 'Matthew 13:33', label: 'Like leaven' },
    { id: 'kingdom-treasure', ref: 'Matthew 13:44', passageId: 'Matthew 13:44', label: 'A treasure hidden' },
    { id: 'kingdom-pearl', ref: 'Matthew 13:45-46', passageId: 'Matthew 13:45-46', label: 'A pearl of great price' },
    { id: 'kingdom-seek-first', ref: 'Matthew 6:33', passageId: 'Matthew 6:33', label: 'Seek first the kingdom' },
    { id: 'kingdom-in-your-midst', ref: 'Luke 17:20-21', passageId: 'Luke 17:20-21', label: 'In your midst' },
    { id: 'kingdom-like-a-child', ref: 'Mark 10:15', passageId: 'Mark 10:15', label: 'Receive it like a child' },
    { id: 'kingdom-poor-in-spirit', ref: 'Matthew 5:3', passageId: 'Matthew 5:3', label: 'The poor in spirit' },
    { id: 'kingdom-little-flock', ref: 'Luke 12:32', passageId: 'Luke 12:32', label: 'Your Father’s good pleasure' },
    { id: 'kingdom-not-of-this-world', ref: 'John 18:36', passageId: 'John 18:36', label: 'Not of this world' },
  ],

  // The topic thread — the Davidic throne to the throne of the Lamb. The default
  // for sayings without their own image-thread.
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
