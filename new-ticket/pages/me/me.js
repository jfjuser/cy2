var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        btnLoading: false,
        disabled: true,
		avatarUrl: "/images/logo.png",
    },
    merchantinfo: function (e) {
        wx.navigateTo({
            url: '/pages/merchantinfo/merchantinfo',
        })
    },
    logout: function (e) {
        wx.showModal({
            title: '提示',
            content: '是否退出',
            success: function (res) {
                if (res.confirm) {
                    wx.clearStorage('user');
                    wx.clearStorage('type_id');
                    wx.redirectTo({
                        url: '../login/login',
                    })
                }
            },
        })
    },
    login() {
        wx.navigateTo({
            url: '../login/login',
        })
    },
    suggestion: function () {
        wx.navigateTo({
            url: '/pages/suggestion/suggestion',
        })
    }
});
