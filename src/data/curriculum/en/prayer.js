// "Prayer" — curated topic (English). A cluster of red-letter memory verses; the
// ones with a distinct image carry their OWN OT→NT thread anchored at Jesus's
// words (the Name, God in the midst, fullness of joy, seek & find, the watch).
// Pray in secret, the Lord's Prayer (the spine's center), abide-and-ask, and
// "believe you have received" ride the spine. English text fetched LIVE via
// /api/bible (ESV). Connections DRAFT.

const station = (id, ref, position, connection) => ({ id, ref, passageId: ref, position, connection });

export default {
  id: 'prayer',
  language: 'en',
  title: 'Prayer',
  subtitle: 'The believer’s breath.',

  memoryVerses: [
    {
      id: 'prayer-ask',
      ref: 'Matthew 7:7',
      passageId: 'Matthew 7:7',
      label: 'Ask, seek, knock',
      orbit: [
        station('seek-origin', 'Deuteronomy 4:29', 'origin',
          'Moses promises the search will succeed: you will seek the LORD your God and find Him, if you seek with all your heart and soul.'),
        station('seek-unfolding', 'Isaiah 55:6', 'unfolding',
          'Isaiah adds the urgency: seek the LORD while He may be found; call upon Him while He is near.'),
        station('seek-moment', 'Matthew 7:7', 'moment',
          'So Jesus turns it into a promise that holds: ask and it will be given, seek and you will find, knock and it will be opened to you.'),
        station('seek-echo', 'James 1:5', 'aftermath',
          'James shows how freely God gives: if any of you lacks wisdom, let him ask God, who gives to all generously and without reproach.'),
        station('seek-consummation', 'Revelation 3:20', 'consummation',
          'Until the One we knocked for is knocking back: behold, I stand at the door and knock; if anyone opens, I will come in and eat with him.'),
      ],
    },
    { id: 'prayer-in-secret', ref: 'Matthew 6:6', passageId: 'Matthew 6:6', label: 'Pray in secret' },
    { id: 'prayer-lords-prayer', ref: 'Matthew 6:9-13', passageId: 'Matthew 6:9-13', label: 'The Lord’s Prayer' },
    {
      id: 'prayer-in-name',
      ref: 'John 14:13-14',
      passageId: 'John 14:13-14',
      label: 'Ask in my name',
      orbit: [
        station('name-origin', 'Psalm 116:13', 'origin',
          'The psalmist names how he comes: I will lift up the cup of salvation and call on the name of the LORD.'),
        station('name-unfolding', 'Joel 2:32', 'unfolding',
          'Joel opens that name to everyone: everyone who calls on the name of the LORD shall be saved.'),
        station('name-moment', 'John 14:13-14', 'moment',
          'So Jesus hands us His own name to pray in: whatever you ask in my name, this I will do, that the Father may be glorified in the Son.'),
        station('name-echo', 'Philippians 2:9-11', 'aftermath',
          'And Paul shows how high that name is: God exalted Him and gave Him the name above every name, at which every knee will bow.'),
        station('name-consummation', 'Revelation 22:4', 'consummation',
          'Until the name we prayed in is written on us: they shall see His face, and His name shall be on their foreheads.'),
      ],
    },
    {
      id: 'prayer-gathered',
      ref: 'Matthew 18:19-20',
      passageId: 'Matthew 18:19-20',
      label: 'Two or three gathered',
      orbit: [
        station('midst-origin', 'Exodus 20:24', 'origin',
          'From the first altar God promises to come where His people gather: in every place where I cause my name to be remembered, I will come to you and bless you.'),
        station('midst-unfolding', 'Malachi 3:16', 'unfolding',
          'Malachi sees Him lean in to listen: those who feared the LORD spoke with one another, and the LORD took note and wrote a book of remembrance.'),
        station('midst-moment', 'Matthew 18:19-20', 'moment',
          'So Jesus makes the gathering itself a meeting place: where two or three are gathered in my name, there am I among them.'),
        station('midst-echo', '1 Corinthians 14:24-25', 'aftermath',
          'Paul sees outsiders feel it: they fall down and worship, declaring that God is really among you.'),
        station('midst-consummation', 'Revelation 21:3', 'consummation',
          'Until the gathering is forever: behold, the dwelling place of God is with man, and He will dwell with them.'),
      ],
    },
    { id: 'prayer-abide-ask', ref: 'John 15:7', passageId: 'John 15:7', label: 'Ask whatever you wish' },
    { id: 'prayer-believe-received', ref: 'Mark 11:24', passageId: 'Mark 11:24', label: 'Believe you have received' },
    {
      id: 'prayer-joy',
      ref: 'John 16:24',
      passageId: 'John 16:24',
      label: 'Your joy made full',
      orbit: [
        station('joy-origin', 'Psalm 16:11', 'origin',
          'The psalmist finds joy’s source: you make known to me the path of life; in your presence is fullness of joy.'),
        station('joy-unfolding', 'Nehemiah 8:10', 'unfolding',
          'And Nehemiah makes that joy our strength: do not grieve, for the joy of the LORD is your strength.'),
        station('joy-moment', 'John 16:24', 'moment',
          'So Jesus ties prayer to joy: until now you have asked nothing in my name. Ask, and you will receive, that your joy may be full.'),
        station('joy-echo', '1 Peter 1:8', 'aftermath',
          'Peter says that joy is already ours: though you do not now see Him, you believe and rejoice with joy inexpressible and full of glory.'),
        station('joy-consummation', 'Revelation 19:7', 'consummation',
          'Until joy is a wedding: let us rejoice and be glad and give Him glory, for the marriage of the Lamb has come.'),
      ],
    },
    {
      id: 'prayer-always',
      ref: 'Luke 21:36',
      passageId: 'Luke 21:36',
      label: 'Always watch and pray',
      orbit: [
        station('watch-origin', 'Isaiah 62:6-7', 'origin',
          'Isaiah posts watchmen who pray without stopping: on your walls I have set watchmen who shall never be silent — give Him no rest until He establishes Jerusalem.'),
        station('watch-unfolding', 'Habakkuk 2:1', 'unfolding',
          'And Habakkuk takes the watch himself: I will take my stand at my watchpost and look out to see what He will say to me.'),
        station('watch-moment', 'Luke 21:36', 'moment',
          'So Jesus commands the never-ending watch: stay awake at all times, praying that you may have strength to stand before the Son of Man.'),
        station('watch-echo', 'Ephesians 6:18', 'aftermath',
          'Paul makes it the church’s posture: praying at all times in the Spirit, keeping alert with all perseverance for all the saints.'),
        station('watch-consummation', 'Revelation 16:15', 'consummation',
          'Until the One we watched for comes: behold, I am coming like a thief! Blessed is the one who stays awake.'),
      ],
    },
  ],

  // The topic spine — prayer as access to the Father, opened by Christ. Home of
  // "pray in secret," the Lord's Prayer, "ask whatever you wish," and "believe."
  orbit: [
    { id: 'prayer-origin', ref: 'Genesis 4:26', passageId: 'Genesis 4:26', position: 'origin',
      connection: 'Prayer starts early in the story: in the days of Enosh, people began to call on the name of the LORD. From the beginning, we reach for God with words.' },
    { id: 'prayer-unfolding', ref: 'Jeremiah 29:12-13', passageId: 'Jeremiah 29:12-13', position: 'unfolding',
      connection: 'And God promises the reach is not in vain: you will call on me and I will listen; you will seek me and find me, when you seek with all your heart.' },
    { id: 'prayer-moment', ref: 'Matthew 6:9-13', passageId: 'Matthew 6:9-13', position: 'moment',
      connection: 'Then Jesus does the unthinkable — He hands us the words and a name to use: Our Father. The God of heaven is addressed as Father, and the door stands open.' },
    { id: 'prayer-aftermath', ref: 'Hebrews 4:16', passageId: 'Hebrews 4:16', position: 'aftermath',
      connection: 'Hebrews tells us how to come now: with confidence to the throne of grace, because our High Priest has gone in ahead of us — to find mercy and help in time of need.' },
    { id: 'prayer-consummation', ref: 'Revelation 8:3-4', passageId: 'Revelation 8:3-4', position: 'consummation',
      connection: 'And no prayer is lost: in heaven they rise like incense before the throne — every cry you ever prayed, kept, and answered.' },
  ],

  thread: 'Prayer is access to the Father, opened wide by Christ the High Priest.',
  closing: '', // TODO: Rhema closing script
};
