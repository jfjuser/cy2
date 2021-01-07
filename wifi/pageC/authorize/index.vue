<template>
	<view class="authorize">
		<image src="@/static/dun3.png" mode="widthFix" class="dun"></image>
		<text class="title">授权登录</text>
		<view class="pic">
			<text class="first"></text>
			<view class="dian">
				<text class="second"></text>
				<text class="three"></text>
			</view>
			<text class="line1"></text>
			<text class="line2"></text>
			<text class="four"></text>
		</view>
		<!-- <image src="@/static/step3.png" mode="widthFix" class="step"></image> -->
		<text class="info">本功能需要授权登录后才能进行操作，由于您未授权，请授权后再进行后续操作，感谢配合！</text>
		<!-- <van-button square type="info" loading-text="加载中..." :loading="isLoading">立即授权</van-button> -->
		<button type="primary" open-type="getUserInfo" @getuserinfo="decryptPhoneNumber">立即授权</button>
		<!-- <button type="primary" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">获取手机号</button> -->
	</view>
</template>
<script>
	import { getwxAppletUserInfo } from "@/utils/request.js"
	export default {
		data () {
			return {
				isLoading: false
			}
		},
		onLoad (obj) {
			
		},
		methods: {
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
								if (res.data.data.phone) {
									uni.redirectTo({
										url:'/pageC/login/index'
									})
								} else {
									uni.redirectTo({
										url:'/pageC/login/index'
									})
								}
							}
						})
						
					}
				})
			}
		}
	}
</script>

<style>
	.authorize{
		width: 80%;
		display: flex;
		margin: 100rpx auto 40rpx;
		flex-wrap: wrap;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.authorize .dun{
		width: 250rpx;
	}
	.authorize .step {
		width:80%;
	}
	.authorize .title{
		width: 100%;
		margin: 40rpx 0;
		font-size: 32rpx;
		text-align: center;
	}
	.authorize .info{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin: 50rpx 0;
		line-height: 1.5;
		/* justify-content: center; */
		align-items: center;
	}
	.authorize button[type=primary]{
		font-size: 32rpx;
		width: 60%;
		background-color:#1296db;
	}
	
	.authorize .pic{
		width: 100%;
		margin: 60rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.authorize .pic .first{
		width: 12rpx;
		height: 12rpx;
		margin-right: 3rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.authorize .pic .dian{
		width: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.authorize .pic .dian .second{
		width: 20rpx;
		height: 20rpx;
		margin-bottom: 3rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.authorize .pic .dian .three{
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background-color: rgba(18,150,219,.8);
	}
	.authorize .pic .line1{
		width: 150rpx;
		height: 3px;
		box-shadow: 0 0 10rpx 0 rgba(18,150,219,.6);
		margin-left: 6rpx;
		background-color: rgba(18,150,219,.8);
	}
	.authorize .pic .line2{
		width: 150rpx;
		height: 3px;
		margin-right: 6rpx;
		box-shadow: 0 0 10rpx 0 rgba(170,170,170,.6);
		background-color: #aaa;
	}
	.authorize .pic .four{
		width: 25rpx;
		height: 25rpx;
		border-radius: 50%;
		background-color: #aaa;
	}
</style>
