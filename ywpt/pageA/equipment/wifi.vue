<template>
	<view class="equipment" :style="'min-height:' + minHeight + 'px;height:' + (xiaFaData?minHeight + 'px':'auto')+ ';overflow:'+(xiaFaData?'hidden':'')">
		<van-notice-bar color="#ed6a0c" background="#fffbe8" text="不正确的参数，有可能会导致设备断网，请谨慎操作。" left-icon="info-o">
		</van-notice-bar>
		<van-field
		    v-model="fromData.name"
		    required
		    label="名称"
		    placeholder="请输入wifi名称"
			@input="names"
		  />
		  <van-field
		    v-model="fromData.password"
		    required
		    label="密码"
			type="password"
		    placeholder="请输入wifi密码"
			@input="password"
		  />
		  <van-field
		    v-model="fromData.safety"
		    required
			disabled
			class="safe"
		    label="安全性"
		  />
		  <view class="tip">
		  	<text>请设置wifi信息，以便设备联网使用</text>
		  	<text>非特殊wifi请使用默认安全性</text>
		  </view>
		  <view class="newScode">
		  	<van-button type="info" @click="newScode">生成二维码</van-button>
		  	<!-- <van-button type="primary" @clik="oldScode">旧版</van-button> -->
		  </view>
		  <view class="imgs" v-if="imgUrl">
		  	 <image :src="imgUrl" mode="widthFix"></image>
		  </view>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import { getWifiPNew, getwifiPNew1 } from "@/utils/request.js"
	export default {
		data () {
			return {
				fromData: {
					safety: 'WPA-PSK',
					name: undefined,
					password: undefined,
					appId: getApp().globalData.account,
					openId: undefined
				},
				imgUrl: ''
			}
		},
		methods: {
			newScode () {
				if (!this.fromData.name) {
					Toast.fail('请输入wifi名称')
					return
				}
				if (!this.fromData.password) {
					Toast.fail('请输入wifi密码')
					return
				}
				this.imgUrl = ''
				getWifiPNew(this.fromData).then((res) => {
					if (res.data.code == 1) {
						// console.log(getwifiPNew1)
						this.imgUrl = getApp().globalData.allUrl + getwifiPNew1 + '?' + res.data.data + '&safety=' + this.fromData.safety + '&appId=' + 'wx915008be9bda881b' + '&openId=' + this.fromData.openId
					} else {
						Toast.fail(res.message)
					}
				})
			},
			oldScode () {
				
			},
			names (e) {
				this.fromData.name = e.detail
			},
			password (e) {
				this.fromData.password = e.detail
			}
		}
	}
</script>

<style>
	.tip{
		width: 100%;
		padding: 30rpx;
		display: flex;
		flex-wrap: wrap;
		font-size: 28rpx;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}
	.newScode {
		width: 100%;
		padding: 30rpx;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		font-size: 28rpx;
		justify-content: space-between;
		align-items: center;
	}
	.newScode .van-button--info{
		border-radius: 10rpx;
		width: 700rpx;
	}
	.newScode .van-button--primary{
		border-radius: 10rpx;
	}
	.imgs{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.imgs image {
		width: 80%;
	}
</style>
