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
        nav:[
            { 
                text: '前端',
                ariaLabel: 'Frontend',
                items: [
                    {text: 'JavaScript', link: '/JavaScript/'},
                    {text: 'CSS', link: '/CSS/'},
                    {text: 'Vue', link: '/Vue/'},
                    {text: 'React', link: '/React/'},
                    {text: 'NodeJs', link: '/NodeJs/'},
                    {text: 'Browser', link: '/Browser/'},
                    {text: 'TypeScript', link: '/TypeScript/'}
                ]
            },
            {
                text: '计算机基础',
                ariaLabel: 'Computer-base',
                items: [
                    {text: '计算机网络', link: '/NetWork/'},
                ]
            },
            { 
                text: '项目构建',
                ariaLabel: 'Project-building',
                items: [
                    {text: 'Webpack', link: '/Webpack/'},
                    {text: 'Git', link: '/Git/'}
                ]
            },
            {
                text: 'LeetCode', 
                ariaLabel: 'LeetCode',
                items: [ 
                    {text: 'LeetCode', link: '/LeetCode/'}
                ]
            },
            // {
            //     text: '面试',
            //     ariaLabel: 'Interview',
            //     items: [
            //         {text: '面试经历', link:'/Interview/'},
            //         {text: '模拟面试', link:'/InterviewMock/'}
            //     ]
            // },
            {text: 'GitHub', link: 'https://github.com/Chenyuanyuan299'}      
        ],
        sidebar: {
            '/JavaScript/': getJavaScript(),
            '/CSS/': getCSS(),
            '/Vue/': getVue(),
            '/React/': getReact(),
            '/NodeJs/': getNodeJs(),
            '/Browser/': getBrowser(),
            '/TypeScript/': getTypeScript(),
            '/NetWork/': getNetWork(),
            '/Webpack/': getWebpack(),
            '/Git/': getGit(),
            '/LeetCode/': getList(),
            // '/Interview/': getInterview(),
            // '/InterviewMock/': getInterviewMock(), 
        }
    }
}


function getJavaScript() { 
    return [
        {
            title: 'JavaScript基础',
            children: [
                'JavaScriptBase/dataType',
                'JavaScriptBase/context',
                'JavaScriptBase/array',
                'JavaScriptBase/object1',
                'JavaScriptBase/object2',
                'JavaScriptBase/object3',
                'JavaScriptBase/object4',
                'JavaScriptBase/function1',
                'JavaScriptBase/function2',
                'JavaScriptBase/promise',
                'JavaScriptBase/introduce',
            ]
        },
        {
            title: 'JavaScript进阶',
            children: [
                'JavaScriptDeep/call&apply&bind',
                'JavaScriptDeep/copy',
                'JavaScriptDeep/anti-shake&throttling',
                'JavaScriptDeep/concurrent-of-async',
            ]
        },
        {
            title: 'JavaScript数据结构拓展',
            children: [
                'DataStructures/linkedList',
                'DataStructures/heap',
                'DataStructures/priorityQueue',
                'DataStructures/binarySearchTree',
                'DataStructures/avlTree',
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

function getVue() { 
    return [ 
        { 
            title: 'Vue基础',
            children: [
                'VueBase/vue2&vue3'
            ]
        },
        {
            title: 'Vue深入',
            children: [
                'VueDeep/overview-of-frame-design',
                'VueDeep/responsive-system'
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
                'ReactBase/component',
                'ReactBase/event',
                'ReactBase/virtual-DOM',
                'ReactBase/component-communication',
                'ReactBase/setState'
            ]
        },
        {
            title: 'React深入',
            children: [
                'ReactDeep/vue&react',
                'ReactDeep/react-idea',
                'ReactDeep/react-hooks',
                'ReactDeep/uncontrolled'
            ]
        }
    ]
}

function getNodeJs() {
    return [
        {
            title: 'NodeJs',
            children: [
                'modules'
            ]
        }
    ]
}

function getBrowser() { 
    return [ 
        { 
            title: 'Browser',
            children: [
                'kernel&engine',
                'fromUrl',
                'repaint&reflow',
                'event-loops',
                'performance'
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
                'TypeScript/TypeScriptDeep',
                'TypeScript/TypeScriptProgress',
                'TypeScript/type-annotation'
            ]
        },
        {
            title: 'TypeScript+Express爬虫项目',
            children: [
                'TypeScript&Crawler/crawler1',
                'TypeScript&Crawler/crawler2',
                'TypeScript&Crawler/crawler3',
                'TypeScript&Crawler/crawler4',
            ]
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

function getGit() { 
    return [ 
        { 
            title: 'Git',
            children: []
        }
    ]
}

function getList() { 
    return [ 
        { 
            title: 'List',
            children: []
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

function getInterviewMock() { 
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
