//app.js
App({
    // 设置全局变量
    globalData: {
        //网站域名
		host: 'https://www.cytingchechang.com',
		websocket: 'wss://www.cytingchechang.com/ws/GETERCODE',
        // app的题目
        appTitle: '商家优惠券',
        hasUser: 0
    },
    //  当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch: function (options) {
        var that = this;
        // 获取本地存储的openID
        wx.getStorage({
            key: 'user',
            // 判断是否存在
            success: function (res) {
                that.globalData.hasUser = 1;
            },
            // 如果没有获取到，则跳转到登录页面
            fail: function () {
                that.globalData.hasUser = 0;
            }
        })
    },

});
