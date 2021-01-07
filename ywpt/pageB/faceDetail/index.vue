<template>
	<view class="addface" :style="'min-height:' + minHeight + 'px;height:' + (xiaFaData?minHeight + 'px':'auto')+ ';overflow-y:'+(xiaFaData?'hidden':'')">
	     <view class="caozuo">
	     	<button  size="mini" type="default" class="close" @click="close">关闭</button>
			<button  size="mini" type="default" class="isedit" @click="isedit">{{!edit?'重新编辑':'取消编辑'}}</button>
	     </view>
		<view class="userName cell " style="height: 180rpx;">
			<text class="title">上传人脸图片: </text>
			<view class="rule" >
				<image v-if="!faceImg.length>0" src="@/static/timg.jpg" mode="widthFix" style="width: 120rpx;height: 120rpx;" @click="changeImg"></image>
				<view class="faceimg" v-else style="width: 120rpx;position: relative;">
					<view   class="delete" @click="deleteImg" v-if="edit">
						<text class="cha">×</text>
					</view>
					<image :src="faceImg[0]"  style="width: 120rpx;height:130rpx" @click="prevImg"></image>
				</view>
			</view>
		</view>
		
		<view class="userName cell rules">
			<text class="title" :class="!edit?'noedit':''">姓名: </text>
			<view class="rule">
				<!-- {{!edit}} -->
				<input type="text" :class="!edit?'noedit':''" :placeholder-class="!edit?'noedit':''" v-model="infoDetail.userName" :disabled="!edit" class="input" placeholder="请输入姓名"  />
			</view>
		</view>
		<view class="userName cell rules">
			<text class="title" :class="!edit?'noedit':''">手机号码: </text>
			<view class="rule">
				<input type="text" maxlength="11" v-model="infoDetail.phone" :placeholder-class="!edit?'noedit':''" :class="!edit?'noedit':''" :disabled="!edit" class="input" placeholder="请输入手机号码"  />
			</view>
		</view>
		<view class="userName cell">
			<text class="title noedit" >用户ID: </text>
			<view class="rule">
				<input type="text" maxlength="11" v-model="infoDetail.id" placeholder-class="noedit"  disabled="true" class="input noedit" placeholder="请输入用户ID"  />
			</view>
		</view>
		<view class="userName cell">
			<text class="title noedit" >下发数据: </text>
			<view class="rule submi">
				<van-button
				  block
				  type="info"
				  color="#07c160"
				  native-type="submit"
				  @click="getData"
				>
				  点击查询
				</van-button>
			</view>
		</view>
		<view class="userName cell">
			<text class="title noedit" >部门: </text>
			<view class="rule">
				<picker @change="bindPickerChange"  :value="pickIndex" :range="array.leaders"   class="input noedit" disabled="true">
				  <view class="uni-input">{{array.leaders[pickIndex]}}</view>
				 </picker>
			</view>
		</view>
		<view class="userName cell ">
			<text class="title" :class="!edit?'noedit':''">韦根号: </text>
			<view class="rule">
				<input type="text" v-model="infoDetail.wiegandCard" :placeholder-class="!edit?'noedit':''" :class="!edit?'noedit':''" :disabled="!edit" class="input" placeholder="请输入韦根号"  />
			</view>
		</view>
		<view class="submit">
			<van-button
			  block
			  :disabled="!edit"
			  :loading="isLoading"
			  loading-text="正在提交..."
			  type="info"
			  color="#07c160"
			  native-type="submit"
			  @click="submit"
			>
			  重新提交
			</van-button>
		</view>
		<van-toast id="van-toast"/>
		<view class="popup"  v-if="xiaFaData" @click="xiaFaHide">
			<view class="pop-content" @click.stop="">
				<view class="title">
					下发数据信息
				</view>
				<scroll-view scroll-y="true" style="height: 300rpx;">
					<view>{{infoDetail.aiPower}}</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import Toast from '@/static/vant/toast/toast'
	import system from '@/utils/getSystem.js'
	import { checkphoto, facePut, getPhoto, getCompany } from "@/utils/request.js"
	export default {
		data() {
			return {
				array: {
					leaders: [],
					ids: [],
					rows: []
				},
				xiaFaData: false, // 下发数据显示
				ifDisabled: false,
				pickIndex: 0, // 部门选择下标
				edit: false, // 是否编辑
				minHeight: '',
				isLoading: false, // 加载
				companyKey: { offset: 1, limit: 10000, departmentId: getApp().globalData.logInfo.departmentId},
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
				current: 1,
				imgBack: {}
				// , // 是否跳过验证
				// formData: {
				//   addr: '', // 用户地址
				//   userName: '', // 用户名
				//   phone: '', // 手机号
				//   photoName: '', // 照片名
				//   photo: '', // 照片密匙
				//   wiegandCard: '', // 韦根号
				//   photoAbb: '', //
				//   feature: '', // 图片数据
				//   dutyCompanyId: '', // 部门选择
				//   type: '0' // 用户类型 默认为 0 （0： 用户；1：访客）
				// }
			}
		},
		props: ['infoDetail'],
		onLoad() {
			this.minHeight = system().height
		},
		created() {
			console.log(this.infoDetail)
			getPhoto(this.infoDetail.id).then((res) => {
				if (res.data.data) {
					let img = []
					img.push('data:image/jpeg;base64,'+res.data.data.file)
					this.faceImg = img
					that.imgBack.photo = res.data.data.phone
				} else {
					Toast.fail('暂无图片')
				}
			}).catch((err) => {
				// Toast.fail('获取图片失败')
			})
			getCompany(this.companyKey).then((res) => {
			   this.array.rows = res.data.data.rows
				res.data.data.rows.forEach((item, index) => {
					this.array.leaders.push(item.leader)
					this.array.ids.push(item.id)
					if (item.id / 1 === this.infoDetail.dutyCompanyId / 1) {
						this.pickIndex = index
					}
				})
			})
		},
		methods: {
			radioChange (e) {
			  this.current = e.detail.value
			},
			bindPickerChange: function(e) {
			  this.pickIndex = e.target.value
			},
			changeImg () {
				let that = this
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'], //从相册选择
				    success: function (res) {
						if (res.tempFilePaths[0].toLowerCase().indexOf('.jpg') >= 0 || res.tempFilePaths[0].toLowerCase().indexOf('.jpeg') >= 0) {
							// console.log(res.tempFilePaths[0])
							uni.uploadFile({
								url: getApp().globalData.allUrl + checkphoto,
								name: 'file',
								filePath: res.tempFilePaths[0],
								success (url) {
									let data = JSON.parse(url.data)
									console.log(data)
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
			getData () {
				this.xiaFaData = true
			},
			xiaFaHide () {
				this.xiaFaData = false
			},
			close () {
				this.$emit('change', 0)
			},
			isedit () {
				let that = this
				if (!this.edit) {
					uni.showModal({
						title: '人脸信息确认',
						content: '是否提交新人脸信息',
						success(res) {
							if (res.confirm) {
								that.edit = !that.edit
							}
						}
					})
				} else {
					this.edit = !this.edit
				}
			},
			submit () {
				let that = this
				if (this.infoDetail.photo) {
					delete this.infoDetail.photo
				}
				console.log(this.infoDetail)
				if (!this.infoDetail.userName) {
					Toast.fail('请输入姓名')
					return
				}
				if (!this.infoDetail.phone) {
					Toast.fail('请输入手机号码')
					return
				} else {
					if (!this.phoneRules(this.infoDetail.phone)) {
						Toast.fail('请输入正确的手机号码')
						return
					}
				}
				this.isLoading = true
				uni.showModal({
					title: '人脸信息确认',
					content: '是否提交新人脸信息',
					success(res) {
						if (res.confirm) {
							let form = Object.assign({}, that.imgBack, that.infoDetail)
							facePut(form).then((res) => {
								console.log(res)
								that.isLoading = false
								if (res.data.code!==1) {
									Toast.fail(res.data.message)
								} else {
									console.log(res.data)
									Toast.success(res.data.message)
									that.isedit()
								}
							}).catch((err) => {
								Toast.fail(err)
								that.isLoading = false
							})
						}
					},
					fail(err) {
					  	Toast.fail('提交失败')
					}
				})
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

<style >
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
		box-sizing: border-box;
		flex-wrap: wrap;
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
}
.submit button.van-button--normal .van-button__text.van-button__text{
	font-size: 28rpx !important;
}
.submit button.van-button--normal{
	height: 88rpx;
	width: 576px;
}
.submi button.van-button--normal .van-button__text.van-button__text{
	font-size: 28rpx !important;
}
.submi button.van-button--normal{
	height: 55rpx;
	width: 382px;
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
.noedit{
	color: #c8c9cc;
}
.pop-content{
	width: 90%;
	padding: 20rpx;
	box-sizing: border-box;
	min-height: 400rpx;
	background: #fff;
	border-radius: 20rpx;
}
.pop-content .title{
	font-size: 32rpx;
	height: 80rpx;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}
.caozuo .close{
	color: #1989fa;
	border-color: #1989fa;
}
.caozuo .close:after{
	border-color: #1989fa;
}
.caozuo .isedit{
	color: #ff976a;
	border-color: #ff976a;
}
.caozuo .isedit:after{
	border-color: #ff976a;
}
.caozuo{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	padding: 40rpx 40rpx 20rpx;
	box-sizing: border-box;
}
.caozuo button{
	margin: 0;
}
</style>
