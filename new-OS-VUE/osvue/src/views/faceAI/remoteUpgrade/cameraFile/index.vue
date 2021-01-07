<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="obtainCameraFile">获取相机文件</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDownLoad(scope.row)" size="mini">下载文件</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 获取相机文件 -->
      <el-dialog  title="获取相机文件" :visible.sync="dialogFileVisible" width="30%">
        <el-form :rules="fileRules" ref="fileData" :model="file" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item label="相机MAC" prop="tokenId">
            <el-select v-model = "file.tokenId" style="width:80%" @change="tokenSelect">
              <el-option v-for="item in localList" :key="item.id"  :value = "item.id" :label="item.localName">
                <span style="float: left">{{item.localName}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{item.mac}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="type !== 130 && type !== 132" label="文件路径" prop="storePath">
            <el-input v-model="file.storePath" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="file.fileName" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { timeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { checkAICamera, getAICameraFile, getAndroidAIFiles, getLinuxAIFiles, deleteAICameraFile, downAIFile } from '@/api/url'
import { httpGet, httpExport, httpDelete, httpPost } from '@/utils/restful'
export default {
  data () {
    return {
      list: null,
      listLoading: true,
      deleteLoading: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      timeFormatter: timeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      dialogFileVisible: false,
      localList: [],
      loading: false,
      file: {
        tokenId: undefined,
        storePath: undefined,
        fileName: undefined
      },
      fileRules: {
        tokenId: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        storePath: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        fileName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      type: undefined,
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  created () {
    this.getCameraList()
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    tokenSelect (value) {
      let obj = {}
      this.localList.forEach(item => {
        if (item.id === value) {
          obj = item
        }
      })
      this.type = obj.cameraType
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteAICameraFile, {ids: this.selectArrayId}).then(res => {
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
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        this.localList = res.data
      }).catch(() => {})
    },
    fetchData () {
      httpGet(getAICameraFile + this.$store.getters.departmentId, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
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
    // 重置相机文件
    resetFileForm () {
      this.file = {
        tokenId: undefined,
        storePath: undefined,
        fileName: undefined
      }
    },
    // 获取相机文件
    obtainCameraFile () {
      // this.resetFileForm()
      this.dialogFileVisible = true
      this.$nextTick(() => {
        this.$refs.fileData.resetFields()
      })
    },
    // 提交相机文件
    onSubmit () {
      this.$refs.fileData.validate((valid) => {
        if (valid) {
          this.loading = true
          this.file = Object.assign(this.file)
          let url
          if (this.type === 130 || this.type === 132) {
            url = getAndroidAIFiles
          } else {
            url = getLinuxAIFiles
          }
          httpPost(url, this.file).then((res) => {
            this.fetchData()
            this.dialogFileVisible = false
            setTimeout(() => { this.loading = false }, 300)
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
    },
    // -------------------下载相机文件-----------------\\
    handleDownLoad (row) {
      this.$confirm('是否下载相机文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpExport(downAIFile + row.id).then(() => {}).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
