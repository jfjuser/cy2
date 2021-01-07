<template>
	<view class="equipment" :style="'min-height:' + minHeight + 'px;height:' + (xiaFaData?minHeight + 'px':'auto')+ ';overflow:'+(xiaFaData?'hidden':'')">
		<van-notice-bar color="#1989fa" background="#ecf9ff" text="左滑可解绑、编辑，点击更多查看更多。" left-icon="info-o">
		</van-notice-bar>
		<view class="face_list">
			<view v-if="total==0"><van-empty image="search" description="亲~没有查询到记录哦" /></view>
			<!-- @scrolltoupper="upper" 上拉刷新 @scrolltolower="lower" 下拉触底 @scroll="scroll" 滚动 -->
			<!-- <scroll-view :scroll-top="scrollTop" scroll-y="true"  class="scroll-Y list" lower-threshold="100" > -->
			   <view class="cell" v-for="(item, index) in dataList" :key="item.id" >
				   <scroll-view :scroll-x="true" @scroll="onscroll"  @touchstart="start" :data-index="index"    scroll-with-animation="true">
					    	<view class="swipe-cell" :class="scroll==index?'cswipe-cell':''">
					    		<view class="faceInfo" >
					    		 <view class="name margin">
					    			 <text>通道名称: {{item.localName}}</text>
					    			<button  size="mini" type="default" :data-id="item.id"  @click="openDoor">一键开闸</button>
					    		 </view>
					    		<text class="margin macadd">Mac地址:</text>
					    		<text class="margin macadd">{{item.mac}}</text>
					    		 </view>
					    		 <view class="trigger" :data-item="item" @click="open">
					    		    <text style="color: #969799;">
					    				更多
					    			</text>
					    			<van-icon name="arrow" size="30rpx" color="#969799"></van-icon>
					    		 </view>
								 <view class="bth" v-if="scroll==index">
								 <van-button  square type="danger" class="bbtn" :data-id="item.id" @click="unbind">解绑</van-button>
								 <van-button  square type="primary" class="bbtn" :data-item="item" @click="edit">编辑</van-button>
								 </view>
					    	</view>
							</scroll-view>
			   </view>
			<!-- </scroll-view> -->
			<text  style="margin: 30rpx 0;" v-if="isLoading&&Loading=='没有更多'&&dataList.length>0">{{Loading}}</text>
			<van-loading size="40rpx" type="spinner" style="margin: 30rpx 0;" v-if="(isLoading&&dataList.length>0&&Loading!='没有更多')||total==null">{{Loading}}</van-loading>
		</view>
		<view class="submit">
			<van-button
			  type="info"
			  color="#1989fa"
			  native-type="submit"
			  @click="submit"
			>
			  添加
			</van-button>
			<van-button
			  type="default"
			  native-type="submit"
			  @click="submit1"
			>
			  更多设置
			</van-button>
		</view>
		<van-toast id="van-toast"/>
		<uni-popup ref="popup" type="center" animation="true" @change="isclose">
			<view class="pop">
				<view class="pop_info">
					<view class="pop_single">
						<text class="title">通道名称</text>
						<text class="detail">{{popInfo.localName}}</text>
					</view>
					<view class="pop_single">
						<text class="title">MAC地址</text>
						<text class="detail">{{popInfo.mac}}</text>
					</view>
					<view class="pop_single">
						<text class="title">状态</text>
						<text class="detail">
							<template v-if="popInfo.status === 0">离线</template>
							<template v-if="popInfo.status === 1">在线</template>
						</text>
					</view>
					<view class="pop_single">
						<text class="title">最近在线时间</text>
						<text class="detail">{{popInfo.loginAt |formatDate}}</text>
					</view>
					<view class="pop_single">
						<text class="title">最近离线时间</text>
						<text class="detail">{{popInfo.loginOutAt|formatDate}}</text>
					</view>
					<view class="pop_single">
						<text class="title">出/入口</text>
						<text class="detail">{{inOutFormatter(popInfo.type)}}</text>
					</view>
					<view class="pop_single">
						<text class="title">绑定状态</text>
						<text class="detail">{{isBindFormatter(popInfo.isBind)}}</text>
					</view>
					<view class="pop_single">
						<text class="title">TCP协议版本</text>
						<text class="detail">{{popInfo.tcpVersion}}</text>
					</view>
					<view class="pop_single">
						<text class="title">网络连接类型</text>
						<text class="detail">{{networkTypeFormatter(popInfo.networkType)}}</text>
					</view>
				</view>
				<view class="pop_btn" @click="depchange">
					<van-button
					  type="info"
					  color="#1989fa"
					  native-type="submit"
					>
					  修改部门通道
					</van-button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup1" type="center" animation="true" >
			 <view class="p_content">
			 	<view class="title">
			 		修改通道状态
			 	</view>
				<view class="c_title">
					修改通道昵称
				</view>
				<view class="input">
					<input type="text" placeholder="请输入通道名称" v-model="form.localName"  />
				</view>
				<view class="c_title">
					修改通道状态
				</view>
				<view class="radio">
					<radio-group  class="radio-group" @change="onChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="index">
						     <view>
						      <radio :value="item.value"  style="transform:scale(0.7)" color="#1296DB" :checked="item.value / 1 === form.type / 1"  />
						     </view>
						     <view>{{item.name}}</view>
						</label>
					</radio-group>
				</view>
				<view class="isbtn">
					<text class="cancel" @click="cancelClose">取消</text>
					<text class="subm" @click="submitChange">确定</text>
				</view>
			 </view>  
		 </uni-popup>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import { eQuipment, changeLocal, oPen, unBind } from "@/utils/request.js"
	export default {
		components: {
		        uniPopup,
		        uniPopupMessage,
		        uniPopupDialog
		    },
		data () {
			return {
				Loading: '加载中...',
				isLoading: false,
				total: null,
				scrollleft: false,
				xiaFaData: false,
				scroll: -1,
				current: 0,
				items: [
					{
						value: 0,
						name: '入口'
					},
					{
						value: 1,
						name: '出口'
					},
					{
						value: 2,
						name: '不区分'
					}
				],
				minHeight: '',
				dataList: [],
				popInfo: {},
				form: {
					localName: '',
					type: 0,
					id: ''
					
				},
				formData: {
					offset: 1,
					limit: 10,
					departmentId: getApp().globalData.logInfo.departmentId
				}
			}
		},
		onLoad () {
			// console.log(system())
			this.minHeight = system().height
		},
		created() {
			this.getData()
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
		onShow () {
			let that = this
		    var pages = getCurrentPages();	// 获取当前页面栈
			var curPage = pages[pages.length - 1];	// 当前页面
			if(curPage.data.init){
				curPage.data.init = false;
				that.$refs.popup.close()
				that.$refs.popup1.close()
			}
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
		},
		methods: {
			submit1 () {
				uni.showActionSheet({
					itemList: ['设置wifi', '设置参数'],
					success (res) {
						if (res.tapIndex / 1 === 0) {
						  uni.navigateTo({
						  	url:'/pageA/equipment/wifi'
						  })
						} else if (res.tapIndex / 1 === 1) {
							uni.showModal({
								title: '提示',
								content: '非技术人员请勿操作?',
								success(res1) {
									if (res1.confirm) {
										uni.navigateTo({
											url:'/pageA/equipment/setParameters'
										})
									}
								}
							})
						}
					},
					fail (res) {
					}
				})
			},
			submit () {
				uni.navigateTo({
					url:'./scan'
				})
			},
			cancelClose () {
				this.$refs.popup1.close()
			},
			depchange () {
				let that = this
				uni.navigateTo({
					url:'/pageA/equipment/change?item='+ JSON.stringify(that.popInfo),
					success() {
						// console.log(1111)
					}
				})
			},
			unbind (e) {
				let that = this
				uni.showModal({
					title: '解绑',
					content: '确定要解绑吗?',
					success(res1) {
						if (res1.confirm) {
							unBind(e.currentTarget.dataset.id).then((res) => {
								if (res.data.code == 1) {
									Toast.success(res.data.message)
								} else {
									Toast.fail(res.data.message)
								}
							})
						} else if (res1.cancel) {
							Toast.fail('已取消解绑')
						}
					}
					})
			},
			openDoor (e) {
				let that = this
				// console.log(e.currentTarget.dataset.id)
				uni.showModal({
					title: '开闸提醒',
					content: '确定要开闸吗?',
					success(res1) {
						if (res1.confirm) {
							oPen(e.currentTarget.dataset.id+'/'+ that.formData.departmentId).then((res) => {
								if (res.data.code == 1) {
									Toast.success(res.data.message)
								} else {
									Toast.fail(res.data.message)
								}
							})
						} else if (res1.cancel) {
							Toast.fail('已取消开闸')
						}
					}
					})
			},
			submitChange (e) {
				let that = this
				changeLocal(this.form).then((res) => {
					that.$refs.popup1.close()
					if (res.data.code == 1) {
						that.dataList = []
						that.total=null
						this.isLoading = true
						that.formData.offset = 1
						that.getData()
						Toast.success(res.data.message)
					} else {
						Toast.fail(res.data.message)
					}
				}).catch((err) => {
					that.$refs.popup1.close()
					// Toast.fail(res.data.message)
				})
			},
			onChange (e) {
				this.form.type = e.detail.value
			},
			isBindFormatter (type) {
			  if (type === 0) return '未绑定'
			  if (type === 1) return '已绑定'
			},
			networkTypeFormatter (type) {
			  if (type === 0) return '网线'
			  if (type === 1) return '无线'
			  if (type === 11) return '4G'
			  if (type === 12) return 'WIFI'
			},
			inOutFormatter (type) {
			  if (type === 0) return '入口'
			  if (type === 1) return '出口'
			  if (type !== 0 && type !== 1) return '--'
			},
			open (e) {
				this.popInfo = e.currentTarget.dataset.item
				this.$refs.popup.open()
				this.scroll = -1
			},
			edit (e) {
				this.popInfo = e.currentTarget.dataset.item
				this.$refs.popup1.open()
				this.form.id=e.currentTarget.dataset.item.id
				this.form.type=e.currentTarget.dataset.item.type
				this.form.localName=e.currentTarget.dataset.item.localName
				this.scroll = -1
			},
			isclose (e) {
				// if (e.show) {
				// 	this.xiaFaData = true
				// } else {
				// 	this.xiaFaData = false
				// }
			},
			getData () {
				eQuipment(this.formData).then((res) => {
					// console.log(res)
					this.isLoading = false
					this.total = res.data.data.total
					// console.log(this.total)
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
			onscroll (e) {
				// console.log(9999, e)
				// this.scrollleft = false
			},
			start (e) {
				// this.scroll = -1
				this.scroll = e.currentTarget.dataset.index
			}
		}
	}
</script>

<style>
	.face_list{
		width: 100%;
		display: flex;
		padding-bottom: 324rpx;
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
	.macadd{
		color: #969799;
		font-size: 24rpx;
		margin: 0;
	}
	.trigger{
		display: flex;
		flex-wrap: wrap;
		padding: 30rpx 0 30rpx 30rpx;
		box-sizing: border-box;
		align-items: center;
	}
	.trigger button{
		font-size: 24rpx;
		margin: 0 10rpx;
	}
	.trigger button:nth-child(1) {
		color: #333;
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
		background: #1989fa;
		color: #fff;
		border-radius: 0;
		padding: 0 15rpx;
	}
	.van-empty__image{
		width: 320rpx !important;
		height: 320rpx !important;
	}
	.van-empty__description{
		font-size: 32rpx !important;
	}
	.swipe-cell{
		width: 100%;
		box-sizing: content-box;
		position: relative;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.cswipe-cell{
		padding-right: 320rpx;
	}
	.bth{
		position: absolute;
		right: 0;
		top: 0;
		z-index: 33;
	}
	.bbtn .van-button{
		/* line-height: 220rpx; */
		height:138rpx;
		width: 150rpx;
		font-size: 28rpx;
	}
	.bbtn .van-button--primary{
		background: #1989fa;
		border-color: #1989fa;
	} 
	
	
	
	.submit{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 32rpx 32rpx 32rpx;
		box-shadow: 10rpx 0 20rpx 0 rgba(0,0,0,.2);
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 66;
	}
	.submit button.van-button--normal .van-button__text.van-button__text{
		font-size: 28rpx !important;
	}
	.submit button.van-button--normal{
		height: 88rpx;
		width: 690px;
		margin: 20rpx 0;
		border-radius: 40rpx;
	}
	.submi button.van-button--normal .van-button__text.van-button__text{
		font-size: 28rpx !important;
	}
	.submi button.van-button--normal{
		height: 55rpx;
		width: 382px;
	}
	.submit button.van-button--default.van-button--default{
		border-color: #1989fa;
		color: #1989fa;
	}
	.pop{
		width: 600rpx;
		display: flex;
		flex-wrap: wrap;
		background: #fff;
		border-radius: 10rpx;
		justify-content: center;
		align-items: center;
	}
	.pop_info{
		width: 100%;
		/* padding: 40rpx; */
		font-size: 28rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.pop_single{
		padding: 30rpx 40rpx 30rpx;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
	}
	.pop_single .detail{
		color: #969799;
	}
	.pop_btn {
		width: 100%;
		/* padding: 40rpx; */
		font-size: 28rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.pop_btn .van-button{
		/* line-height: 220rpx; */
		height:88rpx;
		width: 600rpx;
		font-size: 28rpx;
	}
	.pop_btn .van-button--primary{
		background: #1989fa;
		border-color: #1989fa;
	} 
	
	.p_content {
		width: 600rpx;
		display: flex;
		flex-wrap: wrap;
		border-radius: 20rpx;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20rpx;
		background: #fff;
	}
	.p_content .title{
		width: 100%;
		font-size: 32rpx;
		text-align: center;
		line-height: 64rpx;
		padding: 32rpx 0;
		box-sizing: border-box;
	}
	.p_content .c_title{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		font-size: 32rpx;
		line-height: 64rpx;
		align-items: center;
	}
	.p_content .input input, .p_content .input{
		width: 100%;
		height: 64rpx;
		font-size: 28rpx;
	}
	.p_content .radio{
		width: 100%;
		padding: 20rpx 0;
		box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.radio-group{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.radio-group .uni-list-cell.uni-list-cell-pd{
		display: flex;
		flex-wrap: wrap;
		margin-right: 40rpx;
		align-items: center;
	}
	.isbtn{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
	.isbtn .subm{
		width: 50%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		color: #ee0a24;
		font-size: 32rpx;
		padding: 40rpx 0;
		box-sizing: border-box;
	}
	.isbtn .cancel{
		width: 50%;
		display: flex;
		font-size: 32rpx;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 40rpx 0;
		box-sizing: border-box;
	}
</style>
