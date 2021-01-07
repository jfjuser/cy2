<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" @click="handleUpload" icon="el-icon-upload2">上传文件</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
        <el-table-column label="版本号" align="center" prop="version"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiAndroidCameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleDownLoad(scope.row)" size="mini">下载文件</el-button>
            <el-button type="primary" @click="handleUpgrade(scope.row)" size="mini">升级相机</el-button>
            <el-button type="primary" @click="handleHttpUpgrade(scope.row)" size="mini">HTTP升级</el-button>
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
              <el-option v-for="item in cameraAIType"  :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模式" prop="modes" v-show="upload.cameraType === 131">
            <el-radio v-model="upload.modes" label="1" border>tcp</el-radio>
            <el-radio v-model="upload.modes" label="2" border>http</el-radio>
          </el-form-item>
          <el-form-item label="对接" prop="outside" v-show="upload.cameraType === 131">
            <el-checkbox-group v-model="upload.outsides">
              <el-checkbox-button v-for="out in outsides" :label="out.id" :key="out.id">{{out.name}}</el-checkbox-button>
              <el-button style="margin-left: 1rem" type="primary" icon="el-icon-edit" circle @click="handleClickOutSideConfig"></el-button>
            </el-checkbox-group>
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
            <el-select v-model="upgradeFileForm.tokenIds" style="width:80%"  @change="focusTheOne">
               <!-- multiple -->
              <el-option v-for="item in cameraFileList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级命令" prop="order">
            <el-input v-model="upgradeFileForm.order" placeholder="请输入升级命令" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="存放路径" prop="storePath">
            <el-input v-model="upgradeFileForm.storePath" placeholder="请输入存放路径" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="升级时间" prop="taskAt" >
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
      <!-- 对接 -->
      <el-dialog title="对接设置" :visible.sync="dialogOutSideVisible" width="700px">
        <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="200" :data="outsides" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column label="别名(简称)" align="center" prop="name"></el-table-column>
          <el-table-column label="请求接口时秘钥" align="center" prop="key"></el-table-column>
          <el-table-column label="创建时间" align="center" prop="createAt">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createAt)}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作"  align="center" class-name="small-padding fixed-width" width="170">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleOutSideUpdate(scope.row)" size="mini">编辑</el-button>
              <el-button type="primary" @click="handleOutSideDelete(scope.row)" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleOutSideInsert()" type="primary">添加</el-button>
          <el-button @click="dialogOutSideVisible = false" type="success">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="textMap[dialogOutSideStatus]" :visible.sync="dialogOutSideFormVisible" width="500px">
        <el-form ref="outSideForm" :model="outSideForm" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="别名(简称)" prop="name">
            <el-input v-model="outSideForm.name" placeholder="请输入别名(简称)" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="请求接口时秘钥" prop="key">
            <el-input v-model="outSideForm.key" placeholder="请输入请求接口时秘钥" style="width:80%"></el-input>
          </el-form-item>
          <!-- 说明 -->
          <div style="color:red;font-size:14px;">
            <p style="text-indent: 54px">说明：用于外部公司对接升级相机接口, 如: 爱唐</p>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogOutSideFormVisible = false">取消</el-button>
          <el-button v-if="dialogOutSideStatus=='create'" type="primary" :loading="insertOutSideLoading" @click="createOutSideData">保存</el-button>
          <el-button v-else type="primary" :loading="updateOutSideLoading" @click="updateOutSideData">修改</el-button>
        </div>
      </el-dialog>
      <!-- http升级 -->
      <el-dialog title="升级相机" :visible.sync="dialogHttpVisible" width="35%">
        <el-form autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="通道名称">
            <el-select v-model="tokenIds" multiple style="width:80%">
              <el-option v-for="item in cameraFileList"  :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="升级时间">
            <el-date-picker
              style="width:80%"
              v-model="taskAt"
              type="datetime"
              :clearable="false"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogHttpVisible = false">取消</el-button>
            <el-button type="primary" :loading="upgradeHttpLoading" @click="saveHttpUpgradeFile">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { udpFormatter, timeFormatter, aiAndroidCameraTypeFormatter } from '@/utils/formatter.js'
