<template>
	<view class="scan">
       <van-button round type="info" icon="scan"  class="scanclick" @click="scaning"></van-button>
	   <text class="tit">扫一扫设备上的二维码进行绑定</text>
	</view>
</template>

<script>
	export default {
		data () {
			return {
			}
		},
		methods: {
			scaning () {
				uni.scanCode({
				    success: function (res) {
				        // console.log('条码类型：' + res.scanType);
				        // console.log('条码内容：' + res.result);
						uni.navigateTo({
							url:'/pageA/equipment/change?mac='+ res.result,
							success() {
								// console.log(1111)
							}
						})
				    }
				});
			}
		}
	}
</script>

<style>
	.scan, .scanclick{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
	}
	.scanclick button{
		width: 300rpx;
		margin-top: 200rpx;
		height: 300rpx;
	}
	.scanclick .van-icon{
		font-size: 120rpx !important;
	}
	.scan .tit{
		width: 100%;
		color: #909399;
		font-size: 32rpx;
		text-align: center;
		margin: 40rpx 0;
	}
</style>
