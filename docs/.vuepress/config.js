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
                    {text : 'JS', link: '/JS/'},
                    {text : 'CSS', link: '/CSS/'},
                    {text : 'HTTP', link: '/HTTP/'},
                    {text : '浏览器', link: '/Browser/'},
                    {text : 'Vue', link: '/Vue/'},
                    {text : 'React', link: '/React/'},  
                ]
            },
            {
                text: 'LeetCode', 
                ariaLabel: 'LeetCode',
                items: [ 
                    {text: 'LeetCode', link: '/LeetCode/List/'}
                ]
            },
            {
                text: '面试',
                ariaLabel: 'interview',
                items: [
                    {text: '面试题', link:'/ivList/'},
                    // {text: '模拟面试', link:'/ivMock/'}
                ]
            },
            {text: 'GitHub', link: 'https://github.com/Chenyuanyuan299'}      
        ],
        sidebar: {
            '/JS/': getFrontend(),
            '/CSS/': getCSS(),
            '/HTTP/': getHTTP(),
            '/Browser/': getBrowser(),
            '/Vue/': getVue(),
            '/React/': getReact(),
            '/ivList/': getIvList(),
            // '/ivMock/': getIvMock(), 
            '/LeetCode/List/': getList()
        }
    }
}


function getFrontend() { 
    return [
        {
            title: 'JavaScript',
            children: [
                'JavaScript/dataType'
            ]
        },
        {
            title: 'JavaScript进阶',
            children: [
                'JavaScriptUp/upgrade1',
                'JavaScriptUp/upgrade2'
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

function getHTTP() { 
    return [ 
        { 
            title: 'HTTP',
            children: [
                'beforeHTTP',
            ]
        }
    ]
}

function getBrowser() { 
    return [ 
        { 
            title: 'Browser',
            children: []
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
                'ReactBase/1'
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

// function getIvMock() { 
//     return [ 
//         {
//             title: '模拟面试',
//             children: [
//                 'firstMock',
//                 'secondMock',
//                 'thirdMock',
//                 'lastMock'
//             ]
//         }
//     ]
// }

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
