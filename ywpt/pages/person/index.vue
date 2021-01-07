<template>
	<!-- :style="'min-height:' + minHeight + 'px;'" -->
	<view class="home" >
		<!-- <image src="@/static/me-bg.png" mode="" class="bg"></image> -->
		<view class="userinfos">
			<image :src="userInfo.avatarUrl" ></image>
			<view class="info">
				<text class="username">{{userInfo.nickName}}</text>
				<text class="welcome">{{departmentName}}</text>
			</view>
		</view>
		<view class="allperson">
			<van-cell title="个人信息" is-link url="/pageC/userInfo/index" />
			<van-cell title="绑定手机号" is-link url="/pageC/bindPhone/index" />
			<van-cell title="退出登录" is-link @click="outLine" />
		</view>
	</view>
</template>
<script>
	const app = getApp()
	import isLogin from '@/utils/isLogin.js'
	import system from '@/utils/getSystem.js'
	export default {
		data () {
			return {
				url: '',
				userInfo: {},
				minHeight: '',
				departmentName: ''
			}
		},
		onLoad (obj) {
			this.minHeight = system(true).height
			if (app.globalData.logInfo.token) {
				this.userInfo = getApp().globalData.userInfo
				this.departmentName = app.globalData.logInfo.departmentName
			} else {
				isLogin()
			}
		},
		methods: {
			outLine () {
				app.globalData.logInfo = {}
				uni.removeStorageSync('logInfo')
				uni.reLaunch({
					url:'../index/index'
				})
			}
		},
		onShow (obj) {
		}
	}
</script>

<style>
	.userinfos{
		width:90%;
		height: 240rpx;
		background: #fff;
		position: absolute;
		left: 5%;
		bottom: -120rpx;
		border-radius: 20rpx;
		padding: 20rpx 20rpx 50rpx;
		box-sizing: border-box;
		display: flex;
		box-shadow: 0 0 10rpx 0 #aaa;
		/* background: #d3dcec; */
		/* background: #1296db; */
		color: #fff;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		/* justify-content: flex-start; */
		align-items: center;
	}
	.info{
		width: 100%;
		display: flex;
		margin-top: 90rpx;
		color: #323232;
		font-size: 28rpx;
		align-items: center;
		flex-wrap: wrap;
		/* margin-left: 20rpx; */
		justify-content: center;
		flex-direction: column;
	}
	.info .welcome{
		font-size: 28rpx;
		margin-top: 20rpx;
	}
	.userinfos image{
		width: 160rpx;
		height: 160rpx;
		position: absolute;
		left: 50%;
		top: -80rpx;
		margin-left: -80rpx;
		border-radius: 50%;
	}
	.bg{
		width: 100%;
		height: 480rpx;
		opacity: .8;
	}
	.allperson{
		/* margin-top: 180rpx; */
		width:90%;
		background: #fff;
		border-radius: 20rpx;
		margin: 180rpx auto 0;
		padding: 20rpx 20rpx 20rpx;
		box-sizing: border-box;
		box-shadow: 0 0 10rpx 0 #aaa;
	}
	.home{
		width: 100%;
		height: 300px;
		position: relative;
		padding-top: 300rpx;
		box-sizing: border-box;
		background: #1296db;
		/* background: #d3dcec; */
	}
	.box{
		width: 100%;
		padding: 100rpx 0 50rpx;
		/* background: #fff; */
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.box .tbox{
		display: flex;
		width: 50%;
		flex-wrap: wrap;
		margin-bottom: 50rpx;
		justify-content: center;
		align-items: center;
	}
	.box .tbox .title{
		display: flex;
		color: #808080;
		width: 200rpx;
		padding: 20rpx;
		height: 220rpx;
		border-radius: 10rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
		background: #97b8e0ad;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.box .tbox image{
		width: 100rpx;
		margin-bottom: 20rpx;
	}
</style>
