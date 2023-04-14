CSS3 线性渐变

为了创建一个线性渐变，你必须至少定义两种颜色节点。颜色节点即你想要呈现平稳过渡的颜色。同时，你也可以设置一个起点和一个方向（或一个角度）。

```
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
