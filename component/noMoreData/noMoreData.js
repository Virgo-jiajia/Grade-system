// component/noMoreData/noMoreData.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        // 1.暂无数据
        listNum: {
            value: 0,
            type: Number
        },
        noImgStr: {
            value: "noData.png",
            type: String
        },
        noDataStr: {
            value: " --暂无数据--",
            type: String
        },

        //2.加载底部提示
        isLastPage: {
            value: false,
            type: Boolean
        },

        // 3.提示文字
        alertStr: {
            value: "---已经到底了---",
            type: String
        },
        // 4.提示文字颜色
        alertColor: {
            value: "#757575",
            type: String
        }

    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})