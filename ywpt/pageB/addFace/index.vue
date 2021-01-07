<template>
	<view class="addface" :style="'min-height:' + minHeight + 'px;'">
		<view class="userName cell " style="height: 180rpx;">
			<text class="title">上传人脸图片: </text>
			<view class="rule" >
				<image v-if="!faceImg.length>0" src="@/static/timg.jpg" mode="widthFix" style="width: 120rpx;height: 120rpx;" @click="changeImg"></image>
				<view class="faceimg" v-else style="width: 120rpx;position: relative;">
					<view   class="delete" @click="deleteImg">
						<text class="cha">×</text>
					</view>
					<image :src="faceImg[0]"  style="width: 120rpx;height:130rpx" @click="prevImg"></image>
				</view>
			</view>
		</view>
		<view class="isskip cell">
			<text class="title">单选框: </text>
			<radio-group @change="radioChange" class="row" >
			    <label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="index">
			        <view>
			         <radio :value="item.value" :disabled="ifDisabled"  style="transform:scale(0.7)" color="#1296DB" :checked="item.value / 1 === current / 1"  />
			        </view>
			        <view>{{item.name}}</view>
			   </label>
			</radio-group>
		</view>
		
		<view class="userName cell rules">
			<text class="title">姓名: </text>
			<view class="rule">
				<input type="text" v-model="formData.userName" class="input" placeholder="请输入姓名"  />
			</view>
		</view>
		<view class="userName cell rules">
			<text class="title">手机号码: </text>
			<view class="rule">
				<input type="text" maxlength="11" v-model="formData.phone" class="input" placeholder="请输入手机号码"  />
			</view>
		</view>
		<view class="userName cell rules">
			<text class="title">部门: </text>
			<view class="rule">
				<picker @change="bindPickerChange"  :value="pickIndex" :range="array.leaders" class="input" >
				   <view class="uni-input">{{array.leaders[pickIndex]}}</view>
				 </picker>
			</view>
		</view>
		<view class="userName cell ">
			<text class="title">韦根号: </text>
			<view class="rule">
				<input type="text" v-model="formData.wiegandCard" class="input" placeholder="请输入韦根号"  />
			</view>
		</view>
		<view class="submit1">
			<van-button
			  round
			  block
			  :loading="isLoading"
			  loading-text="正在提交..."
			  type="info"
			  native-type="submit"
			  @click="submit"
			  style="font-size: 28rpx;width:576rpx;height: 88rpx;"
			>
			  提交
			</van-button>
		</view>
		<van-toast id="van-toast"/>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import { checkphoto, noCheckPhoto, faceRegister, getCompany } from "@/utils/request.js"
	export default {
		data() {
			return {
				array: {
					leaders: [],
					ids: [],
					rows: []
				},
				ifDisabled: false,
				pickIndex: 0,
				minHeight: '',
				isLoading: false, // 加载
				items: [
					{
						value: 1,
						name: '不跳过验证'
					},
					{
						value: 2,
						name: '跳过验证'
					}
				],
				faceImg: [], // 人脸照片
				current: 1, // 是否跳过验证
				companyKey: { offset: 1, limit: 10000, departmentId: getApp().globalData.logInfo.departmentId},
				formData: {
				  addr: '', // 用户地址
				  userName: '', // 用户名
				  departmentId: getApp().globalData.logInfo.departmentId,
				  phone: '', // 手机号
				  wiegandCard: '', // 韦根号
				  dutyCompanyId: '', // 部门选择
				  type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
				}
			}
		},
		onLoad() {
			this.minHeight = system().height
		},
		created() {
			let that =this
			getCompany(this.companyKey).then((res) => {
				this.array.rows = res.data.data.rows
				that.formData.dutyCompanyId = res.data.data.rows[0]['id']
				res.data.data.rows.forEach((item, index) => {
					that.array.leaders.push(item.leader)
					that.array.ids.push(item.id)
				}) 
			})
		},
		methods: {
			radioChange (e) {
			  this.current = e.detail.value
			},
			bindPickerChange: function(e) {
			  this.pickIndex = e.target.value
			  this.formData.dutyCompanyId = this.array.ids[this.pickIndex]
			},
			changeImg () {
				let that = this
				let check = this.current==1?checkphoto:noCheckPhoto
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'], //从相册选择
				    success: function (res) {
						console.log(res)
						if (res.tempFilePaths[0].toLowerCase().indexOf('.jpg') >= 0 || res.tempFilePaths[0].toLowerCase().indexOf('.jpeg') >= 0) {
							uni.uploadFile({
								url: getApp().globalData.allUrl + check,
								name: 'file',
								filePath: res.tempFilePaths[0],
								success (url) {
									let data = JSON.parse(url.data)
									if (data.code!==1) {
										Toast.fail(data.message)
									} else {
										that.faceImg = res.tempFilePaths
										that.ifDisabled = true
										that.imgBack = data.data
									}
								},
								fail(err) {
								  	Toast.fail('上传失败')
								}
							})
						} else {
							Toast.fail('请选择JPG图片')
						}
				    }
				});
			},
			deleteImg () {
				let that = this
				uni.showModal({
					title: '删除图片',
					content: '是否删除已经检测通过的照片',
					success(res) {
						if (res.confirm) {
							that.faceImg = []
							that.ifDisabled = false
						}
					}
				})
			},
			prevImg () {
				let that = this
				uni.previewImage({
				urls: that.faceImg,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
			},
			submit () {
				let that = this
				if (!this.formData.userName) {
					Toast.fail('请输入姓名')
					return
				}
				if (!this.formData.phone) {
					Toast.fail('请输入手机号码')
					return
				} else {
					if (!this.phoneRules(this.formData.phone)) {
						Toast.fail('请输入正确的手机号码')
						return
					}
				}
				this.isLoading = true
				let form = Object.assign({}, that.imgBack, that.formData)
				console.log(form, that.imgBack)
				faceRegister(form).then((res) => {
					that.isLoading = false
					if (res.data.code!==1) {
						Toast.fail(res.data.message)
					} else {
						Toast.success(res.data.message)
						uni.showModal({
							title: '人脸录制成功',
							content: '是否继续录制',
							success(res) {
								if (res.confirm) {
									that.formData= {
									  addr: '', // 用户地址
									  userName: '', // 用户名
									  phone: '', // 手机号
									  wiegandCard: '', // 韦根号
									  dutyCompanyId: '23901', // 部门选择
									  type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
				                      }
									  that.imgBack = {}
									  that.faceImg = ''
									  that.pickIndex = 0
									  that.ifDisabled = false
									  that.current = 1
								} else {
									that.$emit('change', 0)
								}
							},
							fail(err) {
							  	Toast.fail('提交失败')
							}
						})
					}
				}).catch((err) => {
					Toast.fail(err.data.message)
					that.isLoading = false
				})
				console.log(this.formData)
			},
			phoneRules (phone) {
			  let regExp = /^[1]([3-9])[0-9]{9}$/
			  // console.log(regExp.test(phone))
			  if (typeof Number(phone) !== 'number') {
			    return false
			  } else if (!regExp.test(phone)) {
			    return false
			  } else if (phone.length > 11) {
			    return false
			  } else if (phone.length < 11) {
			    return false
			  }
			  return true
			}
		}
	}
