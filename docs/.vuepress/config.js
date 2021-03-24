module.exports = {
    base:'/',
    dest:'dist',
    title: 'Cyy\'s blog',
    description: '我的博客',
    themeConfig: {
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
                ]
            },
            {text: 'GitHub', link: 'https://github.com/Chenyuanyuan299'}      
        ],
        sidebar: {
            '/JS/': getFrontend(),
            '/CSS': getCSS(),
            '/HTTP': getHTTP()
        }
    }
}


function getFrontend() { 
    return [
        {
            title: 'JavaScript',
            children: []
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