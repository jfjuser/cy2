<template>
  <div>
    <NavBar title="意见反馈" left-text="设置" left-arrow @click-left="onClickLeft"/>
    <span style="line-height:3rem;margin-left:1rem">您的反馈是：</span>
    <RadioGroup v-model="form.type">
      <CellGroup>
        <Cell title="咨询" clickable @click="form.type = '1'">
           <Radio name='1'/>
        </Cell>
        <Cell title="建议" clickable @click="form.type = '2'">
          <Radio name='2'/>
        </Cell>
        <Cell title="其他" clickable @click="form.type = '3'">
          <Radio name='3'/>
        </Cell>
      </CellGroup>
    </RadioGroup>
    <Field
      v-model="form.suggestionContact"
      label="意见反馈"
      type="textarea"
      placeholder="我们将为您不断改进"
      :error-message="err.feedback"
      @blur="feedContent"
      clearable
    />
    <Field
      label="邮箱(选填)"
      placeholder="以便我们给您回复"
      v-model="form.email"
      :error-message="err.email"
      @change="checkEmail"
      clearable
    />
    <Field
      label="其他(选填)"
      placeholder="其他联系方式(QQ或手机号)"
      v-model="form.phone"
      :error-message="err.qq"
      @change="checkQq"
      clearable
    />
    <Button type="info" size=large style="margin-top:20vh;width:80vw;margin-left:10vw;" @click="submitFeed" :isLoading="loading">提交</Button>
  </div>
</template>
<script>
import { NavBar, RadioGroup, Cell, CellGroup, Radio, Field, Button, Toast } from 'vant'
import { suggestionAdd } from '@/api/url'
import { httpPost } from '@/utils/restful'
import { timeFormatter } from '@/utils/formatter'
export default {
  name: 'feedback',
  data () {
    return {
      loading: false,
      form: {
        suggestionContact: undefined,
        email: '',
        phone: undefined,
        type: '1',
        kind: 0,
        uuid: ''
      },
      err: {
        feedback: '',
        email: '',
        qq: ''
      }
    }
  },
  components: { NavBar, RadioGroup, Cell, CellGroup, Radio, Field, Button, Toast },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    checkEmail () {
      if (!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(this.form.email))) {
        this.err.email = '请输入正确的邮箱地址'
      } else {
        this.err.email = ''
      }
    },
    feedContent () {
      if (this.form.suggestionContact === '') {
        this.err.feedback = '请填写您的反馈意见'
      } else {
        this.err.feedback = ''
      }
    },
    checkQq () {
      if (!(/^1[123456789]\d{9}$/.test(this.form.phone)) && !(/^1[0123456789]\d{3,8}$/.test(this.form.phone))) {
        this.err.qq = '请输入正确的手机号码或QQ号'
      } else {
        this.err.qq = ''
      }
    },
    submitFeed () {
      if (this.form.suggestionContact !== undefined) {
        this.loading = true
        this.form = Object.assign(this.form, {date: timeFormatter(new Date()).valueOf()})
        httpPost(suggestionAdd, this.form).then(res => {
          this.loading = false
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.$router.push('/mySet/')
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$notify({
          message: '请填写完整参数',
          type: 'warning',
          duration: 4 * 1000
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
