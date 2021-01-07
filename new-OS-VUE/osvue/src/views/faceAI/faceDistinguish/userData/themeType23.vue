
<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" clearable style="width: 150px;" v-model="listQuery.leader" :placeholder="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '姓名' : (themeType === 4? '账户名称' : '班组名称')))"></el-input>
        <el-input class="filter-item" style="width: 150px;" v-model="listQuery.phone" placeholder="输入手机号"></el-input>
        <el-input class="filter-item" style="width: 150px;" v-has="['有为学校']" v-model="listQuery.roomNum" placeholder="输入班级"></el-input>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="primary" v-has="['添加']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <span  style="margin-left:10px;margin-right:10px" v-has="['批量添加通道权限']">
        <el-button class="filter-item" type="primary" :loading = "deleteLoading" @click="allquan2" :disabled="disabled&&tableData.length==selectArrayId.length" v-if="tableData.length == selectArrayId.length" >批量添加通道权限</el-button>
        <el-button class="filter-item" type="primary" :loading = "deleteLoading" @click="allquan22" :disabled="disabled&&tableData.length!=selectArrayId.length" v-if="tableData.length!=selectArrayId.length" >批量添加通道权限</el-button>
        </span>
        <el-button class="filter-item" type="danger"  v-has="['删除1']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain v-has="['删除所有1']" :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
      </div>
      <el-table  stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="登录账号" align="center" prop="loginName"></el-table-column>
        <el-table-column :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '姓名' : (themeType === 4? '账户名称' : '班组名称')))"  align="center" prop="leader"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
         <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            <template v-if="scope.row.sex === 1">男</template>
            <template v-else>女</template>
          </template>
        </el-table-column>
         <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="学校" align="center" prop="school">
        </el-table-column>
        <el-table-column :label="themeType === 2 ? '楼室' : '班级'" align="center" prop="addr"></el-table-column>
        <el-table-column label="审核方式" align="center" prop="isCheck">
          <template slot-scope="scope">
            {{checkFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : (themeType === 4? '成员人数' : '非访客人数')))" align="center" prop="userNum"></el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" label="访客人数" align="center" prop="visitorNum"></el-table-column>
        <!-- 学校模式中的特殊情况 ---------------------- 需此处不显示 -->
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300" v-if = "isShowColumnFormatter(['编辑', '修改密码', '通道权限'])">
          <template slot-scope="scope">
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button v-has="['授权审核']" v-if="scope.row.isLogin === 0" type="primary" @click.native.prevent="handleCheck(scope.row)" size="mini">授权审核</el-button>
            <el-button v-has="['修改密码']" type="primary" @click.native.prevent="handlePassword(scope.row)" size="mini">修改密码</el-button>
            <el-button v-has="['通道权限']" style="margin-top:0.5rem" type="primary" @click.native.prevent="handlePassRole(scope.row)" size="mini">通道权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '姓名' : (themeType === 4? '账户名称' : '班组名称')))" prop="leader">
            <el-input v-model="form2.leader" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="性别" required>
            <el-radio-group v-model="form.sex">
              <el-radio :label = 1>男</el-radio>
              <el-radio :label = 2>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="dialogStatus === 'create'">
            <el-form-item label="通道名称" prop="aiTokenIds">
              <el-select v-model="form.aiTokenIds" multiple >
                <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="审核方式" prop="isCheck" >
            <el-select v-model="form.isCheck">
              <el-option v-for="item in checkType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input type="tel" v-model="form.phone" placeholder="请输入手机号"></el-input>
            <!-- <span v-if="dialogStatus === 'create'" style="font-size: 14px; color: red">备注：手机号为人脸智能识别小程序的登录账号！</span> -->
          </el-form-item>
          <el-form-item :label="themeType === 2 ? '楼室' : '班级'" v-if="form.add !== null" prop="addr">
            <el-input v-model="form.addr" placeholder="请输入用户地址"></el-input>
          </el-form-item>
          <el-form-item v-if="!addrInput" :label=" themeType === 2 ? '楼室' : '所属'" prop="floorNum">
            <el-select  v-if="!isShowColumnFormatter(['有为学校'])" v-model="form.floorNum" style="width:100px;" @change="showFloor">
              <el-option v-for="item in unitArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '单元' : ''}}
            <!-- 第<el-input style="width:80px;" v-model="form.floorNum"></el-input>单元 -->
             <el-select v-model="floor" style="width:100px;margin-left: 10px" @change="getRoom">
              <el-option v-for="item in floorArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '层' : '年级'}}
            <!-- <span style="padding-left:15px">房号：</span> -->
            <el-select v-model="form.roomNum" style="width:100px;margin-left: 10px">
              <el-option v-for="item in roomArr" :key="item" :value="item"></el-option>
            </el-select> {{themeType === 2 ? '号房' : '班级'}}
            <!-- <el-input style="width:120px;" v-model="form.roomNum"></el-input> -->
            <div v-if="!isShowColumnFormatter(['有为学校'])" style="font-size: 14px; color: #ccc">备注：可前往【小区/学校管理】创建</div>
          </el-form-item>
          <!-- 学校模式中的特殊情况 ---------------------- 需此处不显示 -->
          <el-form-item  v-if="!isShowColumnFormatter(['有为学校'])" :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : (themeType === 4? '成员人数' : '非访客人数')))" prop="userNum">
            <el-input type="number" min="1" v-model="form.userNum" placeholder="请输入成员人数"></el-input>
          </el-form-item>
          <!-- 学校模式中的特殊情况 ---------------------- 需此处不显示 -->
          <el-form-item  v-if="!isShowColumnFormatter(['有为学校'])" label="访问人数" prop="visitorNum">
            <el-input type="number" min="1" v-model="form.visitorNum" placeholder="请输入访问人数"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button :loading="createLoading" type="primary" v-if="dialogStatus === 'create'" @click="createData">保存</el-button>
          <el-button :loading="updateLoading" type="primary" v-if="dialogStatus === 'update'" @click="updateData">保存</el-button>
        </div>
    </el-dialog>
     <el-dialog title="授权审核" :visible.sync="givePower">
      <el-form :rules="rootRules" ref="rootform" :model="root" autoComplete="on" label-position="right" label-width="150px">
         <el-form-item label="通道名称" prop="aiTokenIds">
            <el-select v-model="root.aiTokenIds" multiple >
              <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核结果" prop="isLogin">
            <el-radio-group v-model="root.isLogin" @change="findValue">
              <el-radio label="0">审核不通过</el-radio>
              <el-radio label="1">审核通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="失败原因" prop="cause" v-if="errVisible">
            <el-input v-model="root.cause" placeholder="请填写审核失败的原因"></el-input>
          </el-form-item>
        <el-form-item label="时段设置" v-if="state" prop="timeLimits">
          <el-select v-model="root.timeLimits" multiple>
            <el-option v-for="item in timeList" :key="item.num" :label="item.name" :value="item.num"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
       <div slot="footer" class="dialog-footer">
          <el-button @click="givePower = false">取消</el-button>
          <el-button type="primary" @click="postData">保存</el-button>
        </div>
    </el-dialog>
    <!-- 通道权限 -->
    <el-dialog title="通道权限" :visible.sync="dialogPermissionVisible" width="40%">
      <div style="margin-bottom:10px">
      <el-button @click="selectAll" type="primary">点击全选</el-button>
      <el-button @click="deselectAll" type="primary">取消全选</el-button>
      </div>
          <template>
            <el-checkbox-group v-model="checked" >
              <el-checkbox v-for="item in localList"  :label="item.localId" :key="item.localId">{{item.localName}}</el-checkbox>
            </el-checkbox-group>
          </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPermissionVisible = false">取消</el-button>
          <el-button  type="primary" @click="permData">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog title="导入" :visible.sync="dialogImportVisible" width="30%">
        <el-form ref="uploadData" :model="upload" :rules="uploadRules" autoCompete = "on" label-position="right" label-width="150px" >
          <el-form-item label="通道名称" prop="aiTokenIds ">
            <el-select v-model="upload.aiTokenIds " multiple style="width:80%;">
              <el-option v-for="item in localList" clearable :key="item.id" :label="item.localName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件名称" required >
            <upload-file ref="upload" :name="'file'"  @hideUploadVisible = "hideUploadVisible" :fileData="upload" :action="action" :accept="accept"></upload-file>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogImportVisible = false">取消</el-button>
          <el-button type="primary" @click="importData">保存</el-button>
        </div>
    </el-dialog>
    <el-dialog title="通道权限" :visible.sync="dialogPermissionVisible1" width="40%">
      <template>
        <!-- <el-checkbox-group v-model="checked11" > -->
          <el-radio v-for="item in localList1" v-model="checked11"  :label="item.id" :key="item.id">{{item.localName}}</el-radio>
        <!-- </el-checkbox-group> -->
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible1 = false">取消</el-button>
        <el-button  type="primary" @click="permData1">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="通道权限" :visible.sync="dialogPermissionVisible2" width="40%">
      <template>
        <el-checkbox-group v-model="checked22" >
          <el-checkbox v-for="item1 in localList2"   :label="item1.id" :key="item1.id">{{item1.localName}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible2 = false">取消</el-button>
        <el-button  type="primary" @click="permData2">保存</el-button>
      </div>
    </el-dialog>
    <!-- 导入失败的数据 -->
    <el-dialog title="导入失败的数据" :visible.sync="dialogImportErrorVisible" width="60%">
      <import-error></import-error>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { isShowColumnFormatter, checkFormatter, compact } from '@/utils/formatter.js'
import { checkType } from '@/utils/selectAble.js'
import { checkPhone, checkNumber } from '@/utils/validator.js'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import { checkAICamera, checkTypes, checkAllow, showRoom, showFloor, showBuilding, getAiDuyCompany, AIInOutTime, AiDuyCompany, updateAIPassword, AIpermission, uploadAiDuyCompany, departments, AIpermissions } from '@/api/url'
import UploadFile from '@/components/UploadFile'
import ImportError from './components/ImportError'
export default {
  computed: {
    form2 () {
      // console.log(this.form)
      let obj = Object.assign(this.form)
      Object.keys(obj).forEach(item => {
        if (typeof obj[item] === 'string') {
          obj[item] = obj[item].trim()
        }
      })
      return obj
    },
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    UploadFile,
    ImportError
  },
  data () {
    return {
      givePower: false,
      unitArr: [],
      floorArr: [],
      root: {
        aiTokenIds: [],
        isCheck: 0,
        timeLimits: [],
        id: undefined,
        isLogin: '1',
        cause: ''
      },
      floor: undefined,
      roomArr: [],
      addrInput: undefined,
      accept: '.xls,.xlsx',
      action: uploadAiDuyCompany,
      upload: {
        departmentId: this.$store.getters.departmentId,
        aiTokenIds: []
      },
      uploadRules: {
        aiTokenIds: [
          {required: true, trigger: 'change', message: '通道名称不可为空'}
        ]
      },
      fileLimit: 1,
      list: null,
      listLoading: true,
      deleteLoading: false,
      deleteAllLoading: false,
      createLoading: false,
      updateLoading: false,
      disabled: true,
      listQuery: {
        offset: 1,
        limit: 5,
        phone: undefined,
        addr: undefined,
        leader: undefined
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      tableData: [],
      isShowColumnFormatter: isShowColumnFormatter,
      checkFormatter: checkFormatter,
      checkType: checkType,
      total: null,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogImportVisible: false,
      dialogImportErrorVisible: false,
      localList: [],
      loading: false,
      selectArrayId: [],
      checked: [],
      state: false,
      errVisible: false,
      form: {
        dcCode: this.$store.getters.departmentId + '-',
        id: undefined,
        leader: undefined,
        sex: undefined,
        aiTokenIds: [],
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        floorNum: undefined,
        roomNum: undefined,
        userNum: undefined,
        visitorNum: undefined
      },
      rootRules: {
        aiTokenIds: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        // timeLimits: [
        //   {required: true, trigger: 'change', message: '时段设置不可为空'}
        // ],
        sex: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isCheck: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        cause: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      formRules: {
        aiTokenIds: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        sex: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        leader: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isCheck: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        userNum: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        visitorNum: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkNumber, trigger: 'blur'}
        ]
      },
      rowId: undefined,
      memberId: undefined,
      dialogPermissionVisible1: false,
      dialogPermissionVisible2: false,
      localList1: [],
      localList2: [],
      checked11: '',
      checked22: [],
      jsonData: [
        {
          title: '登录账号',
          key: 'loginName',
          type: 'text'
        },
        {
          title: '业主姓名',
          key: 'leader',
          type: 'text'
        },
        {
          title: '手机号',
          key: 'phone',
          type: 'text'
        },
        {
          title: '性别',
          key: 'sex',
          type: 'text'
        },
        {
          title: '学校',
          key: 'school',
          type: 'text'
        },
        {
          title: '楼室',
          key: 'addr',
          type: 'text'
        },
        {
          title: '审核方式',
          key: 'isCheck',
          type: 'text'
        },
        {
          title: '家庭人数',
          key: 'userNum',
          type: 'text'
        },
        {
          title: '访问人数',
          key: 'visitorNum',
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
    console.log(this.$store.getters.themeType)
    this.fetchData()
    this.getType()
  },
  methods: {
    // 全选
    selectAll () {
      this.checked = []
      this.localList.map(ele => {
        this.checked.push(ele.localId)
      })
    },
    // 取消全选
    deselectAll () {
      this.checked = []
    },
    handleh () {
      this.jsonData[1]['title'] = parseInt(this.themeType) === 1 ? '业主姓名' : (parseInt(this.themeType) === 2 ? '部门名称' : (parseInt(this.themeType) === 3 ? '姓名' : (parseInt(this.themeType) === 4 ? '账户名称' : '班组名称')))
      this.jsonData[7]['title'] = parseInt(this.themeType) === 1 ? '家庭人数' : (parseInt(this.themeType) === 2 ? '部门人数' : (parseInt(this.themeType) === 3 ? '班级人数' : (parseInt(this.themeType) === 4 ? '成员人数' : '非访客人数')))
      this.jsonData[5]['title'] = parseInt(this.themeType) === 2 ? '楼室' : '班级'
      let obj1 = JSON.parse(JSON.stringify(this.jsonData))
      let obj2 = JSON.parse(JSON.stringify(this.jsonData))
      obj1.splice(7, 2)
      obj2.splice(3, 2)
      this.jsonData = this.isShowColumnFormatter(['有为学校']) ? obj1 : obj2
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.sex = parseInt(item.sex) === 1 ? '男' : '女'
        item.isCheck = this.checkFormatter(item.isCheck)
        // item.tenant = this.houseType(item.tenant)
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
    getType () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data.addrType === 0) {
            this.addrInput = true
          } else {
            this.addrInput = false
          }
        }).catch(() => {})
    },
    findValue (value) {
      if (value === '0') {
        this.errVisible = true
      } else {
        this.errVisible = false
      }
    },
    postData () {
      this.$refs.rootform.validate((valid) => {
        if (valid) {
          if (this.csd === 1) {
            httpPut(checkAllow, this.root)
              .then((res) => {
                this.$message({
                  message: res.message,
                  type: 'success',
                  duration: 3000
                })
                console.log(res)
                this.givePower = false
                this.fetchData()
              }).catch(() => {
                // this.$message({
                //   message: err.message,
                //   type: 'fail',
                //   duration: 3000
                // })
              })
          } else {
            this.root.id = this.selectArrayId
            httpPut(checkTypes, this.root)
              .then((res) => {
                this.$message({
                  message: res.message,
                  duration: 3000,
                  type: 'success'
                })
              }).catch(() => {})
          }
        }
      })
    },
    allquan () {
      // console.log(this.tableData)
      let obj = {
        aiLocalPermissionDtos: [
        ]
      }
      this.selectArrayId.forEach((item, index) => {
        obj.aiLocalPermissionDtos.push({
          aiTokenIds: this.checked22,
          aiDutyCompanyId: item
        })
      })
      httpPut(AIpermissions, obj).then(res => {
        this.$message({
          message: '权限添加成功',
          type: 'success',
          duration: '2000'
        })
        this.dialogPermissionVisible2 = false
        this.checked22 = ''
      })
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
    handleCheck (item) {
      this.root.id = item.id
      this.csd = 1
      this.givePower = true
      this.getCameraList()
      this.getTimeData()
    },
    // 获取时段
    getTimeData () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          this.canType = res.data.addrType
          if (res.data.openWigan === 0) {
            this.weiShow = false
          } else {
            this.weiShow = true
          }
          if (res.data.addrType === 0) {
            this.addrInput = true
          } else {
            this.addrInput = false
          }
          if (res.data.state === 1) {
            this.state = true
            this.timeList = res.data.data
          } else {
            this.state = false
          }
        }).catch(() => {})
    },
    // 获取所有的通道列表
    getCameraList (nn) {
      this.dialogPermissionVisible1 = false
      this.dialogPermissionVisible2 = false
      this.checked11 = ''
      this.checked22 = []
      this.checked = []
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
          if (nn === 1) {
            this.localList1 = res.data
            this.dialogPermissionVisible1 = true
          } else if (nn === 2) {
            this.localList2 = res.data
            this.dialogPermissionVisible2 = true
          }
          // console.log(res.data)
        }
      }).catch(() => {})
    },
    allquan2 () {
      this.getCameraList(1)
    },
    allquan22 () {
      // console.log(1111)
      this.getCameraList(2)
    },
    allquan1 (aiTokenId, departmentId) {
      let obj1 = {}
      obj1.aiTokenId = aiTokenId
      obj1.departmentId = departmentId
      // httpPut(AIpermissions, obj).then(res => {
      httpGet(departments, obj1).then(res => {
        this.$message({
          message: '权限添加成功',
          type: 'success',
          duration: '2000'
        })
        this.dialogPermissionVisible1 = false
        this.checked11 = ''
      })
      // })
    },
    permData1 () {
      // console.log(this.checked)
      if (this.checked11.length === 0) {
        this.$message.error('请选择通道')
      } else {
        this.allquan1(this.checked11, this.$store.getters.departmentId)
      }
    },
    permData2 () {
      // console.log(this.checked)
      this.allquan()
    },
    getUnit () {
      if (this.addrInput === false) {
        httpGet(showBuilding + '/' + this.$store.getters.departmentId).then((res) => {
          if (res.data.length > 0) {
            this.unitArr = res.data
          } else {
            this.unitArr = []
          }
          if (this.isShowColumnFormatter(['有为学校'])) {
            console.log(this.unitArr)
            this.form.floorNum = this.unitArr[0]
            this.showFloor()
          }
        }).catch(() => {})
      }
    },
    // 根据单元生成楼层
    showFloor (val) {
      console.log(val)
      httpGet(showFloor, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId
      }).then((res) => {
        if (res.data.length > 0) {
          this.floorArr = compact(res.data)
          if (this.isShowColumnFormatter(['有为学校'])) {
            for (let i = 0; i < this.floorArr.length; i++) {
              if (this.floorArr[i][0] === '0') this.floorArr[i] = this.floorArr[i].substring(1)
              if (this.floorArr[i] === '10') this.floorArr[i] = '高一'
              if (this.floorArr[i] === '11') this.floorArr[i] = '高二'
              if (this.floorArr[i] === '12') this.floorArr[i] = '高三'
            }
          }
        } else {
          this.floorArr = []
        }
      }).catch(() => {})
    },
    // 根据楼层获取房间号
    getRoom () {
      httpGet(showRoom, {
        buildingName: this.form.floorNum,
        departmentId: this.$store.getters.departmentId,
        floorNumber: this.floor
      }).then((res) => {
        if (res.data.length > 0) {
          this.roomArr = res.data
        } else {
          this.roomArr = []
        }
      })
    },
    // 删除选中
    // handleDelete () {
    //   this.$confirm('确认删除所选中的记录吗？', '提示', {})
    //     .then(() => {
    //       this.deleteLoading = true
    //       httpDelete(AiDuyCompany, {ids: this.selectArrayId, departmentId: this.$store.getters.departmentId}).then(res => {
    //         this.deleteLoading = false
    //         this.fetchData()
    //         this.$message({
    //           type: 'success',
    //           message: res.message,
    //           duration: 4 * 1000
    //         })
    //       }).catch(() => {
    //         this.deleteLoading = false
    //       })
    //     }).catch(() => {})
    // },
    handleDelete () {
      const h = this.$createElement
      let message = ['删除后所选账户将不能正常使用包括账户下所有用户']
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
        this.deleteLoading = true
        // document.onkeydown = undefined
        httpDelete(AiDuyCompany, {ids: this.selectArrayId, departmentId: this.$store.getters.departmentId}).then(res => {
          this.deleteLoading = false
          this.fetchData()
          this.$message({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
          // window.location.reload()
        }).catch(() => {
          this.deleteLoading = false
          // document.onkeydown = undefined
        })
      })
    },
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAiDuyCompany, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          if (this.isShowColumnFormatter(['有为学校']) === true) {
            this.tableData.map((item) => {
              item.school = this.$store.getters.depName
            })
          }
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
    // 重置表单
    resetForm () {
      this.form = {
        id: undefined,
        leader: undefined,
        sex: undefined,
        aiTokenIds: [],
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        userNum: undefined,
        visitorNum: undefined
      }
    },
    handleCreate () {
      console.log(this.addrInput)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getCameraList()
      this.getUnit()
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].clearValidate()
      })
    },
    // 刷新
    resetListQuery () {
      this.listQuery = {
        offset: 1,
        limit: 5,
        leader: undefined
      }
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          if (this.isShowColumnFormatter(['有为学校'])) {
            this.form.userNum = 100000
          }
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          httpPost(AiDuyCompany, this.form)
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
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          httpPut(AiDuyCompany, updateFormData)
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
    // 修改密码
    handlePassword (row) {
      this.$prompt('请填写新密码', '提示', {
        confimButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(\w){6,12}$/,
        inputErrorMessage: '密码为6-12位字母，数字或者下划线'
      }).then(({value}) => {
        httpPut(updateAIPassword, {id: row.id, psw: value})
          .then(res => {
            this.$message.success(res.message)
          }).catch(() => {})
      }).catch(() => {})
    },
    // 删除所有
    // handleAllDelete () {
    //   this.$confirm('确认删除所有的记录吗？', '提示', {})
    //     .then(() => {
    //       this.deleteAllLoading = true
    //       httpDelete(AiDuyCompany + '/' + this.$store.getters.departmentId).then(res => {
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
        this.deleteAllLoading = true
        // document.onkeydown = undefined
        httpDelete(AiDuyCompany + '/' + this.$store.getters.departmentId).then(res => {
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
    // 通道权限
    handlePassRole (row) {
      let data = {
        departmentId: this.$store.getters.departmentId,
        aiDutyCompanyId: row.id
      }
      this.rowId = row.id
      httpGet(AIpermission, data).then(res => {
        if (res.data.local.length === 0) {
          this.$message.error('暂未配置通道，请先配置通道')
        } else {
          console.log('通道权限：', res)

          this.localList = res.data.local
          this.checked = res.data.checked
          this.dialogPermissionVisible = true
        }
      }).catch(() => {})
    },
    // 保存权限
    permData () {
      if (this.checked.length === 0) {
        this.$message.error('请选择通道')
      } else {
        let data = {
          aiDutyCompanyId: this.rowId,
          aiTokenIds: this.checked
        }
        console.log('保存的通道权限： ', data.aiTokenIds)

        httpPut(AIpermission, data).then(res => {
          this.dialogPermissionVisible = false
          this.$message({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }
    },
    importData () {
      this.upload = Object.assign(this.upload, {departmentId: this.$store.getters.departmentId})
      this.$nextTick(() => {
        this.$refs.upload.$refs.UPLOAD.submit()
      })
    },
    // 检查手机号是否重复
    phoneCheck () {
      httpGet(AiDuyCompany + '/' + this.form.phone)
        .then(res => {}).catch(() => {})
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogImportVisible = false
      this.fetchData()
    }
  }
}
</script>
<style lang='scss' scoped>
.tree-main{
  padding: 10px;
  border-radius: 10px;
  background: white;
  margin-right: 20px;
}
</style>
