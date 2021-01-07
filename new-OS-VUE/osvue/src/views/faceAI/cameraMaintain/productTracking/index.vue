<template>
  <div class="app-container">
    <el-button-group class="box-title-button-group">
      <el-button :type="index === 1 ? 'primary' : ''" size="small" @click="handleToday">今天</el-button>
      <el-button :type="index === 2 ? 'primary' : ''" size="small" @click="handleYesterday">昨天</el-button>
      <el-button :type="index === 3 ? 'primary' : ''" size="small" @click="handleWeek">本周</el-button>
      <el-button :type="index === 4 ? 'primary' : ''" size="small" @click="handleLastWeek">上周</el-button>
      <el-button :type="index === 5 ? 'primary' : ''" size="small" @click="handleMonth">本月</el-button>
      <el-button :type="index === 6 ? 'primary' : ''" size="small" @click="handleLastMonth">上月</el-button>
    </el-button-group>
    <!-- 统计 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="16" style="margin-bottom: 20px;">
        <LineBar style="background:white;height: 400px;border-radius:8px;" :data = "camLine"></LineBar>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8" style="margin-bottom: 20px;">
        <Pie style="background:white;height: 400px;border-radius:8px;" :data = "camPie"></Pie>
      </el-col>
    </el-row>

    <div class="table-main" style="margin-bottom:1.5rem;">
      <el-alert title="历史总计" style="font-size:18px;margin-bottom:10px" type="warning" :closable="false"></el-alert>
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width:100%;" max-height="600" :data="typeData" border fit highlight-current-row>
        <el-table-column align="center" label="类型" prop="type"></el-table-column>
        <el-table-column align="center" label="数量" prop="count"></el-table-column>
      </el-table>
    </div>
    <div class="table-main">
      <!-- 操作 -->
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.mac" clearable placeholder="MAC地址"></el-input>
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.hmac" clearable placeholder="厂家MAC"></el-input>
        <el-select clearable v-model="listQuery.state" style="width:150px;"  class="filter-item" placeholder="状态">
          <el-option v-for="item in stateArr" :key="item.valueNo" :label="item.valueName" :value="item.valueNo"></el-option>
        </el-select>
        <el-date-picker
          class="filter-item"
          v-model="time"
          :clearable="false"
          type="datetimerange"
          style="padding:0 15px;"
          value-format = "yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          @change="changeTime"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="filter-item search" type="primary" @click="handleFilter" icon="el-icon-search">搜索</el-button>
        <el-button class="filter-item add" type="primary" v-has="['添加']" @click="addCam" icon="el-icon-plus">添加</el-button>
        <el-button class="filter-item" type="primary" @click="fetchData" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" v-has="['删除']" :loading = "deleteLoading" @click="deleteBatch" :disabled="disabled" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain  v-has="['删除所有']" @click="deleteAll" icon="el-icon-delete">删除所有</el-button>
        <el-button class="filter-item" type="warning" :disabled="disabled" v-has="['批量修改']" @click="batchAdapt" icon="el-icon-edit">批量修改</el-button>
      </div>
      <el-dialog title="选择" :visible.sync="isShow">
        <p style="margin-left: 30px"><el-tag type="success">温馨提示：只能选择某一天的数据进行删除</el-tag></p>
        <el-date-picker
          v-model="dateStr"
          type="date"
          style="margin-left:30px"
          placeholder="选择日期">
        </el-date-picker>
        <div slot="footer">
          <el-button @click="isShow = false">取消</el-button>
          <el-button type="primary" :loading = "deleteAllLoading" @click="deleWholeday">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="textMap[dialogStatus]" width="45%" :visible.sync="dialogVisible">
        <el-form :rules="formRules" ref="dataform" :model="form" autoCompete = "on" label-position="right" label-width="100px">
          <el-form-item label="Mac地址" prop="mac">
            <el-input v-model="form.mac" placeholder="请输入mac" @input="macChange"></el-input>
          </el-form-item>
          <el-form-item label="厂家Mac" prop="hmac">
            <el-input v-model="form.hmac" placeholder="请输入hmac"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input v-model="form.type" placeholder="请输入类型"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" v-show="dialogStatus === 'create'" :loading="isLoading" @click="submitForm">保存</el-button>
          <el-button type="primary" v-show="dialogStatus === 'update'" :loading="updateLoading" @click="updateForm">修改</el-button>
        </div>
      </el-dialog>
      <el-table :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600"  @selection-change="handleSelectionChange" :data="tableData" :row-class-name="tableRowClassName" v-loading.body="listLoading"  element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left"></el-table-column>
        <el-table-column label="创建人" align="center" prop="createName"></el-table-column>
        <el-table-column label="MAC地址" align="center" prop="mac"></el-table-column>
        <el-table-column label="厂家MAC" align="center" prop="hmac" width="240">
          <template slot-scope="scope">
            {{scope.row.hmac}}
            <el-tag v-if="scope.row.state !== 2" type="success">正常</el-tag>
            <el-tag v-if="scope.row.state == 2" type="warning">重复</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="出厂时间" align="center" prop="createTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template slot-scope="scope">
            {{timeFormatter(scope.row.updateTime)}}
          </template>
        </el-table-column>
        <el-table-column label="型号" align="center" prop="type"></el-table-column>
        <!--  v-if = "isShowColumnFormatter(['编辑'])"  -->
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="240">
          <template slot-scope="scope">
            <el-button type="primary" style="margin-bottom:10px" v-has="['编辑']"  @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button type="primary" style="margin-bottom:10px" @click="handleDetails(scope.row)" size="mini">详情</el-button>
            <!-- <el-button type="primary" style="margin-bottom:10px" @click="doDetails(scope.row)" size="mini">详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 详情 -->
      <el-dialog title="详情查看" :visible.sync="dialogTableVisible">
        <el-table :data="detailsArr">
          <el-table-column property="title" label="主题" width="150"></el-table-column>
          <el-table-column property="text" label="内容" width="150"></el-table-column>
          <el-table-column property="createTime" label="创建时间">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column property="updateTime" label="更新时间">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.updateTime)}}
            </template>
          </el-table-column>
        </el-table>
        <!-- <div slot="footer">
          <el-button @click="dialogTableVisible = false">取消</el-button>
          <el-button type="primary">确定</el-button>
        </div> -->
      </el-dialog>
      <!-- 主题 -->
      <el-dialog title="主题" :visible.sync="isDetails" width="55%">
        <!-- <el-table :data="detailsArr" :header-cell-style="{background:'#f3f4f6'}" style="width: 100%" max-height="600">
          <el-table-column property="createName" align="center" label="创建用户" width="150"></el-table-column>
          <el-table-column property="updateName" align="center" label="修改用户" width="150"></el-table-column>
          <el-table-column property="title" align="center" label="主题" width="150"></el-table-column>
          <el-table-column property="text" align="center" label="内容"></el-table-column>
          <el-table-column property="createTime" align="center" width="200" label="创建时间">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column property="updateTime" align="center" width="200" label="更新时间">
            <template slot-scope="scope">
              {{timeFormatter(scope.row.updateTime)}}
            </template>
          </el-table-column>
        </el-table> -->
        <el-form style="margin-top:1rem" :inline="true" :rules="dataRules" ref="dataForm" autoCompete = "on" label-position="right" label-width="100px">
          <el-button type="warning" @click="addSum" :loading="addLoading">加一行</el-button>
          <el-button type="danger" @click="reduceSum" :loading="deleLoading" style="margin-bottom:1rem">减一行</el-button>
          <div v-for="(item, index) in detailsArr" :key=index>
            <el-form-item label="主题">
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="item.title"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="handleSelect(index, $event)">
              <!-- <i
                class="el-icon-delete el-input__icon"
                slot="suffix"
                @click="handleIconClick(item)">
              </i> -->
              <template slot-scope="props">
                <div class="name" style="display:inline-block;width:150px">{{ props.item.title }}</div>
              </template>
            </el-autocomplete>
            <!-- <i v-show="item.title !== ''" class="el-icon-delete el-input__icon" @click="handleIconClick(item)"></i> -->
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="item.text" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item v-show="item.id">
            <el-button plain type="danger" @click="delDataOne(item.id)">删除数据</el-button>
          </el-form-item>
          </div>
        </el-form>
        <div slot="footer">
          <el-button @click="isDetails = false">取消</el-button>
          <el-button type="primary" :loading="hhhing" @click="saveAdaptInfo">保存</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[100,200,300,500]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
  </div>
  </div>
