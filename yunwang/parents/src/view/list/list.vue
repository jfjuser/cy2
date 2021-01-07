<template>
  <div class="warp-content">
    <!-- 考勤申请模块 -->
    <!-- <NavBar
      title="考勤申请"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    /> -->
    <!-- <div v-if="tabActive === 0">
    <div class="iconRegion">
      <div class="leave" @click="toLeave">
        <img src="@/assets/leave.png" alt="">
        <span>请假申请</span>
      </div>
      <div class="cardReplacement" @click="toCardReplacement">
        <img src="@/assets/cardReplacement.png" alt="">
        <span>补卡申请</span>
      </div>
      <div class="cardReplacement" @click="toBusinessTravel">
        <img src="@/assets/businessTravel.png" alt="">
        <span>出差申请</span>
      </div>
      <div class="cardReplacement" @click="toWorkOvertime">
        <img src="@/assets/workOvertime.png" alt="">
        <span>加班申请</span>
      </div>      <div class="cardReplacement" @click="toGoOut">
        <img src="@/assets/goOut.png" alt="">
        <span>外出申请</span>
      </div>
    </div>
    </div> -->
    <!-- 已提交模块 -->
    <div v-if="tabActive === 0">
      <van-dropdown-menu>
    <van-dropdown-item @change="searchType" v-if="useInfo.user.id" v-model="useInfo.user.id" :options="option2"  />
  <van-dropdown-item @change="searchStatus" v-model="formData.status" :options="option1" />
</van-dropdown-menu>
<van-pull-refresh  v-model="isLoadingApplyList" @refresh="onRefreshApplyList">
<van-list
  offset="50"
  :immediate-check="false"
  style="min-height:50vh"
  v-model="loading"
  :finished="finished"
  :finished-text="isLoadingApplyList?'':'没有更多了'"
  @load="onLoad"
>
<div>
<div @click="toDetailsPage(item.vacationId)" class="card" v-for="item in applyList" :key="item.vacationId" style="padding: 0.5rem 0;">
  <div class="card-content">
    <div class="card-child" style="display:flex">{{item.aiUserName}}的{{applicationType.boolean[item.attendanceType]}}<van-tag plain :type="auditStatusColor.boolean[item.status]" style="margin-left:1rem">{{auditStatus.boolean[item.status]}}</van-tag></div>
    <div v-if="item.attendanceType === 1" class="card-child" style="color:#686868;font-size:0.8rem">请假类型:  {{vacationType.boolean[item.vacationType]}}</div>
    <div v-if="item.attendanceType === 2" class="card-child" style="color:#686868;font-size:0.8rem">出差地点:  {{item.evectionPlace}}</div>
    <div v-if="item.attendanceType === 4" class="card-child" style="color:#686868;font-size:0.8rem">外出地点:  {{item.evectionPlace}}</div>
    <div v-if="item.attendanceType !== 5" class="card-child" style="color:#686868;font-size:0.8rem">开始时间:  {{item.startDate}}</div>
    <div v-if="item.attendanceType !== 5" class="card-child" style="color:#686868;font-size:0.8rem">结束时间:  {{item.endDate}}</div>
     <div v-if="item.attendanceType === 5" class="card-child" style="color:#686868;font-size:0.8rem">补卡时间:  {{item.startDate}}</div>
    <div v-if="item.remark!==null" class="card-child" style="color:#686868;font-size:0.8rem">驳回备注:  {{item.remark}}</div>
    <div class="card-child" style="color:#686868;font-size:0.8rem">{{applicationType.boolean[item.attendanceType]}}事由:  {{item.vacationReasons}}</div>
  </div>
</div>
</div>
</van-list>
</van-pull-refresh>
    </div>
    <!-- 审批模块 -->
    <div v-if="tabActive === 1">
      <van-dropdown-menu>
            <van-dropdown-item @change="approveSearchType" v-model="approvalFormData.attendanceType" :options="option2"  />
              <van-dropdown-item @change="changeApproveStatus" v-model="approvalFormData.approveStatus" :options="approvalOptions" />
            </van-dropdown-menu>
            <van-pull-refresh v-model="isLoadingApprovalList" @refresh="onRefreshApprovalList">
      <van-list
  :immediate-check="false"
  v-model="loadingApproval"
  :finished="finishedApproval"
  style="min-height:50vh"
  :finished-text="isLoadingApprovalList?'':'没有更多了'"
  @load="onLoadApproval"
  offset="50"
