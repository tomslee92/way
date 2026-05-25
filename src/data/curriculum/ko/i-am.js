// "I AM" — curated topic (한국어 / 개역개정). Parallels ../en/i-am.js.
// Verified source text and Rhema's voice scripts: curriculum-seed.md.
//
// The opening / connection / closing are NOT translations of the English — they
// are a parallel script written in spoken 존댓말 (해요체) so Anna Kim's voice reads
// naturally aloud. Audition the generated audio carefully.
//
// id and orbit ids are identical to the English file on purpose: a topic is one
// concept across languages, and matching ids keep the pre-generated audio tree
// parallel (/audio/i-am/en/... and /audio/i-am/ko/...). passageId is the
// API.Bible reference id, kept for diffing the seed text against /api/bible.

export default {
  id: 'i-am',
  language: 'ko',
  title: '나는 ~이다',
  subtitle: '아브라함이 나기 전부터 내가 있느니라',

  anchor: {
    ref: '요한복음 8:58',
    passageId: 'JHN.8.58',
    speaker: '예수님',
    text: [
      '예수께서 이르시되',
      '진실로 진실로 너희에게 이르노니',
      '아브라함이 나기 전부터 내가 있느니라 하시니',
    ].join('\n'),
    opening:
      "오늘은 요한복음 8장 58절, 예수님의 말씀을 암송합니다. 잘 들어보세요. 예수님은 " +
      "'내가 있었다'고 하지 않으셨어요. '내가 있느니라'라고 하셨습니다. 이 말씀은 하나님께서 " +
      "불타는 떨기나무에서 모세에게 하신 말씀과 똑같은 말씀입니다. 그 자리에 있던 사람들은 " +
      "예수님이 무슨 말씀을 하시는지 정확히 알아들었고, 돌을 들어 그분을 죽이려 했어요. 이 " +
      "말씀을 암송하기 전에, 먼저 성경을 함께 걸으며 예수님께서 무엇을 말씀하셨는지 살펴봅시다.",
  },

  orbit: [
    {
      id: 'exodus-3-14',
      ref: '출애굽기 3:14',
      passageId: 'EXO.3.14',
      position: 'origin',
      text:
        '하나님이 모세에게 이르시되 나는 스스로 있는 자이니라 또 이르시되 너는 이스라엘 자손에게 이같이 이르기를 스스로 있는 자가 나를 너희에게 보내셨다 하라',
      connection:
        "여기서부터 시작됩니다. 모세는 불이 붙었는데도 타지 않는 떨기나무 앞에 서서, 하나님께 " +
        "그분의 이름을 묻습니다. 그러자 하나님께서 대답하세요. 나는 스스로 있는 자이니라. 바로 " +
        "이 이름을, 예수님께서 자신에게 취하신 것입니다. 떨기나무에서 말씀하시던 그 음성이, 지금 " +
        "그들 앞에 서 계신 거예요.",
    },
    {
      id: 'isaiah-43-10',
      ref: '이사야 43:10',
      passageId: 'ISA.43.10',
      position: 'unfolding',
      text:
        '나 여호와가 말하노라 너희는 나의 증인, 나의 종으로 택함을 입었나니 이는 너희가 나를 알고 믿으며 내가 그인 줄 깨닫게 하려 함이라 나의 전에 지음을 받은 신이 없었느니라 나의 후에도 없으리라',
      connection:
        "수백 년이 흐른 뒤, 선지자 이사야를 통해 여호와께서 말씀하십니다. 내가 그라. 다른 신은 " +
        "없다. '나는 ~이다'라는 이름은 누구와도 나눌 수 없는 이름입니다. 예수님께서 이 이름을 " +
        "자신에게 취하셨다는 것은, 곧 자신이 유일하신 참 하나님이라고 선포하신 거예요.",
    },
    {
      id: 'john-8-24',
      ref: '요한복음 8:24',
      passageId: 'JHN.8.24',
      position: 'moment',
      text:
        '그러므로 내가 너희에게 말하기를 너희가 너희 죄 가운데서 죽으리라 하였노라 너희가 만일 내가 그인 줄 믿지 아니하면 너희 죄 가운데서 죽으리라',
      connection:
        "사실 이 말씀은, 우리가 암송할 앵커 구절 바로 몇 분 전에 하신 말씀이에요. 예수님은 이미 " +
        "말씀하셨습니다. 내가 그라. 그런데 사람들이 아직 깨닫지 못해요. 그래서 예수님은 더 " +
        "분명하게, 도저히 놓칠 수 없을 만큼 다시 말씀하시는 거예요.",
    },
    {
      id: 'john-18-5-6',
      ref: '요한복음 18:5-6',
      passageId: 'JHN.18.5-JHN.18.6',
      position: 'aftermath',
      text:
        '대답하되 나사렛 예수라 하거늘 이르시되 내가 그니라 하시니라 그를 파는 유다도 그들과 함께 섰더라 예수께서 그들에게 내가 그니라 하실 때에 그들이 물러가서 땅에 엎드러지는지라',
      connection:
        "겟세마네 동산에서, 군인들이 예수님을 잡으러 옵니다. 예수님은 그 이름을 말씀하세요. 내가 " +
        "그니라. 그러자 그들이 땅에 엎드러집니다. 이름 자체에 능력이 있는 거예요. 이분은 보통 " +
        "사람이 아니십니다.",
    },
    {
      id: 'revelation-1-8',
      ref: '요한계시록 1:8',
      passageId: 'REV.1.8',
      position: 'consummation',
      text:
        '주 하나님이 이르시되 나는 알파와 오메가라 이제도 있고 전에도 있었고 장차 올 자요 전능한 자라 하시더라',
      connection:
        "그리고 마침내, 모든 것의 끝에서. 불타는 떨기나무에서부터 하늘 보좌까지, 같은 음성입니다. " +
        "나는 ~이다. 전에도 계셨고, 지금도 계시고, 장차 오실 분이세요.",
    },
  ],

  closing:
    "이제 이 말씀이 마음에 새겨졌습니다. 아브라함이 나기 전부터 내가 있느니라. 이 말씀을 읊을 " +
    "때마다, 떨기나무를 기억하세요. 선지자 이사야를 기억하세요. 동산에서 엎드러진 군인들을 " +
    "기억하세요. 하늘 보좌를 기억하세요. 떨기나무에서 말씀하신 분, 영원토록 다스리실 분이, 바로 " +
    "예수님으로 우리에게 오신 그분이세요. 우리는 이분의 사람입니다.",
};
