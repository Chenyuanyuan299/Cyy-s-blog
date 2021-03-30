# 模拟二面

## 1.HTML 元素分为几种类型

- 块级标签：`div`  `p`  `h1-h6`  `ul`  `ol`  `li`  `header`  `footer`  `aside`  `article`  `table`  `section`  `form` 等。
- 行内标签：`span`  `b`  `q`  `a`  `em`  `label` 等。
- 替换标签：`img`  `canvas`  `svg`  `video`  `iframe`  `input`  `button` 等。

## 2.<script\>标签为什么放在<body\>下面？

网页一般解析完部分 HTML 片段之后就可显示在网页上，JS 的下载和执行会阻塞 DOM 树的构建（严格说是中断了 DOM 树的更新），把<script\>标签放在首屏范围内的 HTML 代码段里会**截断**首屏的内容。（待完善）

## 3.响应式布局的实现方式？

- 百分比布局
- 媒体查询
- flex 布局
- grid 布局
- viewpoint（vw、vh）

## 4.值的存储？

基本数据类型存放在栈内存中，引用类型放在堆内存中。

## 5.function声明的函数和箭头函数的区别？

1. 箭头函数都是匿名函数。
2. 箭头函数没有原型，不能作为构造函数，没有super，所以箭头函数也不能使用 new。
3. 箭头函数没有自己的 this，它的 this 是继承来的，默认指向在定义它时所处的对象。
4. 箭头函数没有自己的 arguments 对象，可以通过 rest 访问它的参数。

## 6.cookie 是什么？它有什么字段？

Cookies，指某些网站为了辨别用户身份、进行 session 跟踪而储存在用户本地终端上的数据（通常经过加密）。

`Value` 用于存储用户的数据；`HttpOnly` 设置不能通过 JS 访问 Cookie，减少 XSS 攻击；`Secure` 设置 Cookie 只能在 HTTPS 的请求中携带；`SameSite: Strict`  规定所有跨域请求都无法发送 Cookie，减少 CSRF 攻击；`Exptres/Max-Age` Cookie 过期。

## 7.HTTP 状态码有哪些？

100  Continue  继续。客户端应继续其请求

101  Switching Protocols  切换协议。服务器根据客户端的请求切换协议。只能切换到更高级的协议，例如，切换到HTTP的新版本协议

200  OK  请求成功。一般用于GET与POST请求

201  Created  已创建。成功请求并创建了新的资源

202  Accepted  已接受。已经接受请求，但未处理完成

203  Non-Authoritative Information  非授权信息。请求成功。但返回的meta信息不在原始的服务器，而是一个副本

204  No Content  无内容。服务器成功处理，但未返回内容。在未更新网页的情况下，可确保浏览器继续显示当前文档

205  Reset Content  重置内容。服务器处理成功，用户终端（例如：浏览器）应重置文档视图。可通过此返回码清除浏览器的表单域

206  Partial Content  部分内容。服务器成功处理了部分GET请求

300  Multiple Choices  多种选择。请求的资源可包括多个位置，相应可返回一个资源特征与地址的列表用于用户终端（例如：浏览器）选择

301  Moved Permanently  永久移动。请求的资源已被永久的移动到新URI，返回信息会包括新的URI，浏览器会自动定向到新URI。今后任何新的请求都应使用新的URI代替

302  Found  临时移动。与301类似。但资源只是临时被移动。客户端应继续使用原有URI

303  See Other  查看其它地址。与301类似。使用GET和POST请求查看

304  Not Modified  未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。客户端通常会缓存访问过的资源，通过提供一个头信息指出客户端希望只返回在指定日期之后修改的资源

305  Use Proxy  使用代理。所请求的资源必须通过代理访问

306  Unused  已经被废弃的HTTP状态码

307  Temporary Redirect  临时重定向。与302类似。使用GET请求重定向

400  Bad Request  客户端请求的语法错误，服务器无法理解

401  Unauthorized  请求要求用户的身份认证

402  Payment Required  保留，将来使用

403  Forbidden  服务器理解请求客户端的请求，但是拒绝执行此请求

404  Not Found  服务器无法根据客户端的请求找到资源（网页）。通过此代码，网站设计人员可设置"您所请求的资源无法找到"的个性页面

405  Method Not Allowed  客户端请求中的方法被禁止

406  Not Acceptable  服务器无法根据客户端请求的内容特性完成请求

407  Proxy Authentication Required  请求要求代理的身份认证，与401类似，但请求者应当使用代理进行授权

408  Request Time-out  服务器等待客户端发送的请求时间过长，超时

409  Conflict  服务器完成客户端的PUT请求是可能返回此代码，服务器处理请求时发生了冲突

410  Gone  客户端请求的资源已经不存在。410不同于404，如果资源以前有现在被永久删除了可使用410代码，网站设计人员可通过301代码指定资源的新位置

411  Length Required  服务器无法处理客户端发送的不带Content-Length的请求信息

412  Precondition Failed  客户端请求信息的先决条件错误

413  Request Entity Too Large  由于请求的实体过大，服务器无法处理，因此拒绝请求。为防止客户端的连续请求，服务器可能会关闭连接。如果只是服务器暂时无法处理，则会包含一个Retry-After的响应信息

414  Request-URI Too Large  请求的URI过长（URI通常为网址），服务器无法处理

415  Unsupported Media Type  服务器无法处理请求附带的媒体格式

416  Requested range not satisfiable  客户端请求的范围无效

417  Expectation Failed  服务器无法满足Expect的请求头信息

500  Internal Server Error  服务器内部错误，无法完成请求

501  Not Implemented  服务器不支持请求的功能，无法完成请求

502  Bad Gateway  作为网关或者代理工作的服务器尝试执行请求时，从远程服务器接收到了一个无效的响应

503  Service Unavailable  由于超载或系统维护，服务器暂时的无法处理客户端的请求。延时的长度可包含在服务器的Retry-After头信息中

504  Gateway Time-out  充当网关或代理的服务器，未及时从远端服务器获取请求

505  HTTP Version not supported  服务器不支持请求的HTTP协议的版本，无法完成处理

## 8.sessionStorage 和 localStorage 的区别？

localStorage：键值对，大小约 5M，永不删除，除非手动清除，仅在客户端中保存，所用同源窗口共享。

sessionStorage：键值对，大小约 5M，仅在本次会话存在，关闭页面或浏览器后被清除，按照会话窗口独立，同源不共享。

## 9.Vue3.0 对 Vue2.x 做了什么改进？

#### 1.数据监听系统的改变：

- Vue2.x 使用 ES5 的 Object.defineProperty 的 getter 和 setter实现，不能劫持数组，对象等
- Vue3.0 基于 proxy 实现了全语言（属性新增删除，数组长度变化等）支持和更好新能的提升，避免了再初始化时对对象的每个属性进行代理

#### 2.更好的 TypeScript 支持

- Vue2.x 可能需要引入第三方插件进行 class 形式的代码编写，并通过装饰器进行类型约束
- Vue3.0 有原生的 Class API 和 TSX

#### 3.优化了 Diff 算法

- Vue2.x 在运行时会对所有结点生成一个虚拟结点树，当数据发生改变时，会遍历所有节点
- Vue3.0 修改了 diff 算法，参考了 Svelte 框架的思想，在模板编译时就会进行一些优化来减少运行时的开销，在编译时会对模板进行分析，先分层次，然后找不变化的层，针对变化的层进行 diff。





