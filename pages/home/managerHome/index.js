const tabService = require('../../../utils/tab-service');
var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest')
var util = require('../../../utils/util.js')
Page({
    data: {
        tabs: ['全部', '审核中', '审核通过', '审核拒绝'],
        tabIndex: 0,
        records: [],
        isAdmin: true,
    },
    onLoad() {
        let temp = wx.getStorageSync('accessSubject');
        tabService.updateRole(this, temp)
        this.getRecords()
    },
    // 获取所有审批数据 tab 显示
    getRecords() {
        let url = Api.getApprovalForAdmin() + `?page=1&status=`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                let arr = res.data.data.paginator.items
                this.setData({
                    records: arr,
                    loadingRecords: arr.filter(item => item.flow_status == 4),
                    successRecords: arr.filter(item => item.flow_status == 1 || item.flow_status == 5),
                    failRecords: arr.filter(item => item.flow_status == 2),
                })
            }
        })
    },
    onTabClick(e) {
        let id = e.currentTarget.id;
        this.setData({
            tabIndex: id,
        })
        this.getRecords();
    },
    onShow() {
        tabService.updateIndex(this, 0)
        this.getRecords()
    }
})