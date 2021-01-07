<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-select clearable v-model="listQuery.type"  class="filter-item" placeholder="类型">
          <el-option v-for="item in appType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item uploads" type="primary" @click="handleUpload" icon="el-icon-upload2">上传文件</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="版本号" align="center" prop="versionCode"></el-table-column>
        <el-table-column label="版本名" align="center" prop="version"></el-table-column>
        <el-table-column label="类型" align="center" prop="type">
          <template slot-scope="scope">
            {{appTypeFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="模式" align="center" prop="isPatch">
          <template slot-scope="scope">
            {{appModeFormatter(scope.row.isPatch)}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleLook(scope.row)" size="mini">查看备注</el-button>
            <el-button type="primary" @click="handleDownLoad(scope.row)" class="dpwnload" size="mini">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="上传文件" :visible.sync="dialogUploadVisible" width="35%">
        <el-form  ref="uploadData" :model="upload" autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="版本号">
            <el-input v-model="upload.versionCode" placeholder="请输入版本号" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="版本名">
            <el-input v-model="upload.version" placeholder="请输入版本名" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-select class="filter-item" v-model="upload.type" style="width:80%">
              <el-option v-for="item in appType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模式">
            <el-radio v-model="upload.isPatch" label="0" border>增量包</el-radio>
            <el-radio v-model="upload.isPatch" label="1" border>全量包</el-radio>
          </el-form-item>
          <el-form-item label="文件名称">
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :limit="1" :fileData="upload" :action="action" :accept="'*'"></upload-file>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="upload.remarks" :rows="5" placeholder="请输入备注信息" style="width:80%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="importData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="查看" :visible.sync="dialogLookVisible">
        {{text}}
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { appType } from '@/utils/selectAble.js'
import { timeFormatter, appTypeFormatter, appModeFormatter } from '@/utils/formatter.js'
import { getAppUpgrade, uploadAppFile, deleteAppFile, exportAppFile } from '@/api/url.js'
import { httpGet, httpDelete, httpExport } from '@/utils/restful.js'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      action: uploadAppFile,
      list: null,
      listLoading: true,
      deleteLoading: false,
      dialogUploadVisible: false,
      listQuery: {
        offset: 1,
        limit: 10,
        type: undefined
      },
      tableData: [],
      timeFormatter: timeFormatter,
      appTypeFormatter: appTypeFormatter,
      appModeFormatter: appModeFormatter,
      total: null,
      disabled: true,
      dialogLookVisible: false,
      selectArrayId: [],
      upload: {
        versionCode: '',
        version: '',
        type: undefined,
        isPatch: '1',
        remarks: ''
      },
      appType: appType,
      text: '',
      jsonData: [
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '版本号',
          key: 'versionCode',
          type: 'text'
        },
        {
          title: '版本名',
          key: 'version',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '模式',
          key: 'isPatch',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createTime',
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
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.type = this.appTypeFormatter(item.type)
        item.isPatch = this.appModeFormatter(item.isPatch)
        item.createTime = this.timeFormatter(item.createTime)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取列表
    fetchData () {
      this.listLoading = true
      httpGet(getAppUpgrade, this.listQuery).then(res => {
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
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        type: undefined
      }
      this.fetchData()
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    handleDownLoad (row) {
      this.$confirm('是否下载App文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpExport(exportAppFile + row.id).then(() => {}).catch(() => {})
      }).catch(() => {})
    },
    handleLook (row) {
      this.text = row.remarks
      this.dialogLookVisible = true
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
          httpDelete(deleteAppFile, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
          }).catch(() => {
            this.deleteLoading = false
          })
        }).catch(() => {})
    },
    // 上传文件
    handleUpload () {
      this.upload = {
        versionCode: '',
        version: '',
        type: undefined,
        isPatch: '1',
        remarks: ''
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
    }
  }
}
</script>
