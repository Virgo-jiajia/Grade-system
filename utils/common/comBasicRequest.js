var util = require('../util.js')
var Api = require('../API.js')
var wxRequest = require('../wxRequest.js')

// 1.手机号 授权
// 1.1 手机号授权
function getTelNumAuthorLogined(telData) {
    util.showLoadingNoLimitTime("获取手机号授权中...");

    //  1.获取 code
    wx.login({
        success: res => {
            setTimeout(() => {
                if (res.code) {
                    var url = Api.postTelAuthor();
                    var data = {
                        'js_code': res.code
                    }
                    var postData = wxRequest.postRequest(url, data);

                    // 2. 获取 openID
                    postData
                        .then(res => {
                            // util.showToast(res);
                            if (res.data.code == 1) {

                                postTelDecode(res.data.data, telData)

                            } else {

                                util.hideLoading();
                                util.showToast("授权失败！")
                            }
                        })

                }
            }, 1500);

        }

    })

}

// 1.2.获取手机号 加密信息 给 后台
function postTelDecode(backData, telData) {
    var url = Api.postTelDecode();
    var data = {
        'encryptedData': telData.detail.encryptedData,
        'iv': telData.detail.iv,
        'session_key': backData.session_key
    }
    var postData = wxRequest.postRequest(url, data);

    // 2. 获取 openID
    postData
        .then(res => {

            if (res.data.code == 1) {

                util.hideLoading();
                var curPage = util.getCurShowPage();

                curPage.data.isGetTel = true;
                curPage.onShow();

            } else {

                util.hideLoading();
                util.showToast("授权失败！")

            }

        })

}





// 2.0 头像 授权
// 2.1. 获取微信头像昵称 信息 发送给 后台 zhib
function getNickAuthorLogined(userProfileDic) {

    util.showLoadingNoLimitTime("授权中...")
        //  1.获取 code
    wx.login({
        success: res => {
            var code = res.code;
            var data = {
                code: code,
                encrypted_data: userProfileDic.encryptedData,
                iv: userProfileDic.iv,
                signature: userProfileDic.signature,
                raw_data: userProfileDic.rawData,
            }

            postAuthorInfo(data)
        },
        fail(ress) {
            console.log(ress)
        }
    })

}


// 2.2.发送授权信息 给后台
function postAuthorInfo(data) {
    var url = Api.postNameAuthorInfo();
    var getOpenId = wxRequest.postRequest(url, data);

    // 2. 获取 openID
    getOpenId
        .then(res => {
            // util.showToast(res);
            if (res.data.code == 1) {

                // 2.0 隐藏弹框
                util.hideLoading();

                util.showToast("授权完成！");
                setTimeout(() => {
                    // 2.1 存储 返回的信息
                    wx.setStorageSync("token", res.data.data.token);
                    wx.setStorageSync("isAuthor", true);
                    // 用户 ID 也是 分享的pid
                    wx.setStorageSync("uid", res.data.data.user.id);

                    wx.navigateBack({
                        delta: 0,
                    })
                }, 1000);


            } else {
                util.showToast(res.data.msg);
            }
        })
}


// 3.绑定上下级
function bindUpDowLevel(pid) {

    var url = Api.postUpDownLevel();
    var data = {
        up_1l: pid
    };

    var getData = wxRequest.postRequest(url, data);
    getData.then(res => {
        if (res.data.code == 1) {
            console.log("绑定成功了" + pid)
        } else {
            console.log("绑定过了")
        }
    })

}



// 10.强制 更新
function wxAutoUpdate() {
    // 获取小程序更新机制兼容

    if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
            //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function(res) {

            // 请求完新版本信息的回调
            if (res.hasUpdate) {

                //检测到新版本，需要更新，给出提示
                wx.showModal({
                    title: '更新提示',
                    content: '检测到新版本，是否下载新版本并重启小程序？',
                    success: function(res) {
                        if (res.confirm) {
                            //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                            downLoadAndUpdate(updateManager)
                        } else if (res.cancel) {
                            //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                            wx.showModal({
                                title: '温馨提示~',
                                content: '本次版本更新涉及到新的功能添加，部分旧版本无法正常访问的哦~',
                                showCancel: false, //隐藏取消按钮
                                confirmText: "确定更新", //只保留确定更新按钮
                                success: function(res) {
                                    if (res.confirm) {
                                        //下载新版本，并重新应用
                                        downLoadAndUpdate(updateManager)
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
    }
}

/**
 * 下载小程序新版本并重启应用
 */
function downLoadAndUpdate(updateManager) {
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function() {
        wx.hideLoading()
            //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
        wx.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
    })
}


module.exports = {
    // 1.手机号 授权
    getTelNumAuthorLogined: getTelNumAuthorLogined,

    // 2.0 头像 授权
    getNickAuthorLogined: getNickAuthorLogined,

    // 3.绑定上下级
    bindUpDowLevel: bindUpDowLevel,


    // 10.更新
    wxAutoUpdate: wxAutoUpdate

}