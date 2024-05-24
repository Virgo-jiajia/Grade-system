const CustomMD5 = require('/md5.js')


// <!-- -------------------1.时间------------------- -->
/**
 * 1.1 精确判断数据是否是 Date 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isDate(val) {
    return Object.prototype.toString.call(val) === '[object Date]';
}

/**
 * 1.2 格式化日期
 * @param {Date|String} date 日期或日期字符串
 */
function formatDate(date) {
    let YYYY = null;
    let M = null;
    let MM = null;
    let D = null;
    let DD = null;
    let h = null;
    let hh = null;
    let m = null;
    let mm = null;
    let s = null;
    let ss = null;
    let ms = null;
    let ms2 = null;
    let ms3 = null;
    let ms4 = null;
    let dt = null;

    // 如果 date 是 String 类型
    if (date && this.isString(date)) {
        // 真机运行时，如果直接用 new Date('YYYY-MM-DD hh:mm:ss') 会报 Invalid Date 错误，所以采用下面的方式创建日期
        let dtArr = date.replace(/\//g, '.').replace(/-/g, '.').replace(/:/g, '.').replace(/T/g, ' ').replace(' ',
            '.').replace(
            'Z', '').split('.');

        let year = 2020;
        let month = 12;
        let day = 18;
        let hour = 0;
        let minute = 0;
        let second = 0;
        let millisecond = 0;

        // 年
        if (dtArr.length > 0 && !isNaN(dtArr[0])) {
            year = parseInt(dtArr[0]);
        }
        // 月
        if (dtArr.length > 1 && !isNaN(dtArr[1])) {
            month = parseInt(dtArr[1]);
        }
        // 日
        if (dtArr.length > 2 && !isNaN(dtArr[2])) {
            day = parseInt(dtArr[2]);
        }
        // 时
        if (dtArr.length > 3 && !isNaN(dtArr[3])) {
            hour = parseInt(dtArr[3]);
        }
        // 分
        if (dtArr.length > 4 && !isNaN(dtArr[4])) {
            minute = parseInt(dtArr[4]);
        }
        // 秒
        if (dtArr.length > 5 && !isNaN(dtArr[5])) {
            second = parseInt(dtArr[5]);
        }
        // 毫秒
        if (dtArr.length > 6 && !isNaN(dtArr[6])) {
            millisecond = parseInt(dtArr[6]);
        }

        date = new Date(year, month - 1, day, hour, minute, second, millisecond);
    }

    // 如果 date 是 Date 类型
    if (date && this.isDate(date)) {
        YYYY = date.getFullYear();
        M = date.getMonth() + 1;
        MM = M >= 10 ? M : '0' + M;
        D = date.getDate();
        DD = D >= 10 ? D : '0' + D;
        h = date.getHours();
        hh = h >= 10 ? h : '0' + h;
        m = date.getMinutes();
        mm = m >= 10 ? m : '0' + m;
        s = date.getSeconds();
        ss = s >= 10 ? s : '0' + s;
        ms = date.getMilliseconds();
        ms2 = ms;
        ms3 = ms;
        ms4 = ms;
        if (ms < 10) {
            ms2 = '0' + ms;
            ms3 = '00' + ms;
            ms4 = '000' + ms;
        } else if (ms < 100) {
            ms3 = '0' + ms;
            ms4 = '00' + ms;
        } else {
            ms4 = '0' + ms;
        }
    }

    // 返回的数据对象
    let result = {
        YYYY: YYYY,
        MM: MM,
        M: M,
        DD: DD,
        D: D,
        hh: hh,
        h: h,
        mm: mm,
        m: m,
        ss: ss,
        s: s,
        ms: ms,
        ms2: ms2,
        ms3: ms3,
        ms4: ms4,
        dt: date,
        f1: `${YYYY}-${MM}-${DD}`,
        f2: `${YYYY}年${M}月${D}日`,
        f3: `${YYYY}-${M}-${D} ${hh}:${mm}`,
        f4: `${h}:${m}:${s}`,
        f5: `${MM}-${DD}`,
        f6: `${YYYY}-${MM}`,
        f7: `${YYYY}年${M}月`,
        f8: `${h}:${m}`,
        f9: `${M}月${D}日`,
        notes: 'YYYY（年），MM（月，补0），M（月，不补0），DD（日，补0），D（日，不补0），hh（时，补0），h（时，不补0），mm（分，补0），m（分，不补0），ss（秒，补0），s（秒，不补0），ms（毫秒，不补0），ms2（毫秒，补0到2位），ms3（毫秒，补0到3位），ms4（毫秒，补0到4位），其余的f1，f2，... 看格式就知道了！'
    };
    return result;
}

