var app = getApp()
function isLogin () {
	return new Promise((resolve, reject) => {
		uni.getSetting({
			success: function (res) {
				if (res.authSetting['scope.userInfo']) {
					try {
					    const value = uni.getStorageSync('logInfo');
					    const value1 = uni.getStorageSync('userInfo');
					    if (value && value1) {
							that.globalData.logInfo = value
							that.globalData.userInfo = value1
					    } else {
							getLogin()
						}
					} catch (e) {
					    // error
					}
				} else {
					uni.redirectTo({
						url:'/pageC/authorize/index'
					})
				}
			}
		})
	})
}
function getLogin () {
	let that = this
	uni.login({
		success: function (loginRes1) {
			uni.getUserInfo({
				success: function (loginRes) {
				  app.globalData.userInfo = loginRes.userInfo
				  uni.setStorageSync('userInfo', app.globalData.userInfo)
				  // that.getLogin(loginRes1.code, loginRes.encryptedData, loginRes.iv)
				  let users = {
					account: app.globalData.account,
					unicode: loginRes1.code,
					encryptedData: loginRes.encryptedData,
					iv: loginRes.iv
				  }
				  uni.request({
					url: app.globalData.allUrl +  '/pv/v1/wx/getWxAppletUserInfo',
					data: users,
					method: 'GET',
					dataType: 'json',
					responseType: 'text',
					success(res) {
						if (res.statusCode == 200) {
							if (res.data.data) {
								uni.setStorageSync('wxuserInfo', res.data.data)
								uni.redirectTo({
									url:'/pageC/login/index'
								})
							}
						}
					}
				  })
				}
			})	
		}
	})
	
}
export default isLogin