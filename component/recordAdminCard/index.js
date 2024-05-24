// component/noMoreData/noMoreData.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        flowId: {
            value: 0,
            type: Number
        },
        // 审批状态:1=通过,2=拒绝,3=取消,4=审核中
        status: {
            value: 1,
            type: Number
        },
        subject: {
            value: '',
            type: String
        },
        type: {
            value: '',
            type: String
        },
        class: {
            value: '',
                type: String
        },
        master: {
            value: '',
            type: String
        },
        teacher: {
            value: '',
            type: String
        },
        student: {
            value: '',
            type: String
        },
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
        gotoDetail(e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: `/pages/home/managerHome/replayDeatil/index?id=${id}`
            });

        }
    }
})