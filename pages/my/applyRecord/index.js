var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest')
var util = require('../../../utils/util.js')
Page({
    data: {
        tabs: ['全部', '审核中', '审核通过', '审核拒绝'],
        tabIndex: 0,
        records: []
    },
    onLoad() {
        this.getRecords()
    },
    // 获取申请记录 全部 审核中 审核通过 审核拒绝
    getRecords() {
        let url = Api.getApprovalList() + `?page=1&status=`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                let arr = res.data.data.paginator.items
                this.setData({
                    // todo 已完成的流程如何显示
                    records: arr,
                    loadingRecords: arr.filter(item => item.flow_status == 4),
                    successRecords: arr.filter(item => item.flow_status == 1 || item.flow_status == 5),
                    failRecords: arr.filter(item => item.flow_status == 2),
                })
            }
        })
    },
    onTabClick(e) {
        this.getRecords()
        let id = e.currentTarget.id;
        this.setData({
            tabIndex: id,
        })
    },
})