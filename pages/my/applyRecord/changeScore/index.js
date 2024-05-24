var Api = require('../../../../utils/API.js')
var wxRequest = require('../../../../utils/wxRequest')
var util = require('../../../../utils/util.js')
Page({
    data: {
        imageUrl: '',
        desc: '',
        images: [],
        imagesFront: []
    },
    onLoad: function(options) {
        this.setData({
            id: options.id,
            flowId: options.flowId,
            subjectTag: options.subjectTag,
        })
    },
    // 选择图片
    chooseImage() {
        if (this.data.images.length >= 5) {
            util.showToast('最多上传5张图片')
            return;
        }
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: (res) => {
                res.tempFiles.forEach(item => {
                    let path = item.tempFilePath
                    this.postImg(path)
                    let tempArr = this.data.imagesFront
                    tempArr.push(path)
                    this.setData({
                        imagesFront: tempArr
                    })
                })
            }
        })
    },
    // 上传到服务器
    postImg(path) {
        let url = Api.postThumb()
        wx.uploadFile({
            url: url,
            filePath: path,
            name: 'file',
            header: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + wx.getStorageSync("accessToken"),
                'Access-Subject': wx.getStorageSync("accessSubject")
            },
            success: (res) => {
                let resp = JSON.parse(res.data);
                if (resp.status == 'SUCCESS') {
                    util.showToast('上传图片成功')
                    let imageUrl = resp.data.uploadedResult.savePath;
                    let arr = this.data.images;
                    arr.push(imageUrl);
                    this.setData({
                        images: arr
                    })
                }
            },
            fail: () => {},
            complete: () => {}
        });
    },
    // 删除图片
    deleteImg: function(e) {
        var imagesFront = this.data.imagesFront;
        var index = e.currentTarget.dataset.index;
        imagesFront.splice(index, 1);
        this.setData({
            imagesFront: imagesFront
        });
    },
    // 预览图片
    previewImg: function(e) {
        var index = e.currentTarget.dataset.index;
        var imagesFront = this.data.imagesFront;

        wx.previewImage({
            current: imagesFront[index],
            urls: imagesFront
        })
    },
    // 获取备注信息
    textareaInput(e) {
        this.setData({
            desc: e.detail.value
        })
    },
    // 提交图片和备注
    postScore() {
        // 如果flowId存在，则走重新提交
        if (this.data.flowId) {
            let url = Api.postReSubmitApproval() + `?flow_id=${this.data.flowId}`
            let data = {
                thumbs: this.data.images,
                description: this.data.desc,
            }
            let postData = wxRequest.postRequest(url, data);
            postData.then(res => {
                if (res.data.status == 'SUCCESS') {
                    util.showToast('上传成功')
                    this.setData({
                        images: [],
                        imagesFront: [],
                        desc: ''
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }, 1000)
                } else {
                    util.showToast(res.data.msg)
                }
            })
        } else {
            let url = Api.postModifyScore();
            let data = {
                id: Number(this.data.id),
                thumbs: this.data.images,
                description: this.data.desc,
                subject_tag: Number(this.data.subjectTag),
            }
            let postData = wxRequest.postRequest(url, data);
            postData.then(res => {
                if (res.data.status == 'SUCCESS') {
                    this.setData({
                        images: [],
                        imagesFront: [],
                        desc: ''
                    })
                    wx.navigateTo({
                        url: '/pages/my/historyInfo/index'
                    });

                } else {
                    util.showToast(res.data.msg)
                }
            })
        }
    },
})