// 1.3 根据时间戳 转换 为 年月日
function formatTime(time) {
    if (typeof time !== 'number' || time < 0) {
        return time
    }

    var hour = parseInt(time / 3600)
    time = time % 3600
    var minute = parseInt(time / 60)
    time = time % 60
    var second = time

    return ([hour, minute, second]).map(function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }).join(':')
}

// 1.4  param：传入时间：dates:"2018-04-02",later:往后多少天
function lateDaysTime(dates, later) {

    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    let yearDate = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.time = month + '-' + dayFormate;
    dateObj.week = show_day[day];
    // return dateObj;
    return dateObj;
}
// 1.5 计算时间戳的差值，返回 时分秒 
// completeTime时间戳
function timeDifference(completeTime) {

    var timeDic;

    var stime = Date.parse(new Date());
    completeTime = completeTime.replace(/-/g, '/');
    var etime = new Date(completeTime).getTime();

    var usedTime = etime - stime; //两个时间戳相差的毫秒数
    if (usedTime <= 0) {
        timeDic = {
            day: "00",
            hour: "00",
            minute: "00",
            second: "00",
            isEnd: true,
        }
        return timeDic;
    }


    // var days = Math.floor(usedTime / (24 * 3600 * 1000));
    var days = 0;
    //计算出小时数
    // var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    // var hours = Math.floor(leave1 / (3600 * 1000));
    var leave1 = usedTime % (3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(usedTime / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));

    // 秒
    var leave3 = leave2 % (60 * 1000); //计算小时数后剩余的毫秒数
    var seconds = Math.floor(leave3 / (1000));

    // var dayStr = days == 0 ? "" : days;
    // var hoursStr = hours == 0 ? "" : hours;
    var dayStr = days == 0 ? "" : days;
    var hoursStr = hours < 10 ? "0" + hours : hours;
    var minuteStr = minutes < 10 ? "0" + minutes : minutes;
    var secondsStr = seconds < 10 ? "0" + seconds : seconds;
    timeDic = {
        day: dayStr,
        hour: hoursStr,
        minute: minuteStr,
        second: secondsStr,
        isEnd: false,
    }

    return timeDic;

}

// 1.10 时间戳 对比 转化为 刚刚  几分前  
var dateUtils = {
    UNITS: {
        '年': 31557600000,
        '月': 2629800000,
        '天': 86400000,
        '小时': 3600000,
        '分钟': 60000,
        '秒': 1000
    },
    humanize: function(milliseconds) {
        var humanize = '';
        for (var key in this.UNITS) {
            if (milliseconds >= this.UNITS[key]) {
                humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
                break;
            }
        }
        return humanize || '刚刚';
    },
    format: function(dateStr) {
        var date = this.parse(dateStr)
        var diff = Date.now() - date.getTime();
        if (diff < this.UNITS['天']) {
            return this.humanize(diff);
        }
        var _format = function(number) {
            return (number < 10 ? ('0' + number) : number);
        };
        return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
            _format(date.getHours()) + ':' + _format(date.getMinutes());
    },
    parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
        var a = str.split(/[^0-9]/);
        return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
    }
}

// <!-- -------------------1.时间 end------------------- -->


// <!-- -------------------2.类型 等 判定------------------- -->
/**
 * 2.1 校验身份证号
 * @param {Number} number 身份证号
 * 校验成功返回true 失败返回false
 */
function isCertificateNumber(number) {
    let res = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return res.test(number);
}

