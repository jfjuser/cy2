
<template>
  <div class="app-container">
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container" style="overflow:hidden">
        <!-- <el-input  class="filter-item" clearable style="width: 150px;" v-model="listQuery.leader" :placeholder="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '班组名称')))"></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-model="listQuery.phone" placeholder='手机号'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-model="listQuery.localName" placeholder='通道名称'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-if="themeType === 1" v-model="listQuery.floorNum" placeholder='单元'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;margin-right:0.5rem" v-if="themeType === 1" v-model="listQuery.addr" placeholder='房号'></el-input> -->
        <el-input  class="filter-item" clearable style="width: 150px;" v-model.trim="listQuery.leader" :placeholder="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '班组名称')))"></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-model.trim="listQuery.phone" placeholder='手机号'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-model.trim="listQuery.localName" placeholder='通道名称'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;" v-if="themeType === 1" v-model.trim="listQuery.floorNum" placeholder='单元'></el-input>
        <el-input  class="filter-item" clearable style="width: 150px;margin-right:0.5rem" v-if="themeType === 1" v-model.trim="listQuery.addr" placeholder='房号'></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
       <span  style="margin-left:10px;margin-right:10px" v-has="['批量添加通道权限']">
        <el-button class="filter-item" type="primary" :loading = "deleteLoading" @click="allquan2" :disabled="disabled&&tableData.length==selectArrayId.length" v-if="tableData.length == selectArrayId.length" >批量添加通道权限</el-button>
        <el-button class="filter-item" type="primary" :loading = "deleteLoading" @click="allquan22" :disabled="disabled&&tableData.length!=selectArrayId.length" v-if="tableData.length!=selectArrayId.length" >批量添加通道权限</el-button>
        </span>
        <el-button class="filter-item" type="primary" v-has="['添加']"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
        <el-button class="filter-item" type="primary" v-has="['导入']"  @click="handleImport"  icon="el-icon-upload">导入</el-button>
        <!-- 新增  v-has="['学生数据导出']" -->
        <el-button class="filter-item" type="primary" :loading="isStudentUploadState"   @click="studentUploadData"  icon="el-icon-tickets">学生数据导出</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <!--======================================  -->
        <el-button class="filter-item" type="primary" v-has="['导入']"  @click="handleImportError">
          <i class="fa fa-recycle"></i>
          导入失败数据
        </el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除']" :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger"  v-has="['删除所有']" plain :loading = "deleteAllLoading" @dblclick.native="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" type="warning" v-show="isShow" icon="el-icon-zoom-in" @click="checkLots" :disabled="disabled">批量审核</el-button>
      </div>
      <el-tag style="margin-bottom: 1rem" type="success" v-has="['删除所有']">删除所有功能按键需双击才可调用</el-tag><br>
      <el-tag v-if="themeType === 1">根据单元，房号搜索业主，搜索栏只可填写数字，字母或两者的组成</el-tag><br>
      <el-tag style="margin: 1rem 0" type="warning">注意：下发用户属于额外收费功能,请确保功能开启并且积分充足</el-tag>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @row-dblclick="getMembers" @selection-change="handleSelectionChange"  element-loading-text="加载中..." border fit highlight-current-row class="table1">
        <el-table-column type="selection" width="40" fixed="left" v-if = "isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column label="登录名" align="center" prop="loginName"></el-table-column>
        <el-table-column label="班组名称" align="center" prop="teamName" v-if="themeType === 5"></el-table-column>
        <el-table-column :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '带班名称')))"  align="center" prop="leader"></el-table-column>
        <el-table-column label="手机号" align="center" prop="phone">
          <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            {{sexFormatter(scope.row.sex)}}
          </template>
        </el-table-column>
        <el-table-column :label="themeType === 1? '房号' : '地址'" align="center" prop="addr"></el-table-column>
        <el-table-column label="审核方式" align="center" prop="isCheck">
          <template slot-scope="scope">
            {{checkFormatter(scope.row.isCheck)}}
          </template>
        </el-table-column>
        <el-table-column :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : (themeType === 4? '成员人数' : '非访客人数')))" align="center" prop="userNum"></el-table-column>
        <!-- <el-table-column label="访客人数" align="center" prop="visitorNum"></el-table-column> -->
         <el-table-column v-if="themeType === 1" label="户型" align="center" prop="tenant">
          <template slot-scope="scope">
            {{houseType(scope.row.tenant)}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="380" v-if = "isShowColumnFormatter(['二维码', '编辑', '修改密码', '通道权限'])">
          <template slot-scope="scope">
            <el-button v-has="['授权审核']" v-if="scope.row.isLogin === 0" type="primary" @click.native.prevent="handleCheck(scope.row)" size="mini">授权审核</el-button>
            <el-button v-has="['二维码']" style="margin-bottom:15px" type="primary" @click.native.prevent="handleQRCode(scope.row)" size="mini">二维码</el-button>
            <el-button v-has="['编辑']" type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
            <el-button style="margin-bottom:15px" v-has="['修改密码']" type="primary" @click.native.prevent="handlePassword(scope.row)" size="mini">修改密码</el-button>
            <el-button v-has="['通道权限']" type="primary" @click.native.prevent="handlePassRole(scope.row)" size="mini">通道权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
      <!-- 成员信息 -->
      <transition name="el-fade-in-linear">
        <Member v-if="memberId" :memberId = "memberId" :dates="tableData" :userAddr = 'userAddr' :canType = 'canType' :isShow="weiShow" :userloginName="userloginName"/>
      </transition>
    </div>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" @close="resetForm()">
        <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="150px">
          <el-form-item label="班组名称" prop="teamName" v-if="themeType === 5">
            <el-input v-model="form.teamName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : (themeType === 4? '账户名称' : '带班名称')))" prop="leader">
            <el-input v-model="form1.leader" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="户型" >
            <el-radio-group v-model="form.tenant">
              <el-radio :label = 0>业主</el-radio>
              <el-radio :label = 1>租户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别" >
            <el-radio-group v-model="form.sex">
              <el-radio :label = 1>男</el-radio>
              <el-radio :label = 2>女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="微信推送" required>
            <el-radio-group v-model="form.openPush">
              <el-radio :label = 0>关闭</el-radio>
              <el-radio :label = 1>开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="dialogStatus === 'create'">
            <el-form-item label="通道名称" prop="aiTokenIds">
              <el-select v-model="form.aiTokenIds" multiple >
                <el-option v-for="item in localList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="时段设置" v-if="state" prop="timeLimits">
            <el-select v-model="form.timeLimits" multiple :multiple-limit="3">
              <el-option v-for="item in timeList" :key="item.num" :label="item.name" :value="item.num"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核方式" prop="isCheck" >
            <el-select v-model="form.isCheck">
              <el-option v-for="item in checkType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" >
            <el-input type="tel" v-model="form.phone" placeholder="请输入手机号"></el-input>
            <span v-if="dialogStatus === 'create'" style="font-size: 14px; color: red">备注：手机号为人脸智能识别小程序的登录账号！</span>
          </el-form-item>
          <el-form-item v-if="addrInput" label="用户地址" prop="addr">
            <el-input v-model="form.addr" placeholder="请输入用户地址"></el-input>
          </el-form-item>
          <el-form-item v-if="!addrInput" label="用户地址" prop="floorNum">
            <el-select v-model="form.floorNum" style="width:100px;" @visible-change="showFloor">
              <el-option v-for="item in unitArr" :key="item" :value="item"></el-option>
            </el-select> 单元
            <!-- 第<el-input style="width:80px;" v-model="form.floorNum"></el-input>单元 -->
             <el-select v-model="floor" style="width:100px;margin-left: 10px" @visible-change="getRoom">
              <el-option v-for="item in floorArr" :key="item" :value="item"></el-option>
            </el-select> 层
            <!-- <span style="padding-left:15px">房号：</span> -->
            <el-select v-model="form.roomNum" style="width:100px;margin-left: 10px">
              <el-option v-for="item in roomArr" :key="item" :value="item"></el-option>
            </el-select> 号房
            <!-- <el-input style="width:120px;" v-model="form.roomNum"></el-input> -->
            <div style="font-size: 14px; color: #ccc">备注：可前往【楼栋/单元管理】创建</div>
          </el-form-item>
          <el-form-item :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : ( themeType === 4? '成员人数' : '非访客人数')))" prop="userNum">
            <el-input type="number" min="1" v-model="form.userNum" placeholder="请输入成员人数"></el-input>
          </el-form-item>
          <!-- <el-form-item label="访问人数" prop="visitorNum">
            <el-input type="number" min="1" v-model="form.visitorNum" placeholder="请输入访问人数"></el-input>
          </el-form-item> -->
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
          <el-select v-model="root.timeLimits" multiple :multiple-limit="3">
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
    <!-- 导入失败的数据 -->
    <el-dialog title="导入失败的数据" :visible.sync="dialogImportErrorVisible" width="60%">
      <import-error></import-error>
    </el-dialog>
    <el-dialog title="生成授权码"  :visible.sync="dialogQRVisible" width="540px">
      <el-form v-if="!codeVisible" ref="createCode" :model="codeForm" autoCompete = "on" label-position="right" label-width="100px" >
        <el-row class="box-code">
          <el-col :span="12">
            <p class="box-code-radio"><el-radio v-model="codeForm.type" label="0">授权给员工</el-radio></p>
            <p class="box-code-img"><img src="@/assets/icon/icon_people_1.png"/></p>
          </el-col>
          <el-col :span="12">
            <p class="box-code-radio"><el-radio v-model="codeForm.type" label="1">授权给访客</el-radio></p>
            <p class="box-code-img"><img src="@/assets/icon/icon_people_2.png"/></p>
          </el-col>
        </el-row>
        <el-form-item label="部门" prop="departmentId">
          <el-input v-model="codeForm.departmentName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="授权组" prop="authGroup">
          <el-input v-model="codeForm.authGroup"></el-input>
        </el-form-item>
        <el-form-item v-if="codeForm.type === '1'" label="有效日期" prop="validateAt">
          <el-date-picker
            v-model="date"
            type="datetimerange"
            :default-time="['00:00:00', '23:59:59']"
            @change = "changeDate"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <div class="box-code-btn">
          <el-button type="primary" @click="showCode" size="mini">生成二维码</el-button>
          <el-button @click="dialogQRVisible = false" size="mini">取消</el-button>
        </div>
      </el-form>
      <div v-if="codeVisible" class="box-code-body">
        <div class="box-code-left">
          <div style="margin-top: 20px;" id="qrcode" ref="qrcode"></div>
        </div>
        <div class="box-code-right">
          <div>
            <p>{{codeForm.authGroup !== '' ? codeForm.authGroup : '默认授权组'}}</p>
            <p>{{authGroupTypeFormatter(codeForm.type)}}可通过扫描此二维码,在手机端进行自助申请入库</p>
          </div>
          <div class="box-code-body-btn">
            <p><el-button class="box-code-body-btn-style" type="primary" @click="downCode" size="mini">下载二维码</el-button></p>
            <p><el-button class="box-code-body-btn-style copyCodebtn" size="mini" :data-clipboard-text="codeUrl" @click="copyCode">复制链接</el-button></p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRcode from 'qrcodejs2'
