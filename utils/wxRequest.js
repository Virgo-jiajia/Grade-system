const app2 = getApp();


function wxPromisify(fn) {

    return function(obj = {}) {
        return new Promise((resolve, reject) => {

            obj.success = function(res) {
                //成功
                resolve(res)
            }
            obj.fail = function(res) {
                //失败

                wx.hideLoading();
                wx.showToast({
                    title: '请求超时',
                    icon: 'none'
                })
                reject(res)
                console.log("超时 le")
            }
            fn(obj)
        })
    }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function(callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};
/**
 * 请求get方法需要token
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {

    var getRequest = wxPromisify(wx.request);
    var temHeaderDic = {
        // "Cache-Control": "no-cache",
        "Content-Type": "multipart/form-data",
        // "XX-Device-Type": "wxapp",
        // "XX-Api-Version": "1.0",
    }
    if (wx.getStorageSync("accessToken")) {
        temHeaderDic = {
            // "Cache-Control": "no-cache",
            "Content-Type": "multipart/form-data",
            // "XX-Device-Type": "wxapp",
            // "XX-Api-Version": "1.0",
            'Authorization': 'Bearer ' + wx.getStorageSync("accessToken"),
            'Access-Subject': wx.getStorageSync("accessSubject")
        }
    }

    return getRequest({
        url: url,
        method: "GET",
        data: data,
        header: temHeaderDic,
    })
}



/**
 * 请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {

    var postRequest = wxPromisify(wx.request);
    var temHeaderDic = {
        // "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        // "XX-Device-Type": "wxapp",
        // "XX-Api-Version": "1.0",
    }
    if (wx.getStorageSync("accessToken")) {
        temHeaderDic = {
            // "Cache-Control": "no-cache",
            // "XX-Device-Type": "wxapp",
            // "XX-Api-Version": "1.0",
            // "XX-Token": wx.getStorageSync("accessToken"),
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + wx.getStorageSync("accessToken"),
            'Access-Subject': wx.getStorageSync("accessSubject")
        }
    }

    return postRequest({
        url: url,
        method: "POST",
        data: data,
        header: temHeaderDic,
    })

}


module.exports = {
    postRequest: postRequest,
    getRequest: getRequest,
}