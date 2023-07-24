# flex 弹性布局

[[toc]]

## 基本概念

flex 布局对于容器的控制是基于轴这个概念的，而 flex 中的轴分为：主轴、垂直轴、换行轴

- 主轴指的就是元素排列的方向轴，在主轴中`flex-direction`是最重要的属性控制轴的方向，默认是 `row`，设置为 `column` 会把元素垂直去排列。而主轴的另一个属性 `justify-content` 是控制元素在轴上的排列

- 垂直轴就是垂直于主轴的方向轴，我们其实平时用得比较多的就是 `align-items` 控制垂直轴上的元素在轴上的排列

- 换行轴是针对于整个容器。通过 `flex-wrap` 设置为 `wrap` 实现换行，布局换行后，垂直轴的高度只会是当前行高度

## 深入理解 flex 属性

flex 属性是 `flex-grow`, `flex-shrink` 和 `flex-basis` 的简写，默认值为 0 1 auto

我们经常使用的 `flex:1` ，其实是 1 1 0px 的简写，下面我们分别来了解一下这三个属性分别代表什么：

### 1. flex-grow

flex-grow属性在MDN上的定义是：定义弹性盒子项（flex-item）的拉伸因子，默认值0”

我们可以理解为它决定子元素在父容器的主轴方向该如何去拉伸，也就是如何去“瓜分”父容器的剩余空间

下面通过代码理解这段话的意思

```HTML
<div class="container">
    <div class="item a">A</div>
    <div class="item b">B</div>
    <div class="item c">C</div>
</div>

<style>
.container {
    display: flex;
    width: 600px;
    height: 200px;
    background-color: #999;
}
.item {
    height: 100px;
}
.a{
    width: 100px;
    background-color:red;
}
.b{
    width: 150px;
    background-color:blue;
}
.c{
    width: 200px;
    background-color:yellow;
}
</style>
```


父容器的主轴还有这么多剩余空间，子容器有什么办法将这些剩余空间瓜分来实现弹性的效果呢？

这就需要用到flex-grow 属性了，flex-grow  定义子容器的瓜分剩余空间的比例，默认为 0，即如果存在剩余空间，也不会去瓜分。

flex-grow例子，将上面的例子改成如下代码：

```HTML
<div class="container">
    <div class="item a">A</div>
    <div class="item b">B</div>
    <div class="item c">C</div>
</div>

<style>
.container {
  display: flex;
  width: 600px;
  height: 200px;
  background-color: #999;
  text-align: center;
}
.item {
  height: 100px;
}
.a {
  width: 100px;
  background-color: red;
  flex-grow: 1;
}
.b {
  width: 150px;
  background-color: blue;
  flex-grow: 2;
}
.c {
  width: 200px;
  background-color: yellow;
  flex-grow: 3;
}
</style>
```

结果如下：

最初，我们发现，子容器的宽度总和只有 450px，父容器宽度为 600px，那么剩余空间就出现了，为 150px。当设置了 flex-grow 之后， A，B，C三个子容器会根据自身的 flex-grow 去“瓜分”剩余空间。

在这里我们总结为 flex-grow 属性决定了子容器要占用父容器多少剩余空间。

计算方式如下：

- 剩余空间：x
- 假设有三个flex item元素，flex-grow 的值分别为a, b, c
- 每个元素可以分配的剩余空间为：
- a/(a+b+c) * x，b/(a+b+c) * x，c/(a+b+c) * x

以 A 为例子进行说明： A 占比剩余空间：1/(1+2+3) = 1/6，那么 A “瓜分”到的 150*1/6=25，实际宽度为100+25=125。

### 2. flex-shrink

说完 flex-grow，我们知道了子容器设置了 flex-grow 有可能会被拉伸。

如果子容器宽度超过父容器宽度。这时候有两个办法：换行和压缩。由于 flex 默认不换行，那么压缩的话，怎么压缩呢，压缩多少？此时就需要用到 flex-shrink 属性了。

flex-shrink属性在MDN上的定义是：指定了 flex 元素的收缩规则，默认值是 1

此时，剩余空间的概念就转化成了“溢出空间”

计算方式：

- 三个flex item元素的width: w1, w2, w3
- 三个flex item元素的flex-shrink：a, b, c
- 计算总压缩权重：
- sum = a * w1 + b * w2 + c * w3
- 计算每个元素压缩率：
- S1 = a * w1 / sum，S2 =b * w2 / sum，S3 =c * w3 / sum
- 计算每个元素宽度：width - 压缩率 * 溢出空间

举例说明：

```html
<div class="container">
   <div class="item a">
     <p>A</p>
     <p> width:300</p>
     <p>flex-shrink: 1</p>
   </div>
   <div class="item b">
     <p>B</p>
     <p> width:150</p>
     <p>flex-shrink: 2</p>
   </div>
   <div class="item c">
     <p>C</p>
     <p> width:200</p>
     <p>flex-shrink: 3</p>
   </div>
</div>

<style>
.container {
   	display: flex;
   	width: 500px;
   	height: 200px;
   	background-color: #eee;
   	color: #666;
   	text-align:center;
}
.item {
		height: 100px;
}
.item p {
		margin: 0;
}
.a{
   	width: 300px;
   	flex-grow: 1;
   	flex-shrink: 1;
   	background-color:#ff4466;
}
.b{
   	width: 150px;
   	flex-shrink: 2;
   	background-color:#42b983;
}
.c{
   	width: 200px;
   	flex-shrink: 3;
   	background-color:#61dafb;
}
</style>
```

- 子容器宽度总和为650，溢出空间为150
- 总压缩：300 * 1 + 150 * 2 + 200 * 3 = 1200
- A的压缩率：300*1 / 1200 = 0.25
- A的压缩值：150 * 0.25 = 37.5
- A的实际宽度：300 - 37.5 = 262.5

结果如下：

### 3. flex-basis

flex-basis属性在MDN上的定义是：指定了 flex 元素在主轴方向上的初始大小

一旦 flex item 放进 flex 容器，并不能保证能够按照 flex-basis 设置的大小展示。浏览器会根据 flex-basis 计算主轴是否有剩余空间。

既然是跟宽度相关，那么 和 max-width，min-width，width 的大小优先级是怎么样的。

举例说明：

```html
<div class="container">
  <div class="item a">A</div>
  <div class="item b">B</div>
  <div class="item c">C</div>
</div>

<style>
.container {
  display: flex;
  width: 500px;
  height: 200px;
  background-color: #eee;
  text-align: center;
  color: #666;
}
.item {
  height: 100px;
}
.a {
  min-width: 200px;
  flex-basis: 150px;
  width: 100px;
  background-color: #ff4466;
}
.b {
  flex-basis: 150px;
  width: 100px;
  background-color: #42b983;
}
.c {
  width: 100px;
  background-color: #61dafb;
}
</style>
```

结果如下：

上面的例子可以通过最终元素的宽度看出几个属性的优先级关系：max-width/min-width  >  flex-basis  >  width

而大部分场景下我们不希望元素被压缩，所以flex-shrink通常设置为0。

## 总结

flex items 总和超出 flex 容器，会根据 flex-shrink 的设置进行压缩

如果有剩余空间，如果设置 flex-grow，子容器的实际宽度跟 flex-grow 的设置相关。如果没有设置flex-grow，则按照 flex-basis 展示实际宽度