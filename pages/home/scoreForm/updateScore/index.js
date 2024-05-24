var wxRequest = require('../../../../utils/wxRequest')
var Api = require('../../../../utils/API')
var util = require('../../../../utils/util')
Page({
    data: {
        index: 0,
        courses: [
            { title: '出勤(5%)', rate: '0.05', first: true },
            { title: '课堂表现(10%)', rate: '0.1' },
            { title: '作业(10%)', rate: '0.1' },
            { title: '技能训练(10%)', rate: '0.1' },
            { title: '二、技能考核(15%)', rate: '0.15' },
            { title: '三、中断测试(20%)', rate: '0.2' },
            { title: '四、学期考试(30%)', rate: '0.3' },
        ],
        total: 0,
        buttons: [{ id: 2, name: '需补考' }, { id: 3, name: '需缓考' }],
    },
    // 更新成绩
    onLoad: function(options) {
        this.setData({
            buttons: this.data.buttons,
        })
        this.totalScore();
        this.getHistroy(options.id)
    },
    // 获取历史成绩
    getHistroy(id) {
        wx.showLoading({
            title: '加载中',
        })
        let url = Api.getHistoryScoreDetail() + `?flow_id=${id}`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                let data = res.data.data
                this.setData({
                    className: data.classInfo.class_name,
                    teacherName: data.classInfo.class_master_teacher,
                    stuName: data.studentInfo.student_name,
                    logId: data.scoreDetail.id,
                    subjectTag: data.subjectInfo.subject_tag,
                })
                var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
                    'skill_training_score', 'skill_examine_score', 'mid_stage_test_score', 'semester_test_score'
                ]
                temp.forEach(item => {
                    this.setData({
                        [`courses[${temp.indexOf(item)}].score`]: Number(data.scoreDetail[item])
                    })
                })
            }
        }).finally(() => {
            setTimeout(function() {
                wx.hideLoading()
            }, 0)
        })
    },
    // 补考缓考
    radioButtonTap(e) {
        let id = e.currentTarget.dataset.id
        for (let i = 0; i < this.data.buttons.length; i++) {
            if (this.data.buttons[i].id == id) {
                let checked = this.data.buttons[i].checked;
                this.data.buttons[i].checked = checked ? false : true;
            } else {
                this.data.buttons[i].checked = false;
            }
        }
        this.setData({
            buttons: this.data.buttons,
            status: id // 2:需补考 3:需缓考
        })
    },
    // 输入框 数字1-100
    getIntegral: function(e) {
        var index = e.currentTarget.dataset.index;
        var score = e.detail.value;
        if (score <= 100) { // 判断value值是否小于等于100, 如果大于100限制输入100
            if (score == '') { // 判断value值是否等于空,为空integral默认0,
                this.setData({
                    [`courses[${index}].score`]: 0,
                })
            } else {
                this.setData({
                    [`courses[${index}].score`]: Number(score),
                })
            }
        } else {
            wx.showToast({
                title: '最多可输入100分, 请重新输入',
                icon: 'none',
            })
            this.setData({
                [`courses[${index}].score`]: 100,
            })
        }
        this.totalScore();
    },
    // 总成绩
    totalScore: function() {
        var sum = 0
        for (var i = 0; i < this.data.courses.length; i++) {
            if (this.data.courses[i].score) {
                sum += this.data.courses[i].score * this.data.courses[i].rate;
            } else {
                sum += 0;
            }
        }
        this.setData({
            total: sum.toFixed(2)
        })
    },
    // 备注信息
    getRemark: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    submitForm: function() {
        var url = Api.postUpdateScore() + `?log_id=${this.data.logId}&subject_tag=${this.data.subjectTag}`
        var data = {}
        var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
            'skill_training_score', 'skill_examine_score', 'mid_stage_test_score', 'semester_test_score'
        ]
        temp.forEach(item => {
            data[item] = this.data.courses[temp.indexOf(item)].score
        })
        data.status = this.data.status ? this.data.status : 1
        var postData = wxRequest.postRequest(url, data)
        postData.then(res => {
            if (res.data.status == 'SUCCESS') {
                util.showToast('成绩更新成功')
                wx.navigateBack({
                    delta: 1
                });
            } else {
                util.showToast(res.data.msg)
            }
        })
    }
})