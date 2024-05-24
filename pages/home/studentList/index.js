var wxRequest = require('../../../utils/wxRequest')
var Api = require('../../../utils/API.js')
var util = require('../../../utils/util.js')
Page({
    data: {
        students: []
    },
    onLoad: function(options) {
        this.setData({
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            accessSubject: wx.getStorageSync('accessSubject')
        })
        this.getStudentList()
    },
    getStudentList() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;
        var classId = wx.getStorageSync('classId');
        var url = Api.getStudentList() + `?class_id=${classId}`;
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                that.setData({
                    students: res.data.data.students
                })
            } else {
                util.showToast(res.data.msg)
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    // 跳转到选择校内成绩/校外成绩/操行分的页面
    chooseType(e) {
        var stuId = e.currentTarget.dataset.id;
        var stuName = e.currentTarget.dataset.name;
        wx.setStorageSync('stuId', stuId);
        wx.setStorageSync('stuName', stuName);
        var classId = wx.getStorageSync('classId');
        wx.navigateTo({
            url: '/pages/home/chooseSubject/index?class_id=' + classId,
        });

    }
})