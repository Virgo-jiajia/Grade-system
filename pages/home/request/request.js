// pages/home/request/request.js
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        // this.postData();
        // this.getData();
    },
    // 1.post 请求
    postData() {
        var url = Api.postDemo();
        var data = {
            name: "11",
        }
        var postData = wxRequest.postRequest(url, data);
        postData
            .then(res => {
                if (res.data.code == 1) {

                } else {
                    util.showToast(res.data.msg)
                }
            });

    },

    // 2.get 请求
    getData() {
        var url = Api.getDemo();
        var data = {
            name: "11",
        }
        var postData = wxRequest.postRequest(url, data);
        postData
            .then(res => {
                if (res.data.code == 1) {

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

    }
})