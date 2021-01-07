<template>
    <div>
        <NavBar
            title="编辑"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
        />
        <div style="margin-top:1rem">
        <Field
          v-model="item.leader"
          label="登录名"
          clearable
          required
          autofocus
        />
        <Field
          v-show="themeType === 5"
          v-model="item.teamName"
          label="班组名称"
          clearable
          required
        />
        <Field
          v-model="item.loginName"
          :label="themeType === 1 ? '业主姓名': (themeType === 2 ? '部门名称' :
          (themeType === 3 ? '班级名称' : (themeType === 4 ? '账户名称' : '带班名称')))"
          clearable
          required
        />
        <Field
          v-model="item.phone"
          label="手机号"
          clearable
          required
          @blur="checkPhone"
          ref="inphone"
        />
        <Field
          v-model="item.addr"
          :label="themeType === 1 ?'房号': '地址'"
          clearable
          required
          ref="addr"
        />
         <Field
          required
          clearable
          label="微信推送"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="item.openPush" style="margin-left:1rem;line-height:2rem;">
          <Radio :name="0" style="font-size:0.85rem;margin-left:1.5rem">关闭</Radio>
          <Radio :name="1" style="font-size:0.85rem;margin-left:1.5rem">开启</Radio>
        </RadioGroup>
        <Field
          required
          label="审核方式"
          class="fi"
          disabled
          :border="false"
        />
        <RadioGroup v-model="item.isCheck" style="margin-left:1rem;line-height:2rem;border-bottom:1px solid #ebedf0;">
          <Radio :name='0' style="font-size:0.85rem;margin-left:2rem;">人工审核</Radio>
          <Radio :name='1' style="font-size:0.85rem;margin-left:2rem;">自动审核</Radio>
        </RadioGroup>
         <Field
          :value="item.userNum"
          :label="themeType === 5 ? '非访客人数' : '家庭人数'"
          clearable
          required
        />
        <!-- <Field
          :value="item.visitorNum"
          label="访客人数"
          clearable
          required
        /> -->
        </div>
        <Button size="large" type="info" style="margin-top:5rem;width:80vw;margin-left:10vw;" :loading="isLoading" @click="save(item)">保存</Button>
    </div>
</template>
<script>
import { Field, Button, NavBar, Toast, RadioGroup, Radio } from 'vant'
import { checkFormatter } from '@/utils/formatter.js'
import { AiDuyCompany } from '@/api/url'
import { httpPut } from '@/utils/restful'
export default {
  name: 'editUser',
  data () {
    return {
      themeType: undefined,
      item: {
        leader: undefined,
        openPush: 1,
        loginName: undefined,
        phone: undefined,
        addr: undefined,
        isCheck: undefined,
        userNum: undefined
        // visitorNum: undefined
      },
      checkFormatter,
      isLoading: false
    }
  },
  components: {
    Field,
    Button,
    NavBar,
    RadioGroup,
    Radio
  },
  methods: {
    onClickLeft () {
      this.$router.push('/staffManage/')
    },
    checkPhone () {
      const phonePsd = this.item.phone
      var reg = /^1[123456789]\d{9}$/
      if (phonePsd === '') {
        Toast('手机号码不可为空！')
        this.$refs.inphone.focus()
      } else if (phonePsd !== '' && !reg.test(phonePsd)) {
        Toast('手机号码格式不正确')
        this.$refs.inphone.focus()
      } else {
        this.$refs.addr.focus()
      }
    },
    // 修改或添加完，带数据返回
    save (value) {
      this.isLoading = true
      const updateFormData = Object.assign({}, this.item)
      httpPut(AiDuyCompany, updateFormData)
        .then(res => {
          this.isLoading = false
          Toast.success(res.message)
          this.$router.push('/staffManage/')
        }).catch(() => {
          this.isLoading = false
        })
    }
  },
  created () {
    // console.log(this.$route.query.info)
    this.themeType = parseInt(localStorage.getItem('themeType'))
    if (this.$route.params.info) {
      this.item = this.$route.params.info
    } else {
      this.item = []
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
