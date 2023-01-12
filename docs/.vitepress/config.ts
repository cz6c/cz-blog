import { defineConfig } from "vitepress";

export default defineConfig({
  // ...
  title: "cz-ui",
  description: "Vite & Vue powered static site generator.",
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/" },
      { text: "组件", link: "/component/" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "Index", link: "/guide/" },
            { text: "One", link: "/guide/rule" },
          ],
        },
      ],

      "/component/": [
        {
          text: "组件",
          items: [
            { text: "Index", link: "/component/" },
            { text: "Three", link: "/component/btn" },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Evan You",
    },
  },
});
