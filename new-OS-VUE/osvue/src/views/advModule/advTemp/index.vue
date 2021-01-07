<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <!-- <el-select clearable v-model="listQuery.type" style="width: 150px;"  class="filter-item" placeholder="目标类型">
          <el-option v-for="item in advTargetType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select v-model="listQuery.disLocation" class="filter-item">
          <el-option v-for="item in disLocationType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
        </el-select>
        <el-select v-model="listQuery.disStyle" class="filter-item" >
          <el-option v-for="item in disStyleType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
        </el-select>
        <el-select v-model="listQuery.happenEvent" class="filter-item" >
          <el-option v-for="item in happenEventType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
        </el-select> -->
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['新增']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
        <!--  @selection-change="handleSelectionChange"   -->
        <!-- <el-table-column type="selection" width="40" fixed="left" ></el-table-column> -->
        <el-table-column label="目标类型" align="center" prop="type">
        </el-table-column>
        <el-table-column label="挂载位置" align="center" prop="disLocation">
        </el-table-column>
        <el-table-column label="广告类型" align="center" prop="advType">
        </el-table-column>
        <el-table-column label="显示样式" align="center" prop="disStyle">
          <template slot-scope="scope">
            {{disStyleFormatter(scope.row.disStyle)}}
          </template>
        </el-table-column>
        <el-table-column label="触发事件" align="center" prop="happenEvent">
          <template slot-scope="scope">
            {{happenEventFormatter(scope.row.happenEvent)}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createAt)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" @click.native.prevent="handleDelete(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width ="40%">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on"  label-position="right" label-width="150px" >
          <el-form-item label="使用场景" prop="type">
            <el-input v-model="form.type" placeholder="请输入内容"></el-input>
            <!-- <el-select v-model="form.type" class="filter-item" @change="changeType">
              <el-option v-for="item in advTargetType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="挂载位置" prop="disLocation">
            <el-input v-model="form.disLocation" placeholder="请输入内容"></el-input>
            <!-- <el-select v-model="form.disLocation" class="filter-item" >
              <el-option v-for="item in disLocationType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="广告类型" prop="advType">
            <el-input v-model="form.advType" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="显示样式" prop="disStyle">
            <el-select v-model="form.disStyle" class="filter-item" >
              <el-option v-for="item in disStyleType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="触发事件" prop="happenEvent">
            <el-input class="filter-item" style="width: 150px;" v-model="form.happenEven" placeholder="请输入触发事件"></el-input>
            <!-- <el-select v-model="form.happenEvent" class="filter-item" @change="changeType1">
              <el-option v-for="item in happenEventType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"> </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item label="图片" required>
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :fileData="form" :action="action" :accept="'image/*'"></upload-file>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading = "createLoading" v-if="dialogStatus=='create'"  type="primary" @click="saveData(isshow)">保存</el-button>
          <el-button :loading = "updateLoading" v-else type="primary" @click="updateData">修改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/cookie.js'
import UploadFile from '@/components/UploadFile'
import { searchAdv, checkAdv } from '@/api/url'
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'// , httpPost
import { advTargetType, disLocationType, disStyleType, happenEventType, pushAdvType } from '@/utils/selectAble'
import { advTargetTypeFormatter, happenEventFormatter, disLocationFormatter, disStyleFormatter, isShowColumnFormatter, timeFormatter } from '@/utils/formatter'
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
      fileData: {
        photo: ''
      },
      imgUrl: '',
      pushAdvType,
      action: checkAdv,
      imageUrl: '',
      isshow: false,
      disabled: true,
      isSelectDis: false,
      createLoading: false,
      updateLoading: false,
      dialogStatus: '',
      dialogVisible: false,
      tableData: [],
      tableData1: [],
      textMap: {
        update: '编辑',
        create: '添加'
      },
      listLoading: true,
      deleteLoading: false,
      dialogFormVisible: false,
      form: {
        advType: undefined,
        departmentId: this.$store.getters.departmentId,
        type: undefined,
        disLocation: undefined,
        disStyle: undefined,
        happenEvent: 2,
        photo: ''
      },
      advTargetType: advTargetType,
      disLocationType: disLocationType,
      selectArrayId: [],
      disStyleType: disStyleType,
      happenEventType: happenEventType,
      advTargetTypeFormatter: advTargetTypeFormatter,
      happenEventFormatter: happenEventFormatter,
      disLocationFormatter: disLocationFormatter,
      disStyleFormatter: disStyleFormatter,
      timeFormatter: timeFormatter,
      total: undefined,
      dialogImageUrl: '',
      listQuery: {
        // type: undefined,
        // disLocation: undefined,
        // disStyle: undefined,
        // happenEvent: undefined,
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      isShowColumnFormatter: isShowColumnFormatter,
      formRules: {
        type: [
          {required: true, trigger: 'change', message: '请选择使用场景'}
        ],
        happenEvent: [
          {required: true, trigger: 'change', message: '请选择广告触发事件'}
        ]
      },
      jsonData: [
        {
          title: '目标类型',
          key: 'type',
          type: 'text'
        },
        {
          title: '挂载位置',
          key: 'disLocation',
          type: 'text'
        },
        {
          title: '显示样式',
          key: 'disStyle',
          type: 'text'
        },
        {
          title: '触发事件',
          key: 'happenEvent',
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
        item.type = this.advTargetTypeFormatter(item.type)
        item.disLocation = this.disLocationFormatter(item.disLocation)
        item.disStyle = this.disStyleFormatter(item.disStyle)
        item.happenEvent = this.happenEventFormatter(item.happenEvent)
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      httpGet(searchAdv, this.listQuery).then((res) => {
        if (res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          res.data.rows.forEach((item, index) => {
            item.disLocation = item.disLocation === -1 ? null : item.disLocation
            item.disStyle = item.disStyle === -1 ? null : item.disStyle
          })
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
      }).catch((err) => {
        console.log(err)
        this.listLoading = false
      })
    },
    saveData (formName) {
      // console.log(formName)
      this.$nextTick(() => {
        if (!formName) {
          this.$refs.upload.$refs.UPLOAD.submit()
          this.$refs['dataform'].resetFields()
        } else {
          let formData = new FormData()
          formData.append('departmentId', this.form.departmentId)
          formData.append('type', this.form.type)
          formData.append('happenEvent', this.form.happenEvent)
          httpPost('v1/push/model', formData).then(res => {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.fetchData()
            this.$refs['dataform'].resetFields()
          })
        }
      })
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogFormVisible = false
      this.fetchData()
    },
    changeType () {
      // console.log()
      this.isshow = false
      console.log(this.form.happenEvent)
      if (this.form.type === undefined) {
        this.isSelectDis = false
        this.form.disLocation = undefined
        this.form.disStyle = undefined
        this.form.happenEvent = 4
        // this.$message.warning('请先目标类型')
      } else if (this.form.type === 2) {
        this.form.disLocation = 1
        this.form.disStyle = 2
        this.form.happenEvent = 2
        this.form.photo = this.imageUrl
        this.isSelectDis = true
        if (this.form.happenEvent === 2) {
          this.isshow = true
        }
      } else {
        // this.$message.warning('暂只支持公众号类型')
        this.isSelectDis = true
      }
    },
    changeType1 () {
      this.isshow = false
      if (this.form.happenEvent === 2) {
        if (this.form.type === 2) {
          this.isshow = true
        }
      }
    },
    handleError () {
      this.$message.error('服务器异常，请稍后再试！')
    },
    beforeUpload (file) {
      if (file === null || file === 'undefined') {
        this.$message.error('请选择文件进行上传')
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加
    handleCreate () {
      let self = this
      // this.resetForm()
      self.dialogStatus = 'create'
      self.dialogFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.$refs.UPLOAD.clearFiles()
        }
      })
    },
    resetForm () {
      this.form = {
        type: undefined,
        disLocation: undefined,
        disStyle: undefined,
        happenEvent: undefined
      }
    },
    // 编辑
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.isSelectDis = true
      if (row.happenEvent / 1 === 2 && row.type / 1 === 2) {
        this.isshow = true
      } else {
        this.isshow = false
      }
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
        // this.$refs['dataform'].resetFields()
      })
    },
    // 修改
    updateData () {
      this.updateLoading = true
      let formData = new FormData()
      formData.append('advType', this.form.advType)
      formData.append('departmentId', this.form.departmentId)
      formData.append('createAt', this.form.createAt)
      formData.append('type', this.form.type)
      formData.append('happenEvent', this.form.happenEvent)
      formData.append('id', this.form.id)
      formData.append('name', this.form.name)
      formData.append('photo', this.form.photo)
      if (this.form.type / 1 === 2 && this.form.happenEvent / 1 === 2) {
        formData.append('disLocation', '-1')
        formData.append('disStyle', '-1')
      } else {
        formData.append('disLocation', this.form.disLocation)
        formData.append('disStyle', this.form.disStyle)
      }
      // console.log(this.form)
      // return
      httpPut(searchAdv, formData).then((res) => {
        this.$message({
          message: res.message,
          duration: 3000,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.fetchData()
        // this.$refs['dataform'].resetFields()
        setTimeout(() => { this.updateLoading = false }, 300)
        console.log(res)
      }).catch((err) => {
        this.$message.error(err)
        this.updateLoading = false
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
    // 删除所选
    handleDelete (row) {
      this.$confirm('确定要删除吗？', '提示', {})
        .then(() => {
          httpDelete(searchAdv + '/' + row.id).then((res) => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 3000
            })
            this.fetchData()
          }).catch((err) => {
            this.$message.error(err)
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
    }
  },
  components: { UploadFile }
}
</script>
