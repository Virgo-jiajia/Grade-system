var wxRequest = require('../../../../utils/wxRequest')
var Api = require('../../../../utils/API')
var util = require('../../../../utils/util')
Page({
    data: {
        courses: [
            { title: '思想品德', score: 85 },
            { title: '学习态度', score: 85 },
            { title: '组织纪律', score: 85 },
            { title: '劳动卫生', score: 85 },
            { title: '获得的奖励及荣誉', score: 85 }
        ]
    },
    onLoad: function(options) {
        this.totalScore()
        this.setData({
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            stuName: wx.getStorageSync('stuName'),
        })
    },
    // 输入框校验 数字1-100
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
        this.totalScore()
    },
    // 总成绩
    totalScore: function() {
        var sum = 0
        for (var i = 0; i < this.data.courses.length; i++) {
            sum += this.data.courses[i].score * 0.2;
        }
        this.setData({
            total: sum.toFixed(2)
        })
    },
    submitForm: function() {
        var url = Api.postStuOperationScore();
        var data = {
            class_id: Number(wx.getStorageSync('classId')),
            student_id: wx.getStorageSync('stuId'),
            status: 1,
            moral_character_score: 0,
            learning_attitude_score: 0,
            organ_discipline_score: 0,
            labor_hygiene_score: 0,
            honors_score: 0,
        }
        var temp = ['moral_character_score', 'learning_attitude_score',
            'organ_discipline_score', 'labor_hygiene_score', 'honors_score'
        ]
        temp.forEach(item => {
                data[item] = this.data.courses[temp.indexOf(item)].score
            })
            // console.log(url, data, '传递的数据-操行分')
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