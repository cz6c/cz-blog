# 面经

[[toc]]

## CSS

### 盒模型的理解

盒模型分为标准盒模型和 IE 盒模型，两种模型都是由 `content + padding + border + margin` 构成，大小也都由 `content + padding + border` 决定，

但是模型的宽高计算有所不同：

- 标准盒模型 ：包含 `content`
- IE 盒模型 ：包含 `content + padding + border`

注：可通过 `box-sizing` 来设置，默认是 标准盒模型 `content-box` ，设置 `border-box` 可改变成 IE 盒模型。

### BFC 的理解

块级格式化上下文，可以看做是隔离的独立容器，容器里的元素不会影响外部元素的布局；常见的 BFC 有 `根元素 <html>` 、`浮动的元素` 、`绝对定位元素（position为absolute或者fixed）`、`dispaly 为 inline-block，flex，flow-root，grid`、`overflow值不为 visible的元素`；

| 特性                                                      |                     应用                     |
| --------------------------------------------------------- | :------------------------------------------: |
| BFC中上下相邻的容器 margin 会折叠， 创建新的 BFC 可以避免 |             解决 margin 折叠问题             |
| BFC 在计算高度的时候会把浮动元素也计算进去                | 清除浮动（解决浮动元素的父元素高度塌陷问题） |
| 浮动盒区域不会覆盖在BFC上                                 |             阻止浮动元素覆盖问题             |

### 实现水平垂直居中的方式

- 子元素有宽高

  ```css
  .father {
    position: relative;
  }

  // 第一种
  .childer {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    margin-top: -50px;
    margin-left: -50px;
  }

  // 第二种
  .childer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100px;
    height: 100px;
    margin: auto;
  }
  ```

- 子元素无宽高

  ```css
  // 第一种
  .father {
      position：relative
  }
  .childer {
      position: absolute;
      top: 50%;
      left: 50%;
      transform :translate(-50%,-50%);
  }

  //第二种
  .father {
      display: flex;
      justify-content: center;
      align-items: center;
  }
  ```

### 动画

- css 动画

1. 首先使用关键字 `@keyframes` 加动画 name 定义一个动画
2. 然后从 0-100（）之间定义每个动画帧的 css 样式
3. 最常用的是 `transfrom`属性的各个 css 变换函数 来实现元素的旋转`rotate`，缩放`scale`，倾斜`skew`或平移`translate`、以及透明度 `opacity`
4. 最后在需要动画的元素样式中 使用 `animation-name` 指定动画名字 `animation-timing-fuction` 设置动画的运动曲线 `animation-duration` 设置动画周期 `animation-delay` 设置动画延时 `animation-iteration-count` 设置动画的执行次数

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
  animation-name: fadeInLeft; //动画名
  animation-duration: 1s; //动画周期
  animation-delay: 0.6s; //动画延时
  animation-fill-mode: forwards;
  animation-timing-function: linear; //动画曲线 匀速
  animation-iteration-count: infinite; //动画次数 无限循环
  opacity: 0;
}
```

- web 动画 requestAnimationFrame

```js
const test = document.querySelector<HTMLDivElement>("#test")!;

let i = 0;
let requestId: number;
function animation() {
  test.style.marginLeft = `${i}px`;

  requestId = requestAnimationFrame(animation);

  i++;

  if (i > 200) {
    cancelAnimationFrame(requestId);
  }
}

