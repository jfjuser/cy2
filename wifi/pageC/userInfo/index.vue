<template>
	<view class="userInfo">
		<van-cell title="头像" center >
		  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
		  <template #right-icon>
		    <image :src="userInfo.avatarUrl" mode="" style="width: 120rpx;height: 120rpx;border-radius: 50%;"></image>
		  </template>
		</van-cell>
		<van-cell title="微信名" :value="userInfo.nickName"  />
		<van-cell title="用户名" :value="userName"  />
		<van-cell title="部门名" :value="departmentName"  />
		<van-cell title="性别" :value="userInfo.gender / 1 === 1 ? '男' : (userInfo.gender / 1 === 2 ? '女' : '未知')"  />
	</view>
</template>
<script>
	const app = getApp()
	export default {
		data () {
			return {
				userInfo: {},
				departmentName: '',
				userName: ''
			}
		},
		onLoad (obj) {
			if (app.globalData.logInfo.token) {
				this.userInfo = getApp().globalData.userInfo
				this.departmentName = app.globalData.logInfo.departmentName
				this.userName = app.globalData.logInfo.userName
			} else {
				isLogin()
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.userInfo{
		width: 90%;
		padding: 20rpx 20rpx 50rpx;
		margin: 20rpx auto;
		background: #fff;
		color: #fff;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx 0 #aaa;
		box-sizing: border-box;
	}
</style>
