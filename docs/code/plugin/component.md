# 组件插件/库

[[toc]]

## 在线pdf预览插件

安装

```shell
cnpm i vue-pdf -S
```

使用

```ts
<template>
  <div v-loading="loading" class="pdf-page" element-loading-text="pdf加载中" :class="{ 'pdf-fixed': isFixed }">
    <div :style="{ cursor: 'pointer', transform: `rotate(${rotate}deg)`, width: `${scale}%` }" @click="handelClick(1)">
      <pdf
        ref="pdf"
        :src="src"
        :page="currentPage"
        @num-pages="pageCount = $event"
        @page-loaded="pageLoaded($event)"
        @loaded="loadPdfHandler"
      >
      </pdf>
    </div>
    <div v-if="!isFixed" class="arrow">
      <span class="current"> {{ currentPage }} / {{ pageCount }}</span>
      <div class="jumper">
        <span>跳至</span>
        <el-input-number
          v-model="jumperPage"
          step-strictly
          :controls="false"
          :min="1"
          :max="pageCount"
          @change="jumperPageChange"
        ></el-input-number>
        <span>页</span>
      </div>
    </div>
    <div class="btn-wrap">
      <div class="btn" :class="{ disabled: currentPage == 1 }" @click.stop="changePdfPage(0)">
        <SvgIcon icon="pdf-back" />
      </div>
      <div class="btn" :class="{ disabled: currentPage == pageCount }" @click.stop="changePdfPage(1)">
        <SvgIcon icon="pdf-next" />
      </div>
    </div>
    <div v-if="isFixed" class="close-wrap" @click.stop="handelClick(0)">
      <SvgIcon icon="pdf-close" />
    </div>
    <div v-if="isFixed" class="tool-wrap">
      <div v-for="({ title, icon }, i) in tools" :key="i" class="tool" @click.stop="toolClick(icon)">
        <SvgIcon :icon="icon" />
        <span>{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import pdf from "vue-pdf";

@Component({
  name: "MyPdf",
  components: { pdf },
})
export default class MyPdf extends Vue {
  @Prop({
    type: String,
    default: "",
  })
  readonly src!: string; // pdf文件地址
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  readonly data!: any; // 文章数据
  currentPage = 0; // pdf文件页码
  pageCount = 0; // pdf文件总页数
  loading = true; // pdf加载loading
  jumperPage: any = ""; // 输入框跳转页
  scale = 100; // 放大
  rotate = 0; // 旋转
  isFixed = false; // 是否放大缩小
  tools = [
    {
      title: "放大",
      icon: "pdf-enlarge",
    },
    {
      title: "缩小",
      icon: "pdf-zoomout",
    },
    {
      title: "顺时针",
      icon: "pdf-right",
    },
    {
      title: "逆时针",
      icon: "pdf-lefe",
    },
  ];
  /**
   * @description: 改变PDF页码
   * @param {*} val
   * @return {*}
   */
  changePdfPage(val: number) {
    if (this.currentPage === 1 && val === 0) return;
    if (this.currentPage == this.pageCount && val === 1) return;
    if (val === 0 && this.currentPage > 1) {
      this.currentPage--;
    }
    if (val === 1 && this.currentPage < this.pageCount) {
      this.currentPage++;
    }
  }
  /**
   * @description: pdf文件加载
   * @return {*}
   */
  loadPdfHandler() {
    this.currentPage = 1; // 加载的时候先加载第一页
    this.jumperPage = undefined;
  }
  /**
   * @description: 页面加载回调
   * @param {*} event
   * @return {*}
   */
  pageLoaded(event: any) {
    this.loading = false;
    this.currentPage = event;
  }
  /**
   * @description: 跳转页
   * @return {*}
   */
  jumperPageChange() {
    // console.log(this.jumperPage);
    const num = Math.round(this.jumperPage);
    this.currentPage = num;
  }
  /**
   * @description: 放大缩小pdf
   * @param {*} val
   * @return {*}
   */
  handelClick(val: number) {
    const body = document.body;
    if (val === 1) {
      if (this.isFixed) return;
      body.style.overflow = "hidden";
      this.scale = 100;
      this.rotate = 0;
      this.scale = 60;
      this.isFixed = true;
    } else {
      body.style.overflow = "";
      this.scale = 100;
      this.rotate = 0;
      this.isFixed = false;
    }
  }
  /**
   * @description: 操作pdf
   * @param {*} icon
   * @return {*}
   */
  toolClick(icon: string) {
    switch (icon) {
      case "pdf-enlarge":
        if (this.scale > 80) return;
        this.scale += 10;
        break;
      case "pdf-zoomout":
        if (this.scale < 40) return;
        this.scale -= 10;
        break;
      case "pdf-right":
        this.rotate += 90;
        break;
      case "pdf-lefe":
        this.rotate -= 90;
        break;
    }
  }
}
</script>

<style scoped lang="scss">
.pdf-page {
  width: 100%;
  height: 100%;
  position: relative;
  &.pdf-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .close-wrap {
    position: absolute;
    top: 0;
    right: 0;
    /deep/ .svg-icon {
      width: 28px;
      height: 28px;
      cursor: pointer;
    }
  }
  .btn-wrap {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .btn {
      padding: 12px;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.5);
      /deep/ .svg-icon {
        width: 32px;
        height: 44px;
      }
      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
  .tool-wrap {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 36px;
    height: 60px;
    width: 360px;
    box-sizing: border-box;
    .tool {
      flex: 1;
      font-size: 12px;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      /deep/ .svg-icon {
        width: 20px;
        height: 20px;
        padding-bottom: 6px;
      }
    }
  }
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 20px;
    .current {
      margin: 0 14px;
    }
    .jumper {
      margin-left: 14px;
      display: flex;
      align-items: center;
      /deep/ .el-input-number {
        margin: 0 6px;
        width: 50px;
        .el-input__inner {
          padding: 0 6px;
          height: 32px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
```

