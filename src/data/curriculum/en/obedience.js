// "Obedience" — curated topic (English). A cluster of red-letter memory verses;
// the ones with a distinct image carry their OWN OT→NT thread anchored at Jesus's
// words (friend of God, keep → He reveals Himself, doing the Father's will, hear
// & keep the word, abide in the word). "If you love me keep my commandments,"
// "Lord, Lord," and the wise builder (Matt 7:24, the spine's center) ride the
// spine below. English text fetched LIVE via /api/bible (ESV). Connections DRAFT.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'obedience',
  language: 'en',
  title: 'Obedience',
  subtitle: 'Love proven.',

  memoryVerses: [
    { id: 'obedience-keep', ref: 'John 14:15', passageId: 'John 14:15', label: 'If you love me, keep my commandments',
      momentConnection: 'So Jesus roots obedience in love, not fear: if you love me, you will keep my commandments. The keeping flows from the loving.' },
    {
      id: 'obedience-has-and-keeps',
      ref: 'John 14:21',
      passageId: 'John 14:21',
      label: 'Whoever keeps them loves me',
      orbit: [
        station('manifest-origin', 'Exodus 33:13', 'origin',
          'Moses asks the deepest prayer: show me your ways, that I may know you. To know God is the longing under all obedience.'),
        station('manifest-unfolding', 'Jeremiah 24:7', 'unfolding',
          'And God promises to give what Moses asked: I will give them a heart to know me, and they shall be my people.'),
        station('manifest-moment', 'John 14:21', 'moment',
          'So Jesus ties knowing Him to keeping Him: whoever has my commandments and keeps them loves me — and I will love him and manifest myself to him.'),
        station('manifest-echo', '1 John 2:3-4', 'aftermath',
          'John makes it the test: by this we know that we have come to know Him — if we keep his commandments.'),
        station('manifest-consummation', 'Revelation 22:4', 'consummation',
          'Until knowing becomes seeing: they shall see His face — the One obedience was always reaching to know.'),
      ],
    },
    { id: 'obedience-lord-lord', ref: 'Luke 6:46', passageId: 'Luke 6:46', label: 'Lord, Lord',
      momentConnection: 'So Jesus presses the gap between word and life: why do you call me Lord, Lord, and not do what I tell you? Calling him Lord means doing what he says.' },
    {
      id: 'obedience-do-will',
      ref: 'Matthew 7:21',
      passageId: 'Matthew 7:21',
      label: 'Do the Father’s will',
      orbit: [
        station('will-origin', '1 Samuel 15:22', 'origin',
          'Samuel says it to a disobedient king: to obey is better than sacrifice, and to listen than the fat of rams.'),
        station('will-unfolding', 'Psalm 40:6-8', 'unfolding',
          'The psalmist takes it to heart: you do not delight in sacrifice — then I said, I delight to do your will, O my God; your law is within my heart.'),
        station('will-moment', 'Matthew 7:21', 'moment',
          'So Jesus draws the line at saying vs doing: not everyone who says Lord, Lord will enter, but the one who does the will of my Father.'),
        station('will-echo', 'Hebrews 10:7', 'aftermath',
          'And Hebrews shows who did it perfectly: behold, I have come to do your will, O God — Christ obeyed the will we could not.'),
        station('will-consummation', 'Revelation 22:3', 'consummation',
          'Until doing His will is endless joy: no more curse, the throne of God is there, and His servants will serve Him.'),
      ],
    },
    {
      id: 'obedience-my-friends',
      ref: 'John 15:14',
      passageId: 'John 15:14',
      label: 'You are my friends',
      orbit: [
        station('friend-origin', 'Exodus 33:11', 'origin',
          'God spoke to Moses face to face, as a man speaks to his friend — a nearness no law could give.'),
        station('friend-unfolding', 'Isaiah 41:8', 'unfolding',
          'And the title lands on Abraham: my servant Israel, offspring of Abraham, my friend.'),
        station('friend-moment', 'John 15:14', 'moment',
          'So Jesus says obedience is not servitude but friendship: you are my friends if you do what I command you.'),
        station('friend-echo', 'James 2:23', 'aftermath',
          'James seals it: Abraham believed God, and he was called a friend of God — faith that obeys becomes friendship.'),
        station('friend-consummation', 'Revelation 22:4', 'consummation',
          'Until the friend sees the Friend: they shall see His face, and His name shall be on their foreheads.'),
      ],
    },
    { id: 'obedience-hear-and-do', ref: 'Matthew 7:24', passageId: 'Matthew 7:24', label: 'Hear and do',
      momentConnection: 'So Jesus draws the line plainly: everyone who hears these words of mine and does them is like a man who built his house on the rock. Hearing isn’t enough — the storm tests what you built on.' },
    {
      id: 'obedience-hear-keep',
      ref: 'Luke 11:28',
      passageId: 'Luke 11:28',
      label: 'Hear the word and keep it',
      orbit: [
        station('keep-origin', 'Deuteronomy 6:6-9', 'origin',
          'At Sinai the word is meant to be lived: these words shall be on your heart — teach them, bind them, write them on your doorposts.'),
        station('keep-unfolding', 'Psalm 1:1-2', 'unfolding',
          'And the blessed life is built on it: blessed is the one whose delight is in the law of the LORD, meditating on it day and night.'),
        station('keep-moment', 'Luke 11:28', 'moment',
          'So when a woman blesses His mother, Jesus redirects the blessing: rather, blessed are those who hear the word of God and keep it.'),
        station('keep-echo', 'James 1:22-25', 'aftermath',
          'James presses it: be doers of the word, not hearers only who deceive themselves — the doer will be blessed in his doing.'),
        station('keep-consummation', 'Revelation 22:7', 'consummation',
          'Until the last blessing is for the keepers: behold, I am coming soon. Blessed is the one who keeps the words of this prophecy.'),
      ],
    },
    {
      id: 'obedience-abide-word',
      ref: 'John 8:31-32',
      passageId: 'John 8:31-32',
      label: 'Abide in my word',
      orbit: [
        station('abide-origin', 'Joshua 1:8', 'origin',
          'On the edge of the land, God’s command to Joshua: this Book of the Law shall not depart from your mouth; meditate on it day and night, and do all that is written.'),
        station('abide-unfolding', 'Psalm 119:44-45', 'unfolding',
          'And the one who keeps the word finds it isn’t bondage but freedom: I will keep your law continually; I shall walk at liberty, for I seek your precepts.'),
        station('abide-moment', 'John 8:31-32', 'moment',
          'So Jesus joins abiding, truth, and freedom: if you abide in my word, you are truly my disciples, and you will know the truth, and the truth will set you free.'),
        station('abide-echo', '2 John 1:9', 'aftermath',
          'John guards it: whoever abides in the teaching of Christ has both the Father and the Son.'),
        station('abide-consummation', 'Revelation 22:14', 'consummation',
          'Until the ones who kept the word come home: blessed are those who wash their robes, that they may enter the city by the gates.'),
      ],
    },
  ],

  // The topic spine — obedience as love made possible by the Spirit Christ gives.
  // Home of "if you love me, keep my commandments," "Lord, Lord," and the wise builder.
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