/**
 * 2.2精确判断数据是否是 Object 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]' && val !== null && val !== undefined;
}

/**
 * 2.3 判断数据是否是 Array 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
}

/**
 * 2.4 判断数据是否是 String 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
}

/**
 * 2.5 精确判断数据是否是 Function 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isFunction(val) {
    return Object.prototype.toString.call(val) === '[object Function]';
}

/**
 * 2.6 精确判断数据是否是 数字 类型（只能是 纯正整数 不包含小数点/负号）
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isNumber_Regular(val) {

    var regPos = /^[1-9]{1}\d*$/; //非负浮点数io
    if (regPos.test(val)) {

        return true;

    } else {

        return false;

    }
}
/**
 * 2.7 精确判断数据是否是 Boolean 类型
 * @param {Any} val 要判断的数据
 * @returns {Boolean} true：是；false：不是；
 */
function isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]';
}

/**
 * 2.8 判断 URL 是否是绝对 URL。
 * @param {String} url 要判断的 URL
 * @return {Boolean} true：是绝对URL；false：不是绝对URL；
 */
function isAbsoluteURL(url) {
    // 如果 URL 以 “<scheme>：//” 或 “//”（协议相对URL）开头，则认为它是绝对的
    // RFC 3986 将方案名称定义为以字母开头的字符序列，然后是字母，数字，加号，句点或连字符的任意组合
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
/**
 * 2.9 校验手机号格式是否正确
 * @param {Number} tel 手机号码
 * 校验成功返回true 失败返回false
 */
function isTel(tel) {
    let tPattern = /^1[3|4|5|8|7][0-9]\d{4,8}$/
    return tPattern.test(tel)
}
/**
 * 2.10 校验发送手机号的六位纯数字验证码
 * @param {Number} code 手机号验证码
 * 校验成功返回true 失败返回false
 */
function isTelCode(code) {
    let res = /^\d{6}$/;
    return res.test(code);
}
/**			
 * 2.11 校验密码：只能输入6-20个字母、数字、下划线  
 * @param {String} password 密码
 * 校验成功返回true 失败返回false
 */
// isPassword(s)  {  
// 	var patrn=/^(\w){6,20}$/;  

// 	return patrn.test(s)
// }
/**			
 * 2.12 校验密码：密码至少包含 数字和英文，长度6-20  
 * @param {String} password 密码
 * 校验成功返回true 失败返回false
 */
function isPassword(s) {
    var patrn = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;

    return patrn.test(s)
}

function isNewPassword(s) {
    var patrn = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%^&*])[\da-zA-Z!#$%^&*]{8,16}$/;
    return patrn.test(s)
}
/**
 * 2.13 校验推荐人ID 纯数字 
 * @param {Number} id 推荐人ID
 * 校验成功返回true 失败返回false
 */
function isRecommenderId(id) {
    let res = /^\d{1,6}$/;
    return res.test(id);
}
/**
 * 2.14 支付宝账号正则
 * @param {未知} num 支付宝号码
 * 校验成功返回true 失败返回false
 */
function isAlipay(num) {
    let res = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/;
    return res.test(num);
}
/**
 * 2.15 校验真实姓名
 * @param {String} name 真实姓名
 * 校验成功返回true 失败返回false
 */
function isRealName(name) {
    let res = /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,30}$))/;
    return res.test(name);
}
/**
 * 2.16 校验提现金额
 * @param {Number} amonut 提现金额
 * 校验成功返回true 失败返回false
 */
function isMoneyAmount(amount) {
    let res = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    return res.test(amount);
}
// <!-- -------------------2.类型 等 判定 end------------------- -->


// <!-- -------------------3. 数据 拼接 更改 判定------------------- -->
/**
 * 3.1 合并 baseURL 和相对 URL 成一个完整的 URL
 * @param {String} baseURL baseURL
 * @param {String} relativeURL 相对 URL
 * @returns {String} 返回组合后的完整 URL
 */
function combineURLs(baseURL, relativeURL) {
    return relativeURL && this.isString(relativeURL) && this.isString(baseURL) ? baseURL.replace(/\/+$/, '') + '/' +
        relativeURL.replace(/^\/+/, '') : baseURL;
}

/**
 * 3.2 深度合并对象，只支持合并两个对象，该方法不会改变原有的对象
 * @param {Object} FirstOBJ 第一个对象
 * @param {Object} SecondOBJ 第二个对象
 * @return {Object} 返回深度合并后的对象
 */