## 字体滚动插件

安装

```shell
cnpm i vue-count-to -S
```

使用 

start-val开始值，end-val结束值，duration滚动时间

separator分隔符，prefix前插槽，suffix后插槽--都是传string类型参数

```ts
<countTo :start-val="10" :end-val="132" :duration="3000" />

import countTo from "vue-count-to";
components: {
    countTo,
},
```

## 使用svg格式插件

原理：

```
flowchart LR
    svg文件 --> symbol元素
```

- svg-sprite-loader会把svg文件生成一个个symbol元素
- 通过<use xlink:href="#symbolId"></use>的方式使用symbol元素，
- use标签的xlink:href会指向对应id的symbol元素，显示出icon。

安装

```shell
cnpm install svg-sprite-loader --save-dev
```

vue.config.js配置

此配置会对项目中所有规则中指定的svg文件进行生成symbol元素处理
option设置symbolID，不设置默认id为svg文件名name

```ts
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    chainWebpack: config => {
        // svg-sprite-loader
        // svg规则已经对svg文件使用url-loader了,这里要exculde
        config.module.rule("svg").exclude.add(resolve("src/assets")).end();
        // 再创建一条新rule  专门对src/assets进行处理
        config.module
            .rule("assets")
            .test(/\.svg$/)
            .include.add(resolve("src/assets"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();
    },
};
```

组件化SvgIcon

```ts
<script>
export default {
    name: "SvgIcon",
    props: {
        icon: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: "",
        },
        style: {
            type: Object,
            default: () => {
                return {};
            },
        },
    },
    render: function (h, context) {
        const { icon, style } = context.props;
        const className = context.data.staticClass;
        // 是否是外链，如http,https等
        const isExternal= path => {
          return /^(https?:|mailto:|tel:)/.test(path);
        }
        const isExternalValue = isExternal(icon);
        const iconName = `#icon-${icon}`;
        let svgClass;
        if (className) {
            svgClass = "svg-icon " + className;
        } else {
            svgClass = "svg-icon";
        }
        const styleExternalIcon = {
            mask: `url(${icon}) no-repeat 50% 50%`,
            "-webkit-mask": `url(${icon}) no-repeat 50% 50%`,
        };
        if (isExternalValue) {
            return h("div", {
                class: "svg-external-icon svg-icon",
                attrs: {
                    style: styleExternalIcon,
                },
                on: context.listeners,
            });
        } else {
            return h(
                "svg",
                {
                    class: svgClass,
                    attrs: {
                        "aria-hidde": "true",
                    },
                    style: {
                        ...style,
                    },
                    on: context.listeners,
                },
                [
                    h("use", {
                        attrs: {
                            "xlink:href": iconName,
                        },
                    }),
                ],
            );
        }
    },
};
</script>
<style scoped lang="scss">
.svg-icon {
    width: 40px;
    height: 40px;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
```

自动导入/全局引用处理
main.js中通过 require.context方法动态引入指定文件下的所有svg文件，
并全局注册SvgIcon组件

```ts
// svg操作
const req = require.context("@/assets/svg", false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
// 获取svg文件的绝对路径
requireAll(req);
import SvgIcon from "@com/SvgIcon.vue";
Vue.component("SvgIcon", SvgIcon);
```