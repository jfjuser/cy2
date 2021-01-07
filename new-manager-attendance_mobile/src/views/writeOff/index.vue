<template>
    <div class="bgc-grey full-height">
              <van-dropdown-menu>
            <van-dropdown-item @change="approveSearchType" v-model="approvalFormData.attendanceType" :options="option2" />
</van-dropdown-menu>
        <!-- <van-cell-group>
            <van-cell title="选择日期" is-link :value="beginTime" @click="showTime = true" />
        </van-cell-group> -->
        <section class="list">
                <van-list
  :immediate-check="false"
  v-model="loadingApproval"
  :finished="finishedApproval"
  style="min-height:50vh"
  :finished-text="isLoadingApprovalList?'':'没有更多了'"
  @load="onLoadApproval"
  offset="50"
>
<div >
      <div class="card" v-for="item in approvalList" :key="item.aiUserId" style="padding: 0.5rem 0;">
        <div class="card-content">
            <div class="card-child" style="font-size:0.4rem">{{item.aiUserName}}的{{applicationType.boolean[item.attendanceType]}}</div>
            <div v-if="item.attendanceType === 1" class="card-child" style="color:#686868;font-size:0.4rem">请假类型:  {{vacationType.boolean[item.vacationType]}}</div>
            <div v-if="item.attendanceType === 2" class="card-child" style="color:#686868;font-size:0.4rem">出差地点:  {{item.evectionPlace}}</div>
            <div v-if="item.attendanceType !== 5" class="card-child" style="color:#686868;font-size:0.4rem">开始时间: {{item.startDate}}</div>
            <div v-if="item.attendanceType !== 5"  class="card-child" style="color:#686868;font-size:0.4rem">结束时间: {{item.endDate}}</div>
            <div v-if="item.attendanceType === 5"  class="card-child" style="color:#686868;font-size:0.4rem">补卡时间: {{item.endDate}}</div>
            <div class="card-child" style="color:#686868;font-size:0.4rem;color: green" v-if="item.approveStatus === 1">申请状态: 已通过</div>
            <div class="card-child" style="color:#686868;font-size:0.4rem;color: red" v-if="item.approveStatus === 2">申请状态: 已驳回</div>
            <div class="card-child" style="color:#686868;font-size:0.4rem;color: blue" v-if="item.approveStatus === 3">申请状态: 审批中</div>
            <div class="card-child" style="color:#686868;font-size:0.4rem">{{applicationType.boolean[item.attendanceType]}}事由: {{item.vacationReasons}} </div>
        </div>
      </div>
      </div>
</van-list>
          <!-- <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="无更多数据"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="fetchData"
          >
            <div class="panel" v-for="(item, index) in listData" :key="index">
                <van-panel :title="item.userName">
                    <van-cell title="考勤时间" :value="$dayjs(item.workDay).format('YYYY-MM-DD')" />
                    <van-cell title="类型" :value="cardTypeFormatter(item.type)" />
                    <van-cell title="详情" :value="item.workModify" />
                    <van-cell title="操作时间" :value="$dayjs(item.updateAt).format('YYYY-MM-DD HH:mm:ss')" />
                </van-panel>
            </div>
          </van-list> -->
        </section>

        <van-popup v-model="showTime" position="bottom" :close-on-click-overlay="false" safe-area-inset-bottom>
            <van-datetime-picker
            v-model="currentDate1"
            type="year-month"
            :max-date="maxDate"
            show-toolbar
            @cancel="showTime=false"
            @confirm="handleConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import { Panel, DatetimePicker, Search, DropdownMenu, DropdownItem } from 'vant'
