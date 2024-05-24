var util = require('../util.js');
var Api = require('../API.js');
var wxRequest = require('../wxRequest.js');



// <!-- -------------------1.访问相册授权------------------- -->
// ！！！  需要 全局记录 要下载的图片链接 
// wx.getStorageSync('CurrentShareImage')

// 1.0 点击授权
function saveImg() {
  //获取相册授权
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.writePhotosAlbum'] != undefined && res.authSetting['scope.writePhotosAlbum'] != true) {
        wx.showModal({
          title: '请求授权访问相册',
          content: '授权访问相册，方可保存图片到相册。',
          success: function (res) {
            if (res.cancel) {
              util.showToast("拒绝授权!");

            } else if (res.confirm) {
              // 进入授权页面
              openSetting();
            }
          }
        })
      } else if (res.authSetting['scope.writePhotosAlbum'] == undefined) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() { //这里是用户同意授权后的回调
            savaImageToPhoto();
          },
          fail() { //这里是用户拒绝授权后的回调
            console.log("禁止授权")
          }
        })

      } else { //用户已经授权过了
        savaImageToPhoto();
      }
    }
  })
}


// 1.2 从授权 页面返回后 调用该 方法 是否进入 设置页面
function openSetting() {
  wx.openSetting({
    success: function (dataAu) {
      if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
        util.showToast("授权成功!");

        //记录已授权
        savaImageToPhoto();
      } else {
        util.showToast("授权失败!");

      }
    }
  })
}

// 1.3 保存 到 相册
function savaImageToPhoto() {
  wx.showLoading({
    title: '正在保存',
    mask: true,
  })
  wx.downloadFile({
    url: wx.getStorageSync('CurrentShareImage'), //仅为示例，并非真实的资源
    success: function (res) {
      var tempFilePath = res.tempFilePath
      setTimeout(function () {
        wx.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success(res) {
            util.showToast("图片已保存到相册，赶紧晒一下吧~")

          },
          fail: function (ress) {
            if (ress.errMsg.indexOf("cancel")) {
              util.hideLoading()
              util.showToast("保存失败!");
            }

          },
          complete: function (res) {

          }
        });
      }, 1000);

    }

  })

}
// <!-- -------------------1.访问相册授权 end------------------- -->






module.exports = {
  // 1.授权 保存图片到相册
  saveImgToAlbum: saveImg,

}