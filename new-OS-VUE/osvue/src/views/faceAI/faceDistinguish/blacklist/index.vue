<template>
  <div class="app-container">
    <div class="table-main" style="margin-top: 20px;">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.userName" clearable placeholder="请输入姓名"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary"  @click="addUser"  icon="el-icon-add">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary"  @click="dialogImportImgVisible = true" icon="el-icon-upload">批量添加</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
      </div>
       <el-dialog title="导入图片" :visible.sync="dialogImportImgVisible" width="45%" autoCompete = "on" label-position="right" label-width="100px">
          <el-form>
            <el-form-item label="姓名">
              <span style="color: red;font-size: 14px;">提示：照片名称为黑名单用户姓名</span>
            </el-form-item>
            <el-form-item label="图片" required>
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
            <div style="position:absolute;top:23vh;left:27vw">
              <el-button @click="dialogImportImgVisible = false">取消</el-button>
              <el-button type="primary" :loading = "uploadImgLoading" @click="importImgData">保存</el-button>
            </div>
          </el-form>
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="dialogImportImgVisible = false">取消</el-button>
            <el-button type="primary" :loading = "uploadImgLoading">保存</el-button>
          </div> -->
        </el-dialog>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
        <el-table-column label="原因" align="center" prop="remark"></el-table-column>
        <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <!-- <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button> -->
            <el-button type="primary" @click.native.prevent="handleSeePhoto(scope.row)" size="mini">查看图片</el-button>
            <el-button type="primary" @click.native.prevent="toBeWhite(scope.row)" size="mini">转为白名单</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 转为白名单 -->
      <el-dialog title="白名单" width="40%" :visible.sync = "dialogWhiteVisible">
        <el-form>
          <el-form-item label="账户" required>
            <el-select clearable  style="width:150px;" v-model="lists.dutyCompanyId"  class="filter-item" placeholder="请选择">
              <el-option v-for="(item, index) in userArr" :key=index :label=item.leader :value=item.id></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" required>
            <el-select clearable  style="width:150px;" v-model="lists.type"  class="filter-item" placeholder="请选择">
              <el-option label="非访客" :value="0"></el-option>
              <el-option label="访客" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="lists.type === 1">
            <el-form-item label="开始日期" required>
              <el-date-picker type="datetime"  v-model="lists.beginTime"  placeholder="开始日期不可为空">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期" required>
              <el-date-picker type="datetime"  v-model="lists.endTime"  placeholder="结束日期不可为空">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWhiteVisible = false">取消</el-button>
          <el-button type="primary" @click="blackToWhite">保存</el-button>
        </div>
      </el-dialog>
    <el-dialog title="添加" :visible.sync = "dialogFormVisible" width="600px">
      <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
        <el-form-item label="姓名" prop="userName">
          <el-input class="input-width" v-model="form.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="图片" prop="photo">
            <upload-photo :foo.sync="photoType" ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </div>
        <el-form-item label="原因" prop="remark">
          <el-input class="input-width" v-model="form.remark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" placeholder="请输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="createLoading" type="primary" @click="createData">保存</el-button>
      </div>
    </el-dialog>
     <el-dialog title="图片" width="40%" :visible.sync = "dialogPhotoVisible">
       <div style="text-align:center">
         <img :src=imgUrl style="max-width:38vw;max-height:450px"/>
       </div>
     </el-dialog>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'