import { timeFormatter, checkDataArr, cardTypeFormatter, toNull } from '@/utils/formatter'
import { AIWriteOff, listVacation } from '@/api/url'
export default {
  components: {
    'van-panel': Panel,
    [DatetimePicker.name]: DatetimePicker,
    'van-search': Search,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem
  },
  created () {
    this.getApproval()
  },
  data () {
    return {
      vacationType: {boolean: {0: '年假', 1: '事假', 2: '病假', 3: '调休假', 4: '婚假', 5: '产假', 6: '陪产假', 7: '其他'}}, // 用于转换
      applicationType: {boolean: {1: '请假', 2: '出差', 3: '加班', 4: '外出', 5: '补卡'}}, // 申请类型转化
      isLoadingApprovalList: false, // 审核下拉刷新flag
      loadingApproval: false,
      finishedApproval: false,
      cardTypeFormatter,
      searchVal: '',
      currentDate1: new Date(),
      maxDate: new Date(),
      showTime: false,
      beginTime: this.$dayjs().format('YYYY-MM'),
      listData: [
        // {userName: '望', workDay: 1565798400000, type: 2, workModify: '管理员faceTest修改为正常', updateAt: 1566373599000}
      ],
      listQuery: {
        offset: 1,
        limit: 10,
        beginTime: this.$dayjs().format('YYYY-MM') + '-01 00:00:00',
        endTime: `${this.$dayjs().format('YYYY-MM')}-${this.$dayjs().daysInMonth()} 23:59:59`,
        userName: '',
        departmentId: this.$store.getters.departmentId,
        id: this.$store.getters.userId
      },
      finished: false,
      listLoading: false,
      error: false,
      // 请求审批参数
      approvalFormData: {
        attendanceType: '',
        approveUserId: undefined,
        departmentId: undefined,
        offset: 1,
        limit: 10,
        approveStatus: 3
      },
      approvalList: [],
      option2: [
        { text: '全部类型', value: '' },
        { text: '请假申请', value: 1 },
        { text: '出差申请', value: 2 },
        { text: '加班申请', value: 3 },
        { text: '外出申请', value: 4 },
        { text: '补卡申请', value: 5 }
      ]

    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  methods: {
    approveSearchType () {
      this.approvalFormData.offset = 1
      this.approvalList = []
      this.getApproval()
    },
    onLoadApproval () {
      this.approvalFormData.offset++
      let that = this
      setTimeout(async () => {
        await that.getApproval()
        that.loadingApproval = false
        if (that.approvalList.length >= that.approvalTotal) {
          that.finishedApproval = true
        }
      }, 1500)
    },
    handleConfirm (val) {
      this.beginTime = this.$dayjs(val).format('YYYY-MM')
      this.listQuery.offset = 1
      this.listQuery.beginTime = this.$dayjs(val).format('YYYY-MM') + '-01 00:00:00'
      this.listQuery.endTime = this.$dayjs(val).format('YYYY-MM') + '-' + this.$dayjs(val).daysInMonth() + ' 23:59:59'
      this.showTime = false
      this.fetchData()
    },
    // 获取审批信息列表
    getApproval () {
      this.approvalFormData.departmentId = this.$store.getters.departmentId
      this.$http.post(listVacation, this.approvalFormData).then(res => {
        this.loadingApproval = false
        res.data.rows.forEach(ele => {
          ele.startDate = timeFormatter(ele.startDate)
          ele.endDate = timeFormatter(ele.endDate)
        })
        this.approvalList = this.approvalList.concat(res.data.rows)
        this.approvalTotal = res.data.total
        this.isLoadingApprovalList = false
      })
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.$http.get(AIWriteOff, {params: this.listQuery}).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.listData = Object.freeze(this.listData.concat(res.data.rows))

          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    onSearch () {
      this.listQuery.offset = 1
      this.listData = []
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  .panel {
      margin-top: 15px;
  }
}
.approvalCompleted{
  color: #C0C0C0;
}
.ifApproval{
  margin-top: 0.5rem;
  display: flex;
  width: 100%;
.approvalSpan{
  text-align: center;
  display: inline-block;
  width: 50%;
  color: #0099FF;
}
}
.card{
  background: #fff;
  width: 95%;
  margin: 0.5rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .card-content{
    width: 90%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .card-child{
      width: 100%;
    }
  }
}
</style>
