// "믿음" — curated topic (한국어 / 개역개정). Parallels ../en/faith.js.
//
// 개역개정 text pulled VERBATIM from 대한성서공회 (bskorea.or.kr, version=GAE) and
// confirmed against the reference. Korean is curated-only, so every verse stores
// its text. Connections are a parallel script in spoken 존댓말. DRAFT — Toms
// vouches/auditions. All memory verses ride the topic spine (orbit) below.
//
// NOTE: 마가복음 9:23 "할 수 있거든이" is 개역개정's own typesetting (the 이 begins
// "이 무슨 말이냐"); kept verbatim.

export default {
  id: 'faith',
  language: 'ko',
  title: '믿음',
  subtitle: '모든 것의 바탕.',

  memoryVerses: [
    { id: 'faith-work-of-god', ref: '요한복음 6:29', passageId: 'JHN.6.29', label: '하나님의 일은 믿는 것',
      text: '예수께서 대답하여 이르시되 하나님께서 보내신 이를 믿는 것이 하나님의 일이니라 하시니' },
    { id: 'faith-in-god', ref: '마가복음 11:22', passageId: 'MRK.11.22', label: '하나님을 믿으라',
      text: '예수께서 그들에게 대답하여 이르시되 하나님을 믿으라' },
    { id: 'faith-mustard-seed', ref: '마태복음 17:20', passageId: 'MAT.17.20', label: '겨자씨만 한 믿음',
      text: '이르시되 너희 믿음이 작은 까닭이니라 진실로 너희에게 이르노니 만일 너희에게 믿음이 겨자씨 한 알 만큼만 있어도 이 산을 명하여 여기서 저기로 옮겨지라 하면 옮겨질 것이요 또 너희가 못할 것이 없으리라' },
    { id: 'faith-whoever-believes', ref: '요한복음 11:25-26', passageId: 'JHN.11.25-JHN.11.26', label: '나를 믿는 자',
      text: '예수께서 이르시되 나는 부활이요 생명이니 나를 믿는 자는 죽어도 살겠고 무릇 살아서 나를 믿는 자는 영원히 죽지 아니하리니 이것을 네가 믿느냐' },
    { id: 'faith-not-seen', ref: '요한복음 20:29', passageId: 'JHN.20.29', label: '보지 못하고 믿는 자',
      text: '예수께서 이르시되 너는 나를 본 고로 믿느냐 보지 못하고 믿는 자들은 복되도다 하시니라' },
  ],

  orbit: [
    { id: 'faith-origin', ref: '창세기 15:6', passageId: 'GEN.15.6', position: 'origin',
      text: '아브람이 여호와를 믿으니 여호와께서 이를 그의 의로 여기시고',
      connection: '믿음은 처음부터 의로 여겨집니다. 아브람이 여호와를 믿으니, 그것을 그의 의로 여기셨어요. 얻어낸 것이 아니라, 신뢰한 거예요.' },
    { id: 'faith-unfolding', ref: '하박국 2:4', passageId: 'HAB.2.4', position: 'unfolding',
      text: '보라 그의 마음은 교만하며 그 속에서 정직하지 못하나 의인은 그의 믿음으로 말미암아 살리라',
      connection: '선지자는 그것을 한평생의 원리로 삼습니다. 의인은 그의 믿음으로 말미암아 살리라. 훗날 바울이 복음을 세울, 바로 그 말씀이에요.' },
    { id: 'faith-moment', ref: '마가복음 9:23', passageId: 'MRK.9.23', position: 'moment',
      text: '예수께서 이르시되 할 수 있거든이 무슨 말이냐 믿는 자에게는 능히 하지 못할 일이 없느니라 하시니',
      connection: '절박한 아버지가 가진 작은 것을 들고 오자, 예수님은 그 지점을 돌리세요. 믿는 자에게는 능히 하지 못할 일이 없느니라. 내가 믿나이다, 나의 믿음 없는 것을 도와주소서.' },
    { id: 'faith-aftermath', ref: '로마서 5:1', passageId: 'ROM.5.1', position: 'aftermath',
      text: '그러므로 우리가 믿음으로 의롭다 하심을 받았으니 우리 주 예수 그리스도로 말미암아 하나님과 화평을 누리자',
      connection: '바울은 믿음이 무엇을 얻게 하는지 말합니다. 믿음으로 의롭다 하심을 받았으니, 우리 주 예수 그리스도로 말미암아 하나님과 화평을 누린다고요. 그 오랜 다툼이, 끝난 거예요.' },
    { id: 'faith-consummation', ref: '히브리서 12:1-2', passageId: 'HEB.12.1-HEB.12.2', position: 'consummation',
      text: '이러므로 우리에게 구름 같이 둘러싼 허다한 증인들이 있으니 모든 무거운 것과 얽매이기 쉬운 죄를 벗어 버리고 인내로써 우리 앞에 당한 경주를 하며 믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자 그는 그 앞에 있는 기쁨을 위하여 십자가를 참으사 부끄러움을 개의치 아니하시더니 하나님 보좌 우편에 앉으셨느니라',
      connection: '그리고 믿음은 시작한 곳에서 끝을 맺습니다. 믿음의 주요 또 온전하게 하시는 이인 예수를 바라보며. 그분이, 그 모든 경주를 먼저 달리셨어요.' },
  ],

  thread: '아브라함이 시작한 믿음이, 예수 안에서 그 주인과 완성자를 만납니다.',
  closing: '', // TODO: Rhema closing script
};