>
<div>
      <div class="card" v-for="item in approvalList" :key="item.aiUserId" style="padding: 2rem 0;">
        <div class="card-content">
            <div class="card-child" >{{item.aiUserName}}的{{applicationType.boolean[item.attendanceType]}}</div>
            <div v-if="item.attendanceType === 1" class="card-child" style="color:#686868;font-size:0.8rem">请假类型:  {{vacationType.boolean[item.vacationType]}}</div>
            <div v-if="item.attendanceType === 2" class="card-child" style="color:#686868;font-size:0.8rem">出差地点:  {{item.evectionPlace}}</div>
            <div v-if="item.attendanceType !== 5" class="card-child" style="color:#686868;font-size:0.8rem">开始时间: {{item.startDate}}</div>
            <div v-if="item.attendanceType !== 5"  class="card-child" style="color:#686868;font-size:0.8rem">结束时间: {{item.endDate}}</div>
            <div v-if="item.attendanceType === 5"  class="card-child" style="color:#686868;font-size:0.8rem">补卡时间: {{item.endDate}}</div>
            <div class="card-child" style="color:#686868;font-size:0.8rem">{{applicationType.boolean[item.attendanceType]}}事由: {{item.vacationReasons}} </div>
            <div class="approvalCompleted" v-if="item.approveStatus === 1">已通过</div>
            <div class="approvalCompleted" v-if="item.approveStatus === 2">已驳回</div>
            <!-- <div class="ifApproval" v-if="item.approveStatus === 3">
              <span @click="approvalResults(item,1)" class="approvalSpan">同意</span>
              <span @click="approvalResults(item,2)" class="approvalSpan">驳回</span>
              <van-dialog @confirm="toConfirmResults" confirm-button-color="#0099FF" v-model="showDialog" :title="value === 1 ? `是否同意${item.aiUserName}的请假申请` : `是否驳回${item.aiUserName}的请假申请`" show-cancel-button>
                <div class="flex-vc">
                  <div style="margin-top:1rem">
                    <van-field
                      v-if="value === 1 ? false : true"
                      v-model="message"
                      rows="2"
                      autosize
                      label="原因"
                      type="textarea"
                      maxlength="50"
                      placeholder="请输入驳回原因"
                      show-word-limit
                    />
                  </div>
                </div>
              </van-dialog>
            </div> -->
            <!-- <div class="ifApproval" v-if="item.approveStatus === 3">
              <span @click="approvalResults(item,1)" class="approvalSpan">同意</span>
              <span @click="approvalResults(item,2)" class="approvalSpan">驳回</span>
            </div> -->
        </div>
      </div>
      </div>
</van-list>
</van-pull-refresh>
    </div>
<!-- Tabbar标签栏模块 -->
<!-- <van-tabbar v-model="tabActive"> -->
  <!-- <van-tabbar-item icon="add">新申请</van-tabbar-item> -->
  <!-- <van-tabbar-item icon="underway">已提交</van-tabbar-item> -->
  <!-- <van-tabbar-item v-if="ifApprovalAuthority" icon="bookmark">我审批的</van-tabbar-item> -->
<!-- </van-tabbar> -->
<!-- <div style="height: 3rem;"></div> -->
  </div>
