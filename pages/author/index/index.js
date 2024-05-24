var util = require('../../../utils/util.js')
var CBR = require('../../../utils/common/comBasicRequest.js');

Page({
  data: {
  },

  onShow: function () {
    //勿删！！！ 特殊情况处理
    wx.login({});

  },


  onLoad: function (options) {

  },

  // 1.点击授权
  tapAuthor: function (e) {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        CBR.getNickAuthorLogined(res);
      },
      fail: res => {
        console.log("获取用户信息失败", res)
      }
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return util.shareHome();
  }
})