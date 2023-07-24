# apicloud开发实践案例

[[toc]]

## 项目文件引用

### 图片资源必须在apicloud项目文件中时

[![p9Ecv9K.png](https://s1.ax1x.com/2023/04/21/p9Ecv9K.png)](https://imgse.com/i/p9Ecv9K)


图片引用方式如下：

```ts
widget://image/icon/record.png
```

### 文件在vue项目public文件中时

[![p9Ecx1O.md.png](https://s1.ax1x.com/2023/04/21/p9Ecx1O.md.png)](https://imgse.com/i/p9Ecx1O)

## 页面返回

### 监听页面物理返回

移动端支持手机自带的返回键返回上一页的交互，可通过apiCloud提供的监听事件 `keyback` 实现，
该事件监听安卓设备 back 键被点击事件，以及 TabLayout 中的返回按钮点击事件。

在外层apiCloud项目 `index.html` 中加入以下代码进行监听

其中 `isRoot` 为全局变量，用于判断是否已处于根页面，需要在 vue 项目中 APP.vue中 监听路由改变事件进行设置

```ts
//监听返回操作
api.addEventListener({
    name: 'keyback'
}, function (ret, err) {
    var isRoot = api.getGlobalData({
        key: 'isRoot'
    });
    if (isRoot == 1) {
        api.closeWidget();
        return;
    }
    api.historyBack({
        frameName: 'main'
    }, function (ret, err) {
        if (!ret.status) {
            api.closeWidget();
        }
    });
});
```

vue 项目 APP.vue中 监听路由改变事件操作如下

```ts
// 原生操作
nativeHandle(to: any) {
  if (this.$API) {
    // App全局设置是否在根页面
    if (to.meta.index) {
      this.$API.setGlobalData({
        key: "isRoot",
        value: 1,
      });
    } else {
      this.$API.setGlobalData({
        key: "isRoot",
        value: 0,
      });
    }
  }
}
```

### 使用原生js 实现页面右滑返回

因为 ios 没有返回按钮，是通过右滑的方式进行返回交互，这时需要 使用原生js 对触摸事件的监听实现

说到监听触摸滑动，要用到的自然就是下面这三个触摸事件：

1. touchstart 触摸开始，手指点击屏幕时触发（可监听多点触控，后面的手指也同样会触发）
2. touchmove 接触点改变，滑动时持续触发
3. touchend 触摸结束，手指离开屏幕时触发

这三个触摸事件每个都包括了三个触摸对象列表（可根据触摸点实现多点触控）：

1. touches：当前屏幕上的所有手指触摸点的列表
2. targetTouches：当前DOM元素上手指的列表
3. changedTouches：当前事件手指的列表

同时每个触摸对象Touch包含的属性如下：

- pageX：触摸点在页面中的x坐标
- pageY：触摸点在页面中的y坐标
- screenX：触摸点在屏幕中的x坐标
- screenY：触摸点在屏幕中的y坐标
- clientX：触摸点在视口中的x坐标
- clientY：触摸点在视口中的y坐标
- target：触摸的DOM节点

代码实现如下

```ts
/**
* @description: 滑动监听相关
*/
startTime = 0; // 触摸开始时间
startDistanceX = 0; // 触摸开始X轴位置 相对屏幕
startDistanceY = 0; // 触摸开始Y轴位置
startClientX = 0; // 触摸开始X轴位置 相对视口
mounted() {
  window.addEventListener("touchstart", this.touchstart);
  window.addEventListener("touchend", this.touchend);
}
touchstart(e: any) {
  this.startTime = new Date().getTime();
  this.startDistanceX = e.touches[0].screenX;
  this.startDistanceY = e.touches[0].screenY;
  this.startClientX = e.touches[0].clientX;
  // console.log(this.startClientX);
}
touchend(e: any) {
  const endTime = new Date().getTime();
  const endDistanceX = e.changedTouches[0].screenX;
  const endDistanceY = e.changedTouches[0].screenY;
  const moveTime = endTime - this.startTime;
  const moveDistanceX = this.startDistanceX - endDistanceX;
  const moveDistanceY = this.startDistanceY - endDistanceY;
  // console.log(moveTime, moveDistanceX, moveDistanceY);
  // 判断X轴滑动距离超过40 且 滑动时间小于600毫秒 Y轴移动的距离不超过40  X轴开始滑动位置小于40
  if (Math.abs(moveDistanceX) > 40 && moveTime < 600 && Math.abs(moveDistanceY) < 40 && this.startClientX < 40) {
    // console.log("滑动");
    var isRoot = this.$API.getGlobalData({
      key: "isRoot",
    });
    if (isRoot == 1) return;
    this.$API.historyBack({
      frameName: "main",
    });
  }
}
```


  ## 原生App权限处理

  ```ts
  /**
 * 原生App统一权限处理
 *  list 要获取权限的数组  text提示语
 */
export function getPermission(list: any, text: any) {
  if (!window.api) {
    Toast("仅限App使用");
    return;
  }
  // 判断是否有权限
  const permission = window.api.hasPermission({
    list,
  });
  return new Promise((resolve, reject) => {
    if (permission[0].granted) {
      // 已授权
      resolve(permission[0].granted);
    } else {
      // 未授权
      Dialog.confirm({
        title: "开启权限",
        message: `应用需要您的授权才能访问${text}`,
        confirmButtonText: "去设置",
      }).then(() => {
        // 获取权限
        window.api.requestPermission(
          {
            list,
            code: 1,
          },
          (res: any) => {
            if (res.list[0].granted) {
              resolve(res.list[0].granted);
            } else {
              reject();
            }
          },
        );
      });
    }
  });
}
```

## 相机拍照上传

1. 调取相机拍照获取base64，然后转成blob 二进制流文件

```ts
import { getPermission } from "@utils/lib";

/**
 * @description: 调取相机
 */
 async camera() {
   if (this.$API) {
     await getPermission(["camera"], "摄像头");
     this.$API.getPicture({ sourceType: "camera", destinationType: "base64" }, ret => {
       const file = this.dataURItoBlob(ret.base64Data);
       this.$emit("camera", file);
     });
   } else {
     this.$toast("仅支持app操作");
   }
 },
    
 /**
 * @description: base64转blob
 * @param {*} dataURI
 * @return {*} Blob
 */
 dataURItoBlob(dataURI) {
   var byteString = window.atob(dataURI.split(",")[1]);
   var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
   var ab = new ArrayBuffer(byteString.length);
   var ia = new Uint8Array(ab);
   for (var i = 0; i < byteString.length; i++) {
     ia[i] = byteString.charCodeAt(i);
   }
   return new Blob([ab], { type: mimeString });
 },
 ```
 
2. 二进制流上传

```ts
 /**
   * @description: 上传
   */
  async uploadImage(file: any) {
    const formData = new FormData();
    const fileType = file.type.split("/");
    formData.append("file", file);
    formData.append("token", getToken() || "");
    this.$toast.loading("上传附件中...");
    await qiNiuUpload(
      {
        ext: fileType[fileType.length - 1],
        type: 1,
        order_uid: this.formData.WorkAmbID,
      },
      formData,
    );
    this.$toast("上传成功");
  }
  ```

## 录音上传

录音组件：使用 `startRecord` 开启录音功能，`stopRecord` 结束录音并且从该方法回调中拿到录音文件相关参数

注：录音前后都需要先获取用户的麦克风权限再往下操作

```ts
<template>
  <div class="press-voice">
    <div class="btn">
      <div :id="`bt_recoding${idKey}`">
        <SvgIcon icon="mp3"></SvgIcon>
      </div>
    </div>
    <div :class="`blackBoxSpeak${idKey}`" class="blackBoxSpeak">
      <p class="blackBoxSpeakConent">松开手指，结束录音</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getPermission } from "@utils/lib";


@Component
export default class PressVoice extends Vue {
  @Prop(String) readonly idKey!: string;
  mounted() {
    this.init();
  }
  init() {
    var that = this as any;
    // 录音按钮
    var bt_recoding = document.getElementById(`bt_recoding${this.idKey}`) as HTMLInputElement;

    // 中间黑色边框和里面的内容（录音状态）
    var blackBoxSpeak = document.querySelector(`.blackBoxSpeak${this.idKey}`) as HTMLElement;
    blackBoxSpeak.style.background = `url(${require("@images/voice/ic_record@2x.png")})no-repeat 28 16px/65px 104px, url(${require("@images/voice/ic_record_ripple@2x-9.png")})no-repeat 111.2px 32px/28.8px 88px`;
    blackBoxSpeak.style.backgroundColor = "rgba(0,0,0,.7)";

    // 轮播相关
    var index = [9, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var num = index.length;
    var timer: any = 0; // 用于清除计时器
    var key = "";
    function initEvent() {
      bt_recoding.addEventListener("touchstart", async function (event) {
        setTimer();
        event.preventDefault(); // 阻止浏览器默认行为
        key = `${new Date().getTime()}.amr`;
        if (that.$API) {
          await getPermission(["microphone"], "麦克风");
          that.$API.startRecord({
            path: `fs://voice/${key}`,
          });
          showBlackBoxSpeak();
        } else {
          that.$toast("仅限app使用");
        }
      });
      bt_recoding.addEventListener("touchend", async function (event) {
        console.log(`手指离开`);
        event.preventDefault(); // 阻止浏览器默认行为

        clearInterval(timer);
        // 初始化状态
        initStatus();

        if (that.$API) {
          await getPermission(["microphone"], "麦克风");
          that.$API.stopRecord(function (ret: any, err: any) {
            console.log(`stopRecord`, ret, err);
            if (ret) {
              if (ret.duration === 0) {
                that.$toast("说话时间太短");
                return;
              }


              that.$emit("change", { ...ret, key: that.idKey });
            } else {
              that.$toast("未知错误，请重试");
            }
          });
          showBlackBoxNone();
        } else {
          that.$toast("仅限app使用");
        }
      });
    }

    initEvent();

    // 轮播
    function setTimer() {
      timer = setInterval(function () {
        setTimeout(function () {
          num++;
          blackBoxSpeak.style.background = `url(${require("@images/voice/ic_record@2x.png")})no-repeat 40px 30px/40px 70px, url(${require(`@images/voice/ic_record_ripple@2x-${+index[
            num
          ]}.png`)})no-repeat 91.2px 32px/28.8px 66px`;
          blackBoxSpeak.style.backgroundColor = " rgba(0,0,0,.7)";
        }, 70);
        if (num >= index.length - 1) {
          num = 0;
        }
      }, 70);
    }

    // 初始化状态
    var initStatus = function () {
      // 全部隐藏
      showBlackBoxNone();
    };

    // 显示录音
    var showBlackBoxSpeak = function () {
      blackBoxSpeak.style.display = "block";
    };

    // 隐藏录音
    var showBlackBoxNone = function () {
      blackBoxSpeak.style.display = "none";
    };
  }
}
</script>

