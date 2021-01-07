<template>
  <div class="app-container">
    <div class="table-main">
      <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="公司/团队名称" prop="userName">
          <el-input v-model="form.departmentName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="onSubmit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { modifyTeamName, userInfo } from '@/api/url.js'
import { httpGet, httpPut } from '@/utils/restful.js'
export default {
  data () {
    return {
      form: {
        departmentName: '',
        id: this.$store.getters.departmentId
      },
      formRules: {
        departmentName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      loading: false
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      httpGet(userInfo + '/' + this.$store.getters.userId).then(res => {
        if (res.data) {
          this.form.departmentName = res.data.departmentName
        }
      }).catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          httpPut(modifyTeamName, this.form).then(res => {
            this.loading = false
            this.$store.dispatch('setTeamName', this.form.departmentName)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input{
    width: auto;
}
</style>
