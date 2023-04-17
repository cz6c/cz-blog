动态绑定 style，声明 css 变量"--bgColor"，把变量”color”赋给“--bgColor”

```
<div ref="chart-circle" class="chart-circle" :style="{ '--bgColor': color }"></div>
```

在 css 中使用 var 函数 读取“--bgColor”变量

```
.chart-circle {
  width: 80px;
  height: 80px;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--bgColor);
  }
}
```

动态设置背景图片

```
<div class="page" :style="setBg()"></div>

homeBg=""
setBg() {
    return { backgroundImage: "url(" + this.homeBg + ")" };
}
```
