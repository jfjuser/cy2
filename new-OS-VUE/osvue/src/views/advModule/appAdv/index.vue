<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleUpload" icon="el-icon-upload2">上传图片</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="120">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleImg(scope.row)" size="mini">获取图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="上传文件" :visible.sync="dialogUploadVisible" width="35%">
        <el-form  ref="uploadData" :model="upload" autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="图片">
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :limit="1" :fileData="upload" :action="action" :accept="'image/*'"></upload-file>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="importData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片" :visible.sync="dialogImgVisible" width="320">
        <img :src="imgUrl" alt="图片" style="width:300px">
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { timeFormatter } from '@/utils/formatter.js'
import { getAppImg, AppImg, uploadAppImg } from '@/api/url.js'
import { httpGet, httpDelete } from '@/utils/restful.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      action: uploadAppImg,
      list: null,
      listLoading: true,
      deleteLoading: false,
      dialogUploadVisible: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      tableData: [],
      timeFormatter: timeFormatter,
      total: null,
      disabled: false,
      selectArrayId: [],
      upload: {
        departmentId: this.$store.getters.departmentId
      },
      imgUrl: '',
      dialogImgVisible: false,
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '文件名称',
          key: 'fileName',
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
    this.fetchData()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(getAppImg, this.listQuery).then(res => {
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
    handleDelete () {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AppImg, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        })
    },
    // 上传文件
    handleUpload () {
      this.upload = {
        departmentId: this.$store.getters.departmentId
      }
      this.dialogUploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
    },
    // 保存文件
    importData () {
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.submit()
      })
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogUploadVisible = false
      this.fetchData()
    },
    handleImg (row) {
      httpGet(AppImg + '/' + row.id)
        .then(res => {
          if (res.data !== null) {
            this.imgUrl = res.data
            this.dialogImgVisible = true
          } else {
            this.$message.error('暂无图片')
          }
        }).catch(() => {})
    }
  }
}
</script>
