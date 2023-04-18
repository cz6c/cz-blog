# vue2

目录
[[toc]]

## case

### .sync 修饰符

从 2.3.0 起我们重新引入了 .sync 修饰符，但是这次它只是作为一个编译时的语法糖存在。它会被扩展为一个自动更新父组件属性的 v-on 监听器。
示例代码如下：

```html
<comp :foo.sync="bar"></comp>
```

会被扩展为：

```html
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

当子组件需要更新 foo 的值时，它需要显式地触发一个更新事件：

```js
this.$emit('update:foo', newValue)
```

### 动态绑定 style

声明 css 变量"--bgColor"，把变量”color”赋给“--bgColor”

```html
<div ref="chart-circle" class="chart-circle" :style="{ '--bgColor': color }"></div>
```

在 css 中使用 var 函数 读取“--bgColor”变量

```css
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

### 动态设置背景图片

```js
<div class="page" :style="setBg()"></div>

// data
homeBg=""

// methods
setBg() {
    return { backgroundImage: "url(" + this.homeBg + ")" };
}
```