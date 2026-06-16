// "Praying in the Spirit" (성령으로 드리는 기도) — curated topic (English). To honor
// the rule that memory verses are Jesus's own words, the anchors are his promises
// of the SPIRIT (tongues flows from the Spirit he gave); the threads carry the
// Spirit-poured-out Scripture (Pentecost, Paul). Strictly Scripture — no doctrinal
// position. English text fetched LIVE via /api/bible (ESV). Connection DRAFT.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'spirit-prayer',
  language: 'en',
  title: 'Praying in the Spirit',
  subtitle: 'The tongue the Spirit gives.',

  memoryVerses: [
    {
      id: 'spirit-living-water',
      ref: 'John 7:37-38',
      passageId: 'John 7:37-38',
      label: 'Rivers of living water',
      orbit: [
        station('water-origin', 'Isaiah 44:3', 'origin',
          'God promises water for the thirsty: I will pour water on the thirsty land… I will pour my Spirit upon your offspring.'),
        station('water-unfolding', 'Ezekiel 47:1-2', 'unfolding',
          'Ezekiel sees it as a river from the temple — water flowing out from the presence of God, getting deeper as it goes.'),
        station('water-moment', 'John 7:37-38', 'moment',
          'So Jesus stands and cries out: if anyone thirsts, come to me and drink — out of his heart will flow rivers of living water. He meant the Spirit.'),
        station('water-aftermath', 'Acts 2:17-18', 'aftermath',
          'At Pentecost the promise pours: in the last days I will pour out my Spirit on all flesh, and they prophesy and praise.'),
        station('water-consummation', 'Revelation 22:1', 'consummation',
          'Until the river reaches its end — the water of life, bright as crystal, flowing from the throne of God and of the Lamb.'),
      ],
    },
    {
      id: 'spirit-power',
      ref: 'Acts 1:8',
      passageId: 'Acts 1:8',
      label: 'You will receive power',
      orbit: [
        station('power-origin', 'Genesis 11:7-9', 'origin',
          'At Babel, human pride builds a tower, and God scatters them by confusing their language — the tongues divided in judgment.'),
        station('power-unfolding', 'Joel 2:28-29', 'unfolding',
          'But God promises a reversal: I will pour out my Spirit on all flesh — sons and daughters, young and old, every kind.'),
        station('power-moment', 'Acts 1:8', 'moment',
          'So Jesus tells them to wait for it: you will receive power when the Holy Spirit has come upon you, and you will be my witnesses to the ends of the earth.'),
        station('power-aftermath', 'Acts 2:4', 'aftermath',
          'And it falls: they were all filled with the Spirit and began to speak in other tongues as the Spirit gave them utterance — Babel undone.'),
        station('power-consummation', 'Revelation 7:9-10', 'consummation',
          'Until every divided tongue is gathered into one praise: a multitude from every nation and tribe and people and language, crying salvation to our God.'),
      ],
    },
    { id: 'spirit-ask', ref: 'Luke 11:13', passageId: 'Luke 11:13', label: 'Ask for the Spirit' },
    { id: 'spirit-helper', ref: 'John 14:16-17', passageId: 'John 14:16-17', label: 'Another Helper' },
  ],

  // The topic spine — the Spirit promised, given, and praying in us. Home of the
  // "ask" and "Helper" verses above.
  orbit: [
    { id: 'spirit-origin', ref: 'Ezekiel 36:27', passageId: 'Ezekiel 36:27', position: 'origin',
      connection: 'God promises the deepest gift: I will put my Spirit within you, and cause you to walk in my statutes.' },
    { id: 'spirit-unfolding', ref: 'Numbers 11:29', passageId: 'Numbers 11:29', position: 'unfolding',
      connection: 'And Moses longs for it to spread: would that all the LORD’s people were prophets, that the LORD would put his Spirit on them!' },
    { id: 'spirit-moment', ref: 'John 14:16-17', passageId: 'John 14:16-17', position: 'moment',
      connection: 'So Jesus gives the promise a name: I will ask the Father, and he will give you another Helper… the Spirit of truth, who dwells with you and will be in you.' },
    { id: 'spirit-aftermath', ref: 'Romans 8:26', passageId: 'Romans 8:26', position: 'aftermath',
      connection: 'And the Spirit prays the prayers we can’t: he helps us in our weakness, interceding with groanings too deep for words.' },
    { id: 'spirit-consummation', ref: 'Revelation 22:17', passageId: 'Revelation 22:17', position: 'consummation',
      connection: 'Until the Spirit’s whole work is one invitation: the Spirit and the Bride say, Come… let the one who is thirsty come.' },
  ],

  thread: 'The Spirit Jesus promised becomes the river, the power, and the very prayer within us.',
  closing: '', // TODO: Rhema closing script
};
