# 内核 or 引擎？

浏览器内核可以分为两部分：**渲染引擎**和 **JavaScript 引擎**。内核主要负责获取、整理、计算网页内容等等，不同的浏览器内核对不同对于网页的语法解释有所不同，所以渲染效果也不同。JS 引擎则用于解析 JavaScript 程序，使网页具有动态的效果。  后来 JS 引擎越来越独立，所以现在的内核一般单独指渲染引擎。

| 浏览器         | 内核（渲染引擎）                 | JavaScript 引擎                             |
| -------------- | -------------------------------- | ------------------------------------------- |
| IE -> Edge     | Trident -> EdgeHTML -> Chromium  | JScript -> Chakra                           |
| FireFox        | Gecko                            | SpiderMonkey -> TraceMonkey -> JaegerMonkey |
| Chrome         | Webkit -> Blink                  | V8                                          |
| Safari         | Webkit                           | JavaScriptCore -> Nitro                     |
| Opera          | Presto -> Webkit -> Blink        | Linear A -> Linear B -> Futhark -> Carakan  |
| Konqueror      | KHTML                            | KJS                                         |
| 国内浏览器主流 | Chromium（基于Webkit） + Trident | 对应的 JS 引擎                              |

## User-Agent

一般http 请求头会带有这么一个字段：**User-Agent**，它表示操作系统版本、CPU 类型、浏览器及版本、浏览器渲染引擎等信息。可以通过 server 端读取日志查看详细信息。比如来自 Chrome 浏览器的请求：`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36`。如果查看其它浏览器会发现，有一些字段重复了。这其中有一个故事：

很久很久以前有一个浏览器名字叫 NCSA Mosaic。在它之后出现了一个 Mozilla 的浏览器（Mozilla 的意思是 Mosaic 终结者），正式发布版本名是 Netscape，它把自己标称为 Mozilla/1.0 (Win3.1)。由于 Netscape 支持框架显示，后来框架在大家中间流行起来了，但 Mosaic 不支持框架。所以开发者们则通过 User-Agent 来判断，如果是 Netscape 浏览器则进入框架（html frame）的页面，如果不是 Netscape 浏览器则进入没有框架的页面。

Netscape 没有风光多久，微软也推出了自己的 IE 浏览器 。IE 浏览器也支持框架。但是很遗憾，网站管理员们不认识它呀，因为 IE 的 User-Agent 不带有 Mozilla，所以没有人理它。后来微软抓狂了，你们不就是只认识 User-Agent 里带有 Mozilla 字符的浏览器么，那我就宣称自己是“兼容Mozilla”的，模仿 Netscape，把自己标称为 Mozilla/1.22 (compatible; MSIE 2.0; Windows 95)，这样一来 IE 也有了 Mozilla（伪装）。

后来随着微软把浏览器捆绑进自己的操作系统里一起卖，随就爆发了浏览器大战。结果大家都很清楚，Netscape 失败了。微软大获全胜，至今微软的 IE 依然影响着 w3c，影响着所有的浏览器。

Netscape 失败后 Mozilla 卷土重来，构造了 Gecko 渲染引擎，称为 Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.1) Gecko/20020826。Mozilla 的前大神们基于 Gecko 渲染引擎创造了 Firefox 浏览器，称为 Mozilla/5.0 (Windows; U; Windows NT 5.1; sv-SE; rv:1.7.5) Gecko/20041108 Firefox/1.0，Firefox 表现非常优秀。

由于 Gecko 的优秀，开发者们会判断浏览器是否是 Gecko 的，如果是则把更先进、更漂亮页面显示给这个浏览器，其他浏览器就没有这个待遇了。

看到 Gecko 能看到这么漂亮的页面，Linux 平台的孩子们很伤心，因为他们创建了基于 KHTML 引擎支持的 Konqueror 也跟 Gecko 一样优秀，但却不带有 Gecko 导致不能被识别。于是 Konquerer 也开始伪装自己“像 Gecko”以看到更漂亮的网页，并称自己为 Mozilla/5.0 (compatible; Konqueror/3.2; FreeBSD) (KHTML, like Gecko)。

Opera 也不甘示弱，既然有这么多可以选择的马甲，那我岂不是想变成谁就变成谁，三个选项让开发者为我发网页：

1. Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; en) Opera 9.51；
2. Mozilla/5.0 (Windows NT 6.0; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0；
3. Opera 9.51Opera/9.51 (Windows NT 5.1; U; en)。

Apple 大神也有话说，开发了 Safari，使用了 KHTML，同时也增加了很多新特性，后来另起炉灶叫 WebKit（基于KHTML），同时它又希望能够看到那些为 KHTML 编写的网页，于是 Safari 称自己为Mozilla/5.0 (Macintosh; U; PPC Mac OS X; de-de) AppleWebKit/85.7 (KHTML, like Gecko) Safari/85.5，互联网世界更加混乱了。

后来 Google 也开发了自己的浏览器 Chrome，使用了 Webkit（现在脱离出来使用 Blink，但是基于 Webkit），有点像 Safari，它希望能看到为 Safari 编写的网页，于是决定装成 Safari。Chrome 宣称自己是 Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.13 (KHTML, like Gecko)Chrome/0.2.149.27 Safari/525.13。

最后，webKit 伪装成 KHTML，KHTML 伪装成 Gecko，IE 伪装成 Mozilla，Opera 直接百变，同时所有的浏览器又都宣称自己是 Mozilla，于是有了现在一长串 User-Agent。

最后，附上一张浏览器发展历史图：

<img :src="$withBase('/Browser/browser-history.png')" alt="browser-history" />