<template>
  <div class="app-container">
     <div class="table-main">
        <el-tag type="warning" style="margin-bottom: 10px">注意：仅支持2019-06以后的相机(暂只支持cyhts_20190624100037版本),导入图片成功后,可以在用户管理看到该数据并进入审核或下发流程,用于快速下发100人及以上的场景(自动调节)</el-tag>
        <!-- 操作 -->
        <div class="filter-container">
          <el-input clearable style="width: 150px;" v-model="listQuery.dutyCompanyName"  class="filter-item" placeholder="分类"></el-input>
          <el-input clearable style="width: 150px;" v-model="listQuery.userName"  class="filter-item" placeholder="姓名"></el-input>
          <el-button class="filter-item" type="primary"  @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary"  @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
          <el-button class="filter-item" type="danger"  v-has="['删除']"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
          <el-button class="filter-item" type="primary"  v-has="['文件模板']" :loading = "exportLoading" @click="handleExport" icon="el-icon-tickets">文件模板</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导入文件']"  @click = "handleImport" icon="el-icon-upload2">导入文件</el-button>
          <el-button class="filter-item" type="primary"  v-has="['导入图片']"  @click = "handlePicImport" icon="el-icon-picture-outline">导入图片</el-button>
          <el-button class="filter-item" type="primary"    @click = "exportUnqualifiedList" icon="el-icon-document-copy">导出不合格清单</el-button>
          <span style="color: red;font-size: 14px;">提示：请先导入文件，再导入图片</span>
        </div>
        <el-table stripe style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])"></el-table-column>
          <el-table-column label="分类" align="center" prop="dutyCompanyName"></el-table-column>
          <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
          <el-table-column label="编号" align="center" prop="num"></el-table-column>
          <el-table-column label="照片名称" align="center" prop="photoName"></el-table-column>
          <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
          <!-- 新增 2020年5月16日19:13:42 -->
          <el-table-column label="年级" align="center" prop="floorNum"></el-table-column>
          <el-table-column label="班级" align="center" prop="roomNum"></el-table-column>
          <el-table-column label="手机号" align="center" prop="phone"></el-table-column>
          <!-- 新增 2020年5月16日19:13:42 end-->
          <el-table-column label="备注信息" align="center" prop="remark"></el-table-column>
          <el-table-column fixed="right" label="操作" v-if="isShowColumnFormatter(['编辑', '通道权限'])" align="center" class-name="small-padding fixed-width" width="200">
            <template slot-scope="scope">
              <el-button type="primary" v-has="['编辑']" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
              <el-button type="primary" v-has="['修改图片']" @click="handlePic(scope.row)" size="mini">添加图片</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible" width="40%">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
            <el-form-item label="分类" prop="dutyCompanyName">
              <el-input v-model="form.dutyCompanyName" clearable placeholder="请输入分类"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="userName">
              <el-input v-model="form.userName" clearable placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="照片名称" prop="photoName">
              <el-input v-model="form.photoName" clearable placeholder="请输入照片名称"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading = "updateLoading"  type="primary" @click="updateData">修改</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入文件" :visible.sync="dialogImportVisible" width="30%">
          <el-form>
            <el-form-item required >
              <upload-file ref="upload" :name="'file'" @hideUploadVisible = "hideUploadVisible" :fileData = "upload" :action="action" :accept="accept"></upload-file>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogImportVisible = false">取消</el-button>
            <el-button type="primary" @click="importData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入图片" :visible.sync="dialogImportImgVisible" width="30%" autoCompete = "on" label-position="right" label-width="100px">
          <el-form>
            <el-form-item label="图片路径" required>
              <el-input v-model="path" clearable placeholder="请输入图片路径"></el-input>
              <span style="color: red;font-size: 14px;">提示：路径为照片名称中除去姓名的部分</span>
            </el-form-item>
            <el-form-item label="图片">
              <el-upload
                ref="uploadImg"
                :action="testAIUserImportPhoto"
                multiple
                :on-exceed = "checkLimit"
                accept = '.jpg'
                :limit="100"
                :auto-upload="false"
                :http-request="uploadFile">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传100张jpg图片，且每张不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogImportImgVisible = false">取消</el-button>
            <el-button type="primary" :loading = "uploadImgLoading" @click="importImgData">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="导入图片" :visible.sync="ImportImgVisible" width="30%">
          <!-- 可以封装一下 -->
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <!-- {{updateAIUserImportPhoto}} -->
          <el-upload
          ref="uploadPhoto"
          class="avatar-uploader"
          :action="updateAIUserImportPhoto"
          :headers="headers"
          :data="imgData"
          :limit="1"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error ="uploadError"
          :before-upload="beforeAvatarUpload">
          <i  v-if="imageUrl === ''" style="border: 1px solid #8c939d; border-radius: 5px;" class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ImportImg">确定</el-button>
          </div>
        </el-dialog>
      </div>
  </div>
