<template>
  <div class="app-container">
    <div class="table-main">
        <!-- 操作 -->
        <div class="filter-container">
          <el-cascader
           style="width: 280px;"
            size="large"
            class="filter-item"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange"
          ></el-cascader>
          <el-input clearable style="width: 200px;" v-model="listQuery.name" class="filter-item" :placeholder="themeType === 3 ? '学校' : '名称'"></el-input>
          <el-select v-if="(themeType === 3) && (!isShowColumnFormatter(['有为学校']))" clearable v-model="listQuery.departmentTypeId"  class="filter-item" placeholder="类型">
              <el-option v-for="item in depType" :key="item.id" :label="item.typeName" :value="item.id">
                <span style="float: left">{{ item.typeName }}</span>
                <span style="float: right; color: red; font-size: 13px"><i style="font-size: 13px;" :class="isIconFormatter(item.icon)"></i></span>
              </el-option>
          </el-select>
          <el-button class="filter-item searchs" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="handleRefresh"  icon="el-icon-refresh">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        </div>
        <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600" :data="tableData" v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" v-if="isShowColumnFormatter(['删除'])" ></el-table-column>
        <el-table-column :label="themeType === 3 ? '学校名称' : '部门名称'" align="center" prop="departmentName"></el-table-column>
        <el-table-column label="联系电话" align="center" prop="phone"></el-table-column>
        <el-table-column label="唯一编号" align="center" prop="unicode"></el-table-column>
        <el-table-column label="密钥" align="center" prop="secret"></el-table-column>
        <el-table-column v-if="(themeType === 3) && (isShowColumnFormatter(['有为学校']))" label="年级&班级" align="center">
          <template slot-scope="scope">
            <el-button size=mini @click="checkBtn(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="!isShowColumnFormatter(['有为学校'])" label="部门级别" align="center" prop="level">
          <template slot-scope="scope">
            {{levelFormatter(scope.row.level)}}
          </template>
        </el-table-column>
        <el-table-column v-if="isShowColumnFormatter(['有为学校'])" label="省市区" align="center">
           <el-table-column prop="province" label="省">
        </el-table-column>
        <el-table-column
          prop="city"
          label="市">
        </el-table-column>
        <el-table-column
          prop="county"
          label="区">
        </el-table-column>
        </el-table-column>
        <el-table-column label="备注信息" align="center" prop="typeName"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background  :page-sizes="[10,20,30, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
        <el-dialog title="年级&班级" :visible.sync="isClass">
          <div>
            <div v-for="(item, index) in infoArr" :key="index">
              {{(index === 9 ? '高一' : (index === 10 ? '高二' : (index === 11 ? '高三' : index + 1))) + '年级'}}
              <span v-for="(it, is) in item" :key=is>
                {{it === null ? '': it.name}}
              </span>
            </div>
          </div>
        </el-dialog>
        <el-dialog title="设置会员" :visible.sync="isSetVip">
          <el-form :model="itemForm" :rules="setformRules" autoCompete = "on" label-position="right" label-width="150px">
             <el-form-item label="积分" prop="points" style="width:350px">
                  <el-input v-model="itemForm.points" :min=0 type="Number" class="filter-item" placeholder="请输入积分"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="points" style="width:350px">
                  <el-input v-model="itemForm.password" type="password" class="filter-item" placeholder="请输入密码"></el-input>
                </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="isSetVip = false">取消</el-button>
              <el-button type="primary" @click="setVip">保存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="会员优先下发" :visible.sync="isPriorityUpload">
          <el-form :model="uploadItemForm" :rules="setUploadFormRules" autoCompete = "on" label-position="right" label-width="150px">
              <el-form-item label="优先级别" prop="highest" style="width:350px">
                <el-input v-model="uploadItemForm.highest" class="filter-item" type="Number" :min=0 placeholder="请输入优先级别"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" style="width:350px">
                <el-input v-model="uploadItemForm.password" type="password" class="filter-item" placeholder="请输入密码"></el-input>
              </el-form-item>
          </el-form>
          <p class="upload-title" style="">优先级别越高，越优先！默认优先级为0.</p>
          <div slot="footer"  class="dialog-footer">
              <el-button @click="isPriorityUpload = false">取消</el-button>
              <el-button type="primary" @click="setVipUpload">确定</el-button>
          </div>
        </el-dialog>
         <!-- 测试部专用功能 -->
        <el-dialog title="设置修改" :visible.sync="dialogDiv">
            <el-form :rules="cloneformRules" ref="clonedataform" :model="cloneForm" autoCompete = "on" label-position="right" label-width="150px">
              <el-form-item label="部门类别" prop="departmentTypeId">
                  <el-select v-model="cloneForm.departmentTypeId"  class="filter-item" placeholder="部门类别">
                      <el-option v-for="item in depType" :key="item.id" :label="item.typeName" :value="item.id">
                        <span style="float: left">{{item.typeName}}</span>
                        <span style="float: right; color: red"><i style="font-size: 13px;" :class="isIconFormatter(item.icon)"></i></span>
                      </el-option>
                  </el-select>
              </el-form-item>
              <div >
                <el-form-item label="通讯模式" prop="transportType">
                    <el-select v-model="cloneForm.transportType"  class="filter-item" placeholder="通讯模式">
                        <el-option v-for="item in isTransportType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <!-- <span style="color:red;">备注：车场有效</span> -->
                </el-form-item>
                <el-form-item label="支付方式" prop="epayType">
                    <el-select v-model="cloneForm.epayType"  class="filter-item" placeholder="支付方式">
                        <el-option v-for="item in isPayType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <!-- <span style="color:red;">备注：车场有效</span> -->
                </el-form-item>
                <el-form-item label="车位总数" prop="lotTotal" style="width:350px">
                  <el-input v-model="cloneForm.lotTotal" type="Number" class="filter-item" placeholder="车位总数"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogDiv = false">取消</el-button>
              <el-button type="primary" :disabled="adaptloading" @click="confirmForm">保存</el-button>
          </div>
        </el-dialog>
        <!-- 添加 -->
        <el-dialog title="添加" :visible.sync="dialogFormVisible">
          <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="150px" >
              <el-form-item :label="themeType === 3 ? '学校名称' : '部门名称'" prop="departmentName">
                  <el-input v-model="form.departmentName" placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="系统名称" prop="sysName">
                  <el-input v-model="form.sysName" placeholder="请输入系统名称"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item v-if="(themeType === 3) && (isShowColumnFormatter(['有为学校']))" label="年级&班级">
                  <el-tag type="danger">提示：若无小学部，1-6年级不添班级即可，初高中同理</el-tag>
                  <el-input disabled placeholder="年级  |  班级" style="width:200px"></el-input>
                  <el-tag v-for="(btn, index) in btns" @close="closeTag(btn, index)" style="position:relative;display:block;width:75px;margin-top:0.2rem"
                  :type="btn.type" closable :key="btn.name">{{btn.name}}
                   <div style="position:absolute;left:100px;top:-5px">
                    <el-tag @dblclick.native="adapt(btn, item, index)" v-for="(item, it) in classArr[index]" @close="closeClass(btn, it)" closable :key="item.name">{{item.name}}</el-tag>
                    <el-button @click="addClass2(btn, index)">添加班级</el-button>
                  </div>
                  </el-tag>
                  <el-button @click="addClass" style="margin-top:0.32rem;display:block">添加年级</el-button>
              </el-form-item>
              <el-form-item v-if="(themeType === 3) && (isShowColumnFormatter(['有为学校']))" label="省市区">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="selectedOptions"
                  @change="handleChange1"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="部门类别" v-if="!isShowColumnFormatter(['有为学校'])" prop="departmentTypeId">
                  <el-select v-model="form.departmentTypeId"  class="filter-item" placeholder="部门类别" @change="changeDepartmentId">
                      <el-option v-for="item in depType" :key="item.id" :label="item.typeName" :value="item.id">
                        <span style="float: left">{{item.typeName}}</span>
                        <span style="float: right; color: red"><i style="font-size: 13px;" :class="isIconFormatter(item.icon)"></i></span>
                      </el-option>
                  </el-select>
                  <el-tag type="warning" v-if="isShowColumnFormatter(['添加代理商'])" id="tag">可创建运营级别，也可创建代理级别，请谨慎选择。</el-tag>
              </el-form-item>
              <el-form-item v-if="showId == 1 && !isShowColumnFormatter(['有为学校'])" v-show="checkId !== 5303" label="应用场景" prop="themeType">
                  <el-radio-group v-model="form.themeType">
                    <el-radio v-for="(option, index) in publicizeArr" :key="index" :label="option.value">{{option.label}}</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="项目编号" prop="serialNumber" v-if="form.themeType==9">
                  <el-input v-model="form.serialNumber"  :disabled = "form.themeType!=9"  placeholder="请输入项目编号"></el-input>
              </el-form-item>
              <!-- 判断是否是车场 -->
              <div v-if="isDepartment && type === 0">
                <el-form-item label="通讯模式" prop="transportType">
                    <el-select v-model="form.transportType"  class="filter-item" placeholder="通讯模式">
                        <el-option v-for="item in isTransportType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <span style="color:red;">备注：车场有效</span>
                </el-form-item>
                <el-form-item label="支付方式" prop="epayType">
                    <el-select v-model="form.epayType"  class="filter-item" placeholder="支付方式">
                        <el-option v-for="item in isPayType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <span style="color:red;">备注：车场有效</span>
                </el-form-item>
                <el-form-item label="车位总数" prop="lotTotal">
                    <el-input v-model="form.lotTotal" class="filter-item" placeholder="车位总数"></el-input>
                    <span style="color:red;">备注：车场有效</span>
                </el-form-item>
              </div>
              <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="详细地址" prop="address">
                <div style="display: flex;">
                  <el-input v-model="form.address" :disabled = "true" ></el-input>
                  <el-button type="primary"  @click="innerVisible = true" style="margin-left: 10px">获取地址</el-button>
                </div>
              </el-form-item>
              <el-form-item label="备注信息">
                  <el-input type="textarea" v-model="form.resume" placeholder="请输入备注信息"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" :disabled="createloading" @click="createData">保存</el-button>
          </div>
          <el-dialog
            width="30%"
            title="获取位置信息"
            :visible.sync="innerVisible"
            append-to-body>
            <el-amap-search-box class="search-box" :search-option="searchOption"  :on-search-result="onSearchResult"></el-amap-search-box>
            <div class="amap-wrapper" style="width: 100%;height: 300px;">
              <el-amap  class="amap-box" :center="mapCenter" :zoom="zoom" :vid="'amap-vue'" :events="events">
                <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" ></el-amap-marker>
              </el-amap>
            </div>
            <transition name="fade" mode="out-in">
              <p v-show="addressShow" style="color:red">{{form.address}}</p>
            </transition>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="innerVisible = false">保存</el-button>
            </div>
          </el-dialog>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDetailFormVisible">
          <el-form :rules="formDetailsRules" ref="dataformDetails" :model="formDetails" autoCompete = "on" label-position="right" label-width="150px" >
              <el-form-item :label="themeType === 3 ? '学校名称' :'部门名称'" prop="departmentName">
                  <el-input v-model="formDetails.departmentName" :disabled ="dialogStatus === 'detail'"  placeholder="请输入名称"></el-input>
              </el-form-item>
              <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="系统名称" prop="sysName">
                  <el-input v-model="formDetails.sysName" :disabled ="dialogStatus === 'detail'"  placeholder="请输入系统名称"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="formDetails.phone" :disabled ="dialogStatus === 'detail'"  placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="部门类别" prop="departmentTypeId">
                  <el-select v-model="formDetails.departmentTypeId"  :disabled = "true"  class="filter-item" placeholder="部门类别">
                      <el-option v-for="item in depType" :key="item.id" :label="item.typeName" :value="item.id">
                        <span style="float: left">{{item.typeName}}</span>
                        <span style="float: right; color: red"><i style="font-size: 13px;" :class="isIconFormatter(item.icon)"></i></span>
                      </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="应用场景" v-if='showId == 1' prop="themeType">
                  <el-radio-group v-model="formDetails.themeType" disabled>
                    <el-radio v-for="(option, index) in publicizeArr" :key="index" :label="option.value">{{option.label}}</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="项目编号" prop="serialNumber" v-if="formDetails.themeType == 9">
                  <el-input v-model="formDetails.serialNumber"  :disabled = "true"  placeholder="请输入项目编号"></el-input>
              </el-form-item>
              <el-form-item label="部门编号" prop="unicode">
                  <el-input v-model="formDetails.unicode"  :disabled = "true"  placeholder="请输入部门编号"></el-input>
              </el-form-item>
              <el-form-item label="密钥" prop="secret">
                  <el-input v-model="formDetails.secret"  :disabled = "true"  placeholder="请输入密钥"></el-input>
                  <span style="color:red;">备注：车场类型修改部门编号和密钥需要同步修改车场客户端</span>
              </el-form-item>
              <el-form-item label="默认车牌前缀" v-if="type === 0 && level === 2" prop="defaultPrefix">
                  <el-input v-model="formDetails.defaultPrefix" :disabled ="dialogStatus === 'detail'"  placeholder="请输入默认车牌前缀"></el-input>
              </el-form-item>
              <div v-if="dialogStatus === 'detail' && type === 0 && level === 2" >
                <el-form-item  label="通讯模式" prop="transportType">
                    <el-select v-model="formDetails.transportType" :disabled ="dialogStatus === 'detail'"   class="filter-item" placeholder="类型">
                        <el-option v-for="item in isTransportType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <span style="color:red;">备注：车场有效</span>
                </el-form-item>
                <el-form-item label="总车位" prop="lotTotal">
                    <el-input v-model="formDetails.lotTotal" :disabled ="dialogStatus === 'detail'"  placeholder="请输入总车位"></el-input>
                </el-form-item>
                <el-form-item label="固定车" prop="isMonthlyCard">
                    <el-select v-model="formDetails.isMonthlyCard" :disabled ="dialogStatus === 'detail'"  class="filter-item" >
                        <el-option v-for="item in isMonthlyCardType" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
                    </el-select>
                    <span style="color:red;">备注：车场有效</span>
                </el-form-item>
              </div>
              <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="位置信息" prop="address">
                <div style="display: flex;">
                  <el-input v-model="formDetails.address" :disabled = "true"></el-input>
                  <el-button type="primary" v-if="dialogStatus === 'update'"  @click="getAddress" style="margin-left: 10px">获取地址</el-button>
                </div>
              </el-form-item>
              <el-form-item label="备注信息">
                  <el-input type="textarea" :disabled ="dialogStatus === 'detail'" v-model="formDetails.resume" placeholder="请输入备注信息"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="dialogStatus === 'update'">
              <el-button @click="dialogDetailFormVisible = false">取消</el-button>
              <el-button :loading = "updateloading" type="primary" @click="updateData">保存</el-button>
          </div>
          <el-dialog
            width="30%"
            title="获取位置信息"
            :visible.sync="innerDetailVisible"
            append-to-body>
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onDetailSearchResult"></el-amap-search-box>
            <div class="amap-wrapper" style="width: 100%;height: 300px;">
              <el-amap class="amap-box" :center="detailMapCenter" :zoom="detailZoom" :vid="'amap-vue'"  :events="events">
                <el-amap-marker v-for="(marker, index) in detailMarkers" :key="index" :position="marker.position" :events="marker.events" ></el-amap-marker>
              </el-amap>
            </div>
            <transition name="fade" mode="out-in">
              <p v-show="detailAddressShow" style="color:red">{{formDetails.address}}</p>
            </transition>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="innerDetailVisible = false">保存</el-button>
            </div>
          </el-dialog>
        </el-dialog>
        <!-- 第三方配置 -->
        <el-dialog :title="configFormTitle" :visible.sync="dialogConfigFormVisible">
          <el-form  :model="configForm" autoCompete = "on" label-position="right" label-width="150px" >
              <el-form-item label="应用编号" >
                <el-input v-model="configForm.appId" placeholder="请输入APPID"></el-input>
              </el-form-item>
              <el-form-item label="应用秘钥">
                <el-input v-model="configForm.appSecret" placeholder="请输入secret"></el-input>
              </el-form-item>
              <el-form-item label="商户号">
                <el-input v-model="configForm.mchId" placeholder="请输入商户号(收款账号)"></el-input>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogConfigFormVisible = false">取消</el-button>
              <el-button type="primary" @click="createConfigData">保存</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { regionData, CodeToText } from 'element-china-area-data'
