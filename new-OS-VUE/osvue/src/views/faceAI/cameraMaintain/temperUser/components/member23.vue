<template>
  <div style="margin-top: 20px;">
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" v-if="detail.length> 0" style="width: 100%; margin-bottom: 20px;" :data="detail" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column :label="themeType === 1? '业主姓名': (themeType === 2? '部门名称' : (themeType === 3? '班级名称' : '账户名称'))"  align="center" prop="leader"></el-table-column>
      <el-table-column label="登录账号" align="center" prop="loginName"></el-table-column>
      <el-table-column label="手机号" align="center" prop="phone">
        <template slot-scope="scope">
          <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
          <template v-else>{{scope.row.phone}}</template>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center" prop="addr"></el-table-column>
      <el-table-column label="审核方式" align="center" prop="isCheck">
        <template slot-scope="scope">
          {{checkFormatter(scope.row.isCheck)}}
        </template>
      </el-table-column>
      <el-table-column :label="themeType === 1? '家庭人数': (themeType === 2? '部门人数' : (themeType === 3? '班级人数' : '成员人数'))" align="center" prop="userNum"></el-table-column>
      <el-table-column label="访客人数" align="center" prop="visitorNum"></el-table-column>
    </el-table>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="primary"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      <el-button class="filter-item" type="danger"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @click="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
      <el-button class="filter-item" type="warning" :disabled="selectArrayId.length < 2"  icon="el-icon-zoom-in" @click="handleCheck">批量审核</el-button>
    </div>
    <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
      <el-table-column label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
      <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          {{sexFormatter(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column v-if="themeType === 2" label="职位" align="center" prop="userPost"></el-table-column>
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
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="260">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type === 2" @click.native.prevent="toBeWhite(scope.row)" type="primary" size="mini">转为白名单</el-button>
          <el-button v-if="scope.row.type !== 2" @click.native.prevent="toBeBlack(scope.row)" type="primary" size="mini">转为黑名单</el-button>
          <el-button v-if="scope.row.type === 1" type="primary" @click.native.prevent="tobeAdmin(scope.row)" size="mini">转为非访客</el-button>
          <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          <el-button style="margin-top:0.52rem" type="primary" @click.native.prevent="handleSeePhoto(scope.row)" size="mini">查看图片</el-button>
          <el-button v-if="scope.row.isCheck === 2" type="primary" @click.native.prevent="handlePermisson(scope.row)" size="mini">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 转为白名单 -->
    <el-dialog title="白名单" width="40%" :visible.sync = "dialogWhiteVisible">
      <el-form>
        <el-form-item label="账户" required>
          <el-select clearable  style="width:150px;" v-model="lists.dutyCompanyId"  class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in userArr" :key=index :label=item.leader :value=item.id></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" required>
          <el-select clearable  style="width:150px;" v-model="lists.type"  class="filter-item" placeholder="请选择">
            <el-option label="非访客" :value="0"></el-option>
            <el-option label="访客" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="lists.type === 1">
          <el-form-item label="开始日期" required>
            <el-date-picker type="datetime"  v-model="lists.beginTime"  placeholder="开始日期不可为空">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束日期" required>
            <el-date-picker type="datetime"  v-model="lists.endTime"  placeholder="结束日期不可为空">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWhiteVisible = false">取消</el-button>
        <el-button type="primary" @click="blackToWhite">保存</el-button>
      </div>
    </el-dialog>
    <!-- 转换非访客 -->
    <el-dialog title="非访客" width="40%" :visible.sync = "isNotVisible">
      <el-form>
        <el-form-item label="账户" required>
          <el-select clearable  style="width:150px;" v-model="lists.dutyCompanyId"  class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in userArr" :key=index :label=item.leader :value=item.id></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isNotVisible = false">取消</el-button>
        <el-button type="primary" @click="tobeFang">保存</el-button>
      </div>
    </el-dialog>
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" width="40%">
      <!-- 暂不支持的实名认证  图片质量校验 、回显等问题仍需解决 后期需求完善 -->
      <!-- <el-tag style="margin-bottom:0.8rem;margin-left:3rem" @dblclick.native="isReal = true">如果您正好有匹配的中控身份证阅读器，可供选择实名认证哦</el-tag> -->
      <el-button v-show="isReal" @click.native="isReal = false">关闭实名认证</el-button>
      <iframe v-show="isReal" scrolling="no" name='child' style="border:none;width:100%;height:20.5rem"
      src = 'https://beta.cytingchechang.com/attendance/base.html'></iframe>
      <el-button v-show="isReal" plain type='danger' style="margin:0.75rem" @click.native="toNaer">确定认证</el-button>
      <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
        <el-form-item label="韦根卡号" prop="wiegandCard">
          <el-input v-model="form.wiegandCard" placeholder="请输入韦根卡号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.sex">
            <el-radio :label = 1>男</el-radio>
            <el-radio :label = 2>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="themeType === 2" label="职位" prop="userPost">
          <el-input v-model="form.userPost" placeholder="请输入职位"></el-input>
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
        <el-form-item label="授权时长" required v-show="showType === 0">
           <el-select v-model="timeLimit" @change="changeTimeKinds">
              <el-option v-for="item in timeKinds" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
            </el-select>
            <div v-show="val === 5">
              <el-input v-model="customTime" style="width:180px;margin-left:77px;margin-top: 10px"
              placeholder="请输入自定义时长" type="number"></el-input> 个月
            </div>
            <el-tag v-show="showType === 0" type="warning" style="float:right;margin-top: 10px">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</el-tag>
          </el-form-item>
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
    <el-dialog title="批量审核" width="40%" :visible.sync = "isVisible">
      <el-tag v-show="showType === 0" type="warning" style="float:right">选择‘其他’可自定义时长，但必须填写数字，且以月为单位计算</el-tag>
      <el-form>
        <el-form-item label="授权时长" required v-show="showType === 0">
          <el-select v-model="timeLimit" @change="changeTimeKinds">
            <el-option v-for="item in timeKinds" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
          </el-select>
          <div v-show="timeLimit === 5">
            <el-input v-model="customTime" style="width:180px;line-height:60px;margin-left:75px"
            placeholder="请输入自定义时长" type="number"></el-input>个月
          </div>
      </el-form-item>
        <el-form-item label="审核状态" required >
          <el-radio-group v-model="isCheck">
            <el-radio :label= 0 >审核不通过</el-radio>
            <el-radio :label= 1 >审核通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAllCheck">保存</el-button>
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
import { isShowColumnFormatter, sexFormatter, checkFormatter, checkStatusFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { personType } from '@/utils/selectAble.js'
import { checkPhone, checkRemarks } from '@/utils/validator.js'
import { getAIDuyDetail, typeCheck, changeVisitor, whiteBlackList, getAiDuyCompany, getAccountCamera, getAIDuyUser, AIMember, uploadAImMember, checkIsAddAIMember, checkAIMemeber, seeAIMemberPhoto, updateMemberPhoto, getUUid } from '@/api/url'
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
      required: true
    }
  },
  name: 'member',
  watch: {
    memberId (curVal, oldVal) {
      this.detail = []
      if (curVal !== 0) {
        if (curVal.split('-').length > 2 && curVal !== '-0-') {
          let id = curVal.split('-')[curVal.split('-').length - 2]
          this.handleDeatil(id)
        }
        this.listQuery.dcCode = curVal
        this.fetchData()
      }
    },
    customTime (val) {
      if (val < 0) {
        this.customTime = 1
      }
    }
  },
  mounted () {
    this.listQuery.dcCode = this.memberId
    if (this.listQuery.dcCode !== 0) {
      this.fetchData()
    }
  },
  data () {
    return {
      photoType: undefined,
      customTime: undefined,
      channelId: undefined,
      isVisible: false,
      val: undefined,
      timeLimit: undefined,
      action: uploadAImMember,
      sexFormatter: sexFormatter,
      dialogWhiteVisible: false,
      isNotVisible: false,
      isReal: false,
      channelArr: [],
      timeKinds: [
        {
          valueNo: 1,
          valueName: '一个月'
        },
        {
          valueNo: 2,
          valueName: '三个月'
        },
        {
          valueNo: 3,
          valueName: '六个月'
        },
        {
          valueNo: 4,
          valueName: '一年'
        },
        {
          valueNo: 5,
          valueName: '其他'
        }
      ],
      fileData: {
        photo: ''
      },
      imgUrl: '',
      isCheck: undefined,
      list: null,
      listLoading: true,
      createLoading: false,
      updateLoading: false,
      deleteLoading: false,
      deleteAllLoading: false,
      listQuery: {
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      checkFormatter: checkFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      checkStatusFormatter: checkStatusFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      personType: personType,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPhotoVisible: false,
      disabled: true,
      showType: undefined,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑成员',
        create: '添加成员'
      },
      userArr: [],
      lists: {
        type: 0,
        mac: undefined,
        id: undefined,
        dutyCompanyId: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      form: {
        id: undefined,
        userName: undefined,
        phone: undefined,
        sex: undefined,
        userPost: undefined,
        // photo: '',
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
      detail: [],
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
          title: '性别',
          key: 'sex',
          type: 'text'
        },
        {
          title: '职位',
          key: 'userPost',
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
      this.jsonData[4]['title'] = parseInt(this.themeType) === 1 ? '校验码' : (parseInt(this.themeType) === 2 ? '工号' : (parseInt(this.themeType) === 3 ? '学号' : '校验码'))
      if (parseInt(this.themeType) !== 2) {
        this.jsonData.splice(3, 1)
      }
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.type = item.type ? '访客' : '非访客'
        // item.type = parseInt(item.status) === 0 ? '离线' : (parseInt(item.status) === 1 ? '在线' : '')
        item.isCheck = this.checkStatusFormatter(item.isCheck)
        item.endTime = this.timeFormatter(item.endTime)
        item.sex = this.sexFormatter(item.sex)
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
    handleCheck () {
      this.isVisible = true
      this.showType = this.listQuery.type
      this.isCheck = undefined
    },
    // 批量审核
    saveAllCheck () {
      if (this.isCheck === 'undefined') {
        this.$message.error('请先选择审核的状态')
      } else {
        const data = {
          ids: this.selectArrayId,
          isCheck: this.isCheck,
          departmentId: this.$store.getters.departmentId,
          customTime: this.customTime,
          timeLimit: this.timeLimit
        }
        console.log(this.selectArrayId)
        httpPut(typeCheck, data).then(res => {
          this.fetchData()
          this.isVisible = false
          this.$message.success(res.message)
        }).catch(() => {
          this.isVisible = false
        })
      }
    },
    // 黑转白
    blackToWhite () {
      httpPut(whiteBlackList, this.lists).then((res) => {
        this.$message({
          type: 'success',
          duration: 3000,
          message: res.message
        })
        this.dialogWhiteVisible = false
        this.resetListQuery()
      }).catch(() => {
        this.dialogWhiteVisible = false
      })
    },
    // 转为黑名单
    toBeBlack (row) {
      let obj = {
        id: row.id,
        type: 2
      }
      this.$confirm('确定将该用户转为黑名单？', '提示', {})
        .then(() => {
          httpPut(whiteBlackList, obj).then((res) => {
            console.log(res)
            this.$message({
              type: 'success',
              duration: 3000,
              message: res.message
            })
            this.resetListQuery()
          }).catch(() => {})
        }).catch(() => {})
    },
    // 转为白名单之前获取账户列表
    toBeWhite (row) {
      this.lists.id = row.id
      this.dialogWhiteVisible = true
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        console.log(res)
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
          this.$message({
            type: 'danger',
            duration: 3000,
            message: '获取不到可转入白名单的账户'
          })
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 转为非访客
    tobeAdmin (row) {
      console.log(row)
      this.lists.id = row.id
      httpGet(getAiDuyCompany, {departmentId: this.$store.getters.departmentId}).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.userArr = []
        } else {
          this.userArr = res.data.rows
        }
      }).catch((err) => {
        this.$message.error(err)
      })
      this.isNotVisible = true
    },
    changeTimeKinds (val) {
      this.val = val
    },
    // fangke
    tobeFang () {
      httpPost(changeVisitor, {
        dutyCompanyId: this.lists.dutyCompanyId,
        userId: this.lists.id
      }).then((res) => {
        this.$message({
          message: res.message,
          duration: 3000,
          type: 'success'
        })
        this.isNotVisible = false
        this.resetListQuery()
      }).catch(() => {})
    },
    // 确定认证
    toNaer () {
      if (localStorage.getItem('name') === null) {
        this.$message({
          message: '未获取到认证信息！请重试！',
          duration: 3000,
          type: 'warning'
        })
      } else {
        this.form.userName = localStorage.getItem('name')
        if (localStorage.getItem('sex') === '男') {
          this.form.sex = 1
        } else {
          this.form.sex = 2
        }
        this.imgUrl = localStorage.getItem('pic')
      }
    },
    handleDeatil (id) {
      httpGet(getAIDuyDetail + id)
        .then(res => {
          this.detail.push(res.data)
        }).catch(() => {})
    },
    radioChange (value) {
      let idArr = this.memberId.split('-')
      const data = {
        dcCode: this.memberId,
        type: value,
        dutyCompanyId: idArr[idArr.length - 2]
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
      this.form = Object.assign(this.form, value)
    },
    // 获取成员数据
    fetchData () {
      httpGet(getAIDuyUser, this.listQuery)
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
        departmentId: this.$store.getters.departmentId,
        offset: 1,
        limit: 10,
        dcCode: this.memberId
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
      if (this.memberId === '-0-') {
        this.$message.warning('未分配部门不能添加用户')
      } else if (this.memberId.split('-').length > 2) {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.resetForm()
          this.$refs['dataform'].clearValidate()
          this.$refs.uploadPhoto.imageUrl = ''
          this.fileData.photo = ''
          this.getCode()
        })
      } else {
        this.$message.warning('请先选择部门进行添加')
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
      this.$confirm('确认删除所选中的记录吗？', '提示', {})
        .then(() => {
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
          })
        }).catch(() => {})
    },
    // 删除所有
    handleAllDelete () {
      if (this.memberId.split('-').length > 2) {
        this.$confirm('确认删除所有的记录吗？', '提示', {})
          .then(() => {
            this.deleteAllLoading = true
            httpDelete(AIMember + '/' + this.$store.getters.departmentId + '/' + this.memberId).then(res => {
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
      } else {
        this.$message.warning('请先选择部门进行删除')
      }
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
          this.form = Object.assign(this.form, {
            dcCode: this.memberId,
            dutyCompanyId: this.memberId.split('-')[this.memberId.split('-').length - 2]
          })
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
      this.text = 'adapt'
      this.idId = row.dutyCompanyId
      this.watchChannel()
      this.isCheck = undefined
      this.dialogCheckVisible = true
      this.rowId = row.id
      this.showType = row.type
    },
    watchChannel () {
      httpGet(getAccountCamera + '/' + this.idId).then(res => {
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
      if (this.isCheck === undefined) {
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
              this.imgUrl = res.data.file
            })
          } else {
            this.$message.error('暂未获取到数据')
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
    }
  }
}
</script>
