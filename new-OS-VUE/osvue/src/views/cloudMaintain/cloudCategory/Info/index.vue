<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>详情信息</span>
      </div>
      <el-form :inline="true" :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="80px" >
        <div class="filter-container">
          <el-form-item label="名称" prop="typeName">
            <el-input v-model="form.typeName" style="width: 200px;"  class="filter-item"  placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-select  v-model="form.icon"  style="width: 200px;" class="filter-item" placeholder="图标">
                <el-option v-for="item in isIconType" :key="item.valueNo" :label="'图标' + item.valueNo" :value="item.valueNo">
                  <span style="float: left">图标{{ item.valueNo }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"> <i :class="item.valueName"></i></span>
                </el-option>
            </el-select>
            <span class="text">
              &#x3000;<i style="font-size: 14px;" :class="isIconFormatter(form.icon)"></i>
            </span>
          </el-form-item>
          <el-form-item label="备注信息" >
            <el-input v-model="form.resume" style="width: 300px;"  placeholder="请输入备注信息"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" :loading="updateLoading" @click="updateData">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="form.level === 3 ? 16 : 0">
        <el-card class="box-card" style="margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>可被创建上级</span>
          </div>
          <div>
            <template>
              <el-checkbox-group v-model="checked" >
                <el-checkbox v-for="item in depTypeList"  :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
          <el-button style="margin-top:20px;" type="success"  :loading = "depTypeLoading" @click="saveDepType">保存</el-button>
        </el-card>
      </el-col>
      <el-col :span="form.level === 3 ? 8 : 24">
        <el-card class="box-card" style="margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>默认权限</span>
          </div>
          <el-button v-if="type === 0"  :loading = "permissionLoading" @click="showPermission(0)">车场权限</el-button>
          <el-button v-if="type === 1" :loading = "permissionFaceLoading" @click="showPermission(1)">人脸权限</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-card v-if="form.id" class="box-card" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>默认角色管理</span>
      </div>
      <div v-if="form.id">
        <Role  :id = "form.id" :level="level"/>
      </div>
    </el-card>
    <el-card v-show="form.id && form.level === 3" class="box-card" style="margin-top: 10px">
      <div slot="header" class="clearfix">
        <span>默认任务管理</span>
      </div>
      <div >
        <TaskProcess :id = 'form.id' :level="level"></TaskProcess>
      </div>
    </el-card>
    <!-- 权限页面 -->
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        accordion
        ref="tree"
        highlight-current
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="setPermissionLoading" type="primary" @click="getCheckedNodes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { httpGet, httpPut, httpPost } from '@/utils/restful'
import { DepType, DepTypePermission, getDepTypeCanCreate, setDepTypeCanCreate } from '@/api/url'
import { isIconFormatter } from '@/utils/formatter.js'
import { isIconType } from '@/utils/selectAble.js'
import Role from './components/Role'
import TaskProcess from './components/TaskProcess'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'type'
    ])
  },
  components: {
    Role,
    TaskProcess
  },
  data () {
    return {
      updateLoading: false,
      permissionLoading: false,
      permissionFaceLoading: false,
      setPermissionLoading: false,
      depTypeLoading: false,
      isIconFormatter: isIconFormatter,
      isIconType: isIconType,
      form: {
        id: undefined,
        level: 0,
        typeName: undefined,
        resume: undefined,
        icon: undefined
      },
      formRules: {
        typeName: [
          {required: true, trigger: 'blur', message: '请输入名称'}
        ],
        icon: [
          {required: true, trigger: 'change', message: '请选择图标'}
        ]
      },
      // 分配默认权限
      dialogVisible: false,
      treeData: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      checked: [],
      depTypeList: [],
      typeId: undefined,
      level: false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'cloudCategory') {
        this.$router.push({path: '/cloudMaintain/cloudCategory/level', query: { id: 1 }})
      } else {
        this.form.id = this.$route.query.id
        this.fetchData()
        if (this.$route.query.level) {
          this.getCanDepType()
          this.level = true
        } else {
          this.level = false
        }
      }
    }
  },
  methods: {
    // 获取可被创建的二级
    getCanDepType () {
      httpGet(getDepTypeCanCreate + this.form.id).then(res => {
        if (res.data.ids === null) {
          this.checked = []
        } else {
          this.checked = res.data.ids
        }
        this.depTypeList = res.data.info
      }).catch(() => {})
    },
    // 保存可被创建的下级
    saveDepType () {
      if (this.checked.length === 0) {
        this.$message.error('请选择二级部门')
      } else {
        this.depTypeLoading = true
        httpPost(setDepTypeCanCreate, {id: this.form.id, ids: this.checked}).then(res => {
          this.depTypeLoading = false
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {})
      }
    },
    // 获取数据
    fetchData () {
      httpGet(DepType + '/' + this.form.id).then(res => {
        this.form = Object.assign({}, res.data)
      }).catch(() => {})
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          httpPut(DepType, this.form).then(res => {
            this.updateLoading = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.updateLoading = false
          })
        }
      })
    },
    // 获取权限
    showPermission (type) {
      if (type === 0) {
        this.permissionLoading = true
      } else {
        this.permissionFaceLoading = true
      }
      this.typeId = type
      httpGet(DepTypePermission + this.form.id + '/' + type).then(res => {
        this.dialogVisible = true
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
        this.permissionLoading = false
        this.permissionFaceLoading = false
      }).catch(() => {
        this.permissionLoading = false
        this.permissionFaceLoading = false
      })
    },
    // 设置权限
    getCheckedNodes () {
      this.setPermissionLoading = true
      let data = {
        id: this.form.id,
        ids: [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
      }
      httpPost(DepTypePermission + this.typeId, data).then(res => {
        this.dialogVisible = false
        setTimeout(() => { this.setPermissionLoading = false }, 300)
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.setPermissionLoading = false
      })
    }
  },
  created () {
    this.form.id = this.$route.query.id
  },
  mounted () {
    this.fetchData()
    if (this.$route.query.level && this.$route.query.level === 3) this.getCanDepType()
  }
}
</script>
