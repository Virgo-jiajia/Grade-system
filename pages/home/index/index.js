// pages/home/index/index.js
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js');
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        manager: 'manager',
        classMaster: 'classMaster',
        teacher: 'teacher',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // todo 已经登录过
        let token = wx.getStorageSync("accessToken");
        let access = wx.getStorageSync("accessSubject");
        if (token) {
            if (access == 'manager') {
                wx.redirectTo({
                    url: '/pages/home/managerHome/index',
                });
            } else {
                wx.switchTab({
                    url: '/pages/home/class/index',
                });
            }
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