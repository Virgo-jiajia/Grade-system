var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest')
var util = require('../../../utils/util.js')
Page({
    data: {
        classes: [],
        subs: [],
        class: '',
        scores: [],
        index: 0,
        subIndex: 0,
        isFirst: false,
        isFirstSub: false,
        isTeacher: false,
    },
    onLoad: function(options) {
        this.getClassList()
        if (wx.getStorageSync('accessSubject') == 'teacher') {
            this.setData({
                isTeacher: true
            })
        } else if (wx.getStorageSync('accessSubject') == 'classMaster') {
            this.setData({
                isMaster: true
            })
        }
    },
    // todo 首次进入页面
    // 选择班级
    pickerChangeClass: function(e) {
        let tempClass = this.data.classes[e.detail.value] // 选中的class
        this.setData({
            isFirst: true,
            index: e.detail.value,
            classId: tempClass.id,
            className: tempClass.class_name,
            masterName: tempClass.teacher_name,
            // 初始化subject
            isFirstSub: false,
            class: ''
        })
        this.getSubsAll()
    },
    // 选择科目
    pickerChangeSub: function(e) {
        let tempSub = this.data.subs[e.detail.value] // 选中的subject
        this.setData({
            isFirstSub: true,
            subIndex: e.detail.value,
            subjectId: tempSub.subject_id,
            subjectTag: tempSub.subject_tag,
            class: tempSub.subject_name
        })
        this.getHistory()
    },
    // 获取班级列表
    getClassList() {
        var that = this
        var url = '';
        url = Api.getClassList() + `?page=1`;
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                that.setData({
                    classes: res.data.data.paginator.data
                })
            } else {
                util.showToast(res.data.msg)
            }
        })
    },
    // 获取科目列表
    async getSubsAll() {
        // class下所有课程&subject_type=inSide outSide
        let url = Api.getTeacherSubject() + `?class_id=${this.data.classId}&subject_type=inSide`
        let url1 = Api.getTeacherSubject() + `?class_id=${this.data.classId}&subject_type=outSide`
        var getDataIn = wxRequest.getRequest(url);
        var getDataOut = wxRequest.getRequest(url1)
        await getDataIn.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    subsIn: res.data.data.subjects
                })
            } else {
                util.showToast(res.data.msg)
            }
        })
        await getDataOut.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    subsOut: res.data.data.subjects
                })
            } else {
                util.showToast(res.data.msg)
            }
        })
        setTimeout(() => {
            if (this.data.isMaster) {
                let subsOp = [{
                        subject_id: 0,
                        subject_name: "操行分",
                        subject_tag: 1,
                    }]
                    // 如果是班主任，则需要操行分
                this.setData({
                    subs: [...this.data.subsIn, ...this.data.subsOut, ...subsOp]
                })
            } else {
                // 结合校内成绩 校外成绩的所有课程
                this.setData({
                    subs: [...this.data.subsIn, ...this.data.subsOut]
                })
            }
            // console.log(this.data.subs, 'all')
            if (this.data.subs.length == 0) {
                util.showToast('暂无科目信息，请重新选择班级')
            }
        }, 0)
    },
    // 获取学生历史成绩列表
    getHistory() {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getHistoryScore() + `?class_id=${this.data.classId}&subject_id=${this.data.subjectId}&subject_tag=${this.data.subjectTag}`
        let getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    scores: res.data.data.paginator.items,
                    teacherName: res.data.data.paginator.items[0].teacher_name
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    // 跳转修改成绩页面
    gotoChange(e) {
        var id = e.currentTarget.dataset.id; // 成绩记录id
        wx.navigateTo({
            url: `/pages/my/applyRecord/changeScore/index?id=${id}&subjectTag=${this.data.subjectTag}`,
        });

    }
})