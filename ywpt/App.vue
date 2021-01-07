<script>
	export default {
		globalData: {
			// allUrl: 'http://cy.40mi.com',
			allUrl: 'https://beta.cytingchechang.com',
			// allUrl: 'http://192.168.0.153:9000',
			code: '',
			account: 'wx001f774039227dba',
			userInfo: {},
			wxuserInfo: {},
			logInfo: {}
		},
		onLaunch: function() {
			
			uni.setEnableDebug({
			    enableDebug: true
			})
			let that = this
			uni.getSetting({
				success: function (res) {
					if (res.authSetting['scope.userInfo']) {
						uni.getUserInfo({
							success: function (loginRes) {
							  console.log(loginRes)
							  that.globalData.userInfo = loginRes.userInfo
							  uni.setStorageSync('userInfo', that.globalData.userInfo)
							  try {
							      const value = uni.getStorageSync('logInfo');
							      if (value) {
							  		that.globalData.logInfo = value
							      }
							  } catch (e) {
							      // error
							  }
							}
						})
						// that.getLogin()
					} else {
						that.getLogin()
					}
				}
			})
		},
		onShow: function() {
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			getLogin () {
				let that = this
				uni.login({
					success: function (loginRes1) {
						uni.getUserInfo({
							success: function (loginRes) {
							  that.globalData.userInfo = loginRes.userInfo
							  uni.setStorageSync('userInfo', that.globalData.userInfo)
							  // that.getLogin(loginRes1.code, loginRes.encryptedData, loginRes.iv)
							  let users = {
							  	account: that.globalData.account,
							  	unicode: loginRes1.code,
							  	encryptedData: loginRes.encryptedData,
							  	iv: loginRes.iv
							  }
							  uni.request({
							  	url: that.globalData.allUrl +  '/pv/v1/wx/getWxAppletUserInfo',
							  	data: users,
							  	method: 'GET',
							  	dataType: 'json',
							  	responseType: 'text',
							  	success(res) {
							  		if (res.statusCode == 200) {
							  			if (res.data.data) {
							  				uni.setStorageSync('wxuserInfo', res.data.data)
							  			}
							  		}
							  	}
							  })
							}
						})	
					}
				})
				
			}
		}
	}
</script>

<style>
	@import "/static/vant/common/index.wxss";
	@import url("/static/icon-font/iconfont.css");
	/*每个页面公共css */
	page{
		color: #333;
		font-size: 28rpx;
	}
	image{
		vertical-align: top;
		border:none;
		outline: none;
	}
	swiper{
		min-height: 360rpx;
		margin-top: -2px;
	}
	.margin{
		margin: 10rpx 0;
	}
	.popup{
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.7);
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
	}
</style>