import { usersAIManage, whiteBlackList, getAiDuyCompany, seeAIMemberPhoto, addBatchBlackUser, AIMember, deleteAIMembers, addBlackUser, uploadAImMember } from '@/api/url'
import UploadPhoto from './components/UploadPhoto/index.vue'
import UploadFile from '@/components/UploadFile'
import { getToken } from '@/utils/cookie.js'
export default {
  components: {
    UploadPhoto,
    UploadFile
  },
  data () {
    return {
      photoType: undefined,
      action: uploadAImMember,
      testAIUserImportPhoto: '',
      userArr: [],
      dialogWhiteVisible: false,
      lists: {
        type: 0,
        mac: undefined,
        id: undefined,
        dutyCompanyId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      fileData: {
        photo: ''
      },
      imgUrl: '',
      dialogImportImgVisible: false,
      form: {
        departmentId: this.$store.getters.departmentId,
        userName: '',
        photo: '',
        remark: ''
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        photo: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        remark: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      createLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      dialogPhotoVisible: false,
      total: undefined,
      disabled: true,
      dialogFormVisible: false,
      uploadImgLoading: false,
      listLoading: true,
      tableData: [],
      listQuery: {
        username: undefined,
        type: 2,
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10
      },
      jsonData: [
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '原因',
          key: 'remark',
          type: 'text'
        },
        {
          title: '同步信息',
          key: 'aiPower',
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
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    // 获取成员数据
    fetchData () {
      httpGet(usersAIManage, this.listQuery)
        .then(res => {
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
    // 转为白名单之前获取账户列表
    toBeWhite (row) {
      this.lists.id = row.id
      this.dialogWhiteVisible = true
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        console.log(res)
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
          this.$message({
            type: 'danger',
            duration: 3000,
            message: '获取不到可转入白名单的账户'
          })
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 黑转白
    blackToWhite () {
      httpPut(whiteBlackList, this.lists).then((res) => {
        this.$message({
          type: 'success',
          duration: 3000,
          message: res.message
        })
        this.dialogWhiteVisible = false
        this.resetListQuery()
      }).catch(() => {
        this.dialogWhiteVisible = false
      })
    },
    importImgData () {
      this.uploadImgLoading = true
      this.formDate = new FormData()
      this.$refs.uploadImg.submit()
      this.formDate.append('departmentId', this.$store.getters.departmentId)
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'AdminToken': getToken(),
          'departmentId': this.$store.getters.departmentId
        }
      }
      console.log(this.formDate)
      httpPost(addBatchBlackUser, this.formDate, config).then(res => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
        this.dialogImportImgVisible = false
        setTimeout(() => { this.uploadImgLoading = false }, 300)
        this.resetListQuery()
      }).catch(() => {
        this.uploadImgLoading = false
        this.dialogImportImgVisible = false
        this.resetListQuery()
      })
    },
    // 检查数量超出文件限制
    checkLimit (files, fileList) {
      this.$message.warning(`图片不能超过100个`)
    },
    uploadFile (file) {
      this.formDate.append('file', file.file)
    },
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          let aiUserInsertBlacklistDto = this.form
          httpPost(addBlackUser, {...aiUserInsertBlacklistDto, photoType: this.photoType})
            .then((res) => {
              this.fetchData()
              this.$message({
                message: res.message,
                type: 'success',
                duration: 3000
              })
              console.log(res)
              this.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
            }).catch(() => {
              this.createLoading = false
            })
        }
      })
    },
    addUser () {
      this.dialogFormVisible = true
    },
    photoNumber (value) {
      this.form.photo = value
      this.form = Object.assign(this.form, value)
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
    // 刷新
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId,
        userName: undefined,
        type: 2
      }
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除所选中的记录吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
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
    // 删除所有
    handleAllDelete () {
      this.$confirm('确认删除所有的记录吗？', '提示', {})
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(deleteAIMembers + '/' + this.$store.getters.departmentId).then(res => {
            this.deleteAllLoading = false
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteAllLoading = false
          })
        }).catch(() => {})
    },
    // 查看图片
    handleSeePhoto (row) {
      httpPost(seeAIMemberPhoto + row.id)
        .then(res => {
          if (res.data !== null) {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = res.data.file
              // 修改base64
            })
          } else {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.fileData.photo = ''
            this.$message.error('图片获取失败')
          }
        }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.input-width {
  width: 18.75rem;
}
</style>
