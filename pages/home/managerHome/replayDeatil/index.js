var Api = require('../../../../utils/API.js')
var wxRequest = require('../../../../utils/wxRequest')
var util = require('../../../../utils/util.js')
Page({
    data: {
        imageUrl: '',
    },
    onLoad: function(options) {
        this.setData({
            id: options.id,
        })
        this.getRecords()
        this.getApprovalDetail(options.id)
    },
    // 获取信息：班级、教师、学生等
    getRecords() {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getApprovalForAdmin() + `?page=1&status=`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                let arr = res.data.data.paginator.items
                    // 总数据 筛选出一条
                let temp = arr.filter(item => item.flow_id == Number(this.data.id))
                this.setData({
                    detail: temp[0],
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    // 获取审批详情
    getApprovalDetail(id) {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getApprovalDetailForAdmin() + `?flow_id=${id}`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                let flowDetail = res.data.data.flowDetail
                let meta = res.data.data.meta
                this.setData({
                        id: flowDetail.id,
                        desc: flowDetail.description,
                        images: flowDetail.thumbs,
                        ableApply: meta.ableApply,
                    })
                    // todo 暂无审核权限
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    previewImg: function(e) {
        var index = e.currentTarget.dataset.index;
        var images = this.data.images;

        wx.previewImage({
            current: images[index],
            urls: images
        })
    },
    // 同意审批 拒绝审批操作
    handle(e) {
        let url = Api.postApprovalReject() + `?flow_id=${this.data.id}`
        let type = e.currentTarget.dataset.type
        let data = {
            status: Number(type)
        }
        let postData = wxRequest.postRequest(url, data)
        postData.then(res => {
            if (res.data.status == 'SUCCESS') {
                util.showToast(res.data.msg)
                wx.switchTab({
                    url: '/pages/home/managerHome/index',
                });
            } else {
                util.showToast(res.data.msg)
            }
        })
    },
})