import { cameraAIType } from '@/utils/selectAble.js'
import { checkAILinuxCamera, downAIFile, getAIFile, UpgradeAICamera, UpgradeAIHttpCamera, uploadAICameraFile, deleteAICameraFile, outSideType } from '@/api/url'
import { httpGet, httpPut, httpPost, httpDelete, httpExport } from '@/utils/restful'
import UploadFile from '@/components/UploadFile'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      action: uploadAICameraFile,
      list: null,
      listLoading: true,
      deleteLoading: false,
      upgradeHttpLoading: false,
      dialogUploadVisible: false,
      upgradeFileLoading: false,
      dialogHttpVisible: false,
      dialogOutSideVisible: false,
      insertOutSideLoading: false,
      updateOutSideLoading: false,
      deleteOutSideLoading: false,
      dialogOutSideFormVisible: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      dialogOutSideStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      tableData: [],
      outsides: [],
      cameraAIType: cameraAIType,
      udpFormatter: udpFormatter,
      timeFormatter: timeFormatter,
      aiAndroidCameraTypeFormatter: aiAndroidCameraTypeFormatter,
      total: null,
      disabled: false,
      selectArrayId: [],
      upload: {
        version: '',
        cameraType: undefined,
        remarks: '',
        modes: '1',
        outsides: []
      },
      dialogFileVisible: false,
      obj: {},
      cameraFileList: [],
      upgradeFileForm: {
        cameraFileId: '',
        tokenIds: [],
        storePath: '',
        taskAt: new Date(),
        order: './ht_install.sh &'
      },
      outSideForm: {
        id: undefined,
        name: '',
        key: ''
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
          {required: true, trigger: 'change', message: '存放路径不可为空'}
        ]
      },
      tokenIds: [],
      rowId: undefined,
      taskAt: new Date(),
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
        item.cameraType = this.aiAndroidCameraTypeFormatter(item.cameraType)
        item.createAt = this.timeFormatter(item.createAt)
        // item.userNum = item.userNum + '人'
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取相机文件
    getCamera (row) {
      httpGet(checkAILinuxCamera + this.$store.getters.departmentId).then((res) => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂未绑定相机，请先绑定相机')
        } else {
          this.cameraFileList = res.data
          this.dialogFileVisible = true
          this.$nextTick(() => {
            console.log(row)
            this.$refs.upgradeFile.resetFields()
            this.obj = {}
            for (let i = 0; i < this.cameraFileList.length; i++) {
              this.obj[this.cameraFileList[i].id] = this.cameraFileList[i].cameraType
            }
            // if (row.cameraType === 129) this.upgradeFileForm.storePath = '/data_fs/cyexe'
            // if (row.cameraType === 131) this.upgradeFileForm.storePath = '/mnt/mtd/nsd/program/lib/'
            // if (row.cameraType === 133) this.upgradeFileForm.storePath = '/mnt/mtd/nsd/ai/'
          })
        }
      }).catch(() => {})
    },
    getOutSides () {
      httpGet(outSideType).then((res) => {
        this.outsides = res.data.rows
      }).catch(() => {})
    },
    handleClickOutSideConfig () {
      this.dialogOutSideVisible = true
    },
    handleOutSideInsert () {
      let self = this
      self.dialogOutSideStatus = 'create'
      self.dialogOutSideFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['outSideForm'].resetFields()
        // self.resetForm()
      })
    },
    handleOutSideUpdate (row) {
      this.outSideForm = Object.assign({}, row)
      this.dialogOutSideStatus = 'update'
      this.dialogOutSideFormVisible = true
      this.$nextTick(() => {
        this.$refs.outSideForm.clearValidate()
      })
    },
    createOutSideData () {
      httpPost(outSideType, this.outSideForm).then(() => {
        this.getOutSides()
        this.dialogOutSideFormVisible = false
      }).catch(() => {})
    },
    updateOutSideData () {
      httpPut(outSideType, this.outSideForm).then(() => {
        this.getOutSides()
        this.dialogOutSideFormVisible = false
      }).catch(() => {})
    },
    handleOutSideDelete (row) {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        this.deleteOutSideLoading = true
        httpDelete(outSideType + '/' + row.id).then(res => {
          this.deleteOutSideLoading = false
          this.getOutSides()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.deleteOutSideLoading = false
        })
      }).catch(() => {})
    },
    focusTheOne (value) {
      this.$nextTick(() => {
        if (this.obj[value] === 129) this.upgradeFileForm.storePath = '/data_fs/cyexe'
        if (this.obj[value] === 131) this.upgradeFileForm.storePath = '/mnt/mtd/nsd/program/lib/'
        if (this.obj[value] === 133) this.upgradeFileForm.storePath = '/mnt/mtd/nsd/ai/'
        console.log(this.upgradeFileForm.storePath)
      })
    },
    saveUpgradeFile () {
      this.$refs.upgradeFile.validate((valid) => {
        if (valid) {
          this.upgradeFileLoading = true
          httpPost(UpgradeAICamera, this.upgradeFileForm).then(res => {
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
      httpGet(getAIFile, this.listQuery).then(res => {
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
      this.$confirm('确定升级相机吗？升级可能会影响相机正常运行!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upgradeFileForm.cameraFileId = row.id
        this.getCamera(row)
      }).catch(() => {})
    },
    handleHttpUpgrade (row) {
      this.rowId = row.id
      httpGet(checkAILinuxCamera + this.$store.getters.departmentId).then((res) => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂未绑定相机，请先绑定相机')
        } else {
          this.cameraFileList = res.data
          this.dialogHttpVisible = true
          this.tokenIds = []
          this.taskAt = new Date()
        }
      }).catch(() => {})
    },
    saveHttpUpgradeFile () {
      if (this.tokenIds.length < 1) {
        this.$message.error('请先选择相机通道在升级')
      } else {
        this.upgradeHttpLoading = true
        httpPost(UpgradeAIHttpCamera, {
          tokenIds: this.tokenIds,
          cameraFileId: this.rowId,
          taskAt: this.taskAt
        }).then(res => {
          this.dialogHttpVisible = false
          setTimeout(() => { this.upgradeHttpLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => {
          this.upgradeHttpLoading = false
        })
      }
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
          httpDelete(deleteAICameraFile, {ids: this.selectArrayId}).then(res => {
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
        remarks: '',
        modes: '1',
        outsides: []
      }
      this.getOutSides()
      this.dialogUploadVisible = true
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
    },
    // 保存文件
    importData () {
      if (this.upload.cameraType === undefined || this.upload.version === '') {
        this.$message.error('请先填写参数')
      } else {
        this.$nextTick(() => {
          this.$refs.upload.$refs.UPLOAD.submit()
        })
      }
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogUploadVisible = false
      this.fetchData()
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