function deepMargeObject(FirstOBJ, SecondOBJ) {
    let ResultOBJ = {};
    for (let key in FirstOBJ) {
        ResultOBJ[key] = ResultOBJ[key] && ResultOBJ[key].toString() === "[object Object]" ? this.deepMargeObject(
            ResultOBJ[
                key], FirstOBJ[key]) : ResultOBJ[key] = FirstOBJ[key];
    }
    for (let key in SecondOBJ) {
        ResultOBJ[key] = ResultOBJ[key] && ResultOBJ[key].toString() === "[object Object]" ? this.deepMargeObject(
            ResultOBJ[
                key], SecondOBJ[key]) : ResultOBJ[key] = SecondOBJ[key];
    }
    return ResultOBJ;
}

/**
 * 3.3 生成指定长度的随机字符串
 * @param {Number} min 最小程度
 * @param {Number} max 最大长度 
 * @return {String} 返回生成的字符串
 */
function randomString(min, max) {
    let returnStr = "",
        range = (max ? Math.round(Math.random() * (max - min)) + min : min),
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l',
            'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I',
            'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
        ];
    for (let i = 0; i < range; i++) {
        let index = Math.round(Math.random() * (arr.length - 1));
        returnStr += arr[index];
    }
    return returnStr;
}
/**
 * 3.4 数字转中文
 * @param {Number} num 数字
 */
function numberToChinese(num) {
    if (!/^\d*(\.\d*)?$/.test(num)) return "Number is wrong!";
    let AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
    let BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
    let a = ("" + num).replace(/(^0*)/g, "").split("."),
        k = 0,
        re = "";
    for (let i = a[0].length - 1; i >= 0; i--) {
        switch (k) {
            case 0:
                re = BB[7] + re;
                break;
            case 4:
                if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                    re = BB[4] + re;
                break;
            case 8:
                re = BB[5] + re;
                BB[7] = BB[5];
                k = 0;
                break;
        }
        if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
        if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
        k++;
    }
    if (a.length > 1) //加上小数部分(如果有小数部分) 
    {
        re += BB[6];
        for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
    }
    return re;
}

// 3.5 str类型 经纬度 转化为  num 类型 经纬度
function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

// <!-- -------------------3. 数据 拼接 更改 判定 end------------------- -->


// <!-- -------------------4. 常用 判定方法------------------- -->
// 4.1 位限制 小数点
function checkTextIsTwoDecimal(text) {

    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g;
    if (reg.test(text)) { //正则匹配通过，提取有效文本
        text = text.replace(reg, '$2$3$4');
    } else { //正则匹配不通过，直接清空
        text = '';
    }
    return text; //返回符合要求的文本（为数字且最多有带2位小数）
}


// 4.2 监听网络
function monitorNetStatus() {
    let func = (res) => {
        if (res.networkType === 'none') {
            wx.showToast({
                title: '当前处于断网状态,请先连接',
                icon: 'none'
            });
        }
    }
    wx.getNetworkType({
        success: func
    });
    wx.onNetworkStatusChange(func);
}
//4.3 热更新
function updateAppData(showToast = false) {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
        $H.get('/home/version/version', {})
            .then((res) => {
                console.log(res)
                var data = res.data.data
                    // 成功
                if (data.appversion == widgetInfo.version) {
                    // 无需更新
                    if (showToast) {
                        wx.showToast({
                            title: '无需更新',
                            icon: "none"
                        })
                    }
                    return
                }

                wx.showModal({
                    title: '发现新的版本',
                    content: '最新版本：' + data.appversion,
                    cancelText: '放弃更新',
                    confirmText: '立即更新',
                    success: res => {
                        if (!res.confirm) return;
                        wx.downloadFile({
                            url: data.apkurl,
                            success: (downloadResult) => {
                                if (downloadResult.statusCode === 200) {
                                    plus.runtime.install(downloadResult
                                        .tempFilePath, {
                                            force: false
                                        },
                                        function() {
                                            console.log(
                                                'install success...');
                                            plus.runtime.restart();
                                        },
                                        function(e) {
                                            console.error(
                                                'install fail...');
                                        });
                                }
                            }
                        });
                    }
                });

            });

    });
    // #endif  
}

