<template>
  <div >
    <div class="table-main">
      <div class="filter-container">
        <NavBar
          title="排班"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
        <span style="line-height:2rem;margin-left:1rem">班次说明：</span>
        <Tag class="filter-item" v-for="(item, index) in workShift" :key="index" :type="buttonType[index]" size="mini">{{item.name}}</Tag>
        <Cell title="排班周期" :border="false"/>
        <Field
          :value="timeToFormatter(listQuery.workDate)"
          @focus="showTime"
          style="width:65vw;display:inline-block"
          placeholder="选择月"
          readonly
        />
        <!-- <Tag class="filter-item" size="mini" :type="buttonType[0]">{{workSchedulingName}}</Tag> -->
        <Button class="filter-item" @click="createData" :loading="createLoading" type="primary" size="mini">保存</Button>
        <Button class="filter-item" @click="exportData" :loading="exportLoading" type="primary" size="mini">导出</Button>
        <popup v-model="isDate" position="bottom">
          <DatetimePicker @cancel="closeDate"
          type="year-month" @confirm="selected"/>
        </popup>
      </div>
      <!-- 合计的时候使用 show-summary :summary-method = "getSummaries"   -->
      <!-- <van-row @click="cellClick" style="width: 100%;" size="mini" max-height="600" :data="tableData" border fit highlight-current-row>
        <van-col v-for="(item, index) in list" :key="index" :fixed="item.name === 'userName'" :label="item.date" align="center" :prop="item.name">
          <template slot-scope="scope">
            <span v-if="item.name !== 'userName'">{{workShiftFormatter(scope.row[item.name])}}</span>
            <span v-else>{{scope.row.userName}}</span>
          </template>
        </van-col>
      </van-row> -->
      <van-row v-show="list.length === 0" style="line-height:7.5rem;margin-top:1rem; text-align:center;">
        <van-col span="24">暂无排班信息</van-col>
      </van-row>
      <div v-for="(item, index) in tableData" :key=index>
        <Collapse v-model="activeNames">
          <CollapseItem title="item.name" name="index">
            <div v-for="item in dateList" :key=item.date>
              <span>{{item.date}}</span>
              <Cell icon="clock-o" title="上班时间" value="--"/>
              <Cell icon="clock" title="下班时间" value="--"/>
            </div>
          </CollapseItem>
        </Collapse>
      </div>
      <Popup size="mini" title="排班" append-to-body :visible.sync="dialogVisible" width="300px">
        <Tabs v-model="type" type="border-card">
          <Tab label="按天排班" name="first">
            <div v-for="(item, index) in workShift" :key="index" style="text-align: center;margin-bottom: 10px;">
              <Button style="width: 80%;" @click="itemDayClick(item)" :type="buttonType[index]" size="mini">{{item.name}}</Button>
            </div>
          </Tab>
          <Tab label="按周期排班" name="second">
            <div style="text-align: center;margin-bottom: 10px;">
              <Button style="width: 80%;" :type="buttonType[0]" @click="weekClick()" size="mini">{{workSchedulingName}}</Button>
            </div>
        </Tab>
        </Tabs>
      </Popup>
    </div>
  </div>
