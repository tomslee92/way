// "기도" — curated topic (한국어 / 개역개정). Parallels ../en/prayer.js.
//
// 개역개정 text pulled VERBATIM from 대한성서공회 (bskorea.or.kr, version=GAE) and
// confirmed against the reference. Korean is curated-only, so every verse stores
// its text. Connections are a parallel script in spoken 존댓말. DRAFT — Toms
// vouches/auditions. All memory verses ride the topic spine (orbit) below.
//
// NOTE: 누가복음 18:1 ends at "비유로 말씀하여" — that is 개역개정's own verse split
// ("이르시되" opens v2), confirmed direct from KBS. Verbatim; flagged for Toms.

export default {
  id: 'prayer',
  language: 'ko',
  title: '기도',
  subtitle: '믿는 이의 호흡.',

  memoryVerses: [
    { id: 'prayer-ask', ref: '마태복음 7:7', passageId: 'MAT.7.7', label: '구하라 찾으라 두드리라',
      text: '구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요 문을 두드리라 그리하면 너희에게 열릴 것이니' },
    { id: 'prayer-in-secret', ref: '마태복음 6:6', passageId: 'MAT.6.6', label: '은밀한 중에',
      text: '너는 기도할 때에 네 골방에 들어가 문을 닫고 은밀한 중에 계신 네 아버지께 기도하라 은밀한 중에 보시는 네 아버지께서 갚으시리라' },
    { id: 'prayer-lords-prayer', ref: '마태복음 6:9-13', passageId: 'MAT.6.9-MAT.6.13', label: '주기도문',
      text: '그러므로 너희는 이렇게 기도하라 하늘에 계신 우리 아버지여 이름이 거룩히 여김을 받으시오며 나라가 임하시오며 뜻이 하늘에서 이루어진 것 같이 땅에서도 이루어지이다 오늘 우리에게 일용할 양식을 주시옵고 우리가 우리에게 죄 지은 자를 사하여 준 것 같이 우리 죄를 사하여 주시옵고 우리를 시험에 들게 하지 마시옵고 다만 악에서 구하시옵소서' },
    { id: 'prayer-abide-ask', ref: '요한복음 15:7', passageId: 'JHN.15.7', label: '무엇이든지 구하라',
      text: '너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는 대로 구하라 그리하면 이루리라' },
    { id: 'prayer-believe-received', ref: '마가복음 11:24', passageId: 'MRK.11.24', label: '받은 줄로 믿으라',
      text: '그러므로 내가 너희에게 말하노니 무엇이든지 기도하고 구하는 것은 받은 줄로 믿으라 그리하면 너희에게 그대로 되리라' },
    { id: 'prayer-always', ref: '누가복음 18:1', passageId: 'LUK.18.1', label: '항상 기도하라',
      text: '예수께서 그들에게 항상 기도하고 낙심하지 말아야 할 것을 비유로 말씀하여' },
  ],

  orbit: [
    { id: 'prayer-origin', ref: '창세기 4:26', passageId: 'GEN.4.26', position: 'origin',
      text: '셋도 아들을 낳고 그의 이름을 에노스라 하였으며 그 때에 사람들이 비로소 여호와의 이름을 불렀더라',
      connection: '기도는 이야기 초반에 시작됩니다. 에노스 때에, 사람들이 비로소 여호와의 이름을 부르기 시작했어요. 처음부터 사람은, 말로 하나님을 찾았던 거예요.' },
    { id: 'prayer-unfolding', ref: '예레미야 29:12-13', passageId: 'JER.29.12-JER.29.13', position: 'unfolding',
      text: '너희가 내게 부르짖으며 내게 와서 기도하면 내가 너희들의 기도를 들을 것이요 너희가 온 마음으로 나를 구하면 나를 찾을 것이요 나를 만나리라',
      connection: '그리고 하나님은 그 부름이 헛되지 않다고 약속하세요. 너희가 내게 부르짖으면 내가 들을 것이요, 온 마음으로 나를 구하면 나를 만나리라.' },
    { id: 'prayer-moment', ref: '마태복음 6:9-13', passageId: 'MAT.6.9-MAT.6.13', position: 'moment',
      text: '그러므로 너희는 이렇게 기도하라 하늘에 계신 우리 아버지여 이름이 거룩히 여김을 받으시오며 나라가 임하시오며 뜻이 하늘에서 이루어진 것 같이 땅에서도 이루어지이다 오늘 우리에게 일용할 양식을 주시옵고 우리가 우리에게 죄 지은 자를 사하여 준 것 같이 우리 죄를 사하여 주시옵고 우리를 시험에 들게 하지 마시옵고 다만 악에서 구하시옵소서',
      connection: '그리고 예수님은 상상도 못 할 일을 하세요. 우리에게 그 말과, 부를 이름을 쥐여 주시는 거예요. 우리 아버지여. 하늘의 하나님을 아버지라 부르고, 그 문이 활짝 열립니다.' },
    { id: 'prayer-aftermath', ref: '히브리서 4:16', passageId: 'HEB.4.16', position: 'aftermath',
      text: '그러므로 우리는 긍휼하심을 받고 때를 따라 돕는 은혜를 얻기 위하여 은혜의 보좌 앞에 담대히 나아갈 것이니라',
      connection: '히브리서는 이제 어떻게 나아갈지 말합니다. 은혜의 보좌 앞에 담대히. 우리 대제사장께서 먼저 들어가셨으니, 때를 따라 돕는 은혜를 얻으려고요.' },
    { id: 'prayer-consummation', ref: '요한계시록 8:3-4', passageId: 'REV.8.3-REV.8.4', position: 'consummation',
      text: '또 다른 천사가 와서 제단 곁에 서서 금 향로를 가지고 많은 향을 받았으니 이는 모든 성도의 기도와 합하여 보좌 앞 금 제단에 드리고자 함이라 향연이 성도의 기도와 함께 천사의 손으로부터 하나님 앞으로 올라가는지라',
      connection: '그리고 어떤 기도도 잃어버리지 않습니다. 하늘에서 향처럼, 보좌 앞에 올라가요. 네가 드린 모든 부르짖음이, 간직되고 응답되는 거예요.' },
  ],

  thread: '기도는 아버지께 나아가는 길이며, 대제사장이신 그리스도께서 활짝 여신 길입니다.',
  closing: '', // TODO: Rhema closing script
};
