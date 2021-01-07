<template>
  <div class="app-container">
    <div class="table-main">
      <div class="filter-container">
        <el-button class="filter-item add" type="primary" @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" :data="data"
        v-loading.body="listLoading" element-loading-text="加载中..."
        border fit highlight-current-row>
        <el-table-column label="标题" align="center" prop="title"></el-table-column>
        <el-table-column label="推送场景" align="center" prop="scene" width="200">
          <template slot-scope="scope">
            {{sceneFormat(scope.row.scene)}}
          </template>
        </el-table-column>
        <el-table-column label="推送时效" align="center" prop="prescription" width="200">
          <template slot-scope="scope">
            {{prescriptionFormat(scope.row.prescription)}}
          </template>
        </el-table-column>
        <el-table-column label="用户类型" align="center" prop="userType" width="200">
          <template slot-scope="scope">
            {{userTypeFormat(scope.row.userType)}}
          </template>
        </el-table-column>
        <el-table-column label="查看次数" align="center" prop="seeNum" width="200"></el-table-column>
        <el-table-column label="提交时间" align="center" prop="createAt" width="200">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createAt)}}
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 新增或者修改 -->
        <el-dialog title="添加" :visible.sync = "dialogFormVisible">
          <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type" >
              <el-select v-model="form.type">
                <el-option v-for="item in notifyType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="场景" prop="scene" >
              <el-checkbox-group v-model="form.scene" size="small">
                <el-checkbox-button v-for="item in scene" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="时效" prop="prescription" >
              <el-checkbox-group v-model="form.prescription" size="small">
                <el-checkbox-button v-for="item in prescriptions" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="消息用户类型" prop="userType" >
              <el-checkbox-group v-model="form.userType" size="small">
                <el-checkbox-button v-for="item in userTypes" :label="item.valueNo" :key="item.valueNo" border>{{item.valueName}}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="内容" prop="text">
              <el-input type="textarea" v-model="form.text" placeholder="请输入消息内容"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="sendNotify">添加</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import { timeFormatter, sceneFormat, prescriptionFormat, userTypeFormat } from '@/utils/formatter.js'
import { httpGet, httpPost } from '@/utils/restful'
import { getNotify, sendNotify } from '@/api/url'
import { scene, prescriptions, userTypes, notifyType } from '@/utils/selectAble.js'
export default {
  name: 'Send',
  data () {
    return {
      data: [],
      listLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      total: null,
      dialogFormVisible: false,
      timeFormatter: timeFormatter,
      sceneFormat: sceneFormat,
      prescriptionFormat: prescriptionFormat,
      userTypeFormat: userTypeFormat,
      scene: scene,
      prescriptions: prescriptions,
      userTypes: userTypes.slice(0, 5),
      notifyType: notifyType.slice(0, 1),
      form: {
        title: '',
        text: '',
        type: 1,
        scene: [1],
        prescription: [4],
        userType: [2, 3]
      },
      formRules: {
        title: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        text: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        type: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        scene: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        prescription: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        userType: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      jsonData: [
        {
          title: '标题',
          key: 'title',
          type: 'text'
        },
        {
          title: '推送场景',
          key: 'scene',
          type: 'text'
        },
        {
          title: '推送时效',
          key: 'prescription',
          type: 'text'
        },
        {
          title: '用户类型',
          key: 'userType',
          type: 'text'
        },
        {
          title: '查看次数',
          key: 'seeNum',
          type: 'text'
        },
        {
          title: '提交时间',
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
    this.getNotify()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.data))
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.scene = this.sceneFormat(item.scene)
        item.prescription = this.prescriptionFormat(item.prescription)
        item.userType = this.userTypeFormat(item.userType)
        item.createAt = this.timeFormatter(item.createAt)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    getNotify () {
      this.listLoading = true
      httpGet(getNotify, this.listQuery).then(res => {
        if (res.data !== null) {
          this.data = res.data.rows
          this.total = res.data.total
        } else {
          this.total = 0
          this.data = []
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    sendNotify () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          httpPost(sendNotify, this.form).then(res => {
            this.getNotify()
            this.dialogFormVisible = false
            setTimeout(() => { this.createLoading = false }, 300)
            this.$message.success(res.message)
          }).catch(() => {
            this.createLoading = false
          })
        }
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getNotify()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.getNotify()
    },
    // 重置表单
    resetForm () {
      this.form = {
        title: '',
        text: '',
        type: 1,
        scene: [1],
        prescription: [4],
        userType: [2, 3]
      }
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
