<template>
	<view class="bindPhone">
		<view class="title">
			已绑定手机号
		</view>
		<view class="title">
			{{phone}}
		</view>
	</view>
</template>
<script>
	const app = getApp()
	export default {
		data () {
			return {
				phone: ''
			}
		},
		onLoad (obj) {
			if (app.globalData.logInfo.token) {
				this.phone = app.globalData.logInfo.phone
			} else {
				isLogin()
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.bindPhone{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		font-size: 28rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 60rpx 0;
		box-sizing: border-box;
	}
	.title{
		margin: 20rpx 0;
	}
</style>
