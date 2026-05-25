// "I AM" — curated topic (English / ESV). See curriculum-seed.md for the
// verified source text and Rhema's voice scripts.
//
// Shape (see HANDOFF.md):
//   - anchor: the verse memorized via the fading method. Its `text` is broken
//     into clause lines because the fading method fades line by line.
//   - orbit[]: verses read aloud (not memorized) during the revelation walk, in
//     canonical order, each tagged with its `position` on the canonical arc.
//     Orbit `text` is stored as the verse reads — line breaks aren't meaningful
//     for read-aloud display.
//   - opening / connection / closing: Rhema's spoken scripts (written for the
//     ear). Audio is pre-generated; URLs are derived by convention from the ids
//     here (see audioPath in ../curriculum.js), not stored on these objects.
//
// `passageId` on the anchor and orbit entries is the API.Bible reference id,
// kept so the seed text can be diffed against /api/bible before production.

export default {
  id: 'i-am',
  language: 'en',
  title: 'I AM',
  subtitle: 'Before Abraham was, I am.',

  anchor: {
    ref: 'John 8:58',
    passageId: 'JHN.8.58',
    speaker: 'Jesus',
    text: [
      'Jesus said to them,',
      '"Truly, truly, I say to you,',
      'before Abraham was, I am."',
    ].join('\n'),
    opening:
      "Today we memorize the words of Jesus in John, chapter 8, verse 58. " +
      "Listen carefully. He does not say, I was. He says, I am. These are the " +
      "same words God spoke to Moses from the burning bush. The people " +
      "listening understood exactly what He claimed, and they picked up stones " +
      "to kill Him. Before we memorize these words, let's walk through " +
      "Scripture and see what He was really saying.",
  },

  orbit: [
    {
      id: 'exodus-3-14',
      ref: 'Exodus 3:14',
      passageId: 'EXO.3.14',
      position: 'origin',
      // ESV preserves a deliberate typographic distinction: lowercase
      // "I am who I am" (the self-definition) vs. small-caps "I AM has sent me"
      // (the proper name). Plain text renders the small caps as uppercase.
      text:
        `God said to Moses, "I am who I am." And he said, "Say this to the people of Israel: 'I AM has sent me to you.'"`,
      connection:
        "This is where it begins. Moses is standing before a bush that burns " +
        "but is not consumed, and he asks God for His name. And God answers: I " +
        "am who I am. This is the name Jesus just took for Himself. The voice " +
        "from the burning bush is standing in front of them.",
    },
    {
      id: 'isaiah-43-10',
      ref: 'Isaiah 43:10',
      passageId: 'ISA.43.10',
      position: 'unfolding',
      text:
        `"You are my witnesses," declares the LORD, "and my servant whom I have chosen, that you may know and believe me and understand that I am he. Before me no god was formed, nor shall there be any after me."`,
      connection:
        "Centuries later, the prophet Isaiah speaks for the Lord. I am He. " +
        "There is no other. The I AM is not a name that can be shared. For " +
        "Jesus to take this name for Himself is to claim He is the one true God.",
    },
    {
      id: 'john-8-24',
      ref: 'John 8:24',
      passageId: 'JHN.8.24',
      position: 'moment',
      text:
        `"I told you that you would die in your sins, for unless you believe that I am he you will die in your sins."`,
      connection:
        "This is the same conversation, just moments before our anchor verse. " +
        "Jesus has already said it. I am He. The people did not yet understand. " +
        "So He says it again, more clearly, until they cannot miss it.",
    },
    {
      id: 'john-18-5-6',
      ref: 'John 18:5-6',
      passageId: 'JHN.18.5-JHN.18.6',
      position: 'aftermath',
      text:
        `They answered him, "Jesus of Nazareth." Jesus said to them, "I am he." Judas, who betrayed him, was standing with them. When Jesus said to them, "I am he," they drew back and fell to the ground.`,
      connection:
        "In the garden, soldiers come to arrest Him. He speaks the name. I am " +
        "He. And they fall to the ground. The name itself has power. This is no " +
        "ordinary man.",
    },
    {
      id: 'revelation-1-8',
      ref: 'Revelation 1:8',
      passageId: 'REV.1.8',
      position: 'consummation',
      text:
        `"I am the Alpha and the Omega," says the Lord God, "who is and who was and who is to come, the Almighty."`,
      connection:
        "And finally, at the end of all things. From the burning bush to the " +
        "throne of heaven, it is the same voice. I AM was. I AM is. I AM is to " +
        "come.",
    },
  ],

  closing:
    "You now carry these words in your heart. Before Abraham was, I am. When " +
    "you speak them, remember the burning bush. Remember the prophet Isaiah. " +
    "Remember the soldiers falling in the garden. Remember the throne of " +
    "heaven. The One who spoke from the bush, the One who will reign forever, " +
    "is the One who came to you in Jesus. This is who you belong to.",
};
