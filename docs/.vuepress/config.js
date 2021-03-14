module.exports = {
    base:'/',
    dest:'dist',
    title: 'Cyy\'s blog',
    description: '我的博客',
    markdown: {
        lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        nav:[ // 导航栏配置
        {text: '前端', link: '/accumulate/' },
        {text: '算法', link: '/algorithm/'},
        {text: 'GitHub', link: 'https://github.com/Chenyuanyuan299'}      
        ],
        sidebar: 'auto', // 侧边栏配置
        sidebarDepth: 2, // 侧边栏显示2级
    }
}