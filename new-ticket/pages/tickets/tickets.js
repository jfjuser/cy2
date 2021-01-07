// pages/me/me.js
var util = require('../../utils/util.js');
var App = getApp();
Page({
	data: {
		disabled: true,
		hidden: false,
		items: [],
		user:{}
	},
	//页面加载完成之后
	onShow: function () {
		let self = this
		wx.getStorage({
			key: 'user',
			success: function(res) {
				self.setData({
					user:res.data
				})
				let cookie = res.data.token;
				let id = res.data.departmentId
				wx.request({
					url: App.globalData.host +'/os/v1/ticket/shopRules/list/' + id,
					method: 'GET',
					header: {
						'content-type': 'application/json; charset=utf-8',
						'AdminToken': cookie
					},
					success: function (res) {
                        if (res.statusCode === 401) {
                            self.setData({
                                hidden: true,
                            });
                            wx.showModal({
                                title: '提示',
                                content: '登录失效,请重新登录',
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.clearStorage('user');
                                        wx.clearStorage('type_id');
                                        wx.redirectTo({
                                            url: '/pages/login/login',
                                        })
                                    }
                                },
                            })
                        } else {
                            var result = res.data;
                            if (result.code == 1) {
                                self.setData({
                                    hidden: true,
                                });
                                if (result.data == null || result.data.length == 0) {
                                    wx.showModal({
                                        title: '提示',
                                        showCancel: false,
                                        content: '获取到优惠券类型为空，请先在平台添加优惠券类型！'
                                    });
                                } else {
                                    self.setData({
                                        disabled: false,
                                        items: result.data
                                    })
                                }
                            } else {
                                self.setData({
                                    hidden: true,
                                });
                                wx.showToast({
                                    title: result.message,
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        }
					},
					fail: function (err) {
						self.setData({
							hidden: true,
						});
						wx.showToast({
							title: '获取失败，请查看网络',
							icon: 'none',
							duration: 3000
						})
					}
				})
			},
			fail:function(){
				self.setData({
					hidden: true,
				});
				wx.showModal({
					title: '提示',
					content: '请先登录',
					showCancel: false,
					success: function () {
						wx.redirectTo({
							url: '/pages/login/login',
						})
					},
				})
			}
		})
	},

	formSubmit: function (e) {
		var that = this;
		var type_id = e.detail.value.type;
		if (type_id == '') {
			wx.showToast({
				title: '请选择某一优惠券类型',
				icon: 'loading'
			})
		} else {
			wx.setStorage({
				key: 'type_id',
				data: {
					'type_id': type_id,
				},
				success: function () {
					wx.navigateTo({
						url: '../QRCode/QRCode',
					})
				},
				fail: function (err) {
			        wx.showToast({
			            title: '提交失败',
			            icon: 'loading',
			            duration: 2000
			        })
			    }
			})
		}
	},
});