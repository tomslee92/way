// "The Kingdom of God" — curated topic (English). A cluster of red-letter
// sayings and parables of the kingdom. Nearly every saying carries its OWN
// OT→NT image-thread (the great tree, the new birth, the segullah treasure, the
// pearl gates, the anawim, the stone not made with hands…); only "in your midst"
// (Luke 17:20-21) stays on the topic thread below, because it IS that thread's
// center station. Leaven (Matt 13:33) is left on the spine by choice — its image
// is the most interpretive. English text fetched live (ESV).
//
// Each station carries a `connection` — the quiet "why this is here" line, shown
// silently under the verse on the walk (never spoken; reading-led). DRAFT voice —
// Toms vouches and edits every line before launch.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

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
        station('athand-origin', 'Isaiah 52:7', 'origin',
          'Isaiah hears the herald cresting the hills, good news on his lips — “Your God reigns.”'),
        station('athand-unfolding', 'Malachi 3:1', 'unfolding',
          'Malachi promises a messenger to go first and clear the road — the one Mark names just before this verse.'),
        station('athand-moment', 'Mark 1:15', 'moment',
          'Then Jesus arrives saying the herald’s word has come true: the time is full, the reign is here — turn, and believe.'),
        station('athand-aftermath', 'Romans 10:15', 'aftermath',
          'Paul lifts Isaiah’s line and hands it to the church: now we are the feet that carry the news.'),
        station('athand-consummation', 'Revelation 11:15', 'consummation',
          'Until the announcement is final and forever: the kingdom of the world has become the kingdom of our Lord.'),
      ],
    },
    {
      id: 'kingdom-born-again',
      ref: 'John 3:3',
      passageId: 'John 3:3',
      label: 'Born again to see it',
      orbit: [
        station('born-origin', 'Ezekiel 36:25-27', 'origin',
          'God promises Ezekiel the impossible: clean water, a new heart, his own Spirit set inside you.'),
        station('born-unfolding', 'Jeremiah 31:33', 'unfolding',
          'Jeremiah hears the promise deepen — not laws on stone but a law written inside, on the heart itself.'),
        station('born-moment', 'John 3:5-7', 'moment',
          'So when Nicodemus is baffled, Jesus points him back: this new heart is a new birth — born of water and the Spirit.'),
        station('born-aftermath', 'Titus 3:5', 'aftermath',
          'Paul says it has happened to us — saved not by our works but by the washing of new birth and the renewing of the Spirit.'),
        station('born-consummation', 'Revelation 21:5', 'consummation',
          'And the One on the throne finishes what the new heart began: “Behold, I am making all things new.”'),
      ],
    },
    {
      id: 'kingdom-mustard-seed',
      ref: 'Matthew 13:31-32',
      passageId: 'Matthew 13:31-32',
      label: 'Like a mustard seed',
      orbit: [
        station('mustard-origin', 'Ezekiel 17:22-23', 'origin',
          'Ezekiel watches God plant a tender sprig that grows into a noble cedar — and every bird finds shelter in its branches.'),
        station('mustard-unfolding', 'Daniel 4:10-12', 'unfolding',
          'Daniel sees a tree reaching heaven, the birds of the air nesting in it — the picture of a kingdom that shelters the earth.'),
        station('mustard-moment', 'Mark 4:30-32', 'moment',
          'Jesus takes that royal-tree image and shrinks its beginning to a mustard seed: the kingdom starts smaller than you’d trust, and ends as the tree where the birds come home.'),
        station('mustard-aftermath', 'Colossians 1:6', 'aftermath',
          'Paul reports the growth already underway — the gospel bearing fruit and increasing in all the world.'),
        station('mustard-consummation', 'Revelation 11:15', 'consummation',
          'Until the smallest seed has filled the earth: the kingdom of the world has become the kingdom of our Lord.'),
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
        station('treasure-origin', 'Exodus 19:5', 'origin',
          'Before a single law is given, God names Israel his treasured possession — out of all peoples, his own.'),
        station('treasure-unfolding', 'Psalm 135:4', 'unfolding',
          'The psalmist holds that word close: not earned, but chosen — Israel, the LORD’s own treasure.'),
        station('treasure-moment', 'Matthew 13:44', 'moment',
          'Now Jesus turns it: in joy a man sells everything to buy the field. The treasure was never the kingdom we seize — it’s the people he gives all to gain.'),
        station('treasure-aftermath', '1 Peter 2:9', 'aftermath',
          'Peter says it plainly to the church: you are a chosen race, a people for his own possession, called out of darkness.'),
        station('treasure-consummation', 'Revelation 21:3', 'consummation',
          'And the end is the treasure kept: God dwells with his people, and they are his own — forever.'),
      ],
    },
    {
      id: 'kingdom-pearl',
      ref: 'Matthew 13:45-46',
      passageId: 'Matthew 13:45-46',
      label: 'A pearl of great price',
      // Wisdom beyond pearls → the gates of pearl.
      orbit: [
        station('pearl-origin', 'Proverbs 3:13-15', 'origin',
          'Proverbs sets the scale: wisdom is worth more than jewels — nothing you desire can compare.'),
        station('pearl-unfolding', 'Job 28:18', 'unfolding',
          'Job searches for where wisdom is found and prices it above coral and pearls — past anything the deep can give.'),
        station('pearl-moment', 'Matthew 13:45-46', 'moment',
          'Then Jesus puts a face on it: a merchant who has seen everything sells it all for one pearl — the kingdom is the find you’d trade your whole life to hold.'),
        station('pearl-aftermath', 'Philippians 3:8', 'aftermath',
          'Paul has made the trade himself — he counts all he had as loss for the surpassing worth of knowing Christ.'),
        station('pearl-consummation', 'Revelation 21:21', 'consummation',
          'And the city’s very gates are pearls — the priceless thing you sought becomes the door you walk through home.'),
      ],
    },
    {
      id: 'kingdom-seek-first',
      ref: 'Matthew 6:33',
      passageId: 'Matthew 6:33',
      label: 'Seek first the kingdom',
      // The Solomon echo — seek the kingdom-gift first, all else added.
      orbit: [
        station('seek-origin', '1 Kings 3:11-13', 'origin',
          'Given anything he wants, Solomon asks not for riches but for wisdom to govern God’s people — and God adds the riches he didn’t ask for.'),
        station('seek-unfolding', 'Psalm 37:4', 'unfolding',
          'The psalmist draws out the rule: delight first in the LORD himself, and the desires of your heart are given in him.'),
        station('seek-moment', 'Matthew 6:33', 'moment',
          'Jesus makes it the order of every life: seek first his kingdom and righteousness, and all the things you’d worry over are added to you.'),
        station('seek-aftermath', 'Philippians 4:19', 'aftermath',
          'Paul, content in plenty and in want, can promise it: God will supply your every need from his riches in Christ.'),
        station('seek-consummation', 'Revelation 21:3-4', 'consummation',
          'Until every need is met at the source: God himself with his people, and no more mourning or crying or want.'),
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
        station('child-origin', 'Psalm 131:1-2', 'origin',
          'David lays down all his striving and stills his soul like a weaned child with its mother — content simply to be held.'),
        station('child-unfolding', 'Isaiah 11:6', 'unfolding',
          'Isaiah’s vision of the healed world is led not by the strong but by a little child — the kingdom runs on a different kind of greatness.'),
        station('child-moment', 'Mark 10:15', 'moment',
          'So Jesus warns the grown and capable: the kingdom isn’t achieved, it’s received — and only small, open hands can take it.'),
        station('child-aftermath', '1 Peter 2:2', 'aftermath',
          'Peter keeps the church childlike on purpose: like newborns craving milk, grow up into salvation.'),
        station('child-consummation', 'Revelation 21:7', 'consummation',
          'And the trust is answered as belonging: to the one who holds on, God says — I will be his God, and he will be my son.'),
      ],
    },
    {
      id: 'kingdom-poor-in-spirit',
      ref: 'Matthew 5:3',
      passageId: 'Matthew 5:3',
      label: 'The poor in spirit',
      // The anawim — the LORD's lowly and contrite ones.
      orbit: [
        station('poor-origin', 'Isaiah 57:15', 'origin',
          'The high and holy One names where he chooses to live: with the lowly and contrite, to revive the heart that has run out of itself.'),
        station('poor-unfolding', 'Isaiah 61:1', 'unfolding',
          'Isaiah hears the Anointed sent with good news for the poor — the very text Jesus will open and claim as his own.'),
        station('poor-moment', 'Matthew 5:3', 'moment',
          'So Jesus’ first blessing falls on the empty-handed: the kingdom’s first citizens are the ones with nothing left but God — and to them it already belongs.'),
        station('poor-aftermath', 'James 2:5', 'aftermath',
          'James sees who answered the call: God chose the poor of the world to be rich in faith and heirs of the kingdom.'),
        station('poor-consummation', 'Revelation 21:3', 'consummation',
          'And the lowly inherit the whole promise: God dwells with his people, and they are his own at last.'),
      ],
    },
    {
      id: 'kingdom-little-flock',
      ref: 'Luke 12:32',
      passageId: 'Luke 12:32',
      label: 'Your Father’s good pleasure',
      // The flock given the kingdom.
      orbit: [
        station('flock-origin', 'Daniel 7:27', 'origin',
          'Daniel hears the verdict of heaven: the kingdom and the dominion are handed to the saints of the Most High — given, not seized.'),
        station('flock-unfolding', 'Isaiah 40:11', 'unfolding',
          'Isaiah shows how the King carries them — like a shepherd gathering the lambs in his arms, holding them close.'),
        station('flock-moment', 'Luke 12:32', 'moment',
          'So Jesus calms the small and frightened: don’t be afraid, little flock — your Father’s deepest joy is to give you the kingdom.'),
        station('flock-aftermath', '1 Peter 5:2-4', 'aftermath',
          'Peter passes the shepherd’s care to the church’s elders: tend God’s flock until the Chief Shepherd appears.'),
        station('flock-consummation', 'Revelation 5:10', 'consummation',
          'And the gift is complete in heaven’s song: you have made them a kingdom and priests to our God, and they shall reign.'),
      ],
    },
    {
      id: 'kingdom-not-of-this-world',
      ref: 'John 18:36',
      passageId: 'John 18:36',
      label: 'Not of this world',
      // A kingdom no human hand builds — the stone cut without hands.
      orbit: [
        station('notworld-origin', 'Daniel 2:44', 'origin',
          'Daniel reads a king’s dream: a stone cut by no human hand that shatters every empire and becomes a kingdom never destroyed.'),
        station('notworld-unfolding', 'Psalm 2:6-8', 'unfolding',
          'The psalm names that King — set by God on his holy hill, the nations given to him as his inheritance.'),
        station('notworld-moment', 'John 18:36', 'moment',
          'So Jesus tells Pilate the truth standing in front of him: my kingdom is not from this world — no empire builds it, and no empire can break it.'),
        station('notworld-aftermath', 'Hebrews 12:28', 'aftermath',
          'Hebrews tells the church what they hold: a kingdom that cannot be shaken when everything else is.'),
        station('notworld-consummation', 'Revelation 11:15', 'consummation',
          'Until the stone fills the earth and the cry goes up: the kingdom of the world has become the kingdom of our Lord, and he reigns forever.'),
      ],
    },
  ],

  // The topic thread — the Davidic throne to the throne of the Lamb. The native
  // home of "in your midst" (Luke 17:20-21), the moment station below.
  orbit: [
    { id: 'kingdom-origin', ref: '2 Samuel 7:16', passageId: '2 Samuel 7:16', position: 'origin',
      connection: 'God swears it to David: a throne with no last king, a kingdom with no end.' },
    { id: 'kingdom-unfolding', ref: 'Daniel 7:13-14', passageId: 'Daniel 7:13-14', position: 'unfolding',
      connection: 'Centuries on, Daniel sees the King arrive — one like a son of man, given a dominion that never passes away.' },
    { id: 'kingdom-moment', ref: 'Luke 17:20-21', passageId: 'Luke 17:20-21', position: 'moment',
      connection: 'And Jesus says the wait is over: don’t scan the horizon — the kingdom is already here, standing in your midst.' },
    { id: 'kingdom-aftermath', ref: 'Colossians 1:13', passageId: 'Colossians 1:13', position: 'aftermath',
      connection: 'Paul names where you now live: rescued from darkness, carried into the kingdom of the Son he loves.' },
    { id: 'kingdom-consummation', ref: 'Revelation 11:15', passageId: 'Revelation 11:15', position: 'consummation',
      connection: 'And the last word is a shout in heaven: the kingdom of the world has become the kingdom of our Lord, and he reigns forever.' },
  ],

  thread: 'The reign God always promised arrives in the person of the King.',
  closing: '', // TODO: Rhema closing script
};
