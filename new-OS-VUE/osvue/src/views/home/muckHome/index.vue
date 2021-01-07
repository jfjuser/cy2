<template>
  <div class="app-container">
    <div class="table-main">
      <el-form   :model="form" autoCompete = "on" label-position="right" label-width="120px">
        <el-form-item label="部门名称">
          <el-input v-model="form.departmentName" :disabled ="true"></el-input>
        </el-form-item>
        <el-form-item  label="部门类别">
          <el-select v-model="form.departmentTypeId" disabled >
            <el-option
              v-for="item in depType"
              :key="item.id"
              :label="item.typeName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input :disabled ="true"  v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="resume">
          <el-input :disabled ="true" type="textarea" v-model="form.resume"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { department, getDepTypeByLevel } from '@/api/url'
import { httpGet } from '@/utils/restful'
export default {
  name: 'muck-home',
  computed: {
    ...mapGetters([
      'departmentTypeId'
    ])
  },
  data () {
    return {
      form: {
        id: undefined,
        departmentName: undefined,
        departmentTypeId: undefined,
        phone: undefined,
        email: undefined,
        resume: undefined,
        createAt: undefined
      },
      depType: []
    }
  },
  methods: {
    // 获取部门详情
    getDepInfo () {
      httpGet(department + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
      }).catch(() => {})
    },
    // 获取部门类别
    getDepTypeByLevel () {
      let type
      if (this.departmentTypeId === 100044) {
        type = 3
      } else {
        type = 2
      }
      httpGet(getDepTypeByLevel + type).then(res => {
        this.depType = res.data
      }).catch(() => {})
    }
  },
  mounted () {
    this.getDepTypeByLevel()
    this.getDepInfo()
  }
}
</script>
<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }
</style>
