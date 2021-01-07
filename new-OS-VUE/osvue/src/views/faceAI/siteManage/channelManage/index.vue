<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"  @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="类型" align="center" prop="ledType">
          <template slot-scope="scope">
            {{ledTypeFormatter(scope.row.ledType)}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="最近在线时间" align="center" prop="loginAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginAt)}}
          </template>
        </el-table-column>
        <el-table-column label="最近离线时间" align="center" prop="loginOutAt">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginOutAt)}}
          </template>
        </el-table-column>
        <el-table-column label="LED屏宽" align="center" prop="ledWidth" v-if="tableData.ledType === 0"></el-table-column>
        <el-table-column label="LED屏高" align="center" prop="ledHeight" v-if="tableData.ledType === 0"></el-table-column>
        <!--  v-if = "isShowColumnFormatter(['编辑'])"  -->
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="500">
          <template slot-scope="scope">
            <el-button type="primary" style="margin-bottom:10px" v-has="['修改', '设置提示语', '同步白名单', '清空白名单', '开机', '关机']"  @click="handleEdit(scope.row)" size="mini">修改</el-button>
            <el-button type="primary" size="mini" v-has="['解绑']" @click="unbind(scope.row)">解绑</el-button>
            <el-button type="primary" size="mini" v-has="['设置提示语']" v-show="scope.row.ledType === 1" @click="setAdv(scope.row)">设置提示语</el-button>
            <el-button type="primary" size="mini" v-has="['同步白名单']" v-show="scope.row.ledType === 1" @click="sysnWhite(scope.row)">同步白名单</el-button>
            <el-button type="primary" size="mini" v-has="['清空白名单']" v-show="scope.row.ledType === 1" @click="deleteWhite(scope.row)">清空白名单</el-button>
            <el-button type="primary" size="mini" v-has="['开机']" v-show="scope.row.ledType === 0" @click="turnOn(scope.row)">开机</el-button>
            <el-button type="primary" size="mini" v-has="['关机']" v-show="scope.row.ledType === 0" @click="turnOff(scope.row)">关机</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="编辑" :visible.sync="dialogVisable">
        <el-form  ref="upgradeFile" :rules="upgradeFileFormRules"  :model="upgradeFileForm" autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="通道名称"  prop="localName">
            <el-input  class="filter-item" placeholder="请输入通道名称" v-model="upgradeFileForm.localName"></el-input>
          </el-form-item>
          <el-form-item label="相机选择" prop="aiTokenIdArr">
            <el-checkbox-group v-model="upgradeFileForm.aiTokenIdArr">
              <el-checkbox  v-for="item in cameraList" :label="item.localId" :key="item.localId">{{item.localName}}</el-checkbox>
              <el-checkbox v-show="cameraList.length === 0">部门下暂无相机可选择</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="LED屏宽"  prop="ledWidth" v-if="upgradeFileForm.ledType == 0">
            <el-input  class="filter-item" placeholder="请输入屏幕宽度" v-model="upgradeFileForm.ledWidth"></el-input>
          </el-form-item>
          <el-form-item label="LED屏高"  prop="ledHeight" v-if="upgradeFileForm.ledType == 0">
            <el-input  class="filter-item" placeholder="请输入屏幕高度" v-model="upgradeFileForm.ledHeight"></el-input>
          </el-form-item>
          <el-form-item label="LED亮度"  prop="ledBrightness" v-if="upgradeFileForm.ledType == 0">
            <el-slider v-model="upgradeFileForm.ledBrightness" :min="1" :max="16"></el-slider>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisable = false">取消</el-button>
          <el-button type="primary" @click="saveUpgradeFile">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="设置提示语" :visible.sync="dialogTipVisible" width="500px">
          <el-form :model="setAdvFrom" autoCompete = "on" label-position="right" label-width="100px" >
            <el-form-item label="进出时提示" prop="inOutAdv">
              <el-input v-model="setAdvFrom.inOutAdv" placeholder="请输入进出时提示"></el-input>
            </el-form-item>
            <el-form-item label="空闲时提示" prop="reason">
              <el-input v-model="setAdvFrom.freeAdv" placeholder="请输入空闲时提示"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTipVisible = false">取消</el-button>
            <el-button type="primary" @click="saveTip" :disabled="setloading">保存</el-button>
          </div>
        </el-dialog>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { timeFormatter, ledTypeFormatter } from '@/utils/formatter'