// 4.4 数组置顶
function objectToArrFirst(arr, index) {
    if (index != 0) {
        arr.unshift(arr.splice(index, 1)[0]);
    }
    return arr;
}

/**
 * 4.5 同步 try catch 的进一步封装处理
 * 使用方法：
 * let [err, res] = await this.$utils.asyncTasks(Promise函数);
 * if(res) 成功
 * if(err) 失败
 */
function asyncTasks(promise) {
    return promise.then(data => {
        return [null, data];
    }).catch(err => [err]);
}

// 4.6对比 类库版本
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}


// 4.7 防止多次点击多次跳转（函数节流）   
// throttle : 节流阀
// fn       : 事件处理
// gapTime  : 点击间隔时间
//使用方法   tap: util.throttle(function (e) {//点击事件},500)

function throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1000
    }

    let _lastTime = null

    // 返回新的函数
    return function() {
        let _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments) //将this和参数传给原函数
            _lastTime = _nowTime
        }
    }
}

// 4.8 获取当前 页面page
function getCurShowPage() {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    return currentPage;
}
//4.9 过滤空字符提示
// if (util.isNullStr(temMoney, "请输入兑换的积分！")) {
//      return;
//    }
function isNullStr(temStr, alertStr) {
    if ("string" != (typeof temStr)) {
        temStr = String(temStr)
    }
    if (alertStr == undefined) {
        alertStr = '您尚未输入内容！';
    }
    var tem = temStr.replace(/\s+/g, '');
    if (tem.length == 0) {
        showToast(alertStr)
        return true;
    } else {
        return false;
    }
}
// <!-- -------------------4. 常用 判定方法 end------------------- -->


// <!-- -------------------5.加密------------------- -->
// 5.1 md5 加密处理
function getMd5Sign(params, uri, clientSecret = 'zhishi') {
    //将所有参数按参数名进行升序（a-z）排序，包括 data 和 page 里面的所有参数；
    // var param_arr = params.split('&');
    var param_arr = params;
    param_arr.sort();
    //将排序后的参数名和值拼接成字符串 stringParams，格式： key1value1key2value2…；
    var stringParams = param_arr.join('&');
    // stringParams=stringParams.replace(/&/g,'');
    //在上一步的字符串前面拼接上请求的 URI，字符串后面拼接上 clientSecret，即：URI + stringParams + clientSecret；
    var param = uri + stringParams + clientSecret;


    //使用 clientSecret 作为密钥，对上一步的结果字符串使用 HmacSHA256 算法计算 MAC 值；
    // var hash = CryptoJS.HmacSHA256(param, clientSecret);
    // //将上一步的计算结果进行 BASE64 编码，编码后的结果就是签名值 sign。
    //  	var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    //  	hashInBase64=encodeURIComponent(hashInBase64);

    // md5 加密

    var md5Str = CustomMD5(param);
    return md5Str;
}
// <!-- -------------------5.加密end------------------- -->

// <!-- ------------------- 6.弹窗 ------------------- -->
// 6.1. loading  格式  加载中...
// message: 提示文字  字符串 格式
function showLoadingNoLimitTime(message) {
    wx.showLoading({
        title: message,
        mask: true
    });
}

// 6.2  加载中 1.5s自动关闭
function showLoading(message, duration = 15000) {
    wx.showLoading({
        title: message,
        mask: true,
        icon: none,
        duration: duration
    });
}
//6.3 结束加载
function hideLoading() {
    wx.hideLoading();
}

// 6.4 弹窗 
function showToast(message, type) {
    var temType = "none";
    if (type) {
        temType = type;
    }
    if (message == undefined || message.length == '') {
        message = '请求失败！';
    }
    wx.showToast({
        title: message,
        icon: temType,
        mask: true,
        duration: 1500
    });

}

function mj_showToast(message, type) {
    var temType = "none";
    if (type) {
        temType = type;
    }
    if (message == undefined || message.length == '') {
        message = '请求失败！';
    }
    wx.showToast({
        title: message,
        icon: temType,
        mask: true,
        duration: 1500
    });

}
// 6.5. 隐藏 
function hideToast(message) {
    wx.hideToast();
}

