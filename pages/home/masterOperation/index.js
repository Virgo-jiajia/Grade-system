// 班主任选择班级后的页面
var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
Page({
    data: {
        classes: [],
        scores: [],
        index: 0,
        isFirst: false,
    },
    onLoad: function(options) {
        this.getClassList()
    },
    // todo 首次进入页面
    // 选择班级
    pickerChangeClass: function(e) {
        let tempClass = this.data.classes[e.detail.value] // 选中的class
        this.setData({
            isFirst: true,
            index: e.detail.value,
            classId: tempClass.id,
            className: tempClass.class_name,
            masterName: tempClass.teacher_name,
        })
        this.getHistory()
    },
    // 获取班级列表
    getClassList() {
        var that = this
        var url = '';
        url = Api.getClassList() + `?page=1`;
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                that.setData({
                    classes: res.data.data.paginator.data
                })
            } else {
                util.showToast(res.data.msg)
            }
        })
    },
    // 获取学生历史成绩列表-操行分
    getHistory() {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getHistoryScore() + `?class_id=${this.data.classId}&subject_id=0&subject_tag=1`
        let getData = wxRequest.getRequest(url);
        getData.then(res => {
            // todo 接口缺少flow_id item.flow_id == 0 !!!
            if (res.data.status == "SUCCESS") {
                this.setData({
                    scores: res.data.data.paginator.items
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    // 跳转修改成绩页面
    gotoChange(e) {
        var id = e.currentTarget.dataset.id; // 成绩记录id
        wx.navigateTo({
            url: `/pages/my/applyRecord/changeScore/index?id=${id}&subjectTag=${this.data.subjectTag}`,
        });
    }
})