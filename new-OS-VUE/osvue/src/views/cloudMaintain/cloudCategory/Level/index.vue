<template>
  <div>
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item add" type="primary" @click="handleCreate" icon="el-icon-edit" >添加</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading"   @click="handleDelete" :disabled="disabled" icon="el-icon-delete">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="名称" align="center" prop="typeName"></el-table-column>
        <el-table-column label="图标" align="center" prop="icon">
          <template slot-scope="scope">
            <i style="color:#F56C6C;font-size: 20px;" :class="isIconFormatter(scope.row.icon)"></i>
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="resume"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button v-if="$route.query.id == 1" class="person" type="primary" @click.native.prevent="handleRole(scope.row)" size="mini" >研发权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 新增或者编辑 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width = "30%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px" >
            <el-form-item label="名称" prop="typeName">
                <el-input v-model="form.typeName"   placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-select  v-model="form.icon"  class="filter-item" placeholder="图标">
                    <el-option v-for="item in isIconType" :key="item.valueNo" :label="'图标' + item.valueNo" :value="item.valueNo">
                      <span style="float: left">图标{{ item.valueNo }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px"> <i :class="item.valueName"></i></span>
                    </el-option>
                </el-select>
                <span class="text">
                  &#x3000;<i style="font-size: 20px;" :class="isIconFormatter(form.icon)"></i>
                </span>
            </el-form-item>
             <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注信息" >
                <el-input type="textarea" v-model="form.resume"  placeholder="请输入备注信息"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button v-if="dialogStatus=='create'" :loading="createLoading" type="primary" @click="createData">保存</el-button>
            <el-button v-else type="primary" :loading="updateLoading" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <!-- 研发权限 -->
      <el-dialog title="研发权限" :visible.sync = "dialogVisible" width="50%">
        <el-tree
          :data = "treeData"
          node-key="id"
          ref="tree"
          accordion
          highlight-current
          :default-expanded-keys="defalutExpanded"
          :props="defaultProps"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span >
              <el-button
                type="text"
                icon="el-icon-document"
                class="showids"
                :data-clipboard-text="node.label"
                @click.stop="copy($event, node.label)"
              >
              </el-button>
              <el-button
                v-if="node.level < 4"
                type="text"
                icon="el-icon-plus"
                @click.stop="() => append(node, data)">
              </el-button>
              <!-- v-if="node.level >= 4" -->
              <el-button
                type="text"
                v-if="node.level > 1"
                icon="el-icon-edit"
                @click.stop="() => adapt(node, data)"
              >
              </el-button>
              <el-button
                type="text"
                icon="el-icon-delete"
                @click="() => remove(node, data)">
              </el-button>
            </span>
          </span>
        </el-tree>
        <el-dialog :title="text[dialog]" width="30%" :visible.sync = "innerVisible" append-to-body>
          <el-form autoCompete = "on" label-position="right" label-width="100px">
            <el-form-item label="权限名称">
              <el-input v-model="perForm.name"></el-input>
            </el-form-item>
            <el-form-item label="权限值">
              <el-input v-model="perForm.value"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="perForm.resume"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="innerVisible = false">取消</el-button>
              <el-button type="primary" v-show="dialog === 'create'" :loading="submitLoading" @click="createPer">保存</el-button>
              <el-button type="primary" v-show="dialog === 'updata'" :loading="amendLoading" @click="amendData">修改</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import { isIconFormatter } from '@/utils/formatter.js'
import { isIconType } from '@/utils/selectAble.js'
import { getDepTypeByLevelPage, DepType, DepTypePermission, Permission, deletePermission } from '@/api/url'
import { httpGet, httpPost, httpPut, httpDelete } from '@/utils/restful'
export default {
  data () {
    return {
      listQuery: {
        offset: 1,
        limit: 10
      },
      options: [
        {
          value: 0,
          label: '车场'
        },
        {
          value: 1,
          label: '人脸'
        }
      ],
      amendLoading: false,
      tableData: [],
      defalutExpanded: [0, 1, 10000],
      dialog: '',
      text: {
        create: '新增',
        updata: '编辑'
      },
      listLoading: true,
      submitLoading: false,
      total: 0,
      disabled: true,
      isIconFormatter: isIconFormatter,
      isIconType: isIconType,
      id: undefined,
      form: {
        id: undefined,
        level: 0,
        typeName: undefined,
        resume: undefined,
        icon: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      selectArrayId: [],
      formRules: {
        typeName: [
          {required: true, trigger: 'blur', message: '请输入'}
        ],
        icon: [
          {required: true, trigger: 'change', message: '请选择图标'}
        ]
      },
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      // 研发权限
      dialogVisible: false,
      treeData: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      rowData: {},
      selectData: {},
      selectNode: {},
      innerVisible: false,
      perForm: {
        name: '',
        value: '',
        resume: ''
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'cloudCategory') {
        this.$router.push({path: '/cloudMaintain/cloudCategory/level', query: { id: 1 }})
      } else {
        this.listQuery.offset = 1
        this.listQuery.levelId = to.query.id
        this.form.level = to.query.id
        if (this.form.level <= 3) this.fetchData()
      }
    }
  },
  methods: {
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10
      }
      this.fetchData()
    },
    copy (event, text) {
      let clipboard = new Clipboard(event.target, { text: () => text })
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        clipboard.destroy() // 使用destroy可以清楚缓存
      })
      clipboard.on('error', e => {
        this.$message.warning('浏览器不支持复制')
        clipboard.destroy() // 使用destroy可以清楚缓存
      })
      clipboard.onClick(event)
    },
    fetchData () {
      let self = this
      httpGet(getDepTypeByLevelPage + self.$route.query.id, self.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
        }
        self.listLoading = false
      }).catch(() => {
        self.listLoading = false
      })
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        level: this.$route.query.id,
        typeName: undefined,
        resume: undefined,
        icon: undefined
      }
      this.fetchData()
    },
    handleCreate () {
      let self = this
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    // 删除所选
    handleDelete () {
      const h = this.$createElement
      let message = ['删除所选级别后下级所有部门将不能正常使用']
      let info = {
        h,
        message,
        firstconfirmButtonText: '确定',
        firstcancelButtonText: '取消',
        secondmessgae: '您已了解删除后果，确定还要继续删除吗',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定删除'
      }
      this.MessageBox(info).then(() => {
        this.deleteLoading = false
      }).catch(() => {
        this.deleteLoading = true
        // document.onkeydown = undefined
        httpDelete(DepType, {ids: this.selectArrayId}).then(res => {
          this.deleteLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.deleteLoading = false
        })
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 新增
    createData () {
      let self = this
      // const h = this.$createElement
      // self.$refs['blurs'].$el.blur
      // this.$msgbox({
      //   title: '警告',
      //   customClass: 'messageBox_class',
      //   message: h('div', {style: 'display:flex;align-items:center;flex-direction:column;justify-content:center'}, [
      //     h('img', {style: 'width:80px;height:80px', attrs: {src: require('@/assets/tixing.png')}}, '内容可以是 '),
      //     h('span', { style: 'width:100%;margin-top:20px' }, '1.在添加后可以显示在部门切换分类中,但要在下级部门中添加并选中当前创建部门类别'),
      //     h('span', { style: 'width:100%' }, '2.在添加后可给级别下所有部门添加不同权限')
      //   ]),
      //   showCancelButton: true,
      //   cancelButtonText: '取消',
      //   confirmButtonText: '确定'
      // }).then(() => {
      this.$confirm('1.在添加后可以显示在部门切换分类中,但要在下级部门中添加并选中当前创建部门类别<br>2.在添加后可给级别下所有部门添加不同权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        self.$refs.dataform.validate((valid) => {
          if (valid) {
            self.createLoading = true
            httpPost(DepType, this.form).then(res => {
              self.fetchData()
              self.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4 * 1000
              })
            }).catch(() => {
              self.createLoading = false
            })
          }
        })
      })
    },
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(DepType, updateFormData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
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
    handleRole (row) {
      this.rowData = row
      this.fetchTreeData()
    },
    fetchTreeData () {
      httpGet(DepTypePermission + this.rowData.id + '/' + this.rowData.type).then(res => {
        this.treeData = [
          { id: 0, name: '总权限', childrens: res.data.info }
        ]
        if (!this.dialogVisible) this.dialogVisible = true
      }).catch(() => {})
    },
    append (node, data) {
      this.clearPerForm()
      this.selectNode = node
      this.selectData = data
      this.name = ''
      this.dialog = 'create'
      this.innerVisible = true
      this.defalutExpanded = [node.key]
    },
    adapt (node, data) {
      this.getvalue(data.id)
      this.dialog = 'updata'
      this.innerVisible = true
      // this.perForm.name = data.name
      this.id = data.id
      this.defalutExpanded = [node.key]
    },
    getvalue (id) {
      httpGet(Permission + '/' + id).then((res) => {
        console.log(res)
        this.perForm = res.data
      }).catch(() => {})
    },
    clearPerForm () {
      this.perForm = {
        name: '',
        value: '',
        resume: ''
      }
    },
    amendData () {
      this.amendLoading = true
      console.log(this.perForm)
      httpPut(Permission, Object.assign(this.perForm, {id: this.id}))
        .then(res => {
          this.$message({
            message: res.message,
            duration: 3000,
            type: 'success'
          })
          this.fetchTreeData()
          this.amendLoading = false
          this.innerVisible = false
        }).catch(() => {
          this.amendLoading = false
        })
    },
    createPer () {
      this.submitLoading = true
      let type
      if (this.selectNode.level === 1) {
        type = 3
      } else if (this.selectNode.level === 2) {
        type = 2
      } else if (this.selectNode.level === 3) {
        type = 1
      }
      let data = Object.assign(this.perForm, {
        filterType: this.rowData.type,
        type: type,
        pid: this.selectData.id
      })
      httpPost(Permission, data)
        .then(res => {
          this.fetchTreeData()
          this.submitLoading = false
          this.innerVisible = false
        }).catch(() => {
          this.submitLoading = false
        })
    },
    remove (node, data) {
      const h = this.$createElement
      let message = ['删除后下级所有部门将不能使用该权限', '该权限下有其他权限将一起被删除']
      let info = {
        h,
        message,
        firstconfirmButtonText: '确定',
        firstcancelButtonText: '取消',
        secondmessgae: '正在删除该权限, 确定要删除吗?',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定删除'
      }
      this.MessageBox(info).then(() => {}).catch(() => {
        // document.onkeydown = undefined
        httpDelete(deletePermission + data.id)
          .then(res => {
            this.defalutExpanded = [0]
            this.fetchTreeData()
            this.$message.success(res.message)
          }).catch(() => {})
      })
    }
  },
  mounted () {
    if (this.form.level <= 3) this.fetchData()
  },
  created () {
    this.listQuery.levelId = this.$route.query.id
    this.form.level = this.$route.query.id
  }
}
</script>
<style lang="scss" scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