//6.6 请求失败  提示， token错误10001
function requestError(res) {
    hideLoading();
    if (res.data.code == 10001) {
        // 10001 状态让其重新 进入授权页面登录
        wx.clearStorageSync();
        wx.navigateTo({
            url: '/pages/author/index/index',
            success: function() {
                wx.setNavigationBarTitle({
                    title: '登录授权',
                })
            }
        })
    } else {
        showToast(res.data.msg);
    }

}

// <!-- ------------------- 6.弹窗 end------------------- -->

// <!-- ------------------- 7.分享 ------------------- -->
// 7.1 分享到首页
function shareHome(callback) {
    var uid = "0";
    try {
        uid = wx.getStorageSync("uid");
    } catch (error) {
        uid = '0';
    }

    var temPath = '/pages/home/index/index?pid=' + uid;

    return {
        title: "快来和我一起分享这个有趣小程序吧！",
        path: temPath,
        // imageUrl: imageUrl || defaultImageUrl,
        success(res) {
            console.log("转发成功！");

            if (!res.shareTickets) {
                //分享到个人
                callback && callback();

            } else {
                //分享到群
                let st = res.shareTickets[0];
                wx.getShareInfo({
                    shareTicket: st,
                    success(res) {
                        let iv = res.iv
                        let encryptedData = res.encryptedData;
                        callback && callback();
                    }
                });
            }
        },
        fail: function(res) {
            console.log("转发失败！");
        }
    };
}


// 7.2 分享到具体页面
function shareCurrentPage() {
    // 1. 获取分享页面 的 路径
    var currentPage = getCurShowPage(); //获取当前页面的对象
    let path = currentPage.route

    // 2. 判定 拼接 用户ID
    var uid = "0";
    try {
        uid = wx.getStorageSync("uid");
    } catch (error) {
        uid = '0';
    }

    var shareObj = {
        path: "/" + path + '?pid=' + uid,
    }
    return shareObj;
}

// 分享到朋友圈
function getShareTimelineObj(type, temQuery) {
    // type == 1 传分享ID,主要针对于  分享给朋友 分享到首页的界面    
    // type == 2 如果有具体传参,
    // 如果不传type 不记录 传 uid问题 
    // 设计到 需要登录的界面 大部分 无法获取数据，所有无法使用 分享到朋友圈功能
    // 拼团详情 砍价详情（由于需要token 所以不能分享朋友圈） 除外

    var uid = "0";
    try {
        uid = wx.getStorageSync("uid");
    } catch (error) {
        uid = '0';
    }

    var query = {};
    if (type == 1) {
        query = {
            pid: uid
        }
    }

    if (type == 2) {
        try {
            query = temQuery;
        } catch (error) {
            query = {};
        }
    }

    var shareObj = {
        title: "",
        query: query
    }


    return shareObj;
}

// <!-- ------------------- 7.分享  end------------------- -->


// <!-- -------------------  10. 其他------------------- -->
// 10.1 跳转 登录
function navToLogin() {
    showToast("您尚未登录！")
        // this.$utils.showToast("登录后才可以查看文章详情哦！")
    setTimeout(function() {
        hideToast();

        var temUrl = "/pages/author/index/index"

        wx.navigateTo({
            url: temUrl
        })
    }, 900);
}



// <!-- ------------------- 10.其他 end------------------- -->

// <!-- -------------------  ------------------- -->
// <!-- ------------------- end------------------- -->




