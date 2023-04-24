# 插件/库

目录
[[toc]]

## 组件插件

### 视频播放插件

[npm](https://www.npmjs.com/package/video.js)

安装

```shell
cnpm i video.js -S
```

使用
```ts
<template>
  <div class="my-video">
    <video ref="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered"></video>
  </div>
</template>

<script lang="ts">
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Component, Vue, Prop } from "vue-property-decorator";
@Component
export default class MyVideo extends Vue {
  @Prop({
    type: String,
    default: "",
  })
  readonly src!: string; // 视频文件地址
  @Prop({
    type: String,
    default: "",
  })
  readonly fileThumb!: string; // 视频封面地址
  player = null;
  videoOptions = {
    autoplay: false,
    controls: true,
    controlBar: {
      volumePanel: {
        inline: false, // 音量控制,不使用水平方式
      },
    },
    poster: this.fileThumb, // 默认视频封面
    fluid: true, // 自适应布局缩放以适应容器
    aspectRatio: "16:9", // 视频比例
    sources: [
      {
        src: this.src,
        type: "video/mp4",
      },
    ],
  };
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      // console.log("onPlayerReady", this);
    });
  }
}
</script>

<style scoped lang="scss">
.my-video {
  width: 100%;
  height: 100%;
  position: absolute;
  video {
    width: 100%;
    height: 100%;
  }
}
</style>
```


### 轮播图插件

[npm](https://www.npmjs.com/package/swiper)
[文档](https://swiperjs.com/)

安装

```shell
cnpm install swiper@3.4.2 -S
```

使用

```ts
<template>
  <div v-if="list.length > 0" class="swiper-container">
    <div class="swiper-wrapper">
      <a
        v-for="({ img, link }, i) in list"
        :key="i"
        target="_blank"
        :href="link"
        data-swiper-autoplay="3000"
        class="swiper-slide"
      >
        <el-image :src="img" fit="cover" class="radius"></el-image>
      </a>
    </div>
    <div v-if="list.length > 1" class="swiper-pagination"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
import { getQuestionList } from "@api/home/index";

@Component
export default class MySwiper extends Vue {
  list: any = [];
  mounted() {
    this.init();
  }
  async init() {
    await this.getQuestionList();
    new Swiper(".swiper-container", {
      autoplay: 3000,
      grabCursor: true,
      pagination: ".swiper-pagination",
      paginationClickable: true,
      autoplayDisableOnInteraction: false,
    });
  }
  /**
   * @description:获取问卷管理列表
   */
  async getQuestionList() {
    const { data } = await getQuestionList();
    this.list = data || [];
  }
}
</script>

<style scoped lang="scss">
.swiper-container {
  width: 375px;
  height: 216px;
}
</style>
<style lang="scss">
.swiper-pagination-bullets {
  .swiper-pagination-bullet {
    width: 9px;
    height: 9px;
    background: #ffffff;
    opacity: 1;
    box-shadow: 0px 3px 6px 0px rgba(48, 48, 48, 0.57);
  }
  .swiper-pagination-bullet-active {
    width: 9px;
    height: 9px;
    background: #1347f2;
    opacity: 1;
    box-shadow: 0px 3px 6px 0px rgba(48, 48, 48, 0.57);
  }
}
</style>
```

### 字体打印效果插件

安装

```shell
cnpm i easy-typer-js -S
```

使用
```ts
// html
<div>{{ obj.output }}</div>

// js
import EasyTyper from 'easy-typer-js'

obj:{
  output: '', // 输出内容  使用MVVM框架时可以直接使用
  type: 'normal',// 支持  'rollback', 'normal', 'custom' 三种输出类型
  isEnd: false,
  speed: 80,// 打字速度
  backSpeed: 40,// 回滚速度
  sleep: 3000,// 完整输出完一句话后，睡眠一定时间后触发回滚事件
  singleBack: true, // 单次的回滚（优先级高于type）
  sentencePause: false //整个生命周期运行完毕后，句子是否暂停显示（仅在回滚模式下生效）
}

mounted() {
  new EasyTyper(this.obj, `string`);
},
```


### 在线pdf预览插件

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

### 字体滚动插件

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

### 分隔可拖动布局插件

安装

```shell
cnpm i split.js -S
```

使用

```ts
// html
<div class="split">
    <div ref="leftView" class="left-view"></div>
    <div ref="rightView" class="right-view"></div>
</div>

// js
import Split from "split.js";
mounted() {
    const options: any = {
        el: [this.$refs.leftView, this.$refs.rightView],
        direction: "horizontal",
        sizes: [30, 70],
        minSize: [400, 600],
    };
    this.$nextTick(() => {
        Split(options.el, {
            snapOffset: 0,
            gutterSize: 6,//拖拽线宽度
            sizes: options.sizes,//初始大小
            minSize: options.minSize,//最小大小
            direction: options.direction,//方向
        });
    });
}
  
// css
<style scoped lang="scss">
.split {
    display: flex;
    flex-direction: row;
    height: calc(100% - 76px);
    overflow: hidden;
    .left-view {
    }
    .right-view {
    }
}
</style>
<style lang="scss">
.gutter {
    background-repeat: no-repeat;
    background-position: 50%;
    height: 100%;
    background-color: #e5e7eb;
}
.gutter.gutter-horizontal {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
    cursor: col-resize;
}
.gutter.gutter-vertical {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
    cursor: row-resize;
}
</style>
```

### url转二维码插件

安装

```shell
cnpm i qrcodejs2 -S
```

使用实例：

注：必须等弹窗完全渲染后再去生成二维码，使用$nextTick api 确保弹窗完全渲染

QRCode.clear(); // clear the code.清除二维码

QRCode.makeCode("http://naver.com"); // make another code.替换二维码

```ts
// html
<van-dialog v-model="isPay" :showConfirmButton="false" getContainer="body" :closeOnClickOverlay="true">
   <div ref="refQrCode"></div>
   <div class="tit">微信扫码结算：{{ amount }}元</div>
</van-dialog>

// js
import QRCode from "qrcodejs2";

/**
 * @description: url转二维码
 * @param {*} pay_url  付款二维码url
 */
  qrcode(pay_url: string) {
    this.isPay = true;
    this.$nextTick(function () {
      if ((this.$refs.refQrCode as any).innerHTML) {
        (this.$refs.refQrCode as any).innerHTML = "";
      }
      new QRCode(this.$refs.refQrCode, {
        text: pay_url, // 二维码地址
        colorDark: "#000",
        colorLight: "#fff",
      });
    });
  }
```

### 图表插件

安装

```shell
cnpm i echarts -S
```

使用

```ts
// html   
 <div ref="chart" class="chart-view"></div>

// js
import * as echarts from "echarts";

  mounted() {
    this.init();
  },
  async init() {
    const { data } = await getChartData();
    const chartView = echarts.init(this.$refs.chart);
    chartView.setOption(this.getChartJson(data));
    // 屏幕重置大小
    window.addEventListener("resize", () => {
      chartView.resize();
    });
  },
  getChartJson(data) {
    const option = { };
    return option;
  },
```

常用配置

```ts
// tooltips显示时，分类轴标签高亮效果（xAxis）
    axisPointer: {
        snap: true,
        label: {
            show: true,
            backgroundColor: "#b9f0f7",
            color: "#0a2d46",
            margin: 18,
            verticalAlign: "middle",
        },
    },

// 坐标轴指示线的样式（tooltips）
    axisPointer: {
        type: "line",
        lineStyle: {
            color: "rgba(185, 240, 247, 0.2)",
            type: "solid", // 控制指示线的样式  要先设置type
        },
    },

// 分类轴标签长度处理
    axisLabel: {
        formatter: function (value) {
            return value.substring(0, 6) + "...";
        },
    },
```

### 使用svg格式插件

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

## 功能插件

### 时间转化插件

安装：

```shell
cnpm i moment -S
```

引入：

```ts
import moment from "moment";
```

获取时间搓

```ts
new Date().getTime();
+ new Date();
Date.now()
```

字符串转时间标准格式

```ts
const time = "2021/01/01 00:00:00";
new Date(time);//Fri Jan 01 2021 00:00:00 GMT+0800 (中国标准时间)
```

标准格式转字符串：

```ts
moment(new Date()).format("YYYY/MM/DD")
```

常用计算方法：

```ts
//计算两个日期的天数
let days = this.$moment('2019/06/17 14:00:00').diff(this.$moment('2019/06/20 14:00:00'), 'days'); 

//比较两个日期的大小
let flag = this.$moment('2019/06/17 14:00:00').isBefore('2019/06/17 14:00:00'); 

 //往后推指定时间
let time = moment().add(10, "days").format("YYYY.MM.DD");
```

### 模拟假数据

[npm](https://www.npmjs.com/package/mockjs)
[文档](http://mockjs.com/)

安装

```shell
cnpm i mockjs -S
```

utils文件夹下新建mock.ts：

```ts
// 往原型中新增方法
import Mock from "mockjs";
Mock.Random.extend({
    phone: function () {
        const phonePrefixs = ["132", "135", "189", "155", "181"];
        return this.pick(phonePrefixs) + Mock.mock(/\d{8}/);
    },
    number: function () {
        return Mock.Random.integer(1, 3);
    },
    array: function (length = 0, json) {
        const arr = Mock.mock({
            "list|30": [json],
        }).list;
        return arr.slice(0, length);
    },
});
export default Mock;
```

main.js挂载

```ts
import Mock from "@utils/mockjs";
Vue.prototype.$mock = Mock;
```

shims-vue.d.ts

```ts
declare module "*.vue" {
import moment from "moment";
import Mock from "@utils/mockjs";
import Vue from "vue";
declare module "vue/types/vue" {
    // 给vue的类型添加新的属性
    interface Vue {
        $mock: Mock;
        $moment: moment;
        $API: window.api;
    }
}
export default Vue;
}
```

页面使用：

```ts
list = this.$mock.Random.array(20, {
    id: "@id",
    title: "@ctitle(5,20)",
    isHot: "@boolean",
    isNew: "@boolean",
  });
```

### js计算精度插件 

安装

```shell
npm install bignumber.js --save
```

引入

```ts
import BigNumber from "bignumber.js";
```

基本加减乘除运算

```ts
BigNumber(666).plus(10).toString() //加
BigNumber(666).minus(10).toString() //减
BigNumber(666).times(10).toString() //乘
BigNumber(666).div(10).toString() //除

```

建议从 String 值而不是 Number 值创建 BigNumbers 以避免潜在的精度损失。

```ts
// 使用具有超过 15 个显着性的数字文字的精度损失 digits.
new BigNumber(99999999999999999999).toString()   // '100000000000000000000'
new BigNumber('99999999999999999999').toString()   // '99999999999999999999'
```

要获取 BigNumber 的字符串值，请使用toString()or toFixed()。使用toFixed()可防止返回指数表示法，无论值有多大或多小。

```ts
let x = new BigNumber('1111222233334444555566');
x.toString();               // "1.111222233334444555566e+21"
x.toFixed();                // "1111222233334444555566"
```

toFormat方法可能对国际化有用。

```ts
y = new BigNumber('1234567.898765')
y.toFormat(2)               // "1,234,567.90"
```

求和
.sum(n...) ⇒ BigNumber
返回值始终是精确且未舍入的。

```ts
x = new BigNumber('3257869345.0378653')
BigNumber.sum(4e9, x, '123456789.9') // '7381326134.9378653'

arr = [2, new BigNumber(14), '15.9999', 12]
BigNumber.sum.apply(null, arr) // '43.9999'
```

取幂
.pow(n) ⇒ BigNumber
n如果不是整数 则抛出。请参阅错误。

```ts
Math.pow(0.7, 2) // 0.48999999999999994
x = new BigNumber(0.7)
x.pow(2) // '0.49'
```