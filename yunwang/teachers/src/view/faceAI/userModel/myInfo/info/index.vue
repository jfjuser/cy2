<template>
  <div>
    <group title="基本信息">
      <cell title="头像" class="text-left box-image">
        <template><img class="image" :src="wxInfo.headImgUrl"></template>
      </cell>
      <cell title="昵称" :value="wxInfo.nickName" class="text-left"></cell>
      <cell title="性别" :value="sex" class="text-left"></cell>
      <cell title="地区" :value="addr" class="text-left"></cell>
    </group>
    <group style="margin-top:3rem" title="账户信息">
      <cell title="账户密码" value="修改" @click.native="adaptPsw" is-link class="text-left"></cell>
      <cell title="初始化密码" value="设置" @click.native="findPsw" is-link class="text-left"></cell>
    </group>
     <popup position="top" v-model="isWatch" :hide-on-blur="true" style="height:28vh" :show-mask="true">
      <group>
        <x-input required :show-clear="false" title="姓名" v-model="iform.userName" placeholder="请输入"></x-input>
        <x-input  required :show-clear="false" :min="11" :max="11" type="tel" title="手机号" v-model="iform.phone" placeholder="请输入"></x-input>
        <x-button type="primary" @click.native="queConfirm" style="width:70vw;margin-top:1rem;margin-bottom:1rem;line-height:2.5rem">确定</x-button>
      </group>
    </popup>
    <popup position="top" v-model="isShow" :hide-on-blur="true" style="height:35vh" :show-mask="true">
      <group>
        <x-input required :show-clear="false" title="旧密码" v-model="oldPwd" type="password" placeholder="请输入"></x-input>
        <x-input required :show-clear="false" title="新密码" v-model="newPwd" type="password" @click.native="checkOld" placeholder="请输入"></x-input>
        <x-input  required :show-clear="false" title="新密码" v-model="newPwd1" type="password" placeholder="请再输入一次确认"></x-input>
        <x-button type="primary" @click.native="checkNew" style="width:70vw;margin-top:1rem;margin-bottom:1rem;line-height:2.5rem">确定</x-button>
      </group>
    </popup>
  </div>
</template>
<script>
import { getDepInfo, getWxInfo } from '@/utils/userInfo.js'
import { updatePsw, findPsw } from '@/api/url'
import { httpPut, httpPost } from '@/utils/restful'
import { Group, Cell, Popup, XInput, XButton, Toast } from 'vux'
export default {
  components: {
    Group,
    Cell,
    Popup,
    XInput,
    XButton,
    Toast
  },
  data () {
    return {
      isWatch: false,
      oldPwd: '',
      newPwd: '',
      newPwd1: '',
      wxInfo: {},
      isShow: false,
      iform: {
        departmentId: getDepInfo().departmentId,
        // departmentId: 1615,
        userName: '',
        phone: ''
      },
      form: {
        departmentId: getDepInfo().departmentId,
        account: getWxInfo().account,
        unicode: getWxInfo().unicode
      },
      addr: undefined,
      sex: ''
    }
  },
  methods: {
    adaptPsw () {
      this.newPwd = ''
      this.newPwd1 = ''
      this.oldPwd = ''
      this.isShow = true
    },
    checkOld () {
      var reg = /^(\w){6,12}$/
      if (!reg.test(this.oldPwd)) {
        this.$vux.toast.text('密码为6-12位数字，下划线或字母')
      }
    },
    findPsw () {
      this.isWatch = true
    },
    // 找回密码
    queConfirm () {
      if (this.iform.userName === '' || this.iform.phone === '') {
        this.$vux.toast.text('请填写姓名与手机号', 'bottom')
      } else {
        httpPost(findPsw, this.iform).then((res) => {
          this.isWatch = false
          this.$vux.toast.text(res.message, 'bottom')
          this.$vux.confirm.show({
            title: '已初始化，密码如下',
            content: res.data
          })
        }).catch((err) => {
          this.$vux.toast.text(err, 'bottom')
        })
      }
    },
    checkNew () {
      var reg = /^(\w){6,12}$/
      if (reg.test(this.newPwd) && reg.test(this.newPwd1)) {
        if (this.newPwd !== this.newPwd1) {
          this.$vux.toast.text('两次输入的新密码不一致，请重新输入', 'bottom')
        } else {
          if (reg.test(this.newPwd) && reg.test(this.newPwd1)) {
            let obj = Object.assign(this.form, {
              newPwd: this.newPwd,
              oldPwd: this.oldPwd
            })
            httpPut(updatePsw, obj).then((res) => {
              this.isShow = false
              this.$vux.toast.text(res.message, 'bottom')
            }).catch((err) => {
              this.$vux.toast.text(err, 'bottom')
            })
          }
        }
      } else {
        this.$vux.toast.text('密码为6-12位数字，下划线或字母', 'bottom')
      }
    }
  },
  created () {
    this.wxInfo = getWxInfo()
    this.sex = this.wxInfo.sex === 1 ? '男' : (this.wxInfo.sex === 0 ? '女' : '')
    this.addr = (this.wxInfo.country || '') + (this.wxInfo.country ? '-' : '') + (this.wxInfo.province || '') + (this.wxInfo.province ? '-' : '') + (this.wxInfo.city || '')
  }
}
</script>
<style lang='scss' scoped>
.weui-cells__title {
  margin-top: 0;
}
.box-image {
  .image {
    border-radius: 50%;
    height: 2.375rem;
    width: 2.375rem;
    margin: .1875rem .625rem;
  }
}
</style>
