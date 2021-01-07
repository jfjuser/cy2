<template>
	<view class="inOut" :style="'min-height:' + minHeight + 'px;height:' + (xiaFaData?minHeight + 'px':'auto')+ ';overflow-y:'+(xiaFaData?'hidden':'')">
		<uni-calendar
		ref="calendar"
		    :insert="false"
		    :lunar="true" 
			range
			:startDate="formatDate(0)"
			:endDate="formatDate(1)"
		    @confirm="confirm"
			@close="close"
		     />
		<view class="searchbox content">
			<van-search
			  v-model="formData.userName"
			  shape="round"
			  class="search input"
			  @search="onSearch"
			  @blur="onInput"
			  @clear="onClear"
			  background="rgb(92, 166, 241)"
			  placeholder="请输入搜索关键词"
			/>
			<view class="date">
					 <button @click="open">{{chooseDate.data.length>0?(chooseDate.data[0]+ '  -  ' + chooseDate.data[chooseDate.data.length-1]):initData}}</button>
			</view>
		</view>
		<view class="face_list">
			<view v-if="total==0"><van-empty image="search" description="亲~没有查询到进出记录哦" /></view>
			<!-- @scrolltoupper="upper" 上拉刷新 @scrolltolower="lower" 下拉触底 @scroll="scroll" 滚动 -->
			<scroll-view :scroll-top="scrollTop" @scrolltolower="lower" scroll-y="true"   class="scroll-Y list" lower-threshold="100" >
			   <view class="cell" v-for="(item, index) in dataList" :key="item.id">
				 <view class="faceInfo">
					 <view class="name margin">
						 <text>姓名: {{item.userName}}</text>
					 	<button  size="mini" type="default" >{{inOutStatusFormatter(item.type)}}</button>
					 </view>
					<text class="margin">通道名称: {{item.localName}}</text>
					<text class="margin">部门名称: {{item.leader}}</text>
					<text class="margin">进出时间: {{item.inOutTime | formatDate}}</text>
				 </view>
				 <view class="trigger">
				  <button  size="mini" type="default" @click="prevImg" :data-id="item.id" :data-time="item.inOutTime">查看图片</button>
				 </view>
			   </view>
			</scroll-view>
			<text  style="margin: 30rpx 0;" v-if="isLoading&&Loading=='没有更多'&&dataList.length>0">{{Loading}}</text>
			<van-loading size="40rpx" type="spinner" style="margin: 30rpx 0;" v-if="(isLoading&&dataList.length>0&&Loading!='没有更多')||total==null">{{Loading}}</van-loading>
		</view>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	import { inOut, outImg } from "@/utils/request.js"
	import system from '@/utils/getSystem.js'
	import Toast from '@/static/vant/toast/toast'
	export default {
		components: {
		    uniCalendar
		 },
		data () {
			return {
				showCaledar: false,
				dateStr: '',
				dataList: [],
				Loading: '加载中...',
				chooseDate: '',
				getInout: {offset:1,limit: 10},
				initData: '',
				xiaFaData: false,
				isLoading: false,
				total: null,
				keyword: '',
				formData: {
					offset: 1,
					limit: 10,
					userName: '',
					departmentId: getApp().globalData.logInfo.departmentId,
					dcCode: getApp().globalData.logInfo.departmentId,
					beginTime: '',
					endTime:''
				},
				calendar: true,
				minHeight: ''
			}
		},
		onLoad () {
			this.minHeight = system().height
		    this.initData = this.formatDateShow(0)+'  -  '+this.formatDateShow(1)
		},
		created() {
		   this.formData.beginTime = this.formatDate2(0)
		   this.formData.endTime = this.formatDate2(1)
		   this.getData()
		},
		onHide() {
			uni.removeStorageSync('storage_key')
			uni.removeStorageSync('key')
		},
		onUnload () {
			uni.removeStorageSync('storage_key')
			uni.removeStorageSync('key')
		},
		onReachBottom () {
			this.isLoading = true
			if (this.dataList.length<this.total) {
				this.formData.offset = this.formData.offset / 1 + 1
				this.getData()
			} else {
				this.Loading = '没有更多'
			}
		},
		methods: {
			inOutStatusFormatter (type) {
			  if (type === null) return '--'
			  if (type === 0) return '进场'
			  if (type === 1) return '出场'
			  if (type === 2) return '不分进出场'
			},
			getData () {
				let data = Object.assign({}, this.formData)
				inOut(data).then((res) => {
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
			open(){
				this.xiaFaData = true
			    this.$refs.calendar.open();
			 },
			 change (e) {
				 console.log(e)
			 },
			 formatDate (value) {
			 	var time = ''
				var date = new Date();
				//date.setTime(value);
				var month = date.getMonth() + value;
				if (month < 10)
					month = "0" + month;
				var hours = date.getHours();
				if (hours < 10)
					hours = "0" + hours;
				var minutes = date.getMinutes();
				if (minutes < 10)
					minutes = "0" + minutes;
				var second = date.getSeconds();
				if (second < 10)
					second = "0" + second;
			    var data = date.getDate()
				if (data < 10)
					data = "0" + data;
				time = date.getFullYear() + "/" + month + "/" + data
			 	return time;
			 },
			 formatDate2 (value) {
			 	           var time = ''
			 				var date = new Date();
			 				//date.setTime(value);
			 				var month = date.getMonth() + value;
			 				if (month < 10)
			 					month = "0" + month;
			 				var hours = date.getHours();
			 				if (hours < 10)
			 					hours = "0" + hours;
			 				var minutes = date.getMinutes();
			 				if (minutes < 10)
			 					minutes = "0" + minutes;
			 				var second = date.getSeconds();
			 				if (second < 10)
			 					second = "0" + second;
			                var data = date.getDate()
			 				if (data < 10)
			 					data = "0" + data;
							if (value ===0) {
								var timer = ' 00:00:00'
							} else if (value === 1) {
								var timer = ' 23:59:59'
							}
			 				time = date.getFullYear() + "-" + month + "-" + data + timer
			 	return time;
			 },
			 formatDateShow (value) {
			 	var time = ''
				var date = new Date();
				//date.setTime(value);
				var month = date.getMonth() + value;
				if (month < 10)
					month = "0" + month;
				var hours = date.getHours();
				if (hours < 10)
					hours = "0" + hours;
				var minutes = date.getMinutes();
				if (minutes < 10)
					minutes = "0" + minutes;
				var second = date.getSeconds();
				if (second < 10)
					second = "0" + second;
			    var data = date.getDate()
				if (data < 10)
					data = "0" + data;
				time = month + "/" + data
			 	return time;
			 },
			 confirm (val) {
				 this.dataList = []
				 this.total = null
				 this.formData.offset = 1
				 this.formData.beginTime = val.range.data[0] + ' 00:00:00'
				 this.formData.endTime = val.range.data[val.range.data.length-1] + ' 23:59:59'
				 this.getData()
				 this.xiaFaData = false
				 val.range.data[0] = this.replaces(val.range.data[0])
				 val.range.data[val.range.data.length-1] = this.replaces(val.range.data[val.range.data.length-1])
				 this.chooseDate= val.range
			 },
			 replaces (value) {
			 	var time = '-'
				value = value.substr(-5,5)
			 	if (value && value !== null) {
			 		time = value.replace(/-/g,'/')
			 	}
			 	return time;
			 },
			 close () {
				 this.xiaFaData = false
			 },
			prevImg (e) {
				let that = this
				outImg(e.target.dataset.id + '/' + e.target.dataset.time).then((res) => {
					if (res.data.code !== 1) {
						Toast.fail(res.data.message)
					} else {
						let img = []
						img.push('data:image/jpeg;base64,'+res.data.data)
						uni.previewImage({
							urls: img,
							longPressActions: {
								itemList: ['发送给朋友', '保存图片', '收藏'],
								success: function(data) {
									console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
								},
								fail: function(err) {
									// Toast.fail(err.errMsg);
								}
							}
						})
					}
				}).catch((err) => {
					Toast.fail(err)
				})
			},
			lower () {
				console.log(111)
			},
			onInput (e) {
				this.formData.userName = e.detail.value
			},
			onClear () {
				this.formData.userName = ''
			},
			onSearch (e) {
				this.dataList = []
				this.total = null
				this.formData.offset = 1
				this.formData.userName = e.detail
				this.getData()
			}
		},
		beforeDestroy () {
			uni.removeStorageSync('storage_key')
			uni.removeStorageSync('key')
		},
		filters: {
			formatDate: function(value) {
				var time = '-'
				if (value && value !== null) {
					var date = new Date(value);
					//date.setTime(value);
					var month = date.getMonth() + 1;
					if (month < 10)
						month = "0" + month;
					var hours = date.getHours();
					if (hours < 10)
						hours = "0" + hours;
					var minutes = date.getMinutes();
					if (minutes < 10)
						minutes = "0" + minutes;
					var second = date.getSeconds();
					if (second < 10)
						second = "0" + second;
					var data = date.getDate()
					if (data < 10)
						data = "0" + data;
					time = date.getFullYear() + "-" + month + "-" + data +
						" " + hours + ":" + minutes + ":" + second;
				}
				return time;
			}
		}
	}
</script>

<style>
	.face_list{
		width: 100%;
		display: flex;
		/* padding-bottom: 152rpx; */
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
	.faceInfo .name{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.trigger{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.faceInfo .name button{
		font-size: 24rpx;
		margin: 0 20rpx;
		background: #07c160;
		color: #fff;
		border-radius: 0 50rpx 50rpx 0;
		border-color: #07c160;
		padding: 0 10rpx;
	}
	.trigger button{
		font-size: 24rpx;
		margin: 0 10rpx;
		background: #1989fa;
		color: #fff;
		border-color: #1989fa;
		padding: 0 20rpx;
	}
	.van-empty__image{
		width: 320rpx !important;
		height: 320rpx !important;
	}
	.van-empty__description{
		font-size: 32rpx !important;
	}
	
	
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
	   flex: 1;
	   line-height: 88rpx;
	   font-size: 28rpx;
	   padding: 0;
	}
	.searchbox{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		background: #75abda;
		justify-content: space-between;
		align-items: center;
	}
	.searchbox .date{
		/* width: 40%; */
		height: 100%;
		height: 108rpx;
		display: flex;
		font-size: 28rpx;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.searchbox .date button{
		font-size: 28rpx;
		line-height: 108rpx;
		color: #fff;
		background-color: transparent;
		padding: 0 20rpx;
		margin: 0;
	}
	.searchbox .date button::after{
		border: none;
	}
</style>
