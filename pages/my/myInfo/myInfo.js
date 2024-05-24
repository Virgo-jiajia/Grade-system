// pages/my/myInfo/myInfo.js
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //1.头像
        addImgStr: "/images/icon/avatar.png",
        uploadImgs: [],
        uploadMaxCount: 1,

        // 2.输入框
        nickStr: "",
        nameStr: "",
        positionStr: "",
        companyStr: "",
        cateStr: "",
    },
    // 1.头像
    tapUpLoadImg: util.throttle(function(e) {

        var that = this;
        // 1. 系统接口
        console.log("点击头像");
        var that = this
            // 1. 系统方法  选择图片 获取路径
        wx.chooseMedia({
            count: 1,
            mediaType: ["image"],
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
            success: function(res) {
                console.log('临时路径：' + res.tempFiles[0])
                util.showLoadingNoLimitTime("上传图片中...")
                    // 1.1 上传 选择的图片
                wx.uploadFile({
                    // 1.1.1  上传 接口
                    url: Api.uploadPics(),
                    // 1.1.2  系统的返回的图片 地址（此处是上传一张图片）
                    filePath: res.tempFiles[0].tempFilePath,
                    // 1.1.3  与后台有关
                    name: 'file',
                    // header: { "Content-Type": "multipart/form-data" },
                    // 1.1.4  必要的传参
                    formData: {
                        token: wx.getStorageSync("token")
                    },
                    success: function(result) {

                        //1.2  上传成功后的路径： 转成JSON  格式
                        var jsonText = JSON.parse(result.data);

                        setTimeout(function() {
                                wx.hideLoading()
                            }, 1000)
                            // 1.3 上传成功后 将程序中的老图片给成 新图片
                        if (jsonText.code == 1) {
                            var img = jsonText.data;

                            that.setData({
                                uploadImgs: [img]
                            })

                            //缓存图片
                            wx.setStorageSync('userAvatarUrl', img)
                        }
                    },
                    fail() {
                        util.hideLoading();
                    }
                })
            },
            fail() {
                util.hideLoading();
            },

        })


    }, 300),
    // 2.2 删除图片
    tapUpLoadImgDel(e) {
        var temIndex = e.currentTarget.dataset.index;
        var temArr = this.data.uploadImgs;
        temArr.splice(temIndex, 1);

        this.setData({
            uploadImgs: temArr
        })

    },
    // 2.3.预览
    tapPreviewImage(e) {

        var temIndex = e.currentTarget.dataset.index;
        console.log(temIndex)
        var temUploadImgs = this.data.uploadImgs;
        wx.previewImage({
            urls: temUploadImgs,
            current: temUploadImgs[temIndex]
        })
    },

    // 1.页面跳转
    tapPushPage(e) {
        var temUrl = e.currentTarget.dataset.url;
        // wx.navigateTo({
        //   url: temUrl,
        // })
        console.log(temUrl)
    },
    // 2.退出登录
    tapQuit() {
        wx.showModal({
            title: '提示',
            content: '是否确认退出！',
            success(res) {
                if (res.confirm) {

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    // 2.输入框
    bindNickStr(e) {
        this.setData({
            nickStr: e.detail.value
        })
    },
    bindNameStr(e) {
        this.setData({
            nameStr: e.detail.value
        })
    },
    bindPositionStr(e) {
        this.setData({
            positionStr: e.detail.value
        })
    },
    bindCompanyStr(e) {
        this.setData({
            companyStr: e.detail.value
        })
    },



    // 3.类型
    tapCate() {
        wx.navigateTo({
            url: '/pages/my/attentionType/attentionType',
        })
    },
    // 4.保存
    tapSave: util.throttle(function(e) {
        var tem01 = this.data.nameStr;
        if (util.isNullStr(tem01, "请填写姓名！")) {
            return;
        }
        var tem02 = this.data.positionStr;
        if (util.isNullStr(tem02, "请填写职位！")) {
            return;
        }

        var tem03 = this.data.companyStr;
        if (util.isNullStr(tem03, "请填写公司！")) {
            return;
        }

        var tem04 = this.data.cateStr;
        if (util.isNullStr(tem04, "请选择类型！")) {
            return;
        }
        var tem05 = '';
        if (this.data.uploadImgs.length == 1) {
            tem05 = this.data.uploadImgs[0]
        }
        var url = Api.postMyInfoData();
        var data = {
            user_nickname: this.data.nickStr,
            user_login: tem01,
            position: tem02,
            company: tem03,
            tags: this.data.cateStr_id,
            avatar: tem05
        }
        var postData = wxRequest.postRequest(url, data);
        postData
            .then(res => {
                if (res.data.code == 1) {
                    util.showToast("保存成功！")

                    setTimeout(function() {
                        wx.navigateBack({
                            delta: 0,
                        })
                    }, 1000)
                } else {
                    util.showToast(res.data.msg)
                }
            });

    }, 500),


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.loadData();
    },
    // a1. 加载数据
    // loadData() {
    //     var url = Api.getMyInfoData();
    //     var data = {}
    //     var postData = wxRequest.postRequest(url, data);
    //     postData
    //         .then(res => {
    //             if (res.data.code == 1) {
    //                 var temData = res.data.data;
    //                 var temData_user = res.data.data.data;
    //                 var temTags = temData.tags;
    //                 if (temData_user.tags) {
    //                     var temTags_user = temData_user.tags.split(",");
    //                     var temTags_slt = [];
    //                     for (var i = 0; i < temTags.length; i++) {

    //                         for (var m = 0; m < temTags_user.length; m++) {
    //                             if (temTags_user[m] == temTags[i].id) {
    //                                 temTags_slt = temTags_slt.concat(temTags[i])
    //                             }
    //                         }
    //                     }
    //                     console.log(temTags_slt);
    //                     if (temTags_slt.length > 0) {
    //                         wx.setStorageSync('SltTypeList', temTags_slt);
    //                         this.changeCateDataWithCates(temTags_slt);
    //                     }


    //                 }
    //                 var temImgs = [];
    //                 if (temData_user.avatar.length > 0) {
    //                     temImgs = [temData_user.avatar];
    //                 }


    //                 this.setData({
    //                     backData: temData,
    //                     nickStr: temData_user.user_nickname,
    //                     nameStr: temData_user.user_login,
    //                     positionStr: temData_user.position,
    //                     companyStr: temData_user.company,
    //                     uploadImgs: temImgs,
    //                     // cateStr: temData_user.user_nickname,
    //                 })

    //                 wx.setStorageSync('Tags', temTags);
    //             } else {
    //                 util.showToast(res.data.msg)
    //             }
    //         });

    // },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var temArr = wx.getStorageSync('SltTypeList');
        if (temArr) {
            this.changeCateDataWithCates(temArr);
        }
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