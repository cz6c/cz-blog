数组扁平

```
// flat(Infinity): 不论数组有多少层都拍成一维数组且不会改变原数组  es6
const arr = [1, [2, 3, [4, 5], 6, [7, [8, [9, [10]]]]]]; // 多维数组
const arr2 = [[1, 2, 3], [4, 5, 6]]; // 二维数组
arr.flat(Infinity); // 结果 [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
arr2.flat(Infinity); // 结果 [1, 2, 3, 4, 5, 6]

// 仅处理二维数组
const arr3 = arr2.reduce((acc , x) => acc.concat(x), []);// 结果 [1, 2, 3, 4, 5, 6]
```

数组去重

```
// Set去重,最优雅但是无法对空对象{}去重  es6
const arr = [1, 1, 2, 6, 9, 6, 2, 3, 4, 3];
const arr1 = Array.from(new Set(arr));// 结果[1, 2, 6, 9, 3, 4]
```

数组排序

```
// 默认排序顺序是根据字符串Unicode码点，英文字母也可排序
const arr = [1, 2, 9, 5, 3, 6, 7];
const arr1 = ["C", "Z", "B", "A", "H", "Y", "Q"];
arr.sort();// 结果[1, 2, 3, 5, 6, 7, 9]
arr1.sort();// 结果['A', 'B', 'C', 'H', 'Q', 'Y', 'Z']

// 排序函数处理对象数组  // b-a倒序  a-b正序
const list=[{num:3,msg:"3"},{num:2,msg:"2"},{num:1,msg:"1"}]
const fn = (key)=>{
  return (a, b) => {
    return b[key] - a[key];
  }
};
arr.sort(fn("num"));// 结果[{num:1,msg:"1"},{num:2,msg:"2"},{num:3,msg:"3"}]

// 简化版 key对象中需要排序的字段
arr.sort((a, b) => {
   return a["key"] - b["key"];
});

// 先排序再翻转数组
arr.sort().reverse();// 结果[9, 7, 6, 5, 3, 2, 1]
```

数组转字符串

```
const arr = ["C", "Z", "B", "A", "H", "Y", "Q"];
const str = arr.join(",");// 结果"C,Z,B,A,H,Y,Q"
const arr1 = str.split(",");// 结果['C', 'Z', 'B', 'A', 'H', 'Y', 'Q']
```

数组分割合并

```
// 合并
const arr1 = [1, 2, 3, 4];
const arr2 = [5, 6, 7, 8];
const arr = arr1.concat(arr2);
// const arr = [...arr1, ...arr2];    es6

// 分割 slice
// 第一个参数=开始下标,
// 第二个参数=结束下标（不包含）
// 理解为从第一个参数下标开始截（第二个参数-第一个参数）个
const arr3 = arr.slice(0, 2);// 结果[1, 2]
const arr4 = arr.slice(2, 6);// 结果 [3, 4, 5, 6]
```

数组元素查找

```
const arr = [1, 2, 3, 4];
const item1 = 3;
const item2 = 6;

// 查简单一维数组
arr.includes(item1);// 结果 true
arr.indexOf(item1);// 结果 2
arr.includes(item2);// 结果 false
arr.indexOf(item2);// 结果 -1

// 查数组对象
findIndex() 方法返回索引
find() 方法返回元素
```

数组增删

```
const arr = [1, 2, 3, 4];
arr.push(5); // 结果 [1,2,3,4,5]

// arr.splice(索引,往右删除数量)    不建议循环中使用，原数组改变后索引也会改变
arr.splice(1,1) // 结果 [1,3,4,5]

// delete arr[索引]   可用于循环中，原数组长度不变索引也不变，循环后把empty过滤掉即可
delete arr[1] // 结果 [1,empty,4,5]
arr.filter(x=>x!==undefined) // 结果 [1,4,5]
```

数组迭代

```
// 原数组中操作
forEach() 方法对数组的每个元素执行一次提供的函数。

// 操作后返回新数组
map() 方法返回一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。
filter() 方法返回一个新数组, 其包含通过所提供函数实现的测试的所有元素。
reduce()  arr.reduce((累加值 , x) => {函数体}, 初始值);

// 判断
some() 方法测试是否至少有一个元素可以通过被提供的函数方法。该方法返回一个Boolean类型的值。
every() 方法检查数组中的每个元素是否通过被提供的函数方法。该方法返回一个Boolean类型的值。
```
