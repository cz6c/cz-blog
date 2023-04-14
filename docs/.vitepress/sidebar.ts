export default {
  "/web/": [
    {
      text: "前端",
      collapsed: false,
      items: [
        { text: "面经", link: "/web/" },
        { text: "H5兼容性和适配", link: "/web/h5" },
        { text: "浏览器兼容性", link: "/web/compatible" },
      ],
    },
    {
      text: "js",
      collapsed: false,
      items: [
        { text: "js", link: "/web/javaScript/" },
        { text: "文件上传下载", link: "/web/javaScript/file" },
        { text: "正则", link: "/web/javaScript/reg" },
      ],
    },
    {
      text: "css",
      collapsed: false,
      items: [
        { text: "css", link: "/web/css/" },
        { text: "字体进行抗锯齿渲染", link: "/web/css/font" },
        { text: "渐变", link: "/web/css/linear-gradient" },
      ],
    },
    {
      text: "vue",
      collapsed: false,
      items: [{ text: "面经", link: "/web/vue" }],
    },
  ],
  "/server/": [
    {
      text: "aws服务器搭建",
      collapsed: false,
      items: [
        { text: "获取服务器", link: "/server/" },
        { text: "安装宝塔", link: "/server/bt" },
        { text: "安装nginx", link: "/server/nginx" },
        { text: "安装node", link: "/server/node" },
        { text: "安装pm2", link: "/server/pm2" },
      ],
    },
  ],
};
