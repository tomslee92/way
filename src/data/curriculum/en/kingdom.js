// "The Kingdom of God" — curated topic (English). A cluster of red-letter
// sayings and parables of the kingdom. Nearly every saying carries its OWN
// OT→NT image-thread (the great tree, the new birth, the segullah treasure, the
// pearl gates, the anawim, the stone not made with hands…); only "in your midst"
// (Luke 17:20-21) stays on the topic thread below, because it IS that thread's
// center station. Leaven (Matt 13:33) is left on the spine by choice — its image
// is the most interpretive. English text fetched live (ESV). DRAFT — Toms vouches.

const station = (id, ref, position) => ({ id, ref, passageId: ref, position });

export default {
  id: 'kingdom',
  language: 'en',
  title: 'The Kingdom of God',
  subtitle: 'His unmistakable center.',

  memoryVerses: [
    {
      id: 'kingdom-at-hand',
      ref: 'Mark 1:15',
      passageId: 'Mark 1:15',
      label: 'The kingdom is at hand',
      // The herald of the reign — "Your God reigns," announced.
      orbit: [
        station('athand-origin', 'Isaiah 52:7', 'origin'),
        station('athand-unfolding', 'Malachi 3:1', 'unfolding'),
        station('athand-moment', 'Mark 1:15', 'moment'),
        station('athand-aftermath', 'Romans 10:15', 'aftermath'),
        station('athand-consummation', 'Revelation 11:15', 'consummation'),
      ],
    },
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
    {
      id: 'kingdom-treasure',
      ref: 'Matthew 13:44',
      passageId: 'Matthew 13:44',
      label: 'A treasure hidden',
      // The "we are God's treasure" reading — the segullah thread.
      orbit: [
        station('treasure-origin', 'Exodus 19:5', 'origin'),
        station('treasure-unfolding', 'Psalm 135:4', 'unfolding'),
        station('treasure-moment', 'Matthew 13:44', 'moment'),
        station('treasure-aftermath', '1 Peter 2:9', 'aftermath'),
        station('treasure-consummation', 'Revelation 21:3', 'consummation'),
      ],
    },
    {
      id: 'kingdom-pearl',
      ref: 'Matthew 13:45-46',
      passageId: 'Matthew 13:45-46',
      label: 'A pearl of great price',
      // Wisdom beyond pearls → the gates of pearl.
      orbit: [
        station('pearl-origin', 'Proverbs 3:13-15', 'origin'),
        station('pearl-unfolding', 'Job 28:18', 'unfolding'),
        station('pearl-moment', 'Matthew 13:45-46', 'moment'),
        station('pearl-aftermath', 'Philippians 3:8', 'aftermath'),
        station('pearl-consummation', 'Revelation 21:21', 'consummation'),
      ],
    },
    {
      id: 'kingdom-seek-first',
      ref: 'Matthew 6:33',
      passageId: 'Matthew 6:33',
      label: 'Seek first the kingdom',
      // The Solomon echo — seek the kingdom-gift first, all else added.
      orbit: [
        station('seek-origin', '1 Kings 3:11-13', 'origin'),
        station('seek-unfolding', 'Psalm 37:4', 'unfolding'),
        station('seek-moment', 'Matthew 6:33', 'moment'),
        station('seek-aftermath', 'Philippians 4:19', 'aftermath'),
        station('seek-consummation', 'Revelation 21:3-4', 'consummation'),
      ],
    },
    { id: 'kingdom-in-your-midst', ref: 'Luke 17:20-21', passageId: 'Luke 17:20-21', label: 'In your midst' },
    {
      id: 'kingdom-like-a-child',
      ref: 'Mark 10:15',
      passageId: 'Mark 10:15',
      label: 'Receive it like a child',
      // Childlike trust → sonship.
      orbit: [
        station('child-origin', 'Psalm 131:1-2', 'origin'),
        station('child-unfolding', 'Isaiah 11:6', 'unfolding'),
        station('child-moment', 'Mark 10:15', 'moment'),
        station('child-aftermath', '1 Peter 2:2', 'aftermath'),
        station('child-consummation', 'Revelation 21:7', 'consummation'),
      ],
    },
    {
      id: 'kingdom-poor-in-spirit',
      ref: 'Matthew 5:3',
      passageId: 'Matthew 5:3',
      label: 'The poor in spirit',
      // The anawim — the LORD's lowly and contrite ones.
      orbit: [
        station('poor-origin', 'Isaiah 57:15', 'origin'),
        station('poor-unfolding', 'Isaiah 61:1', 'unfolding'),
        station('poor-moment', 'Matthew 5:3', 'moment'),
        station('poor-aftermath', 'James 2:5', 'aftermath'),
        station('poor-consummation', 'Revelation 21:3', 'consummation'),
      ],
    },
    {
      id: 'kingdom-little-flock',
      ref: 'Luke 12:32',
      passageId: 'Luke 12:32',
      label: 'Your Father’s good pleasure',
      // The flock given the kingdom.
      orbit: [
        station('flock-origin', 'Daniel 7:27', 'origin'),
        station('flock-unfolding', 'Isaiah 40:11', 'unfolding'),
        station('flock-moment', 'Luke 12:32', 'moment'),
        station('flock-aftermath', '1 Peter 5:2-4', 'aftermath'),
        station('flock-consummation', 'Revelation 5:10', 'consummation'),
      ],
    },
    {
      id: 'kingdom-not-of-this-world',
      ref: 'John 18:36',
      passageId: 'John 18:36',
      label: 'Not of this world',
      // A kingdom no human hand builds — the stone cut without hands.
      orbit: [
        station('notworld-origin', 'Daniel 2:44', 'origin'),
        station('notworld-unfolding', 'Psalm 2:6-8', 'unfolding'),
        station('notworld-moment', 'John 18:36', 'moment'),
        station('notworld-aftermath', 'Hebrews 12:28', 'aftermath'),
        station('notworld-consummation', 'Revelation 11:15', 'consummation'),
      ],
    },
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