import { isPayFormatter, isTransportFormatter, isIconFormatter, levelFormatter, isShowColumnFormatter } from '@/utils/formatter.js'
import { isPayType, isTransportType, isMonthlyCardType, isPicStoreType } from '@/utils/selectAble.js'
import { checkPhone, checkNumber } from '@/utils/validator.js'
import { getDep, checkAllTypeInfo, setCountVip, updateDepart, department, editDepConfig, getDepTypeById, getSysName, ApiPriorityUpload } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
export default {
  computed: {
    ...mapGetters([
      'type',
      'level',
      'themeType'
    ])
  },
  data () {
    let self = this
    return {
      btns: [],
      classArr: [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
      ],
      isClass: false,
      btns1: [
        {'name': '一年级', type: 'success'},
        {'name': '二年级', type: 'success'},
        {'name': '三年级', type: 'success'},
        {'name': '四年级', type: 'success'},
        {'name': '五年级', type: 'success'},
        {'name': '六年级', type: 'success'},
        {'name': '初一', type: 'info'},
        {'name': '初二', type: 'info'},
        {'name': '初三', type: 'info'},
        {'name': '高一', type: 'warning'},
        {'name': '高二', type: 'warning'},
        {'name': '高三', type: 'warning'}
      ],
      options: regionData,
      CodeToText: CodeToText,
      selectedOptions: [],
      infoArr: [],
      list: null,
      isSetVip: false,
      isPriorityUpload: false,
      adaptloading: false,
      dialogDiv: false,
      listLoading: true,
      deleteLoading: false,
      updateloading: false,
      createloading: false,
      userNameLoading: false,
      createAdminloading: false,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        departmentTypeId: undefined
      },
      showId: undefined,
      checkId: undefined,
      tableData: [],
      dialogFormVisible: false,
      dialogDetailFormVisible: false,
      dialogConfigFormVisible: false,
      configFormTitle: '添加',
      innerVisible: false,
      innerDetailVisible: false,
      isPayFormatter: isPayFormatter,
      isTransportFormatter: isTransportFormatter,
      isShowColumnFormatter: isShowColumnFormatter,
      isIconFormatter: isIconFormatter,
      levelFormatter: levelFormatter,
      isPayType: isPayType,
      isTransportType: isTransportType,
      isPicStoreType: isPicStoreType,
      isMonthlyCardType: isMonthlyCardType,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        detail: '详情'
      },
      total: null,
      setStatus: 3,
      selectArrayId: [],
      disabled: true,
      publicizeArr: [
        {value: 1, label: '小区模式'},
        {value: 2, label: '公司模式'},
        {value: 3, label: '学校模式'},
        // {value: 4, label: '通用模式'},
        {value: 5, label: '工地模式'},
        // {value: 7, label: '新考勤模式'},
        {value: 8, label: '体温模式'},
        {value: 9, label: '非标墨斗'}
      ],
      form: {
        id: undefined,
        departmentName: undefined,
        sysName: undefined,
        phone: undefined,
        departmentTypeId: undefined,
        themeType: 1,
        transportType: undefined,
        epayType: undefined,
        province: '',
        city: '',
        county: '',
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        resume: ''
      },
      itemForm: {
        points: null,
        password: '',
        departmentIds: []
      },
      uploadItemForm: {
        departmentIds: [],
        password: '',
        highest: null
      },
      cloneForm: {
        id: undefined,
        departmentTypeId: undefined,
        transportType: undefined,
        epayType: undefined,
        lotTotal: undefined
      },
      configForm: {
        appId: undefined,
        appSecret: undefined,
        mchId: undefined
      },
      formDetails: {
        id: undefined,
        departmentName: undefined,
        sysName: undefined,
        themeType: undefined,
        phone: undefined,
        departmentTypeId: undefined,
        epayType: undefined,
        unicode: undefined,
        secret: undefined,
        defaultPrefix: undefined,
        lotTotal: undefined,
        isMonthlyCard: undefined,
        province: '',
        city: '',
        county: '',
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        resume: ''
      },
      setformRules: {
        points: [
          {required: true, trigger: 'blur', message: '请输入积分'}
        ],
        pasword: [
          {required: true, trigger: 'blur', message: '请输入密码'}
        ]
      },
      setUploadFormRules: {
        highest: [
          {required: true, trigger: 'blur', message: '请输入优先级别'}
        ],
        password: [
          {required: true, trigger: 'blur', message: '请输入密码'}
        ]
      },
      formRules: {
        departmentName: [
          {required: true, trigger: 'blur', message: '请输入部门名称'}
        ],
        sysName: [
          {required: true, trigger: 'blur', message: '请输入系统名称'},
          {maxlength: 8, minlength: 2, message: '请输入2-8位的字符'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号码'},
          {validator: checkPhone, trigger: 'blur', message: '请输入11位的手机号码'}
        ],
        transportType: [
          {type: 'number', required: true, trigger: 'change', message: '请选择通讯模式'}
        ],
        lotTotal: [
          {required: true, trigger: 'blur', message: '请输入车位总数'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        departmentTypeId: [
          {type: 'number', required: true, trigger: 'change', message: '请选择部门类别'}
        ],
        themeType: [
          {type: 'number', required: true, trigger: 'change', message: '不可为空'}
        ],
        serialNumber: [
          {required: true, trigger: 'blur', message: '请输入项目编号'}
        ],
        epayType: [
          {type: 'number', required: true, trigger: 'change', message: '请选择支付方式'}
        ],
        address: [
          {required: true, trigger: 'change', message: '请选择地址'}
        ]
      },
      cloneformRules: {
        transportType: [
          {type: 'number', required: true, trigger: 'change', message: '请选择通讯模式'}
        ],
        lotTotal: [
          {required: true, trigger: 'blur', message: '请输入车位总数'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        departmentTypeId: [
          {type: 'number', required: true, trigger: 'change', message: '请选择部门类别'}
        ],
        epayType: [
          {type: 'number', required: true, trigger: 'change', message: '请选择支付方式'}
        ]
      },
      formDetailsRules: {
        departmentName: [
          {required: true, trigger: 'blur', message: '请输入部门名称'}
        ],
        // themeType: [
        //   {type: 'number', required: true, trigger: 'change', message: '不可为空'}
        // ],
        sysName: [
          {required: true, trigger: 'blur', message: '请输入系统名称'},
          {maxlength: 8, minlength: 2, message: '请输入2-8位的字符'}
        ],
        phone: [
          {required: true, trigger: 'blur', message: '请输入手机号码'},
          {validator: checkPhone, trigger: 'blur', message: '请输入11位的手机号码'}
        ],
        departmentTypeId: [
          {required: true, trigger: 'change', message: '请选择部门类别'}
        ],
        serialNumber: [
          {required: true, trigger: 'blur', message: '请输入项目编号'}
        ],
        unicode: [
          {required: true, trigger: 'blur', message: '请输入部门编号'}
        ],
        transportType: [
          {required: true, trigger: 'change', message: '请选择通讯模式'}
        ],
        secret: [
          {required: true, trigger: 'blur', message: '请输入密钥'}
        ],
        defaultPrefix: [
          {required: true, trigger: 'blur', message: '请输入默认车牌前缀'}
        ],
        lotTotal: [
          {required: true, trigger: 'blur', message: '请输入总车位'}
        ],
        isMonthlyCard: [
          {required: true, trigger: 'change', message: '请选择是否支持固定车'}
        ],
        address: [
          {required: true, trigger: 'change', message: '请选择地址'}
        ]
      },
      // 地图搜索
      searchOption: {
        citylimit: false
      },
      default: '',
      markers: [],
      mapCenter: [114.066281, 22.547718],
      address: '',
      addressShow: false,
      showPosition: false,
      depType: [],
      zoom: 6,
      // 地图点击事件
      events: {
        click (e) {
          console.log(e)
          self.form.longitude = e.lnglat.lng
          self.form.latitude = e.lnglat.lat
          let geocoder = new window.AMap.Geocoder({
            radius: 1000,
            extensions: 'all'
          })
          if (self.innerVisible === true) {
            self.markers = [{
              position: [e.lnglat.lng, e.lnglat.lat],
              events: undefined
            }]
          }
          if (self.innerDetailVisible === true) {
            self.detailMapCenter = [e.lnglat.lng, e.lnglat.lat]
            self.detailMarkers = [{
              position: [e.lnglat.lng, e.lnglat.lat],
              events: undefined
            }]
          }
          // 根据坐标点获取位置
          geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                if (self.innerVisible === true) {
                  self.form.address = result.regeocode.formattedAddress
                  self.form.province = result.regeocode.addressComponent.province
                  self.form.city = result.regeocode.addressComponent.city
                  self.form.district = result.regeocode.addressComponent.district
                  self.form.city = result.regeocode.addressComponent.city
                  self.addressShow = true
                  self.showPosition = true
                }
                if (self.innerDetailVisible === true) {
                  self.formDetails.address = result.regeocode.formattedAddress
                  self.formDetails.province = result.regeocode.addressComponent.province
                  self.formDetails.city = result.regeocode.addressComponent.city
                  self.formDetails.district = result.regeocode.addressComponent.district
                  self.formDetails.longitude = e.lnglat.lng
                  self.formDetails.latitude = e.lnglat.lat
                  self.detailAddressShow = true
                  self.detailShowPosition = true
                }
              }
            } else {
              self.$message.error('未获取到位置信息，请重新选择')
            }
          })
        }
      },
      detailMarkers: [],
      detailMapCenter: [114.066281, 22.547718],
      detailAddress: '',
      detailAddressShow: false,
      detailZoom: 10,
      detailShowPosition: false,
      depId: 0,
      isDepartment: 0,
      jsonData: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '联系电话',
          key: 'phone',
          type: 'text'
        },
        {
          title: '唯一编号',
          key: 'unicode',
          type: 'text'
        },
        {
          title: '密钥',
          key: 'secret',
          type: 'text'
        },
        {
          title: '省市区',
          key: '',
          type: 'text',
          children: [
            {
              title: '省',
              key: 'province',
              type: 'text'
            },
            {
              title: '市',
              key: 'city',
              type: 'text'
            },
            {
              title: '区',
              key: 'county',
              type: 'text'
            }
          ]
        },
        {
          title: '备注信息',
          key: 'typeName',
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
      jsonDat: [
        {
          title: '部门名称',
          key: 'departmentName',
          type: 'text'
        },
        {
          title: '联系电话',
          key: 'phone',
          type: 'text'
        },
        {
          title: '唯一编号',
          key: 'unicode',
          type: 'text'
        },
        {
          title: '密钥',
          key: 'secret',
          type: 'text'
        },
        {
          title: '部门级别',
          key: 'level',
          type: 'text'
        },
        {
          title: '备注信息',
          key: 'typeName',
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
  mounted () {
    this.fetchDepType()
    this.fetchData()
    this.getPosition()
    this.md = this.$store.getters.departmentTypeId
    this.getSys()
  },
  methods: {
    handleh () {
      this.jsonData[0]['title'] = this.form.themeType === 3 ? '学校名称' : '部门名称'
      this.jsonDat[0]['title'] = this.form.themeType === 3 ? '学校名称' : '部门名称'
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        // item.advTitle = this.advTargetTypeFormatter(item.type)
        item.level = this.levelFormatter(item.level)
        // item.suggestionSelect = this.suggestionSelectFormatter(item.suggestionSelect)
        // item.userType = this.userTypeFormat(item.userType)
        // item.createAt = this.timeFormatter(item.createAt)
        // item.resume = this.happenEventFormatter(item.happenEvent)
      })
      this.table2excel(this.isShowColumnFormatter(['有为学校']) ? this.jsonData : this.jsonDat, obj, 'excel.xlsx')
    },
    // 会员优先级下发
    priorityUpload () {
      // console.log('会员优先级下发')
      this.isPriorityUpload = true
      this.setStatus = 1
    },
    // 会员优先级下发 发送
    setVipUpload () {
      // console.log('开始下发。。。', this.$store.getters)
      // this.uploadItemForm.departmentIds = [this.$store.getters.departmentId]
      if (this.setStatus === 1) {
        this.uploadItemForm.departmentIds = this.selectArrayId
      }
      // console.log('发起请求的数据', this.uploadItemForm)
      httpPost(ApiPriorityUpload, this.uploadItemForm).then((res) => {
        // console.log('请求数据；；', res)
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
        this.isPriorityUpload = false
        this.uploadItemForm = { // 恢复初始
          departmentIds: [],
          password: '',
          highest: null
        }
      }).catch((err) => {
        console.log('请求出错。。。', err)
      })
    },
    inviteCode (item) {
      this.itemForm.departmentIds = [item.id]
      this.uploadItemForm.departmentIds = [item.id]
      console.log(this.itemForm, this.uploadItemForm)

      this.isSetVip = true
      this.setStatus = 0
    },
    adapt (btn, item, it) {
      console.log(btn, item, it)
      this.$prompt('请修改班级名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        console.log(value)
        this.$nextTick(() => {
          let a = this.classArr[this.btns.indexOf(btn)]
          a[a.indexOf(item)].name = value
          // this.classArr[it][this.btns.indexOf(item)].name = value
        })
      }).catch(() => {})
      // this.classArr[this.btns.indexOf(btn)][it]
      // this.classArr[this.btns.indexOf(btn)][item]
    },
    addClass2 (item, index) {
      if (this.classArr[index].length === 0) {
        this.classArr[index].push({
          'name': '1班'
        })
      } else {
        this.classArr[index].push({
          'name': this.classArr[index].length + 1 + '班'
        })
      }
    },
    closeTag (item, index) { // 删除年级做限制！！！！！！
      if (index === this.btns.length - 1) {
        this.btns.splice(this.btns.indexOf(item, 1))
        this.btns1.unshift(item)
      }
    },
    closeClass (item, index) {
      console.log(item, index)
      console.log(this.classArr)
      this.btns.indexOf(item)
      if (index === this.classArr[this.btns.indexOf(item)].length - 1) {
        this.classArr[this.btns.indexOf(item)].pop()
      }
    },
    addClass () {
      this.btns.push(this.btns1[0])
      this.btns1.splice(0, 1)
    },
    handleChange (value) {
      this.listQuery.province = this.CodeToText[value[0]]
      this.listQuery.city = this.CodeToText[value[1]]
      this.listQuery.county = this.CodeToText[value[2]]
      console.log(this.CodeToText[value[0]])
      console.log(this.CodeToText[value[1]])
      console.log(this.CodeToText[value[2]])
    },
    handleChange1 (value) {
      this.form.themeType = 3
      this.form.province = this.CodeToText[value[0]]
      this.form.city = this.CodeToText[value[1]]
      this.form.county = this.CodeToText[value[2]]
      // this.form.classes = JSON.stringify(this.classArr)
      this.form.classes = this.classArr
      console.log(this.CodeToText[value[0]])
      console.log(this.CodeToText[value[1]])
      console.log(this.CodeToText[value[2]])
    },
    setAllVip () {
      this.isSetVip = true
      this.setStatus = 1
    },
    setVip () {
      if (this.setStatus === 1) {
        this.itemForm.departmentIds = this.selectArrayId
      }
      // console.log(this.itemForm)

      httpPost(setCountVip, this.itemForm).then((res) => {
        this.$message({
          message: res.message,
          type: 'success',
          duration: 3000
        })
        this.isSetVip = false
      }).catch(() => {})
    },
    getSys () {
      httpGet(getSysName + '/' + this.md)
        .then((res) => {
          this.showId = res.data.type
        })
    },
    // 测试部专用
    handleOpen (row) {
      console.log(row)
      this.dialogDiv = true
      this.rowId = row.id
      let x = JSON.stringify(row)
      this.cloneForm.departmentTypeId = JSON.parse(x).typeId
      this.cloneForm = Object.assign(this.cloneForm, JSON.parse(x))
      console.log(this.cloneForm.departmentTypeId)
      console.log(this.depType)
      this.fetchDepType()
    },
    checkBtn (row) {
      if (row.tests === null) {
        this.$message({
          message: '暂无信息',
          type: 'error',
          duration: 3000
        })
      } else {
        var dataArr = row.tests
        var arr = []
        for (var i = 0; i < dataArr.length; i++) {
          if (dataArr[i][0] !== null) {
            arr.push(dataArr[i])
          }
        }
        this.infoArr = arr
        this.isClass = true
      }
    },
    // 监听部门id
    changeDepartmentId (value) {
      console.log(value)
      for (let i = 0; i < this.depType.length; i++) {
        const element = this.depType[i]
        if (element.id === this.form.departmentTypeId) {
          const level = element.level
          if (level === 3) this.isDepartment = true
          if (level !== 3) this.isDepartment = false
        } else {
          continue
        }
      }
    },
    // 获取部门类别
    fetchDepType () {
      httpGet(getDepTypeById + this.$store.getters.departmentId).then(res => {
        this.depType = res.data
        let asd = document.getElementById('tag')
        if (asd !== null) {
          httpGet(checkAllTypeInfo + '/' + this.$store.getters.departmentId)
            .then((res) => {
              this.depType = this.depType.concat(res.data)
            }).catch(() => {})
        }
      }).catch(() => {})
    },
    fetchData () {
      httpGet(getDep + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    // 重置cloneForm表单
    resetCloneForm () {
      this.cloneForm = {
        id: undefined,
        departmentTypeId: undefined,
        epayType: undefined,
        transportType: undefined,
        lotTotal: undefined
      }
    },
    // 重置form表单
    resetForm () {
      this.form = {
        id: undefined,
        departmentName: undefined,
        sysName: undefined,
        phone: undefined,
        departmentTypeId: undefined,
        themeType: 1,
        epayType: undefined,
        province: '',
        city: '',
        county: '',
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        resume: ''
      }
    },
    handleCreate () {
      this.checkId = parseInt(this.$store.getters.departmentId)
      let self = this
      self.dialogFormVisible = true
      // 延迟调用
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    handleUpdate (row) {
      this.resetDetailForm()
      httpGet(department + '/' + row.id).then(res => {
        console.log(res)
        this.formDetails = Object.assign({}, res.data)
        this.dialogStatus = 'update'
        this.dialogDetailFormVisible = true
        this.$nextTick(() => {
          this.$refs.dataformDetails.clearValidate()
        })
      }).catch(() => {})
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 测试部修改
    confirmForm () {
      this.$refs.clonedataform.validate((valid) => {
        if (valid) {
          this.adaptloading = true
          this.cloneForm = Object.assign(this.cloneForm, {id: this.rowId})
          httpPut(updateDepart, this.cloneForm).then((res) => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 3000
            })
            this.fetchData()
            this.dialogDiv = false
          }).catch(() => {
            this.dialogDiv = false
          })
          let self = this
          setTimeout(function () {
            self.adaptloading = false
          }, 1000)
          this.resetCloneForm()
        }
      })
    },
    // 新增
    createData () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.createloading = true
          this.form = Object.assign(this.form, {pid: this.$store.getters.departmentId})
          httpPost(department, this.form).then(res => {
            this.dialogFormVisible = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
            this.fetchData()
            let self = this
            setTimeout(function () {
              self.createloading = false
            }, 1000)
          }).catch(() => {
            this.createloading = false
          })
        }
      })
    },
    // 修改
    updateData () {
      this.$refs.dataformDetails.validate((valid) => {
        if (valid) {
          this.updateloading = true
          const updateFormData = Object.assign({}, this.formDetails)
          httpPut(department, updateFormData).then(res => {
            this.fetchData()
            this.dialogDetailFormVisible = false
            setTimeout(() => { this.updateLoading = false }, 300)
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.updateloading = false
          })
        }
      })
    },
    resetDetailForm () {
      this.formDetails = {
        id: undefined,
        departmentName: undefined,
        sysName: undefined,
        phone: undefined,
        departmentTypeId: undefined,
        themeType: undefined,
        unicode: undefined,
        secret: undefined,
        defaultPrefix: undefined,
        lotTotal: undefined,
        isMonthlyCard: undefined,
        province: '',
        city: '',
        county: '',
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        resume: ''
      }
    },
    // -----------获取当前位置信息-----------\\
    getPosition () {
      let mapObj = new window.AMap.Map('iCenter', {
        resizeEnable: true
      })
      let geolocation = {}
      mapObj.plugin('AMap.Geolocation', () => {
        geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new window.AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        mapObj.addControl(geolocation)
        geolocation.getCurrentPosition()
        window.AMap.event.addListener(geolocation, 'complete', data => {
          this.mapCenter = [data.position.lng, data.position.lat]
          this.detailMapCenter = [data.position.lng, data.position.lat]
        }) // 返回定位信息
        window.AMap.event.addListener(geolocation, 'error', () => {
          console.log('定位失败')
        }) // 返回定位出错信息
      })
    },
    // 详情
    handleDetail (row) {
      console.log(row)
      this.resetDetailForm()
      httpGet(department + '/' + row.id).then(res => {
        this.formDetails = Object.assign({}, res.data)
        console.log(this.formDetails)
        this.dialogStatus = 'detail'
        this.dialogDetailFormVisible = true
        this.$nextTick(() => {
          this.$refs.dataformDetails.clearValidate()
        })
      }).catch(() => {})
    },
    // 根据经纬度获取位置
    getAddress () {
      const position = [this.formDetails.longitude, this.formDetails.latitude]
      // 这里通过高德 SDK 完成。
      let geocoder = new window.AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      this.detailMarkers = [
        {
          position: position,
          events: undefined
        }
      ]
      geocoder.getAddress(position, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            this.formDetails.address = result.regeocode.formattedAddress
            this.detailAddressShow = true
            this.$nextTick(() => {
              this.detailMapCenter = position
            })
          }
        } else {
          this.$message.error('未获取到位置信息，请重新选择')
        }
        this.innerDetailVisible = true
      })
    },
    onDetailSearchResult (list) {
      let latSum = 0
      let lngSum = 0
      let self = this
      if (list.length > 0) {
        list.forEach(item => {
          let {lng, lat} = item
          lngSum += lng
          latSum += lat
          self.detailMarkers.push({
            position: [item.lng, item.lat],
            events: {
              click: (v) => {
                // 这里通过高德 SDK 完成。
                let geocoder = new window.AMap.Geocoder({
                  radius: 1000,
                  extensions: 'all'
                })
                self.detailAddressShow = false
                // 根据坐标点获取位置
                geocoder.getAddress([v.lnglat.lng, v.lnglat.lat], (status, result) => {
                  if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                      self.formDetails.address = result.regeocode.formattedAddress
                      self.formDetails.province = result.regeocode.addressComponent.province
                      self.formDetails.city = result.regeocode.addressComponent.city
                      self.formDetails.district = result.regeocode.addressComponent.district
                      self.formDetails.city = result.regeocode.addressComponent.city
                      self.formDetails.longitude = v.lnglat.lng
                      self.formDetails.latitude = v.lnglat.lat
                      self.detailAddressShow = true
                      self.detailShowPosition = true
                    }
                  } else {
                    self.$message.error('未获取到位置信息，请重新选择')
                  }
                })
              }
            }
          })
        })
        let center = {
          lng: lngSum / list.length,
          lat: latSum / list.length
        }
        this.detailMapCenter = [center.lng, center.lat]
      }
    },
    // 删除选中
    handleDelete () {
      this.$confirm('确认提交吗？', '提示', {})
        .then(() => {
          this.deleteloading = true
          httpDelete(department, {ids: this.selectArrayId, departmentId: this.$store.getters.departmentId}).then(res => {
            this.deleteloading = false
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.deleteloading = false
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
    // 地图搜索
    onSearchResult (list) {
      let latSum = 0
      let lngSum = 0
      let self = this
      if (list.length > 0) {
        list.forEach(item => {
          let {lng, lat} = item
          lngSum += lng
          latSum += lat
          self.markers.push({
            position: [item.lng, item.lat],
            events: {
              click: (v) => {
                // 这里通过高德 SDK 完成。
                let geocoder = new window.AMap.Geocoder({
                  radius: 1000,
                  extensions: 'all'
                })

                self.addressShow = false
                // 根据坐标点获取位置
                geocoder.getAddress([v.lnglat.lng, v.lnglat.lat], (status, result) => {
                  // console.log('开始地图搜索： ', result)
                  if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {
                      self.form.address = result.regeocode.formattedAddress
                      self.form.province = result.regeocode.addressComponent.province
                      self.form.city = result.regeocode.addressComponent.city
                      self.form.district = result.regeocode.addressComponent.district
                      self.form.city = result.regeocode.addressComponent.city
                      self.form.longitude = v.lnglat.lng
                      self.form.latitude = v.lnglat.lat
                      self.addressShow = true
                      self.showPosition = true
                      self.$nextTick()
                    }
                  } else {
                    this.$message.error('未获取到位置信息，请重新选择')
                  }
                })
              }
            }
          })
        })
        let center = {
          lng: lngSum / list.length,
          lat: latSum / list.length
        }
        this.mapCenter = [center.lng, center.lat]
      }
    },
    // 刷新
    handleRefresh () {
      this.listQuery = {
        offset: 1,
        limit: 10,
        departmentName: undefined,
        departmentTypeId: undefined
      }
      this.fetchData()
    },
    handleConfig (row) {
      httpGet(department + '/' + row.id).then(res => {
        this.configForm = Object.assign({}, res.data)
        this.dialogConfigFormVisible = true
        this.configFormTitle = res.data.departmentName
      }).catch(() => {})
    },
    createConfigData () {
      this.$confirm('确认提交吗？', '提示', {}).then(() => {
        httpPost(editDepConfig, this.configForm).then(res => {
          this.dialogConfigFormVisible = false
          this.$message.success(res.message)
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-title{
  font-size: 12px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(253, 73, 7);
  background: #f1f1f1;
  width: 100%;

}
  .amap-logo{
    display: none !important;
  }
  .amap-copyright{
    margin-bottom: -100px !important;
  }
  .el-vue-search-box-container{
    width: 100%;
    .search-box-wrapper{
      border-radius: 3px;
      border: 1px solid #c5c1c1;
    }
  }
  .amap-wrapper{
    margin-top: 10px !important;
    border: 1px solid #c5c1c1 !important;
  }
</style>
