var util = require('../../utils/util.js');
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        loginBtnTxt: "登录",
        loginBtnBgBgColor: "#0099FF",
        btnLoading: false,
        disabled: false,
        inputUserName: '',
        inputPassword: '',
		avatarUrl: "/images/logo.png",
        logIcon: "/images/logIcon.png",
        pwdIcon: "/images/pwdIcon.png",

    },
    // 忘记密码的操作
    forgetPas: function () {
        wx.showModal({
			title: '请联系上级管理员找回！！',
			icon: 'none',
			duration: 2000
        })
    },
    formSubmit: function (e) {
        var name = e.detail.value.userName;
		var password = e.detail.value.userPassword;
        var userNameReg = util.regexConfig().userName;
        if (userNameReg.test(password)) {
			var user_ = { "userName": name, "userPassword": password, "type": 2};
            wx.request({
				url: app.globalData.host +'/pb/pv/v1/login',
                method: 'POST',
                data: user_,
                dataType: 'json',
                success: function (res) {
                    var result = res.data;
                    if (result.code == 1) {
                        wx.setStorage({
                            key: 'user',
							data: result.data,
                            success: function () {
                                app.globalData.hasUser = 1;
                                wx.switchTab({
                                    url: "/pages/tickets/tickets",
                                })
                            }
                        })
                    } else {
						wx.showToast({
							title: result.message,
							icon: 'none',
							duration: 2000
                        })
                    }
                },
                error: function (err) {
					wx.showToast({
						title: '登录失败，请稍后再试！',
						icon: 'none',
						duration: 2000
                    })
                }
            })
        } else {
            wx.showToast({
				title: '请输入3-16位的账号和密码，格式为数字、字母、 点和下划线！！',
				icon:'none',
				duration:2000
			})
        }
    }
});