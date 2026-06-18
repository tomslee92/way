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
    {
      id: 'spirit-teach',
      ref: 'Luke 12:11-12',
      passageId: 'Luke 12:11-12',
      label: 'The Spirit will teach you',
      // God puts His words in your mouth — Moses's stammer to the song of Moses.
      orbit: [
        station('teach-origin', 'Exodus 4:12', 'origin',
          'God answers Moses’ stammering excuse with a promise: I will be with your mouth and teach you what you shall speak.'),
        station('teach-unfolding', 'Jeremiah 1:9', 'unfolding',
          'And He does it again for a trembling young prophet: the LORD touches Jeremiah’s mouth — Behold, I have put my words in your mouth.'),
        station('teach-moment', 'Luke 12:11-12', 'moment',
          'So Jesus tells the disciples not to rehearse their defense: in that very hour the Holy Spirit will teach you what you ought to say. The words will be given.'),
        station('teach-aftermath', 'Acts 2:4', 'aftermath',
          'And at Pentecost the promise overflows: filled with the Spirit, they spoke as the Spirit gave them utterance.'),
        station('teach-consummation', 'Revelation 15:3', 'consummation',
          'Until every Spirit-given word becomes one song: they sing the song of Moses and of the Lamb — the stammering mouth now full of praise.'),
      ],
    },
    {
      id: 'spirit-ask',
      ref: 'Luke 11:13',
      passageId: 'Luke 11:13',
      label: 'Ask for the Spirit',
      orbit: [
        station('ask-origin', 'Psalm 51:11', 'origin',
          'David’s deepest plea is to keep the Spirit: cast me not away from your presence, and take not your Holy Spirit from me.'),
        station('ask-unfolding', 'Isaiah 32:15', 'unfolding',
          'Isaiah promises a day the Spirit is poured freely: until the Spirit is poured upon us from on high, and the wilderness becomes a fruitful field.'),
        station('ask-moment', 'Luke 11:13', 'moment',
          'So Jesus makes the Spirit the surest answer to prayer: if you who are evil give good gifts, how much more will the Father give the Holy Spirit to those who ask Him!'),
        station('ask-echo', 'Acts 2:38-39', 'aftermath',
          'And Peter throws the gift wide open: repent and be baptized, and you will receive the gift of the Holy Spirit — the promise is for you and your children and all who are far off.'),
        station('ask-consummation', 'Revelation 21:6', 'consummation',
          'Until the asking ends in free abundance: to the thirsty I will give from the spring of the water of life without payment.'),
      ],
    },
    {
      id: 'spirit-worship',
      ref: 'John 4:23-24',
      passageId: 'John 4:23-24',
      label: 'Spirit and truth',
      orbit: [
        station('worship-origin', 'Psalm 51:6', 'origin',
          'The psalmist learns what God wants inside: behold, you delight in truth in the inward being, and teach me wisdom in the secret heart.'),
        station('worship-unfolding', 'Isaiah 29:13', 'unfolding',
          'And God grieves worship that stays on the surface: this people draws near with their mouth and honors me with their lips, while their hearts are far from me.'),
        station('worship-moment', 'John 4:23-24', 'moment',
          'So Jesus names the worship the Father seeks: the true worshipers will worship the Father in spirit and truth — God is spirit, and must be worshiped in spirit and truth.'),
        station('worship-echo', 'Philippians 3:3', 'aftermath',
          'And Paul says that is now who we are: we are the circumcision, who worship by the Spirit of God and glory in Christ Jesus, putting no confidence in the flesh.'),
        station('worship-consummation', 'Revelation 7:15', 'consummation',
          'Until worship in spirit never stops: therefore they are before the throne, serving Him day and night in His temple, sheltered by His presence.'),
      ],
    },
    {
      id: 'spirit-truth',
      ref: 'John 16:13',
      passageId: 'John 16:13',
      label: 'Guide you into truth',
      orbit: [
        station('truth-origin', 'Psalm 143:10', 'origin',
          'The psalmist asks the Spirit to lead him: teach me to do your will, for you are my God; let your good Spirit lead me on level ground.'),
        station('truth-unfolding', 'Nehemiah 9:20', 'unfolding',
          'And Israel remembers He always did: you gave your good Spirit to instruct them, and did not withhold your manna from their mouth.'),
        station('truth-moment', 'John 16:13', 'moment',
          'So Jesus promises a Guide who never misleads: when the Spirit of truth comes, He will guide you into all the truth, and declare to you the things to come.'),
        station('truth-echo', '1 Corinthians 2:10-12', 'aftermath',
          'Paul says the Spirit knows the depths: the Spirit searches everything, even the depths of God — and we received that Spirit, to understand the gifts God gave us.'),
        station('truth-consummation', 'Revelation 22:5', 'consummation',
          'Until every shadow is gone in full light: night will be no more, for the Lord God will be their light, and they will reign forever.'),
      ],
    },
    {
      id: 'spirit-wind',
      ref: 'John 3:8',
      passageId: 'John 3:8',
      label: 'Born of the Spirit',
      orbit: [
        station('wind-origin', 'Ezekiel 37:9-10', 'origin',
          'Ezekiel calls the wind over a valley of dry bones: come from the four winds, O breath, and breathe on these slain — and they lived, an exceedingly great army.'),
        station('wind-unfolding', 'Psalm 104:30', 'unfolding',
          'The psalmist makes the Spirit the source of all new life: when you send forth your Spirit, they are created, and you renew the face of the ground.'),
        station('wind-moment', 'John 3:8', 'moment',
          'So Jesus likens new birth to the wind: the wind blows where it wishes, and you hear its sound but cannot tell where it comes from — so it is with everyone born of the Spirit.'),
        station('wind-echo', 'Acts 2:2', 'aftermath',
          'And at Pentecost that very wind arrives: suddenly a sound came from heaven like a mighty rushing wind, and it filled the whole house where they were sitting.'),
        station('wind-consummation', 'Revelation 21:5', 'consummation',
          'Until the new birth becomes a new creation: behold, I am making all things new — these words are trustworthy and true.'),
      ],
    },
    { id: 'spirit-helper', ref: 'John 14:16-17', passageId: 'John 14:16-17', label: 'Another Helper' },
  ],

  // The topic spine — the Spirit promised, given, and praying in us. The "Helper"
  // verse rides this spine; every other verse above now carries its own thread.
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
