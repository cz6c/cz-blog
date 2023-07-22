export default {
  /**
   * @description: 项目相关
   */
  "/product/admin/": [
    {
      text: "vue-cz-admin",
      items: [
        {
          text: "介绍",
          link: "/product/admin/",
        },
        {
          text: "开始",
          link: "/product/admin/start",
        },
        {
          text: "项目配置",
          link: "/product/admin/config",
        },
        {
          text: "路由",
          link: "/product/admin/router",
        },
      ],
    },
  ],
  "/product/express/": [
    {
      text: "基于 Express 和 TS 搭建项目",
      link: "/product/express/",
    },
    {
      text: "基于mvc模型，进行接口开发",
      link: "/product/express/mvc",
    },
    {
      text: "基于jwt，实现token登录鉴权",
      link: "/product/express/jwt",
    },
  ],
  /**
   * @description: 代码相关
   */
  "/code/web/": [
    {
      text: "基础知识",
      items: [
        { text: "面经", link: "/code/web/base/" },
        { text: "移动端H5兼容性", link: "/code/web/base/h5" },
        { text: "javaScript", link: "/code/web/base/javaScript" },
        { text: "css 常用技巧", link: "/code/web/base/css" },
        { text: "flex 弹性布局", link: "/code/web/base/flex" },
      ],
    },
    {
      text: "Vue",
      items: [
        { text: "Vue2开发实践", link: "/code/web/vue/" },
        { text: "Vue Router", link: "/code/web/vue/router" },
        { text: "版本控制", link: "/code/web/vue/env" },
        { text: "微信登录", link: "/code/web/vue/wx" },
      ],
    },
    {
      text: "混合APP",
      items: [
        {
          text: "ApiCloud",
          collapsed: true,
          items: [
            { text: "创建第一个ApiCloud应用", link: "/code/web/apicloud/" },
            { text: "ApiCloud开发实践", link: "/code/web/apicloud/case" },
          ],
        },
        {
          text: "Flutter",
          collapsed: true,
          items: [
            { text: "创建第一个flutter项目", link: "/code/web/flutter/" },
            { text: "flutter状态管理-Getx", link: "/code/web/flutter/getx" },
          ],
        },
      ],
    },
  ],
  "/code/server/": [
    { text: "注册aws服务器", link: "/code/server/" },
    { text: "宝塔面板使用", link: "/code/server/bt" },
    { text: "linux环境配置", link: "/code/server/linux" },
    {
      text: "NavicatPremium16 破解版",
      link: "/code/server/navicatPremium",
    },
  ],
  "/code/plugin/": [
    { text: "功能插件/库", link: "/code/plugin/" },
    { text: "组件插件/库", link: "/code/plugin/component" },
  ],
};
