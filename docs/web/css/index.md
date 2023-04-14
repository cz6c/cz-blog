文字垂直排列

```
-webkit-writing-mode: vertical-rl;
-ms-writing-mode: bt-rl;
writing-mode: vertical-rl;
text-align: center;
```

单行省略

```
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

多行省略

```
display: -webkit-box;
word-break: break-all;
text-overflow: ellipsis;
overflow: hidden;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1 ;
```

生成随机色

```
color: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
```

画三角形

```
width: 0px;
height: 0px;
border-bottom: 200px solid #e6e6e6;
border-left: 200px solid transparent;
border-right: 200px solid transparent;
```

画梯形

```
height: 0;
width: 100px;
border-top: 100px solid red;
border-right: 37px solid transparent;
```

画平行四边形

```
width: 18px;
 height: 8px;
background-color: #1ac9ff;
transform: skewX(-45deg);//相当于X轴倾斜
```

鼠标加手

```
cursor: pointer;
```

1920 响应适配函数

```
@function vm($px) {
    @return ($px / 1920) * 100vw;
}
```

css 变量 calc 计算高度

```
calc(100% - #{vm(65)});
```

css 图片宽高成固定比例

```
.video-wrap {
    width: 100%;
    height: 0;
    padding-bottom: 56%;
    position: relative;
    .video {
        width: 100%;
        height: 100%;
        position: absolute;
    }
}
```

css 动画

```
@keyframes fadeInLeft {
    0% {
        opacity: 0;
        transform: translate3d(-80px, 0, 0);
    }
    to {
        opacity: 1;
        transform: translateZ(0);
    }
    }
    .fade-in-left {
        animation-name: fadeInLeft;//动画名
        animation-duration: 1s;//动画周期
        animation-delay: 0.6s;//动画延时
        animation-fill-mode: forwards;
        animation-timing-function: linear;//动画曲线 匀速
        animation-iteration-count: infinite;//动画次数 无限循环
        opacity: 0;
    }
```
