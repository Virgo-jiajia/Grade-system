// 底部tab切换
let tabData = {
    tabIndex: 0, // 底部按钮高亮下标
    tabBar: {
        custom: true,
        color: "#CED4E4",
        selectedColor: "#CC2A2A",
        borderStyle: "black",
        backgroundColor: "#fff",
        list: []
    }
}

// 更新菜单
const updateRole = (that, type) => {
    if (type === 'manager') {
        tabData.tabBar.list = [{
                "pagePath": "pages/home/managerHome/index",
                "text": "首页",
                "iconPath": "/images/tabbar/tab1.png",
                "selectedIconPath": "/images/tabbar/tab1-slt.png"
            },
            {
                "pagePath": "pages/my/index/index",
                "text": "我的",
                "iconPath": "/images/tabbar/tab2.png",
                "selectedIconPath": "/images/tabbar/tab2-slt.png"
            }
        ]
    } else {
        tabData.tabBar.list = [{
                "pagePath": "pages/home/class/index",
                "text": "首页",
                "iconPath": "/images/tabbar/tab1.png",
                "selectedIconPath": "/images/tabbar/tab1-slt.png"
            },
            {
                "pagePath": "pages/my/index/index",
                "text": "我的",
                "iconPath": "/images/tabbar/tab2.png",
                "selectedIconPath": "/images/tabbar/tab2-slt.png"
            }
        ]
    }
    updateTab(that)
}

// 更新底部高亮
const updateIndex = (that, index) => {
    tabData.tabIndex = index
    updateTab(that)
}

// 更新tab状态
const updateTab = (that) => {
    if (typeof that.getTabBar == 'function' && that.getTabBar()) {
        that.getTabBar().setData(tabData)
    }
}

module.exports = {
    updateRole,
    updateIndex,
    updateTab,
    tabBar: tabData.tabBar.list
}