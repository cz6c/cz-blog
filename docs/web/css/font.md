对字体进行抗锯齿渲染可以使字体看起来会更清晰舒服。在图标字体成为一种趋势的今天，抗锯齿渲染使用也越来越多。

font-smoothing 是非标准的 CSS 定义。它被列入标准规范的草案中，后由于某些原因从 web 标准中被移除了。

但是，我们可以用以下两种定义进行抗锯齿渲染

> -webkit-font-smoothing: antialiased; /_chrome、safari_/
> -moz-osx-font-smoothing: grayscale;/_firefox_/

1. Webkit 在自己的引擎中支持了这一效果。
   -webkit-font-smoothing 属性值：
   none：对低像素的文本比较好
   subpixel-antialiased：默认值
   antialiased：抗锯齿很好

2. Gecko 也推出了自己的抗锯齿效果的非标定义。
   -moz-osx-font-smoothing 属性值：
   auto:容许选择一个优化的浏览器，字体平滑，一般是 grayscale；
   inherit:继承父元素；
   unset
   grayscale:与灰度反锯齿呈现文本，而不是亚像素，从亚像素渲染转向反锯齿光文本在黑暗的背景使它看起来更轻。
