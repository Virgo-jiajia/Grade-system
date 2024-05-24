// component/noMoreData/noMoreData.js
var Api = require('../../utils/API.js')
var wxRequest = require('../../utils/wxRequest')
var util = require('../../utils/util.js')
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        flowId: {
            type: Number,
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
        replayTo: {
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
        replayTo: {
            value: '',
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
        // 修改成绩
        updateScore(e) {
            let id = e.currentTarget.dataset.id;
            wx.navigateTo({
                url: `/pages/home/scoreForm/updateScore/index?id=${id}`,
            });
        },
        // 取消修改
        handleCancel(e) {
            let id = e.currentTarget.dataset.id;
            let url = Api.postCancelApproval();
            let data = {
                flow_id: id
            }
            let postData = wxRequest.postRequest(url, data);
            postData.then(res => {
                if (res.data.status == 'SUCCESS') {
                    util.showToast('取消成功');
                } else {
                    util.showToast(res.data.msg);
                }
            })
        },
        // 重新上传凭证
        updateEvidence(e) {
            let flowId = e.currentTarget.dataset.flow_id;
            wx.navigateTo({
                url: `/pages/my/applyRecord/changeScore/index?flowId=${flowId}`,
            });
        }
    }
})