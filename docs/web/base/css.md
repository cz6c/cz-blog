# css

目录
[[toc]]

## 常用css技巧

### 文字垂直排列

```css
-webkit-writing-mode: vertical-rl;
-ms-writing-mode: bt-rl;
writing-mode: vertical-rl;
text-align: center;
```

### 单行省略

```css
text-overflow: ellipsis;
overflow: hidden;
white-space: nowrap;
```

### 多行省略

```css
display: -webkit-box;
word-break: break-all;
text-overflow: ellipsis;
overflow: hidden;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1 ;
```

### 生成随机色

```js
color: "#" + ((Math.random() * 0xffffff) << 0).toString(16)
```

### 画三角形

```css
width: 0px;
height: 0px;
border-bottom: 200px solid #e6e6e6;
border-left: 200px solid transparent;
border-right: 200px solid transparent;
```

### 画梯形

```css
height: 0;
width: 100px;
border-top: 100px solid red;
border-right: 37px solid transparent;
```

### 画平行四边形

```css
width: 18px;
height: 8px;
background-color: #1ac9ff;
transform: skewX(-45deg);//相当于X轴倾斜
```

### 鼠标交互

```css
// 加手
cursor: pointer;
// 禁用
cursor: not-allowed;
```

### css 图片宽高成固定比例

```css
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

### css 动画

```css
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

## 滚动相关

### 滚动条隐藏

```scss
.elem {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### 滚动条样式

```css
//滚动条整体部分
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
  background-color: transparent;
}
//滚动条轨道部分
::-webkit-scrollbar-track {
  background-color: transparent;
}
//滚动条滑块部分
::-webkit-scrollbar-thumb {
  background-image: linear-gradient(135deg, #09f, #3c9);
  border-radius: 6px;
}
```

## 适配相关

### 媒体查询

```css
@media (max-width: 767px) {}
@media (min-width: 768px) and (max-width: 991px) {}
@media (min-width: 992px) and (max-width: 1199px) {}
@media (min-width: 1200px) and (max-width: 1439px) {}
```

### 1920 响应适配函数

```css
@function vm($px) {
    @return ($px / 1920) * 100vw;
}
```

### css 变量 calc 计算高度

```css
calc(100% - #{vm(65)});
```

## css3技巧

### 线性渐变

为了创建一个线性渐变，你必须至少定义两种颜色节点。颜色节点即你想要呈现平稳过渡的颜色。同时，你也可以设置一个起点和一个方向（或一个角度）。

```css
// 默认从上到下的线性渐变：
#grad {
  background-image: linear-gradient(#e66465, #9198e5);
}
// 从左到右的线性渐变：
#grad {
  height: 200px;
  background-image: linear-gradient(to right, red , yellow);
}
// 从左上角到右下角的线性渐变：
#grad {
  height: 200px;
  background-image: linear-gradient(to bottom right, red, yellow);
}
// 带有指定的角度的线性渐变：
#grad {
  background-image: linear-gradient(-90deg, red, yellow);
}
// 带有多个颜色节点的从上到下的线性渐变：
#grad {
  background-image: linear-gradient(red, yellow, green);
}
// 带有彩虹颜色和文本的线性渐变：
#grad {
  background-image: linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet);
}
// repeating-linear-gradient() 函数用于重复线性渐变：
#grad {
  background-image: repeating-linear-gradient(red, yellow 10%, green 20%);
}
```

### 字体抗锯齿

对字体进行抗锯齿渲染可以使字体看起来会更清晰舒服。

`font-smoothing` 是非标准的 CSS 定义。它被列入标准规范的草案中，后由于某些原因从 web 标准中被移除了。

但是，我们可以用以下两种定义进行抗锯齿渲染。

```scss
-webkit-font-smoothing: antialiased; //_chrome、safari_
-moz-osx-font-smoothing: grayscale; //_firefox_
```

1. Webkit 在自己的引擎中支持了这一效果。`-webkit-font-smoothing` 属性值：
   - none：对低像素的文本比较好
   - subpixel-antialiased：默认值
   - antialiased：抗锯齿很好

2. Gecko 也推出了自己的抗锯齿效果的非标定义。`-moz-osx-font-smoothing` 属性值：
   - auto:容许选择一个优化的浏览器，字体平滑，一般是 grayscale；
   - inherit:继承父元素；
   - grayscale:与灰度反锯齿呈现文本，而不是亚像素，从亚像素渲染转向反锯齿光文本在黑暗的背景使它看起来更轻。

