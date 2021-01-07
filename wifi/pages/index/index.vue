<template>
	<view class="content" :style="'min-height:' + minHeight + 'px;'">
		<swiper class="swiper" style="width:100%" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorDotsColor" :circular="circular" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item v-for="(item,index) in imgUrl" :key="index" style="width:100%">
				<image :src="item"  style="width:100%;height:100%"></image>
			</swiper-item>
		</swiper>
		<van-notice-bar
		  left-icon="volume-o"
		  mode="closeable"
		  text="欢迎使用物联网云平台。"
		/>
		<view class="grid" style="width:100%;padding:40rpx;box-sizing: border-box;">
			<swiper class="swiper manager" style="width:100%;" :indicator-dots="indicatorDots" :indicator-color="indicatorColor" :indicator-active-color="indicatorDotsColor"    :duration="duration">
				<swiper-item   style="width:100%" class="swiper-item" v-for="(item1,index1) in list" :key="index1">
					<view class="listbox">
						<view class="sbox" v-for="(item,index) in item1.info" :key="index" @click="navgate" :data-url="item.url">
							<text  :class="item.icon + ' iconfont'" ></text>
							<text  style="display:block;margin-top:10rpx;">{{item.content}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>
<script>
	// import Intro, { homeSteps } from '@/utils/intro'
	import { getwxAppletUserInfo } from "@/utils/request.js"
	import system from '@/utils/getSystem.js'
	export default {
		data() {
			return {
				title: '',
				list: [
					{
						info: [
							// {
							// 	icon: 'icon iconfont icon-xinyonghuzhuce',
							// 	content: '用户注册'
							// },
							{
								icon: 'icon iconfont icon-shouye_renlianluru',
								content: '人脸管理',
								url: '/pageB/faceManage/index'
							},
							{
								icon: 'icon iconfont icon-jilu1',
								content: '通行记录',
								url: '/pageC/inOut/index'
							},
							{
								icon: 'icon iconfont icon-shebei',
								content: '设备管理',
								url: '/pageA/equipment/index'
							}
							// ,
							// {
							// 	icon: 'icon iconfont icon-xiaoxikaoqintongji',
							// 	content: '考勤统计'
							// }
						]
					}
				],
				all: this.allUrl,
				minHeight: '',
				src1: '',
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				indicatorDotsColor: '#fff',
				indicatorColor: 'rgba(0,0,0,.2)',
				imgUrl: ['../../static/home-adv2.jpg', '../../static/home-adv2.jpg', '../../static/home-adv2.jpg']
			}
		},
		onLoad() {
			this.minHeight = system(true).height
		},
		methods: {
			navgate (e) {
				let url = e.currentTarget.dataset.url
				uni.navigateTo({
					url: url,
					success() {
						console.log(url)
					}
				})
				console.log(e.currentTarget.dataset.url)
			},
			takePhoto() {
			    const ctx = uni.createCameraContext();
			    ctx.takePhoto({
			    quality: 'high',
			     success: (res) => {
					 console.log(res)
			        this.src1 = res.tempImagePath
			       }
			     });
			 }
		}
	}
</script>

<style>
.start{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	
}
.content{
	background: #f6f6f6;
}
.start>image{
	margin: 100rpx 0 20rpx;
	width: 360rpx;
}
.iconfont{
	font-size: 100rpx;
}
.icon-shouye_renlianluru{
	color: rgb(235,50,53);
	border-radius: 50%;
}
.icon-xinyonghuzhuce{
	color: rgb(244,99,49);
}
.icon-jilu1{
	color: #2196f3;
}
.icon-shebei{
	color:#51a2e2
}
.icon-xiaoxikaoqintongji{
	color: #425c71;
}
/* rgb(244,99,49) */
.swiper-slide{
	width: 80%;
}
.manager{
	background: transparent;
	border-radius: 20rpx;
	height: 450rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 20rpx;
	box-sizing: border-box;
	box-shadow: 0px -10rpx 20rpx 0px rgba(0,0,0,.1),
	-10rpx 0px 20rpx 0px rgba(0,0,0,.1),
	10rpx 0px 20rpx 0 rgba(0,0,0,.1),
	0px 10rpx 20rpx 0 rgba(0,0,0,.1);
}
.swiper-item{
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: flex-start;
}
.listbox{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
	align-items: center;
}
.listbox .sbox{
	width: 25%;
	display: flex;
	flex-wrap: wrap;
	margin: 20rpx 0;
	color: #3e3e3e;
	font-size: 26rpx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
