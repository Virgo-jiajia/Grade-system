// 常用  配置文件
const apiUrl = "http://frunts009.sutaitouzi.com/api/"

//1.1配置域名,
// 1.1 域名只修改此处。
//如果wordpress没有安装在网站根目录请加上目录路径,例如："www.watch-life.net/blog"
var DOMAIN = "http://lqq43.sutaitouzi.com/api/"

// 图片域名
var IMAGEDOMAIN = ""

//1.2.设置downloadFile合法域名,不带https ,在中括号([])里增加域名，格式：{id=**,domain:'www.**.com'}，用英文逗号分隔。
//此处设置的域名和小程序与小程序后台设置的downloadFile合法域名要一致。
var DOWNLOADFILEDOMAIN = [{
        id: 1,
        domain: 'www.watch-life.net'
    },
    {
        id: 2,
        domain: 'watch-life.net'
    },
    {
        id: 3,
        domain: 'www.qiniu.com'
    }
]

// 2.小程序
// 2.1 小程序的类型，如果是企业小程序请填：0 ，如果是个人小程序请填：1
var MINAPPTYPE = "0";

// 2.2 小程序 名称
var WEBSITENAME = ""; //网站名称

// 3. 本地图片
// 3.1  logo 本地地址
var LOCALLOGOIMG = "";

// 3.2.未加载出来的 占位图 本地地址
// ！！！！！    placeHolder 图片已删除
var EMPTYPLACEHOLDIMG = ""; //生成海报如果没有首图，使用此处设置的图片作为海报图片。


//4.获取城市定位key
var LOCATIONKEY = "37NBZ-CQOC3-FJD3H-YFONJ-5C2CH-24F24";




export default {
    apiUrl,


    // 1.1  拼接域名
    getDomain: DOMAIN,

    // 1.2 下载 域名
    getDownLoadFileDomain: DOWNLOADFILEDOMAIN,

    // 1.3 图片下载地址
    getImageDomain: IMAGEDOMAIN,

    // 2.小程序 
    // 2.1 小程序 类型  企业：0    个人：1
    getMinAppType: MINAPPTYPE,

    // 2.2 小程序名称
    getAPPName: WEBSITENAME,

    // 3.1  logo 本地地址
    getLocalLogImg: LOCALLOGOIMG,

    // 3.2.未加载出来的 占位图 本地地址
    getPlaceHoldImg: EMPTYPLACEHOLDIMG,

    //4.定位key
    getLocationKey: LOCATIONKEY
}