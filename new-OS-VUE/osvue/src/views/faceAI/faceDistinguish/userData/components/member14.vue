<template>
  <div style="margin-top: 20px;">
    <h4><el-tag v-if="userloginName">登录名:{{userloginName}}</el-tag> 用户列表</h4>
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="resetListQuery" icon="el-icon-refresh">刷新</el-button>
      <el-button class="filter-item" type="primary"  @click="handleCreate"  icon="el-icon-edit">添加</el-button>
      <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
      <el-button class="filter-item" type="danger"  :loading = "deleteLoading" @click="handleDelete" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
      <el-button class="filter-item" type="danger" plain :loading = "deleteAllLoading" @dblclick.native="handleAllDelete"  icon="el-icon-delete">删除所有</el-button>
    </div>
    <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
      <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
      <el-table-column label="工种名称" align="center" prop="workType" v-if="themeType === 5"></el-table-column>
      <el-table-column label="姓名" align="center" prop="userName"></el-table-column>
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          {{sexFormatter(scope.row.sex)}}
        </template>
      </el-table-column>
       <el-table-column v-if="isShow" label="韦根卡号" align="center" prop="wiegandCard"></el-table-column>
      <!-- <el-table-column label="账户关系" align="center" prop="relationship"></el-table-column> -->
      <el-table-column :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : (themeType === 4? '校验码' : '身份证号')))" align="center" prop="idCard"></el-table-column>
      <el-table-column label="手机号" align="center" prop="phone">
        <template slot-scope="scope">
            <template v-if="isShowColumnFormatter(['隐藏手机号'])">{{scope.row.phone | hiddenPhone}}</template>
            <template v-else>{{scope.row.phone}}</template>
          </template>
      </el-table-column>
      <!-- <el-table-column :label="themeType === 1 ? '详细住址' :'地址'" align="center" prop="addr"></el-table-column> -->
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="!scope.row.type">非访客</span>
          <span v-if="scope.row.type">访客</span>
        </template>
      </el-table-column>
      <el-table-column label="IC卡号" align="center" prop="accessCardId"></el-table-column>
      <el-table-column label="审核状态" align="center" prop="isCheck">
        <template slot-scope="scope">
          {{checkStatusFormatter(scope.row.isCheck)}}
        </template>
      </el-table-column>
      <el-table-column label="同步信息" align="center" prop="aiPower"></el-table-column>
      <el-table-column label="账户关系" align="center" prop="relationship">
        <template slot-scope="scope">
          {{relationshipFormatter(scope.row.relationship)}}
        </template>
      </el-table-column>
      <el-table-column label="有效日期" align="center" prop="endTime">
        <template slot-scope="scope">
          {{timeFormatter(scope.row.endTime)}}
        </template>
      </el-table-column>
      <el-table-column label="备注信息" align="center" prop="remarks"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button type="primary" @click.native.prevent="downFa(scope.row)" size="mini">重新下发</el-button>
          <el-button type="primary" @click.native.prevent="handlePeopleScanCode(scope.row)" size="mini">住户绑定码</el-button>
          <el-button type="primary" @click.native.prevent="handleUpdate(scope.row)" size="mini">编辑</el-button>
          <el-button type="primary" @click.native.prevent="handleEditPhoto(scope.row)" style="margin-top:0.5rem" size="mini">编辑照片</el-button>
          <el-button type="primary" style="margin-top:5px" @click.native.prevent="handleSeePhoto(scope.row)" size="mini">查看图片</el-button>
          <el-button v-if="scope.row.isCheck === 2" style="margin-top:5px" type="primary" @click.native.prevent="handlePermisson(scope.row)" size="mini">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background  :page-sizes="[5,10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </div>
    <!-- 新增或者修改 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync = "dialogFormVisible" width="48%">
      <!-- 后期可能会用上 只需跟后端重新对接口，不需要图片检验那种 -->
      <!-- <el-tag style="margin-bottom:0.8rem;margin-left:3rem" @dblclick.native="isReal = true">如果您正好有匹配的中控身份证阅读器，可供选择实名认证哦</el-tag> -->
      <el-button v-show="isReal" @click.native="isReal = false">关闭实名认证</el-button>
      <iframe v-show="isReal" scrolling="no" name='child' style="border:none;width:100%;height:20.5rem"
      src = 'https://beta.cytingchechang.com/attendance/base.html'></iframe>
      <el-button v-show="isReal" plain type='danger' style="margin:0.75rem" @click.native="toNaer">确定认证</el-button>
      <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="IC卡号">
          <el-input v-model="form.accessCardId" placeholder="请输入IC卡号"></el-input>
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="form.sex">
            <el-radio :label = 1>男</el-radio>
            <el-radio :label = 2>女</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="账户关系">
          <el-select v-model="form.relationship">
            <el-option v-for="(option, index) in relationshipSelect" :key="index" :label="option.relationshipName" :value="option.relationshipType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="themeType === 1 ? '校验码' : (themeType === 2? '工号' : (themeType === 3? '学号' : (themeType === 4? '校验码' : '身份证号')))" prop="idCard">
          <el-input v-model="form.idCard" :disabled="themeType === 1 || themeType === 4 ? true: false"></el-input>
        </el-form-item>
        <el-form-item label="韦根卡号" prop="wiegandCard" v-if="isShow">
          <el-input v-model="form.wiegandCard" placeholder="请输入韦根卡号"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="tel" v-model="form.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="canType === 0" :label="themeType === 1 ? '详细住址' :'地址'" prop="addr">
          <el-input v-model="form.addr" placeholder="请输入用户地址"></el-input>
        </el-form-item>
        <el-form-item v-if="canType === 1" label="用户地址" prop="floorNum">
            单元：<el-input style="width:210px;margin-right:20px" v-model="form.floorNum" placeholder="请输入单元号"></el-input>
            房号：<el-input style="width:210px;" v-model="form.roomNum" placeholder="请输入房号"></el-input>
          </el-form-item> -->
        <el-form-item label="工种" v-show="themeType === 5">
          <el-radio-group v-model="form.workType">
            <el-radio v-for="(option, index) in typeList" :key="index" :label="option.workName">{{option.workName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="dialogStatus === 'create'">
          <el-form-item label="图片" required>
              <el-radio :disabled="false" v-model="ifCheck" label="1">不跳过校验</el-radio>
              <el-radio :disabled="false" v-model="ifCheck" label="2">跳过校验</el-radio>
              <div v-show="ifCheck==='1'">
                 <upload-photo :foo.sync="photoType"  ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
              </div>
           <div v-show="ifCheck==='2'" >
             <no-upload-photo :foo.sync="photoType" ref="uploadPhoto" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></no-upload-photo>
           </div>
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
        <el-form-item label="上班时长"  v-if="shangban">
           <el-button :loading = "updataLoading" type="primary" @click="showss" v-if="isshowTime&&aiTokenIds.length>0" style="margin-bottom:20px;margin-left:10px">选择</el-button>
             <el-button :loading = "updataLoading" type="primary" @click="setss" v-else style="margin-bottom:20px;margin-left:10px">去设置</el-button>
        </el-form-item>
         <div v-if="tags" >
         <el-table
    ref="multipleTable"
    :data="choosearr"
    row-key="id"
    v-if="dd==1"
    style="width: 100%;padding: 0 25px;
    box-sizing: border-box;"
     max-height="400" >
     <el-table-column
     label="选择"
      width="60">
      <template slot-scope="scope">
        <el-radio v-model="radioss" :label="scope.row.id">
           <span></span>
        </el-radio>
      </template>
    </el-table-column>
    <el-table-column
      label="第一阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.firstStage">{{getTime(scope.row.firstStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.firstStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="第二阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.secondStage">{{getTime(scope.row.secondStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.secondStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <!-- 添加有效期  validFlg  0永久有效   1 当天有效 -->
   <el-table-column
      prop="address"
      label="有效期"
      width="200">
      <template slot-scope="scope">
            <p v-if="scope.row.workday">
            <span v-for="(item,index) in scope.row.workday.split(',')"  :key="index" >
               <i style="font-style:normal" v-if="item==1">{{item>0?'周':''}}一</i>
               <i style="font-style:normal" v-if="item==2">{{item>0?'周':''}}二</i>
               <i style="font-style:normal" v-if="item==3">{{item>0?'周':''}}三</i>
               <i style="font-style:normal" v-if="item==4">{{item>0?'周':''}}四</i>
               <i style="font-style:normal" v-if="item==5">{{item>0?'周':''}}五</i>
               <i style="font-style:normal" v-if="item==6">{{item>0?'周':''}}六</i>
               <i style="font-style:normal" v-if="item==0">{{item==0?'周':''}}日</i>
            </span>
            <i style="font-style:normal" >(当天有效)</i>
            </p>
            <p v-else>
            <span v-if="scope.row.startDt">{{getTimes(scope.row.startDt/1)}}</span>
            <span v-if="scope.row.endDt">-{{getTimes(scope.row.endDt/1)}}</span>
            <i style="font-style:normal" >(长期有效)</i>
            </p>
      </template>
    </el-table-column>
    </el-table>
     <p v-if="dd==2" style="margin-left:70px;margin-top:-25px;margin-bottom:25px">
     <!-- 无数据 -->
     <span style="color:#3a8ee6;cursor:pointer;display:inline-block;vertical-align: top;margin-left:40px" @click="setss" >去设置或绑定</span>
     </p>
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
    <el-dialog title="成员审核" width="40%" :visible.sync = "dialogCheckVisible">
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
        <el-form-item label="上班时长"  v-if="shangban">
           <el-button :loading = "updataLoading" type="primary" @click="showss" v-if="isshowTime&&aiTokenIds.length>0" style="margin-bottom:20px;margin-left:10px">选择</el-button>
             <el-button :loading = "updataLoading" type="primary" @click="setss" v-else style="margin-bottom:20px;margin-left:10px">去设置</el-button>
        </el-form-item>
         <!-- 时长选择 -->
        <!-- <el-form-item   > -->
          <div v-if="tags" >
         <el-table
    ref="multipleTable"
    :data="choosearr"
    row-key="id"
    v-if="dd==1"
    style="width: 100%;padding: 0 25px;
    box-sizing: border-box;"
     max-height="400" >
     <el-table-column
     label="选择"
      width="60">
      <template slot-scope="scope">
        <el-radio v-model="radioss" :label="scope.row.id">
           <span></span>
        </el-radio>
      </template>
    </el-table-column>
    <el-table-column
      label="第一阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.firstStage">{{getTime(scope.row.firstStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.firstStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      label="第二阶段"
      width="150">
      <template slot-scope="scope">
            <span v-if="scope.row.secondStage">{{getTime(scope.row.secondStage.toString().split(',')[0]/1)}}-{{getTime(scope.row.secondStage.toString().split(',')[1]/1)}}</span>
            <span v-else></span>
      </template>
    </el-table-column>
    <!-- 添加有效期  validFlg  0永久有效   1 当天有效 -->
   <el-table-column
      prop="address"
      label="有效期"
      width="200">
      <template slot-scope="scope">
            <p v-if="scope.row.validFlg==1">
            <span v-for="(item,index) in scope.row.workday.split(',')"  :key="index" >
               <i style="font-style:normal" v-if="item==1">{{item>0?'周':''}}一</i>
               <i style="font-style:normal" v-if="item==2">{{item>0?'周':''}}二</i>
               <i style="font-style:normal" v-if="item==3">{{item>0?'周':''}}三</i>
               <i style="font-style:normal" v-if="item==4">{{item>0?'周':''}}四</i>
               <i style="font-style:normal" v-if="item==5">{{item>0?'周':''}}五</i>
               <i style="font-style:normal" v-if="item==6">{{item>0?'周':''}}六</i>
               <i style="font-style:normal" v-if="item==0">{{item==0?'周':''}}日</i>
            </span>
            <i style="font-style:normal" >(当天有效)</i>
            </p>
            <p v-else>
            <span v-if="scope.row.startDt">{{getTimes(scope.row.startDt/1)}}</span>
            <span v-if="scope.row.endDt">-{{getTimes(scope.row.endDt/1)}}</span>
            <i style="font-style:normal" >(长期有效)</i>
            </p>
      </template>
    </el-table-column>
    </el-table>
     <p v-if="dd==2" style="margin-left:70px;margin-top:-25px;margin-bottom:25px">
     <!-- 无数据 -->
     <span style="color:#3a8ee6;cursor:pointer;display:inline-block;vertical-align: top;margin-left:10px" @click="setss" >去设置或绑定</span>
     </p>
    </div>
     <!-- <el-button :loading = "updataLoading" type="primary" @click="saveTime" style="margin-top:20px">保存</el-button>
      <el-button :loading = "updataLoading" type="primary" @click="cancelTime" style="margin-top:20px">取消</el-button> -->
    <!-- </el-form-item> -->
        <!-- 时长选择结束 -->
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
    <el-dialog title="住户绑定码" :visible.sync="dialogQRVisible" width="540px">
      <div class="box-code-body">
        <div class="box-code-left">
          <div style="margin-top: 20px;" id="qrcode2" ref="qrcode2"></div>
        </div>
        <div class="box-code-right">
          <div>
            <p>一人一码</p>
            <p>可通过扫描此二维码,在手机端进行直接绑定进出推送及个人服务</p>
          </div>
          <div class="box-code-body-btn">
            <p><el-button class="box-code-body-btn-style" type="primary" @click="downCode" size="mini">下载二维码</el-button></p>
            <p><el-button class="box-code-body-btn-style copyCodebtn" size="mini" :data-clipboard-text="codeUrl" @click="copyCode">复制链接</el-button></p>
          </div>
        </div>
      </div>
    </el-dialog>
           <el-dialog title="下发相机" width="40%" :visible.sync = "isChannelVisible">
        <el-form label-position="right" autoComplete="on" label-width="100px">
          <el-form-item label="分配通道">
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
          <el-button @click="isChannelVisible = false">取消</el-button>
          <el-button type="primary" @click="queDown">保存</el-button>
        </div>
      </el-dialog>
            <!-- 编辑图片操作 -->
       <el-dialog title="编辑图片" width="40%" :visible.sync = "isEditPhoto">
        <el-form :model="editPhotoForm" :rules="editPhotoRules" ref="checkUserPhotoEdit" label-width="100px" >
          <el-form-item label="密码" required prop="password">
            <el-input v-model="editPhotoForm.password" placeholder="请输入密码..."></el-input>
          </el-form-item>
           <el-form-item label="编辑照片" required >
            <upload-photo :foo.sync="photoType" :name="'file'" v-on:photoNumber = "photoNumber" :action="action" :fileData="fileData" :imgValue ="imgUrl"></upload-photo>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEditPhoto = false">取消</el-button>
          <el-button type="primary" @click="commitUserPhoto">保存</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import QRcode from 'qrcodejs2'
import { mapGetters } from 'vuex'
import { isShowColumnFormatter, relationshipFormatter, sexFormatter, checkStatusFormatter, personFormatter, timeFormatter } from '@/utils/formatter.js'
import { personType } from '@/utils/selectAble.js'
import { checkPhone, checkRemarks } from '@/utils/validator.js'
import { faceDetect, getAIMember, getAccountCamera, addTypeUser, AIMember, uploadAImMember, checkIsAddAIMember, checkAIMemeber, seeAIMemberPhoto, updateMemberPhoto, getUUid, getWxQRcode, getDates, getAItokens, getUserChannel, reDownFa, apiUserEditPhoto } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import UploadPhoto from './UploadPhoto/index.vue'
import noUploadPhoto from './UploadPhotoNoCheck/index.vue'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    UploadPhoto, // 不用跳过校验的图片上传组件
    noUploadPhoto // 跳过校验的图片上传组件
  },
  props: {
    memberId: {
      type: Number,
      required: true
    },
    userAddr: {
      type: String,
      required: true
    },
    dates: {
      type: Array,
      required: true
    },
    isShow: {
      type: Boolean,
      required: true
    },
    userloginName: {
      type: String
    }
  },
  name: 'member',
  watch: {
    memberId (curVal, oldVal) {
      this.listQuery.dutyCompanyId = curVal
      this.fetchData()
    },
    userAddr (curVal, oldVal) {
      this.ad = curVal
    },
    photoType (n, o) {
      console.log(n, o)
    }
  },
  created () {
    this.ad = this.userAddr
    // this.getDate ('1,2,3')
  },
  mounted () {
    this.listQuery.dutyCompanyId = this.memberId
    this.fetchData()
    this.getWorkType()
  },
  data () {
    return {
      photoType: undefined, // 文件后缀
      editPhotoForm: {// 编辑照片form
        id: '',
        password: '',
        photo: ''
      },
      editPhotoRules: {// 编辑照片form 规则
        password: [
          {required: true, message: '密码不能为空！', trigger: 'blur'}
        ]
      },
      password: '',
      isEditPhoto: false,
      isChannelVisible: false,
      useId: '',
      ifCheck: '1', // 是否跳过校验
      channelArr: [],
      ad: undefined,
      tags: false,
      updataLoading: false,
      choosearr: [],
      isReal: false,
      timeLimit: undefined,
      customTime: undefined,
      showType: undefined,
      shangban: false,
      radioss: '',
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
      aiTokenIds: [],
      channelId: undefined,
      relationshipFormatter: relationshipFormatter,
      uploadAImMember,
      action: faceDetect,
      typeList: [],
      relationshipSelect: [
        {
          relationshipType: 0,
          relationshipName: '夫妻'
        },
        {
          relationshipType: 1,
          relationshipName: '父子'
        },
        {
          relationshipType: 2,
          relationshipName: '父女'
        },
        {
          relationshipType: 3,
          relationshipName: '叔侄'
        },
        {
          relationshipType: 4,
          relationshipName: '其他'
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
        offset: 1,
        limit: 5
      },
      tableData: [],
      dd: -1,
      total: null,
      isShowColumnFormatter: isShowColumnFormatter,
      checkStatusFormatter: checkStatusFormatter,
      personFormatter: personFormatter,
      timeFormatter: timeFormatter,
      sexFormatter: sexFormatter,
      personType: personType,
      dialogFormVisible: false,
      dialogCheckVisible: false,
      dialogPhotoVisible: false,
      dialogQRVisible: false,
      disabled: true,
      val: undefined,
      selectArrayId: [],
      dialogStatus: '',
      textMap: {
        update: '编辑成员',
        create: '添加成员'
      },
      idId: undefined,
      isshowTime: false,
      form: {
        id: undefined,
        accessCardId: undefined,
        userName: undefined,
        phone: undefined,
        photo: null,
        workType: undefined,
        idCard: undefined,
        addr: undefined,
        type: undefined,
        wiegandCard: '',
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined,
        sex: undefined,
        relationship: undefined,
        floorNum: undefined,
        roomNum: undefined
      },
      formRules: {
        userName: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '不可为空'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        addr: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        remarks: [
          {validator: checkRemarks, trigger: 'blur'}
        ]
      },
      rowId: undefined,
      codeUrl: '',
      jsonData: [
        {
          title: '工种名称',
          key: 'workType',
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
          title: '韦根卡号',
          key: 'wiegandCard',
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
          title: '类型',
          key: 'type',
          type: 'text'
        },
        {
          title: 'IC卡号',
          key: 'accessCardId',
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
          title: '账户关系',
          key: 'relationship',
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
      this.jsonData[4]['title'] = parseInt(this.themeType) === 1 ? '校验码' : (parseInt(this.themeType) === 2 ? '工号' : (parseInt(this.themeType) === 3 ? '学号' : (parseInt(this.themeType) === 4 ? '校验码' : '身份证号')))
      if (!this.isShow) {
        this.jsonData.splice(3, 1)
      }
      if (parseInt(this.themeType) !== 5) {
        this.jsonData.splice(0, 1)
      }
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.phone = this.isShowColumnFormatter(['隐藏手机号']) ? this.func(item.phone) : item.phone
        item.type = item.type ? '访客' : '非访客'
        // item.type = parseInt(item.status) === 0 ? '离线' : (parseInt(item.status) === 1 ? '在线' : '')
        item.isCheck = this.checkStatusFormatter(item.isCheck)
        item.endTime = this.timeFormatter(item.endTime)
        item.sex = this.sexFormatter(item.sex)
        item.relationship = this.relationshipFormatter(item.relationship)
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
    commitUserPhoto () {
      this.$refs.checkUserPhotoEdit.validate((valid) => {
        let imgData = {
          photo: this.fileData.photo,
          id: this.rowId,
          photoType: this.photoType
        }
        this.editPhotoForm = Object.assign({}, this.editPhotoForm, imgData) // 合并
        httpPost(apiUserEditPhoto, this.editPhotoForm).then(res => {
          // console.log('请求成功... ', res)
          this.$message({
            type: 'success',
            message: res.message,
            duration: 3000
          })
          this.isEditPhoto = false // 关闭编辑照片模态框
        }).catch(() => {
          // console.log('请求失败： ', err)
          // this.$message({
          //   type: 'warning',
          //   message: '保存失败！',
          //   duration: 3000
          // })
        })

        // console.log('验证：', this.editPhotoForm)
        // console.log(this.imgUrl, this.rowId)
        // console.log('用户数据信息', this.editPhotoForm)
      })
    },
    // 编辑图片
    async handleEditPhoto (row) {
      await this.getCurrentUserPhoto(row) // 获取现有图片
      // console.log('开始编辑图片进行操作： ', img)
      this.isEditPhoto = true // 打开编辑照片模态框
      // console.log('图片信息： ', this.fileData, this.imgUrl)
    },
    getCurrentUserPhoto (row) {
      return new Promise((resolve, reject) => {
        httpPost(seeAIMemberPhoto + row.id)
          .then(res => {
            if (res.data !== null) {
              this.rowId = row.id
              // console.log('查看照片请求：', res)
              this.$nextTick(() => {
                this.fileData.photo = res.data.photo
                // 修改base64
                let newBase64 = res.data.file
                this.imgUrl = 'data:image/jpg;base64,' + newBase64
                // this.imgUrl = 'data:image/jpg;base64,' + res.data.file
                resolve(res.data.file) // end
              })
            } else {
              this.rowId = row.id
              this.fileData.photo = ''
              this.$message.error('图片获取失败')
            }
          }).catch(() => { })
      })
    },
    queDown () {
      console.log(this.channelId)
      httpPost(reDownFa, {
        aiTokenId: this.channelId,
        aiUserId: this.useId
      }).then((res) => {
        // console.log('请求下发数据信息成功： ', res)
        this.$message({
          message: res.message,
          duration: 3000,
          type: 'success'
        })
        this.isChannelVisible = false
      }).catch(() => {})
    },
    downFa (row) {
      console.log('点击下发数据信息： ', row.id)
      httpGet(getUserChannel + '/' + row.id).then((res) => {
        if (res.data.length === 0) {
          this.$message({
            message: '请先配置通道',
            type: 'warning',
            duration: 4 * 1000
          })
        } else {
          console.log('获取到的下发数据信息：', res.data, res.data.length)

          this.channelArr = res.data
          this.useId = row.id
          this.isChannelVisible = true
        }
      }).catch(() => {})
    },
    getWorkType () {
      httpGet(addTypeUser + '/' + this.$store.getters.departmentId)
        .then((res) => {
          this.typeList = res.data
        }).catch((err) => {
          console.log(err)
        })
    },
    cancelTime () {
      // 重置
      this.radioss = ''
      this.tags = false
    },
    ischecks (arr, indexs) {
      // 判断数组中是否有这个元素
      let indexss = -1
      arr.forEach((item, index) => {
        if (item.id === indexs) {
          indexss = index
        }
      })
      if (indexss >= 0) {
        return true
      } else {
        return false
      }
    },
    ischeck (arr, indexs) {
      // 判断数组中是否有这个元素
      let indexss = -1
      arr.forEach((item, index) => {
        if (item === indexs) {
          indexss = index
        }
      })
      if (indexss >= 0) {
        return true
      } else {
        return false
      }
    },
    getTime (time) {
      // 转换时分秒显示给用户看
      let date = new Date(time)
      // let year = date.getFullYear()
      // let month = date.getMonth()/1 + 1
      // let day = date.getDate()
      let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      // let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return h + ':' + m
    },
    getTimes (time) {
      // 转换时分秒显示给用户看
      let date = new Date(time)
      let year = date.getFullYear()
      let month = date.getMonth() / 1 + 1
      let day = date.getDate()
      // let h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
      // let m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
      // let s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
      return year + '/' + month + '/' + day
    },
    getDate (id) {
      // 查询时长
      // let that = this
      this.choosearr = []
      this.dd = -1
      // console.log(11111)
      httpGet(getDates, {id: id, departmentId: this.$store.getters.departmentId}).then(res => {
        this.choosearr = res.data
        if (this.choosearr.length > 0) {
          this.dd = 1
        } else {
          this.dd = 2
        }
      }).catch(() => {
        this.dd = 2
      })
    },
    setss () {
      // 去设置时长
      this.$router.push('/cameraMaintain/cameraManage')
    },
    showss () {
      // 查询绑定时长数据
      this.tags = true
      this.radioss = ''
      // this.aiTokenIds = ['2231', ]
      // aiTokenIds数组转换,拼接字符串
      let arrs = ''
      this.aiTokenIds.forEach((item, index) => {
        if (this.aiTokenIds.length - 1 === index) {
          arrs += item
        } else {
          arrs += item + ','
        }
      })
      this.getDate(arrs)
    },
    // 实名认证
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
    changeTimeKinds (val) {
      console.log(val)
      this.val = val
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
      this.form = Object.assign(this.form, value)
    },
    // 获取成员数据
    fetchData () {
      httpGet(getAIMember, this.listQuery)
        .then(res => {
          // res = {"code":1,"message":"成功","data":{"total":1,"rows":[{"id":29371,"userName":"维生素","workType":null,"idCard":"287534915811615","phone":"16633558877","addr":"第c栋单元202号房间","floorNum":null,"roomNum":null,"wiegandCard":"","isCheck":2,"beginTime":1597463947000,"endTime":1600142347000,"type":0,"aiPower":"东方:下发中","remark":"成功","sex":1,"relationship":null,"dutyCompanyId":21517,"remarks":null,"visitReasons":null,"photo":"B6BA5771A04F4DBBBA66BDFEAA9AAF6C","accessCardId":null,"userPost":null,"errorMsg":null,"aiTokenIds":["2231"]}]}}
          if (res.data === null || res.data.rows === null) {
            this.tableData = []
            this.total = 0
          } else {
            this.tableData = res.data.rows
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].floorNum !== null) {
                this.tableData[i].addr = this.tableData[i].floorNum + '-' + this.tableData[i].roomNum
              }
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
        type: undefined,
        wiegandCard: '',
        addr: undefined,
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
            this.form.addr = this.ad
          }).catch(() => {})
      }
    },
    // 添加
    handleCreate () {
      this.resetForm()
      this.tags = false
      this.radioss = ''
      this.shangban = false
      this.isshowTime = false
      this.aiTokenIds = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataform'].resetFields()
        this.$refs.uploadPhoto.imageUrl = ''
        this.fileData.photo = ''
        this.getCode()
      })
      if (this.themeType === 5) {
        this.getWorkType()
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
    // handleDelete () {
    //   this.$confirm('确认删除所选中的记录吗？', '提示', {
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.deleteLoading = true
    //       httpDelete(AIMember, {ids: this.selectArrayId}).then(res => {
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
        this.deleteLoading = true
        // document.onkeydown = undefined
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
    },
    // 删除所有
    // handleAllDelete () {
    //   this.$confirm('确认删除所有的记录吗？', '提示', {
    //     type: 'error'
    //   })
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
        this.deleteAllLoading = true
        // document.onkeydown = undefined
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
            console.log(this.form.beginTime)
            this.form.endTime = (this.timeFormatter(this.form.endTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
          }
          this.createLoading = true
          this.form = Object.assign(this.form, {dutyCompanyId: this.memberId, photoType: this.photoType})
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
      this.tags = false
      this.radioss = ''
      this.shangban = false
      this.isshowTime = false
      this.aiTokenIds = []
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      this.getaitokens(row.dutyCompanyId, row.type, 2)
      // if (row.type) {
      //   this.shangban = false
      // } else {
      //   this.shangban = true
      // }
      // console.log(row.dutyCompanyId)
    },
    updateData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          if (this.form.type === 1) {
            this.form.beginTime = (this.timeFormatter(this.form.beginTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
            this.form.endTime = (this.timeFormatter(this.form.endTime - 8 * 60 * 60 * 1000) + '.000Z').replace(' ', 'T')
          }
          this.updateLoading = true
          const updateFormData = Object.assign({}, this.form)
          updateFormData.workScheduleId = this.radioss
          updateFormData.photoType = this.photoType
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
    getaitokens (dutyCompanyId, type, el) {
      // this.isshowTime = false
      // this.aiTokenIds = []
      httpGet(getAItokens + dutyCompanyId).then(res => {
        if (res.data.length > 0) {
          this.isshowTime = true
          this.aiTokenIds = res.data
        } else {
          this.isshowTime = false
          this.aiTokenIds = []
        }
        // console.log(11111, this.aiTokenIds, type)
        if (type || this.aiTokenIds.length <= 0) {
          this.shangban = false
        } else {
          this.shangban = true
        }
        if (el === 1) {
          this.dialogCheckVisible = true
        } else if (el === 2) {
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.dataform.clearValidate()
            if (!this.form.idCard) {
              this.getCode()
            }
          })
        }
      }).catch(() => {
        if (el === 1) {
          this.dialogCheckVisible = true
        } else if (el === 2) {
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs.dataform.clearValidate()
            if (!this.form.idCard) {
              this.getCode()
            }
          })
        }
      })
    },
    handlePermisson (row) {
      this.idId = row.dutyCompanyId
      this.watchChannel()
      // 点击审核重置选择时长
      this.tags = false
      this.radioss = ''
      this.shangban = false
      this.isshowTime = false
      this.aiTokenIds = []
      this.isCheck = 'undefined'
      this.rowId = row.id
      this.showType = row.type
      // if (row.type) {
      //   this.shangban = false
      // } else {
      //   this.shangban = true
      // }
      // console.log(this.showType)
      // console.log(this.dates)
      // 根据aiTokenIds判断是否绑定上班时间
      this.getaitokens(row.dutyCompanyId, row.type, 1)
    },
    isCheckData () {
      if (this.isCheck === 'undefined') {
        this.$message.error('请先选择审核的状态')
      } else {
        const data = {
          id: this.rowId,
          isCheck: this.isCheck,
          customTime: this.customTime,
          timeLimit: this.timeLimit,
          departmentId: this.$store.getters.departmentId,
          channelId: this.channelId,
          workScheduleId: this.radioss
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
    // 生成二维码
    createQrCode () {
      this.createCode = new QRcode('qrcode2', {
        text: this.codeUrl,
        width: 200,
        height: 200
      })
    },
    // 下载二维码
    downCode () {
      let img = document.getElementById('qrcode2').getElementsByTagName('img')[0]
      let triggerDownLoad = document.createElement('a')
      triggerDownLoad.setAttribute('href', img.src)
      triggerDownLoad.setAttribute('downLoad', '住户绑定码.png')
      triggerDownLoad.click()
    },
    copyCode () {
      let clipboard = new Clipboard('.copyCodebtn')
      clipboard.on('success', e => {
        this.$message.success('复制成功')
        clipboard.destroy() // 使用destroy可以清楚缓存
      })
    },
    handlePeopleScanCode (row) {
      let params = {
        departmentId: this.$store.getters.departmentId,
        aiUserId: row.id
      }
      this.dialogQRVisible = true
      // this.$nextTick(() => {
      //   let QrCodeHTML = this.$refs.qrcode2
      //   console.log(this.$refs)
      //   QrCodeHTML.innerHTML = ' '
      //   this.createQrCode()
      //   this.createCode.clear()
      //   this.codeUrl = '123123'
      //   this.createCode.makeCode(this.codeUrl)
      // })
      httpGet(getWxQRcode, params).then(res => {
        if (res.data) {
          this.$nextTick(() => {
            let QrCodeHTML = this.$refs.qrcode2
            QrCodeHTML.innerHTML = ' '
            this.createQrCode()
            this.codeUrl = res.data
            this.createCode.clear()
            this.createCode.makeCode(this.codeUrl)
          })
        }
      }).catch(() => {})
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
            this.$message.error('暂未获取到图片,请重新添加')
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
<style lang='scss' scoped>
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
</style>
