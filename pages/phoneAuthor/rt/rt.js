// pages/phoneauthor/rt/rt.js
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        con: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.id) {
            this.setData({
                id: options.id
            })
        }
        this.loadData();
    },
    // a1. 加载数据
    loadData() {
        var url = Api.getRtPageData();
        var data = {
            ids: this.data.id
        }
        var postData = wxRequest.getRequest(url, data);
        postData
            .then(res => {
                if (res.data.code == 1) {
                    var temData = res.data.data.list[0];
                    wx.setNavigationBarTitle({
                        title: temData.post_title,
                    })

                    this.setData({
                        con: util.formatRichText(temData.post_content),
                    })

                } else {
                    util.showToast(res.data.msg)
                }
            });

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
        util.shareHome();
    }
})