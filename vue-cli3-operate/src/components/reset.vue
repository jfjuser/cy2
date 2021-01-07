<template>
	<div class="login">
		<van-field v-model="form.phone"  left-icon="friends" type="tel"   maxlength="11" label="手机号" autocomplete="off" placeholder="请输入手机号"></van-field>
		<van-field
		  v-model="form.code"
		  center
		  type="number"
		  maxlength="6"
		  left-icon="comment-circle"
		  label="短信验证码"
		  placeholder="请输入短信验证码"
		>
		  <template #button>
		    <van-button size="small" type="primary"  @click="send">
				<span class="count-down" v-if="!isFinsh" >发送验证码</span>
				<van-count-down class="count-down" :time="time" format="ss秒重新获取" @finish="isFinsh=false" v-else />
			</van-button>
		  </template>
		</van-field>
		<van-field v-model="form.psw"  left-icon="lock" type="password"   autocomplete="new-password" label="密码" placeholder="请输入密码" />
		<van-button type="primary" class="resetbtn" @click="resetbtn">重置</van-button>
	</div>
</template>
<script>
	import { Field, Button, CountDown, Toast } from 'vant'
	export default {
		name: 'reset',
		components: {
			[Field.name]: Field,
			[Button.name]: Button,
			[CountDown.name]: CountDown
		},
		data () {
			return {
				isFinsh: false,
				time: 60 * 1000,
				form: {
					phone: '',
					psw: '',
					code: ''
				},
				error: {
					phone: '',
					psw: ''
				}
			}
		},
		methods: {
			checkPhone (phone) {
				if (!phone) {
				  this.error.phone = '请输入手机号'
				} else {
					if(!(/^1[3456789]\d{9}$/.test(phone))) {
					  this.error.phone = '手机号码有误，请重填'
					} else {
					  this.error.phone = ''
					}
				}
				return this.error.phone
			},
			checkPsw (psw) {
				if (!psw) {
				  this.error.psw = '请输入密码'
				} else {
					if(!(/^[a-zA-Z]\w{5,17}$/.test(psw))) {
					  this.error.psw = '以字母开头，长度在6~18之间，只能包含字符、数字和下划线'
					} else {
					  this.error.psw = ''
					}
				}
				return this.error.psw
			},
			send () {
				if (!this.isFinsh) {
					if (this.checkPhone(this.form.phone)) {
						Toast.fail(this.checkPhone(this.form.phone))
					} else {
						this.isFinsh = true
					}
				}
			},
			resetbtn () {
				if (this.checkPhone(this.form.phone)) {
					Toast.fail(this.checkPhone(this.form.phone))
					return
				}
				if (this.checkPsw(this.form.psw)) {
					Toast.fail(this.checkPsw(this.form.psw))
					return
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.resetbtn{
		width: 345px;
		margin: 20px 0;
	}
	.count-down{
		width: 100px;
		display: inline-block;
		color: #fff;
	}
</style>
