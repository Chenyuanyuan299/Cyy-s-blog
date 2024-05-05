# 模拟四面

## 1.输入 URL 之后发生了什么事？

### 第一部分： 输入网址并解析

- URL 的组成：
  URL 主要由 `协议`、`主机`、`端口`、`路径`、`查询参数`、`锚点`6部分组成。

<img :src="$withBase('/HTTP/HTTP04.png')" alt="URIForm"/>

- 解析 URL：
  输入URL后，浏览器会解析出协议、主机、端口、路径等信息，并构造一个HTTP请求。
  1. 浏览器发送请求前，根据请求头的`expires`和`cache-control`判断是否命中（包括是否过期）强缓存策略，如果命中，直接从缓存获取资源，并不会发送请求。如果没有命中，则进入下一步。
  2. 没有命中强缓存规则，浏览器会发送请求，根据请求头的`last-modified`和`etag`判断是否命中协商缓存，如果命中，直接从缓存获取资源。如果没有命中，则进入下一步。
- 浏览器缓存：




## 2.闭包是什么？有什么作用？

## 3.事件循环机制？

假如在微任务执行过程中遇到宏任务怎么办？

## 4.捕获和冒泡，事件委托？

react 里面的事件都是用事件委托，比如 on-click

## 5.对于同步和异步的理解？

## 6.new 的作用？new 之后发生了什么？

## 7.简述 prototype

## 8.进程和线程的区别？为什么它们之间不会共享内存？






