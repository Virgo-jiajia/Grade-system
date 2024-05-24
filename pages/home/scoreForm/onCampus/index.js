var wxRequest = require('../../../../utils/wxRequest')
var Api = require('../../../../utils/API')
var util = require('../../../../utils/util')
Page({
    data: {
        index: 99, // 控制picker 默认选项
        // 基础课2 专业课1 比例不同
        courses2: [
            { title: '出勤(5%)', rate: '0.05', first: true },
            { title: '课堂表现(10%)', rate: '0.1' },
            { title: '作业(10%)', rate: '0.1' },
            { title: '技能训练(10%)', rate: '0.1' },
            { title: '二、技能考核(15%)', rate: '0.15' },
            { title: '三、中断测试(20%)', rate: '0.2' },
            { title: '四、学期考试(30%)', rate: '0.3' },
        ],
        courses1: [
            { title: '出勤(5%)', rate: '0.05', first: true },
            { title: '课堂表现(10%)', rate: '0.1' },
            { title: '作业(10%)', rate: '0.1' },
            { title: '实操训练(10%)', rate: '0.1' },
            { title: '二、综合实操考核(20%)', rate: '0.2' },
            { title: '三、中断测试(15%)', rate: '0.15' },
            { title: '四、学期考试(30%)', rate: '0.3' },
        ],
        total: 0,
        buttons: [{ id: 2, name: '需补考' }, { id: 3, name: '需缓考' }],
    },
    onLoad: function(options) {
        let key = options.key; // 上个页面传过来的key
        if (key == '1') {
            this.setData({
                courses: this.data.courses1
            })
        } else if (key == '2') {
            this.setData({
                courses: this.data.courses2
            })
        }
        // console.log(this.data.courses, key, 'key')
        this.setData({
            buttons: this.data.buttons,
            subjectTag: key,
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            // teacherName: wx.getStorageSync('nickname'),
            stuName: wx.getStorageSync('stuName'),
        })
        this.totalScore();
        this.getTeacherSubject();
        wx.showToast({
            title: '请先选择对应授课科目，再填写成绩',
            icon: 'none',
            duration: 2000,
        })
    },
    // 获取授课科目
    getTeacherSubject: function() {
        // 校内成绩有基础课专业课之分 校外成绩没有
        var classId = wx.getStorageSync('classId');
        let url = Api.getTeacherSubject() + `?class_id=${classId}&subject_type=inSide&subject_tag=${this.data.subjectTag}`
        var getData = wxRequest.getRequest(url);
        getData.then(res => {
            if (res.data.status == "SUCCESS") {
                this.setData({
                    classArray: res.data.data.subjects,
                })
            }
        })
    },
    // 缓考 补考按钮
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
    // 输入框校验 1-100 数字
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
    // 切换科目
    pickerChange: function(e) {
        this.setData({
            index: e.detail.value,
            subjectId: this.data.classArray[e.detail.value].subject_id,
            subjectTag: this.data.classArray[e.detail.value].subject_tag
        })
        this.getCanWrite()
            // 切换科目后重新发请求判断该学生是否修改过成绩
    },
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
                    finalScore: res.data.data.scoreInfo.final_score,
                    teacherName: res.data.data.scoreInfo.teacher_name
                })
            }
        })
    },
    // 备注信息
    getRemark: function(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    submitForm: function() {
        var url = Api.postStuOnCampusScore() + `?type=inSide&subject_tag=${this.data.subjectTag}`
        var data = {
                class_id: Number(wx.getStorageSync('classId')),
                subject_id: this.data.subjectId,
                student_id: wx.getStorageSync('stuId'),
                status: this.data.status ? this.data.status : 1,
                remark: this.data.remark
            }
            // console.log(this.data.subjectTag, 'tag') // 2-基础课 1-专业课
        if (this.data.subjectTag == '2') {
            var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
                'skill_training_score', 'skill_examine_score', 'mid_stage_test_score', 'semester_test_score'
            ]
        } else if (this.data.subjectTag == '1') {
            var temp = ['attendance_score', 'classroom_performance_score', 'homework_score',
                'practical_training_score', 'practical_examine_score', 'mid_stage_test_score', 'semester_test_score'
            ]
        }
        temp.forEach(item => {
            data[item] = this.data.courses[temp.indexOf(item)].score
        })
        console.log(data, '传递的数据')
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
                util.showToast(res.data.msg)
            }
        })
    }
})