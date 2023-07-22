# 创建第一个flutter应用

Flutter 是一个用于构建跨平台应用的框架，它使用 Dart 编程语言。要了解 Dart 编程语言与 Javascript 编程语言的异同，请参考文档 [给 JavaScript 开发者的 Dart 编程语言指南](https://dart.cn/guides/language/coming-from/js-to-dart)。

在 Web 和 Flutter 的布局基础条件中， 布局限制、widget 的大小确定和定位 是重要的区别之一。想要了解更多，你可以阅读 [样式书写指南](https://flutter.cn/docs/get-started/flutter-for/web-devs)。

目录
[[toc]]

## 1. 在 Windows 上安装和配置 Flutter 开发环境

[安装和环境配置](https://flutter.cn/docs/get-started/install/windows)

## 2. 创建flutter应用

使用命令行 `ctrl+shift+p` ,选择 `Flutter:New Project` 根据提示创建一个flutter基础项目

### 2.1 目录结构

[![pCuXh7R.png](https://s1.ax1x.com/2023/06/15/pCuXh7R.png)](https://imgse.com/i/pCuXh7R)

在项目开发阶段我们只需要关注lib目录和 `pubspec.yaml` 即可，lib目录下存放我们所有的业务代码，`pubspec.yaml` 则管理着第三方依赖和本地资源。其他的目录只有在应用编译阶段才会进行编辑。

### 2.2 实现 Hello Word Demo

我们删除mian.dart中的代码从0实现一个Hello Word,

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Flutter Demo Home Page'),
        ),
        body: const Center(
          child: Text('Hello Word'),
        ),
      ),
    );
  }
}
```

### 2.3 实现 一个计数器 Demo

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('计数器'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(
                '$_counter',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: _incrementCounter,
          tooltip: 'Increment',
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}
```