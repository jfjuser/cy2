<template>
  <div class="app-container">
    <div class="table-main" style="margin-top: 20px;">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.name" clearable placeholder="请输入姓名"></el-input>
        <!-- <el-select clearable  style="width:150px;" v-model="listQuery.sex"  class="filter-item" placeholder="性别">
          <el-option label="男" :value="1"></el-option>
          <el-option label="女" :value="2"></el-option>
        </el-select> -->
        <el-button class="filter-item search" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="addUser" v-has="['新增']" icon="el-icon-add">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :loading = "deleteLoading" v-has="['删除所选']" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有']" :loading = "deleteAllLoading" @dblclick.native="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
      </div>
      <el-tag style="margin-bottom: 1rem" type="success" v-has="['删除所有']">删除所有功能按键需双击才可调用</el-tag><br>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="姓名" align="center" prop="name"></el-table-column>
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            {{sexFormatter(scope.row.sex)}}
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center" prop="age"></el-table-column>
        <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <!-- <el-button type="primary" @click.native.prevent="handleSeePhoto(scope.row)" style="margin-bottom:0.5rem" size="mini">查看图片</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
        <!-- 新增或者修改 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" width="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select clearable  style="width:150px;" v-model="form.sex"  class="filter-item" placeholder="请选择">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道" v-if="dialogStatus === 'create'" prop="aiTokenIds">
           <el-select v-model="form.aiTokenIds" multiple >
              <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道" v-if="dialogStatus === 'update'" prop="aiTokenIds">
            <el-checkbox-group v-model="checked" >
              <el-checkbox v-for="item in localList"  :label="item.localId" :key="item.localId">{{item.localName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" type="number" placeholder="请输入用户年龄"></el-input>
          </el-form-item>
          <div>
            <!-- v-if="dialogStatus === 'create'" -->
            <el-form-item label="图片" required>
              <upload-photo :foo.sync="photoType" ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
            </el-form-item>
          </div>
          <!-- <el-form-item label="类型" required>
            <el-radio-group v-model="form.type" @change="radioChange">
              <el-radio :label= 0 >非访客</el-radio>
              <el-radio :label= 1 >访客</el-radio>
            </el-radio-group>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading="addLoading" type="primary" v-if="dialogStatus === 'create'" @click="queAddUser">保存</el-button>
          <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="图片" width="30%" :visible.sync = "dialogPhotoVisible">
        <el-form>
          <el-form-item>
            <upload-photo :foo.sync="photoType" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPhotoVisible = false">取消</el-button>
          <el-button type="primary" @click="photoData">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { sexFormatter, isShowColumnFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { seekAllUser, seekBackShow, seekAllCamera, doFaceUser, uploadAImMember, seeAIMemberPhoto, updateMemberPhoto } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import UploadPhoto from './components/UploadPhoto/index.vue'
export default {
  components: {
    UploadPhoto
  },
  mounted () {
    this.fetchData()
  },
  data () {
    return {
      photoType: undefined,
      action: uploadAImMember,
      sexFormatter: sexFormatter,
      addLoading: false,
      channelArr: [],
      // imgUrls: '',
      fileData: {
        photo: ''
      },
      imgUrl: '',
      isNotVisible: false,
      localList: [],
      lists: {
        type: 0,
        mac: undefined,
        id: undefined,
        dutyCompanyId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      isCheck: undefined,
      list: null,
      listLoading: true,
      isVisible: false,
      updateLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      idId: undefined,
      userArr: [],
      listQuery: {
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10,
        sex: undefined,
        name: undefined
      },
      tableData: [],
      total: null,
      isShowColumnFormatter: isShowColumnFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPhotoVisible: false,
      dialogWhiteVisible: false,
      disabled: true,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑成员',
        create: '添加成员'
      },
      form: {
        name: '',
        age: undefined,
        sex: undefined,
        image: '',
        photo: '',
        status: 0,
        aiTokenIds: []
      },
      formRules: {
        name: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        sex: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        age: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        aiTokenIds: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      isCatVisiable: false,
      oop: true,
      checked: [],
      rowId: undefined,
      channelId: undefined,
      timeLimit: undefined,
      customTime: undefined,
      showType: undefined,
      val: undefined,
      jsonData: [
        {
          title: '姓名',
          key: 'name',
          type: 'text'
        },
        {
          title: '性别',
          key: 'sex',
          type: 'text'
        },
        {
          title: '年龄',
          key: 'age',
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
  watch: {
    customTime (val) {
      if (val < 0) {
        this.customTime = 1
      }
    }
  },
  // created () {
  //   // 是否首页跳转
  //   let from = this.$route.query.from
  //   let listQuery = this.$route.query.listQuery
  //   if (from && from === 'home' && listQuery) {
  //     listQuery = JSON.parse(listQuery)
  //     this.listQuery.isCheck = listQuery.is_check
  //     this.listQuery.type = listQuery.type
  //   }
  // },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.sex = this.sexFormatter(item.sex)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    addUser () {
      this.resetForm()
      this.imgUrl = ''
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        httpGet(seekAllCamera + '/' + this.$store.getters.departmentId).then((res) => {
          this.localList = res.data
        }).catch(() => {})
      })
    },
    queAddUser () {
      this.addLoading = true
      this.form.image = this.form.photo.photo
      let obj = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
      httpPost(doFaceUser, obj).then((res) => {
        this.fetchData()
        this.dialogFormVisible = false
        setTimeout(() => { this.addLoading = false }, 300)
        this.$message.success(res.message)
      }).catch(() => {
        this.addLoading = false
      })
    },
    // 查看通道
    watchChannel () {
      httpGet(doFaceUser + '/' + this.$store.getter.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.channelArr = res.data
        }
      }).catch(() => {})
    },
    photoNumber (value) {
      this.form.photo = value
      if (this.dialogStatus === 'update') {
        this.form.status = 1
      } else {
        this.form.status = 0
      }
    },
    // 获取成员数据
    fetchData () {
      httpGet(seekAllUser, this.listQuery)
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
        name: undefined,
        sex: undefined
      }
      this.fetchData()
    },
    resetForm () {
      this.form = {
        name: '',
        age: undefined,
        sex: undefined,
        image: '',
        photo: '',
        aiTokenIds: []
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
    // 删除选中
    handleDelete () {
      this.$confirm('确认删除所选中的用户吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.deleteLoading = true
          httpDelete(doFaceUser, {ids: this.selectArrayId}).then(res => {
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
      this.$confirm('确认删除所有的用户吗？', '提示', {
        type: 'error'
      })
        .then(() => {
          this.deleteAllLoading = true
          httpDelete(doFaceUser + '/' + this.$store.getters.departmentId).then(res => {
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
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.form.status = 0
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        httpGet(seekBackShow, {userId: row.id, departmentId: this.$store.getters.departmentId}).then((res) => {
          // this.localList = res.data
          this.localList = res.data.local
          // 修改base64
          this.imgUrl = this.form.image // this.form.image
          this.checked = res.data.checked
        }).catch(() => {})
      })
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
      // if (this.form.aiTokenIds === undefined) this.form.aiTokenIds = []
    },
    updateData () {
      this.form.aiTokenIds = this.checked
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          if (this.form.status !== 1) this.form.image = ''
          if (this.form.status === 1) this.form.image = this.form.photo.photo
          const updateFormData = Object.assign({}, this.form)
          httpPut(doFaceUser, updateFormData)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.updateLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    },
    handlePermisson (row) {
      this.idId = row.dutyCompanyId
      this.watchChannel()
      this.isCheck = 'undefined'
      this.dialogCheckVisible = true
      this.rowId = row.id
      this.showType = row.type
    },
    // 获取图片
    handleSeePhoto (row) {
      httpPost(seeAIMemberPhoto + row.id)
        .then(res => {
          if (res.data !== null) {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.$nextTick(() => {
              this.fileData.photo = res.data.photo
              this.imgUrl = 'data:image/jpg;base64,' + res.data.file
            })
          } else {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.fileData.photo = ''
            this.$message.error('图片获取失败')
          }
        }).catch(() => {})
    },
    // 保存图片
    photoData () {
      const data = {
        id: this.rowId,
        photo: this.fileData.photo,
        photoType: this.photoType
      }
      httpPost(updateMemberPhoto, data)
        .then(res => {
          this.dialogPhotoVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.dialogPhotoVisible = false
        })
    },
    changeTimeKinds (val) {
      this.val = val
    }
  }
}
</script>
