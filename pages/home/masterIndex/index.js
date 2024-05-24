// 班主任-历史录入页面
var Api = require('../../../utils/API.js')
var wxRequest = require('../../../utils/wxRequest.js')
var util = require('../../../utils/util.js')
Page({
    data: {
        subs: [],
        scores: [],
        index: 0,
        subIndex: 0,
        isFirst: false,
        isFirstSub: false,
        isTeacher: false,
    },
    onLoad: function(options) {
        this.getStudentList()
        this.setData({
            classId: Number(wx.getStorageSync('classId')),
            className: wx.getStorageSync('className')
        })
        if (wx.getStorageSync('accessSubject') == 'teacher') {
            this.setData({
                isTeacher: true
            })
        } else if (wx.getStorageSync('accessSubject') == 'classMaster') {
            this.setData({
                isMaster: true
            })
        }
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
        if (this.data.subjectId == 0) {
            this.getHistoryOperation()
        } else {
            this.getHistory()
        }
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
    // 获取学生历史成绩列表 - 校内 校外
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

    getStudentList() {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;
        var classId = wx.getStorageSync('classId');
        var url = Api.getStudentList() + `?class_id=${classId}`;
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                that.setData({
                    students: res.data.data.students,
                })
            } else {
                util.showToast(res.data.msg)
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },

    // 获取学生历史成绩列表-操行分
    async getHistoryOperation() {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getHistoryScore() + `?class_id=${this.data.classId}&subject_id=0&subject_tag=1`
        let getData = wxRequest.getRequest(url);
        await getData.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    historyScores: res.data.data.paginator.items,
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 1000)
        })
    },

    gotoChange(e) {
        let stuId = e.currentTarget.dataset.stuid;
        let stuName = e.currentTarget.dataset.stuname;
        wx.setStorageSync('stuId', stuId);
        wx.setStorageSync('stuName', stuName);
        wx.navigateTo({
            url: `/pages/home/scoreForm/operation/index`
                // classid studentid
        });
    },
})