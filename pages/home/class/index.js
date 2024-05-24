const tabService = require('../../../utils/tab-service');
var wxRequest = require('../../../utils/wxRequest')
var Api = require('../../../utils/API.js')
var util = require('../../../utils/util.js')
Page({
    data: {
        keyword: '',
        classes: [],
    },
    onShow: function(options) {
        this.getClassList()
        let temp = wx.getStorageSync('accessSubject');
        tabService.updateRole(this, temp)
        tabService.updateIndex(this, 0)
    },
    // 搜索
    handleSearch(e) {
        this.keyword = e.detail.value;
        this.getClassList(this.keyword)
    },
    // 跳转到学生列表时，存储classid classname masterName
    handleJump(e) {
        let id = e.currentTarget.dataset.id;
        let className = e.currentTarget.dataset.class_name;
        let masterName = e.currentTarget.dataset.teacher_name;
        wx.setStorageSync('classId', id);
        wx.setStorageSync('className', className);
        wx.setStorageSync('masterName', masterName);
        console.log(masterName, 'master')
        let temp = wx.getStorageSync('accessSubject');
        // todo 班主任进入下个页面
        if (temp == 'classMaster') {
            // ../masterOperation/index
            wx.navigateTo({
                url: `../masterIndex/index`,
            });
        } else {
            wx.navigateTo({
                url: `../studentList/index?id=${{id}}`,
            });
        }
    },
    // todo 班主任进来需要根据他所带的班级显示列表
    getClassList(key) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this
        var url = '';
        url = Api.getClassList() + `?page=1`;
        if (key) {
            url = Api.getClassList() + `?page=1&keyword=${key}`;
        }
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                that.setData({
                    classes: res.data.data.paginator.data
                })
            } else {
                util.showToast(res.data.msg)
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    }
})