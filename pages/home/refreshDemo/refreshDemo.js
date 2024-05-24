// pages/home/refreshDemo/refreshDemo.js
var wxRequest = require('../../../utils/wxRequest.js');
var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {

        // 1.列表
        list: [],

        // 底部 提示样式判定
        isLastPage: false,
        // 起始页 默认为1
        currentPage: 1,
        // 总页数
        pageCount: 1,

    },

    // 1.加载数据
    // a1. 加载数据 -- 无接口 模拟
    loadData() {
        var that = this;
        var temPage = this.data.currentPage;
        if (temPage == 1) {
            //  滑动到顶部
            wx.pageScrollTo({
                scrollTop: 0
            })
        }

        var temArr = [{
            type: 0
        }, {
            type: 0
        }, {
            type: 0
        }, {
            type: 1
        }, {
            type: 0
        }, {
            type: 0
        }, {
            type: 0
        }, {
            type: 0
        }];

        var temList = this.data.list;
        setTimeout(() => {
            var temPageCount = this.data.pageCount;
            // 1. 模拟网络请求获取数据
            if (temPage == 1) {
                that.setData({
                    list: temArr,
                    pageCount: 3
                })
            } else {
                if (temPage <= temPageCount) {
                    temList = temList.concat(temArr);
                    that.setData({
                        list: temList
                    })
                }


            }
            // 2.停止刷新
            wx.stopPullDownRefresh({});

            // 3.判定是否是 最后一个 进行提示
            if (temPage >= temPageCount) {
                that.setData({
                    isLastPage: true,
                })
            }

        }, 1000);

    },


    // a1.列表数据  -- 有接口样例
    loadData() {
        var that = this;
        var temPage = this.data.currentPage;
        if (temPage == 1) {
            //  滑动到顶部
            wx.pageScrollTo({
                scrollTop: 0
            })
        }
        var temPage = this.data.currentPage;
        if (that.data.pageCount < temPage && that.data.pageCount != 0) {
            that.showLoadedAllData();
            return;
        }



        // 2.接口
        var url = Api.getMerchantList();
        var data = {
            page: temPage,
            page_size: "10",
            keyword: this.data.searchStr,
        }

        var postRequest = wxRequest.postRequest_store(url, data);

        // 2. 获取 
        postRequest
            .then(res => {
                // 2.1.停止加载
                setTimeout(() => {
                    wx.stopPullDownRefresh();
                }, 500);

                // 2.2 获取成功
                if (res.data.code == 1) {

                    // 1. 基本判定数据
                    // 数据 总页数
                    var temBackData = res.data.data;
                    var pageCount = temBackData.last_page;

                    var temList = temBackData.data;
                    for (var i = 0; i < temList.length; i++) {
                        if (temList[i].tag_name) {
                            //   var temMarks = temList[i].tag_name.split('，');
                            var temMarks = temList[i].tag_name.split(',');
                            temList[i].marks = temMarks;
                        }


                    }
                    // 3.  赋值
                    if (temPage == 1) {
                        // 3.2 赋值
                        that.setData({
                            list: temList,
                            pageCount: pageCount,

                        })
                    } else {
                        var temArr2 = that.data.list.concat(temList)
                        that.setData({
                            list: temArr2,
                        })
                    }

                    //4.如果还有一页显示 没有更多数据提示
                    if (pageCount <= temPage) {
                        that.showLoadedAllData();
                    }


                } else {

                    util.showToast(res.data.msg);

                }

            })

    },
    showLoadedAllData() {
        this.setData({
            isLastPage: true,
        })
    },

    // 2.点击item
    tapItem(e) {
        var temItem = e.currentTarget.dataset.item;
        console.log("点击item")
    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadData();
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

    //  刷新数据
    // 下拉刷新数据
    onPullDownRefresh: function() {
        this.setData({
            currentPage: 1,
            isLastPage: false,
        });

        this.loadData();

    },



    // 上拉 刷新数据
    onReachBottom: function() {
        var temPage = this.data.currentPage + 1;
        this.setData({
            currentPage: temPage
        });

        this.loadData();

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})