<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" v-has="['上传']" @click="uploadData" icon="el-icon-upload2">文件上传</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange"   element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['下载']" @click.native.prevent="handleDown(scope.row)" size="mini">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="文档上传" :visible.sync="dialogUploadVisible">
        <el-upload
          ref="upload"
          :action = "uploadUrl"
          :headers = "headers"
          :data="upData"
          :limit="1"
          :on-remove = "handleRemove"
          :on-success = "uploadSuccss"
          :on-error = "uploadError"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAllDocuments, exportDescriptions, deleteDocuments, uploadDoc } from '@/api/url'
import { httpGet, httpExport, httpDelete } from '@/utils/restful'
import { getToken } from '@/utils/cookie.js'
import { isShowColumnFormatter } from '@/utils/formatter'
export default {
  computed: {
    headers () {
      return {
        'AdminToken': getToken(),
        'departmentId': this.$store.getters.departmentId
      }
    }
  },
  data () {
    return {
      uploadUrl: uploadDoc,
      upData: {
        type: this.$store.getters.type
      },
      list: null,
      listLoading: true,
      deleteLoading: false,
      dialogUploadVisible: false,
      selectArrayId: [],
      disabled: true,
      isShowColumnFormatter: isShowColumnFormatter,
      listQuery: {
        offset: 1,
        limit: 10,
        type: this.$store.getters.type
      },
      tableData: [],
      total: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // -------------- 文件上传 -------------\\
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleRemove (file, fileList) {
      this.$message.success(`删除${file.name}成功`)
    },
    uploadSuccss () {
      this.fetchData()
      this.dialogUploadVisible = false
      this.$message.success('上传成功')
    },
    uploadError (err) {
      this.$message.error(JSON.parse(err.message))
    },
    // 获取文件
    fetchData () {
      httpGet(getAllDocuments, this.listQuery).then(res => {
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
    // 下载
    handleDown (row) {
      httpExport(exportDescriptions + '/' + row.id)
        .then(() => {})
        .catch(() => {})
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
      this.$confirm('确认删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteDocuments, {ids: this.selectArrayId})
            .then(res => {
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
    // 上传文件
    uploadData () {
      this.dialogUploadVisible = true
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    }
  }
}
</script>
