<template>
	<view class="login" :style="'min-height:' + minHeight + 'px;'">
		
		<view class="loggin">
			<image src="../../static/forgot-bg.png" mode="widthFix" style="width: 90%;margin: 0 auto;"></image>
					   <button  type="primary" style="width: 90%;margin: 100rpx 0 20rpx;border-radius: 120rpx;background-color: #07C160;" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">微信一键登录</button>
				 	  <button  type="primary" style="width: 90%;margin: 20rpx 0 100rpx;border-radius: 120rpx;background-color: #75ABDA;" @click="phoneLogin">手机号验证码登录</button>
		</view>
		  <van-toast id="van-toast"/>
	</view>
</template>
<script>
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import { getwxAppletUserInfo, wxLogin, Send, phoneLogins } from "@/utils/request.js"
	export default {
		data () {
			return {
				isLoading: false,
				show: true,
				minHeight: '',
				logins: {
					phone: undefined,
					code: undefined,
					userPassword: undefined,
					appId: getApp().globalData.account
				},
				isDown: false,
				time: 60 * 1000
			}
		},
		onLoad (obj) {
			this.minHeight = system().height
		},
		methods: {
			phone (e) {
				this.logins.phone = e.detail
			},
			code (e) {
				this.logins.code = e.detail
			},
			sendCode (e) {
				let that = this
				if (!e.currentTarget.dataset.flag) {
					if (that.logins.phone) {
						if (that.phoneRules(that.logins.phone)) {
							Send(that.logins.phone).then((res) => {
								console.log(res)
								if (res.data.code / 1 === 1) {
									Toast.success('发送成功')
									that.isDown = true
								} else {
									Toast.fail(res.data.message)
								}
							})
						} else {
							Toast.fail('请输入正确的手机号')
						}
					} else {
						Toast.fail('请输入手机号')
					}
				}	
			},
			phoneLogin () {
				uni.navigateTo({
					url:'../phoneLogin/index'
				})
			},
			phoneRules (phone) {
			  let regExp = /^[1]([3-9])[0-9]{9}$/
			  // console.log(regExp.test(phone))
			  if (typeof Number(phone) !== 'number') {
			    return false
			  } else if (!regExp.test(phone)) {
			    return false
			  } else if (phone.length > 11) {
			    return false
			  } else if (phone.length < 11) {
			    return false
			  }
			  return true
			},
			decryptPhoneNumber (user) {
				console.log(user)
				let that = this
				if (user.detail.userInfo) {
					getApp().globalData.userInfo = user.detail.userInfo
				}
				uni.login({
					success: function (loginRes1) {
						let users = {
							account: getApp().globalData.account,
							unicode: loginRes1.code,
							encryptedData: user.detail.encryptedData,
							iv: user.detail.iv
						}
						getwxAppletUserInfo(users).then((res) => {
							if (res.data.data) {
								uni.setStorageSync('wxuserInfo', res.data.data)
								if (res.data.data.phone && res.data.data.unicode) {
									that.login(res.data.data.phone, res.data.data.unicode)
								}
							}
						})
						
					}
				})
			},
			login (phone, unicode) {
				wxLogin({
					account: getApp().globalData.account,
					phone,
					openId: unicode
				}).then((res) => {
					console.log(res.data.data)
					if (res.data.code / 1 === 1) {
						if (res.data.data) {
							Toast.success('登录成功')
							uni.setStorageSync('logInfo', res.data.data[0])
							getApp().globalData.logInfo = res.data.data[0]
							setTimeout(() => {
								if (getCurrentPages().length / 1 === 1) {
									uni.reLaunch({
										url:'/pages/index/index'
									})
								} else {
									uni.navigateBack({
										delta:1
									})
								}
							}, 1000)
						} else {
							Toast.fail('登录失败,请重新登录')
						}
					} else {
						Toast.fail(res.data.message)
					}
				})
			}
		}
	}
</script>

<style>
	.login{
		background-color: #eee;
	}
	.loggin{
		width: 95%;
		display: flex;
		margin: 0 auto;
		padding-top: 100rpx;
		border-radius: 20rpx;
		background-color: #fff;
		box-sizing: border-box;
		/* margin: 100rpx auto 40rpx; */
		flex-wrap: wrap;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.loggin image{
		height: 256rpx;
		border-radius: 20rpx;
	}
	.login button[type=primary]{
		background-color:#1296db;
		font-size: 30rpx;
		padding: 6rpx 60rpx;
	}
</style>
