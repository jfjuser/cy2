// pages/merchantinfo/merchantinfo.js
var util = require('../../utils/util.js');
var App = getApp();
Page({
    data: {
        data: {}
    },
    // 页面加载获取数据
    onShow: function (option) {
        var that = this;
        wx.getStorage({
            key: 'user',
            success: function (res) {
                wx.request({
                    url: App.globalData.host + '/os/v1/shop/' + res.data.departmentId,
                    method: 'GET',
                    header: {
                        'content-type': 'application/json; charset=utf-8',
                        'AdminToken': res.data.token
                    },
                    success: function (res) {
                        var result = res.data;
                        if (result.code == 1) {
                            that.setData({
                                data: result.data
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: '获取商家信息失败，请稍后再试！'
                            })
                        }
                    },
                    fail: function (err) {
                        wx.showModal({
                            title: '提示',
                            showCancel: false,
                            content: '获取商家信息失败，请稍后再试！'
                        })
                    }
                })
            },
            fail: function (err) {
                wx.showToast({
                    title: '获取信息失败，请查看网络',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
       
        
    }
});