<style lang="scss" scoped>
.blackBoxSpeak {
  width: 150px;
  height: 150px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: url("~@images/voice/ic_record@2x.png") no-repeat 28px 16px/65px 104px,
    url("~@images/voice/ic_record_ripple@2x-9.png") no-repeat 111.2px 32px/28.8px 88px;
  background: rgba(0, 0, 0, 0.7);
  background-size: 20px;
  display: none;
  z-index: 2;
  border-radius: 16px;
}

.blackBoxSpeakConent {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  display: block;
  text-align: center;
  width: 90%;
  padding: 8px 0;
  margin: auto;
  color: #ffffff;
  font-weight: 200;
  border-radius: 4px;
  font-size: 14px;
}
</style>
```

外层组件：使用原生ajax方式上传录音文件

```ts
 /**
 * @description: 语音生成文本
 * @param {*}
 */
async sendFile(ret) {
  this.$toast.loading("生成文本中...");
  const { path, key } = ret;
  this.$API.ajax(
    {
      url: `${this.apiServiceUrl}/app/ext/voice_recog`,
      method: "post",
      data: {
        values: {
          token: getToken(),
        },
        files: {
          file: path,
        },
      },
    },
    (ret, err) => {
      if (ret) {
        if (ret.status == 1) {
          this.formData[key] = `${this.formData[key]}${ret.info}`;
          this.$toast(`文本生成成功`);
        }
      } else {
        this.$toast(`${JSON.stringify(err)}`);
      }
    },
  );
},
```

## 导航app唤起

```ts
location.href = `androidamap://poi?sourceApplication=amap&keywords=${address}&dev=0`;
```

[![p9EW34I.png](https://s1.ax1x.com/2023/04/21/p9EW34I.png)](https://imgse.com/i/p9EW34I)


## 签名版

signature_pad插件封装组件

```ts
<template>
  <div v-safeHeaderTop class="page">
    <Header :isBack="false" title="手写签名"> </Header>
    <canvas ref="signaturePadCanvas" class="canvas"></canvas>
    <div v-safeBottom class="button-view">
      <div v-for="(x, i) in ['取消', '重写', '确认']" :key="i" class="item" @click="itemClick(i)">{{ x }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SignaturePad from "signature_pad";
import { uploadFile } from "@api/home/index";
import { getToken } from "@/utils/auth";
 
@Component({
  name: "Sign",
})
export default class Sign extends Vue {
  signaturePad: any = null;
  mounted() {
    // 屏幕旋转
    if (this.$API) {
      this.$API.setScreenOrientation({
        orientation: "landscape_left",
      });
    }
    // 初始化写字板
    const canvas = this.$refs.signaturePadCanvas;
    this.signaturePad = new SignaturePad(canvas as any);
    window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
  }
  destroyed() {
    if (this.$API) {
      this.$API.setScreenOrientation({
        orientation: "auto",
      });
    }
  }
  itemClick(i: number) {
    switch (i) {
      case 0:
        this.signaturePad.clear();
        this.$emit("cancel");
        break;
      case 1:
        this.signaturePad.clear();
        break;
      case 2:
        if (this.signaturePad.isEmpty()) {
          console.log("签名为空");
          return;
        }
        var data = this.signaturePad.toDataURL();
        var fd = new FormData();
        var blob = this.dataURItoBlob(data);
        fd.append("file", blob);
        fd.append("token", getToken() || "");
        this.uploadFile(fd);
        break;
    }
  }
  // 上传生成的签名图片
  async uploadFile(fd: any) {
    const { order_id } = this.$route.query;
    const loading = this.$toast.loading("生成中...");
    const { data } = await uploadFile(fd, {
      params: {
        ext: "png",
        type: 1,
        order_uid: order_id,
      },
    });
    const url = data.file_path;
    this.$emit("confirm", url);
    loading.clear();
  }
  // base64转Blob
  dataURItoBlob(dataURI: string) {
    var byteString = window.atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
  // 重置写字板
  resizeCanvas() {
    const canvas: any = this.$refs.signaturePadCanvas;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    this.signaturePad.clear();
  }
}
</script>
 
<style lang="scss" scoped>
.canvas {
  height: calc(100% - 65px);
  width: 100%;
}
.button-view {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff;
  .item {
    padding: 6px 20px;
    background: #3a5be4;
    border-radius: 8px;
    color: #fff;
    margin-right: 10px;
  }
}
</style>
```
外部调用

```ts
<van-popup v-model="show" position="right" get-container="body" :overlay="false">
  <Sign  @cancel="show = false" @confirm="confirm" />
</van-popup>
```