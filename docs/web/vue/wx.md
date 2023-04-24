[![p9mqO8f.md.png](https://s1.ax1x.com/2023/04/24/p9mqO8f.md.png)](https://imgse.com/i/p9mqO8f)

由于这个项目对接微信开放平台都是在服务端进行的，所以前端只需要把需要的参数传到后端即可，后端通过一系列操作获取到微信开放平台的access_token，获取到用户信息后，返回项目的token到前端，前端进行登录操作。

第一步：

请求后端接口获取微信登录二维码，传递callbackUrl参数给后端，这个参数对应微信文档上的redirect_uri，就是项目的线上地址拼上处理微信登录页面的路由，

后面还可以拼上自己需要的其他参数，我这里就多拼了一个url参数，用来处理登录成功后重定向到之前的页面

部分代码：

```ts
/**
 * @description: 获取微信登录二维码
 */
async getWxLoginQrCodeUrl() {
  const origin = `${location.origin}/wxRedirect?url=${this.nowPath}`;
  const { data } = await getWxLoginQrCodeUrl({}, {}, { callbackUrl: origin });
  this.wxCode = data;
}

<!-- 微信登录 -->
<div class="qr-code">
  <div class="tit">微信扫码登录</div>
  <div class="iframe-wrap">
    <iframe v-if="wxCode" :src="wxCode" frameborder="0"></iframe>
    <i class="el-icon-loading"></i>
  </div>
</div>
```

[![p9mqX28.md.png](https://s1.ax1x.com/2023/04/24/p9mqX28.md.png)](https://imgse.com/i/p9mqX28)

第二步：

用户微信扫码确认后，可以看到页面路由就重定向到了之前传给后端的callbackUrl地址上，并且额外返回了code和state参数，

再把这两个参数通过微信登录接口传递到后端，后端通过 API 换取access_token，通过access_token进行接口调用，获取用户基本数据资源，返回项目token到前端。

wxRedirect代码：

```ts
<template>
  <div class="page">
    <div class="wx-login">
      <i class="el-icon-loading"></i>
      <div>微信授权中...</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { wxLogin } from "@api/auth/index";
import { AuthModule } from "@/store/modules/auth";
import { setToken } from "@/utils/auth";

@Component({
  name: "wxRedirect",
  components: {},
})
export default class wxRedirect extends Vue {
  created() {
    this.wxLogin();
  }
  async wxLogin() {
    const { url, code, state} = this.$route.query as any;
    if (url && code && state) {
      const json: any = {
        code,
        state,
      };
      const { data } = await wxLogin({}, {}, json);
      const { token } = data;
      // 微信登录
      setToken(token);
      await AuthModule.getLoginUserInfo();
      this.$router.replace(url);
      this.$message.success("登录成功");
    } else {
      this.$router.replace("/");
    }
  }
}
</script>

<style scoped lang="scss">
.page {
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .wx-login {
    text-align: center;
    i {
      font-size: 40px;
      margin-bottom: 20px;
    }
  }
}
</style>
```

[![p9mqb5t.md.png](https://s1.ax1x.com/2023/04/24/p9mqb5t.md.png)](https://imgse.com/i/p9mqb5t)

[![p9mqLPP.md.png](https://s1.ax1x.com/2023/04/24/p9mqLPP.md.png)](https://imgse.com/i/p9mqLPP)




​