</template>

<script>
import LineBar from '@/components/Echarts/LineBar'
import Pie from '@/components/Echarts/Pie'
import { timeFormatter, timeFormatterSort } from '@/utils/formatter'
import { searchPage, historyCount, addCam, adaptCam, doCamTitle, statistCamLine, statistCamPie } from '@/api/url'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
export default {
  components: {
    LineBar,
    Pie
  },
  data () {
    return {
      typeData: [],
      stateArr: [
        {
          valueNo: 1,
          valueName: '正常'
        },
        {
          valueNo: 2,
          valueName: '重复'
        }
      ],
      listLoading: true,
      hhhing: false,
      dialogTableVisible: false,
      detailsArr: [],
      total: undefined,
      filterDisabled: true,
      isDetails: false,
      addLoading: false,
      deleLoading: false,
      isShow: false,
      dialogVisible: false,
      isLoading: false,
      updateLoading: false,
      disabled: true,
      timeFormatterSort: timeFormatterSort,
      timeFormatter: timeFormatter,
      selectArrayId: [],
      uuid: undefined,
      sum: undefined,
      time: [],
      tableData: [],
      titleData: [],
      dataForm: [
        {
          title: '',
          text: '',
          id: undefined
        }
      ],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      listQuery: {
        offset: 1,
        state: 1,
        mac: undefined,
        limit: 100,
        beginTime: timeFormatterSort(new Date(new Date())) + ' 00:00:00',
        endTime: timeFormatterSort(new Date()) + ' 23:59:59'
      },
      dataRules: {
        // title: [
        //   {required: true, trigger: 'change', message: '不可为空'}
        // ],
        // text: [
        //   {required: true, trigger: 'blur', message: '不可为空'}
        // ]
      },
      formRules: {
        mac: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        hmac: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ],
        type: [
          {required: true, trigger: 'blur', message: '不可为空'}
        ]
      },
      form: {
        mac: undefined,
        hmac: undefined,
        type: undefined
      },
      deleteLoading: false,
      deleteAllLoading: false,
      // disabled: true,
      dateStr: undefined,
      camLine: {},
      camPie: {},
      statistSearch: {
        beginTime: undefined,
        endTime: undefined
      },
      jsonData: [
        {
          title: '创建人',
          key: 'createName',
          type: 'text'
        },
        {
          title: 'MAC地址',
          key: 'mac',
          type: 'text'
        },
        {
          title: '厂家MAC',
          key: 'hmac',
          type: 'text'
        },
        {
          title: '出厂时间',
          key: 'createTime',
          type: 'text'
        },
        {
          title: '更新时间',
          key: 'updateTime',
          type: 'text'
        },
        {
          title: '型号',
          key: 'type',
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
    this.time = [this.listQuery.beginTime, this.listQuery.endTime]
    this.fetchData()
    this.handleMonth()
    this.handleCount()
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item, index) => {
        item.createTime = this.timeFormatter(item.createTime)
        item.updateTime = this.timeFormatter(item.updateTime)
        item.hmac = item.hmac + (item.state !== 2 ? '正常' : '重复')
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    handleStatist () {
      this.getCamLine()
      this.getCamPie()
    },
    // 今天
    handleToday () {
      this.index = 1
      this.statistSearch.beginTime = timeFormatterSort(new Date()) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 昨天
    handleYesterday () {
      this.index = 2
      this.statistSearch.beginTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 本周
    handleWeek () {
      this.index = 3
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday + 1) // 往前算（weekday-1）天，年份、月份会自动变化
      this.statistSearch.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 上周
    handleLastWeek () {
      this.index = 4
      let date = new Date()
      let weekday = date.getDay() || 7 // 获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
      date.setDate(date.getDate() - weekday - 6) // 往前算（weekday-1）天，年份、月份会自动变化
      this.statistSearch.beginTime = timeFormatterSort(date) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(3600 * 1000 * 24 * 6 + date.getTime()) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 本月
    handleMonth () {
      this.index = 5
      this.statistSearch.beginTime = timeFormatterSort(new Date(new Date().setDate(1))) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(new Date()) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 上月
    handleLastMonth () {
      this.index = 6
      this.statistSearch.beginTime = timeFormatterSort(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)) + ' 00:00:00'
      this.statistSearch.endTime = timeFormatterSort(new Date(new Date().setDate(0))) + ' 23:59:59'
      // this.time = [this.statistSearch.beginTime, this.statistSearch.endTime]
      this.handleStatist()
    },
    // 历史总计
    handleCount () {
      httpGet(historyCount).then((res) => {
        this.typeData = res.data
        console.log(res)
      }).catch(() => {})
    },
    getCamLine () {
      httpGet(statistCamLine, this.statistSearch).then((res) => {
        this.camLine = res.data
        this.camLine.unit = '台'
      }).catch(() => {})
    },
    getCamPie () {
      httpGet(statistCamPie, this.statistSearch).then((res) => {
        this.camPie = res.data
      }).catch(() => {})
    },
    tableRowClassName ({row, rowIndex}) {
      if (Number(row.state) === 2) {
        return 'warning-row'
      }
      return ''
    },
    handleSizeChange () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    macChange (value) {
      if (value.length === 2) this.form.mac = this.form.mac + ':'
      if (value.length === 5) this.form.mac = this.form.mac + ':'
      if (value.length === 8) this.form.mac = this.form.mac + ':'
      if (value.length === 11) this.form.mac = this.form.mac + ':'
      if (value.length === 14) this.form.mac = this.form.mac + ':'
      if (value.length > 17) {
        this.$nextTick(() => {
          this.form.mac = this.form.mac.substring(0, 17)
        })
        this.$message.error('请输入正确的MAC地址')
      }
    },
    delDataOne (id) {
      this.$confirm('确定要删除该条数据吗？', '提示', {})
        .then(() => {
          httpDelete(adaptCam + '/' + id)
            .then((res) => {
              this.$message({
                message: res.message,
                duration: 3000,
                type: 'success'
              })
              this.isDetails = false
              this.fetchData()
            })
        }).catch(() => {})
    },
    addSum () {
      this.addLoading = true
      this.$nextTick(() => {
        this.detailsArr.push(
          {
            title: '',
            text: '',
            id: undefined
          }
        )
      })
      setTimeout(() => { this.addLoading = false }, 400)
    },
    reduceSum () {
      this.deleLoading = true
      this.$nextTick(() => {
        if (this.detailsArr.length <= this.sum) {
        } else {
          this.detailsArr.pop()
        }
      })
      setTimeout(() => { this.deleLoading = false }, 400)
    },
    // 选择
    handleSelect (index, ev) {
      this.detailsArr[index].title = ev.title
      this.detailsArr[index].id = ev.id
    },
    handleIconClick (item) {
      console.log(item)
      this.$confirm('确定要删除该条常用操作类型文本吗？', '提示', {})
        .then(() => {
          httpDelete(doCamTitle + '/' + item.id)
            .then((res) => {
              this.$message({
                message: res.message,
                duration: 3000,
                type: 'success'
              })
              this.refreshForm()
              this.isDetails = false
              this.fetchData()
            }).catch(() => {})
        }).catch(() => {})
    },
    querySearch (queryString, cb) {
      var restaurants = this.titleData
      // var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(restaurants)
    },
    // createFilter (queryString) {
    //   return (restaurant) => {
    //     return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // 保存修改
    saveAdaptInfo () {
      console.log(this.dataForm)
      this.hhhing = true
      // this.$refs.dataForm.validate((valid) => {
      //   if (valid) {
      console.log(this.uuid)
      let aiCamUpdateDetailDto = {
        camId: this.selectArrayId,
        detailList: this.detailsArr
      }
      httpPut(adaptCam, aiCamUpdateDetailDto)
        .then((res) => {
          console.log(res)
          this.$message({
            message: res.message,
            duration: 3000,
            type: 'success'
          })
          // this.$refs.dataForm.resetFields()
          this.hhhing = false
          this.isDetails = false
          this.refreshForm()
        }).catch(() => {
          this.hhhing = false
        })
      //   }
      // })
    },
    refreshForm () {
      this.dataForm = [
        {
          title: '',
          text: '',
          id: undefined
        }
      ]
    },
    // 详情
    doDetails (id) {
      httpGet(adaptCam + '/' + id)
        .then((res) => {
          console.log(res)
          this.detailsArr = res.data
          this.sum = this.detailsArr.length
        }).catch(() => {})
    },
    // 点击主题
    handleDetails (row) {
      this.uuid = row.id
      this.isDetails = true
      this.getTitle(row.id)
      this.doDetails(row.id)
    },
    getTitle (id) {
      httpGet(doCamTitle)
        .then((res) => {
          console.log(res)
          this.titleData = res.data
        }).catch(() => {})
    },
    // 删除那天的数据
    deleWholeday () {
      console.log(this.timeFormatterSort(this.dateStr))
      this.deleteAllLoading = true
      httpDelete(addCam + '/' + this.timeFormatterSort(this.dateStr))
        .then((res) => {
          this.$message({
            message: res.message,
            duration: 4000,
            type: 'success'
          })
          this.fetchData()
          this.isShow = false
          this.deleteAllLoading = false
        }).catch(() => {
          this.deleteAllLoading = false
        })
    },
    // 删除所有
    deleteAll () {
      this.isShow = true
    },
    // 搜索
    handleFilter () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // 修改提交
    updateForm () {
      this.updateLoading = true
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPut(addCam, this.form)
            .then((res) => {
              this.$message({
                message: res.message,
                duration: 4000,
                type: 'success'
              })
              this.updateLoading = false
              this.fetchData()
              this.dialogVisible = false
            }).catch(() => {
              this.updateLoading = false
            })
        }
      })
    },
    // 编辑
    handleEdit (row) {
      this.form = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dataform.clearValidate()
      })
    },
    // 批量删除
    deleteBatch () {
      let ids = Object.assign({ids: this.selectArrayId}, {departmentId: Number(this.$store.getters.departmentId)})
      httpDelete(addCam, ids)
        .then((res) => {
          console.log(res)
          this.$message({
            message: res.message,
            type: 'success',
            duration: 3000
          })
          this.fetchData()
        }).catch(() => {})
    },
    // 监听搜索的时间
    changeTime (value) {
      // if (value === null) {
      //   this.filterDisabled = true
      // } else if (new Date(value[0]).getFullYear() === new Date(value[1]).getFullYear() && new Date(value[0]).getMonth() === new Date(value[1]).getMonth()) {
      this.listQuery.beginTime = value[0]
      this.listQuery.endTime = value[1]
      //   this.filterDisabled = false
      // } else {
      //   // this.filterDisabled = true
      //   // this.time = [this.listQuery.beginTime, this.listQuery.endTime]
      //   // this.$message.error('请填写一个月内的时间段进行搜索')
      // }
    },
    addCam () {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      let self = this
      self.$nextTick(() => {
        self.$refs['dataform'].resetFields()
        self.resetForm()
      })
    },
    resetForm () {
      this.form = {
        mac: undefined,
        hmac: undefined,
        type: undefined
      }
    },
    submitForm () {
      this.isLoading = true
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          httpPost(addCam, this.form)
            .then((res) => {
              console.log(res)
              this.$message({
                type: 'success',
                duration: 3000,
                message: res.message
              })
              this.fetchData()
              this.isLoading = false
              this.dialogVisible = false
            }).catch(() => {
              this.isLoading = false
            })
        }
      })
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    fetchData () {
      this.search()
    },
    search () {
      this.listLoading = false
      httpGet(searchPage, this.listQuery)
        .then((res) => {
          console.log(res)
          if (res.data.rows !== null) {
            this.tableData = res.data.rows
            this.total = res.data.total
          } else {
            this.tableData = []
            this.total = 0
          }
        }).catch(() => {})
    },
    // 选中
    handleSelectionChange (val) {
      this.testArr = val
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
    batchAdapt () {
      console.log(this.testArr)
      if (this.testArr.length >= 2) {
        for (let i = 0; i < this.testArr.length; i++) {
          if (this.testArr[i].createTime !== this.testArr[i].updateTime) {
            this.$message({
              message: '所选中有某数据内容已被更新过，无法批量修改',
              duration: 3000,
              type: 'warning'
            })
            break
          } else {
            this.isDetails = true
          }
        }
      } else {}
      // this.isDetails = true
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-table .danger-row {
  background: hsla(0,87%,69%,.2);
}
</style>
