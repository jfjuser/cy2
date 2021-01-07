<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-button class="filter-item" type="primary"   @click="fetchData" icon="el-icon-refresh">刷新</el-button>
      </div>
      <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%"   max-height="600" :data="tableData" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiCameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
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
        <el-table-column label="绑定状态" align="center" prop="isBind">
          <template slot-scope="scope">
            {{isBindFormatter(scope.row.isBind)}}
          </template>
        </el-table-column>
        <el-table-column label="TCP协议版本" align="center" prop="tcpVersion"></el-table-column>
        <el-table-column label="网络连接类型" align="center" prop="networkType">
          <template slot-scope="scope">
            {{networkTypeFormatter(scope.row.networkType)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" min-width="200">
          <template slot-scope="scope">
            <el-button type="primary" style="margin-bottom:10px"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id)" size="mini">解绑</el-button>
            <el-button type="success" size="mini" @click="getMembers(scope.row)">查看设备人脸</el-button>
            <!-- <el-button type="primary"  @click="reBootCamera(scope.row.id)" size="mini">重启TCP</el-button>
            <el-button type="primary" @click="reBootDevice(scope.row.id)" v-if="scope.row.cameraType === 130" size="mini">重启设备</el-button>
            <el-button type="primary" @click="openGate(scope.row.id)" v-if="scope.row.cameraType === 130" size="mini">一键开闸</el-button>
            <el-button type="primary" style="margin-bottom:10px"  @click="dataReset(scope.row.id)" v-if="scope.row.cameraType === 130" size="mini">恢复出厂设置</el-button>
            <el-button type="primary"  @click="setCameraTime(scope.row.id)" size="mini">校时</el-button>
            <el-button type="primary"  @click="getCameraVer(scope.row.id)" size="mini">版本</el-button>
            <el-button type="primary"  @click="adaptStatus(scope.row.id)" size="mini">同步状态</el-button>
            <el-button type="primary"  @click="clearCameraWhite(scope.row.id)" size="mini">清除白名单</el-button>
            <el-button type="primary"  @click="getPicture(scope.row)" size="mini">获取图片</el-button>
            <el-button type="primary" @click="handleMore(scope.row)" size="mini">更多...</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30,50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 查看设备人脸 -->
      <template v-if="memberId">
          <Member :memberId = "memberId" :leaderName="localName"></Member>
      </template>

      <el-dialog title="编辑" :visible.sync="dialogEditVisible" width="30%">
        <el-form>
          <el-form-item label="名称">
            <el-input v-model="editForm.localName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading = "updataLoading" type="primary" @click="createEdit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="版本信息" :visible.sync="dialogVersionVisible">
        <el-input type="textarea" v-model="version" :rows = "13"></el-input>
      </el-dialog>
      <el-dialog title="更多操作" :visible.sync="dialogMoreVisible" width="1000px">
        <el-tabs type="border-card" @tab-click="tabClick">
          <el-tab-pane label="向下调焦" >
            <el-button @click="cameraDownFocus(5)">粗调</el-button>
            <el-button @click="cameraDownFocus(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="向上调焦" >
            <el-button @click="cameraUpFocus(5)">粗调</el-button>
            <el-button @click="cameraUpFocus(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="减小倍数" >
            <el-button @click="cameraZoomDown(5)">粗调</el-button>
            <el-button @click="cameraZoomDown(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="增加倍数" >
            <el-button @click="cameraZoomUp(5)">粗调</el-button>
            <el-button @click="cameraZoomUp(1)">微调</el-button>
            <el-button :disabled="disabled" @click="getPic">查看图片</el-button>
          </el-tab-pane>
          <el-tab-pane label="参数设置" >
            <ParamsAISetting :aiTokenId = "rowId" :cameraType = "rowData.cameraType"></ParamsAISetting>
          </el-tab-pane>
          <el-tab-pane label="相机设置"  v-if="isShow">
            <!-- 华安人脸 -->
            <div v-if="rowData.cameraType === 129">
              <el-form label-width="150px" label-position="right">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="亮度阈值">
                      <el-input-number v-model="cameraSetting.ledThreshold" :min="1" :max="100" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="LED亮度">
                      <el-input-number v-model="cameraSetting.ledLevel" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="去重复开关">
                      <el-select v-model="cameraSetting.derEn">
                        <el-option
                          v-for="item in derEnFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="当前最大增益">
                      <el-input-number v-model="cameraSetting.ledLevel" :min="0" :max="40" ></el-input-number>
                      <span>单位:DB</span>
                    </el-form-item>
                    <el-form-item label="输出延迟">
                      <el-input-number v-model="cameraSetting.outputDelay" :min="1" :max="30" ></el-input-number>
                      <span>单位:秒</span>
                    </el-form-item>
                    <el-form-item label="实时推送进出记录">
                      <el-select v-model="cameraSetting.enPushFace">
                        <el-option
                          v-for="item in enPushFaceFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="输出延迟">
                      <el-input-number v-model="cameraSetting.alarmDuration" :min="500" :max="5000" ></el-input-number>
                      <span>单位:毫秒</span>
                    </el-form-item>
                    <div v-if="cameraSetting.contType === 1">
                      <el-form-item label="韦根类型">
                        <el-select v-model="cameraSetting.wiegandType">
                          <el-option
                            v-for="item in wiegandTypeFormatter"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="韦根卡号范围最小值">
                        <el-input-number v-model="cameraSetting.wiegMinCardNo" :min="1" :max="20" ></el-input-number>
                      </el-form-item>
                      <el-form-item label="闸机门禁公共卡号">
                        <el-input v-model="cameraSetting.wiegCardNo" ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="人脸对比强度">
                      <el-select v-model="cameraSetting.matchLevel">
                        <el-option
                          v-for="item in matchLevelFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="人脸确信分数">
                      <el-input-number v-model="cameraSetting.matchScore" :min="1" :max="100" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="重复超时" v-if="cameraSetting.derEn === 1">
                      <el-input-number v-model="cameraSetting.outTime" :min="1" :max="59" ></el-input-number>
                    </el-form-item>
                    <el-form-item label="最大曝光时间">
                      <el-input-number v-model="cameraSetting.outTime" :min="300" :max="9900" ></el-input-number>
                      <span>毫秒</span>
                    </el-form-item>
                    <el-form-item label="对比度">
                      <el-input-number v-model="cameraSetting.outTime" :min="1" :max="128" ></el-input-number>
                      <span>毫秒</span>
                    </el-form-item>
                    <el-form-item label="控制接口">
                      <el-select v-model="cameraSetting.contType">
                        <el-option
                          v-for="item in contTypeFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="继电器序号" v-if="cameraSetting.contType === 0">
                      <el-select v-model="cameraSetting.alarmIoNum">
                        <el-option
                          v-for="item in alarmIoNumFormatter"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <div v-if="cameraSetting.contType === 1">
                      <el-form-item label="韦根卡发行码">
                        <el-input-number v-model="cameraSetting.wiegandDcode" ></el-input-number>
                      </el-form-item>
                      <el-form-item label="韦根卡号范围最大值">
                        <el-input-number v-model="cameraSetting.wiegMaxCardNo" ></el-input-number>
                      </el-form-item>
                    </div>
                    <el-form-item>
                      <el-button :loading = "setdataLoading" type="primary" @click="cameraSettingParams">保存</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <!-- 安卓人脸 -->
            <!-- <div v-if="rowData.cameraType === 130">
              <AndroidAICamera :id="rowId"></AndroidAICamera>
            </div> -->
            <!-- 畅盈Linux人脸 -->
            <div v-if="rowData.cameraType === 131" v-show="isCatch">
              <LinuxAICamera :id="rowId"></LinuxAICamera>
            </div>
            <!-- 安卓科发人脸 -->
            <!-- <div v-if="rowData.cameraType === 132">
              <AndroidAIKFCamera :id="rowId"></AndroidAIKFCamera>
            </div> -->
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
      <el-dialog title="获取图片" :visible.sync="innerVisible" width="30%">
        <img :src="picSrc" alt="图片">
      </el-dialog>
    </div>
    <el-button type="info" round class="cancel-btn" @click.native="cancelGetImg" v-show="isCancelBtn">取消获取</el-button>
  </div>
</template>
<script>
import { aiCameraTypeFormatter, networkTypeFormatter, inOutFormatter, isBindFormatter, timeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPut, httpPost } from '@/utils/restful'
import { deviceReboot, aKeyOpened, dataReset, editAICameraName, syncState, getAICamera, unBindAICamera, reAIBoot, setAITime, clearAIWhite, focusAIDown, focusAIUp, getAISnap, getAIParams, setAIParams, getAIVer, zoomAIDown, zoomAIUp, setAIpar } from '@/api/url'
import AndroidAICamera from './components/AndroidAICamera'
import AndroidAIKFCamera from './components/AndroidAIKFCamera'
import LinuxAICamera from './components/LinuxAICamera'
import CoilDebugger from './components/CoilDebugger'
import paramSetting from './components/ParamsSetting'
import ParamsAISetting from './components/ParamsAISetting'
import { cameraManageText } from '@/utils/helptext'
import Storage from '@/utils/storage'
import Axios from 'axios'
import Member from './components/member.vue'
export default {
  components: {
    CoilDebugger,
    AndroidAICamera,
    AndroidAIKFCamera,
    LinuxAICamera,
    paramSetting,
    ParamsAISetting,
    Member
  },
  data () {
    return {
      list: null,
      isCatch: false,
      updataLoading: false,
      setdataLoading: false,
      listLoading: true,
      fileLoading: false,
      paramLoading: false,
      isShow: true,
      disabled: true,
      dialogVersionVisible: false,
      dialogEditVisible: false,
      version: '',
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      dialogMoreVisible: false,
      innerVisible: false,
      inOutFormatter: inOutFormatter,
      isBindFormatter: isBindFormatter,
      timeFormatter: timeFormatter,
      networkTypeFormatter: networkTypeFormatter,
      aiCameraTypeFormatter: aiCameraTypeFormatter,
      rowId: undefined,
      // 华安相机设置
      cameraSetting: {
        ledThreshold: 1,
        ledLevel: 1,
        derEn: 1,
        maxGain: 15,
        outputDelay: 1,
        alarmDuration: 1000,
        matchLevel: 2,
        enPushFace: 1,
        contType: 0,
        matchScore: 80,
        outTime: 1,
        contrast: 65,
        alarmIoNum: 1,
        wiegandType: 1,
        wiegMinCardNo: 1,
        wiegCardNo: '',
        wiegandDcode: undefined,
        wiegMaxCardNo: 100000000
      },
      wiegandTypeFormatter: [
        { value: 1, label: 'WG26' },
        { value: 2, label: 'WG34' }
      ],
      derEnFormatter: [
        { value: 0, label: '关' },
        { value: 1, label: '开' }
      ],
      enPushFaceFormatter: [
        { value: 0, label: '不推送' },
        { value: 1, label: '推送' }
      ],
      matchLevelFormatter: [
        { value: 1, label: '低' },
        { value: 2, label: '中' },
        { value: 3, label: '高' }
      ],
      contTypeFormatter: [
        { value: 0, label: '继电器' },
        { value: 1, label: '韦根' }
      ],
      alarmIoNumFormatter: [
        { value: 0, label: 'Out1' },
        { value: 1, label: 'Out2' },
        { value: 2, label: 'Out3' }
      ],
      paramForm: {
        fileName: '',
        key: '',
        value: ''
      },
      picSrc: '',
      rowData: {},
      AndroidAICameraData: null,
      editForm: {
        id: undefined,
        localName: undefined
      },
      isCancelBtn: false,
      localName: '',
      memberId: undefined
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    if (!Storage.get('cameraManageShowHelp')) {
      this.$nextTick(() => {
        this.$alert(cameraManageText, '帮助说明', {
          confirmButtonText: '知道了，不再提醒',
          // showClose: false,
          center: true,
          roundButton: true,
          callback: action => {
            if (action === 'confirm') {
              Storage.set('cameraManageShowHelp', 1)
            }
          }
        })
      })
    }
  },
  methods: {
    // 查看设备人脸
    getMembers (row, column, cell, event) {
      this.memberId = row.id
      this.localName = row.localName
    },
    fetchData () {
      this.listLoading = true
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAICamera, this.listQuery).then(res => {
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
    // 状态修改
    adaptStatus (id) {
      this.$confirm('当前操作会清除相机内所有注册人员，然后重新同步？', '提示', {
        type: 'warning'
      })
        .then(() => {
          let obj = {
            'aiTokenId': id,
            'departmentId': parseInt(this.$store.getters.departmentId)
          }
          httpPut(syncState, obj).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 解绑
    handleDelete (id) {
      this.$confirm('确认解除绑定吗？', '提示', {})
        .then(() => {
          httpPut(unBindAICamera + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
            this.fetchData()
          }).catch(() => {})
        }).catch(() => {})
    },
    // 恢复出厂设置
    dataReset (id) {
      this.$confirm('是否要启动一键开闸？', '提示', {})
        .then(() => {
          httpGet(dataReset + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                duration: 3000,
                type: 'success',
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 一键开闸
    openGate (id) {
      this.$confirm('是否要启动一键开闸？', '提示', {})
        .then(() => {
          httpGet(aKeyOpened + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                duration: 3000,
                type: 'success',
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 重启设备
    reBootDevice (id) {
      this.$confirm('是否重启设备？', '提示', {})
        .then(() => {
          httpGet(deviceReboot + '/' + id + '/' + this.$store.getters.departmentId)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                duration: 3000,
                message: res.message
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    // 重启TCP
    reBootCamera (id) {
      this.$confirm('是否重启TCP？', '提示', {})
        .then(() => {
          httpPost(reAIBoot + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 校时
    setCameraTime (id) {
      this.$confirm('是否对相机进行时间校对？', '提示', {})
        .then(() => {
          httpPost(setAITime + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 清空白名单
    clearCameraWhite (id) {
      this.$confirm('是否对清空相机里的所有白名单？', '提示', {})
        .then(() => {
          httpPost(clearAIWhite + id).then(res => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {})
        }).catch(() => {})
    },
    // 获取相机版本
    getCameraVer (id) {
      httpPost(getAIVer + id).then(res => {
        this.dialogVersionVisible = true
        this.version = JSON.stringify(res.data, null, 4)
      }).catch(() => {})
    },
    // ---------------------- 更多操作 --------------------\\
    tabClick (tab) {
      this.disabled = true
      if (tab.label === '参数设置') {
        this.paramForm = {
          fileName: '',
          key: '',
          value: ''
        }
      } else if (tab.label === '相机设置') {
        // 华安人脸
        if (this.rowData.cameraType === 129) {
          this.getCameraSetting()
        }
        this.isCatch = true
      } else if (tab.label === '线圈调试') {
        const loading = this.$loading({
          lock: true,
          text: '获取中....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        httpPost(getAISnap + this.rowId)
          .then(res => {
            this.picSrc = 'data:image/jpg;base64,' + res.data
            loading.close()
          }).catch(() => {
            loading.close()
          })
      }
    },
    handleMore (row) {
      this.rowData = row
      if (row.cameraType === (130 || 132)) {
        this.isShow = false
      } else {
        this.isShow = true
      }
      this.rowId = row.id
      this.dialogMoreVisible = true
    },
    // 向上调焦
    cameraUpFocus (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(focusAIUp, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 向下调焦
    cameraDownFocus (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(focusAIDown, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 减小倍数
    cameraZoomDown (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(zoomAIDown, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    // 增加倍数
    cameraZoomUp (value) {
      this.disabled = true
      let data = {
        id: this.rowId,
        level: value
      }
      httpPost(zoomAIUp, data)
        .then(res => {
          this.$message.success(res.message)
          this.disabled = false
        }).catch(() => {})
    },
    getPicture (row) {
      this.rowId = row.id
      this.getPic()
    },
    // 获取图片
    getPic () {
      const loading = this.$loading({
        lock: true,
        text: '获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let showBtnTime = setTimeout(() => { this.isCancelBtn = true }, 1000)
      httpPost(getAISnap + this.rowId)
        .then(res => {
          clearTimeout(showBtnTime)
          this.picSrc = 'data:image/jpg;base64,' + res.data
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
          this.innerVisible = true
        }).catch(() => {
          clearTimeout(showBtnTime)
          loading.close()
          if (this.isCancelBtn) this.isCancelBtn = false
        })
    },
    cancelGetImg () {
      const CancelToken = Axios.CancelToken
      this.$store.state.source.cancel && this.$store.state.source.cancel()
      this.$store.state.source = CancelToken.source()
    },
    // 相机设置
    getCameraSetting () {
      httpGet(getAIParams + this.rowId)
        .then(res => {
          if (res.data !== null) {
            this.cameraSetting = Object.assign({}, res.data)
          }
        }).catch(() => {})
    },
    cameraSettingParams () {
      this.setdataLoading = true
      let data = Object.assign({id: this.rowId}, this.cameraSetting)
      httpPut(setAIParams, data)
        .then(res => {
          this.setdataLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.setdataLoading = false
        })
    },
    // 参数设置
    paramSetting () {
      this.paramLoading = true
      this.paramForm = Object.assign(this.paramForm, {aiTokenId: this.rowId})
      httpPost(setAIpar, this.paramForm)
        .then(res => {
          this.paramLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.paramLoading = false
        })
    },
    handleEdit (row) {
      this.editForm = {
        id: row.id,
        localName: row.localName
      }
      this.dialogEditVisible = true
    },
    createEdit () {
      this.updataLoading = true
      httpPut(editAICameraName, this.editForm)
        .then(res => {
          this.fetchData()
          this.dialogEditVisible = false
          setTimeout(() => { this.updataLoading = false }, 300)
          this.$message.success(res.message)
        }).catch(() => { this.updataLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
  img{
    width: 100%;
  }
  .el-select{
    width: 180px;
  }
  .cancel-btn {
    position: fixed;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
  }
</style>
