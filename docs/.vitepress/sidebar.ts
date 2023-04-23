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
        { text: "获取服务器", link: "/server/aws/" },
        { text: "安装宝塔", link: "/server/aws/bt" },
        { text: "安装nginx", link: "/server/aws/nginx" },
        { text: "安装node", link: "/server/aws/node" },
        { text: "安装pm2", link: "/server/aws/pm2" },
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
      items: [
        { text: "获取服务器", link: "/plugin/" },
        { text: "安装宝塔", link: "/plugin/bt" },
        { text: "安装nginx", link: "/plugin/nginx" },
        { text: "安装node", link: "/plugin/node" },
        { text: "安装pm2", link: "/plugin/pm2" },
      ],
    },
  ],
};
