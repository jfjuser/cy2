<template>
  <div class="table-main" style="margin-top: 20px;">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="primary"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      <el-button class="filter-item" type="danger"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
    </div>
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
      <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
      <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
      <el-table-column :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : '校验码'))" align="center" prop="idCard"></el-table-column>
      <el-table-column label="手机号" align="center" prop="phone">
        <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="addr"></el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">非访客</span>
          <span v-if="scope.row.type">访客</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="isCheck">
        <template slot-scope="scope">
          {{checkStatusFormatter(scope.row.isCheck)}}
        </template>
      </el-table-column>
      <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
      <el-table-column label="有效日期" align="center" prop="endTime">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          <el-button type="primary" @click.native.prevent="handleSeePhoto(scope.row)" size="mini">查看图片</el-button>
          <el-button v-if="scope.row.isCheck === 2" type="primary" @click.native.prevent="handlePermisson(scope.row)" size="mini">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" width="40%">
      <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
        <el-form-item label="韦根卡号" prop="wiegandCard">
          <el-input v-model="form.wiegandCard" placeholder="请输入韦根卡号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : '校验码'))" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入" :disabled="themeType === 1 || themeType === 4 ? true: false"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="tel" v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入用户地址"></el-input>
        </el-form-item>
        <div v-if="dialogStatus === 'create'">
          <el-form-item label="图片" required>
            <upload-photo ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </div>
        <el-form-item label="类型" required v-show="dialogStatus === 'create'">
          <el-radio-group v-model="form.type" @change="radioChange">
            <el-radio :label= 0 >非访客</el-radio>
            <el-radio :label= 1 >访客</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="form.type === 1">
          <el-form-item label="开始日期" required>
            <el-date-picker type="datetime"  v-model="form.beginTime" placeholder="开始日期不可为空">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" required>
            <el-date-picker type="datetime"  v-model="form.endTime"  placeholder="结束日期不可为空">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="createLoading" type="primary" v-if="dialogStatus === 'create'" @click="createData">保存</el-button>
        <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="成员审核" width="30%" :visible.sync = "dialogCheckVisible">
      <el-form>
        <el-form-item label="审核状态" required >
          <el-radio-group v-model="isCheck">
            <el-radio :label= 0 >审核不通过</el-radio>
            <el-radio :label= 1 >审核通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="showType === 1 && isCheck === 1" label="分配通道">
            <el-select v-model="channelId" multiple placeholder="请选择">
              <el-option
                v-for="item in channelArr"
                :key="item.id"
                :label="item.localName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">取消</el-button>
        <el-button type="primary" @click="isCheckData">保存</el-button>
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
</template>
<script>
import { mapGetters } from 'vuex'
import { isShowColumnFormatter, checkStatusFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { personType } from '@/utils/selectAble.js'
import { checkPhone, checkRemarks } from '@/utils/validator.js'
import { getAIMember, checkAICamera, AIMember, uploadAImMember, checkIsAddAIMember, checkAIMemeber, seeAIMemberPhoto, updateMemberPhoto, getUUid } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import UploadPhoto from './UploadPhoto/index.vue'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    UploadPhoto
  },
  props: {
    memberId: {
      type: Number,
      required: true
    }
  },
  name: 'member',
  watch: {
    memberId (curVal, oldVal) {
      this.listQuery.dutyCompanyId = curVal
      this.fetchData()
    }
  },
  mounted () {
    this.listQuery.dutyCompanyId = this.memberId
    this.fetchData()
  },
  data () {
    return {
      photoType: undefined,
      isCheck: undefined,
      action: uploadAImMember,
      channelId: undefined,
      channelArr: [],
      fileData: {
        photo: ''
      },
      imgUrl: '',
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      listQuery: {
        offset: 1,
        limit: 5
      },
      tableData: [],
      total: null,
      isShowColumnFormatter: isShowColumnFormatter,
      checkStatusFormatter: checkStatusFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      personType: personType,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPhotoVisible: false,
      disabled: true,
      selectArrayId: [],
      aiPowerArr: [],
      deleStatus: true,
      dialogStatus: '',
      showType: undefined,
      textMap: {
        update: '编辑成员',
        create: '添加成员'
      },
      form: {
        id: undefined,
        userName: undefined,
        phone: undefined,
        photo: '',
        idCard: undefined,
        addr: undefined,
        type: undefined,
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        idCard: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {maxlength: 19, trigger: 'buur', message: '长度不可超过19位'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        wiegandCard: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        remarks: [
          {validator: checkRemarks, trigger: 'blur'}
        ]
      },
      rowId: undefined,
      jsonData: [
        {
          title: '韦根卡号',
          key: 'wiegandCard',
          type: 'text'
        },
        {
          title: '姓名',
          key: 'userName',
          type: 'text'
        },
        {
          title: '校验码',
          key: 'idCard',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '地址',
          key: 'addr',
          type: 'text'
        },
        {
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '审核状态',
          key: 'isCheck',
          type: 'text'
        },
        {
          title: '同步信息',
          key: 'aiPower',
          type: 'text'
        },
        {
          title: '有效日期',
          key: 'endTime',
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
  methods: {
    handleh () {
      this.jsonData[2]['title'] = parseInt(this.themeType) === 1 ? '校验码' : (parseInt(this.themeType) === 2 ? '工号' : (parseInt(this.themeType) === 3 ? '学号' : '校验码'))
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.type = item.type ? '访客' : '非访客'
        // item.type = parseInt(item.status) === 0 ? '离线' : (parseInt(item.status) === 1 ? '在线' : '')
        item.isCheck = this.checkStatusFormatter(item.isCheck)
        item.endTime = this.timeFormatter(item.endTime)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    func (value) {
      if (value) {
        return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
      } else {
        return ''
      }
    },
    radioChange (value) {
      const data = {
        dutyCompanyId: this.memberId,
        type: value
      }
      httpPost(checkIsAddAIMember, data).then(res => {
        if (res.code > 1) {
          this.createLoading = true
          this.$message.error(res.message)
        } else {
          this.createLoading = false
        }
      }).catch(() => {})
    },
    photoNumber (value) {
      this.form.photo = value
    },
    // 获取成员数据
    fetchData () {
      httpGet(getAIMember, this.listQuery)
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
        limit: 5,
        dutyCompanyId: this.memberId
      }
      this.fetchData()
    },
    resetForm () {
      this.form = {
        id: undefined,
        userName: undefined,
        phone: undefined,
        idCard: undefined,
        photo: '',
        addr: undefined,
        type: undefined,
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined
      }
    },
    // 获取校验码
    getCode () {
      if (this.themeType === 1 || this.themeType === 4) {
        httpGet(getUUid, {departmentId: this.$store.getters.departmentId})
          .then(res => {
            this.form.idCard = res.data
          }).catch(() => {})
      }
    },
    // 添加
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
        this.$refs.uploadPhoto.imageUrl = ''
        this.fileData.photo = ''
        this.getCode()
      })
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      this.aiPowerArr = []
      val.map(item => {
        this.selectArrayId.push(item.id)
        this.aiPowerArr.push(item.aiPower)
        console.log(this.aiPowerArr)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
      this.aiPowerArr.map(item => {
        if (item.indexOf('删除中') > -1) {
          this.deleStatus = false
        } else {
          this.deleStatus = true
        }
      })
    },
    // 删除选中
    // handleDelete () {
    //   if (this.deleStatus === false) {
    //     this.$confirm('所选数据中有正待后台删除中的数据，暂不可删除', '提示', {
    //       type: 'error'
    //     }).then(() => {}).catch(() => {})
    //   } else {
    //     this.$confirm('确认删除所选中的记录吗？', '提示', {})
    //       .then(() => {
    //         this.deleteLoading = true
    //         httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
    //           this.deleteLoading = false
    //           this.fetchData()
    //           this.$message({
    //             type: 'success',
    //             message: res.message,
    //             duration: 4 * 1000
    //           })
    //         }).catch(() => {
    //           this.deleteLoading = false
    //         })
    //       }).catch(() => {})
    //   }
    // },
    handleDelete () {
      if (this.deleStatus === false) {
        this.$confirm('所选数据中有正待后台删除中的数据，暂不可删除', '提示', {
          type: 'error'
        }).then(() => {
        }).catch(() => {
        })
      } else {
        const h = this.$createElement
        let message = ['删除后所选用户将不能正常使用']
        let info = {
          h,
          message,
          firstconfirmButtonText: '确定',
          firstcancelButtonText: '取消',
          secondmessgae: '您已了解删除后果，确定还要继续删除吗',
          secondconfirmButtonText: '我再想想',
          secondcancelButtonText: '确定删除'
        }
        this.MessageBox(info).then(() => {
          this.deleteLoading = false
        }).catch(() => {
          // document.onkeydown = undefined
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
            // document.onkeydown = undefined
          })
        })
      }
    },
    // 删除所有
    // handleAllDelete () {
    //   this.$confirm('确认删除所有的记录吗？', '提示', {})
    //     .then(() => {
    //       this.deleteAllLoading = true
    //       httpDelete(AIMember + '/' + this.memberId).then(res => {
    //         this.deleteAllLoading = false
    //         this.fetchData()
    //         this.$message({
    //           type: 'success',
    //           message: res.message,
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {
    //         this.deleteAllLoading = false
    //       })
    //     }).catch(() => {})
    // },
    handleAllDelete () {
      const h = this.$createElement
      let message = ['删除后所有用户将不能正常使用']
      let info = {
        h,
        message,
        firstconfirmButtonText: '确定',
        firstcancelButtonText: '取消',
        secondmessgae: '您已了解删除后果，确定还要继续删除吗',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定删除'
      }
      this.MessageBox(info).then(() => {
        this.deleteAllLoading = false
      }).catch(() => {
        // document.onkeydown = undefined
        this.deleteAllLoading = true
        httpDelete(AIMember + '/' + this.memberId).then(res => {
          this.deleteAllLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          this.deleteAllLoading = false
          // document.onkeydown = undefined
        })
      })
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.type === 1) {
            this.form.beginTime = (this.timeFormatter(this.form.beginTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
            this.form.endTime = (this.timeFormatter(this.form.endTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
          }
          this.createLoading = true
          this.form = Object.assign(this.form, {dutyCompanyId: this.memberId})
          httpPost(AIMember, this.form)
            .then(res => {
              this.fetchData()
              this.dialogFormVisible = false
              setTimeout(() => { this.createLoading = false }, 300)
              this.$message.success(res.message)
            }).catch(() => {
              this.createLoading = false
            })
        }
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.type === 1) {
            this.form.beginTime = (this.timeFormatter(this.form.beginTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
            this.form.endTime = (this.timeFormatter(this.form.endTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
          }
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form, {photoType: this.photoType})
          httpPut(AIMember, updateFormData)
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
      this.watchChannel()
      this.isCheck = 'undefined'
      this.dialogCheckVisible = true
      this.rowId = row.id
      this.showType = row.type
    },
    watchChannel () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
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
    isCheckData () {
      if (this.isCheck === 'undefined') {
        this.$message.error('请先选择审核的状态')
      } else {
        const data = {
          id: this.rowId,
          isCheck: this.isCheck,
          departmentId: this.$store.getters.departmentId
        }
        httpPut(checkAIMemeber, data).then(res => {
          this.fetchData()
          this.dialogCheckVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.dialogCheckVisible = false
        })
      }
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
              // 修改base64
              this.imgUrl = 'data:image/jpeg;base64,' + res.data.file
            })
          } else {
            this.dialogPhotoVisible = true
            this.rowId = row.id
            this.fileData.photo = ''
            this.$message.error('暂未获取到图片，请重新添加')
          }
        }).catch(() => {

        })
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
    }
  }
}
</script>
