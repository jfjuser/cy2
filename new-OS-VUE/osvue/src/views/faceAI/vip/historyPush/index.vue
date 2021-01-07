<template>
  <div class="app-container">
    <div>
      <el-row :span="20">
        <el-col :span="11" class="table-main" style="margin-right: 20px;">
          <el-form ref="dataform"  v-loading.body="listLoading" :model="form" autoCompete = "on" label-position="left" label-width="120px">
            <el-form-item label="信息推送">
              <el-radio-group @change="changeVal" v-model="form.type">
                <el-radio :label=0 border>进出记录推送</el-radio>
                <el-radio :label=1  border>相机状态推送</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="地址">
              <el-input style="width:15.75rem;" v-model="form.pushUrl" placeholder="请填写地址"></el-input>
            </el-form-item>
            <el-form-item label="账号">
              <el-input style="width:15.75rem;" v-model="form.pushAppCode" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="秘钥">
              <el-input style="width:15.75rem;" v-model="form.pushAppSecret" placeholder="请填写秘钥"></el-input>
            </el-form-item>
            <el-form-item label="加密方式">
              <el-input style="width:15.75rem;" v-model="form.pushEncryptWay" placeholder="请选择加密方式"></el-input>
            </el-form-item>
            <el-form-item label="加密规则">
              <el-input  style="width:15.75rem;" v-model="form.pushEncryptRule" placeholder="请选择加密规则"></el-input>
           </el-form-item>
            <el-form-item>
             <el-button size="large" @click="setUpdate" type="primary">保存</el-button>
           </el-form-item>
           </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getPostSetting } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  name: '',
  data () {
    return {
      listLoading: false,
      form: {
        id: undefined,
        pushUrl: undefined,
        type: 0,
        pushAppCode: undefined,
        pushAppSecret: undefined,
        pushEncryptWay: undefined,
        pushEncryptRule: undefined
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.listLoading = true
      httpGet(getPostSetting + '/' + this.$store.getters.departmentId + '/' + this.form.type).then((res) => {
        if (res.data !== null) {
          this.form = res.data
        } else {
          this.form = {
            id: this.form.id,
            type: Number(this.form.type),
            pushUrl: undefined,
            pushAppCode: undefined,
            pushAppSecret: undefined,
            pushEncryptWay: undefined,
            pushEncryptRule: undefined
          }
        }
        this.form.type = Number(this.form.type)
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 切换值
    changeVal (value) {
      console.log(value)
      this.form.type = Number(value)
      this.fetchData()
    },
    setUpdate () {
      let a = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(getPostSetting, a).then((res) => {
        this.$message({
          type: 'success',
          duration: '3000',
          message: res.message
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
