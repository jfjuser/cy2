<template>
	<view class="facemanage" :style="'min-height:' + minHeight + 'px;'">
		<view class="manage" v-if="showPage==0">
			<view class="content">
				<view class="s-key">
					<van-search
					    v-model="getkey.userName"
						shape="round"
						class="input"
					    placeholder="请输入搜索关键词"
					    @search="onSearch"
						@blur="onInput"
						@clear="onClear"
					  />
					  <text @click="onSearch" class="search">搜索</text>
				</view>
				<view class="face_list">
					<view v-if="total==0"><van-empty image="search" description="亲~没有查询到人脸记录哦" /></view>
					<!-- @scrolltoupper="upper" 上拉刷新 @scrolltolower="lower" 下拉触底 @scroll="scroll" 滚动 -->
					<scroll-view :scroll-top="scrollTop" scroll-y="true"  class="scroll-Y list" lower-threshold="100" >
					   <view class="cell" v-for="(item, index) in dataList" :key="item.id">
						 <view class="faceInfo">
						  <text class="margin">部门: {{item.leader}}</text>
							<text class="margin">用户名: {{item.userName}}</text>
						 </view>
						 <view class="trigger">
						  <button  size="mini" type="default" :data-id="item" @click="detail">详情</button>
							 <button  size="mini" type="warn" :data-id="item.id" @click="udelete">删除</button>
						 </view>
					   </view>
					</scroll-view>
					<text  style="margin: 30rpx 0;" v-if="isLoading&&Loading=='没有更多'&&dataList.length>0">{{Loading}}</text>
					<van-loading size="40rpx" type="spinner" style="margin: 30rpx 0;" v-if="(isLoading&&dataList.length>0&&Loading!='没有更多')||total==null">{{Loading}}</van-loading>
				</view>
			</view>
			<view class="add">
					<van-button
					  round
					  block
					  type="info"
					  native-type="submit"
					  @click="showPage=3"
					>
					  添加录制人脸
				</van-button>
			</view>
		</view>
		<view class="f_detail" v-else-if="showPage==1">
			<face-detail @change="prev" :infoDetail="infoDetail"></face-detail>
		</view>
		<view class="f_add" v-else>
			<add-face @change="prev"></add-face>
		</view>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import faceDetail from "@/pageB/faceDetail/index.vue"
	import addFace from "@/pageB/addFace/index.vue"
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import { faceManage, faceDlete } from "@/utils/request.js"
	// '/pb/at/work/v1/manager/WorkForCyCarUser'
	export default {
		components: { faceDetail, addFace },
		data () {
			return {
				keyword: '',
				showPage: 0,
				infoDetail: {},
				Loading: '加载中...',
				isLoading: false,
				total: null,
				minHeight: '',
				deletekey: {departmentId: getApp().globalData.logInfo.departmentId, ids: []},
				getkey: {userName: "", offset: 1, limit: 15, departmentId: getApp().globalData.logInfo.departmentId},
				dataList: []
			}
		},
		onLoad(obj) {
			if (obj&&obj.showPage) {
				this.showPage = obj.showPage
			}
			this.minHeight = system().height
		},
		created() {
			this.getData ()
		},
		methods: {
			prev (val) {
				this.dataList = []
				this.showPage = val
				this.getkey.userName = ''
				this.getkey.offset = 1
				this.getData()
			},
			detail (e) {
				console.log(e)
				this.infoDetail = e.target.dataset.id
				this.showPage=1
				// this.dataList.forEach((item, index) => {
				// 	if (item.id / 1 === e.target.dataset.id /1) {
				// 		this.infoDetail = item
				// 		this.showPage=1
				// 	}
				// })
			},
			onSearch (e) {
				this.dataList = []
				this.total = null
				if (!e.detail.x) {
					this.getkey.userName = e.detail
				}
				this.getkey.offset = 1
				this.getData()
			},
			udelete (e) {
				// console.log()
				let that = this
				that.deletekey.ids[0] = e.target.dataset.id
				faceDlete(that.deletekey).then((res) => {
					if (res.data.code !== 1) {
						Toast.fail(res.data.message)
					} else {
						Toast.success(res.data.message)
					}
					this.getkey.offset = 1
					this.getData()
				}).catch((err) => {
					Toast.fail(err)
				})
			},
			onInput (e) {
				this.getkey.userName = e.detail.value
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
			},
			onCancel (e) {
				console.log(this.keyword)
				console.log(2222, e)
			},
			onClear () {
				this.getkey.userName = ''
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
	.s-key{
		width: 100%;
		display: flex;
		padding: 0 2.5%;
		box-sizing: border-box;
		font-size: 28rpx;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		line-height: 40rpx;
		border-bottom: 2rpx solid #ebedf0;
	}
	.content .input{
		flex: 1;
		line-height: 40rpx;
		font-size: 28rpx;
		background: #eee;
	}
	.content .input input{
		font-size: 28rpx;
		height: 40rpx;
		line-height: 40rpx !important;
	}
	.content .input .van-search__content.van-search__content.van-search__content--round.van-search__content--round{
		background: #eee;
	}
	.van-cell__left-icon-wrap.van-cell__left-icon-wrap{
		width: 32rpx !important;
		height: 48rpx !important;
	}
	.field-index--van-field.van-cell.van-cell.van-cell--borderless.van-cell--borderless{
		align-items: center;
	}
	.van-cell__left-icon-wrap.van-cell__left-icon-wrap .van-icon:before{
		font-size: 35rpx;
		margin-top: 6rpx;
	}
	.van-icon-clear:before{
		font-size: 32rpx;
	}
	.search{
	   line-height: 88rpx;
	   font-size: 28rpx;
	   padding: 0 20rpx;
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
	.add{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		box-shadow: 10rpx 0 20rpx 0 rgba(0,0,0,.2);
		justify-content: center;
		align-items: center;
		padding: 32rpx 32rpx 32rpx;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
	}
	.add button.van-button--normal .van-button__text.van-button__text{
		font-size: 28rpx !important;
	}
	.add button.van-button--normal{
		height: 88rpx;
		    width: 576px;
	}
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
</style>