animation();
```

### CSS 预处理器

sass/less 常用功能：样式嵌套，css 变量，循环语句，条件语句，自动前缀，单位转换

## javaScript

### 数据类型

- `string` 、`number` 、`boolean` 、`null` 、`undefined` 、`Object` 、`symbol` 、`bigint` 八种数据类型；

- 其中 `symbol` 和 `bigint` 是 es6 新增的，`symbol` 代表独一无二的值，`bigint` 可以表示任意大小的整数；

- 值数据类型存放在栈中， 引用数据类型存放在堆中通过内存地址来引用；

### 数据类型判断

- `typeof` 判断所有值类型，函数；

- `instanceof` 判断对象类型，返回一个布尔值；

- `Object.prototype.toString.call()` 可以判断所有类型，返回值为`[object xxx]`；

- `Array.isArray()` 函数用于判断是否为数组

  ```js
  function run() {}
  const a = Symbol("a");
  const b = BigInt(1);
  let c;
  const obj = {};
  const arr = [];

  console.log(typeof "ss"); //string
  console.log(typeof 123); //number
  console.log(typeof true); //boolean
  console.log(typeof run); //function
  console.log(typeof a); //symbol
  console.log(typeof b); //bigint
  console.log(typeof c); //undefined
  console.log(typeof obj); //object
  console.log(typeof arr); //object
  console.log(typeof null); //object

  console.log(obj instanceof Object); //true
  console.log(arr instanceof Object); //true
  console.log(arr instanceof Array); //true
  console.log(run instanceof Function); //true
  console.log(null instanceof Object); //false

  console.log(Object.prototype.toString.call("ss")); //[object String]
  console.log(Object.prototype.toString.call(123)); //[object Number]
  console.log(Object.prototype.toString.call(true)); // [object Boolean]
  console.log(Object.prototype.toString.call(run)); // [object Function]
  console.log(Object.prototype.toString.call(a)); //[object Symbol]
  console.log(Object.prototype.toString.call(b)); //[object BigInt]
  console.log(Object.prototype.toString.call(c)); // [object Undefined]
  console.log(Object.prototype.toString.call(obj)); //[object Object]
  console.log(Object.prototype.toString.call(arr)); //[object Array]
  console.log(Object.prototype.toString.call(null)); // [object Null]

  console.log(Array.isArray(arr)); // true
  ```

### js 小数运算精度丢失

- js 在做数字运算的时会先把值转换成二进制后无线循环，但 js 采用的运算方式最大只能存储 53 位有效数字，后面多出的被截掉就导致精度丢失；

- 解决办法：计算前转整数计算、转字符串计算、引用第三方库 BigNumber

### let/const/var

1.  `let` 和 `const` 都是 ES6 新增的用于创建变量的语法。 `let` 声明的变量是可以更改指针指向（可以重新赋值）。但 `const` 声明的变量是不允许改变指针的指向。

2.  `let` 和 `const` 具有块级作用域，`var` 不存在块级作用域。

3.  `let` 和 `const` 不存在变量提升，在使用 `let` 、`const` 命令声明变量之前，该变量都是不可用的，称为暂时性死区。使用 `var` 声明的变量存在变量提升，不存在暂时性死区。

4.  `var` 声明的变量为全局变量，并且会将该变量添加为全局对象的属性，但是 `let` 和 `const` 不会。

5.  `var` 可以重复声明变量，后声明的同名变量会覆盖之前声明的遍历。`const` 和 `let` 不允许重复声明变量

6.  在变量声明时，`var` 和 `let` 可以不用设置初始值。而 const 声明变量必须设置初始值。

### Set、Map 集合

::: tip Set 对象是值的集合。Set 对象中的值只能出现一次；它在 Set 对象的集合中是独一无二的。
1. `new Set()`
1. `Set.prototype.add()`:如果 Set 对象中没有相同值的元素，则将新元素插入到 Set 对象中。
1. `Set.prototype.has()`:返回一个布尔值，断言 Set 对象中是否存在具有给定值的元素。
1. `Set.prototype.values()`或者`.keys()`:返回一个新的迭代器对象，其中包含 Set 对象中所有的值，并以插入 Set 对象的顺序排列。
1. `Set.prototype.entries()`:返回一个新的迭代器对象，元素以[key, value]形式返回，键与值相同，并以插入 Set 对象的顺序排列。
:::

::: tip Map 对象是键值对的集合。Map 对象中的一个键只能出现一次；它在 Map 对象的集合中是独一无二的。
1. `new Map()`
1. `Map.prototype.get()`:返回与指定的键 key 关联的值，若不存在关联的值，则返回 undefined。
1. `Map.prototype.has()`:返回一个布尔值，用来表明 Map 对象中是否存在与指定的键 key 关联的值。
1. `Map.prototype.set()`:在 Map 对象中设置与指定的键 key 关联的值。
1. `Map.prototype.keys()`:返回一个新的迭代对象，其中包含 Map 对象中所有的键，并以插入 Map 对象的顺序排列。
1. `Map.prototype.values()`:返回一个新的迭代对象，其中包含 Map 对象中所有的值，并以插入 Map 对象的顺序排列。
1. `Map.prototype.entries()`:返回一个新的迭代对象，其为包含 Map 对象中所有键值对[key, value]，并以插入 Map 对象的顺序排列。
:::

### 深拷贝和浅拷贝

对一个对象进行拷贝时，其中基础数据类型拷贝的是值，引用类型其实拷贝的只是它的内存地址，当其中一个对象被改变时就会影响到另一个对象，深拷贝就是将一个对象从内存中完整的拷贝一份出来，从堆内存中开辟一个新的区域来存放新对象，且修改新对象不会影响到原来的对象。

- 实现浅拷贝：

  1. `Object.assign(目标对象，源对象)`
  2. `解构运算符 ...`

- 实现深拷贝：

  1. `JSON.parse(JSON.stringify())`，适配大多数应用场景
  存在缺陷：拷贝循环引用类型会报错；值为函数，undefined，symblo 时，贝

  2. 手动实现深拷贝
   
  ```js
  // 1. 如果不是引用类型直接返回
  // 2. map 集合用来存储循环引用对象的地址，如果该对象被拷贝过直接返回
  // 3. 创建一个新对象，通过for 循环遍历原对象，把对象的值递归处理后一个个赋给新对象的key
  // 4. 创建新对象的时候要考虑数组的情况，如果obj是数组就创建新数组
  /**
   * 深拷贝
   * @param {Object} obj 要拷贝的对象
   * @param {Map} map 用于存储循环引用对象的地址
   */
  function deepClone(obj = {}, map = new Map()) {
    if (typeof obj !== "object") {
      return obj;
    }
    if (map.get(obj)) {
      return map.get(obj);
    }
    // 初始化返回结果
    let result = {};
    if (
      obj instanceof Array ||
      Object.prototype.toString(obj) === "[object Array]"
    ) {
      result = [];
    }
    // 防止循环引用
    map.set(obj, result);
    for (const key in obj) {
      // 保证 key 不是原型属性
      if (obj.hasOwnProperty(key)) {
        // 递归调用
        result[key] = deepClone(obj[key], map);
      }
    }
    // 返回结果
    return result;
  }
  ```

### 原型和原型链

原型：每一个 JavaScript 对象（除了 null）在创建的时候就会关联另一个对象，这个对象就是原型其实就是 `portotype` 对象，每一个对象都会从原型“继承”属性。
比如说有一个构造函数 Person , 它的 prototype 属性就是指向这个构造函数的原型，我在通过 new Person() 定义一个 person1，此时 person1 的--proto--属性也是指向构造函数的原型。

原型链：由相互关联的原型组成的链状结构就是原型链，如图中蓝色线所示。
就以刚刚的例子，person1 的--proto--指向的是 Person 构造函数的原型，然后这个原型的--proto--又指向 Object 的原型，再然后 Object 的原型的--proto--指向 null，这样一层一层往上到顶层形成的就原型链。

![image](https://camo.githubusercontent.com/9a69b0f03116884e80cf566f8542cf014a4dd043fce6ce030d615040461f4e5a/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f6d717971696e6766656e672f426c6f672f496d616765732f70726f746f74797065352e706e67)

### 作用域与作用域链

作用域：指代码中定义变量的区域，确定当前执行代码对变量的访问权限，分为全局作用域，函数作用域，块级作用域。

作用域链：从当前作用域开始一层层往上找某个变量，如果找到全局作用域还没找到就放弃，这种层级关系就是作用域链。

注：因为 JavaScript 采用的是静态作用域，函数的作用域在函数定义的时候就决定了，函数的作用域基于函数创建的位置。

### 执行上下文

当 js 执行一段可执行代码时，会创建对应的执行上下文，每个执行上下文包含以下三个主要属性

  1. `变量对象VO`:（存储上下文中的函数声明和定义的变量，执行阶段变成AO活动对象）
  2. `作用域链`:（父级函数的活动对象加到函数的[[scope]]中，形成作用域链）
  3. `this`: (函数运行时所在的环境)

### 闭包

1.  当父函数被销毁后，返回的子函数依然可以访问父函数中的变量对象（函数作为返回值被父函数返回）
2.  在代码中引用了自由变量（函数作为参数被传递）

    应用场景：防抖、节流

```js
// 实现防抖：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，
// 如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，
// 总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行!
function debounce(fn, wait, immediate) {
  let timer = n;
  return function () {
    let args = arguments;
    let context = t;
    if (immediate && !timer) {
      fn.apply(context, args);

      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  };
}
```

```js
//实现节流：如果你持续触发事件，每隔一段时间，只执行一次
function throttle(fn, wait, immediate) {
  let timer = null;
  let callNow = immedi;
  return function () {
    let context = this,
      args = argume;
    if (callNow) {
      fn.apply(context, args);
      callNow = false;

      if (!timer) {
        timer = setTimeout(() => {
          fn.apply(context, args);
          timer = null;
        }, wait);
      }
    }
  };
}
```

### call、apply、bind

`call`、`apply` 、`bind` 方法都是改变某个函数运行时的上下文（context）而存在的，也就是为了改变函数体内部 this 的指向。

`bind` 是返回对应函数，便于稍后调用；`apply` 、`call` 则是立即调用。

- `call`: `fn.call(target, 1, 2)`
- `apply`: `fn.apply(target, [1, 2])`
- `bind`: `fn.bind(target)(1,2)`

  ```javascript
  var obj = {
      value: "vortesnail",
  };

  function fn() {
    console.log(this.value);
  }
  function fn1(a,b) {
    console.log(`${this.value}${a+b}`);
  }

  fn.call(obj); // vortesnail
  fn.apply(obj); // vortesnail
  fn.bind(obj)(); // vortesnail

  fn1.call(obj，1，2); // vortesnail3
  fn1.apply(obj，[1,2]); // vortesnail3
  fn1.bind(obj)(1,2); // vortesnail3
  ```

### this 指向

- 方法调用: `this` 总是指向调用它所在方法的对象，`this` 的指向与所在方法的调用位置有关，与方法的声明位置无关（箭头函数特殊），调用方法没有明确对象时，`this` 指向 `window`，如 setTimeout、匿名函数等

- 构造函数调用: `this` 指向被构造的对象

- `apply`、`call`、`bind` 调用: `this` 指向第一个参数（箭头函数特殊）

- 严格模式: 如果 `this` 没有被执行环境（execution context）定义，那 `this`为`undefined`；

### 箭头函数

- 箭头函数没有自己的 `this`，它只会在自己作用域的上一层继承`this`，箭头函数在声明的时候绑定 `this`，而非取决于调用位置

- 箭头函数继承来的 `this` 指向不会被修改，所有` call`、`apply`、`bind`方法无效

- 箭头函数不能是作为构造函数，也没有原型

- 箭头函数没有 `arguments` 伪数组对象

### Event loop , 宏任务，微任务

js 是一门单线程语言，任务分为同步任务和异步任务，然后异步任务又分为宏任务和微任务，首先脚本代码作为一次宏任务执行，执行过程中同步代码直接执行，宏任务进入宏任务队列，微任务进入微任务队列，当宏任务执行完出队，检查微任务列表，有则依次执行，一直循环，直到全部执行完成。

宏任务：`script` 整体代码、`setTimeout`、`setInterval` 、`setImmediate`

微任务： `process.nextTick` , `Promise.then()`

![image](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/21/15fdcea13361a1ec~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.awebp)

### Promise、async/await

`promise` 承诺在过一段时间后返回一个结果，`new promise` 时，需要传入一个回调函数，这个函数是立即执行的，这个函数有两个参数回调函数 `reslove` 和 `reject`。

- `promise` 的状态分为等待中，成功，失败，状态从等待中状态变为其他状态后，就不会在改变
- 当执行 `reslove` 函数，会回调 `promise` 对象的 `.then` 函数，当执行 `reject` 函数，会回调 `promise` 对象的 `.catche` 函数
- `promise.all()`：等所有执行完成并成功，返回结果数组
- `promise.race()`：谁第一个执行完成，不管结果成功失败，返回该结果
- `promise.any()`：谁第一个执行结果为成功，返回该结果
- `promise.allSettled()`：返回所有结果的状态数组

`async` 关键字用于声明一个函数是异步的，这个函数默认返回一个 `promise`，在异步函数中可以使用 `await` 关键字，使用 `await` 关键字可以让异步代码向同步代码一样书写，`await` 会阻塞代码的执行

### ts / js 的区别

1.  `ts` 是 `js` 的超集，即你可以在 `ts` 中使用原生 `js` 语法。
2.  `ts` 需要静态编译，它提供了强类型与更多面向对象的内容。
3.  `ts` 最终仍要编译为弱类型，基于对象的原生的 `js`，再运行。

### 垃圾回收机制

- 标记清除：标记阶段为所有活动对象进行标记，清除阶段则把没有标记的对象销毁
  缺点：内存碎片化，分配速度慢
- 引用计数：对象有没有其他对象引用，有几个记几个，引用为 0 的对象将被回收
  缺点：需要一个计数器消耗内存空间大，解决不了循环引用的问题

  注：V8 的回收机制是基于标记清除算法，标记结束后，算法会把所有活动对象向内存的一端移动，最后清理边界的内存

## web 浏览器

### 输入 url 浏览器做了什么

1.  解析初协议，主机，端口，路径等信息，构造一个`http`请求
2.  `DNS`域名解析
3.  `TCP`链接，（三次握手，因为 TCP 的特性就是稳定可靠的传输，第一次握手确认客户端是否具有发送能力，第二次握手确认服务端是否具有发送和接收能力，第三次握手确认客户端是否具有接收能力）
4.  `http`请求
5.  服务端处理请求并返回报文
6.  浏览器渲染页面（先是预解析`html`、`css`、`js`文件，生成`dom`和`css`树，然后通过生成`dom`和`css`树会构造一个`render`渲染树，最后进行重排和重绘操作）
7.  `TCP`断开（四次挥手）

### dom 树是怎么生成的

浏览器是多进程架构，网络进程负责根据 content-type 创建渲染进程，渲染进程负责页面的渲染和 js 脚本的执行，而在渲染进程中有一个 HTML 解析器，用类似 stream 流管道那种接字节流将它解析为 dom"，解析时，我觉得可以对标现在的各种转移编译工具，都有一个词法分析、语法分析、transfrom、genoretor 的流程”

### 渲染进程

主线程、GUI 渲染线程、事件触发线程、定时器触发线程、http 线程，主线程和 GUI 是互斥的、js 执行太长会造成页面渲染卡顿，但现在有很多解决方案，比如：在 react 中的调度器预留的 5ms 空闲时间、web worker 之类的。然后是事件触发线程和定时器线程都是在任务队列去做 Loop”

### 存储

- `cookie` 大小 4kb，可设置过期时间，http 请求时需要发送到服务器，增加请求数量，`localStorage`、`sessionStorage`大小都是 5M，不会随 http 请求发送到服务器

- `localStorage` 数据永久存储，除非代码删除或手动删除

- `sessionStorage` 数据只存在当前会话，浏览器关闭就清空

### http 常见状态码

- 200：成功
- 204：请求成功但是没有返回任何内容
- 301：永久重定向
- 302：临时重定向
- 304：资源未被修改
- 400：请求参数语法错误
- 401：用户没有身份认证
- 403：没有资源访问权限
- 404：资源未找到
- 500：服务器错误
- 504：网关错误

### http 缓存

- 强制缓存：浏览器判断缓存是否过期，未过期直接使用强缓存
  Cache-Control ： no-store, no-cache ，max-age
- 协商缓存：缓存过期使用协商缓存
  - last-Modefied 资源最后的修改时间
  - Etag 服务端资源唯一标识

![image](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b74c746d1459403382fd0bbc1d96aeca~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

### http / https 的区别

1.  加密： `HTTPS` 是 `HTTP` 协议的更加安全的版本，通过使用 `SSL/TLS` 进行加密传输的数据；

2.  连接方式： `HTTP`（三次握手）和 `HTTPS` （三次握手+数字证书）连接方式不一样；

3.  端口： `HTTP` 默认的端口是 `80` ， `HTTPS` 默认端口是 `443`

### Get / Post 请求的区别

1.  缓存：`get` 请求会被浏览器主动缓存下来，`post` 不会

2.  编码：`get` 只能进行 url 编码，`post` 没有限制

3.  参数：`get` 参数放在 url 上，`post` 参数放在请求体中，适合传递敏感信息

4.  幂等性：`get` 是幂等的，`post`不是

### 文件上传下载

- 上传流程：

  1. 设置`form`的`enctype`属性（也就是请求头的`Content-type`属性）为`multiparform-data`
  2. 输入框`change事件`获取到文件流
  3. `formData=new FormDate`对象
  4. `formData.append('file', file)`
  5. 请求接口

- 下载流程：

  1. 请求拦截中设置：`config.responseType = "blob"`;
  2. 获取到blob文件流
  3. 创建a标签下载

### websocket

一个持久化协议，基于 http，长轮询

- `new WebSocket(url)` ：初始化
- `ws.onerror = fn` ：监听处理连接失败
- `ws.onclose = fn` ：监听处理连接关闭
- `ws.onopen = fn` ：监听处理连接打开
- `ws.onmessage = fn` ：监听处理信息
- `ws.send()` ：发送信息

### 重绘和回流

- 重绘：元素样式发生改变不影响布局时，浏览器就回触发重绘对元素进行更新，只需要 ui 层面的重新像素绘制，消耗较小

- 回流：元素的尺寸，结构发生变化或者使用某些属性时，浏览器重新渲染页面就是回流，回流需要重新计算页面布局，回流必定触发重绘，重绘不一定触发回流

  触发回流的操作：
  1. 页面初次渲染
  2. 浏览器窗口大小改变
  3. 元素尺寸、位置、内容发生改变
  4. 元素字体大小变化
  5. 添加或者删除可见的 dom 元素
  6. 激活 CSS 伪类（例如：:hover）
  7. 查询某些属性或调用某些方法：基本都是查询视口宽高，滚动相关的api
    clientWidth、clientHeight、clientTop、clientLeft
    offsetWidth、offsetHeight、offsetTop、offsetLeft
    scrollWidth、scrollHeight、scrollTop、scrollLeft
    getComputedStyle()
    getBoundingClientRect()
    scrollTo()

### hash / history 模式

- `hash` 模式：把前端路由的路径用 `#` 拼接在真实 `url` 后面，当 `#` 后面的路径发生改变时，并没有真正的改变浏览器`url`，而是触发 `onhashchange` 事件，不利于`SEO`

- `history` 模式：地址没有 `#` ，更改前端路由就是更新浏览器的`url`，借助`history.pushState()` 和 `history.replaceState()` 实现页面的无刷新跳转，刷新浏览器会重新发起请求，如果服务端没有配置当前`url`就会出现 `404`，需要在 `nginx` 配置 所有找不到的路径都是指向 `index.html`

  使用场景，`B端`一般使用 `hash` 模式，`C端`推荐使用 `history` 模式

### 跨域

- 同源策略：协议，域名，端口号一致才能访问

- 解决跨域： 
  1. 开发环境：webpack 设置代理 proxy 
  2. 服务端设置 CORS 既 Access-Control-Allow-Origin：\*
  3. nginx 设置代理
  4. websocket
  5. jsonp：利用&lt;script&gt;标签没有跨域限制，只支持 get

### 网络安全

1.  XSS: 注入恶意脚本，获取受害者用户信息，将受害者诱导到攻击者控制的网站，进行恶意操作

  - HttpOnly 防止劫取 Cookie，防止攻击者获取到用户信息后，进行的下一步攻击
  - 用户的输入检查，转义页面上的输入内容
  - 服务端的输出检查，如富文本内容使用第三方库进行校验

2.  CSRF: 跨站请求伪造，攻击者借助 （并不是获取）受害者的 Cookie 骗取服务器信任，通过请求接口进行修改数据库的恶意操作

  - 验证码
  - 后端验证请求头部 headers.referer 的值是否在域名白名单内，不是就拦截
  - 校验 token，token 设置在 headers 中不在 Cookie 中，攻击者伪造不了

3.  SQL 注入

## Vue

### 数据响应原理

数据响应的实现由两部分构成：观察者和依赖收集器，核心 api 是 `Object.defineProperty`，它可以重写属性的`get`和`set`方法，`get`用于依赖收集，`set`用于派发更新。vue3 使用的是 `proxy`，

`defineProperty` 和 `proxy`的区别：

1.  `proxy`可以监听数组，`defineProperty`不可以，所有 vue2 是通过重写数组方法实现响应的
2.  `proxy`直接劫持整个对象，不需要深度遍历监听

### vue 的优点

1.  渐进式框架：可以在任何项目中引入
2.  轻量级：大小只有几十 kb
3.  双向数据绑定：在数据操作方面更为简单
4.  组件化：实现逻辑的封装和复用
5.  数据驱动 MVVM：更改数据视图自动更新

### 虚拟 dom

因为浏览器操作`真实dom`的代价比较昂贵，频繁的操作会产生性能问题，所以就有了`虚拟dom`

`虚拟dom` 是 `dom` 节点在`js`中的一种抽象数据结构，其作用就是在每一次响应式数据发生变化时，对比更新前、后的`虚拟dom`，匹配出尽可能少的需要更新的`真实dom`，从而提升性能

1.  用 `JavaScript` 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
2.  `diff` 算法 — 比较两棵虚拟 DOM 树的差异；
3.  `pach` 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

![image](https://file.shenfq.com/ipic/2020-08-19-032238.jpg)

### wacth / computed 的区别

`computed` 计算属性：依赖其他的属性值，会返回一个计算值，并且有缓存，只有依赖的属性值发生改变时，在下一次获取值时才会去重新计算返回值

`wacth` 监听器：用于对某些数据的监听，当监听的数据发生改变时就会执行回调进行后续的操作，它没有缓存，支持复杂的异步处理

### 组件传值的方式

1.  父传子：`pros`，`ref/$refs` --> `defineProps`
2.  子传父：`emit`，`$parent` --> `defineEmits`、`defineExpose`
3.  `eventbus` --> `mitt.js`
4.  依赖注入：`provide`，`inject`
5.  `vuex`/`pinia`

### v-show 和 v-if 有什么区别

1.  手段：`v-if` 是动态的添加或者删除 DOM 元素；`v-show` 是通过设置 DOM 元素的 `display` 样式属性控制显隐；

2.  编译过程：`v-if`切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；`v-show` 只是简单的基于 css 切换；

3.  编译条件：`v-if`是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; `v-show`是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且 DOM 元素保留；

4.  性能消耗：`v-if` 有更高的切换消耗；`v-show` 有更高的初始渲染消耗；

5.  使用场景：`v-if` 适合条件不大可能改变；`v-show` 适合频繁切换。

### 对 vue3 的了解

1.  响应式原理的改变；vue2 是通过`defineproperty`，vue3 是通过`proxy`
2.  性能更强
3.  更好的支持`ts`
4.  使用 `Composition API + setup`，使代码逻辑更清晰，更有利于复用

### vue 自定义指令

::: tip 在 Vue 2 中，自定义指令通过使用下列钩子来创建，以对齐元素的生命周期，它们都是可选的：
- bind - 指令绑定到元素后调用。只调用一次。
- inserted - 元素插入父 DOM 后调用。
- update - 当元素更新，但子元素尚未更新时，将调用此钩子。
- componentUpdated - 一旦组件和子级被更新，就会调用这个钩子。
- unbind - 一旦指令被移除，就会调用这个钩子。也只调用一次。
:::

```js
//html
<p v-highlight="'yellow'">以亮黄色高亮显示此文本</p>;
//js
Vue.directive("highlight", {
  bind(el, binding, vnode) {
    //在 Vue 2 中，必须通过 vnode 参数访问组件实例：

  const vm = vnode.context
    el.style.background = binding.value;
  },
});
```

::: tip 在 Vue 3 中，我们为自定义指令创建了一个更具凝聚力的 API。正如你所看到的，它们与我们的组件生命周期方法有很大的不同，即使钩子的目标事件十分相似。我们现在把它们统一起来了：
- created - 新增！在元素的 attribute 或事件监听器被应用之前调用。
- bind → beforeMount
- inserted → mounted
- beforeUpdate：新增！在元素本身被更新之前调用，与组件的生命周期钩子十分相似。
- update → 移除！该钩子与 updated 有太多相似之处，因此它是多余的。请改用 updated。
- componentUpdated → updated
- beforeUnmount：新增！与组件的生命周期钩子类似，它将在元素被卸载之前调用。
- unbind -> unmounted
:::



```js
// html
<p v-highlight="'yellow'">以亮黄色高亮显示此文本</p>;
// js
const app = Vue.createApp({});
app.directive("highlight", {
  beforeMount(el, binding, vnode) {
    el.style.background = binding.value;
  },
 // 在 Vue 3 中，实例现在是 binding 参数的一部分：
  mounted(el, binding, vnode) {
  const vm = binding.instance
}
});
```

## 项目

### 前端工程化

前端工程化，简而言之就是软件工程 + 前端，以自动化的形式呈现。就个人理解而言：前端工程化，从开发阶段到代码发布生产环境，包含了以下几个内容：

- 开发
- 构建
- 测试
- 部署
- 性能
- 规范

### webpack

`webpack`是一个打包工具，主要作用：模块打包，编译兼容，能力扩展

- 打包流程

  1. 读取 webpack 配置参数
  2. 创建 compiler 对象，挂载所有配置的 Plugin ，执行对象的 run 方法 开始编译
  3. 根据配置中的设置 entry 找到所有入口，从入口文件开始编译，调用配置中所有的 Loader 对模块进行转换，并找到其导入的依赖模块，递归遍历解析，形成依赖关系树
  4. 将编译后的模块 组合成代码块 chunk，再将 chunk 转换为文件，输出到指定的文件中

- `Loader`: 负责文件转换，本质就是一个函数，以转换后的内容为入参在函数中进行进一步处理，返回转换后的结果

  - babel-loader：把 es6 转 es5
  - ts-loader：把 ts 转 js
  - sass-loader：把 scss 代码转为 css 代码
  - css-loader：加载 css
  - style-loader：把 css 代码注入到 js 中，通过 dom 操作去加载 css
  - vue-loader：加载.vue 组件

- `Plugin`: 负责功能扩展，本质就是类，在类中有一个 apply 方法，进行插件挂载时，就会执行这个方法，在这个方法中监听 webpack 运行生命周期提供的钩子，并在合适的时机通过它提供的 api 改变输出的结果

  - ignore-plugin：忽略部分文件
  - html-webpack-plugin：压缩 html 文件
  - terser-webpack-plugin：压缩 js 代码
  - clean-webpack-plugin：每次打包前清空输出文件夹
  - webpack-bundle-analyzer：可视化 webpack 输出文件的体积

- webpack 热更新原理

  首先启动 devServer 的时候，webpack-dev-server 服务端与浏览器之间维护了一个 websocket，在 webpack 的 watch 模式下，文件发生改变后，webpack 重新编译打包，保存在内存中，服务端会将新模块的 hash 值发送给浏览器，浏览器接受到 hash 值，调用 HMR.runtimed 的方法通过 jsonp.runtime 的 api 向服务端发送 ajax 请求，返回一个包含所有要更新模块的 hash 值的 josn，然后在通过 jsonp 请求，获取最新的模块代 。

### nginx

- 反向代理，负载均衡

- 配置流程：

  1. 官网下载，解压
  2. 启动cmd：输入nginx 启动服务，访问本地80端口可以看到 nginx 的默认启动页
  3. 把项目打包好的文件放在：html 文件下
  4. nginx -s  reload 热重启服务

  配置反向代理：server 下的 location 下的 proxy_pass

### 性能优化

- 白屏问题：加 loading，骨架屏

- 防抖和节流

- 路由懒加载

- 图片懒加载

- 图片压缩

- 减少重绘和回流：使用 js 修改样式时，使用 class 来修改；减少 dom 操作，元素隐藏后再操作

- 事件委托：将元素的事件委托给它的父级或者更外级的元素处理，它的实现机制就是事件冒泡

- ui 库按需引入

- 使用 http 缓存，http2, https

- 构建方面：

  - 压缩代码文件，在 webpack 中使用 terser-webpack-plugin 压缩 Javascript 代码；使用 css-minimizer-webpack-plugin 压缩 CSS 代码；使用 html-webpack-plugin 压缩 html 代码。
  - 开启 gzip 压缩，webpack 中使用 compression-webpack-plugin ，node 作为服务器也要开启，使用 compression。
  - 常用的第三方库使用 CDN 服务，在 webpack 中我们要配置 externals，将比如 React， Vue 这种包不打倒最终生成的文件中。而是采用 CDN 服务。

## 常见手写和算法

### 冒泡排序

- 思路流程：从数组最左端开始向右遍历，依次对比相邻元素大小，若 左元素 > 右元素则将它俩交换，最终可将最大元素移动至数组最右端。完成此次冒泡操作后，数组最大元素已在正确位置，接下来只需排序剩余`n-1`个元素，依次循环。

```js
const array = [3, 2, 5, 1, 4];
for (let i = 0; i < array.length - 1; i++) {
  for (let j = 0; j < array.length - i - 1; j++) {
    if (array[j] < array[j + 1]) {
      const temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
    }
  }
}
console.log(array); //[1, 2, 3, 4, 5]
```

- 算法优化：若在某轮「冒泡」中未执行任何交换操作，则说明数组已经完成排序，可直接返回结果。考虑可以增加一个标志位 flag 来监听该情况，若出现则直接返回。

```js
const array = [3, 2, 5, 1, 4];
for (let i = 0; i < array.length - 1; i++) {
  let flag = false;
  for (let j = 0; j < array.length - i - 1; j++) {
    if (array[j] < array[j + 1]) {
      const temp = array[j];
      array[j] = array[j + 1];
      array[j + 1] = temp;
      flag = true;
    }
  }
  if (!flag) break;
}
console.log(array); //[1, 2, 3, 4, 5]
```

### 数组去重

- 利用 Set 集合值唯一的特性去重

```js
const arr = [1, 6, 12, 1, 12];
const newArr = [...new Set(arr)];
console.log(newArr); //[1,6,12]
```

- 利用数组遍历去重

```js
// includes
const arr = [1, 6, 12, 1, 12];
const newArr = [];
arr.forEach((x) => {
  if (!newArr.includes(x)) {
    newArr.push(x);
  }
});
console.log(newArr); //[1,6,12]

// indexOf
const arr = [1, 6, 12, 1, 12];
const newArr = arr.filter((x, i, arr) => arr.indexOf(x) === i);
console.log(newArr); //[1,6,12]
```

### 数组扁平化

- `.flat(depth)` 返回一个扁平后的新数组，depth 指定要提取嵌套数组的结构深度，默认值为 1

```js
const arr1 = [1, 2, [3, 4]];
console.log(arr1.flat()); // [1, 2, 3, 4]

const arr2 = [1, 2, [3, 4, [5, 6]]];
console.log(arr2.flat()); // [1, 2, 3, 4, [5, 6]]

const arr3 = [1, 2, [3, 4, [5, 6]]];
console.log(arr3.flat()); // [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
const arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
console.log(arr4.flat(Infinity)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- 利用 `reduce` 扁平二维数组

```js
const arr = [1, 2, [3, 4]];
const newArr = arr.reduce((pre, cur) => {
  return (pre = pre.concat(cur));
}, []);
console.log(newArr); //[1, 2, 3, 4];
```

- 利用 `reduce` 实现 `flat` 方法

```js
const arr = [1, 2, [3, [4]]];
function flat(arr, depth = 1) {
  if (depth > 0) {
    return arr.reduce((pre, cur) => {
      return (pre = pre.concat(
        Array.isArray(cur) ? flat(cur, depth - 1) : cur
      ));
    }, []);
  }
  return arr;
}
console.log(flat(arr, 2)); //[1, 2, 3, 4];
```

### 实现 `instanceof`

```js
function myInstanceof(target, origin) {
  if (target === null) return false;
  let proto = Object.getPrototypeOf(target); // 相当于 proto = target.__proto__;
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
const arr = [];
const obj = {};
function fn() {}
console.log(myInstanceof(arr, Array)); //true
console.log(myInstanceof(arr, Object)); //true
console.log(myInstanceof(obj, Object)); //true
console.log(myInstanceof(fn, Function)); //true
console.log(myInstanceof(null, Object)); //false
console.log(arr instanceof Array); //true
console.log(arr instanceof Object); //true
console.log(obj instanceof Object); //true
console.log(fn instanceof Function); //true
console.log(null instanceof Object); //false
```

## 微信小程序

### 简单描述下微信小程序的相关文件类型?

微信小程序项目结构主要有四个文件类型

- WXML（WeiXin Markup Language）是框架设计的一套标签语言，结合基础组件、事件系统，可以构建出页面的结构。内部主要是微信自己定义的一套组件
- WXSS (WeiXin Style Sheets)是一套样式语言，用于描述 WXML 的组件样式
- js 逻辑处理，网络请求
- json 小程序设置，如页面注册，页面标题及tabBar

主要文件

- app.json 必须要有这个文件，如果没有这个文件，项目无法运行，因为微信框架把这个作为配置文件入口，整个小程序的全局配置。包括页面注册，网络设置，以及小程序的 window 背景色，配置导航条样式，配置默认标题
- app.js 必须要有这个文件，没有也是会报错！但是这个文件创建一下就行 什么都不需要写以后我们可以在这个文件中监听并处理小程序的生命周期函数、声明全局变量
app.wxss 可选

### 小程序的双向绑定和vue哪里不一样?

小程序直接 this.data 的属性是不可以同步到视图的，必须调用：

```js
this.setData({
    // 这里设置
})
```

### 小程序页面间有哪些传递数据的方法?

- 使用全局变量实现数据传递
在 app.js 文件中定义全局变量 globalData， 将需要存储的信息存放在里面
使用的时候，直接使用 getApp() 拿到存储的信息

```js
// app.js
App({
     // 全局变量
  globalData: {
    userInfo: null
  }
})
```

- 使用 wx.navigateTo 与 wx.redirectTo 的时候，可以将部分数据放在 url 里面，并在新页面 onLoad 的时候初始化，
需要注意的问题：wx.navigateTo 和 wx.redirectTo 不允许跳转到 tab 所包含的页面
onLoad 只执行一次

```js
// Navigate
wx.navigateTo({
  url: '../pageD/pageD?name=raymond&gender=male',
})

// Redirect
wx.redirectTo({
  url: '../pageD/pageD?name=raymond&gender=male',
})

// pageB.js
Page({
  onLoad: function(option){
    console.log(option.name + 'is' + option.gender)
    this.setData({
      option: option
    })
  }
})
```

- 使用本地缓存 Storage 相关

### 小程序的生命周期函数

- onLoad 页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数
- onShow() 页面显示/切入前台时触发
- onReady() 页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互
- onHide() 页面隐藏/切入后台时触发。 如 navigateTo 或底部 tab 切换到其他页面，小程序切入后台等
- onUnload() 页面卸载时触发。如 redirectTo 或 navigateBack 到其他页面时

### 微信小程序的优劣势

- 优势
即用即走，不用安装，省流量，省安装时间，不占用桌面
依托微信流量，天生推广传播优势
开发成本比 App 低

- 缺点
用户留存，即用即走是优势，也存在一些问题
入口相对传统 App 要深很多
限制较多,页面大小不能超过2M。不能打开超过10个层级的页面

### 如何实现下拉刷新

首先在全局 config 中的 window 配置 enablePullDownRefresh
在 Page 中定义 onPullDownRefresh 钩子函数,到达下拉刷新条件后，该钩子函数执行，发起请求方法
请求返回后，调用 wx.stopPullDownRefresh 停止下拉刷新

### bindtap和catchtap的区别是什么?

- 相同点：首先他们都是作为点击事件函数，就是点击时触发。在这个作用上他们是一样的，可以不做区分
- 不同点：他们的不同点主要是bindtap是不会阻止冒泡事件的，catchtap是阻值冒泡的

### 简述下 wx.navigateTo(), wx.redirectTo(), wx.switchTab(), wx.navigateBack(), wx.reLaunch()的区别?

- wx.navigateTo()：保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
- wx.redirectTo()：关闭当前页面，跳转到新的页面（类似重定向）。但是不允许跳转到 tabbar 页面
- wx.switchTab()：跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
- wx.navigateBack():关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层
- wx.reLaunch()：关闭所有页面，打开到应用内的某个页面

### 登录流程

登录流程是调wx.login获取code传给后台服务器获取微信用户唯一标识openid及本次登录的会话密钥（session_key）等）。

拿到开发者服务器传回来的会话密钥（session_key）之后，前端要保存wx.setStorageSync('sessionKey', 'value')

持久登录状态：session信息存放在cookie中以请求头的方式带回给服务端，放到request.js里的wx.request的header里

### 常用指令
wx:for、 wx:if

### 小程序分包

- 使用分包：通过在 app.json subpackages 字段声明项目分包结构：

```json
{
  "pages":[
    "pages/index",
    "pages/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat",
        "pages/dog"
      ]
    }, {
      "root": "packageB",
      "name": "pack2",//分包别名，分包预下载时可以使用
      // 分包页面路径，相对于分包根目录
      "pages": [
        "pages/apple",
        "pages/banana"
      ]
    }
  ]
}
```
independent	Boolean	分包是否是独立分包

打包原则
声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到主包中
主包也可以有自己的 pages，即最外层的 pages 字段。subpackage 的根目录不能是另外一个 subpackage 内的子目录
tabBar 页面必须在主包内

引用原则
packageA 无法 require packageB JS 文件，但可以 require 主包、packageA 内的 JS 文件；使用 分包异步化 时不受此条限制
packageA 无法 import packageB 的 template，但可以 require 主包、packageA 内的 template
packageA 无法使用 packageB 的资源，但可以使用主包、packageA 内的资源

- 分包预下载：预下载分包行为在进入某个页面时触发，通过在 app.json 增加 preloadRule 配置来控制。

开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。对于独立分包，也可以预下载主包。

vConsole 里有preloadSubpackages开头的日志信息，可以用来验证预下载的情况。

```json
{
  "pages": ["pages/index"],
  "subpackages": [
    {
      "root": "important",
      "pages": ["index"],
    },
    {
      "root": "sub1",
      "pages": ["index"],
    },
    {
      "name": "hello",
      "root": "path/to",
      "pages": ["index"]
    },
    {
      "root": "sub3",
      "pages": ["index"]
    },
    {
      "root": "indep",
      "pages": ["index"],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index": {
      "network": "all", //在指定网络下预下载，可选值为：all: 不限网络wifi: 仅wifi下预下载
      "packages": ["important"]
    },
    "sub1/index": {
      "packages": ["hello", "sub3"]
    },
    "sub3/index": {
      "packages": ["path/to"]
    },
    "indep/index": {
      "packages": ["__APP__"] // 进入页面后预下载分包的 root 或 name，__APP__ 代表主包
    }
  }
}
```

preloadRule 中，key 是页面路径，value 是进入此页面的预下载配置

限制
同一个分包中的页面享有共同的预下载大小限额 2M，限额会在工具中打包时校验。
如，页面 A 和 B 都在同一个分包中，A 中预下载总大小 0.5M 的分包，B中最多只能预下载总大小 1.5M 的分包。

- 独立分包 independent字段声明，独立分包中不能依赖主包和其他分包中的内容

独立分包是小程序中一种特殊类型的分包，可以独立于主包和其他分包运行。从独立分包中页面进入小程序时，不需要下载主包。当用户进入普通分包或主包内页面时，主包才会被下载。

开发者可以按需将某些具有一定功能独立性的页面配置到独立分包中。当小程序从普通的分包页面启动时，需要首先下载主包；而独立分包不依赖主包即可运行，可以很大程度上提升分包页面的启动速度。

- 分包异步化

在小程序中，不同的分包对应不同的下载单元；因此，除了非独立分包可以依赖主包外，分包之间不能互相使用自定义组件或进行 require。「分包异步化」特性将允许通过一些配置和新的接口，使部分跨分包的内容可以等待下载后异步使用，从而一定程度上解决这个限制。

## 其他

### 你还有什么想要问我的么

- 技术团队有几个人，几个前端，几个后端，
- 高级，中级，初级的分别是多少人然后就是技术栈
- 目前在使用什么技术栈，将来打算使用什么技术栈
- 自己是否可以决定未来技术栈的走向然后是自己在团队中的角色
- 负责什么工作
- 薪资，福利，假期