import { gainAllLedApp, unbind, backShow, updateParams, ledAppSetAdv, ledAppTurnOff, ledAppTurnOn, ledAppSyncWhiteList, ledAppDeleteWhiteList } from '@/api/url'
import { httpGet, httpPost, httpPut } from '@/utils/restful'
export default {
  created () {
    this.fetchData()
  },
  data () {
    return {
      tableData: [],
      dialogVisable: false,
      dialogTipVisible: false,
      listLoading: true,
      setloading: false,
      timeFormatter: timeFormatter,
      ledTypeFormatter: ledTypeFormatter,
      listQuery: {
        offset: 1,
        limit: 10
      },
      upgradeFileForm: {
        localName: undefined,
        id: undefined,
        ledHeight: 0,
        ledWidth: 0,
        ledBrightness: 6,
        aiTokenIdArr: undefined,
        newAiTokenIdArr: [],
        oldAiTokenIdArr: []
      },
      setAdvFrom: {
        ledAppId: undefined,
        departmentId: this.$store.getters.departmentId,
        inOutAdv: '',
        freeAdv: ''
      },
      upgradeFileFormRules: {
        localName: [
          {required: true, trigger: 'blur', message: '请输入通道名称'}
        ],
        ledHeight: [
          {required: true, trigger: 'blur', message: '请输入LED屏高'}
        ],
        ledWidth: [
          {required: true, trigger: 'blur', message: '请输入LED屏宽'}
        ]
      },
      total: undefined,
      cameraList: [],
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: 'MAC地址',
          key: 'mac',
          type: 'text'
        },
        {
          title: '类型',
          key: 'ledType',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '最近在线时间',
          key: 'loginAt',
          type: 'text'
        },
        {
          title: '最近离线时间',
          key: 'loginOutAt',
          type: 'text'
        },
        {
          title: 'LED屏宽',
          key: 'ledWidth',
          type: 'text'
        },
        {
          title: 'LED屏高',
          key: 'ledHeight',
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
      // console.log(this.jsonData.splice(3, 1))
      this.jsonData = parseInt(this.tableData.ledType) === 0 ? this.jsonData : this.jsonData.splice(0, 6)
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.ledType = this.ledTypeFormatter(item.ledType)
        item.loginAt = this.timeFormatter(item.loginAt)
        item.loginOutAt = this.timeFormatter(item.loginOutAt)
        item.status = parseInt(item.status) === 0 ? '离线' : '在线'
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    fetchData () {
      this.listLoading = true
      httpGet(gainAllLedApp + '/' + this.$store.getters.departmentId, this.listQuery)
        .then((res) => {
          if (res.data.rows !== null) {
            this.total = res.data.total
            this.tableData = res.data.rows
          } else {
            this.tableData = []
            this.total = 0
          }
        }).catch(() => {})
      this.listLoading = false
    },
    handleEdit (row) {
      let rows = JSON.stringify(row)
      let x = JSON.parse(rows)
      this.upgradeFileForm = Object.assign(this.upgradeFileForm, x)
      this.dialogVisable = true
      this.selectCamera(row.id)
    },
    selectCamera (row) {
      console.log(row)
      httpGet(backShow + '/' + row + '/' + this.$store.getters.departmentId) // 1624 this.$store.getters.departmentId
        .then((res) => {
          console.log(res)
          if (res.data !== null) {
            this.cameraList = res.data.local
            this.upgradeFileForm.aiTokenIdArr = res.data.checked
            this.upgradeFileForm.oldAiTokenIdArr = res.data.checked
          }
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
    saveUpgradeFile () {
      this.$refs.upgradeFile.validate((valid) => {
        if (valid) {
          var x = {
            id: this.upgradeFileForm.id,
            ledHeight: this.upgradeFileForm.ledHeight,
            ledWidth: this.upgradeFileForm.ledWidth,
            localName: this.upgradeFileForm.localName,
            newAiTokenIdArr: this.upgradeFileForm.aiTokenIdArr,
            oldAiTokenIdArr: this.upgradeFileForm.oldAiTokenIdArr,
            ledBrightness: this.upgradeFileForm.ledBrightness
          }
          let ledAppBindDto = Object.assign(x, {departmentId: parseInt(this.$store.getters.departmentId)})
          httpPut(updateParams, ledAppBindDto)
            .then((res) => {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              })
              this.dialogVisable = false
              this.fetchData()
            }).catch(() => {})
        }
      })
    },
    unbind (row) {
      this.$confirm('是否要进行相机解绑？', '解绑提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        httpPut(unbind + '/' + this.$store.getters.departmentId + '/' + row.id)
          .then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.fetchData()
          }).catch(() => {})
      }).catch(() => {})
    },
    setAdv (row) {
      this.setAdvFrom.ledAppId = row.id
      this.setloading = false
      this.dialogTipVisible = true
    },
    saveTip () {
      if (!this.setloading) {
        this.setloading = true
        this.$message.success('设置中,请稍后...')
        httpPost(ledAppSetAdv, this.setAdvFrom).then((res) => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.setloading = false
          this.dialogTipVisible = true
          this.fetchData()
        }).catch(() => {
          this.setloading = false
        })
      }
    },
    sysnWhite (row) {
      this.$message.success('设置中,请稍后...')
      httpPost(ledAppSyncWhiteList + '/' + row.id + '/' + this.$store.getters.departmentId).then((res) => {
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {})
    },
    deleteWhite (row) {
      this.$confirm('当前操作清空设备的数据!, 确认删除吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        this.$message.success('删除中,请稍后...')
        httpPost(ledAppDeleteWhiteList + '/' + row.id + '/' + this.$store.getters.departmentId).then((res) => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    turnOn (row) {
      this.$message.success('设置中,请稍后...')
      httpPost(ledAppTurnOn + '/' + row.id + '/' + this.$store.getters.departmentId).then((res) => {
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {})
    },
    turnOff (row) {
      this.$message.success('设置中,请稍后...')
      httpPost(ledAppTurnOff + '/' + row.id + '/' + this.$store.getters.departmentId).then((res) => {
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
