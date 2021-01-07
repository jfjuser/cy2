<template>
  <div class="warp-content">
    <NavBar
      title="加班申请"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 加班开始时间 -->
    <div class="ast" style="margin-top:1.5rem">
      <Field  disabled required v-model="beginTime" @click="showTime" input-align="right" right-icon="arrow" label="加班开始时间" placeholder="请选择时间" />
    </div>
    <Popup v-model="beginShow" position=top>
      <DatetimePicker
        @cancel="beginShow = false"
        @confirm="gainValue"
        type="datehour"
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </Popup>
<!-- 加班结束时间 -->
    <div class="ast" style="margin-top:1.5rem">
      <Field  disabled required v-model="endTime" @click="showEndTime" input-align="right" right-icon="arrow" label="加班结束时间" placeholder="请选择时间" />
    </div>
    <Popup v-model="endShow" position=top>
      <DatetimePicker
        @cancel="endShow = false"
        @confirm="gainEndValue"
        type="datehour"
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
      />
    </Popup>
<!-- 加班事由 -->
<div style="margin-top:1rem">    <van-field
  v-model="message"
  rows="2"
  autosize
  label="加班事由"
  type="textarea"
  maxlength="50"
  placeholder="请输入加班事由"
  show-word-limit
/></div>
<!-- 审批人区域 -->
<div class="addReviewer">
  <!-- 审批人列表 -->
  <div class="addReviewerMessage" style="margin-bottom:1rem"><span style="margin-left:0.6rem">请添加审批人 </span><span style="color:#7B7B7B">(按从上到下依次审批)</span></div>
<div v-for="item in reviewerList" :key="item.userName" class="approved">
<van-tag plain type="primary" size="large" closeable  @close="deleteReviewer">{{item.userName}}</van-tag>
<img src="@/assets/down.png" alt="">
</div>
  <!-- 添加审批人按钮 -->
<div><img src="@/assets/addReviewer.png" alt="" @click="addReviewer"></div>
<Popup v-model="addReviewerShow" position="bottom">
<van-picker
  title="标题"
  show-toolbar
  @cancel="onCancel"
  value-key="userName"
  :columns="allReviewerList"
  @confirm="onConfirmReviewer"
/>
</Popup>
</div>
<!-- 添加抄送人区域 -->
<div class="addCcPerson">
 <div class="addCcPersonMessage" style="margin-bottom:1rem">请添加抄送人</div>
 <div class="addCcPersonContent">
   <van-tag plain style="margin-right:1rem" size="large" type="primary" v-for="item in result" :key="item.id">{{item.userName}}</van-tag>
   <img src="@/assets/addCcPerson.png" alt="" @click="addCcPerson">
 </div>
         <Popup v-model="ccPersonShow" position=bottom>
           <div class="ccPersonShowConfirm">
             <van-button style="border:none" @click="ccPersonShow = false" type="default">取消</van-button>
             <van-button style="border:none" @click="ccPersonShowConfirm" type="info">确认</van-button>
           </div>
           <van-checkbox-group v-model="result">
  <van-cell-group>
    <van-cell
      v-for="(item, index) in allReviewerList"
      clickable
      :key="item.id"
      :title="`${item.userName}`"
      @click="toggle(index)"
    >
      <template #right-icon>
        <van-checkbox :name="item" ref="checkboxes" />
      </template>
    </van-cell>
  </van-cell-group>
</van-checkbox-group>

    </Popup>
</div>
<!-- 提交请假信息 -->
<div class="submitApplication" @click="submitApplication"><van-button style="border-radius:8px" type="info">提交申请</van-button></div>

  </div>