module.exports = {
    // -------------------1.时间-------------------
    // 1.1 精确判断数据是否是 Date 类型
    isDate: isDate,
    // 1.2 {Date|String} date 日期或日期字符串
    formatDate: formatDate,
    // 1.3 根据时间戳 转换 为 年月日
    formatTime: formatTime,
    // 1.4 往后几天后的日期
    lateDaysTime: lateDaysTime,
    // 1.5 1.5 计算时间戳的差值，返回 时分秒 
    timeDifference: timeDifference,
    // 1.10 时间戳 对比 转化为 刚刚  几分前( 待定 ) 
    dateUtils: dateUtils,

    // <!-- -------------------2.类型 等 判定------------------- -->
    // 2.1 校验身份证号
    isCertificateNumber: isCertificateNumber,
    // 2.2精确判断数据是否是 Object 类型
    isObject: isObject,
    // 2.3 判断数据是否是 Array 类型
    isArray: isArray,
    // 2.4 判断数据是否是 String 类型
    isString: isString,
    // 2.5 精确判断数据是否是 Function 类型
    isFunction: isFunction,
    // 2.6 精确判断数据是否是 数字 类型（只能是 纯正整数 不包含小数点/负号）
    isNumber_Regular: isNumber_Regular,
    // 2.7 精确判断数据是否是 Boolean 类型
    isBoolean: isBoolean,
    // 2.8 判断 URL 是否是绝对 URL
    isAbsoluteURL: isAbsoluteURL,
    // 2.9 校验手机号格式是否正确
    isTel: isTel,
    // 2.10 校验发送手机号的六位纯数字验证码
    isTelCode: isTelCode,
    // 2.11 校验密码：只能输入6-20个字母、数字、下划线 
    // 2.12 校验密码：密码至少包含 数字和英文，长度6-20 
    isPassword: isPassword,
    // 密码中同时含大写字母、小写字母、数字和特殊字符且长度在8-16之间
    isNewPassword: isNewPassword,
    // 2.13 校验推荐人ID 纯数字
    isRecommenderId: isRecommenderId,
    // 2.14 支付宝账号正则
    isAlipay: isAlipay,
    // 2.15 校验真实姓名
    isRealName: isRealName,
    // 2.16 校验提现金额
    isMoneyAmount: isMoneyAmount,

    // <!-- -------------------3. 数据 拼接 更改 判定------------------- -->
    // 3.1 合并 baseURL 和相对 URL 成一个完整的 URL
    combineURLs: combineURLs,
    // 3.2 深度合并对象，只支持合并两个对象，该方法不会改变原有的对象
    deepMargeObject: deepMargeObject,
    // 3.3 生成指定长度的随机字符串
    randomString: randomString,
    // 3.4 数字转中文
    numberToChinese: numberToChinese,
    // 3.5 str类型 经纬度 转化为  num 类型 经纬度
    formatLocation: formatLocation,


    // <!-- -------------------4. 常用 判定方法------------------- -->
    // 4.1 位限制 小数点
    checkTextIsTwoDecimal: checkTextIsTwoDecimal,
    // 4.2 监听网络
    monitorNetStatus: monitorNetStatus,
    //4.3 热更新
    updateAppData: updateAppData,
    // 4.4 数组置顶
    objectToArrFirst: objectToArrFirst,
    // 4.5 同步 try catch 的进一步封装处理
    asyncTasks: asyncTasks,
    // 4.6对比 类库版本
    fcompareVersion: compareVersion,
    // 4.7 防止多次点击多次跳转（函数节流）   
    throttle: throttle,
    // 4.8 获取当前 页面page
    getCurShowPage: getCurShowPage,
    // 4.9 过滤空字符提示
    isNullStr: isNullStr,

    // <!-- -------------------5.加密------------------- -->
    // 5.1 md5 加密处理
    getMd5Sign: getMd5Sign,

    // <!-- ------------------- 6.弹窗 ------------------- -->
    // 6.1. loading  格式  加载中...
    showLoadingNoLimitTime: showLoadingNoLimitTime,
    // 6.2  加载中 1.5s自动关闭
    showLoading: showLoading,
    //6.3 结束加载
    hideLoading: hideLoading,
    // 6.4 显示弹窗 
    showToast: showToast,
    mj_showToast: mj_showToast,
    // 6.5 隐藏弹窗 
    hideToast: hideToast,
    //6.6 请求失败  提示， token错误10001
    requestError: requestError,

    // <!-- ------------------- 7.分享 ------------------- -->
    // 7.1 分享到首页
    shareHome: shareHome,
    // 7.2 分享到具体页面
    shareCurrentPage: shareCurrentPage,
    // 7.3分享到朋友圈
    getShareTimelineObj: getShareTimelineObj,

    // <!-- -------------------  10. 其他------------------- -->
    // 10.1 跳转 登录
    navToLogin: navToLogin

}