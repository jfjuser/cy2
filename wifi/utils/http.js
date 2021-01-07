var app = getApp()
import isLogin from './isLogin.js'
function common (url, data, method, show) {
	if (!show) {
		if (!app.globalData.logInfo.token) {
			isLogin()
		} else {
			var head = {
				'AdminToken': app.globalData.logInfo.token
			}
		}
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: app.globalData.allUrl +  url,
			data,
			method,
			dataType: 'json',
			responseType: 'text',
			header: head,
			success(res) {
				if (res.statusCode == 200) {
					resolve(res)
				} else {
					reject(res)
				}
			},fail(err) {
				reject(err)
			}
		})
	})
}
export default common
