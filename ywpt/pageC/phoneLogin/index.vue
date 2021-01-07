<template>
	<view class="login">
		<image src="../../static/forgot-bg.png" mode="widthFix" style="width: 100%;"></image>
		 	<van-field
		 	    v-model="logins.phone"
		 	    label="手机号"
		 		type="number"
		 		maxlength="11"
				class="field"
		 	    placeholder="请输入手机号"
		 		@input="phone"
		 	  />
		 	  <van-field
		 	    v-model="logins.code"
		 	    center
		 		type="number"
				class="field"
		 	    label="短信验证码"
		 	    placeholder="短信验证码"
		 		@input="code"
		 	  >
		 	    <template #button>
		 	      <van-button size="small" type="primary" color="rgba(18,150,219,.8)" :data-flag="isDown"  @click="sendCode">
		 		  <text class="get-code" v-if="!isDown" >发送验证码</text>
		 		  <!-- <van-count-down :time="time" format="ss秒" class="count-down" @finish="isDown=false" v-else>
		 		    <template #default="timeData">
		 		      <span class="block">{{ timeData.seconds }}</span>
		 		    </template>
		 		  </van-count-down> -->
		 		  <van-count-down class="count-down" :time="time" format="ss秒" @finish="isDown=false" v-else />
		 		  </van-button>
		 	    </template>
		 	  </van-field>
		 	  <button  type="primary" style="width: 90%;margin: 20rpx 0;" @click="phoneLogin">登录</button>
			  <!-- <button  type="primary" style="width: 90%;margin: 20rpx 0;" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">微信一键登录</button> -->
		  <van-toast id="van-toast"/>
	</view>
</template>
<script>
	import Toast from '@/static/vant/toast/toast'
	import { getwxAppletUserInfo, wxLogin, Send, phoneLogins } from "@/utils/request.js"
	export default {
		data () {
			return {
				isLoading: false,
				show: true,
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
				let that = this
				if (!that.logins.phone) {
					Toast.fail('请输入手机号')
					return
				} else {
					if (!that.phoneRules(that.logins.phone)) {
						Toast.fail('请输入正确的手机号')
						return
					}
				}
				if (!that.logins.code) {
					Toast.fail('请输入验证码')
					return
				}
				phoneLogins(that.logins).then((res) => {
					if (res.data.code / 1 === 1) {
						if (res.data.data) {
							Toast.success('登录成功')
							uni.setStorageSync('logInfo', res.data.data[0])
							getApp().globalData.logInfo = res.data.data[0]
							setTimeout(() => {
								if (getCurrentPages().length / 1 === 2) {
									uni.reLaunch({
										url:'/pages/index/index'
									})
								} else {
									uni.navigateBack({
										delta:2
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
				})
			}
		}
	}
</script>

<style>
	.login{
		width: 90%;
		display: flex;
		margin: 100rpx auto 40rpx;
		flex-wrap: wrap;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.login .dun{
		width: 250rpx;
	}
	.login .step {
		width:80%;
	}
	.login .title{
		width: 100%;
		margin: 40rpx 0;
		font-size: 32rpx;
		text-align: center;
	}
	.login .info{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin: 50rpx 0;
		line-height: 1.5;
		/* justify-content: center; */
		align-items: center;
	}
	.login button[type=primary]{
		background-color:#1296db;
		font-size: 30rpx;
		padding: 6rpx 60rpx;
	}
	.login .pic{
		width: 100%;
		margin: 60rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login .pic .first{
		width: 12rpx;
		height: 12rpx;
		margin-right: 3rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.login .pic .dian{
		width: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.login .pic .dian .second{
		width: 20rpx;
		height: 20rpx;
		margin-bottom: 3rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.login .pic .dian .three{
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.login .pic .line1{
		width: 150rpx;
		height: 2rpx;
		box-shadow: 0 0 10rpx 0 rgba(18,150,219,.6);
		margin-left: 6rpx;
		background-color: rgba(18,150,219,.8);
	}
	.login .pic .line2{
		width: 150rpx;
		height: 2rpx;
		margin-right: 6rpx;
		box-shadow: 0 0 10rpx 0 rgba(170,170,170,.6);
		background-color: #aaa;
	}
	.login .pic .four{
		width: 25rpx;
		height: 25rpx;
		border-radius: 50%;
		background-color: #aaa;
	}
	.login .get-code,.login .count-down{
		width: 150rpx;
		display: flex;
		justify-content: center;
		text-align: center;
		
	}
</style>
