<template>
  <div>
    <div class="box text-c">
      <up-loadimg @uploadFileImg="uploadFileImg"></up-loadimg>
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="姓名"
          label="姓名"
          placeholder="姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"
        />
        <van-field
          v-model="phoneNumber"
          name="手机号"
          label="手机号"
          placeholder="手机号"
          :rules="[{ required: true, message: '请填写手机号' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Notify } from 'vant'
import upLoadimg from '../components/uploadImg'
import {insertVisitor} from '@/api/url'
export default {
  name: '',
  data () {
    return {
      data: this.$route.query.data ? JSON.parse(decodeURI(this.$route.query.data)) : {
        id: 29633,
        departmentId: 3,
        openId: 'opsdJ46wTBTUH8VElimLVq2FgvQA',
        beginTime: '2020-11-24 17:35:00',
        endTime: '2020-11-24 17:36:00',
        type: 1,
        time: 3,
        phone: 18859878855,
        userName: '水电费地方',
        idCard: null,
        remark: '',
        photo: '6B84B6EDDAC94F9F9C57B56429DBF155'
      },
      departmentId: this.$route.query.departmentId,
      phoneNumber: undefined,
      username: undefined
    }
  },
  components: {
    upLoadimg,
    [Notify.Component.name]: Notify.Component
  },
  created () {
  },
  methods: {
    onSubmit () {
      let data = {
        photo: this.photo,
        phone: this.phoneNumber,
        userName: this.username,
        departmentId: this.departmentId,
        beginTime: this.data.beginTime,
        endTime: this.data.endTime,
        time: this.data.time,
        openId: this.data.openId,
        id: this.data.id,
        type: this.data.type,
        idCard: this.data.idCard,
        remark: this.data.remark
      }
      if (this.photo === undefined) {
        Notify({ type: 'danger', message: '请上传图片' })
        return
      }
      this.$http.post(insertVisitor, data)
        .then(res => {
          if (res.code === 1) {
            Notify({ type: 'success', message: '您已完成申请' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    uploadFileImg (file) {
      this.photo = file.photo
      console.log(this.photo)
    }
  }
}
</script>
<style lang="scss" scoped></style>
