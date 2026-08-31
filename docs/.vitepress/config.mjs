import { readFileSync } from 'node:fs';

const sidebar = JSON.parse(readFileSync(new URL('./sidebar.json', import.meta.url), 'utf8'));

export default {
  title: 'end-of-front',
  description: 'Having fun with JS/TS and their connection with Angular',
  base: '/end-of-front/',
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'Stages', link: sidebar[0].items[0].link },
      { text: 'GitHub', link: 'https://github.com/erkamyaman/end-of-front' },
    ],
    sidebar: [{ text: 'Stages', items: sidebar }],
    search: { provider: 'local' },
    outline: [2, 2],
    socialLinks: [{ icon: 'github', link: 'https://github.com/erkamyaman/end-of-front' }],
  },
};
