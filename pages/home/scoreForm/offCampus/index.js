var wxRequest = require('../../../../utils/wxRequest')
var Api = require('../../../../utils/API')
Page({
    data: {
        index: 0,
        scoreForm: {
            class_id: 1,
            status: 3,
            attendance_score: 80,
            classroom_performance_score: 80,
            homework_score: 80,
            skill_training_score: 90,
            skill_examine_score: 80,
            mid_stage_test_score: 80,
            semester_test_score: 80,
            remark: 80
        },
        courses: [
            { title: '思想品德(15%)', rate: 0.15 },
            { title: '出勤(20%)', rate: 0.2 },
            { title: '技能(20%)', rate: 0.2 },
            { title: '作业(15%)', rate: 0.15 },
            { title: '试卷(30%)', rate: 0.3 },
        ],
        total: 0,
        buttons: [{ id: 2, name: '需补考' }, { id: 3, name: '需缓考' }],
    },
    onLoad: function(options) {
        this.setData({
            buttons: this.data.buttons,
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            // teacherName: wx.getStorageSync('nickname'),
            stuName: wx.getStorageSync('stuName'),
        })
        this.totalScore();
        // this.getCanWrite();
    },
    // 需补考 需缓考 btn切换
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
            status: id
        })
    },
    // 输入框 分数校验
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
    // 总分数
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
    // 输入框备注 赋值
    getRemark: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    // todo 选科目
    // 判断学生是否修改过成绩
    getCanWrite: function() {
        let classId = Number(wx.getStorageSync('classId'));
        let subject_id = this.data.subjectId;
        let student_id = wx.getStorageSync('stuId')
        let url = Api.getCanWriteScore() + `?class_id=${classId}&subject_id=${subject_id}&student_id=${student_id}`
        let getData = wxRequest.getRequest(url)
        getData.then(res => {
            if (res.data.status == 'SUCCESS') {
                var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
                    'skill_training_score', 'skill_examine_score', 'mid_stage_test_score', 'semester_test_score'
                ]
                temp.forEach(item => {
                    this.setData({
                        [`courses[${temp.indexOf(item)}].score`]: Number(res.data.data.scoreInfo[item])
                    })
                })
                this.setData({
                    isSubmitted: res.data.data.isSubmitted,
                    finalScore: res.data.data.scoreInfo.final_score
                })
            }
        })
    },
    // 提交表单
    submitForm: function() {
        var url = Api.postStuOnCampusScore() + `?type=outSide&subject_tag=${this.data.subjectTag}`
        var data = {
            class_id: Number(wx.getStorageSync('classId')),
            status: this.data.status ? this.data.status : 1,
            attendance_score: 0,
            classroom_performance_score: 0,
            homework_score: 0,
            skill_training_score: 0,
            skill_examine_score: 0,
            mid_stage_test_score: 0,
            semester_test_score: 0,
            remark: this.data.remark
        }
        var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
            'skill_training_score', 'skill_examine_score', 'mid_stage_test_score', 'semester_test_score'
        ]
        temp.forEach(item => {
            data[item] = this.data.courses[temp.indexOf(item)].score
        })
        console.log(url, data, '传递的数据-校外成绩')
        var postData = wxRequest.postRequest(url, data)
        postData.then(res => {
            if (res.data.status == 'SUCCESS') {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000,
                    success: function() {
                        setTimeout(function() {
                            wx.navigateBack({
                                delta: 1
                            })
                        }, 2000)
                    }
                })
            } else {
                wx.showToast({
                    title: '提交失败',
                    icon: 'none',
                    duration: 2000,
                    success: function() {}
                })
            }
        })
    }
})