</template>
<script>
import {NavBar, Field, DatetimePicker, Popup, Toast, Picker, Button, Tag, Divider, Checkbox, CheckboxGroup, Notify} from 'vant'
import { timeFormatter } from '@/utils/formatter.js'
// import { httpPost } from '@/utils/restful'
import { listApproveUser, insert } from '@/api/url'
import { mapGetters } from 'vuex' // 引入vuex辅助函数
// import { httpGet } from '@/utils/restful'
export default {
  name: '',
  data () {
    return {
      businessTrip: undefined,
      currentDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      result: [], // 选择的抄送员
      ccPersonShow: false, // 抄送员弹窗
      addReviewerShow: false, // 底部弹出层-用于选择审批员
      reviewerList: [], // 审批人列表
      allReviewerList: [], // 全部审批人列表
      message: undefined, // 请假事由
      beginShow: false, // 弹出开始窗口
      beginTime: undefined, // 开始时间
      endShow: false, // 弹出结束窗口
      endTime: undefined, // 结束时间
      leavetypeShow: false, // 请假类型弹出窗口
      leavetype: {}, // 请假类型
      timeFormatter: timeFormatter
    }
  },
  components: {
    NavBar,
    Field,
    DatetimePicker,
    Popup,
    Toast,
    vanPicker: Picker,
    vanButton: Button,
    vanTag: Tag,
    vanDivider: Divider,
    vanCheckboxGroup: CheckboxGroup,
    vanCheckbox: Checkbox,
    [Notify.Component.name]: Notify.Component
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapGetters('user', ['userId', 'userInfo', 'active', 'wxInfo', 'departmentId'])
  },
  methods: {
    deleteReviewer (index) {
      this.reviewerList.splice(index, 1)
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      } else if (type === 'hour') {
        return `${val}时`
      }
      return val
    },
    onCancel () {
      this.addReviewerShow = false
    },
    // 请求审批人数据
    getData () {
      // this.userInfo.dutyCompanyId
      this.$http.post(listApproveUser, {offset: 1, limit: 999, departmentId: this.departmentId})
        .then(res => {
          this.allReviewerList = res.data.rows
        })
    },
    // 确认抄送员
    ccPersonShowConfirm () {
      this.ccPersonShow = false
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    // 点击打开抄送弹窗
    addCcPerson () {
      this.ccPersonShow = true
    },
    // 添加审批员
    onConfirmReviewer (item) {
      for (let i = 0; i < this.reviewerList.length; i++) {
        if (item.userName == this.reviewerList[i].userName) {
          Toast('请不要选择重复的审批员')
          return
        }
      }
      this.reviewerList.push(item)
      this.addReviewerShow = false
    },
    addReviewer () {
      this.addReviewerShow = true
    },
    // 提交出差申请
    submitApplication () {
      if (this.beginTime == undefined ||
       this.endTime == undefined ||
      this.message == undefined ||
      this.result.length < 0 ||
      this.reviewerList.length < 0) {
        Notify('请填写完整的请假申请')
        return
      }
      let approveUserIds = []
      let level = 1
      let newCcList = []
      this.result.forEach(ele => {
        newCcList.push(ele.userId)
      })
      this.reviewerList.forEach(element => {
        let newObject = {}
        newObject.approveUserId = element.userId
        newObject.level = level
        level++
        approveUserIds.push(newObject)
      })
      this.$http.post(insert, {
        departmentId: this.departmentId, // 部门 发布时修改 this.userInfo.dutyCompanyId
        aiUserId: this.userId, // 用户id 发布时修改 this.userInfo.id
        attendanceType: 3, // 申请类型
        startDate: this.beginTime, // 请假开始时间
        endDate: this.endTime, // 请假结束时间
        vacationReasons: this.message, // 加班事由
        approveUserIds: approveUserIds, // 审批员
        ccUserIds: newCcList // 抄送员
      }).then(res => {
        Toast('提交成功')
        this.$router.replace('/attendance/')
      })
    },
    // 确认请假类型时触发
    onConfirm (value, index) {
      this.leavetype = value
      this.leavetypeShow = false
    },
    // 展示请假类型
    showLeavetype () {
      this.leavetypeShow = true
    },
    onClickLeft () { // 返回按钮
      this.$router.replace('/attendance/')
    },
    // 打开选择开始时间弹框
    showTime () {
      this.beginShow = true
    },
    // 打开选择结束时间弹框
    showEndTime () {
      if (this.beginTime === undefined) {
        Toast('请先选择开始时间')
        return
      }
      this.endShow = true
    },
    // 取得开始时间
    gainValue (value) {
      this.beginTime = this.timeFormatter(value)
      console.log(Date.parse(this.beginTime))
      this.beginShow = false
    },
    // 取得结束时间
    gainEndValue (value) {
      this.endTime = this.timeFormatter(value)
      if (Date.parse(this.beginTime) >= Date.parse(this.endTime)) {
        Toast('结束时间不得在开始时间之前或相等')
        this.endTime = undefined
        return
      }
      this.endShow = false
    }
  }
}
</script>
<style lang='scss' scoped>
 .warp-content{
   background-color: rgb(248,248,248);
 }
 .ast >>> .van-field__control:disabled {
  color: #000
}
/deep/ .van-field--disabled .van-field__label{
    color: #000;
}
.submitApplication{
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    padding-bottom: 1rem;
}
.addReviewer{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .addReviewerMessage{
      width: 100%;
      font-size: 0.8rem;
      padding-top: 1rem;
    }
}
.addCcPerson{
      .addCcPersonMessage{
      font-size: 0.8rem;
      padding-top: 1rem;
      padding-left: 0.6rem;
    }
    .addCcPersonContent{
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
    }
}
.approved{
      display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    img{
      margin-top: -5px;
    }
}
.ccPersonShowConfirm{
  display: flex;
  justify-content: space-between;
}
</style>