</template>
<script>
import {NavBar, Tabbar, TabbarItem, DropdownMenu, DropdownItem, List, Dialog, Toast, PullRefresh} from 'vant'
import { getPowerByParams, listVacation, approveVacation, getAiuserMessage } from '@/api/url'
// import { mapGetters } from 'vuex' // 引入vuex辅助函数
import { timeFormatter } from '@/utils/formatter'
import { getDepInfo, getUserInfo, getWxInfo } from '@/utils/userInfo.js'
import { httpPost, httpGet } from '@/utils/restful'
export default {
  name: 'cardApply',
  data () {
    return {
      isLoadingApprovalList: false, // 审核下拉刷新flag
      isLoadingApplyList: false, // 申请下拉刷新flag
      message: '', // 驳回原因
      item: {}, // 存放审批信息
      value: '', // 是否通过审批
      showDialog: false, // 提示弹窗
      approvalOptions: [
        { text: '全部审批', value: '' },
        { text: '待审批', value: 3 },
        { text: '已通过', value: 1 },
        { text: '已驳回', value: 2 }
      ],
      ismm: true,
      // 请求申请
      formData: {
        offset: 1,
        limit: 10,
        aiUserId: undefined,
        departmentId: undefined,
        status: '',
        attendanceType: 1
      },
      // 请求审核
      approvalFormData: {
        attendanceType: 1,
        approveUserId: undefined,
        departmentId: undefined,
        offset: 1,
        limit: 10,
        approveStatus: 3
      },
      approvalList: [],
      useInfo: {
        user: {
          id: ''
        }
      },
      loading: false,
      finished: false,
      loadingApproval: false,
      finishedApproval: false,
      total: '',
      approvalTotal: '',
      applyList: [], // 申请的条目
      applicationType: {boolean: {1: '请假', 2: '出差', 3: '加班', 4: '外出', 5: '补卡'}}, // 申请类型转化
      auditStatusColor: {boolean: {1: 'primary', 2: 'success', 3: 'danger'}}, // 审核状态颜色
      auditStatus: {boolean: {1: '审批中', 2: '已通过', 3: '已驳回'}}, // 审核状态
      vacationType: {boolean: {0: '年假', 1: '事假', 2: '病假', 3: '调休假', 4: '婚假', 5: '产假', 6: '陪产假', 7: '其他'}}, // 用于转换
      ifApprovalAuthority: true, // 是否有审批的权限
      tabActive: 0,
      option1: [
        { text: '全部状态', value: '' },
        { text: '审批中', value: 1 },
        { text: '已通过', value: 2 },
        { text: '已驳回', value: 3 }
      ],
      option2: [
        // { text: '全部类型', value: '' },
        // { text: '请假申请', value: 1 }
        // { text: '出差申请', value: 2 },
        // { text: '加班申请', value: 3 },
        // { text: '外出申请', value: 4 },
        // { text: '补卡申请', value: 5 }
      ]
    }
  },
  created () {
    // 获取页面请假条目
    this.getUserInfo()
    if (this.$route.query.page) {
      this.tabActive = 2
    }
  },
  // computed: {
  //   ...mapGetters('user', ['userId', 'userInfo', 'active', 'wxInfo', 'departmentId'])
  // },
  methods: {
    // 下拉刷新审核列表
    onRefreshApprovalList () {
      this.finishedApproval = false
      this.approvalFormData.offset = 1
      let self = this
      setTimeout(() => {
        self.approvalList = []
        self.getApproval()
      }, 1000)
    },
    // 下拉刷新申请列表
    onRefreshApplyList () {
      this.finished = false
      this.formData.offset = 1
      let self = this
      setTimeout(() => {
        self.applyList = []
        self.getSubmitted()
      }, 1000)
    },
    // 跳转到详情页面
    toDetailsPage (vacationId) {
      this.$router.push({path: '/detailsPage/', query: {vacationId: vacationId}})
    },
    // 确认审核结果
    toConfirmResults () {
      httpPost(approveVacation,
        { businessNo: this.item.vacationNo,
          approveUserId: this.approvalFormData.approveUserId,
          status: this.value,
          remark: this.value === 1 ? '' : this.message,
          approveType: this.item.attendanceType
        })
        .then((res) => {
          Toast(res.message)
          this.approvalFormData.offset = 1
          this.approvalList = []
          this.getApproval()
        })
        .catch(() => {
          // on cancel
        })
    },
    approveSearchType () {
      this.approvalFormData.offset = 1
      this.approvalList = []
      this.getApproval()
    },
    searchType (val) {
      console.log(999, val)
      this.formData.offset = 1
      this.applyList = []
      this.getSubmitted()
    },
    // 切换不同审核状态时触发的事件
    changeApproveStatus (val) {
      console.log(val)
      this.approvalFormData.offset = 1
      this.approvalList = []
      this.getApproval()
    },
    // 跳转到出差申请页面
    toBusinessTravel () {
      this.$router.replace('/businessTravelApply/')
    },

    // 跳转到加班申请页面
    toWorkOvertime () {
      this.$router.replace('/workOvertimeApply/')
    },
    // 跳转到外出页面
    toGoOut () {
      this.$router.replace('/goOutApply/')
    },
    // 审核列表上拉加载
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
    // 申请列表上拉加载
    onLoad () {
      this.formData.offset++
      let that = this
      setTimeout(async () => {
        await that.getSubmitted()
        this.loading = false
        if (this.applyList.length >= this.total) {
          this.finished = true
        }
      }, 1500)
    },
    // 选择状态时触发
    searchStatus (val) {
      this.formData.offset = 1
      this.applyList = []
      this.getSubmitted()
    },
    // 点击同意或者驳回
    approvalResults (item, value) {
      this.showDialog = true
      this.item = item
      this.value = value
    },
    onClickLeft () { // 返回按钮
      this.$router.replace('/mySet/')
    },
    toCardReplacement () { // 点击去补卡申请
      this.$router.push('/cardApply/')
    },
    toLeave () { // 点击请假申请
      this.$router.push('/leaveApply/')
    },
    getUserInfo () {
      let arr = []
      // let arr1 = []
      httpGet(getAiuserMessage + getWxInfo().unicode + '/' + getWxInfo().account).then((res) => {
        console.log(res.data.length)
        if (res.data.length / 1 > 0) {
          res.data.forEach((item, index) => {
            if (item.user) {
              // this.useInfo = item
              item.text = item.user.userName
              item.value = item.user.id
              arr.push(item)
            }
          })
          console.log(arr)
          if (arr.length / 1 > 0) {
            if (arr.length / 1 === 1) {
              this.useInfo = arr[0]
              this.option2 = arr
            } else {
              this.useInfo = arr[0]
              this.option2 = arr
              // this.check.forEach((item1, index1) => {
              //   this.getSubmitted(item1.user.id)
              //   this.getApprovalAuthority(item1.user.id)
              // })
            }
            this.getSubmitted()
            this.getApprovalAuthority()
          } else {
            Toast('请先绑定用户信息')
            setTimeout(() => {
              this.$router.replace('/faceAI/userAdmin/')
            }, 3000)
          }
          console.log(5555, this.useInfo)
          // res.data.forEach((item, index) => {
          //   if (item.user) {
          //     this.useInfo = item
          //     console.log(this.useInfo)
          //     this.getSubmitted()
          //     // 获取该用户是否有审批的权限
          //     this.getApprovalAuthority()
          //   } else {
          //     Toast('请先绑定用户信息')
          //     setTimeout(() => {
          //       this.$router.replace('/faceAI/userAdmin/')
          //     }, 3000)
          //   }
          // })
        } else {
          Toast('请先绑定用户信息')
          setTimeout(() => {
            this.$router.replace('/faceAI/userAdmin/')
          }, 3000)
        }
      }).catch(() => {
        Toast('请先绑定用户信息')
        setTimeout(() => {
          this.$router.replace('/faceAI/userAdmin/')
        }, 3000)
      })
    },
    // 获取审批的权限
    getApprovalAuthority () {
      httpGet(getPowerByParams + `/${getDepInfo().departmentId}/${this.useInfo.user.id}`).then(res => {
        this.ifApprovalAuthority = res.data
        if (res.data) {
          that.getApproval() // 如果权限判断为true的话，则请求审核列表
        }
      })
    },
    // 获取申请的条目
    getSubmitted () {
      this.formData.aiUserId = this.useInfo.user.id
      this.formData.departmentId = getDepInfo().departmentId
      httpPost(listVacation, this.formData).then(res => {
        res.data.rows.forEach(ele => {
          ele.startDate = timeFormatter(ele.startDate)
          ele.endDate = timeFormatter(ele.endDate)
        })
        this.applyList = this.applyList.concat(res.data.rows)
        this.total = res.data.total
        this.isLoadingApplyList = false
      })
    },
    // 获取审批的条目
    getApproval () {
      this.approvalFormData.approveUserId = this.useInfo.user.id
      this.approvalFormData.departmentId = getDepInfo().departmentId
      httpPost(listVacation, this.approvalFormData).then(res => {
        this.loadingApproval = false
        res.data.rows.forEach(ele => {
          ele.startDate = timeFormatter(ele.startDate)
          ele.endDate = timeFormatter(ele.endDate)
        })
        this.approvalList = this.approvalList.concat(res.data.rows)
        this.approvalTotal = res.data.total
        this.isLoadingApprovalList = false
      })
    }
  },
  components: {
    Toast,
    NavBar,
    vanTabbar: Tabbar,
    vanTabbarItem: TabbarItem,
    vanDropdownMenu: DropdownMenu,
    vanDropdownItem: DropdownItem,
    vanList: List,
    vanDialog: Dialog,
    vanPullRefresh: PullRefresh,
    [Dialog.Component.name]: Dialog.Component
  }
}
</script>
<style lang="scss" scoped>
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
  margin: 1rem auto;
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
 .warp-content{
   background-color: rgb(248,248,248);
   min-height: 100vh;
 }
  .iconRegion{

    width: 100vw;
    display: flex;  justify-content: space-around;  flex-direction: row;  flex-wrap: wrap;
    div:last-child {
      margin-right: auto
    }
    div{
      margin-top: 2rem;
      width: 50%;
         display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: flex-start;
    span{
      margin-top: 0.2rem;
    }
    }
  }
  .flex-vc{
    display:flex;
    align-items:center;
    flex-direction:column;
    justify-content:center;
  }
</style>
