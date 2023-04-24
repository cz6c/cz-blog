export default {
  "/web/": [
    {
      text: "前端",
      collapsed: true,
      items: [
        { text: "面经", link: "/web/" },
        { text: "H5兼容性", link: "/web/h5" },
        { text: "javaScript", link: "/web/javaScript/" },
        { text: "css", link: "/web/css/" },
      ],
    },
    {
      text: "vue",
      collapsed: true,
      items: [
        { text: "vue2开发实践案例", link: "/web/vue/" },
        { text: "Router", link: "/web/vue/router" },
        { text: "版本控制", link: "/web/vue/env" },
        { text: "微信登录", link: "/web/vue/wx" },
      ],
    },
    {
      text: "apicloud",
      collapsed: true,
      items: [
        { text: "apicloud创建应用", link: "/web/apicloud/" },
        { text: "apicloud开发实践案例", link: "/web/apicloud/case" },
      ],
    },
  ],
  "/server/": [
    {
      text: "aws服务器搭建",
      collapsed: false,
      items: [
        { text: "注册aws", link: "/server/aws/" },
        { text: "宝塔使用", link: "/server/aws/bt" },
        { text: "linux安装插件/应用", link: "/server/aws/linux" },
      ],
    },
    {
      text: "express",
      collapsed: false,
      items: [
        {
          text: "基于 Node.js、Express 和 TypeScript 搭建项目",
          link: "/server/express/",
        },
        {
          text: "基于mvc模型，进行模块化接口开发",
          link: "/server/express/mvc",
        },
        {
          text: "基于jwt，实现token登录鉴权",
          link: "/server/express/jwt",
        },
      ],
    },
  ],
  "/plugin/": [
    {
      text: "插件/库",
      collapsed: false,
      items: [{ text: "插件/库", link: "/plugin/" }],
    },
  ],
};
