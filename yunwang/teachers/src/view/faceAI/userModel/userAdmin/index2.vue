<template>
  <div class="user-admin">
    <!-- <div class="title">账户管理系统</div> -->
    <group class="list-content" @change="selectEvent">
      <!-- inline-desc="详情说明"  value="value" link='#' :is-link='true' -->
      <cell
        v-for="(item, index) in userAdminList"
        :title="item.title"
        :value="item.value"
        :key="index"
        @click.native.prevent="selectEvent(item.id)"
      >
        <template #icon>
          <img :src="item.icon" alt="" />
        </template>
      </cell>
    </group>

    <confirm
      class="confirm-phone"
      v-model="isBindPhone"
      @on-cancel="phoneClose"
      @on-confirm="phoneConfirm"
      title="用户信息绑定"
      theme="ios"
    >
      <x-input
        title="手机号"
        label-width="80px"
        v-model.trim="loginForm.phone"
        :show-clear="false"
        type="number"
        placeholder="请输入手机号码..."
        :max="11"
      ></x-input>
      <x-input
        title="学生姓名"
        label-width="80px"
        v-model.trim="loginForm.userName"
        :show-clear="false"
        type="text"
        placeholder="请输入学生姓名"
      ></x-input>
    </confirm>
  </div>
</template>
<script>
import iconPhone from '@/assets/icon/phone.png'
import { getDepInfo, getWxInfo } from '@/utils/userInfo.js'
import { loginByPhone } from '@/api/url'
import { httpPost } from '@/utils/restful'
export default {
  name: 'UserAdmin',
  data () {
    return {
      userAdminList: [
        { id: 1, icon: iconPhone, title: '用户信息绑定', value: '开始绑定' }
      ],
      isBindPhone: false,
      loginForm: {
        account: getWxInfo().account,
        wxCode: getWxInfo().unicode,
        departmentId: getDepInfo().departmentId,
        loginType: 1,
        phone: '',
        userName: ''
      }
    }
  },
  methods: {
    //  清空手机号数据信息
    phoneClose () {
      this.loginForm.phone = ''
    },
    nameClose () {
      this.loginForm.userName = ''
    },
    checkPhone () {
      //   let reg = /[1][3-9][0-9]\d{8}/
      let { phone } = this.loginForm
      if (phone === '') {
        this.$vux.alert.show({
          title: '提示',
          content: '手机号码不可为空！'
        })
        return false
      } else if (phone.length !== 11) {
        this.$vux.alert.show({
          title: '提示',
          content: '手机号码格式不对！'
        })
        return false
      } else if (phone.length === 11) {
        return true
      }
    },
    phoneConfirm () {
      console.log(this.loginForm.userName)
      if (this.checkPhone() && this.loginForm.userName) {
        // console.log('开始请求：', this.loginForm)
        httpPost(loginByPhone, this.loginForm)
          .then(res => {
            // console.log('请求ok', res)
            if (res && res.code === 1) {
              this.$vux.toast.show({
                type: 'success',
                text: res.message
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: '绑定失败！'
              })
            }
            this.phoneClose() // 请求成功清空
            this.nameClose()
          })
          .catch(err => {
            console.log(err)
            this.$vux.toast.show({
              type: 'warn',
              text: err
            })
            this.phoneClose() // 请求失败清空
            this.nameClose()
          })
      } else {
        if (!this.loginForm.userName) {
          this.$vux.alert.show({
            title: '提示',
            content: '学生姓名不可为空！'
          })
        } else {
          this.isBindPhone = true
        }
      }
    },
    // 用户选择项
    selectEvent (id) {
    //   console.log('用户做出选择： ', id)
      switch (id) {
        case 1:
          this.isBindPhone = true
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-admin >>> {
  .title {
    font-size: 1.5rem;
    line-height: 3rem;
    text-align: left;
    box-sizing: border-box;
    padding: 0 1rem;
  }
  .weui-cell__bd {
    width: 100%;
    box-sizing: border-box;
  }
  .weui-cell {
    text-align: center;
  }
  .confirm-phone {
    input {
      border: 1px solid #eee;
      border-radius: 1px;
      //   width: 100%;
      padding: 0 0.5rem;
      height: 2.5rem;
      box-sizing: border-box;
    }
    .weui-dialog__bd {
      margin: 0;
      padding: 0;
      .weui-cell__hd {
        label {
          text-align: right;
          padding-right: 0.5rem;
          box-sizing: border-box;
        }
      }
    }
  }
  .list-content {
    .weui-cell__hd {
      width: 1.5rem;
      height: 1.5rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
  }
}
</style>
