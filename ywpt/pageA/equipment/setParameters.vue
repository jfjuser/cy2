<template>
	<view class="setParameters">
		<!-- @click="onclick" -->
		<van-tabs >
		  <view class="" v-for="(item, index) in list">
		  	<van-tab  :title="item[0].classify" v-if="item.length>0" >
		  	    <view class="paramet" v-for="(item1, index1) in item">
		  	    	<view class="key">
						{{item1.classify}}:{{item1.chineseName}}
					</view>
					<view class="word">
						<input class="uni-input" v-model="item1.value"  :placeholder="item1.remarks" v-if="item1.type==1" />
						<slider :value="item1.value" v-if="item1.type==3" :data-index="index" :data-index1="index1" activeColor="#1989fa" backgroundColor="#aaa" block-color="#1989fa" block-size="20" v-model="item1.value"  @change="sliderChange" :min="item1.min" :max="item1.max" show-value />
					    <radio-group @change="radioChange" v-if="item1.type==4" :data-index="index" :data-index1="index1" class="group">
					                    <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in item1.options" :key="item.value">
					                        <view>
					                            <radio :value="item.value" style="transform:scale(0.7)" :checked="index === current1" color="#1989fa" />
					                        </view>
					                        <view>{{item.label}}</view>
					                    </label>
					                </radio-group>
									<van-dropdown-menu v-if="item1.type==2">
									  <van-dropdown-item   v-model="item1.value" @change="onchange"   :data-options="item1.options" :data-index="index" :data-index1="index1" :options="item1.options" />
									</van-dropdown-menu>
					</view>
					<view class="caozuo">
						<button type="primary" @click="creatCode" :data-item="item1">生成二维码</button>
						<button type="primary" @click="up" :data-item="item1">下发</button>
					</view>
		  	    </view>
		  	</van-tab>
		  </view>
		</van-tabs>
		<uni-popup ref="popup1" type="center" animation="true" @change="isshow">
			 <view class="p_content">
			 	<view class="title">
			 		请选择通道
			 	</view>
				<view class="radio">
						<radio-group @change="checkboxChange" class="radio-group">
						                <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in LocalNames" :key="JSON.stringify(item)">
						                    <view>
						                        <radio  :value="JSON.stringify(item)" style="transform:scale(0.7)" :checked="index === current" color="#1989fa"  />
						                    </view>
						                    <view>{{item.localName}}</view>
						                </label>
						  </radio-group>
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
	import { forWorkStyle, getMac, setting } from "@/utils/request.js"
	export default {
		data () {
			return {
				cameraType: 134,
				array: [],
				list: [],
				LocalNames: [],
				result: {},
				items: {},
				current: -1,
				current1: -1,
				value1: 0,
				isclose: true
			}
		},
		created () {
			this.getParamet()
		},
		methods: {
			checkboxChange (e) {
				this.result = JSON.parse(e.detail.value)
			},
			radioChange (e) {
				this.list[e.currentTarget.dataset.index][e.currentTarget.dataset.index1].value = e.detail.value
			},
			onchange (e) {
				this.list[e.currentTarget.dataset.index][e.currentTarget.dataset.index1].value = e.detail
			},
			// dropdown (e) {
			// 	this.isclose = false
			// },
			sliderChange (e) {
				this.list[e.currentTarget.dataset.index][e.currentTarget.dataset.index1].value = e.detail.value
			},
			isshow (e) {
				let that = this
				if (!e.show) {
					that.LocalNames = []
					that.result = {}
					that.items = {}
				}
			},
			cancelClose () {
				let that = this
				that.$refs.popup1.close()
				that.LocalNames = []
				that.result = {}
				that.items = {}
			},
			submitChange () {
				let that = this
				if (that.result.mac) {
					setting({
						filename: that.items.fileName,
						key: that.items.name,
						val: that.items.value,
						departmentId: that.result.departmentId,
						mac: that.result.mac
					}).then((res) => {
						if (res.data.code / 1 === 1) {
							Toast.success(res.data.message)
						} else {
							Toast.fail(res.data.message)
						}
					})
				} else {
					Toast.fail('请选择通道')
				}
			},
			getParamet () {
				forWorkStyle({cameraType: this.cameraType}).then((res) => {
					if (res.data.code / 1 === 1) {
						let data = JSON.parse(res.data.data)
						if (data !== null) {
						  this.array = data
						  this.seeData()
						} else {
						  this.array = []
						  uni.showModal({
						  	title: '数据信息',
						  	content: '当前数据信息为空,\n请联系管理人添加信息...',
						  	success(res1) {
						  		if (res1.confirm) {
									uni.navigateBack({
										delta:1
									})
								}
							}
						  })
						}
					} else {
						Toast.fail(res.data.message)
					}
				})
			},
			seeData () {
			  let names = []
			  this.array.forEach(item => {
			    names.push(item.classify)
			  })
			  let name = Array.from(new Set(names))
			
			  let data = []
			  for (let i = 0; i < name.length; i++) {
			    let arr = []
			    for (let j = 0; j < this.array.length; j++) {
			      if (name[i] === this.array[j].classify) {
			        arr.push(this.array[j])
			      }
			    }
			    data.push(arr)
			  }
			  data.forEach((item1, index1) => {
				  item1.forEach((item, index) => {
					  if (item.type / 1 === 2) {
					  	if (item.options) {
							item.options.forEach((items, indexs) => {
								items.text = items.label
							})
						}
					  } 
				  })
			  })
			  this.list = data
			},
			creatCode (e) {
				// console.log(e)
				if (e.currentTarget.dataset.item) {
					// console.log(getApp().globalData.allUrl)
					let item = e.currentTarget.dataset.item
					let url = getApp().globalData.allUrl + '/pb/at/work/v1/visitor/bindCamera?fileName=' + item.fileName + '&key=' + item.name + '&value=' + item.value
					let urls = []
					urls.push(url)
					uni.previewImage({
						urls: urls,
						longPressActions: {
							itemList: ['发送给朋友', '保存图片', '收藏'],
							success: function(data) {
								// console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
							},
							fail: function(err) {
								// console.log(err.errMsg);
							}
						}
					 });
				}
			},
			up (e) {
				let that = this
				console.log(1111)
				getMac({departmentId: getApp().globalData.logInfo.departmentId}).then((res) => {
					if (res.data.code / 1 === 1) {
						if (res.data.data.length > 0) {
							// console.log(res.data.data)
							that.LocalNames = res.data.data
							that.items = e.currentTarget.dataset.item
							that.$refs.popup1.open()
						} else {
							Toast.fail('暂无通道权限')
						}
					} else {
						Toast.fail(res.data.message)
					}
				})
			}
		}
	}
</script>

<style>
	.van-tab{
		flex-basis: 30% !important;
	}
	.paramet{
		font-size: 28rpx;
		width: 100%;
		padding: 40rpx;
		box-sizing: border-box;
	}
	.caozuo button{
		width: 676rpx;
		margin: 30rpx 0;
		font-size: 28rpx;
		height: 64rpx;
		background: #07c160;
	}
	.word input{
		color: #aaa;
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
		padding: 20rpx 0;
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
		/* width: 100%; */
		flex-wrap: wrap;
		margin: 20rpx;
		align-items: center;
	}
	.word .uni-list-cell.uni-list-cell-pd{
		display: flex;
		/* width: 100%; */
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
	.group{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
</style>
