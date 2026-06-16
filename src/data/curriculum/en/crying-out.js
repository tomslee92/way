// "Crying Out" (부르짖는 기도) — curated topic (English). Red-letter memory verses
// on fervent, persistent, from-the-depths prayer — Jesus both teaching it and
// crying out himself. English text fetched LIVE via /api/bible (ESV; passageId ===
// ref). Per-station `connection` is DRAFT — Toms vouches.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'crying-out',
  language: 'en',
  title: 'Crying Out',
  subtitle: 'The prayer that will not be silenced.',

  memoryVerses: [
    {
      id: 'crying-out-day-and-night',
      ref: 'Luke 18:7',
      passageId: 'Luke 18:7',
      label: 'Cry day and night',
      orbit: [
        station('cry-origin', 'Exodus 2:23-24', 'origin',
          'In Egypt, under crushing labor, Israel cries out — and the cry rises to God. He hears, and remembers His covenant.'),
        station('cry-unfolding', 'Psalm 34:17', 'unfolding',
          'The psalmist makes it a settled rule: when the righteous cry, the LORD hears, and delivers them out of all their troubles.'),
        station('cry-moment', 'Luke 18:7', 'moment',
          'So Jesus presses the promise home: will not God give justice to His elect, who cry to Him day and night? He will, and soon.'),
        station('cry-aftermath', 'Revelation 6:10', 'aftermath',
          'And the cry still rises under the altar: the martyrs call out, “How long, O Lord, holy and true?” — heard, and held.'),
        station('cry-consummation', 'Revelation 21:4', 'consummation',
          'Until every cry is answered at the source: He wipes away every tear, and death and mourning and crying are no more.'),
      ],
    },
    {
      id: 'crying-out-abba',
      ref: 'Mark 14:36',
      passageId: 'Mark 14:36',
      label: 'Abba, Father',
      orbit: [
        station('abba-origin', 'Psalm 130:1-2', 'origin',
          'Out of the depths the psalmist cries: “O Lord, hear my voice; let your ears be attentive to my pleas for mercy.”'),
        station('abba-unfolding', 'Psalm 116:1-2', 'unfolding',
          'And he learns the LORD bends down: because he inclined his ear to me, I will call on him as long as I live.'),
        station('abba-moment', 'Mark 14:36', 'moment',
          'So in the garden Jesus cries with that same trust — “Abba, Father, all things are possible for you” — and surrenders: not my will, but yours.'),
        station('abba-aftermath', 'Romans 8:15', 'aftermath',
          'And Paul says that cry is now ours: we received the Spirit of adoption, by whom we cry, “Abba! Father!”'),
        station('abba-consummation', 'Revelation 21:7', 'consummation',
          'Until the Father’s answer is final: the one who conquers will inherit, and “I will be his God and he will be my son.”'),
      ],
    },
    {
      id: 'crying-out-forsaken',
      ref: 'Matthew 27:46',
      passageId: 'Matthew 27:46',
      label: 'My God, my God',
      orbit: [
        station('forsaken-origin', 'Psalm 22:1-2', 'origin',
          'David’s darkest psalm opens with the cry: “My God, my God, why have you forsaken me?” — crying by day and night, unanswered.'),
        station('forsaken-unfolding', 'Psalm 22:24', 'unfolding',
          'Yet the same psalm holds the secret: God has not hidden his face from the afflicted, but has heard, when he cried to him.'),
        station('forsaken-moment', 'Matthew 27:46', 'moment',
          'So Jesus takes that very cry onto the cross — “My God, my God, why have you forsaken me?” — forsaken, so that we never would be.'),
        station('forsaken-aftermath', 'Hebrews 5:7', 'aftermath',
          'Hebrews looks back on it: in the days of his flesh he offered prayers with loud cries and tears, and was heard for his reverence.'),
        station('forsaken-consummation', 'Revelation 21:3', 'consummation',
          'Until the opposite of forsaken is forever: God himself will be with them, His people, never alone again.'),
      ],
    },
    { id: 'crying-out-mercy', ref: 'Luke 18:13', passageId: 'Luke 18:13', label: 'Be merciful to me' },
    { id: 'crying-out-bartimaeus', ref: 'Mark 10:52', passageId: 'Mark 10:52', label: 'Your faith has made you well' },
  ],

  // The topic spine — the cry God has always heard. Home of the mercy verses above.
  orbit: [
    { id: 'crying-origin', ref: 'Exodus 3:7', passageId: 'Exodus 3:7', position: 'origin',
      connection: 'At the bush God tells Moses what He has been doing all along: I have heard their cry… I know their sufferings.' },
    { id: 'crying-unfolding', ref: 'Psalm 145:18-19', passageId: 'Psalm 145:18-19', position: 'unfolding',
      connection: 'The psalmist makes it the LORD’s nature: He is near to all who call on Him, He hears their cry and saves them.' },
    { id: 'crying-moment', ref: 'Luke 18:13', passageId: 'Luke 18:13', position: 'moment',
      connection: 'So the tax collector, with nothing to offer, simply cries: “God, be merciful to me, a sinner!” — and goes home justified.' },
    { id: 'crying-aftermath', ref: 'Romans 8:26', passageId: 'Romans 8:26', position: 'aftermath',
      connection: 'And when words fail, we are not left alone: the Spirit himself intercedes for us with groanings too deep for words.' },
    { id: 'crying-consummation', ref: 'Revelation 21:4', passageId: 'Revelation 21:4', position: 'consummation',
      connection: 'Until the last cry is answered and dried: no more death, no more mourning, no more crying.' },
  ],

  thread: 'The cry God has always heard finds its voice — and its answer — in Jesus.',
  closing: '', // TODO: Rhema closing script
};
