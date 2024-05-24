const wxRequest = require("../../../utils/wxRequest");
var Api = require('../../../utils/API.js')
Page({
    data: {
        subjects: [
            { id: '1', title: '校内成绩' },
            { id: '2', title: '操行分' },
            { id: '3', title: '校外成绩' }
        ],
        scoreTypes: [] // 判断校内成绩 校外成绩 还是操行分
    },
    onLoad: function(options) {
        this.setData({
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            stuName: wx.getStorageSync('stuName'),
            isTeacher: wx.getStorageSync('accessSubject') == 'teacher' ? true : false
        })
        this.getScoreType()
    },
    // 是否显示校内成绩、校外成绩、操行分
    getScoreType() {
        wx.showLoading({
            title: '加载中...',
        })
        let classId = wx.getStorageSync('classId');
        let url = Api.getScoreType() + '?class_id=' + classId;
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    scoreTypes: res.data.data.scoreTypes
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        });
    },
    gotoOnCampus() {
        let inSide = this.data.scoreTypes.inSideSubjectTypes;
        // url: `/pages/index/index?arr=${JSON.stringify(arr)}&obj=${JSON.stringify(obj)}`,
        wx.navigateTo({
            url: `/pages/home/chooseSubject/subjectOnCampus/index?inSide=${JSON.stringify(inSide)}`
        })
    }
})