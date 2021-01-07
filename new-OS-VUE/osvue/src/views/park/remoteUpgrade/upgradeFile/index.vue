<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['上传']" @click="handleUpload" icon="el-icon-upload2">上传文件</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading"  @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])"></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="版本号" align="center" prop="version"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{cameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="240" v-if="isShowColumnFormatter(['预约升级', '下载'])">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleUpgrade(scope.row)" size="mini" v-has="['预约升级']">升级相机</el-button>
            <el-button type="primary" @click="handleDownLoad(scope.row)" size="mini" v-has="['下载']">下载文件</el-button>
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
            <el-input v-model="upload.version" placeholder="请输入版本号" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="适配相机" >
           <el-select v-model="upload.cameraType" style="width:80%">
              <el-option v-for="item in cameraType"  :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件名称">
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :limit="1" :fileData="upload" :action="action" :accept="'*'"></upload-file>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="upload.remarks" placeholder="请输入版本号" style="width:80%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUploadVisible = false">取消</el-button>
          <el-button type="primary" @click="importData">保存</el-button>
        </div>
      </el-dialog>
      <!-- 升级相机 -->
      <el-dialog title="升级相机" :visible.sync="dialogFileVisible" width="35%">
        <el-form  ref="upgradeFile" :rules="upgradeFileFormRules"  :model="upgradeFileForm" autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="通道名称" prop="tokenIds">
            <el-select v-model="upgradeFileForm.tokenIds" multiple style="width:80%">
              <el-option v-for="item in cameraFileList"  :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级命令" prop="order">
            <el-input v-model="upgradeFileForm.order" placeholder="请输入升级命令" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="存放路径" prop="storePath">
            <el-input v-model="upgradeFileForm.storePath" placeholder="请输入存放路径" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="升级时间" prop="storePath" >
            <el-date-picker
              style="width:80%"
              v-model="upgradeFileForm.taskAt"
              type="datetime"
              :clearable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogFileVisible = false">取消</el-button>
            <el-button type="primary" :loading="upgradeFileLoading" @click="saveUpgradeFile">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { udpFormatter, timeFormatter, cameraTypeFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { cameraType } from '@/utils/selectAble.js'
import { getCamera, getUpGradeFile, CameraFile, uploadUpGradeFile, upGradeFile } from '@/api/url'
import { httpGet, httpDelete, httpPost, httpExport } from '@/utils/restful'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      action: uploadUpGradeFile,
      list: null,
      listLoading: true,
      deleteLoading: false,
      dialogUploadVisible: false,
      upgradeFileLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      cameraType: cameraType,
      udpFormatter: udpFormatter,
      timeFormatter: timeFormatter,
      cameraTypeFormatter: cameraTypeFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      total: null,
      disabled: false,
      selectArrayId: [],
      upload: {
        version: '',
        cameraType: undefined,
        remarks: ''
      },
      dialogFileVisible: false,
      cameraFileList: [],
      upgradeFileForm: {
        cameraFileId: '',
        tokenIds: [],
        storePath: '',
        taskAt: new Date(),
        order: './install.sh'
      },
      upgradeFileFormRules: {
        tokenIds: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ],
        order: [
          {required: true, trigger: 'blur', message: '升级命令不可为空'}
        ],
        storePath: [
          {required: true, trigger: 'blur', message: '存放路径不可为空'}
        ],
        taskAt: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '版本号',
          key: 'version',
          type: 'text'
        },
        {
          title: '相机类型',
          key: 'cameraType',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remarks',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
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
        item.cameraType = this.cameraTypeFormatter(item.cameraType)
        item.createAt = this.timeFormatter(item.createAt)
        // item.taskAt = this.timeFormatter(item.taskAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取相机文件
    getCamera (row) {
      httpGet(getCamera + this.$store.getters.departmentId).then((res) => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂未绑定相机，请先绑定相机')
        } else {
          this.cameraFileList = res.data
          this.dialogFileVisible = true
          this.$nextTick(() => {
            this.$refs.upgradeFile.resetFields()
            if (row.cameraType === 129) this.upgradeFileForm.storePath = '/data_fs/cyexe'
            if (row.cameraType === 2 || row.cameraType === 3) this.upgradeFileForm.storePath = '/mnt/upgrade'
            if (row.cameraType === 1 || row.cameraType === 4) this.upgradeFileForm.storePath = '/home/admin'
          })
        }
      }).catch(() => {})
    },
    saveUpgradeFile () {
      this.$refs.upgradeFile.validate((valid) => {
        if (valid) {
          this.upgradeFileLoading = true
          httpPost(upGradeFile, this.upgradeFileForm).then(res => {
            this.dialogFileVisible = false
            setTimeout(() => { this.upgradeFileLoading = false }, 300)
            this.$message.success(res.message)
          }).catch(() => {
            this.upgradeFileLoading = false
          })
        }
      })
    },
    // 获取列表
    fetchData () {
      httpGet(getUpGradeFile, this.listQuery).then(res => {
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
    handleUpgrade (row) {
      this.$confirm('确定升级相机吗？升级可能会影响车场正常运行!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upgradeFileForm.cameraFileId = row.id
        this.getCamera(row)
      }).catch(() => {})
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
          httpDelete(CameraFile, {ids: this.selectArrayId}).then(res => {
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
        version: '',
        cameraType: undefined,
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
    },
    // -------------------下载相机文件-----------------\\
    handleDownLoad (row) {
      this.$confirm('是否下载相机升级文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpExport(CameraFile + '/' + row.id).then(() => {}).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