</template>
<script>
/**
* 排班
*/
import { DayAndWeekFormatter } from '@/utils/x.js'
import { AIAttendGroupShifts, exportAIAttendGroupShifts } from '@/api/url'
import { httpGet, httpPost, httpExport } from '@/utils/restful'
import { timeToFormatter } from '@/utils/formatter'
import { Tag, DatetimePicker, Toast, Notify, Collapse, CollapseItem, Field, Cell, NavBar, Button, Dialog, Tabs, Tab, Row, Col, Popup } from 'vant'
export default {
  name: 'Schedule',
  components: {
    Tag,
    DatetimePicker,
    Button,
    Dialog,
    Tabs,
    Tab,
    'van-row': Row,
    'van-col': Col,
    Popup,
    NavBar,
    Field,
    Cell,
    Collapse,
    CollapseItem
  },
  // props: {
  //   id: {
  //     type: Number,
  //     required: true
  //   }
  // },
  // watch: {
  //   id (curVal) {
  //     this.listQuery.workCheckGroupId = curVal
  //     this.fetchData()
  //   }
  // },
  data () {
    return {
      dialogVisible: false,
      createLoading: false,
      exportLoading: false,
      timeToFormatter: timeToFormatter,
      DayAndWeekFormatter: DayAndWeekFormatter,
      isDate: false,
      ids: undefined,
      activeNames: [],
      defaultTime: '2019年04月',
      listQuery: {
        workDate: new Date().getFullYear() + '-' + ((new Date().getMonth() + 1) > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
        workCheckGroupId: this.id
      },
      buttonType: ['primary', 'success', 'warning', 'danger', 'info'],
      tableData: [],
      listLoading: true,
      list: [],
      dateList: [],
      workShift: [],
      workSchedulingName: '',
      schedulingCycles: undefined,
      // 排班
      type: 'first',
      row: {},
      column: {}
    }
  },
  methods: {
    showTime () {
      this.isDate = true
    },
    closeDate () {
      this.isDate = false
    },
    selected (value) {
      var d = new Date(value)
      let yt = d.getFullYear() + '-' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1))
      this.listQuery.workDate = yt
      this.isDate = false
      this.dateList = DayAndWeekFormatter(yt)
    },
    //
    onClickLeft () {
      this.$router.go(-1)
    },
    // 修改日期
    changeDate (value) {
      this.list = DayAndWeekFormatter(value)
      this.fetchData()
      this.$forceUpdate()
    },
    // 格式化表格数据
    workShiftFormatter (value) {
      if (value === null || value === undefined) {
        return ''
      } else {
        let data = {}
        this.workShift.forEach(item => {
          if (item.id === value) {
            data = item
          }
        })
        return data.name
      }
    },
    // 获取数据
    fetchData () {
      httpGet(AIAttendGroupShifts, this.listQuery)
        .then(res => {
          console.log(res)
          if (res.data === null) {
            Notify(res.message)
          } else {
            this.tableData = []
            this.workShift = res.data.workShiftIdAndNameDtos
            this.schedulingCycles = res.data.schedulingCycles
            this.workSchedulingName = res.data.workSchedulingName
            let infoDto = res.data.workCycleRecordDetailInfoDtos
            for (let i = 0; i < infoDto.length; i++) {
              // 获取到人
              const data = infoDto[i]
              // 遍历排班记录
              const info = {
                aiUserId: data.aiUserId,
                userName: data.userName
              }
              for (let j = 0; j < data.workCycleRecordDateInfoDtos.length; j++) {
                const works = data.workCycleRecordDateInfoDtos[j]
                let day = new Date(works.workDate).getDate()
                Object.assign(info, {
                  ['name' + day]: works.workShiftId
                })
              }
              this.tableData.push(info)
            }
            this.listLoading = false
            this.dateList = DayAndWeekFormatter(this.listQuery.workDate)
          }
        }).catch((err) => {
          this.list = []
          this.dateList = DayAndWeekFormatter(this.listQuery.workDate)
          Notify(err)
        })
    },
    // 点击单元格
    cellClick (row, column) {
      let day = new Date(this.listQuery.workDate + '-' + (parseInt(column['property'].replace(/[^0-9]/ig, '')) > 10 ? parseInt(column['property'].replace(/[^0-9]/ig, '')) : '0' + parseInt(column['property'].replace(/[^0-9]/ig, '')))).getTime()
      let now = new Date().getTime()
      console.log(day)
      console.log(now)
      if (now > day) {
        Notify('无法修改已过排班！')
      } else {
        this.row = row
        this.column = column
        this.dialogVisible = true
      }
    },
    // 按天排班
    itemDayClick (item) {
      this.$set(this.row, this.column['property'], item.id)
      this.dialogVisible = false
    },
    // 按周期排班
    weekClick () {
      let arr = JSON.parse(this.schedulingCycles)
      this.$confirm('是否确定按此周期进行排班？', '提示', {})
        .then(() => {
          this.dialogVisible = false
          let now = parseInt(this.column['property'].replace(/[^0-9]/ig, ''))
          let num = this.calcTime(this.listQuery.workDate)
          console.log(now, num)
          for (let i = 0; i <= (num - now); i++) {
            this.$set(this.row, 'name' + (now + i), arr[i % arr.length])
          }
        }).catch(() => {})
    },
    // 计算时间
    calcTime (time) {
      let year = parseInt(time.split('-')[0])
      let month = parseInt(time.split('-')[1])
      let now = new Date(year, month, 0)
      return now.getDate()
    },
    // 合计的时候使用 计算
    getSummaries () {
      console.log('ss')
      // const { columns, data } = param
      // console.log(columns)
      // console.log(data)
    },
    // 保存
    createData () {
      this.createLoading = true
      let workCycleRecordInsertDto = []
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        let workCycleRecordDateDtos = []
        for (let [key, value] of Object.entries(element)) {
          if (key.indexOf('name') === 0) {
            let now = parseInt(key.replace(/[^0-9]/ig, '')) > 10 ? parseInt(key.replace(/[^0-9]/ig, '')) : '0' + parseInt(key.replace(/[^0-9]/ig, ''))
            workCycleRecordDateDtos.push({
              workDate: this.listQuery.workDate + '-' + now,
              workShiftId: value
            })
          }
        }
        workCycleRecordInsertDto.push({
          aiUserId: element.aiUserId,
          workCycleRecordDateInfoDtos: workCycleRecordDateDtos
        })
      }
      let data = {
        workCheckGroupId: this.listQuery.workCheckGroupId,
        workCycleRecordInsertDto: workCycleRecordInsertDto
      }
      httpPost(AIAttendGroupShifts, data)
        .then(res => {
          this.createLoading = false
          Toast.success(res.message)
        }).catch((err) => {
          this.createLoading = false
          Notify(err)
        })
    },
    // 导出排班
    exportData () {
      Dialog.confirm({message: '确认导出当前选中月的排班表？', title: '提示'})
        .then(() => {
          this.exportLoading = true
          let data = {
            year: this.listQuery.workDate.split('-')[0],
            month: this.listQuery.workDate.split('-')[1],
            groupId: this.listQuery.workCheckGroupId
          }
          httpExport(exportAIAttendGroupShifts, data)
            .then(() => {
              this.exportLoading = false
            }).catch(() => {
              this.exportLoading = false
            })
        }).catch(() => {})
    }
  },
  mounted () {
    this.fetchData()
  },
  created () {
    this.ids = this.$route.params.id
    this.listQuery.workCheckGroupId = this.ids
    // console.log(this.listQuery.workCheckGroupId)
    // 获取当前表头
    this.list = DayAndWeekFormatter(this.listQuery.workDate)
  }
}
</script>
