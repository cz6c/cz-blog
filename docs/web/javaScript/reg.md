```
str.replace("需要替换的字符串"，"新字符串")　//普通替换
str.replace(/正则/g，"新字符串") //正则替换
// 正则加变量
const param = 3;
const reg = new RegExp("^[0-9]+"+param+"[a-z]+$","g"); // /^[0-9]+3[a-z]+$/g
```
