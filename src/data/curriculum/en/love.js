// "Love" — curated topic (English). A cluster of red-letter memory verses; the
// ones with a distinct image carry their OWN OT→NT thread anchored at Jesus's
// words (greater love / the cross, enemy-love, the least of these, forgiven →
// loving, known by love). The great commandment (Matt 22:37-39, which IS the
// spine's center), "love one another," and "abide in my love" ride the topic
// spine below. English text fetched LIVE via /api/bible (ESV). Connections DRAFT.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'love',
  language: 'en',
  title: 'Love',
  subtitle: 'The heart of the Law.',

  memoryVerses: [
    { id: 'love-one-another', ref: 'John 13:34', passageId: 'John 13:34', label: 'Love one another' },
    { id: 'love-great-commandment', ref: 'Matthew 22:37-39', passageId: 'Matthew 22:37-39', label: 'The great commandment' },
    {
      id: 'love-greater-love',
      ref: 'John 15:12-13',
      passageId: 'John 15:12-13',
      label: 'Greater love',
      orbit: [
        station('laydown-origin', 'Song of Solomon 8:6-7', 'origin',
          'The old song already knew love’s power: love is strong as death, many waters cannot quench it — a love worth more than a man’s whole house.'),
        station('laydown-unfolding', 'Isaiah 53:12', 'unfolding',
          'Isaiah sees that love take a body: the servant poured out his soul to death, numbered with the transgressors, bearing the sin of many.'),
        station('laydown-moment', 'John 15:12-13', 'moment',
          'So Jesus names the measure of love and then becomes it: greater love has no one than this, that someone lay down his life for his friends.'),
        station('laydown-echo', 'Romans 5:8', 'aftermath',
          'Paul says he laid it down for the unworthy: God shows his love in this — while we were still sinners, Christ died for us.'),
        station('laydown-consummation', 'Revelation 5:9', 'consummation',
          'Until that laid-down love is heaven’s song: worthy is the Lamb who was slain, who ransomed people for God from every tribe and tongue.'),
      ],
    },
    {
      id: 'love-your-enemies',
      ref: 'Matthew 5:44',
      passageId: 'Matthew 5:44',
      label: 'Love your enemies',
      orbit: [
        station('enemy-origin', 'Exodus 23:4-5', 'origin',
          'The Law already bent toward the enemy: if you find your enemy’s ox or donkey wandering, bring it back; if it’s fallen under its load, help lift it.'),
        station('enemy-unfolding', 'Proverbs 25:21-22', 'unfolding',
          'Proverbs goes further: if your enemy is hungry, give him bread; if thirsty, water — and the LORD will reward you.'),
        station('enemy-moment', 'Matthew 5:44', 'moment',
          'So Jesus says the unthinkable plainly: love your enemies and pray for those who persecute you — because that is how your Father loves.'),
        station('enemy-echo', 'Romans 5:10', 'aftermath',
          'And Paul shows where we learned it: while we were enemies, we were reconciled to God through the death of his Son. He loved his enemies first — us.'),
        station('enemy-consummation', 'Revelation 5:9', 'consummation',
          'Until every enemy made a friend stands singing: you ransomed people for God from every tribe and tongue and people and nation.'),
      ],
    },
    { id: 'love-abide', ref: 'John 15:9', passageId: 'John 15:9', label: 'Abide in my love' },
    {
      id: 'love-least',
      ref: 'Matthew 25:40',
      passageId: 'Matthew 25:40',
      label: 'The least of these',
      orbit: [
        station('least-origin', 'Proverbs 19:17', 'origin',
          'Proverbs makes the poor man’s account God’s own: whoever is generous to the poor lends to the LORD, and He will repay.'),
        station('least-unfolding', 'Isaiah 58:6-7', 'unfolding',
          'Isaiah names the fast God wants: loose the bonds, share your bread with the hungry, bring the homeless poor into your house.'),
        station('least-moment', 'Matthew 25:40', 'moment',
          'So Jesus says the King receives it personally: as you did it to one of the least of these my brothers, you did it to me.'),
        station('least-echo', '1 John 3:17-18', 'aftermath',
          'John makes it the test of love: if you have the world’s goods and close your heart to a brother in need, how does God’s love abide in you? Let us love in deed and truth.'),
        station('least-consummation', 'Revelation 7:16-17', 'consummation',
          'Until the least are filled forever: they shall hunger no more, for the Lamb will be their shepherd, and God will wipe every tear.'),
      ],
    },
    {
      id: 'love-forgiven',
      ref: 'Luke 7:47',
      passageId: 'Luke 7:47',
      label: 'Forgiven much, loved much',
      orbit: [
        station('forgiven-origin', 'Psalm 130:3-4', 'origin',
          'The psalmist sinks low and finds grace: if you, LORD, kept account of sins, who could stand? But with you there is forgiveness, that you may be feared.'),
        station('forgiven-unfolding', 'Micah 7:18-19', 'unfolding',
          'Micah marvels at it: who is a God like you, pardoning iniquity… you will tread our sins underfoot and cast them into the depths of the sea.'),
        station('forgiven-moment', 'Luke 7:47', 'moment',
          'So Jesus reads the weeping woman’s heart: her many sins are forgiven — for she loved much. The one forgiven little loves little.'),
        station('forgiven-echo', '1 John 4:19', 'aftermath',
          'John names the spring of it: we love because he first loved us. Every drop of our love is a return of his.'),
        station('forgiven-consummation', 'Revelation 1:5', 'consummation',
          'Until the forgiven sing it forever: to him who loves us and freed us from our sins by his blood — to him be glory.'),
      ],
    },
    {
      id: 'love-known',
      ref: 'John 13:35',
      passageId: 'John 13:35',
      label: 'Known by love',
      orbit: [
        station('known-origin', 'Deuteronomy 4:6-7', 'origin',
          'At Sinai God means his people to be seen: keep these laws, and the nations will say, what great people has a God so near to them?'),
        station('known-unfolding', 'Zechariah 8:23', 'unfolding',
          'Zechariah sees the nations drawn in: ten men from every tongue will grab one Jew’s robe, saying, let us go with you, for we have heard God is with you.'),
        station('known-moment', 'John 13:35', 'moment',
          'So Jesus says love is the sign the world reads: by this all people will know you are my disciples, if you have love for one another.'),
        station('known-echo', 'Acts 2:46-47', 'aftermath',
          'And the first church proves it: together with glad hearts, having favor with all the people — and the Lord added to their number daily.'),
        station('known-consummation', 'Revelation 7:9-10', 'consummation',
          'Until the watching world is gathered home: a great multitude no one could number, from every nation and tribe and people and tongue, before the throne.'),
      ],
    },
  ],

  // The topic spine — love commanded in the Law, embodied at the cross. Home of
  // the great commandment, "love one another," and "abide in my love."
  orbit: [
    { id: 'love-origin', ref: 'Deuteronomy 6:5', passageId: 'Deuteronomy 6:5', position: 'origin',
      connection: 'Love begins as a command at Sinai: love the LORD your God with all your heart and soul and might. Before it is a feeling, it is owed to the God who saved you.' },
    { id: 'love-unfolding', ref: 'Leviticus 19:18', passageId: 'Leviticus 19:18', position: 'unfolding',
      connection: 'And the same Law turns it outward — love your neighbor as yourself. From the very start, the two belong together.' },
    { id: 'love-moment', ref: 'Matthew 22:37-40', passageId: 'Matthew 22:37-40', position: 'moment',
      connection: 'Asked for the greatest commandment, Jesus binds the two into one and says all the Law and the Prophets hang here — love God, love neighbor.' },
    { id: 'love-aftermath', ref: '1 John 4:10', passageId: '1 John 4:10', position: 'aftermath',
      connection: 'But John finds the source beneath the command: this is love — not that we loved God, but that He loved us and gave His Son for our sins.' },
    { id: 'love-consummation', ref: 'Revelation 21:3', passageId: 'Revelation 21:3', position: 'consummation',
      connection: 'And love arrives where it was always headed: God dwelling with His people, His own at last, every distance closed.' },
  ],

  thread: 'The love commanded in the Law is the love embodied at the cross.',
  closing: '', // TODO: Rhema closing script
};
