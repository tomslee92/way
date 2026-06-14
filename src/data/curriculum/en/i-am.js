// "I AM" — curated topic (English). A CLUSTER of red-letter memory verses
// (Jesus's "I am" / ἐγώ εἰμι sayings). Each predicate saying carries its OWN
// image-thread (origin → unfolding → moment → aftermath → consummation); the
// absolute claim (John 8:58) has no own thread and falls back to the topic
// `orbit` (the divine-Name spine). Thread selections grounded in standard
// typology (Beale & Carson, NT Use of the OT) — verified/vouched by Toms.
//
// English text fetched LIVE via /api/bible (ESV); passageId === ref. Rhema's
// per-station narration (connection) is authored by Toms — TODO.

const station = (id, ref, position) => ({ id, ref, passageId: ref, position });

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
        station('bread-origin', 'Exodus 16:4', 'origin'),
        station('bread-unfolding', 'Deuteronomy 8:3', 'unfolding'),
        station('bread-moment', 'John 6:51', 'moment'),
        station('bread-aftermath', 'Luke 22:19', 'aftermath'),
        station('bread-consummation', 'Revelation 19:9', 'consummation'),
      ],
    },
    {
      id: 'i-am-light',
      ref: 'John 8:12',
      passageId: 'John 8:12',
      label: 'The light of the world',
      orbit: [
        station('light-origin', 'Genesis 1:3', 'origin'),
        station('light-unfolding', 'Isaiah 9:2', 'unfolding'),
        station('light-moment', 'John 9:5', 'moment'),
        station('light-aftermath', '2 Corinthians 4:6', 'aftermath'),
        station('light-consummation', 'Revelation 21:23', 'consummation'),
      ],
    },
    {
      id: 'i-am-door',
      ref: 'John 10:9',
      passageId: 'John 10:9',
      label: 'The door',
      orbit: [
        station('door-origin', 'Genesis 7:16', 'origin'),
        station('door-unfolding', 'Psalm 118:19-20', 'unfolding'),
        station('door-moment', 'John 10:7', 'moment'),
        station('door-aftermath', 'Acts 14:27', 'aftermath'),
        station('door-consummation', 'Revelation 21:25', 'consummation'),
      ],
    },
    {
      id: 'i-am-shepherd',
      ref: 'John 10:11',
      passageId: 'John 10:11',
      label: 'The good shepherd',
      orbit: [
        station('shepherd-origin', 'Psalm 23:1', 'origin'),
        station('shepherd-unfolding', 'Ezekiel 34:11-12', 'unfolding'),
        station('shepherd-moment', 'John 10:14', 'moment'),
        station('shepherd-aftermath', 'Hebrews 13:20', 'aftermath'),
        station('shepherd-consummation', 'Revelation 7:17', 'consummation'),
      ],
    },
    {
      id: 'i-am-life',
      ref: 'John 11:25',
      passageId: 'John 11:25',
      label: 'The resurrection and the life',
      orbit: [
        station('life-origin', 'Job 19:25-26', 'origin'),
        station('life-unfolding', 'Daniel 12:2', 'unfolding'),
        station('life-moment', 'John 11:43-44', 'moment'),
        station('life-aftermath', '1 Corinthians 15:20-22', 'aftermath'),
        station('life-consummation', 'Revelation 21:4', 'consummation'),
      ],
    },
    {
      id: 'i-am-way',
      ref: 'John 14:6',
      passageId: 'John 14:6',
      label: 'The way, the truth, and the life',
      orbit: [
        station('way-origin', 'Isaiah 35:8', 'origin'),
        station('way-unfolding', 'Psalm 25:4-5', 'unfolding'),
        station('way-moment', 'Hebrews 10:19-20', 'moment'),
        station('way-aftermath', '1 Timothy 2:5', 'aftermath'),
        station('way-consummation', 'Revelation 22:4', 'consummation'),
      ],
    },
    {
      id: 'i-am-vine',
      ref: 'John 15:5',
      passageId: 'John 15:5',
      label: 'The true vine',
      orbit: [
        station('vine-origin', 'Psalm 80:8-9', 'origin'),
        station('vine-unfolding', 'Isaiah 5:1-7', 'unfolding'),
        station('vine-moment', 'John 15:8', 'moment'),
        station('vine-aftermath', 'Galatians 5:22-23', 'aftermath'),
        station('vine-consummation', 'Revelation 22:2', 'consummation'),
      ],
    },
    // The absolute "I am" — no own thread; falls back to the divine-Name spine.
    { id: 'i-am-before-abraham', ref: 'John 8:58', passageId: 'John 8:58', label: 'Before Abraham was, I am' },
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
