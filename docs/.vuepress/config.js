module.exports = {
    base:'/',
    dest:'dist',
    title: 'Cyy\'s blog',
    description: '我的博客',
    themeConfig: {
        logo: '/logo.jpg',
        editLinks: false,
        docsDir: 'docs',
        lastUpdated: 'Last Updated',
        smoothScroll: true,
        nav:[ // 导航栏配置
            { 
                text: '前端',
                ariaLabel: 'Frontend',
                items: [
                    {text : 'JavaScript', link: '/JavaScript/'},
                    {text : 'TypeScript', link: '/TS/'},
                    {text : 'CSS', link: '/CSS/'},
                    {text : '计算机网络', link: '/NetWork/'},
                    {text : '浏览器', link: '/Browser/'},
                    {text : 'Vue', link: '/Vue/'},
                    {text : 'React', link: '/React/'}
                ]
            },
            { 
                text: '项目工具',
                ariaLabel: 'Project-tools',
                items: [
                    {text : 'Webpack', link: '/Webpack/'},
                    {text : 'git', link: '/Git/'}
                ]
            },
            // {
            //     text: '面试',
            //     ariaLabel: 'interview',
            //     items: [
            //         {text: '面试题', link:'/ivList/'},
            //         {text: '面试经历', link:'/interview/'},
            //         {text: '模拟面试', link:'/ivMock/'}
            //     ]
            // },
            {
                text: 'LeetCode', 
                ariaLabel: 'LeetCode',
                items: [ 
                    {text: 'LeetCode', link: '/LeetCode/List/'}
                ]
            },
            {text: 'GitHub', link: 'https://github.com/Chenyuanyuan299'}      
        ],
        sidebar: {
            '/JavaScript/': getJavaScript(),
            '/TS/': getTypeScript(),
            '/CSS/': getCSS(),
            '/NetWork/': getNetWork(),
            '/Browser/': getBrowser(),
            '/Vue/': getVue(),
            '/React/': getReact(),
            '/Webpack/': getWebpack(),
            // '/ivList/': getIvList(),
            // '/interview/': getInterview(),
            // '/ivMock/': getIvMock(), 
            '/LeetCode/List/': getList()
        }
    }
}


function getJavaScript() { 
    return [
        {
            title: 'JavaScript',
            children: [
                'dataType',
                'context',
                'array',
                'object1',
                'object2',
                'object3',
                'object4',
                'function1',
                'function2',
                'promise',
                'copy'
            ]
        }
    ]
}

function getTypeScript() { 
    return [
        {
            title: 'TypeScript',
            children: [
                'TypeScript/TypeScript',
                'TypeScript/TypeScriptUP',
                'TypeScript/TSprogress',
                'TypeScript/type-annotation'
            ]
        },
        {
            title: 'TS+Express爬虫项目',
            children: [
                'ts-crawler/crawler1',
                'ts-crawler/crawler2',
                'ts-crawler/crawler3',
                'ts-crawler/crawler4',
            ]
        }
    ]
}

function getCSS() { 
    return [
        {
            title: 'CSS',
            children: []
        }
    ]
}

function getNetWork() { 
    return [ 
        { 
            title: 'NetWork',
            children: [
                'networkArch',
                'physicalLayer',
                'dataLinkLayer',
                'MAC、IP、ARP',
                'beforeHTTP',
            ]
        }
    ]
}

function getBrowser() { 
    return [ 
        { 
            title: 'Browser',
            children: [
                '内核 or 引擎？'
            ]
        }
    ]
}

function getVue() { 
    return [ 
        { 
            title: 'Vue基础',
            children: [
                'VueBase/1'
            ]
        },
        {
            title: 'Vue深入',
            children: [
                'VueDeep/2'
            ]
        }
    ]
}

function getReact() { 
    return [ 
        { 
            title: 'React基础',
            children: [
                'ReactBase/history',
                'ReactBase/component'
            ]
        },
        {
            title: 'React深入',
            children: [
                'ReactDeep/2'
            ]
        }
    ]
}

function getWebpack() { 
    return [ 
        { 
            title: 'Webpack',
            children: [
                'Webpack'
            ]
        }
    ]
}

function getIvList() { 
    return [ 
        { 
            title: '面试题列表',
            children: [
                'JavaScript',
                'Vue'
            ]
        }
    ]
}

function getInterview() { 
    return [
        {
            title: '面试经历',
            children: [
                '腾讯一面'
            ]
        }
    ]
}

function getIvMock() { 
    return [ 
        {
            title: '模拟面试',
            children: [
                'firstMock',
                'secondMock',
                'thirdMock',
                'lastMock'
            ]
        }
    ]
}

function getList() { 
    return [ 
        { 
            title: 'List',
            children: [
                'String'
            ]
        }
    ]
}
