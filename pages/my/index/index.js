// pages/my/index/index.js
const tabService = require('../../../utils/tab-service');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        accessSubject: '',
        phone: '',
        username: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    // 退出登录
    logout() {
        wx.navigateTo({
            url: '/pages/home/index/index',
        });
        wx.clearStorageSync();
    },
    gotoHistory() {
        if (wx.getStorageSync('accessSubject') == 'classMaster') {
            wx.navigateTo({
                url: '/pages/home/masterOperation/index'
            })
        } else if (wx.getStorageSync('accessSubject') == 'teacher') {
            wx.navigateTo({
                url: '/pages/my/historyInfo/index'
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        tabService.updateIndex(this, 1)
        this.setData({
            accessSubject: wx.getStorageSync("accessSubject"),
            phone: wx.getStorageSync("mobile"),
            username: wx.getStorageSync("nickname")
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})