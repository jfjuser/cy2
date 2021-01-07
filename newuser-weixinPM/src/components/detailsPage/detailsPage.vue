<template>
  <div v-if="renderingComplete" v-cloak>
    <NavBar
      title="申请详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="details">
      <div class="title">{{details.aiUserName}}的{{applicationType.boolean[details.attendanceType]}}<van-tag plain :type="auditStatusColor.boolean[details.status]" style="margin-left:1rem">{{auditStatus.boolean[details.status]}}</van-tag></div>
      <div class="body">
          <span>单据详情</span>
          <div>提交时间 : {{timeFormatter(details.createDate)}}</div>
          <div>所在部门 : {{details.dutyCompanyName}}</div>
          <div v-if="details.attendanceType === 1">请假类型 : {{vacationType.boolean[details.vacationType]}}</div>
          <div v-if="details.attendanceType !== 5">开始时间 : {{timeFormatterHour(details.startDate)}}</div>
          <div v-if="details.attendanceType !== 5">结束时间 : {{timeFormatterHour(details.endDate)}}</div>
          <div v-if="details.attendanceType === 5">补卡时间 : {{timeFormatterHour(details.startDate)}}</div>
          <div v-if="details.attendanceType === 4">外出地点 : {{details.evectionPlace}}</div>
          <div v-if="details.attendanceType === 2">出差地点 : {{details.evectionPlace}}</div>
          <div>{{applicationType.boolean[details.attendanceType]}}事由 : {{details.vacationReasons}}</div>
      </div>
      <div class="footer">
          <span>审批流程</span>
          <div class="approvalProcess">
              <span class=""><img src="@/assets/people.png" alt=""><span style="margin-left:2rem;font-weight:bold">审批人</span></span>
              <div class="approvalPeople" v-for="item in details.approveDtoLists" :key="item.approveUserId">
                  <div>
                  <img v-if="item.status === 1" src="@/assets/success.png" alt="" style="margin-right:0.5rem">
                  <img v-if="item.status === 2" src="@/assets/danger.png" alt="" style="margin-right:0.5rem">
                  <img v-if="item.status === 3" src="@/assets/primary.png" alt="" style="margin-right:0.5rem">
                  {{item.approveUserName}}</div>
                  <div>{{auditStatus1.boolean[item.status]}}{{item.approveDate !== null ? timeFormatterNoYear(item.approveDate) : ' '}}</div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {NavBar, Cell, CellGroup, Tag} from 'vant'
import {getByVacationId} from '@/api/url'
import { timeFormatter, timeFormatterHour, timeFormatterNoYear } from '@/utils/formatter'
export default {
  name: '',
  data () {
    return {
      renderingComplete: 'false',
      timeFormatterNoYear,
      timeFormatter,
      timeFormatterHour,
      details: {},
      auditStatus1: {boolean: {0: ' ', 1: '已通过', 2: '已驳回', 3: '未审批'}}, // 审核状态
      applicationType: {boolean: {1: '请假', 2: '出差', 3: '加班', 4: '外出', 5: '补卡'}}, // 申请类型转化
      auditStatusColor: {boolean: {1: 'primary', 2: 'success', 3: 'danger'}}, // 审核状态颜色
      auditStatus: {boolean: {1: '审批中', 2: '已通过', 3: '已驳回'}}, // 审核状态
      vacationType: {boolean: {0: '年假', 1: '事假', 2: '病假', 3: '调休假', 4: '婚假', 5: '产假', 6: '陪产假', 7: '其他'}}
    }
  },
  components: {
    NavBar,
    vanCell: Cell,
    vanCellGroup: CellGroup,
    vanTag: Tag
  },
  created () {
    this.getDate()
    this.$nextTick(() => {
      this.renderingComplete = true
    })
  },
  methods: {
    onClickLeft () { // 返回按钮
      this.$router.go(-1)
    },
    getDate () {
      this.$http.get(getByVacationId + this.$route.query.vacationId).then(res => {
        this.details = res.data
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.approvalPeople{
    width: 90%;
    display: flex;
    height: 2rem;
    line-height: 2rem;
    justify-content: space-between;
    div{
        height: 2rem;
        line-height: 2rem;
    }
}
.details{
  width: 100%;
  display:flex;
  align-items:center;
  flex-direction:column;
  justify-content:center;
  > div{
    border-bottom:1px solid #E8E8E8
  }
  .title{
      width: 90%;
      font-weight:bold;
      height:3rem;
      line-height: 3rem;
  }
  .body{
      width: 90%;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    span{
        width: 95%;
        height: 3.5rem;
        line-height: 3.5rem;
        color: #585858;
    }
    div{
        width: 90%;
        height: 2rem;
        line-height: 2rem;
        color: #888888;
    }
  }
  .footer{
    width: 90%;
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
    span{
        width: 95%;
        height: 3.5rem;
        line-height: 3.5rem;
        color: #585858;
    }
     .approvalProcess{
        width: 95%;
        color: #888888;
            display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
        span{
            width: 100%;
            display: flex;
            height: 2rem;
            line-height: 2rem;
        }
    }
  }
}
</style>
