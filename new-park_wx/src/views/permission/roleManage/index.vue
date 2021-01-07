<template>
  <div>
    <top-right-btn v-has="['新增']" @click.native="handleCreate">添加</top-right-btn>
    <van-search placeholder="请输入角色名" show-action v-model.trim="listQuery.name" class="mar-b-15" @search="handleFilter" >
      <div slot="action" @click="handleFilter">搜索</div>
    </van-search>

    <main>
        <div class="text-c" style="color: #909399;" v-if="tableData.length===0" >暂无数据</div>

        <list-card v-for="(item, index) in tableData" :key="index">
            <van-cell-group :border="isShowColumnFormatter(['编辑','权限','删除'])">
                <van-cell title="角色名" :value="item.name" />
                <van-cell title="描述信息" :value="item.resume" />
            </van-cell-group>
            <template v-slot:footer>
                <van-button v-has="['编辑']" :disabled="item.isDefault === 1" type="info" size="small" round @click="handleUpdate(item)" >编辑</van-button>
                <van-button v-has="['权限']" v-if="item.isDefault === 0" type="primary" size="small" round @click="handleRole(item)" >分配权限</van-button>
                <van-button v-has="['权限']" v-if="item.isDefault === 1" type="primary" size="small" round @click="handleLookRole(item)" >查看权限</van-button>
                <van-button v-has="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            </template>
        </list-card>

        <van-pagination
          v-if="tableData.length!==0"
          v-model="listQuery.offset"
          :page-count="Math.ceil(total/listQuery.limit)"
          :items-per-page="listQuery.limit"
          mode="simple"
          @change="changePage"/>
    </main>

    <van-popup v-model="dialogFormVisible" round close-on-popstate class="popup" style="width:80%;">
      <ValidationObserver ref="form">
        <van-cell-group>
          <ValidationProvider name="角色名" rules="required" v-slot="{ errors }" slim>
            <van-field required v-model.trim="form.name" label="角色名" placeholder="请输入角色名" :error-message="errors[0]" />
          </ValidationProvider>
          <van-field v-model.trim="form.resume" label="描述信息" placeholder="请输入描述信息" />
        </van-cell-group>
        <div class="bottom text-r padding-10 flex-jc-around">
          <van-button round @click="dialogFormVisible = false" style="width:2.666rem">取消</van-button>
          <van-button round type="info" @click="createData" :loading="createLoading" v-if="dialogStatus=='create'" style="width:2.666rem">保存</van-button>
          <van-button round type="info" @click="updateData" :loading="updateLoading" v-else style="width:2.666rem">修改</van-button>
        </div>
      </ValidationObserver>
    </van-popup>
    <van-popup v-model="dialogVisible" round close-on-popstate class="popup per" closeable style="width:80%;">
      <div class="title padding-10">分配权限</div>
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        accordion
        ref="tree"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps">
      </el-tree>
      <div class="bottom text-r padding-10 flex-jc-around" v-if="isDefault">
        <van-button round @click="dialogVisible = false" style="width:2.666rem">取消</van-button>
        <van-button round type="info" @click="submitRoles" :loading="roleLoading" style="width:2.666rem">确定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, Pagination, Cell, CellGroup, Button, Dialog, Field, Popup } from 'vant'
import listCard from '@/components/listCard'
import topRightBtn from '@/components/topRightBtn'
import { Tree } from 'element-ui'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
import { getRoles, createRoles, Roles, RolesPermisson, RolesPermissonOnly, lookRolesPermisson } from '@/api/url'
import { isShowColumnFormatter } from '@/utils/formatter.js'
export default {
  components: {
    [Search.name]: Search,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Field.name]: Field,
    [Popup.name]: Popup,
    listCard,
    topRightBtn,
    [Tree.name]: Tree
  },
  data () {
    return {
      isShowColumnFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        name: undefined
      },
      tableData: [],
      total: 0,
      textMap: {
        update: '编辑',
        create: '添加'
      },
      dialogStatus: '',
      form: {
        id: undefined,
        name: '',
        resume: ''
      },
      dialogFormVisible: false,
      createLoading: false,
      updateLoading: false,
      roleLoading: false,
      // 分配默认权限
      dialogVisible: false,
      isDefault: false,
      defaultCheckedKeys: [],
      treeData: [],
      roleId: 0,
      defaultProps: {
        children: 'childrens',
        label: 'name'
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, { departmentId: this.$store.getters.departmentId })
      httpGet(getRoles, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 删除选中
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(Roles, {ids: [id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 3000
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        name: '',
        resume: ''
      }
      this.$nextTick(() => {
        this.$refs.form.reset()
      })
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      self.resetForm()
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.createLoading = true
        this.form = Object.assign(this.form, {connId: this.$store.getters.departmentId})
        httpPost(createRoles, this.form).then(res => {
          this.fetchData()
          this.dialogFormVisible = false
          setTimeout(() => { this.createLoading = false }, 300)
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 3000
          })
        }).catch(() => {
          this.createLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    // 修改
    updateData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.updateLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(Roles, updateFormData).then(res => {
          this.fetchData()
          this.dialogFormVisible = false
          setTimeout(() => { this.updateLoading = false }, 300)
          this.$notify({
            message: res.message,
            type: 'success',
            duration: 3000
          })
        }).catch(() => {
          this.updateLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    },
    // 获取权限
    handleLookRole (row) {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      if (row.isDefault === 1) {
        this.isDefault = false
      } else {
        this.isDefault = true
      }
      this.roleId = row.id
      httpGet(lookRolesPermisson + '/' + row.id).then(res => {
        ToastLoading.clear()
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
        this.dialogVisible = true
      }).catch(() => { ToastLoading.clear() })
    },
    handleRole (row) {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      if (row.isDefault === 1) {
        this.isDefault = false
      } else {
        this.isDefault = true
      }
      this.roleId = row.id
      httpGet(RolesPermissonOnly + '/' + row.id).then(res => {
        ToastLoading.clear()
        this.treeData = res.data.info
        this.defaultCheckedKeys = res.data.ids
        this.dialogVisible = true
      }).catch(() => { ToastLoading.clear() })
    },
    // 提交权限
    submitRoles () {
      this.roleLoading = true
      let data = {id: this.roleId, ids: [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]}
      httpPost(RolesPermisson, data).then(res => {
        this.dialogVisible = false
        this.$notify({
          message: res.message,
          type: 'success',
          duration: 3000
        })
      }).catch(() => {
        this.roleLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.popup {
  .title {
    font-size: 15px;
  }
}
.per {
  /deep/ .el-tree-node__content {
      height: 30px;
  }
}
</style>
