<template>
	<view class="change">
       <view class="title1">
       	 请填写设备信息
       </view>
	   <view class="userName cell ">
	   	<text class="title" style="color: #c8c9cc;">MAC地址 </text>
	   	<view class="rule">
	   		<input type="text" v-model="items.mac" style="color: #c8c9cc;" disabled="true" class="input" placeholder="请输入mac"  />
	   	</view>
	   </view>
	   <view class="userName cell ">
	   	<text class="title">通道名称</text>
	   	<view class="rule">
	   		<input type="text" v-model="items.localName" class="input" placeholder="请输入通道名称"  />
	   	</view>
	   </view>
	   <view class="userName cell ">
	   	<text class="title">出入口状态</text>
	   	<view class="rule" style="height:68rpx">
			<!-- @change="bindPickerChange" -->
	   		<picker  :value="index" :range="array" class="input pick">
	   		       <view class="uni-input">{{array[index]}}</view>
	   		 </picker>
	   	</view>
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
	   </view>
	   <uni-popup ref="popup1" type="center" animation="true" >
	   	 <view class="p_content">
	   	 	<view class="title">
	   	 		请选择部门进行通道授权
	   	 	</view>
	   		<view class="radio">
				<checkbox-group @change="checkboxChange" class="radio-group">
				                <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in itemArray" :key="item.id">
				                    <view>
				                        <checkbox :value="item.id" style="transform:scale(0.7)" color="#1296DB"  />
				                    </view>
				                    <view>{{item.leader}}</view>
				                </label>
				  </checkbox-group>
	   		</view>
	   		<view class="isbtn">
	   			<text class="cancel" @click="cancelClose">取消</text>
	   			<text class="subm" @click="submitChange">确定</text>
	   		</view>
	   	 </view>  
	    </uni-popup>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import {getCompany, Department} from '@/utils/request.js'
	export default {
		data () {
			return {
				items: {},
				array: ['入口','出口'],
				itemArray: [],
				result: [],
				index:0,
				departmentId: getApp().globalData.logInfo.departmentId
			}
		},
		onLoad (obj) {
			// console.log(obj)
			if (obj&&obj.item) {
				this.items = JSON.parse(obj.item)
			} else if (obj&&obj.mac) {
				this.items = {
					mac: obj.mac
				}
			}
		},
		methods: {
			submit () {
				this.itemArray = []
				this.$refs.popup1.open()
				this.getData()
			},
			checkboxChange (e) {
				this.result = e.detail.value
			},
			cancelClose () {
				this.$refs.popup1.close()
				this.result = []
			},
			submitChange () {
				let that = this
				if (!this.result) {
					Toast.fail('请选择部门')
				}
				let obj = {
					aiDutyCompanyId: that.result,
					mac: that.items.mac
					}
				Department(obj).then((res) => {
					if (res.data.code == 1) {
						Toast.success(res.data.message)
						 var pages = getCurrentPages();	// 获取当前页面栈
						 var prePage = pages[pages.length - 2];	// 上一个页面
						 prePage.data.init = true    // A 页面 init方法 为true
						setTimeout(() => {
							uni.navigateBack({
								delta:1
							})
						}, 1000)
					}else {
						Toast.fail(res.data.message)
					}
				})
			},
			getData () {
				let that = this
				getCompany({departmentId: this.departmentId}).then((res) => {
					let data = res.data.data
					if (res.data.code == 1) {
						if (data && data.rows) {
							data.rows.forEach((item, index) => {
								that.itemArray.push({
									id: item.id,
									leader: item.leader
								})
							})
						} else {
							Toast.fail('暂无部门')
						}
					} else {
						Toast.fail('暂无部门')
					}
				})
			}
		}
	}
</script>

<style>
	.cell{
		width: 100%;
		height: 88rpx;
		display: flex;
		font-size: 28rpx;
		flex-wrap: wrap;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		/* border-bottom: 2rpx solid #ebedf0; */
		padding: 20rpx;
	}
	.rule{
		flex: 1;
		height: 100%;
		margin-right: 20rpx;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}
	.rule .input{
		width: 100%;
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 0 10rpx;
	}
	.rule .pick{
		height: 68rpx;
	}
	.rule .input .uni-input{
		    width: 200rpx;
		    height: 68rpx;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
	}
	.change .title{
		width: 180rpx;
		line-height: 68rpx;
		text-align: right;
		margin-right: 20rpx;
		padding-right: 30rpx;
	}
	.change{
		padding: 80rpx;
		box-sizing: border-box;
	}
	.change .title1{
		font-size: 32rpx;
		margin-bottom: 40rpx;
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
		max-height: 400rpx;
		overflow: scroll;
		flex-wrap: wrap;
		align-items: center;
	}
	.radio-group .uni-list-cell.uni-list-cell-pd{
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx;
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
