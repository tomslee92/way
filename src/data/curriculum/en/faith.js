// "Faith" — curated topic (English). Anchor-and-orbit per the curated-topics-
// draft. Uses the PRIMARY anchor (John 6:29) — the alt anchor (Mark 9:23) would
// collide with the Moment orbit station. English text fetched LIVE via
// /api/bible (ESV). Rhema scripts are TODO.

export default {
  id: 'faith',
  language: 'en',
  title: 'Faith',
  subtitle: 'The ground of it all.',

  memoryVerses: [
    { id: 'faith-work-of-god', ref: 'John 6:29', passageId: 'John 6:29', label: 'The work of God: believe' },
    { id: 'faith-in-god', ref: 'Mark 11:22', passageId: 'Mark 11:22', label: 'Have faith in God' },
    { id: 'faith-mustard-seed', ref: 'Matthew 17:20', passageId: 'Matthew 17:20', label: 'Faith like a mustard seed' },
    { id: 'faith-whoever-believes', ref: 'John 11:25-26', passageId: 'John 11:25-26', label: 'Whoever believes in me' },
    { id: 'faith-not-seen', ref: 'John 20:29', passageId: 'John 20:29', label: 'Blessed who have not seen' },
  ],

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
