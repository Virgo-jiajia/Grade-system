var util = require('../../../utils/util.js')
var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest')
Page({
    data: {
        oldPass: '',
        newPass: '',
        newAgainPass: '',
        showPasswordArr: [true, true, true]
            // [true,true,true]
    },
    // 密码 显示隐藏
    togglePass(e) {
        const index = e.currentTarget.dataset['index'];
        let temp = this.data.showPasswordArr[index];
        this.data.showPasswordArr.splice(index, 1, !temp)
        this.setData({
                showPasswordArr: this.data.showPasswordArr
            })
            // console.log(this.data.showPasswordArr, 'index')
    },
    // 失去焦点时 获取旧密码
    oldPassBlur(e) {
        if (!e.detail.value) {
            util.showToast('请输入旧密码')
        } else {
            this.oldPass = e.detail.value
        }
    },
    // 失去焦点时 获取新密码
    newPassBlur(e) {
        if (!util.isNewPassword(e.detail.value)) {
            wx.showToast({
                title: '密码中同时含大写字母、小写字母、数字和特殊字符且长度在8-16之间',
                icon: 'none',
                duration: 1500,
                mask: false,
            });
        } else {
            this.newPass = e.detail.value
        }
    },
    // 失去焦点时 获取确认新密码
    newPassAgainBlur(e) {
        if (!util.isNewPassword(e.detail.value)) {
            wx.showToast({
                title: '密码中同时含大写字母、小写字母、数字和特殊字符且长度在8-16之间',
                icon: 'none',
                duration: 1500,
                mask: false,
            });
        } else {
            this.newAgainPass = e.detail.value
        }
    },
    // 提交密码表单
    savePass() {
        if (!this.oldPass || !this.newPass || !this.newAgainPass) {
            wx.showModal({
                title: '提示',
                content: '请输入完整信息',
                showCancel: false,
                success(res) {}
            })
        } else {
            let data = {
                "old_password": this.oldPass,
                "new_password": this.newPass,
                "confirm_password": this.newAgainPass
            }
            let url = Api.resetPassword();
            var postData = wxRequest.postRequest(url, data);
            postData.then(res => {
                if (res.data.status == "SUCCESS") {
                    util.showToast("修改密码成功！")
                    setTimeout(function() {
                        wx.navigateTo({
                            url: '/pages/home/login/index',
                            success: (result) => {},
                            fail: () => {},
                            complete: () => {}
                        });
                    }, 1000)
                } else {
                    util.showToast(res.data.msg)
                }
            })
        }
    }
})