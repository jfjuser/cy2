<template>
	<view class="project" :style="'min-height:' + minHeight + 'px;'">
		<van-search
		  v-model="keyword"
		  shape="round"
		  class="input"
		  placeholder="请输入搜索关键词"
		  @search="onSearch"
		  @blur="onInput"
		  @clear="onInput"
		  @cancel="onInput"
		/>
		<view class="face_list">
			<view v-if="total==0"><van-empty image="search" description="亲~没有查询到报警推送记录哦" /></view>
			<!-- @scrolltoupper="upper" 上拉刷新 @scrolltolower="lower" 下拉触底 @scroll="scroll" 滚动 -->
			<scroll-view :scroll-top="scrollTop" scroll-y="true"  class="scroll-Y list" lower-threshold="100" >
			  <!-- <view class="cell" v-for="(item, index) in dataList" :key="item.id">
				 <view class="faceInfo">
					 <van-cell title="部门" class="margin" :value="item.leader" />
				 </view>
			   </view> -->
			    <view class="single"  v-for="(item, index) in dataList" :key="item.id">
			   <van-cell-group >
			     	<van-cell title="项目信息"  :value="item.leader" :border="'false'"  />
			     	<van-cell title="设备"  :value="item.userName" :border="'false'" />
			     	<van-cell title="故障代号"  :value="item.num" :border="'false'" />
			     	<van-cell title="排查范围"  :value="item.range" :border="'false'" />
			     	<van-cell title="视频链接" size="large"  :value="item.videoLink" :border="'false'" />
			     	<van-cell title="处理结果回复"  :value="item.result" :border="'false'" />
			     	<!-- <van-cell title="故障代号"  :value="item.num" :border="'false'" /> -->
			   </van-cell-group>
			   </view>
			</scroll-view>
			<text  style="margin: 30rpx 0;" v-if="isLoading&&Loading=='没有更多'&&dataList.length>0">{{Loading}}</text>
			<van-loading size="40rpx" type="spinner" style="margin: 30rpx 0;" v-if="(isLoading&&dataList.length>0&&Loading!='没有更多')||total==null">{{Loading}}</van-loading>
		</view>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import { faceManage, faceDlete } from "@/utils/request.js"
	export default {
		data () {
			return {
				keyword: '',
				infoDetail: {},
				Loading: '加载中...',
				isLoading: false,
				total: null,
				minHeight: '',
				dataList: [
					{
						id: 111,
						leader: 'fsdfsdf',
						userName: 'fsdfdsfsfdsf',
						num: '11545488',
						range: '不知道哪里',
						videoLink: 'https://www.baidu.com',
						result: '1544487'
					},
					{
						id: 111,
						leader: 'fsdfsdf',
						userName: 'fsdfdsfsfdsf',
						num: '11545488',
						range: '不知道哪里',
						videoLink: 'https://www.baidu.com',
						result: '1544487'
					}
				]
			}
		},
		onLoad() {
			this.minHeight = system().height
		},
		methods: {
			onSearch (e) {
				if (typeof e.detail.value === 'string') {
					this.keyword = e.detail.value
				} else {
					this.keyword = e.detail
				}
			},
			detail (e) {
				uni.navigateTo({
					url:'/pageB/equipment/index'
				})
			},
			onInput (e) {
				if (typeof e.detail.value === 'string') {
					this.keyword = e.detail.value
				} else {
					this.keyword = e.detail
				}
			},
			getData () {
				faceManage('?offset='+this.getkey.offset+'&limit='+this.getkey.limit, this.getkey).then((res) => {
					this.isLoading = false
					this.total = res.data.data.total
					if (this.dataList.length>0) {
						this.dataList = this.dataList.concat(res.data.data.rows)
					} else {
						this.dataList = res.data.data.rows
					}
				}).catch((err) => {
					this.isLoading = false
					this.total = 0
					this.dataList = []
				})
			}
		},
		onReachBottom () {
			this.isLoading = true
			if (this.dataList.length<this.total) {
				this.getkey.offset = this.getkey.offset / 1 + 1
				this.getData()
			} else {
				this.Loading = '没有更多'
			}
		}
	}
</script>

<style>
.uni-load-more__text.uni-load-more__text{
		font-size: 28rpx !important;
	}
	.van-empty__image{
		width: 320rpx !important;
		height: 320rpx !important;
	}
	.van-empty__description{
		font-size: 32rpx !important;
	}
	.face_list{
		width: 100%;
		display: flex;
		padding-bottom: 152rpx;
		box-sizing: border-box;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.face_list .cell,.face_list .list{
		width: 100%;
		box-sizing: border-box;
		display: flex;
		font-size: 28rpx;
		flex-wrap: wrap;
		align-items: center;
	}
	.face_list .cell{
		padding: 40rpx;
		justify-content: space-between;
		border-bottom: 2rpx solid #f0f0f0;
	}
	.faceInfo{
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
	}
	.trigger{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.trigger button{
		font-size: 24rpx;
		margin: 0 10rpx;
	}
	.trigger button:nth-child(1) {
		color: #333;
	}
	.single .van-cell:after{
		border: none;
	}
	.single{
		border-bottom: 3rpx solid #eee;
		padding: 40rpx 0;
		box-sizing: border-box;
	}
	.single .van-cell__value{
		word-wrap:break-word
	}
</style>
