
var CBR = require('/utils/common/comBasicRequest.js');

App({
  // 1.常用工具类
  util:require('./utils/util.js'),
  // 2.请求封装
  wxRequest:require('./utils/wxRequest.js'),
  // 3.接口api 配置
  Api:require('./utils/API.js'),
  
  onLaunch: function () {
    // 1.强制更新
    CBR.wxAutoUpdate();

    // 2.判定是否走2021.4月份新规授权方式，
    //2022.2 V1.0.0 版本 有关系统授权，只处理最新版的授权方式
    var temCanGetProfile = false;
    if (wx.getUserProfile) {
      temCanGetProfile = true;
    }

    const self = this
    wx.getSystemInfo({
      success(res) {

        self.systemInfo = res

        var model = res.model;
        //0. px转换到rpx的比例
        let pxToRpxScale = 750.0 / self.systemInfo.windowWidth;
        //1.1. !!!!右侧胶囊 rect 单位px    
        let menuButtonRect = wx.getMenuButtonBoundingClientRect();

        //1.2. 状态栏的高度
        let temStatusBarHeight = self.systemInfo.statusBarHeight;
        let ktxStatusHeight = temStatusBarHeight * pxToRpxScale;
        // 导航栏高度
        let navigationHeight = ((menuButtonRect.top - temStatusBarHeight) * 2 + menuButtonRect.height) * pxToRpxScale;


        //1.3. window的高度
        let ktxWindowHeight = self.systemInfo.windowHeight * pxToRpxScale;
        //1.4.屏幕的高度
        let ktxScreentHeight = self.systemInfo.screenHeight * pxToRpxScale;
        //1.5. 底部tabBar的高度
        let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight;
        var temSafeViewH = self.calculateRpx(res.windowWidth, res.windowHeight, res.safeArea.height);

        // 2. iphonex 判定
        let temIpx = false;
        let temSafeBottom = 0;
        let totalTopHeight = 68 * pxToRpxScale;
        //iphoneX 以及 10 以后的所有 版本
        //建议使用 css有关参数判定 底部安全距离
        if (model.search('iPhone X') != -1 || model.search('iPhone 1') != -1) {
          temIpx = true;
          temSafeBottom = self.calculateRpx(res.windowWidth, res.windowHeight + 34, 34);
          // 2.1. iPhoneX 高度 
          totalTopHeight = 88 * pxToRpxScale;

        } else {
          temIpx = false;
          temSafeBottom = 0;
          // 2.1 非iphoneX的 iphone 高度
          totalTopHeight = 64 * pxToRpxScale;
        }


        var temSystemInfoDic = {
          windowHeight: ktxWindowHeight,
          safeBottom: temSafeBottom,
          ratio: pxToRpxScale,
          safeViewH: temSafeViewH,
          tabbarH: tabBarHeight,
          isIpx: temIpx,
          statusHeight: ktxStatusHeight,
          titleBarHeight: totalTopHeight - ktxStatusHeight,
          canGetProfile: temCanGetProfile,
          // !!!!右侧胶囊 rect 单位px   
          menuButtonRect:menuButtonRect
        }


        var orgainPage = Page;
        Page = function (e) {
          e.data = {
            ...e.data,
            systemInfoDic: temSystemInfoDic
          }
          orgainPage(e)
        }

      }
    })



  },



  // px 转换 rpx
  calculateRpx: function (ww, hh, cusH) {
    // 获取可使用窗口宽度
    let clientHeight = hh;
    // 获取可使用窗口高度
    let clientWidth = ww;
    // 算出比例
    let ratio = 750 / clientWidth;
    // // 记录 rpx -- px 兑换比例
    // 算出高度(单位rpx)
    let height = clientHeight * ratio;

    if (cusH) {
      return cusH * ratio;
    } else {
      return height;
    }

  },


})