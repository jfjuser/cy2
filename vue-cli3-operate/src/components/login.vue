<template>
	<div class="login">
		<van-field v-model="form.phone"  left-icon="friends" type="tel"   maxlength="11" label="手机号" autocomplete="off" placeholder="请输入手机号"></van-field>
		<van-field v-model="form.psw"  left-icon="lock" type="password"   autocomplete="new-password" label="密码" placeholder="请输入密码" />
		<van-button type="primary" class="loginbtn" @click="loginbtn">登录</van-button>
		<p class="reset">
			<router-link to="/reset">重置密码</router-link>
		</p>
	</div>
</template>
<script>
	import { Field, Button, Toast } from 'vant'
	export default {
		name: 'login',
		components: {
			[Field.name]: Field,
			[Button.name]: Button
		},
		data () {
			return {
				form: {
					phone: '',
					psw: ''
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
			loginbtn () {
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
	.loginbtn{
		width: 345px;
		margin: 20px 0;
	}
	.reset{
		a {
			color: #000;
			font-size: 14px;
			text-decoration: none;
			span{
				margin: -3px 20px 0;
				display: inline-block;
				vertical-align: middle;
			}
		}
	}
</style>