</script>

<style>
	.addface{
		font-size: 28rpx;
		color: #646566;
	}
	.addface .title{
		width: 180rpx;
		line-height: 68rpx;
		text-align: right;
		margin-right: 20rpx;
		padding-right: 30rpx;
	}
	.addface .cell{
		width: 100%;
		height: 108rpx;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #ebedf0;
		padding: 20rpx;
	}
	.addface .cell .row{
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.uni-list-cell.uni-list-cell-pd{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-right: 20rpx;
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
	.rule .input .uni-input{
		    width: 300rpx;
		    height: 68rpx;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
	}
	.rules:before {
    color: #ee0a24;
	position: absolute;
    font-size: 32rpx;
    content: "*";
}
.submit1{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 64rpx 32rpx 32rpx;
	box-sizing: border-box;
}
.submit1 button.van-button--normal .van-button__text.van-button__text{
	font-size: 28rpx !important;
}
.submit1 button.van-button--normal{
	height: 88rpx;
	    width: 576px;
}

.delete{
	position: absolute;
	right: 0;
	top: 0;
	z-index: 999;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width: 40rpx;
	height: 40rpx;
	color: #fff;
	font-size: 28rpx;
	background-color: rgba(0,0,0,.7);
	border-radius: 0 0 0 38rpx;
}
.delete .cha{
	line-height: 40rpx;
	position: absolute;
	right: 0;
}
</style>
