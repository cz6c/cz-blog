# Getx

GetX 是 Flutter 上的一个轻量且强大的解决方案：高性能的状态管理、智能的依赖注入和便捷的路由管理。并且把逻辑代码和视图进行了分离，

目录
[[toc]]

## 1. 安装
将 Get 添加到你的 pubspec.yaml 文件中。

```yaml
dependencies:
  get: ^4.6.5
```

在需要用到的文件中导入，它将被使用。

```dart
import 'package:get/get.dart';
```

## 2. getx的三大功能

### 2.1 状态管理，

体验GetX的状态管理，基于GetX重写之前实现的计数器，

创建你的业务逻辑类，并将所有的变量，方法和控制器放在里面。 你可以使用一个简单的".obs "使任何变量成为可观察的。

controller.dart
```dart
class Controller extends GetxController{
  var count = 0.obs;
  increment() => count++;
}
```

在视图上我们想响应性的使用控制器中可观察的变量，需要使用 Obx(() =>Widget) 来包裹Widget。

main.dart
```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import './controller.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final Controller c = Get.put(Controller());
    return GetMaterialApp(
      title: 'Flutter Demo',
      home: Scaffold(
        appBar: AppBar(
          title: const Text('计数器'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Obx(
                () => Text(
                  '${c.count}',
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: c.increment(),
          tooltip: 'Increment',
          child: const Icon(Icons.add),
        ),
      ),
    );
  }
}
```

### 2.2 依赖管理

GetX 依赖管理可以注入任意类型的实例，并提供了多种依赖插入/注册方式。

插入依赖后，你只需要让Get为你自动 "寻找"控制器，你不需要任何额外的依赖关系。

```dart
final controller = Get.find<CounterController>();
```

####  2.2.1 `Get.put()`：最常见的插入依赖关系的方式

```dart
Get.put<SomeClass>(SomeClass());
Get.put<LoginController>(LoginController(), permanent: true);
Get.put<ListItemController>(ListItemController, tag: "some unique string");

// 这是你使用put时可以设置的所有选项。
Get.put<S>(
  // 必备：你想得到保存的类，比如控制器或其他东西。
  // 注："S "意味着它可以是任何类型的类。
  S dependency

  // 可选：当你想要多个相同类型的类时，可以用这个方法。
  // 因为你通常使用Get.find<Controller>()来获取一个类。
  // 你需要使用标签来告诉你需要哪个实例。
  // 必须是唯一的字符串
  String tag,

  // 可选：默认情况下，get会在实例不再使用后进行销毁
  // （例如：一个已经销毁的视图的Controller)
  // 但你可能需要这个实例在整个应用生命周期中保留在那里，就像一个sharedPreferences的实例或其他东西。
  //所以你设置这个选项
  // 默认值为false
  bool permanent = false,

  // 可选：允许你在测试中使用一个抽象类后，用另一个抽象类代替它，然后再进行测试。
  // 默认为false
  bool overrideAbstract = false,

  // 可选：允许你使用函数而不是依赖（dependency）本身来创建依赖。
  // 这个不常用
  InstanceBuilderCallback<S> builder,
)
```

####  2.2.2 `Get.lazyPut`：可以懒加载一个依赖，这样它只有在使用时才会被实例化。

```dart
///只有当第一次使用Get.find<ApiMock>时，ApiMock才会被调用。
Get.lazyPut<ApiMock>(() => ApiMock());

Get.lazyPut<FirebaseAuth>(
  () {
    // ... some logic if needed
    return FirebaseAuth();
  },
  tag: Math.random().toString(),
  fenix: true
)

// 这是你在使用lazyPut时可以设置的所有选项。
Get.lazyPut<S>(
  // 强制性：当你的类第一次被调用时，将被执行的方法。
  InstanceBuilderCallback builder,
  
  // 可选：和Get.put()一样，当你想让同一个类有多个不同的实例时，就会用到它。
  // 必须是唯一的
  String tag,

  // 可选：类似于 "永久"，
  // 不同的是，当不使用时，实例会被丢弃，但当再次需要使用时，Get会重新创建实例，
  // 就像 bindings api 中的 "SmartManagement.keepFactory "一样。
  // 默认值为false
  bool fenix = false
)
```

####  2.2.3 `Get.putAsync`：注册一个异步实例

```dart
Get.putAsync<SharedPreferences>(() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('counter', 12345);
  return prefs;
});

Get.putAsync<YourAsyncClass>( () async => await YourAsyncClass() )

// 这都是你在使用putAsync时可以设置的选项。
Get.putAsync<S>(

  // 必备：一个将被执行的异步方法，用于实例化你的类。
  AsyncInstanceBuilderCallback<S> builder,

  // 可选：和Get.put()一样，当你想让同一个类有多个不同的实例时，就会用到它。
  // 必须是唯一的
  String tag,

  // 可选：与Get.put()相同，当你需要在整个应用程序中保持该实例的生命时使用。
  // 默认值为false
  bool permanent = false
)
```

### 2.3 路由管理

#### 2.3.1 定义路由

使用GetMaterialApp定义路由。

```dart
GetMaterialApp(
  initialRoute: '/',
  getPages: [
    GetPage(name: '/', page: () => MyHomePage()),
    GetPage(name: '/second', page: () => Second()),
    GetPage(
      name: '/third',
      page: () => Third(),
      transition: Transition.zoom  
    ),
  ],
)
// 要处理到未定义路线的导航（404错误），可以在GetMaterialApp中定义unknownRoute页面。
GetMaterialApp(
  unknownRoute: GetPage(name: '/notfound', page: () => UnknownRoutePage()),
  initialRoute: '/',
  getPages: [
    GetPage(name: '/', page: () => MyHomePage()),
    GetPage(name: '/second', page: () => Second()),
  ],
)
```
#### 2.3.2 路由跳转

```dart
// 导航到下一个页面
Get.toNamed("/NextScreen");
// 浏览并删除前一个页面。
Get.offNamed("/NextScreen");
// 浏览并删除前面所有页面。
Get.offAllNamed("/NextScreen");
```

#### 2.3.3 跳转传参

arguments 接受任何东西，无论是一个字符串，一个Map，一个List，甚至一个类的实例。

```dart
Get.toNamed("/NextScreen", arguments: 'Get is the best');

// 在你的类或控制器上：
print(Get.arguments);//print out: Get is the best
```

Get提供高级动态URL，就像在Web上一样。

```dart
Get.offAllNamed("/NextScreen?device=phone&id=354&name=Enzo");

// 在你的类或控制器上：
print(Get.parameters['id']); // out: 354
print(Get.parameters['name']); // out: Enzo
```

## 3. Bindings

Bindings可以将路由、状态管理器和依赖管理器完全集成。 当一个路由从Stack中移除时，所有与它相关的控制器、变量和对象的实例都会从内存中移除。

```dart
class HomeBinding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<HomeController>(() => HomeController());
    Get.put<Service>(()=> Api());
  }
}
```

你将使用该 Binding 来建立路由管理器、依赖关系和状态之间的连接。

```dart
getPages: [
  GetPage(
    name: '/',
    page: () => HomeView(),
    binding: HomeBinding(),
  ),
];
```

Binding类在调用路由时被调用，你可以在你的GetMaterialApp中创建一个 "initialBinding "来插入所有将要创建的依赖关系。

```dart
GetMaterialApp(
  initialBinding: HomeBinding(),
  home: HomeView(),
);
```