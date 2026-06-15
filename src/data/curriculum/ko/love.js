// "사랑" — curated topic (한국어 / 개역개정). Parallels ../en/love.js.
//
// 개역개정 text pulled VERBATIM from 대한성서공회 (bskorea.or.kr, version=GAE) and
// confirmed against the reference. Korean is curated-only, so every verse stores
// its text. Connections are a parallel script in spoken 존댓말. DRAFT — Toms
// vouches/auditions. All memory verses ride the topic spine (orbit) below.

export default {
  id: 'love',
  language: 'ko',
  title: '사랑',
  subtitle: '율법의 심장.',

  memoryVerses: [
    { id: 'love-one-another', ref: '요한복음 13:34', passageId: 'JHN.13.34', label: '서로 사랑하라',
      text: '새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라' },
    { id: 'love-great-commandment', ref: '마태복음 22:37-39', passageId: 'MAT.22.37-MAT.22.39', label: '가장 큰 계명',
      text: '네 마음을 다하고 목숨을 다하고 뜻을 다하여 주 너의 하나님을 사랑하라 하셨으니 이것이 크고 첫째 되는 계명이요 둘째도 그와 같으니 네 이웃을 네 자신 같이 사랑하라 하셨으니' },
    { id: 'love-greater-love', ref: '요한복음 15:12-13', passageId: 'JHN.15.12-JHN.15.13', label: '더 큰 사랑',
      text: '내 계명은 곧 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라 하는 이것이니라 사람이 친구를 위하여 자기 목숨을 버리면 이보다 더 큰 사랑이 없나니' },
    { id: 'love-your-enemies', ref: '마태복음 5:44', passageId: 'MAT.5.44', label: '원수를 사랑하라',
      text: '나는 너희에게 이르노니 너희 원수를 사랑하며 너희를 박해하는 자를 위하여 기도하라' },
    { id: 'love-abide', ref: '요한복음 15:9', passageId: 'JHN.15.9', label: '내 사랑 안에 거하라',
      text: '아버지께서 나를 사랑하신 것 같이 나도 너희를 사랑하였으니 나의 사랑 안에 거하라' },
  ],

  orbit: [
    { id: 'love-origin', ref: '신명기 6:5', passageId: 'DEU.6.5', position: 'origin',
      text: '너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라',
      connection: '사랑은 시내 산에서 계명으로 시작됩니다. 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라. 느낌이기 전에, 너를 구원하신 하나님께 마땅히 드릴 사랑이에요.' },
    { id: 'love-unfolding', ref: '레위기 19:18', passageId: 'LEV.19.18', position: 'unfolding',
      text: '원수를 갚지 말며 동포를 원망하지 말며 네 이웃 사랑하기를 네 자신과 같이 사랑하라 나는 여호와이니라',
      connection: '그리고 같은 율법이 그 사랑을 밖으로 돌립니다. 네 이웃 사랑하기를 네 자신같이 하라. 처음부터, 이 둘은 함께였어요.' },
    { id: 'love-moment', ref: '마태복음 22:37-40', passageId: 'MAT.22.37-MAT.22.40', position: 'moment',
      text: '네 마음을 다하고 목숨을 다하고 뜻을 다하여 주 너의 하나님을 사랑하라 하셨으니 이것이 크고 첫째 되는 계명이요 둘째도 그와 같으니 네 이웃을 네 자신 같이 사랑하라 하셨으니 이 두 계명이 온 율법과 선지자의 강령이니라',
      connection: '가장 큰 계명을 묻자, 예수님은 그 둘을 하나로 묶으세요. 온 율법과 선지자가 바로 여기 달렸다고요. 하나님 사랑, 그리고 이웃 사랑.' },
    { id: 'love-aftermath', ref: '요한일서 4:10', passageId: '1JN.4.10', position: 'aftermath',
      text: '사랑은 여기 있으니 우리가 하나님을 사랑한 것이 아니요 하나님이 우리를 사랑하사 우리 죄를 속하기 위하여 화목제물로 그 아들을 보내셨음이라',
      connection: '그러나 요한은 그 계명 밑의 근원을 찾습니다. 사랑은 여기 있으니, 우리가 하나님을 사랑한 것이 아니라 그분이 우리를 사랑하사 그 아들을 보내신 것이라고요.' },
    { id: 'love-consummation', ref: '요한계시록 21:3', passageId: 'REV.21.3', position: 'consummation',
      text: '내가 들으니 보좌에서 큰 음성이 나서 이르되 보라 하나님의 장막이 사람들과 함께 있으매 하나님이 그들과 함께 계시리니 그들은 하나님의 백성이 되고 하나님은 친히 그들과 함께 계셔서',
      connection: '그리고 사랑은 늘 향하던 곳에 다다릅니다. 하나님이 그분의 백성과 함께 거하시고, 마침내 그들이 그분의 것이 되어, 모든 거리가 사라지는 거예요.' },
  ],

  thread: '율법이 명한 사랑이, 십자가에서 몸으로 이루어집니다.',
  closing: '', // TODO: Rhema closing script
};
