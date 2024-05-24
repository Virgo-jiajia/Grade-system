Page({
    data: {
        subjects: []
    },
    onLoad: function(options) {
        let inSide = JSON.parse(options.inSide);
        this.setData({
            className: wx.getStorageSync('className'),
            masterName: wx.getStorageSync('masterName'),
            stuName: wx.getStorageSync('stuName'),
            subjects: inSide
        })
    }
})