import { mapGetters } from 'vuex'
import { timeFormatter, isShowColumnFormatter, sexFormatter, checkFormatter, authGroupTypeFormatter, compact } from '@/utils/formatter.js'
import { checkType } from '@/utils/selectAble.js'
import { checkPhone, checkNumber } from '@/utils/validator.js'
import { httpGet, httpPost, httpDelete, httpPut, httpExport } from '@/utils/restful'
import { showBuilding, showFloor, checkTypes, showRoom, checkAICamera, getAiDuyCompany, checkAllow, AiDuyCompany, updateAIPassword, AIpermission, AIpermissions, departments, uploadAiDuyCompany, AIInOutTime, getAuditList, ApiStudentUpload, getAICamera } from '@/api/url'
import Member from './components/member14.vue'
import UploadFile from '@/components/UploadFile'
import ImportError from './components/ImportError'
export default {
  computed: {
    form1 () {
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
    Member,
    UploadFile,
    ImportError
  },
  data () {
    return {
      isStudentUploadState: false, // 导出学生数据的加载状态
      root: {
        aiTokenIds: [],
        isCheck: 0,
        timeLimits: [],
        id: undefined,
        isLogin: '1',
        cause: ''
      },
      sexFormatter: sexFormatter,
      addrInput: undefined,
      errVisible: false,
      accept: '.xls,.xlsx',
      action: uploadAiDuyCompany,
      givePower: false,
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
        addr: '',
        offset: 1,
        limit: 5,
        leader: undefined,
        floorNum: undefined,
        roomNum: undefined,
        phone: undefined,
        localName: undefined
      },
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      tableData: [],
      isShowColumnFormatter: isShowColumnFormatter,
      checkFormatter: checkFormatter,
      authGroupTypeFormatter: authGroupTypeFormatter,
      checkType: checkType,
      total: null,
      dialogFormVisible: false,
      dialogPermissionVisible: false,
      dialogPermissionVisible1: false,
      dialogPermissionVisible2: false,
      dialogImportVisible: false,
      dialogImportErrorVisible: false,
      isShow: false,
      localList: [],
      localList1: [],
      localList2: [],
      loading: false,
      selectArrayId: [],
      checked: [],
      checked11: '',
      checked22: [],
      form: {
        id: undefined,
        openPush: 1,
        leader: undefined,
        sex: undefined,
        aiTokenIds: [],
        teamName: undefined,
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        userNum: undefined,
        visitorNum: undefined,
        timeLimits: [],
        floorNum: undefined,
        roomNum: undefined,
        tenant: undefined // 户型
      },
      codeForm: {
        type: '1',
        departmentId: this.$store.getters.departmentId,
        departmentName: this.$store.getters.depName,
        authGroup: '默认授权组',
        enableTime: undefined,
        overdueTime: undefined
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
        timeLimits: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        openPush: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        leader: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        isCheck: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        teamName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        floorNum: [
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
      unitArr: [],
      floorArr: [],
      csd: 0,
      roomArr: [],
      floor: undefined,
      memberId: undefined,
      userAddr: undefined,
      canType: undefined,
      weiShow: false,
      state: false,
      timeList: [],
      dialogQRVisible: false,
      codeVisible: false,
      codeUrl: '',
      date: [],
      userloginName: '',
      jsonData: [
        {
          title: '登录名',
          key: 'loginName',
          type: 'text'
        },
        {
          title: '班组名称',
          key: 'teamName',
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
          title: '房号',
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
          title: '户型',
          key: 'tenant',
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
  watch: {
    checked (n, o) {
      console.log(n)
    }
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
      this.jsonData[2]['title'] = parseInt(this.themeType) === 1 ? '业主姓名' : (parseInt(this.themeType) === 2 ? '部门名称' : (parseInt(this.themeType) === 3 ? '班级名称' : (parseInt(this.themeType) === 4 ? '账户名称' : '带班名称')))
      this.jsonData[7]['title'] = parseInt(this.themeType) === 1 ? '家庭人数' : (parseInt(this.themeType) === 2 ? '部门人数' : (parseInt(this.themeType) === 3 ? '班级人数' : (parseInt(this.themeType) === 4 ? '成员人数' : '非访客人数')))
      this.jsonData[5]['title'] = parseInt(this.themeType) === 1 ? '房号' : '地址'
      let obj1 = JSON.parse(JSON.stringify(this.jsonData))
      obj1.splice(1, 1)
      this.jsonData = parseInt(this.themeType) === 5 ? this.jsonData : obj1
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.sex = this.sexFormatter(item.sex)
        item.isCheck = this.checkFormatter(item.isCheck)
        item.tenant = this.houseType(item.tenant)
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
    studentUploadData () {
      // console.log('开始导出学生数据。。。')
      this.isStudentUploadState = true
      httpExport(ApiStudentUpload + this.$store.getters.departmentId).then(res => {
        // console.log('导出成功', res)
        this.$message({
          message: '导出成功！',
          type: 'success',
          duration: '2000'
        })
        this.isStudentUploadState = false
      }).catch(_ => {
        // console.log('导出失败：', err)
        this.$message({
          type: 'error',
          message: '导出失败!'
        })
        this.isStudentUploadState = false
      })
    },
    // 监听日期
    changeDate (value) {
      if (value === null) {
        this.$message.error('日期不可为空')
      } else {
        this.codeForm.enableTime = value[0]
        this.codeForm.overdueTime = value[1]
      }
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
    // 获取通道权限
    getRoot (nn) {
      this.dialogPermissionVisible1 = false
      this.dialogPermissionVisible2 = false
      this.checked11 = ''
      this.checked22 = []
      this.checked = []
      let obj = {
        offset: 1,
        limit: 100000,
        departmentId: this.$store.getters.departmentId
      }
      httpGet(getAICamera, obj).then(res => {
        if (!res.data.rows) {
          this.$message({
            message: '当前部门未绑定通道',
            type: 'error',
            duration: '2000'
          })
          return
        }
        if (nn === 1) {
          this.localList1 = res.data.rows
          this.dialogPermissionVisible1 = true
        } else if (nn === 2) {
          this.localList2 = res.data.rows
          this.dialogPermissionVisible2 = true
        }
      })
    },
    allquan2 () {
      this.getRoot(1)
    },
    allquan22 () {
      // console.log(1111)
      this.getRoot(2)
    },
    allquan1 (aiTokenId, departmentId) {
      // console.log(this.tableData)
      // let obj = {
      //   aiLocalPermissionDtos: [
      //   ]
      // }
      let obj1 = {}
      // this.tableData.forEach((item, index) => {
      //   obj.aiLocalPermissionDtos.push({
      //     aiTokenIds: item.aiTokenIds,
      //     aiDutyCompanyId: item.id
      //   })
      // })
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
    houseType (type) {
      if (type === 0) return '业主'
      if (type === 1) return '租户'
    },
    findValue (value) {
      if (value === '0') {
        this.errVisible = true
      } else {
        this.errVisible = false
      }
    },
    // 批量审核
    checkLots () {
      this.givePower = true
      this.csd = 0
      this.getCameraList()
      this.getTimeData()
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
          if (val / 1 === 123) {
            this.floorArr.forEach((item, index) => {
              if (this.form.roomNum && item.indexOf(this.form.roomNum.substr(0, 2)) > -1) {
                this.floor = item
              } else {
                if (this.form.roomNum && (item.indexOf(this.form.roomNum.toString().split('')[0]) > -1)) {
                  this.floor = item
                }
              }
            })
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
                // console.log(res)
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
    // 授权审核
    handleCheck (item) {
      this.root.id = item.id
      this.csd = 1
      this.givePower = true
      this.getCameraList()
      this.getTimeData()
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
    // handleDelete () {
    //   this.$confirm('确认删除所选中的记录吗？', '提示', {
    //     type: 'warning'
    //   })
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
    //         // window.location.reload()
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
    // 获取所有的通道列表
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    fetchData () {
      // 是否首页跳转
      let from = this.$route.query.from
      if (from && from === 'home') {
        this.fetchDataForHome()
        this.isShow = true
        return
      }
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAiDuyCompany, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].addr === '') {
              this.tableData[i].addr = this.tableData[i].floorNum + '#' + this.tableData[i].roomNum
            }
          }
          this.total = res.data.total
        }
        this.listLoading = false
        this.getTimeData()
      }).catch(() => {
        this.listLoading = false
      })
    },
    fetchDataForHome () {
      // 待审批
      httpGet(getAuditList + '/' + this.$store.getters.departmentId, {limit: 5, offset: 1}).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        this.listLoading = false
        this.getTimeData()
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 获取时段
    getTimeData () {
      httpGet(AIInOutTime + '/list/' + this.$store.getters.departmentId)
        .then(res => {
          console.log('时间段获取结果：', res.data)

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
        aiTokenIds: [],
        sex: undefined,
        isCheck: undefined,
        phone: undefined,
        addr: undefined,
        userNum: undefined,
        visitorNum: undefined,
        timeLimits: [],
        floorNum: undefined,
        roomNum: undefined
      }
      this.floor = ''
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.getCameraList()
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.resetForm()
      })
      this.getUnit()
    },
    getUnit () {
      if (this.addrInput === false) {
        httpGet(showBuilding + '/' + this.$store.getters.departmentId).then((res) => {
          if (res.data.length > 0) {
            this.unitArr = res.data
          } else {
            this.unitArr = []
          }
        }).catch(() => {})
      }
    },
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      let data = []
      if (this.form.timeLimit !== null) {
        for (let i = 0; i < this.form.timeLimit.length; i++) {
          if (this.form.timeLimit[i] === '1') {
            data.push(Number(i + 1))
          }
        }
      }
      this.dialogStatus = 'update'
      this.getCameraList()
      this.getUnit()
      this.dialogFormVisible = true
      this.$set(this.form, 'timeLimits', data)
      this.showFloor(123)
      this.getRoom()
      this.$nextTick(() => {
        this.$refs['dataform'].clearValidate()
        // this.resetForm()
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
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createLoading = true
          this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
          this.$nextTick(() => {
            this.$refs['dataform'].clearValidate()
            this.resetForm()
          })
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
    //   this.$confirm('确认删除所有的记录吗？', '提示', {
    //     type: 'error'
    //   })
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
      let message = ['删除后所有账户及以下所有用户将不能正常使用']
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
          this.localList = res.data.local
          this.checked = res.data.checked
          this.dialogPermissionVisible = true
        }
      }).catch(() => {})
    },
    // 保存权限
    permData () {
      console.log(this.checked)
      if (this.checked.length === 0) {
        this.$message.error('请选择通道')
      } else {
        let data = {
          aiDutyCompanyId: this.rowId,
          aiTokenIds: this.checked
        }
        console.log('保存的通道权限：', data.aiTokenIds)

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
    // 获取成员
    getMembers (row, column, cell, event) {
      this.memberId = row.id
      if (row.addr === null) {
        this.userAddr = ''
      } else {
        this.userAddr = row.addr
        this.userloginName = row.loginName
        console.log(row)
      }
    },
    // 导入
    handleImport () {
      this.upload = {
        aiTokenIds: []
      }
      this.getCameraList()
      this.dialogImportVisible = true
      this.$nextTick(() => {
        this.$refs.uploadData.clearValidate()
        this.$refs.upload.$refs.UPLOAD.clearFiles()
      })
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
    // 导入失败数据获取
    handleImportError () {
      this.dialogImportErrorVisible = true
    },
    // 隐藏文件上传框
    hideUploadVisible () {
      this.dialogImportVisible = false
      this.fetchData()
    },
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode', {
        text: this.codeUrl,
        width: 200,
        height: 200
      })
    },
    // 获取qrCode
    handleQRCode (row) {
      this.codeVisible = false
      this.dialogQRVisible = true
      this.rowId = row.id
    },
    showCode () {
      if (this.codeForm.type === '1') {
        if (this.codeForm.enableTime && this.codeForm.overdueTime) {

        } else {
          this.$message.error('请选择有效日期')
          return
        }
      }
      this.codeVisible = true
      this.$nextTick(() => {
        let QrCodeHTML = this.$refs.qrcode
        QrCodeHTML.innerHTML = ' '
        this.createQrCode()
        this.codeUrl = process.env.API_HOST + 'view/faceAI/userManage/?id=' + this.rowId + '&depId=' + this.$store.getters.departmentId + '&type=' + this.codeForm.type
        if (this.codeForm.type === '1') {
          this.codeUrl += '&et=' + timeFormatter(this.codeForm.enableTime) + '&ot=' + timeFormatter(this.codeForm.overdueTime)
        }
        console.log('二维码数据： ', this.codeForm, this.form)
        this.createCode.clear()
        this.createCode.makeCode(this.codeUrl)
      })
    },
    // 下载二维码
    downCode () {
      let img = document.getElementById('qrcode').getElementsByTagName('img')[0]
      let triggerDownLoad = document.createElement('a')
      triggerDownLoad.setAttribute('href', img.src)
      triggerDownLoad.setAttribute('downLoad', '授权码.png')
      triggerDownLoad.click()
    },
    copyCode () {
      let clipboard = new Clipboard('.copyCodebtn')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        clipboard.destroy() // 使用destroy可以清楚缓存
      })
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
.box-code {
  padding: 0 10%;
  text-align: center;
}
.box-code-btn {
  text-align: center;
}
.box-code-body {
  height: 245px;
}
.box-code-left {
  float: left;
}
.box-code-right {
  margin-top: 20px;
  float: right;
  width: 230px;
  white-space:normal;
  word-break:break-all;
  overflow:hidden;
}
.box-code-body-btn {
  margin-top: 40px;
  text-align: center;
  .box-code-body-btn-style {
    width: 230px;
  }
}
.table-main /deep/ .el-table.table1 {
  tr {
    &.hover-row {
      > td:last-of-type::after {
        content: "双击可查看用户";
        display: inline-block;
        line-height: 20px;
        font-size: 12px;
        background-color: #eee;
        color: #909399;
        z-index: 1000;
        padding: 0 2px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
