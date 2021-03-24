# HTTP 学习准备

## 了解HTTP

当我们在网页浏览器（Web browser）的地址栏中输入URL时，Web页面是如何呈现的？

根据 Web 浏览器地址栏中指定的 URL，Web 浏览器从 Web 服务器端获取文件资源（resource）等信息，从而显示出 Web 页面。

像这种通过发送请求获取服务器资源的 Web 浏览器等，都可称为客 户端（client）。

## 基础 **TCP/IP**

通常使用的网络（包括互联网）是在TCP/IP协议族的基础上运作的。而HTTP属于它内部的一个子集。把与互联网相关联的协议集合起来总称为 TCP/IP。

<img :src="$withBase('/HTTP/HTTP01.png')" alt="what-TCP/IP"/>