# apicloud创建应用

目录
[[toc]]

## apicloud开发混合app模式

即把vue框架打包运行在apicloud的webview浏览器外壳中（本质就是web只是伪装的更像app）
vue中的页面在手机中跳转时，是以堆栈的形式进行的

### 创建应用

[![p9E6Tot.md.png](https://s1.ax1x.com/2023/04/21/p9E6Tot.md.png)](https://imgse.com/i/p9E6Tot)

### 创建android证书

[![p9E6IeA.md.png](https://s1.ax1x.com/2023/04/21/p9E6IeA.md.png)](https://imgse.com/i/p9E6IeA)
[![p9E64Ld.md.png](https://s1.ax1x.com/2023/04/21/p9E64Ld.md.png)](https://imgse.com/i/p9E64Ld)

### 导入云端项目

[![p9E6hsH.png](https://s1.ax1x.com/2023/04/21/p9E6hsH.png)](https://imgse.com/i/p9E6hsH)

### 指定安卓sdk版本

[![p9E6fQe.md.png](https://s1.ax1x.com/2023/04/21/p9E6fQe.md.png)](https://imgse.com/i/p9E6fQe)

### 配置.xml文件 .html文件

[![p9E6yIx.md.png](https://s1.ax1x.com/2023/04/21/p9E6yIx.md.png)](https://imgse.com/i/p9E6yIx)

.xml文件示例：
```js
 <widget id="A6190222804232"  version="0.0.1">
<!-- 项目名字 -->
    <name>test</name>
    <description></description>
<!-- 作者信息 -->
    <author email="developer@apicloud.com" href="http://www.apicloud.com">Developer</author>

    <content src="index.html" />

    <access origin="*" />

    <preference name="pageBounce" value="false"/>


    <preference name="appBackground" value="rgba(0,0,0,0.0)"/>


    <preference name="windowBackground" value="rgba(0,0,0,0.0)"/>


    <preference name="frameBackgroundColor" value="rgba(0,0,0,0.0)"/>


    <preference name="hScrollBarEnabled" value="false"/>


    <preference name="vScrollBarEnabled" value="false"/>


    <preference name="autoLaunch" value="true"/>


    <preference name="fullScreen" value="false"/>


    <preference name="autoUpdate" value="true" />


    <preference name="smartUpdate" value="false" />
<!-- 防止报不必要的错 -->
    <preference name="debug" value="false"/>


    <preference name="statusBarAppearance" value="true"/>


    <permission name="readPhoneState" />


    <permission name="camera" />


    <permission name="record" />


    <permission name="location" />


    <permission name="fileSystem" />


    <permission name="internet" />


    <permission name="bootCompleted" />


    <permission name="hardware" />
<!--
    配置应用的URL Scheme，该scheme用于从浏览器或其他应用中启动本应用，并且可以传递参数数据。此字段云编译有效
    配置后，外部浏览器页面里面就可以通过a标签链接打开应用：<a href="myscheme://?param1=xxx&param2=xxx">测试打开应用</a>
 -->
    <preference name="urlScheme" value="test" />
<!--
    用于配置User Agent，配置后会更改页面里的User Agent以及ajax请求的User Agent。云编译有效。
    配合vue项目中 main.js 判断是否是app端，将API链接到Vue原型
 -->
    <preference name="userAgent" value="APICloud" />
<!--
    用于配置是否检查https证书是受信任的。如果https服务器端证书不是正规机构颁发的，则需要配置false，否则应用将无法访问数据。
-->
    <preference name="checkSslTrusted" value="false" />
<!--
    仅iOS平台有效。用于配置是否校验应用证书。若配置为true，应用被重签名后将无法再使用。
 -->
    <preference name="appCertificateVerify" value="false" />
<!--
  配置键盘弹出后页面的处理方式。云编译有效。
  resize：弹出键盘时会把页面往上推移，iOS平台resize和auto等效;
  pan：弹出键盘时页面不会被往上推移
  auto：由系统根据输入框位置决定是否页面往上推移
 -->
    <preference name="softInputMode" value="pan"/>
<!-- 第三方插件引入 -->
    <feature name="easeChat">
        <param name="appKey" value="1112190319168050#wuxiandian"/>
    </feature>
    <meta-data name="EASEMOB_APPKEY" value="1112190319168050#wuxiandian"/>


    <feature name="bMap">
      <param name="ios_api_key" value="OUW4uuRYxOgzLKlDFwKMNWqswT6yF4VS" />
    </feature>
    <meta-data name="com.baidu.lbsapi.API_KEY" value="ytW25bm36sdZifNLTBOysU2yCNrvIRjS"/>
<!--
  iOS9中对检测应用是否安装的方法做了限制，只允许检测在Info.plist中配置过的LSApplicationQueriesSchemes字段（即白名单列表）里面的应用。
  所以若代码里面调用了api.appInstalled等方法来检测应用是否安装，那么需要在此字段里面配置被检测应用的URL Scheme才能得到期望的结果。此字段云编译有效。
 -->
      <preference name="querySchemes" value="qqmap,amapuri,baidumap" />
</widget>
```

.html文件示例：
```js
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport"
        content="maximum-scale=1.0,minimum-scale=1.0,user-scalable=0,initial-scale=1.0,width=device-width" />
    <meta name="format-detection" content="telephone=no,email=no,date=no,address=no">
    <title>realbi</title>
    <link rel="stylesheet" type="text/css" href="./css/api.css" />
    <style type="text/css">
        html,
        body {
            height: 100%;
        }
    </style>
</head>

<body class="wrap">
</body>
<script type="text/javascript" src="./script/api.js"></script>
<script type="text/javascript">
    apiready = function () {

        api.setStatusBarStyle({
            style: "dark",
        });

        api.openFrame({
            name: 'main',
            url: 'html/index.html',
            // url: 'http://192.168.1.101:8080',
            useWKWebView: true,
            bounces: false,
            allowEdit: true,
            scrollEnabled:false
        });

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

    };
</script>

</html>
```

### 提交代码
把vue项目build后 的dist文件夹中的文件 替换到html文件夹中

[![p9E6ci6.png](https://s1.ax1x.com/2023/04/21/p9E6ci6.png)](https://imgse.com/i/p9E6ci6)


### 云编译打包apk

[![p9E6gJK.md.png](https://s1.ax1x.com/2023/04/21/p9E6gJK.md.png)](https://imgse.com/i/p9E6gJK)

