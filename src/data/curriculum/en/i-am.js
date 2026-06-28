// "I AM" — curated topic (English). A CLUSTER of red-letter memory verses
// (Jesus's "I am" / ἐγώ εἰμι sayings). Each predicate saying carries its OWN
// image-thread (origin → unfolding → moment → aftermath → consummation); the
// absolute claim (John 8:58) has no own thread and falls back to the topic
// `orbit` (the divine-Name spine). Thread selections grounded in standard
// typology (Beale & Carson, NT Use of the OT) — verified/vouched by Toms.
//
// English text fetched LIVE via /api/bible (ESV); passageId === ref. Per-station
// `connection` (the quiet "why this is here" line, shown on the walk and read
// aloud after the verse) is DRAFT — Toms vouches and edits before launch.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'i-am',
  language: 'en',
  title: 'I AM',
  subtitle: 'The Name of God on Jesus’s own lips.',

  memoryVerses: [
    {
      id: 'i-am-bread',
      ref: 'John 6:35',
      passageId: 'John 6:35',
      label: 'The bread of life',
      orbit: [
        station('bread-origin', 'Exodus 16:4', 'origin',
          'In the wilderness, God rains bread from heaven — manna, enough for each day. Israel lives on a gift they can’t store or make.'),
        station('bread-unfolding', 'Deuteronomy 8:3', 'unfolding',
          'Moses reads the lesson of the manna: man does not live by bread alone, but by every word from the mouth of God. The hunger was always for Him.'),
        station('bread-moment', 'John 6:51', 'moment',
          'So Jesus says the thing the manna was pointing to: I am the living bread that came down from heaven; the bread I give is my flesh, for the life of the world.'),
        station('bread-aftermath', 'Luke 22:19', 'aftermath',
          'At the table He puts it in their hands — this is my body, given for you. The bread from heaven is broken to be shared.'),
        station('bread-consummation', 'Revelation 19:9', 'consummation',
          'And the story ends at a feast: blessed are those invited to the marriage supper of the Lamb. The wilderness hunger is finally filled.'),
      ],
    },
    {
      id: 'i-am-light',
      ref: 'John 8:12',
      passageId: 'John 8:12',
      label: 'The light of the world',
      orbit: [
        station('light-origin', 'Genesis 1:3', 'origin',
          'Before anything else, God speaks light into the dark: let there be light. Creation’s very first word is His.'),
        station('light-unfolding', 'Isaiah 9:2', 'unfolding',
          'Isaiah promises that light to a people in the dark: those who walked in darkness have seen a great light — a child to be born.'),
        station('light-moment', 'John 9:5', 'moment',
          'Then Jesus says it standing in the world He made: as long as I am in the world, I am the light of the world — and He opens a blind man’s eyes to prove it.'),
        station('light-aftermath', '2 Corinthians 4:6', 'aftermath',
          'Paul says that same light has dawned inside us: the God who said “let light shine out of darkness” has shone in our hearts, in the face of Christ.'),
        station('light-consummation', 'Revelation 21:23', 'consummation',
          'And the city needs no sun: the glory of God gives it light, and its lamp is the Lamb. The first light becomes the only light.'),
      ],
    },
    {
      id: 'i-am-door',
      ref: 'John 10:9',
      passageId: 'John 10:9',
      label: 'The door',
      orbit: [
        station('door-origin', 'Genesis 7:16', 'origin',
          'As the flood comes, God Himself shuts the door of the ark — one door between death and life, and the LORD closes it behind His people.'),
        station('door-unfolding', 'Psalm 118:19-20', 'unfolding',
          'The psalmist sings of another door: open to me the gates of righteousness — this is the gate of the LORD; the righteous enter through it.'),
        station('door-moment', 'John 10:7', 'moment',
          'Then Jesus says He is that door: I am the door of the sheep. Whoever enters by me will be saved, and go in and out and find pasture.'),
        station('door-aftermath', 'Acts 14:27', 'aftermath',
          'And the door swings wide: the church reports how God had opened a door of faith to the Gentiles. The way in is for everyone now.'),
        station('door-consummation', 'Revelation 21:25', 'consummation',
          'And in the end the gates are never shut — no flood, no night, no threat. The door God once closed to save now stands open forever.'),
      ],
    },
    {
      id: 'i-am-shepherd',
      ref: 'John 10:11',
      passageId: 'John 10:11',
      label: 'The good shepherd',
      orbit: [
        station('shepherd-origin', 'Psalm 23:1', 'origin',
          'David sings the line every heart knows: the LORD is my shepherd, I shall not want. God Himself is the one who leads and keeps.'),
        station('shepherd-unfolding', 'Ezekiel 34:11-12', 'unfolding',
          'When the shepherds of Israel fail the flock, God says He’ll come Himself: I will seek my sheep and rescue them, as a shepherd seeks his flock.'),
        station('shepherd-moment', 'John 10:14', 'moment',
          'Then Jesus says the promise has arrived: I am the good shepherd; I know my own and my own know me — and I lay down my life for the sheep.'),
        station('shepherd-aftermath', 'Hebrews 13:20', 'aftermath',
          'And the shepherd who died is raised: God brought again from the dead our Lord Jesus, the great shepherd of the sheep, by the blood of the eternal covenant.'),
        station('shepherd-consummation', 'Revelation 7:17', 'consummation',
          'And at the end the Shepherd is on the throne — the Lamb will be their shepherd, leading them to springs of living water, and God will wipe away every tear.'),
      ],
    },
    {
      id: 'i-am-life',
      ref: 'John 11:25',
      passageId: 'John 11:25',
      label: 'The resurrection and the life',
      orbit: [
        station('life-origin', 'Job 19:25-26', 'origin',
          'From the depth of his suffering Job reaches past death: I know that my Redeemer lives, and after my skin is destroyed, yet in my flesh I shall see God.'),
        station('life-unfolding', 'Daniel 12:2', 'unfolding',
          'Daniel is told it plainly: many who sleep in the dust of the earth shall awake — some to everlasting life. The grave is not the last word.'),
        station('life-moment', 'John 11:43-44', 'moment',
          'Then Jesus calls a dead man by name — Lazarus, come out — and he comes. The hope of the resurrection walks out of a tomb at His word.'),
        station('life-aftermath', '1 Corinthians 15:20-22', 'aftermath',
          'Paul says it has begun for good: Christ has been raised, the firstfruits of those who sleep. As in Adam all die, so in Christ all will be made alive.'),
        station('life-consummation', 'Revelation 21:4', 'consummation',
          'And death is undone at last: He will wipe away every tear, and death shall be no more, nor mourning nor crying nor pain — the former things are gone.'),
      ],
    },
    {
      id: 'i-am-way',
      ref: 'John 14:6',
      passageId: 'John 14:6',
      label: 'The way, the truth, and the life',
      orbit: [
        station('way-origin', 'Isaiah 35:8', 'origin',
          'Isaiah sees a road through the wilderness: a highway shall be there, the Way of Holiness — the redeemed shall walk on it home.'),
        station('way-unfolding', 'Psalm 25:4-5', 'unfolding',
          'And the heart’s prayer is to be shown it: make me to know your ways, O LORD; lead me in your truth and teach me. We were always asking for the way.'),
        station('way-moment', 'John 14:6', 'moment',
          'So Jesus says it outright: I am the way, and the truth, and the life — no one comes to the Father except through me. The road Isaiah saw is a person.'),
        station('way-aftermath', 'Hebrews 10:19-20', 'aftermath',
          'And the church walks it with confidence: we enter the holy places by the new and living way He opened through the curtain — that is, His flesh.'),
        station('way-consummation', 'Revelation 22:4', 'consummation',
          'And the road arrives at a face: they shall see His face, and His name shall be on their foreheads. The Way leads all the way home, to God Himself.'),
      ],
    },
    {
      id: 'i-am-vine',
      ref: 'John 15:5',
      passageId: 'John 15:5',
      label: 'The true vine',
      orbit: [
        station('vine-origin', 'Psalm 80:8-9', 'origin',
          'Israel is God’s own vine: you brought a vine out of Egypt, cleared the ground, and it took root and filled the land. Planted and tended by His hand.'),
        station('vine-unfolding', 'Isaiah 5:1-7', 'unfolding',
          'But the vine yields wild grapes — Isaiah’s song of the vineyard ends in heartbreak: God looked for justice and found bloodshed. The vine of Israel failed.'),
        station('vine-moment', 'John 15:8', 'moment',
          'So Jesus becomes the vine Israel was meant to be: by this my Father is glorified, that you bear much fruit — and apart from me you can do nothing.'),
        station('vine-aftermath', 'Galatians 5:22-23', 'aftermath',
          'And the fruit finally comes — not by effort but by abiding: the fruit of the Spirit is love, joy, peace, patience, kindness… what the old vine never grew.'),
        station('vine-consummation', 'Revelation 22:2', 'consummation',
          'And the vine becomes a tree of life by the river, yielding fruit every month, its leaves for the healing of the nations. The fruit never fails again.'),
      ],
    },
    // The absolute "I am" — no own thread; rides the divine-Name spine, pivoting on
    // its own words.
    { id: 'i-am-before-abraham', ref: 'John 8:58', passageId: 'John 8:58', label: 'Before Abraham was, I am',
      momentConnection: 'So Jesus says the unsayable about himself: truly, truly, I say to you, before Abraham was, I am. He takes the name from the burning bush as his own — and they pick up stones.' },
  ],

  // The spine — the divine Name from the burning bush to the throne (used by the
  // absolute "I am", and the frame for the whole topic). Connections authored.
  orbit: [
    {
      id: 'exodus-3-14',
      ref: 'Exodus 3:14',
      passageId: 'Exodus 3:14',
      position: 'origin',
      connection:
        'This is where it begins. Moses is standing before a bush that burns ' +
        'but is not consumed, and he asks God for His name. And God answers: I ' +
        'am who I am. This is the name Jesus just took for Himself. The voice ' +
        'from the burning bush is standing in front of them.',
    },
    {
      id: 'isaiah-43-10',
      ref: 'Isaiah 43:10',
      passageId: 'Isaiah 43:10',
      position: 'unfolding',
      connection:
        'Centuries later, the prophet Isaiah speaks for the Lord. I am He. ' +
        'There is no other. The I AM is not a name that can be shared. For ' +
        'Jesus to take this name for Himself is to claim He is the one true God.',
    },
    {
      id: 'john-8-24',
      ref: 'John 8:24',
      passageId: 'John 8:24',
      position: 'moment',
      connection:
        'This is the same conversation in which Jesus says, before Abraham was, ' +
        'I am. He has already said it. I am He. The people did not yet ' +
        'understand. So He says it again, more clearly, until they cannot miss it.',
    },
    {
      id: 'john-18-5-6',
      ref: 'John 18:5-6',
      passageId: 'John 18:5-6',
      position: 'aftermath',
      connection:
        'In the garden, soldiers come to arrest Him. He speaks the name. I am ' +
        'He. And they fall to the ground. The name itself has power. This is no ' +
        'ordinary man.',
    },
    {
      id: 'revelation-1-8',
      ref: 'Revelation 1:8',
      passageId: 'Revelation 1:8',
      position: 'consummation',
      connection:
        'And finally, at the end of all things. From the burning bush to the ' +
        'throne of heaven, it is the same voice. I AM was. I AM is. I AM is to ' +
        'come.',
    },
  ],

  thread: 'From the burning bush to the throne of heaven, it is the same voice: I AM.',

  opening:
    'Listen carefully to how Jesus speaks of Himself. He does not say, I was. ' +
    'He says, I am. These are the same words God spoke to Moses from the burning ' +
    'bush. The people listening understood exactly what He claimed, and they ' +
    'picked up stones to kill Him. Before we carry these words, let’s walk ' +
    'through Scripture and see what He was really saying.',

  closing:
    'You now carry these words in your heart. When you speak them, remember the ' +
    'burning bush. Remember the prophet Isaiah. Remember the soldiers falling in ' +
    'the garden. Remember the throne of heaven. The One who spoke from the bush, ' +
    'the One who will reign forever, is the One who came to you in Jesus. This is ' +
    'who you belong to.',
};
