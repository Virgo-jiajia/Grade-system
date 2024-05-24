// 接口 文件

// 1.引入常见  配置
import config from 'config.js'
var apiUrl = config.apiUrl;

var domain = config.getDomain;
var imageDomain = config.getImageDomain;
// var HOST_URI = 'https://' + domain + '/wp-json/wp/v2/';


module.exports = {
    // 登录
    postLogin: function() {
        return apiUrl + 'authorization/login'
    },
    // 修改密码
    resetPassword: function() {
        return apiUrl + 'authorization/reset-password'
    },
    // 获取班级列表
    getClassList: function() {
        return apiUrl + 'classes/index'
    },
    // 获取学生列表
    getStudentList: function() {
        return apiUrl + 'students/index'
    },
    // 获取当前老师任职班级的成绩类型
    getScoreType: function() {
        return apiUrl + 'scores/show-score-types'
    },
    // 选择授课科目 
    getTeacherSubject: function() {
        return apiUrl + 'classes/teacher-subjects'
    },
    // 提交学生校内成绩
    postStuOnCampusScore: function() {
        return apiUrl + 'scores/submit-subject-score'
    },
    // 提交学生操行分
    postStuOperationScore: function() {
        return apiUrl + 'scores/submit-conduct-score'
    },
    // 判断是否能填写成绩
    getCanWriteScore: function() {
        return apiUrl + 'scores/get-score'
    },
    // 获取成绩录入历史信息
    getHistoryScore: function() {
        return apiUrl + 'scores/teacher-history-scores'
    },
    // 修改成绩审批
    postModifyScore: function() {
        return apiUrl + 'flows/modify-score'
    },
    // 单图上传
    postThumb() {
        return apiUrl + 'upload/thumb'
    },
    // 审批列表
    getApprovalList() {
        return apiUrl + 'scores/flows'
    },
    // 取消申请
    postCancelApproval() {
        return apiUrl + 'scores/cancel-flow'
    },
    // 重新提交申请
    postReSubmitApproval() {
        return apiUrl + 'scores/restore-flow'
    },
    // 历史录入成绩详情 新页面
    getHistoryScoreDetail() {
        return apiUrl + 'scores/history-detail'
    },
    // 更新成绩
    postUpdateScore() {
        return apiUrl + 'scores/update'
    },

    // 教务科科长端
    // 申请列表
    getApprovalForAdmin() {
        return apiUrl + 'flows/modify-score-flows'
    },
    // 查看详情
    getApprovalDetailForAdmin() {
        return apiUrl + 'flows/show'
    },
    // 审核拒绝
    postApprovalReject() {
        return apiUrl + 'flows/apply'
    },





    // 1.手机 与 头像 授权
    // 1.0 手机号授权
    // js_code： wx.login 返回 的code
    postTelAuthor: function(obj) {
        return domain + "wxapp/phone/index";
    },

    // 1.1 获取手机号 加密信息 给 后台
    //   'encryptedData': telData.detail.encryptedData,
    //   'iv': telData.detail.iv,
    //   'session_key': backData.session_key
    postTelDecode: function(obj) {
        return domain + "wxapp/phone/getPhone";
    },

    // 1.2 昵称 头像 授权
    postNameAuthorInfo: function(obj) {
        return domain + "wxapp/public/login";
    },

    // 1.3 绑定上下级
    postUpDownLevel: function(obj) {
        return domain + "";
    },


    // 2.0 定位
    // 2.1
    getCityInfo: function(obj) {
        var url = "https://apis.map.qq.com/ws/geocoder/v1/?key=" + config.getLocationKey
        return url;
    },
    //2.2 上传定位信息
    postCityInfo: function(obj) {
        var url = domain + "user/public/setposition"
        return url;
    },

    getDemo() {
        return domain + ""

    },

    postDemo() {
        return domain + ""
    },

    // 0.1 图片下载域名
    imageDomain: imageDomain,


};