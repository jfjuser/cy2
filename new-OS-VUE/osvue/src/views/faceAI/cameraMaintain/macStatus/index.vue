<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.departmentName" clearable placeholder="部门名称"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.tcpVersion" clearable placeholder="相机版本"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model.trim="listQuery.mac" clearable placeholder="MAC"></el-input>
        <el-select clearable v-model="listQuery.isBind"  class="filter-item" placeholder="绑定状态">
          <el-option v-for="item in isBindType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.status"  class="filter-item" placeholder="状态">
          <el-option v-for="item in statusType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-select clearable v-model="listQuery.cameraType"  class="filter-item" placeholder="相机类型">
          <el-option v-for="item in cameraForArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button class="filter-item search" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="handleRefresh" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item update" type="primary" v-has="['升级相机']" :loading = "upgradeLoading" @click="handleUpgrade" :disabled="disabled" icon="el-icon-upload">升级相机</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item controll" type="primary" @click="controlOnTime" :disabled="disabled" icon="el-icon-date">实时控制</el-button>
        <el-button class="filter-item set" type="primary" @click="setParams" :disabled="disabled" icon="el-icon-date">参数设置</el-button>
        <el-button class="filter-item getfile" type="primary" @click="getFiles" :disabled="disabled" icon="el-icon-date">获取文件</el-button>
      </div>
      <el-dialog title="参数设置" :visible.sync="paramsVisible" width="35%">
        <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="right" label-width="120px">
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="form.fileName"></el-input>
          </el-form-item>
          <el-form-item label="参数名称" prop="key">
            <el-input v-model="form.key"></el-input>
          </el-form-item>
          <el-form-item label="参数值" prop="value">
            <el-input v-model="form.value"></el-input>
          </el-form-item>
        </el-form>
       <div slot="footer" class="dialog-footer">
          <el-button @click="paramsVisible = false">取消</el-button>
          <el-button type="primary" :loading="paramsLoading" @click="saveParamsFile">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="实时控制" :visible.sync="controlVisible" width="35%">
        <el-form  :rules="timeRules"  :model="timeForm" autoComplete = "on" label-position="right" label-width="150px">
           <el-form-item label="命令" prop="setParamId">
            <el-select v-model="timeForm.setParamId" style="width:80%">
              <el-option v-for="item in orderArr" :key="item.id" :label="item.remake" :value="item.id">
                <span style="float: left; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                <span style="float: right">{{ item.remake }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="controlVisible = false">取消</el-button>
          <el-button type="primary" :loading="timeLoading" @click="saveControlInfo">保存</el-button>
        </div>
      </el-dialog>
      <!-- 获取文件 -->
      <el-dialog title="获取文件" :visible.sync="isGetFile" width="55%">
        <el-form :rules="fileRules" ref="fileData" :model="fileform" autoCompete = "on" label-position="right" label-width="120px">
          <el-form-item label="文件路径" prop="storePath">
            <el-input v-model="fileform.storePath"></el-input>
          </el-form-item>
          <el-form-item label="文件名称" prop="fileName">
            <el-input v-model="fileform.fileName"></el-input>
          </el-form-item>
        </el-form>
        <div class="btnDiv">
          <el-button @click="isGetFile = false">取消</el-button>
          <el-button type="primary" :loading="loading1" @click="queGet">确认</el-button>
        </div>
        <el-button class="filter-item" type="primary" @click="getFiles" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh1"  icon="el-icon-download" v-has="['导出1']" >导出</el-button>
        <el-button class="filter-item" type="danger"  :disabled="disabled1" @click="deleteFiles" :loading="deleteLoading" icon="el-icon-close">删除所选</el-button>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="filesData"  @selection-change="handleSelectionChange1"  element-loading-text="加载中..." border fit highlight-current-row>
          <el-table-column type="selection" width="40" fixed="left"></el-table-column>
          <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
          <el-table-column label="文件名称" align="center" prop="fileName"></el-table-column>
          <el-table-column label="创建时间" align="center" prop="createAt">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createAt)}}
            </template>
          </el-table-column>
          <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
          <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="120">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleDownLoad(scope.row)" size="mini">下载文件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  @selection-change="handleSelectionChange" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="部门名称" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="通道名称" align="center" prop="localName"></el-table-column>
        <el-table-column label="MAC" align="center" prop="mac"></el-table-column>
        <el-table-column label="相机类型" align="center" prop="cameraType">
          <template slot-scope="scope">
            {{aiCameraTypeFormatter(scope.row.cameraType)}}
          </template>
        </el-table-column>
        <el-table-column label="相机版本" align="center" prop="tcpVersion"></el-table-column>
        <el-table-column label="绑定状态" align="center" prop="isBind">
          <template slot-scope="scope">
            {{ isBindFormatter(scope.row.isBind) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" v-if="scope.row.status === 0">离线</el-button>
            <span v-if="scope.row.status === 1">在线</span>
          </template>
        </el-table-column>
        <el-table-column  label="离线备注" align="center" prop="loginAt">
          <template slot-scope="scope">
              <span v-if="scope.row.status === 0">{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="UDP上次链接时间" align="center" prop="timeAt">
          <template slot-scope="scope">
              {{ timeFormatter(scope.row.timeAt) }}
          </template>
        </el-table-column>
        <el-table-column label="最近登录时间" align="center" prop="loginAt">
          <template slot-scope="scope">
              {{ timeFormatter(scope.row.loginAt) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
            <!-- @click.native.prevent="handleRemoveBind(scope.row)"  -->
              <div style="margin-bottom:10px">
                <el-button type="warning" size="mini" @click.native.prevent="forcedUnbundling(scope.row)" v-has="['强制解绑']">强制解绑</el-button>
              </div>
              <div v-show="scope.row.cameraType === 130" style="margin-bottom:10px">
                <el-button type="warning" size="mini" @click.native.prevent="updateCamera(scope.row)">升级相机</el-button>
              </div>
              <el-button type="warning" v-has="['获取快照']"  style="margin-bottom:10px"  @click="getPicture(scope.row)" size="mini">获取快照</el-button>
              <!-- <div v-if="((scope.row.isBind === 0) && (scope.row.cameraType !== 130))">--</div> -->
              <div v-if="scope.row.isBind === 1"><el-button type="warning" @click.native.prevent="handleRemoveBind(scope.row)" size="mini">解除绑定</el-button></div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <el-dialog title="升级相机" :visible.sync="dialogFileVisible" width="35%">
        <el-form  ref="upgradeFile" :rules="upgradeFileFormRules"  :model="upgradeFileForm" autoComplete = "on" label-position="right" label-width="150px">
          <el-form-item label="文件名称" prop="cameraFileId">
            <el-select v-model="upgradeFileForm.cameraFileId" style="width:80%">
              <el-option v-for="item in fileList"  :key="item.id" :label="item.fileName" :value="item.id">
                <span style="float: left">{{ item.fileName }}</span>
                <span style="float: left;margin: 0 10px">{{ item.remarks }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.version }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFileVisible = false">取消</el-button>
          <el-button type="primary" :loading="upgradeFileLoading" @click="saveUpgradeFile">保存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="获取图片" :visible.sync="innerVisible" width="48%">
        <div style="text-align:center">
          <img :src="picSrc" alt="图片" style="max-width:45vw">
        </div>
      </el-dialog>
    </div>
    <el-dialog
      :visible.sync="updateCameraloading"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="loadingdialog text-center"
      top="30vh"
      width="30%">
      <div style="font-size:30px;color:#409EFF" v-show="!showClose"><i class="el-icon-loading"></i></div>
      <div style="font-size:25px;color:#409EFF;font-weight: bold" @click="onmessageWebSocket">
        <span v-if="showClose">升级完成</span>
        <span v-else>{{`升级中...(${onprogress.progress})`}}</span>
      </div>
      <el-button type="info" size="small" round style="position: absolute;top:0;right:0" @click="closeProgress" v-show="showClose">关闭</el-button>
      <div style="font-size:15px;color:#409EFF;">
        <transition-group name="el-fade-in" tag="div">
          <p style="margin:10px 0;" v-for="(item, index) in onprogress.msg" :key="item.id?item.id:index">{{item || ''}}</p>
        </transition-group>
      </div>
    </el-dialog>
    <el-button type="info" round class="cancel-btn" @click.native="cancelGetImg" v-show="isCancelBtn">取消获取</el-button>
  </div>
</template>

<script>
import { statusType, isBindType } from '@/utils/selectAble.js'
import { isBindFormatter, timeFormatter, aiCameraTypeFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpPut, httpExport, httpDelete } from '@/utils/restful' // checkAILinuxCamera
import { coerceUnbindCamera, cloudAICamera, getAISnap, deleteAICameraFile, downAIFile, getAndroidAIFiles, getLinuxAIFiles, getFilesList, AIcameraParamsList, updateCamera, AIsentCommandList, getOrderList, getAIFile, UpgradeAIHttpCamera, unBindAICamera } from '@/api/url'
import Axios from 'axios'
import { updateCameraWebSocket } from '@/api/websocket'
export default {
  data () {
    return {
      list: null,
      loading: false,
      listLoading: true,
      upgradeLoading: false,
      upgradeFileLoading: false,
      deleteLoading: false,
      innerVisible: false,
      dialogFileVisible: false,
      controlVisible: false,
      timeLoading: false,
      disabled: true,
      disabled1: true,
      diaVisible: false,
      changeLoading: false,
      paramsVisible: false,
      paramsLoading: false,
      isGetFile: false,
      loading1: false,
      localName: undefined,
      picSrc: '',
      contList: [],
      orderArr: [],
      cameraForArr: [
        {id: 129, name: '华安人脸'},
        {id: 130, name: '安卓人脸'},
        {id: 131, name: 'X系列1.0'},
        {id: 132, name: '安卓科发人脸'},
        {id: 133, name: 'X系列2.0'},
        {id: 134, name: 'Linux小门禁'},
        {id: 135, name: '测温人脸'},
        {id: 136, name: 'X28-T相机'}
      ],
      listQuery: {
        offset: 1,
        limit: 10,
        mac: undefined,
        departmentName: undefined,
        status: undefined,
        tcpVersion: undefined,
        isBind: undefined,
        cameraType: undefined
      },
      tableData: [],
      localList: [],
      selectArrayId: [],
      selectArrayId1: [],
      saveArr: [],
      arr: [],
      filesData: undefined,
      cameraNameArr: undefined,
      total: null,
      useMac: undefined,
      useId: undefined,
      statusType: statusType,
      isBindType: isBindType,
      isBindFormatter: isBindFormatter,
      timeFormatter: timeFormatter,
      aiCameraTypeFormatter: aiCameraTypeFormatter,
      fileList: [],
      fileform: {
        storePath: undefined,
        fileName: undefined
      },
      form: {
        aiTokenIds: [],
        fileName: '',
        key: '',
        value: ''
      },
      formRules: {
        fileName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        key: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        value: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      upgradeFileForm: {
        cameraFileId: undefined,
        tokenIds: [],
        // tastAt: timeFormatter(new Date().getTime())
        taskAt: new Date()
      },
      timeForm: {
        aiTokenIds: [],
        setParamId: undefined
      },
      timeRules: {
        aiTokenIds: [
          {required: true, trigger: 'blur', message: '名称不可为空'}
        ],
        setParamId: [
          {required: true, trigger: 'blur', message: '命令不可为空'}
        ]
      },
      fileRules: {
        storePath: [
          {required: true, trigger: 'blur', message: '文件路径不可为空'}
        ],
        fileName: [
          {required: true, trigger: 'blur', message: '文件名称不可为空'}
        ]
      },
      upgradeFileFormRules: {
        cameraFileId: [
          {required: true, trigger: 'change', message: '文件不可为空'}
        ],
        order: [
          {required: true, trigger: 'blur', message: '升级命令不可为空'}
        ],
        storePath: [
          {required: true, trigger: 'blur', message: '存放路径不可为空'}
        ]
      },
      isCancelBtn: false,
      ws: null,
      onprogress: {
        total: undefined,
        bytesDownloaded: 0,
        progress: '0.0%',
        msg: []
      },
      updateCameraloading: false,
      showClose: false,
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: 'MAC',
          key: 'mac',
          type: 'text'
        },
        {
          title: '相机类型',
          key: 'cameraType',
          type: 'text'
        },
        {
          title: '相机版本',
          key: 'tcpVersion',
          type: 'text'
        },
        {
          title: '绑定状态',
          key: 'isBind',
          type: 'text'
        },
        {
          title: '状态',
          key: 'status',
          type: 'text'
        },
        {
          title: '离线备注',
          key: 'remark',
          type: 'text'
        },
        {
          title: 'UDP上次链接时间',
          key: 'timeAt',
          type: 'text'
        },
        {
          title: '最近登录时间',
          key: 'loginAt',
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
      ],
      jsonData1: [
        {
          title: '通道名称',
          key: 'localName',
          type: 'text'
        },
        {
          title: '文件名称',
          key: 'fileName',
          type: 'text'
        },
        {
          title: '创建时间',
          key: 'createAt',
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
  created () {
    this.fetchData()
  },
  methods: {
    // 强制解绑
    forcedUnbundling (row) {
      const h = this.$createElement
      let message = ['强制解绑后相机将会失去绑定']
      let info = {
        h,
        message,
        firstconfirmButtonText: '确定',
        firstcancelButtonText: '取消',
        secondmessgae: '您已了解解绑后果，确定还要继续解绑吗',
        secondconfirmButtonText: '我再想想',
        secondcancelButtonText: '确定解绑'
      }
      this.MessageBox(info).then(() => {
      }).catch(() => {
        httpPut(coerceUnbindCamera + row.mac).then(res => {
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: '强制解绑成功',
              duration: 4 * 1000
            })
          } else {
            this.$message({
              type: 'error',
              message: '强制解绑失败',
              duration: 4 * 1000
            })
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err,
            duration: 4 * 1000
          })
        })
      })
    },
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.cameraType = this.aiCameraTypeFormatter(item.cameraType)
        item.isBind = this.isBindFormatter(item.isBind)
        item.remark = parseInt(item.status) === 0 ? item.remark : ''
        item.status = parseInt(item.status) === 0 ? '离线' : (parseInt(item.status) === 1 ? '在线' : '')
        item.timeAt = this.timeFormatter(item.timeAt)
        item.loginAt = this.timeFormatter(item.loginAt)
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleh1 () {
      let obj = JSON.parse(JSON.stringify(this.filesData))
      obj.forEach((item, index) => {
        item.createAt = this.timeFormatter(item.createAt)
      })
      this.table2excel(this.jsonData1, obj, 'excel.xlsx')
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        mac: undefined,
        departmentName: undefined,
        tcpVersion: undefined,
        isBind: undefined
      }
      this.fetchData()
    },
    handleClick () {
      console.log(this.upgradeFileForm.type)
    },
    // 参数保存请求
    saveParamsFile () {
      httpPost(AIcameraParamsList,
        Object.assign(this.form, {aiTokenIds: this.selectArrayId}))
        .then((res) => {
          console.log(res)
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          this.paramsVisible = false
        }).catch(() => {})
    },
    // 保存 实时控制
    saveControlInfo () {
      httpPost(AIsentCommandList, Object.assign(this.timeForm, {aiTokenIds: this.selectArrayId})).then((res) => {
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
        this.controlVisible = false
      })
        .catch((res) => {})
    },
    // 参数设置
    setParams () {
      this.paramsVisible = true
    },
    deleteFiles () {
      this.$confirm('确认删除吗？', '提示', {})
        .then(() => {
          this.deleteLoading = true
          httpDelete(deleteAICameraFile, {ids: this.selectArrayId1}).then(res => {
            this.deleteLoading = false
            this.getFiles()
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
    queGet () {
      this.$refs.fileData.validate((valid) => {
        if (valid) {
          this.loading = true
          this.fileform = Object.assign(this.fileform, {tokenId: this.useId})
          let url
          if (this.type === 130 || this.type === 132) {
            url = getAndroidAIFiles
          } else {
            url = getLinuxAIFiles
          }
          httpPost(url, this.fileform).then((res) => {
            this.loading1 = false
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading1 = false
          })
        }
      })
    },
    // -------------------下载相机文件-----------------\\
    handleDownLoad (row) {
      this.$confirm('是否下载相机文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpExport(downAIFile + row.id).then(() => {}).catch((err) => {
          this.$message({
            message: err.message,
            duration: 3000,
            type: 'warning'
          })
        })
      }).catch(() => {})
    },
    // 获取文件
    getFiles () {
      if (this.selectArrayId.length > 1) {
        this.$message({
          type: 'warning',
          message: '不可多选操作',
          duration: 4 * 1000
        })
      } else {
        this.isGetFile = true
        httpGet(getFilesList + '/' + this.useMac).then((res) => {
          if (res.data.rows === null) {
            this.filesData = []
          } else {
            this.filesData = res.data.rows
          }
        })
      }
    },
    // 实时控制
    controlOnTime () {
      this.controlVisible = true
      this.timeForm.setParamId = undefined
      console.log(this.timeForm.setParamId)
      httpGet(getOrderList).then((res) => { // 获取全部命令
        if (res.data === null) {
          this.orderArr = []
        } else {
          this.orderArr = res
        }
      }).catch(() => {})
    },
    fetchData () {
      let self = this
      httpGet(cloudAICamera, this.listQuery).then(res => {
        if (res.data === null) {
          self.tableData = []
          self.total = 0
          self.listLoading = false
        } else {
          self.tableData = res.data.rows
          self.total = res.data.total
          self.listLoading = false
        }
        // console.log(self.tableData)
      }).catch(() => {
        self.listLoading = false
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 安卓人脸升级相机
    updateCamera (row) {
      let aiTokenId = row.id
      this.$confirm('是否升级该相机？', '升级相机', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        httpPost(updateCamera + '/' + aiTokenId)
          .then((res) => {
            console.log('======================', res)

            // this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.updateCameraWS(row)
          }).catch(() => { this.onCloseWebsocket() })
      }).catch(() => {})
    },
    handleRemoveBind (row) {
      this.$confirm('是否对该相机进行解绑？', '解绑相机', {
        confirmButtonText: '确定解绑',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        httpPut(unBindAICamera + row.id)
          .then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {})
      }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.arr = val
      console.log(this.arr)
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.id)
        this.useMac = item.mac
        this.useId = item.id
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    handleSelectionChange1 (val) {
      this.selectArrayId1 = []
      val.map(item => {
        this.selectArrayId1.push(item.id)
      })
      if (this.selectArrayId1.length !== 0) {
        this.disabled1 = false
      } else {
        this.disabled1 = true
      }
    },
    cameraSelect (val) {
      let type
      this.fileList.forEach(item => {
        if (item.id === val) {
          type = item.cameraType
        }
        if (type === 129) this.upgradeFileForm.storePath = '/data_fs/cyexe'
        if (type !== 129) this.upgradeFileForm.storePath = '/mnt/mtd/nsd/program/lib/'
      })
    },
    handleUpgrade () {
      // if (this.arr.length > 1) {
      // this.$message.warning('批量操作时相机类型必须一致哦！')
      httpGet(getAIFile + '/' + this.arr[0].cameraType)
        .then(res => {
          if (res.data === null || res.data.rows.length === 0) {
            this.fileList = []
            this.$message({
              message: '暂无可升级文件！',
              type: 'error',
              duration: 3000
            })
          } else {
            this.fileList = res.data.rows
            this.dialogFileVisible = true
            console.log(this.fileList)
            this.$nextTick(() => {
              this.$refs.upgradeFile.resetFields()
            })
          }
        }).catch(() => {})
      // }
    },
    saveUpgradeFile () {
      this.upgradeFileLoading = true
      httpPost(UpgradeAIHttpCamera, Object.assign(this.upgradeFileForm, {tokenIds: this.selectArrayId})).then(res => {
        this.upgradeFileLoading = false
        this.dialogFileVisible = false
        this.$message.success(res.message)
      }).catch(() => {
        this.upgradeFileLoading = false
      })
    },
    // 显示进度
    updateCameraWS (row) {
      // 检查浏览器是否支持websocket
      if (window.WebSocket) {
        if (this.ws !== null) this.ws.close()
        this.ws = new WebSocket(updateCameraWebSocket + row.mac)
        // 连接websocket
        this.ws.onopen = this.initWebSocket
        this.ws.onmessage = this.onmessageWebSocket
        this.ws.onerror = this.onerrorWebSocket
      } else {
        this.$message({
          message: '您的浏览器暂时不支持查看升级进度，可尝试升级或换浏览器！',
          type: 'error',
          duration: 3000
        })
      }
    },
    initWebSocket () {
      console.log('ws连接成功！')
      this.updateCameraloading = true
    },
    onmessageWebSocket (mess) {
      // {"msg":"全量包下载中，请稍后...","total":50564883,"bytesDownloaded":7912,"state":1}
      // {"msg":"全量包下载失败",errorInfo:timeout,"state":-1}
      // {"msg":"apk安装广播已发送，安装成功","state":2}
      let data = JSON.parse(mess.data)

      if (data) {
        if (data.msg.indexOf('相机离线,操作失败') > -1) {
          this.onCloseWebsocket()
          return
        }
        if (data.errorInfo || data.state + '' === '-1') {
          this.$message({
            message: data.msg,
            type: 'error',
            duration: 4 * 1000
          })
          this.onCloseWebsocket()
          return
        }
        // if (data.state + '' === '2' || data.msg.indexOf('安装成功') > -1) {
        //   this.$message({
        //     message: '升级完成',
        //     type: 'success',
        //     duration: 4 * 1000
        //   })
        //   this.onCloseWebsocket()
        //   this.fetchData()
        //   return
        // }
        // console.log('信息接受: ', data)
        if (data.msg && data.msg !== '' && data.msg.indexOf('全量包下载中，请稍后...') === -1) {
          this.onprogress.msg.push(data.msg)
        }
        if (data.state + '' === '2') {
          if (!this.showClose) this.showClose = true
        }
        let total = this.onprogress.total // 总量
        let bytesDownloaded = this.onprogress.bytesDownloaded // 分量
        let progress = this.onprogress.progress // 进度

        total = data.total ? (data.total - 0) : total
        bytesDownloaded = data.bytesDownloaded ? (data.bytesDownloaded - 0) : bytesDownloaded
        progress = (bytesDownloaded / total * 100).toFixed(1)
        if (total) this.onprogress.total = total
        if (bytesDownloaded) this.onprogress.bytesDownloaded = bytesDownloaded
        if (progress && !isNaN(progress)) this.onprogress.progress = progress + '%'
        // console.log(this.onprogress.progress, 'onprogress')
      }
    },
    // 连接失败
    onerrorWebSocket () {
      this.$message({
        message: '升级失败, 请稍后重试',
        type: 'error',
        duration: 4 * 1000
      })
    },
    // 关闭websocket
    onCloseWebsocket () {
      if (this.ws) {
        this.ws.close()
        this.updateCameraloading = false
        this.clearProgress()
        console.log('ws关闭连接！')
      }
    },
    closeProgress () {
      this.onCloseWebsocket()
      this.fetchData()
    },
    clearProgress () {
      this.onprogress.total = undefined
      this.onprogress.bytesDownloaded = 0
      this.onprogress.progress = '0.0%'
      this.onprogress.msg = []
      this.showClose = false
    }
  },
  beforeDestroy () {
    this.onCloseWebsocket()
  }
}
</script>
<style lang="scss" scoped>
.btnDiv{
  display: flex;
  justify-content: flex-end;
}
.cancel-btn {
  position: fixed;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
}
.loadingdialog {
  background-color: rgba(0, 0, 0, .5);
}
.app-container .loadingdialog /deep/ .el-dialog {
  background: transparent;
  box-shadow: none;
}
</style>
