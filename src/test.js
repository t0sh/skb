import canonize from './canonize'

const array = [
  'https://telegram.me/skillbranch',
  'https://telegsfda.me/skillbranch',
  'https://teleasdfm.me/skillbranch234',
  'Https://Telegram.me/skillbranch',
  'Https://Telegram.mE/SkillBranch',
  'https://telegram.me/SkillBranch',
  '//telegram.me/skillbranch',
  'http://telegram.me/skillbranch',
  'telegram.me/skillbranch',
  'skillbranch',
  '@skillbranch',
  'https://vk.com/skillbranch',
  'http://vk.com/skillbranch',
  '//vk.com/skillbranch',
  'vk.com/skillbranch',
  'vk.com/skillbranch?w=wall-117903599_1076',
  'vk.com/skillbranch/profile',
];

array.forEach((url) => {
  const username = canonize(url);
  console.log(username);
})
