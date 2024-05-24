var util = require('../../../utils/util.js')
var wxRequest = require('../../../utils/wxRequest')
var Api = require('../../../utils/API.js')
const tabService = require('../../../utils/tab-service')

Page({
    data: {
        // 17634295627 q123456
        username: '',
        phone: '',
        password: '',
        role: '',
        showPassword: true
    },
    onLoad: function(options) {
        if (options.role) {
            this.setData({
                role: options.role
            })
        }
    },
    // 输入姓名 失去焦点赋值
    userBlur(e) {
        if (!e.detail.value) {
            util.showToast('请输入姓名')
        } else {
            this.username = e.detail.value
        }
    },
    // 输入手机号 校验数字
    phoneInput(e) {
        if (!util.isNumber_Regular(e.detail.value)) {
            util.showToast('请输入数字')
        }
    },
    // 输入手机号 失去焦点赋值
    phoneBlur(e) {
        let test = util.isTel(e.detail.value)
        if (!test) {
            util.showToast('请输入正确手机号')
        } else {
            this.phone = e.detail.value
        }
    },
    // 输入密码 失去焦点赋值
    passBlur(e) {
        // 初次登录 密码校验 todo 确认
        if (!e.detail.value) {
            util.showToast('请输入密码')
        } else {
            this.password = e.detail.value
        }
    },
    // 提交表单
    async submitForm() {
        // todo 判断是否首次登录 是-> 跳转到修改密码页面 否-> 登录
        if (!this.username || !this.phone || !this.password) {
            wx.showModal({
                title: '提示',
                content: '请输入完整信息',
                showCancel: false,
                success(res) {}
            })
        } else {
            wx.showLoading({
                title: '加载中...',
            })
            let data = { username: this.username, account: this.phone, password: this.password, role: this.data.role }
                // console.log(data, 'data') // 手机号 密码 17634295627 q123456  12As%^11
            let url = Api.postLogin();
            var postData = wxRequest.postRequest(url, data);
            await postData
                .then(res => {
                    // console.log(res.data.data.tokenBags.accessToken, 'token')
                    if (res.data.status == "SUCCESS") {
                        wx.hideLoading()
                        util.showToast("登录成功！")
                            // 存储用户信息
                        wx.setStorageSync("accessToken", res.data.data.tokenBags.accessToken);
                        wx.setStorageSync("accessSubject", res.data.data.tokenBags.accessSubject);
                        wx.setStorageSync("avatar", res.data.data.userInfo.avatar);
                        wx.setStorageSync("mobile", res.data.data.userInfo.mobile);
                        wx.setStorageSync("nickname", res.data.data.userInfo.nickname);
                        let temp = wx.getStorageSync('accessSubject');
                        tabService.updateRole(this, temp)
                        if (temp == 'manager') {
                            setTimeout(function() {
                                wx.switchTab({
                                    url: '/pages/home/managerHome/index',
                                });
                            }, 1000)
                        } else {
                            setTimeout(function() {
                                wx.switchTab({
                                    url: '/pages/home/class/index',
                                });
                            }, 1000)
                        }
                    } else {
                        wx.hideLoading()
                        wx.showToast({
                            title: res.data.msg + '请确认身份后登陆',
                            duration: 2000,
                            icon: 'none',
                        })
                    }
                });
        }
    },
})