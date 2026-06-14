// "I AM" — curated topic (English). The new shape: a CLUSTER of red-letter
// memory verses (Jesus's "I am" / ἐγώ εἰμι sayings) + one thread (the divine
// Name across the canon, read for context). English verse text is fetched LIVE
// via /api/bible (ESV) — never stored (license; verify-don't-assert). Rhema's
// narration (opening / connection / closing) is authored by Toms and kept here.
//
// passageId === ref: the ESV API resolves reference strings directly.

export default {
  id: 'i-am',
  language: 'en',
  title: 'I AM',
  subtitle: 'The Name of God on Jesus’s own lips.',

  // Memory verses — what you carry. The seven predicate "I am" sayings + the
  // absolute claim (John 8:58). All red-letter; text fetched live.
  memoryVerses: [
    { id: 'i-am-bread', ref: 'John 6:35', passageId: 'John 6:35', label: 'The bread of life' },
    { id: 'i-am-light', ref: 'John 8:12', passageId: 'John 8:12', label: 'The light of the world' },
    { id: 'i-am-door', ref: 'John 10:9', passageId: 'John 10:9', label: 'The door' },
    { id: 'i-am-shepherd', ref: 'John 10:11', passageId: 'John 10:11', label: 'The good shepherd' },
    { id: 'i-am-life', ref: 'John 11:25', passageId: 'John 11:25', label: 'The resurrection and the life' },
    { id: 'i-am-way', ref: 'John 14:6', passageId: 'John 14:6', label: 'The way, the truth, and the life' },
    { id: 'i-am-vine', ref: 'John 15:5', passageId: 'John 15:5', label: 'The true vine' },
    { id: 'i-am-before-abraham', ref: 'John 8:58', passageId: 'John 8:58', label: 'Before Abraham was, I am' },
  ],

  // The thread — the divine Name from the burning bush to the throne. Read, not
  // memorized. (A station may carry memoryVerseId to flag "this is one you're
  // carrying"; here the thread runs separate from the cluster.)
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
