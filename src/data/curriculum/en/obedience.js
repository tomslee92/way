// "Obedience — keeping his word" — curated topic (English). Anchor-and-orbit per
// the curated-topics-draft. Uses the PRIMARY anchor (John 14:15) — the alt
// anchor (Matthew 7:24) would collide with the Moment orbit station. English
// text fetched LIVE via /api/bible (ESV). Rhema scripts are TODO.

export default {
  id: 'obedience',
  language: 'en',
  title: 'Obedience',
  subtitle: 'Love proven.',

  memoryVerses: [
    { id: 'obedience-keep', ref: 'John 14:15', passageId: 'John 14:15', label: 'If you love me, keep my commandments' },
    { id: 'obedience-has-and-keeps', ref: 'John 14:21', passageId: 'John 14:21', label: 'Whoever keeps them loves me' },
    { id: 'obedience-lord-lord', ref: 'Luke 6:46', passageId: 'Luke 6:46', label: 'Lord, Lord' },
    { id: 'obedience-my-friends', ref: 'John 15:14', passageId: 'John 15:14', label: 'You are my friends' },
    { id: 'obedience-hear-and-do', ref: 'Matthew 7:24', passageId: 'Matthew 7:24', label: 'Hear and do' },
  ],

  orbit: [
    { id: 'obedience-origin', ref: 'Exodus 19:5', passageId: 'Exodus 19:5', position: 'origin',
      connection: 'At Sinai God calls for obedience: if you will keep my covenant, you will be my treasured possession. But Israel cannot keep it — the heart isn’t in it.' },
    { id: 'obedience-unfolding', ref: 'Ezekiel 36:26-27', passageId: 'Ezekiel 36:26-27', position: 'unfolding',
      connection: 'So God promises what He’ll have to give: a new heart, His own Spirit within you, moving you to walk in His ways. Obedience will be a gift before it’s a duty.' },
    { id: 'obedience-moment', ref: 'Matthew 7:24-25', passageId: 'Matthew 7:24-25', position: 'moment',
      connection: 'Jesus draws the line plainly: everyone who hears these words and does them is like a man who built his house on the rock. Hearing isn’t enough — the storm tests what you built on.' },
    { id: 'obedience-aftermath', ref: 'Romans 8:3-4', passageId: 'Romans 8:3-4', position: 'aftermath',
      connection: 'Paul names how it’s now possible: what the Law could not do, God did in His Son, so the Law’s righteousness is fulfilled in us who walk by the Spirit.' },
    { id: 'obedience-consummation', ref: 'Revelation 14:12', passageId: 'Revelation 14:12', position: 'consummation',
      connection: 'And at the end, this is the mark of the saints: those who keep the commandments of God and hold to faith in Jesus — love and obedience, finally one.' },
  ],

  thread: 'Obedience is not cold law-keeping but love made possible by the Spirit Christ gives.',
  closing: '', // TODO: Rhema closing script
};