</template>
<script>
import { isShowColumnFormatter } from '@/utils/formatter.js'
import {
  getAIUserImport,
  exportAIUserImport,
  deleteAIUserImport,
  updateAIUserImportPhoto,
  updateAIUserImport,
  AIUserImport,
  AIUserImportPhoto,
  ApiExportUnqualifiedList
} from '@/api/url'
import { httpGet, httpDelete, httpPut, httpPost, httpExport } from '@/utils/restful'
import UploadFile from '@/components/UploadFile'
import ImageCompressor from 'image-compressor.js'
import { getToken } from '@/utils/cookie.js'
export default {
  components: {
    UploadFile
  },
  data () {
    return {
      accept: '.xls,.xlsx',
      action: AIUserImport,
      upload: {
        departmentId: this.$store.getters.departmentId
      },
      path: '',
      updateAIUserImportPhoto: updateAIUserImportPhoto,
      testAIUserImportPhoto: '',
      list: null,
      listLoading: true,
      deleteLoading: false,
      updateLoading: false,
      exportLoading: false,
      uploadImgLoading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        dutyCompanyName: undefined,
        userName: undefined
      },
      tableData: [],
      isShowColumnFormatter: isShowColumnFormatter,
      dialogFormVisible: false,
      dialogImportVisible: false,
      dialogImportImgVisible: false,
      ImportImgVisible: false,
      total: null,
      selectArrayId: [],
      disabled: true,
      form: {
        id: undefined,
        dutyCompanyName: undefined,
        userName: undefined,
        photoName: undefined
      },
      formRules: {
        dutyCompanyName: [
          {required: true, trigger: 'blur', message: '请输入分类'}
        ],
        userName: [
          {required: true, trigger: 'blur', message: '请输入名称'}
        ],
        photoName: [
          {required: true, trigger: 'blur', message: '请输入照片名称'}
        ]
      },
      imgData: {
        id: undefined
      },
      imageUrl: '',
      numberList: [],
      jsonData: [
        {
          title: '分类',
          key: 'dutyCompanyName',
          type: 'text'
        },
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '编号',
          key: 'num',
          type: 'text'
        },
        {
          title: '照片名称',
          key: 'photoName',
          type: 'text'
        },
        {
          title: '韦根卡号',
          key: 'wiegandCard',
          type: 'text'
        },
        {
          title: '年级',
          key: 'floorNum',
          type: 'text'
        },
        {
          title: '班级',
          key: 'roomNum',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'remark',
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
  mounted () {
    this.fetchData()
  },
  computed: {
    headers () {
      return {
        'AdminToken': getToken(),
        'departmentId': this.$store.getters.departmentId
      }
    }
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIUserImport, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
          // console.log('获取数据：', this.tableData)
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
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        dutyCompanyName: undefined,
        userName: undefined,
        photoName: undefined
      }
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 修改
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(updateAIUserImport, updateFormData).then(res => {
            this.updateLoading = false
            this.fetchData()
            this.dialogFormVisible = false
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteAIUserImport, {ids: this.selectArrayId}).then(res => {
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
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    // 导入
    handleImport () {
      this.dialogImportVisible = true
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
    },
    // 导出不合格清单表
    exportUnqualifiedList () {
      this.$confirm('是否导出不合格清单表...', '提示', {})
        .then(() => {
          let departmentId = this.$store.getters.departmentId
          httpExport(ApiExportUnqualifiedList + departmentId).then(res => {
            // console.log('导出不合格清单表...', res)
            this.listLoading = false
          }).catch(() => {
            // console.log('导出失败: ')
            this.listLoading = false
          })
        }).catch(() => {
          this.listLoading = false
        })
    },
    importData () {
      this.upload = Object.assign(this.upload, {departmentId: this.$store.getters.departmentId})
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.submit()
      })
    },
    // 隐藏文件上传框
    hideUploadVisible (res) {
      this.dialogImportVisible = false
      this.handleRefresh()
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        name: undefined,
        plate: undefined,
        isSync: undefined,
        localId: undefined
      }
      this.fetchData()
    },
    // 上传多图片
    // 检查数量超出文件限制
    checkLimit (files, fileList) {
      this.$message.warning(`图片不能超过100个`)
    },
    handlePicImport () {
      this.$confirm('当前Excal文件是否上传成功？', '提示', {})
        .then(() => {
          this.dialogImportImgVisible = true
          this.$nextTick(() => {
            this.$refs.uploadImg.clearFiles()
          })
        }).catch(() => {})
    },
    uploadFile (file) {
      this.formDate.append('files', file.file)
    },
    importImgData () {
      this.uploadImgLoading = true
      this.formDate = new FormData()
      this.$refs.uploadImg.submit()
      this.formDate.append('departmentId', this.$store.getters.departmentId)
      this.formDate.append('path', this.path)

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'AdminToken': getToken(),
          'departmentId': this.$store.getters.departmentId
        }
      }
      httpPost(AIUserImportPhoto, this.formDate, config).then(res => {
        this.uploadImgLoading = false
        this.dialogImportImgVisible = false
        this.handleRefresh()
      }).catch(() => {
        this.uploadImgLoading = false
        this.dialogImportImgVisible = false
        this.handleRefresh()
      })
    },
    // 上传单张图片
    handlePic (row) {
      this.imgData.id = row.id
      this.imageUrl = ''
      this.ImportImgVisible = true
    },
    uploadError () {
      this.$message.error('上传失败！')
    },
    handleAvatarSuccess (res, file) {
      if (res.code === 1) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.$message.success('图片校验成功')
        this.$nextTick(() => {
          this.$refs.uploadPhoto.clearFiles()
          this.handleRefresh()
        })
      } else {
        this.$refs.uploadPhoto.clearFiles()
        this.$message.error('图片校验失败，请重新上传！')
      }
    },
    beforeAvatarUpload (file) {
      let self = this
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg'
      const isLt10M = file.size / 1024 / 1024 < 10 && file.size / 1024 / 1024 > 5
      const isLT20M = file.size / 1024 / 1024 > 5
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG 格式!')
      }
      if (isLT20M) this.$message.error('图片不能超过5M!')
      if (isLt10M) {
        // eslint-disable-next-line
        new ImageCompressor(file, {
          quality: 0.1,
          success (result) {
            const formData = new FormData()
            formData.append('file', result, result.name)
            httpPost(updateAIUserImportPhoto, formData).then(res => {
              self.imageUrl = URL.createObjectURL(file)
            }).catch(() => {})
          },
          error () {
            self.$message.success('图片压缩失败，请重新上传')
          }
        })
      } else {
        self.imageUrl = URL.createObjectURL(file)
      }
      return isJPG && !isLt10M && !isLT20M
    },
    ImportImg () {
      this.handleRefresh()
      this.ImportImgVisible = false
      this.$nextTick(() => {
        this.$refs.uploadPhoto.clearFiles()
      })
    },
    // 文件模板
    handleExport () {
      this.$confirm('是否确定下载模板', '提示', {})
        .then(res => {
          this.exportLoading = true
          httpExport(exportAIUserImport).then((res) => {
            this.exportLoading = false
          }).catch(() => {
            this.exportLoading = false
          })
        }).catch(() => {
          // this.exportLoading = true
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 18.75rem;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color:  #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  // height: 178px;
  display: block;
}
</style>
