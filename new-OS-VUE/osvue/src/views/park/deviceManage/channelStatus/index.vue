<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"   @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :disabled="disabled" :loading="deleteLoading" @click="handleDelete">删除所选</el-button>
      </div>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" @selection-change="handleSelectionChange" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" v-if = "isShowColumnFormatter(['删除'])" fixed="left" ></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="车道ID" align="center" prop="point"></el-table-column>
        <el-table-column label="车道编码" align="center" prop="localId"></el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column label="最近在线时间" align="center" prop="loginAt" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginAt)}}
          </template>
        </el-table-column>
        <el-table-column label="最近离线时间" align="center" prop="loginOutAt" width="160">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.loginOutAt)}}
          </template>
        </el-table-column>
        <el-table-column label="出/入口" align="center" prop="type">
          <template slot-scope="scope">
            {{inOutFormatter(scope.row.type)}}
          </template>
        </el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="配置状态" align="center" prop="init">
          <template slot-scope="scope">
            {{initFormatter(scope.row.init)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" v-if = "isShowColumnFormatter(['编辑', '开闸', '线圈调试', '广告语', '语音', '显示屏', '卡详情'])" class-name="small-padding fixed-width" width="500">
          <template slot-scope="scope">
            <el-button type="primary" v-has="['校时']" @click="handleTimeUp(scope.row.id)" size="mini">校时</el-button>
            <el-button type="primary" v-has="['重启']" @click="handleReBoot(scope.row.id)" size="mini">重启</el-button>
            <el-button type="primary" v-has="['编辑']" @click="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" v-has="['开闸']"  @click="switchEd(scope.row.id)" size="mini">开闸</el-button>
            <el-button type="primary" v-has="['线圈调试']"  @click="handleLoopSub(scope.row)"  size="mini">线圈调试</el-button>
            <el-button type="primary" v-has="['语音', '显示屏测试', '卡详情', '广告语']"  @click="handleMore(scope.row)" size="mini">更多..</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="修改" :visible.sync="dialogFormVisible" width="30%">
        <el-form :rules="formRules" ref="dataForm" :model="form" autoComplete="on" label-postiton="right" label-width="150px">
          <el-form-item label="通道名称" prop="localName">
              <el-input v-model="form.localName"></el-input>
          </el-form-item>
          <el-form-item label="唯一标识" >
              <el-input v-model="form.unicode"></el-input>
          </el-form-item>
        </el-form>
         <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button :loading="updateLoading" type="primary" @click="createData">保存</el-button>
          </div>
      </el-dialog>
      <el-dialog title="线圈调试" :visible.sync="dialogFormLoopVisible" width="800px" :close-on-click-modal="false">
          <HSCamera v-if="cameraType === 1 || cameraType === 4" :cameraId = "rowId" :showLoopVisible="showLoopVisible" @closeLoopVisible = "closeLoopVisible"/>
          <QYCamera v-if="cameraType === 2 || cameraType === 3" :cameraId = "rowId" :showLoopVisible="showLoopVisible"  @closeLoopVisible = "closeLoopVisible"/>
      </el-dialog>
      <!-- 更多操作 -->
      <el-dialog title="更多操作"  :visible.sync="dialogMoreVisible" width="30%">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClick">
          <el-tab-pane label="语音" name="1" v-if="isShowColumnFormatter(['语音'])">
            <el-form label-postiton="right" label-width="80px">
              <el-form-item label="语音" required >
                  <el-input v-model="voice"></el-input>
              </el-form-item>
              <el-form-item >
                <el-button :loading="voiceLoading" @click="saveVoice">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="卡详情" name="2" v-if="isShowColumnFormatter(['卡详情'])">
            <el-row>
              <el-col :span="12">
                <div class="sim-detail">相机ccid</div>
                <div class="sim-detail">相机信号</div>
                <div class="sim-detail">模块编号</div>
                <div class="sim-detail">设备版本</div>
                <div class="sim-detail">模块模式</div>
                <div class="sim-detail">基站定位信息</div>
                <div class="sim-detail sim-bottom">基站定位地址</div>
              </el-col>
              <el-col :span="12">
                <div class="sim-detail">{{simDetail.ccid ?simDetail.ccid : '--'}}</div>
                <div class="sim-detail">{{simDetail.sig ? sigFormatter(simDetail.sig) : '--'}}</div>
                <div class="sim-detail">{{simDetail.imei ? simDetail.imei : '--'}}</div>
                <div class="sim-detail">{{simDetail.ver ? simDetail.ver : '--'}}</div>
                <div class="sim-detail">{{simDetail.model ? simDetail.model : '--'}}</div>
                <div class="sim-detail">{{simDetail.lca ? simDetail.lca : '--'}}</div>
                <div class="sim-detail sim-bottom">{{simDetail.location ? simDetail.location : '--'}}</div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="显示屏测试" name="3" v-if="isShowColumnFormatter(['显示屏测试'])">
            <el-form label-postiton="right" label-width="80px">
              <el-form-item label="第一行">
                <el-input v-model="disp.ln1"></el-input>
              </el-form-item>
              <el-form-item label="第二行">
                <el-input v-model="disp.ln2"></el-input>
              </el-form-item>
              <el-form-item label="第三行"  >
                <el-input v-model="disp.ln3"></el-input>
              </el-form-item>
              <el-form-item label="第四行"  >
                <el-input v-model="disp.ln4"></el-input>
              </el-form-item>
              <el-form-item label="显示时间">
                <el-input v-model="disp.time"></el-input>
                <span>备注：秒，0表一直显示</span>
              </el-form-item>
              <el-form-item >
                <el-button :loading="dispLoading" @click="saveDispTest">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="广告语" name="4" v-if="isShowColumnFormatter(['广告语'])">
            <el-form label-postiton="right" label-width="80px" :inline="true">
              <el-form-item label="第一行">
                <el-input class="advStyle" v-model="adv.ledAdv"></el-input>
                <el-input-number class="advNum" v-show="disabledAdv" v-model="adv.color1" :min="0" :max="255" label="颜色"></el-input-number>
              </el-form-item>
              <el-form-item label="第二行">
                <el-input class="advStyle" v-model="adv.disp2"></el-input>
                <el-input-number class="advNum" v-show="disabledAdv" v-model="adv.color2" :min="0" :max="255" label="颜色"></el-input-number>
              </el-form-item>
              <el-form-item label="第三行"  >
                <el-input class="advStyle" v-model="adv.disp3"></el-input>
                <el-input-number class="advNum" v-show="disabledAdv" v-model="adv.color3" :min="0" :max="255" label="颜色"></el-input-number>
              </el-form-item>
              <el-form-item label="第四行"  >
                <el-input class="advStyle" v-model="adv.disp4"></el-input>
                <el-input-number class="advNum" v-show="disabledAdv" v-model="adv.color4" :min="0" :max="255" label="颜色"></el-input-number>
              </el-form-item>
              <el-form-item >
                <el-button :loading="advLoading" @click="saveAdv">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { inOutFormatter, initFormatter, timeFormatter, isShowColumnFormatter, sigFormatter } from '@/utils/formatter.js'
import { moneyType } from '@/utils/selectAble.js'
import { getDeviceStatus, updateDeviceStatus, deleteDeviceStatus, switchById, reboot, timeUp, setVoice, getSimDetail, dispTest, Adv } from '@/api/url'
import { httpGet, httpPut, httpDelete, httpPost } from '@/utils/restful'
import HSCamera from './components/HSCamera'
import QYCamera from './components/QYCamera'
export default {
  components: {
    HSCamera,
    QYCamera
  },
  data () {
    return {
      list: null,
      activeName: '1',
      listLoading: true,
      deleteLoading: false,
      updateLoading: false,
      updateLoopLoading: false,
      voiceLoading: false,
      dispLoading: false,
      advLoading: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      moneyType: moneyType,
      dialogFormVisible: false,
      dialogFormLoopVisible: false,
      dialogMoreVisible: false,
      inOutFormatter: inOutFormatter,
      initFormatter: initFormatter,
      timeFormatter: timeFormatter,
      sigFormatter: sigFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      form: {
        id: undefined,
        localName: undefined,
        unicode: undefined
      },
      formRules: {
        localName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      fee: 0,
      rowId: undefined,
      cameraType: 0,
      voice: '', // 语音
      ledAdv: '', // 广告语
      mac: '',
      simDetail: {
        ccid: undefined,
        imei: undefined,
        lca: undefined,
        location: undefined,
        mac: undefined,
        model: undefined,
        sig: undefined,
        ver: undefined
      },
      // 显示屏测试
      disp: {
        ln1: undefined,
        ln2: undefined,
        ln3: undefined,
        ln4: undefined,
        time: undefined
      },
      // 广告语
      adv: {
        ledAdv: undefined,
        disp2: undefined,
        disp3: undefined,
        disp4: undefined,
        color1: 0,
        color2: 0,
        color3: 0,
        color4: 0
      },
      disabledAdv: false,
      jsonData: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '车道ID',
          key: 'point',
          type: 'text'
        },
        {
          title: '车道编码',
          key: 'localId',
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
          title: '出/入口',
          key: 'type',
          type: 'text'
        },
        {
          title: 'MAC地址',
          key: 'mac',
          type: 'text'
        },
        {
          title: '配置状态',
          key: 'init',
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
        item.loginOutAt = this.timeFormatter(item.loginOutAt)
        item.loginAt = this.timeFormatter(item.loginAt)
        item.type = this.inOutFormatter(item.type)
        item.init = this.initFormatter(item.init)
        item.status = parseInt(item.status) === 0 ? '离线' : '在线'
        // item.loginAt = this.timeFormatter(item.loginAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    closeLoopVisible () {
      this.dialogFormLoopVisible = false
    },
    fetchData () {
      this.listLoading = true
      httpGet(getDeviceStatus + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    resetForm () {
      this.form = {
        id: undefined,
        localName: undefined,
        name: undefined,
        unicode: undefined
      }
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 编辑
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
      // 延迟调用
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    // 线圈调试
    handleLoopSub (row) {
      if (row.cameraType === null) {
        this.$message.warning('该相机暂不支持线圈调试')
      } else {
        this.rowId = row.id
        this.cameraType = row.cameraType
        this.dialogFormLoopVisible = true
      }
    },
    showLoopVisible () {
      this.dialogFormLoopVisible = true
    },
    createData () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(updateDeviceStatus, updateFormData).then(res => {
            this.fetchData()
            this.dialogFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
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
          httpDelete(deleteDeviceStatus, {ids: this.selectArrayId}).then(res => {
            this.deleteLoading = false
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
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
    // 校时
    handleTimeUp (id) {
      this.$confirm('确认对相机进行校时吗？', '提示', {})
        .then(() => {
          httpPost(timeUp + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 重启
    handleReBoot (id) {
      this.$confirm('确认重启相机吗？', '提示', {})
        .then(() => {
          httpPost(reboot + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 开闸
    switchEd (id) {
      this.$confirm('确认开闸吗？', '提示', {})
        .then(() => {
          httpPost(switchById + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // ---------------------- 更多操作 --------------------\\
    handleMore (row) {
      this.rowId = row.id
      this.mac = row.mac
      this.dialogMoreVisible = true
      this.activeName = '1'
      // this.simDetail = {
      //   ccid: undefined,
      //   imei: undefined,
      //   lca: undefined,
      //   location: undefined,
      //   mac: undefined,
      //   model: undefined,
      //   sig: undefined,
      //   ver: undefined
      // }
      // this.adv = {
      //   ledAdv: undefined,
      //   disp2: undefined,
      //   disp3: undefined,
      //   disp4: undefined,
      //   color1: 0,
      //   color2: 0,
      //   color3: 0,
      //   color4: 0
      // }
    },
    // ---------------------- tab切换 --------------------\\
    tabClick (tab) {
      if (tab.label === '卡详情') this.getSimDetail()
      if (tab.label === '广告语') this.getAdv()
    },
    // ---------------------- 获取卡详情信息 --------------------\\
    getSimDetail () {
      httpGet(getSimDetail + this.mac)
        .then(res => {
          this.simDetail = Object.assign({}, res.data)
        }).catch(() => {})
    },
    // ---------------------- 语音保存 --------------------\\
    saveVoice () {
      if (this.voice === '') {
        this.$message.warning('请先填写要下发的语音')
      } else {
        this.voiceLoading = true
        let data = {
          id: this.rowId,
          voice: this.voice
        }
        httpPost(setVoice, data).then(res => {
          this.voiceLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.voiceLoading = false
        })
      }
    },
    // ---------------------- 显示屏测试 --------------------\\
    saveDispTest () {
      this.dispLoading = true
      const data = Object.assign(this.disp, {id: this.rowId})
      httpPost(dispTest, data)
        .then(res => {
          this.dispLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.dispLoading = false
        })
    },
    // ---------------------- 广告语 --------------------\\
    getAdv () {
      httpGet(Adv + '/' + this.rowId)
        .then(res => {
          this.adv = Object.assign({}, res.data)
          if (this.adv.displayType === 3) {
            this.disabledAdv = true
          } else {
            this.disabledAdv = false
          }
        }).catch(() => {})
    },
    saveAdv () {
      this.advLoading = true
      const data = Object.assign(this.adv, {id: this.rowId})
      httpPost(Adv, data)
        .then(res => {
          this.advLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.advLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.sim-detail {
  height: 2.875rem;
  line-height: 2.875rem;
  border: .0625rem solid #e7e5e5;
  text-align: center;
  border-bottom: none;
}
.sim-bottom {
   border-bottom: .0625rem solid #e7e5e5;
}
.advStyle {
  width: auto;
}
.advNum {
  width: 150px;
}
</style>
