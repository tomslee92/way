// "Faith" — curated topic (English). A cluster of red-letter memory verses, most
// carrying their OWN OT→NT image-thread anchored at Jesus's words (the mountain
// moved, the serpent lifted, the troubled heart, fear → only believe, look and
// live, resurrection). The two most general — "the work is to believe" (John 6:29)
// and "have faith in God" (Mark 11:22) — ride the topic spine (the justification
// arc) below. English text fetched LIVE via /api/bible (ESV). Connections DRAFT.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'faith',
  language: 'en',
  title: 'Faith',
  subtitle: 'The ground of it all.',

  memoryVerses: [
    { id: 'faith-work-of-god', ref: 'John 6:29', passageId: 'John 6:29', label: 'The work of God: believe',
      momentConnection: 'So when they ask what work God requires, Jesus answers with just one: this is the work of God, that you believe in him whom he has sent. Faith is the work.' },
    { id: 'faith-in-god', ref: 'Mark 11:22', passageId: 'Mark 11:22', label: 'Have faith in God',
      momentConnection: 'So Jesus says it as plainly as it can be said: have faith in God. The whole arc — reckoned righteous, the righteous living by faith — rests on this.' },
    {
      id: 'faith-mustard-seed',
      ref: 'Matthew 17:20',
      passageId: 'Matthew 17:20',
      label: 'Faith like a mustard seed',
      orbit: [
        station('mountain-origin', 'Zechariah 4:6-7', 'origin',
          'Before Zerubbabel’s impossible task God says it: not by might, not by power, but by my Spirit. “O great mountain… you shall become a plain.”'),
        station('mountain-unfolding', 'Isaiah 40:4', 'unfolding',
          'Isaiah widens it: every valley lifted, every mountain made low, the rough places a plain — the road God levels for His coming.'),
        station('mountain-moment', 'Matthew 17:20', 'moment',
          'So Jesus puts the mountain in your hands: faith like a mustard seed says to this mountain, move — and nothing will be impossible for you.'),
        station('mountain-echo', '1 Corinthians 13:2', 'aftermath',
          'Paul keeps it honest: even faith to move mountains is nothing without love — the mountain-moving power must be carried by love.'),
        station('mountain-consummation', 'Revelation 16:20', 'consummation',
          'Until the last mountain is gone for good: every island fled, and the mountains were not found — every obstacle between you and God, leveled.'),
      ],
    },
    {
      id: 'faith-whoever-believes',
      ref: 'John 11:25-26',
      passageId: 'John 11:25-26',
      label: 'Whoever believes in me',
      orbit: [
        station('believe-origin', 'Job 19:25-26', 'origin',
          'From the ash heap Job believes past the grave: I know that my Redeemer lives, and in my flesh I shall see God.'),
        station('believe-unfolding', 'Daniel 12:2', 'unfolding',
          'Daniel hears it promised: many who sleep in the dust shall awake — some to everlasting life. Faith reaches toward that morning.'),
        station('believe-moment', 'John 11:25-26', 'moment',
          'So Jesus makes faith the link: I am the resurrection and the life; whoever believes in me, though he die, yet shall he live. Do you believe this?'),
        station('believe-echo', '1 Corinthians 15:20-22', 'aftermath',
          'Paul says the morning has begun: Christ has been raised, the firstfruits of those who sleep — in Christ all will be made alive.'),
        station('believe-consummation', 'Revelation 21:4', 'consummation',
          'Until faith is sight and death is undone: He will wipe away every tear, and death shall be no more.'),
      ],
    },
    {
      id: 'faith-not-seen',
      ref: 'John 20:29',
      passageId: 'John 20:29',
      label: 'Blessed who have not seen',
      orbit: [
        station('sight-origin', 'Isaiah 64:4', 'origin',
          'Isaiah confesses the limit: no eye has seen a God like you, who acts for those who wait for Him. The deepest things are unseen.'),
        station('sight-unfolding', 'Habakkuk 2:3', 'unfolding',
          'And Habakkuk is told to trust the unseen promise: the vision awaits its time… though it lingers, wait for it; it will surely come.'),
        station('sight-moment', 'John 20:29', 'moment',
          'So Jesus blesses the faith that needs no proof: have you believed because you have seen me? Blessed are those who have not seen and yet believe.'),
        station('sight-echo', '1 Peter 1:8', 'aftermath',
          'Peter says that’s us: though you have not seen Him you love Him; though you do not now see Him you believe, and rejoice with joy unspeakable.'),
        station('sight-consummation', 'Revelation 22:4', 'consummation',
          'Until faith finally becomes sight: they shall see His face, and His name shall be on their foreheads. The unseen One, seen at last.'),
      ],
    },
    {
      id: 'faith-troubled',
      ref: 'John 14:1',
      passageId: 'John 14:1',
      label: 'Let not your heart be troubled',
      orbit: [
        station('troubled-origin', 'Psalm 46:1-2', 'origin',
          'The psalmist plants his feet: God is our refuge and strength, a very present help — so we will not fear, though the earth gives way and the mountains fall.'),
        station('troubled-unfolding', 'Isaiah 26:3', 'unfolding',
          'Isaiah names how the heart stays steady: you keep him in perfect peace whose mind is stayed on you, because he trusts in you.'),
        station('troubled-moment', 'John 14:1', 'moment',
          'So on the last night Jesus steadies them: let not your hearts be troubled. Believe in God; believe also in me. Faith is the cure for a troubled heart.'),
        station('troubled-echo', 'Philippians 4:6-7', 'aftermath',
          'Paul hands us the practice: do not be anxious, but in everything by prayer let your requests be known — and the peace of God will guard your hearts.'),
        station('troubled-consummation', 'Revelation 21:4', 'consummation',
          'Until the heart is never troubled again: He will wipe away every tear, and mourning and crying shall be no more.'),
      ],
    },
    {
      id: 'faith-only-believe',
      ref: 'Mark 5:36',
      passageId: 'Mark 5:36',
      label: 'Do not fear, only believe',
      orbit: [
        station('fear-origin', 'Psalm 56:3-4', 'origin',
          'David turns fear into trust: when I am afraid, I put my trust in you — in God, whose word I praise, I will not be afraid.'),
        station('fear-unfolding', 'Isaiah 41:10', 'unfolding',
          'God answers fear with His presence: fear not, for I am with you; I will strengthen you, I will help you, I will uphold you with my righteous right hand.'),
        station('fear-moment', 'Mark 5:36', 'moment',
          'So when the news comes that the girl is dead, Jesus says it to the father: do not fear, only believe. Faith is what fear is told to become.'),
        station('fear-echo', '2 Timothy 1:7', 'aftermath',
          'Paul says fear is not from God: He gave us a spirit not of fear but of power and love and self-control.'),
        station('fear-consummation', 'Revelation 1:17-18', 'consummation',
          'Until the risen Christ ends fear at its root: fear not — I am the first and the last, the living one; I died, and behold I am alive forevermore, and I hold the keys of Death.'),
      ],
    },
    {
      id: 'faith-look-and-live',
      ref: 'John 6:40',
      passageId: 'John 6:40',
      label: 'Look on the Son and live',
      orbit: [
        station('look-origin', 'Numbers 21:8-9', 'origin',
          'In the wilderness the bitten are dying — and God’s cure is a look: a bronze serpent lifted on a pole; everyone who looks at it lives.'),
        station('look-unfolding', 'Isaiah 45:22', 'unfolding',
          'Isaiah opens the look to the world: look to me and be saved, all the ends of the earth, for I am God, and there is no other.'),
        station('look-moment', 'John 6:40', 'moment',
          'So Jesus says He is the One lifted up to look at: it is my Father’s will that everyone who looks on the Son and believes has eternal life, and I will raise him up on the last day.'),
        station('look-echo', 'Hebrews 12:2', 'aftermath',
          'So the church runs the race the same way: looking to Jesus, the founder and finisher of our faith, who endured the cross for the joy set before Him.'),
        station('look-consummation', 'Revelation 22:4', 'consummation',
          'Until the look becomes face to face: they shall see His face, and His name shall be on their foreheads. The One we looked to in faith, seen forever.'),
      ],
    },
  ],

  // The topic spine — the justification arc. Home of "the work is to believe"
  // (John 6:29) and "have faith in God" (Mark 11:22).
  orbit: [
    { id: 'faith-origin', ref: 'Genesis 15:6', passageId: 'Genesis 15:6', position: 'origin',
      connection: 'Faith is reckoned righteous from the start: Abram believed the LORD, and it was counted to him as righteousness. Not earned — trusted.' },
    { id: 'faith-unfolding', ref: 'Habakkuk 2:4', passageId: 'Habakkuk 2:4', position: 'unfolding',
      connection: 'The prophet makes it the rule of a whole life: the righteous shall live by his faith — the line Paul will build the gospel on.' },
    { id: 'faith-moment', ref: 'Mark 9:23', passageId: 'Mark 9:23', position: 'moment',
      connection: 'A desperate father brings what little he has, and Jesus turns the hinge: all things are possible for one who believes. “I believe; help my unbelief.”' },
    { id: 'faith-aftermath', ref: 'Romans 5:1', passageId: 'Romans 5:1', position: 'aftermath',
      connection: 'Paul names what faith secures: since we are justified by faith, we have peace with God through our Lord Jesus Christ. The long quarrel is over.' },
    { id: 'faith-consummation', ref: 'Hebrews 12:1-2', passageId: 'Hebrews 12:1-2', position: 'consummation',
      connection: 'And faith finds its end where it began — looking to Jesus, the founder and finisher of our faith, who ran the whole race ahead of us.' },
  ],

  thread: 'The faith Abraham began finds its author and finisher in Jesus.',
  closing: '', // TODO: Rhema closing script
};
