import { defineConfig } from "vitepress";
import sidebar from "./sidebar";

export default defineConfig({
  // ...
  title: "cz-blog",
  description: "Vite & Vue powered static site generator.",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      { text: "前端", link: "/web/" },
      { text: "服务端", link: "/server/" },
      { text: "插件/库", link: "/plugin/" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/cz6c" }],
    sidebar,
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
