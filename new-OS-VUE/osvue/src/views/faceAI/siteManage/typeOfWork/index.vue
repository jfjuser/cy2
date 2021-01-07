<template>
  <div class="app-container">
    <div class="table-main" style="margin-bottom: 20px">
      <!-- 操作 -->
      <el-form ref="form" label-width="80px">
        <el-form-item label="工种">
          <el-checkbox-group v-model="checkedType">
            <el-checkbox  v-show="isCat === false ? index < 20 : true" style="margin:15px 20px" v-for="(item, index) in usefulData" :label="item.id" :key="index">{{item.workName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="isCat"
            active-text="查看更多"
            inactive-text="收起">
          </el-switch>
        </el-form-item>
        <el-form-item align=right>
          <el-button type="primary" style="margin-right:10%" @click="goDefault">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-main">
      <div class="filter-container" >
        <el-button class="filter-item" type="primary" @click="addWorkerType">添加</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" v-if = "isShowColumnFormatter(['删除'])"  width="40" fixed="left" ></el-table-column>
        <el-table-column label="工种名称" align="center" prop="workName"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300" v-if = "isShowColumnFormatter(['编辑','权限'])">
          <template slot-scope="scope">
            <!-- 0表示否 1代表是默认 -->
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog title="添加工种" :visible.sync="assignVisible"> -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="assignVisible">
        <el-form ref="dataform" label-position="right" label-width="120px" >
          <el-form-item label="工种名称">
            <el-input v-model="workTypeInsertDto.workName" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignVisible = false">取消</el-button>
          <el-button v-if="dialogStatus === 'create'" :loading = "createLoading" @click="addFinshed" type="primary">保存</el-button>
          <el-button v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { typeManage, defaultGo, adaptWorker, addWorker, delWorkType } from '@/api/url'
export default {
  data () {
    return {
      isCat: false,
      checkedType: [],
      usefulData: [],
      assignVisible: false,
      list: null,
      listLoading: true,
      checkList: [],
      deleteLoading: false,
      isShowColumnFormatter: isShowColumnFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      total: null,
      selectArrayId: [],
      disabled: true,
      workTypeInsertDto: {
        workName: undefined
      },
      createLoading: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    addWorkerType () {
      let self = this
      self.dialogStatus = 'create'
      self.assignVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    goDefault () {
      this.$confirm('确定保存默认工种吗？', '提示', {})
        .then(() => {
          let arrObj = Object.assign({currentCheckedIds: this.checkedType}, {departmentId: this.$store.getters.departmentId})
          httpPost(defaultGo, arrObj)
            .then((res) => {
              this.$message({
                type: 'success',
                message: res.message,
                duration: 4 * 1000
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    handleUpdate (row) {
      this.workTypeInsertDto = Object.assign({}, row)
      this.assignVisible = true
      this.dialogStatus = 'update'
      // this.$nextTick(() => {
      //   this.$refs.dataform.clearValidate()
      // })
    },
    updateData () {
      let workerType = Object.assign(this.workTypeInsertDto, {departmentId: this.$store.getters.departmentId})
      httpPost(adaptWorker, workerType)
        .then((res) => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
          this.assignVisible = false
        }).catch(() => {})
    },
    addFinshed () {
      this.createLoading = true
      this.workTypeInsertDto = Object.assign(this.workTypeInsertDto, {departmentId: this.$store.getters.departmentId})
      httpPost(addWorker, this.workTypeInsertDto)
        .then((res) => {
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
          this.assignVisible = false
          setTimeout(() => { this.createLoading = false }, 300)
        }).catch((err) => {
          this.createLoading = false
          console.log(err)
        })
    },
    fetchData () {
      httpGet(typeManage + '/' + this.$store.getters.departmentId).then(res => {
        console.log(res)
        if (res.data.ids === null) { this.checkedType = [] } else { this.checkedType = res.data.ids }
        if (res.data.defaultWorkTypeInfoDtos === null) { this.usefulData = [] } else { this.usefulData = res.data.defaultWorkTypeInfoDtos }
        if (res.data.workTypeInfoDtos === null) {
          this.total = 0
          this.tableData = []
        } else {
          this.tableData = res.data.workTypeInfoDtos
          this.total = this.tableData.length
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 下一页
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    // 搜索
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 重置workTypeInsertDto表单
    resetForm () {
      this.workTypeInsertDto = {
        id: undefined,
        workName: undefined
      }
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(delWorkType + '/' + this.selectArrayId[0] + '/' + this.$store.getters.departmentId).then(res => {
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
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
      })
      if (this.selectArrayId.length === 1) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>
