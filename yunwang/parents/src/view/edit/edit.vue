<template>
  <div class="warp-content">
 <!--   <NavBar
      title="请假申请"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    /> -->
<!-- <van-radio-group v-model="radio" direction="horizontal" v-if="check.length > 0" style="font-size: .96rem;">
选择请假人
  <van-radio :name="index / 1 + 1" v-for="(item, index) in check" :key="index">{{item.userName}}</van-radio>
</van-radio-group> -->
 <div class="ast" style="margin-top:1.5rem" v-if="check.length > 0">
      <Field    disabled required v-model="useInfo.userName" @click="showLeavetype1" input-align="right" right-icon="arrow" label="请假人" placeholder="请选择请假人" />
    </div>
        <Popup v-model="leavetypeShow1" position=bottom>
      <van-picker
  title="标题"
  show-toolbar
  value-key="userName"
  :columns="check"
  @confirm="onConfirm1"
/>
    </Popup>

    <div class="ast" style="margin-top:1.5rem">
      <Field    disabled required v-model="leavetype.vacationName" @click="showLeavetype" input-align="right" right-icon="arrow" label="请假类型" placeholder="请选择请假类型" />
    </div>
        <Popup v-model="leavetypeShow" position=bottom>
      <van-picker
  title="标题"
  show-toolbar
  value-key="vacationName"
  :columns="columns"
  @confirm="onConfirm"
/>
    </Popup>
    <!-- 请假开始时间 -->
    <div class="ast" style="margin-top:1.5rem">
      <Field  disabled required v-model="beginTime" @click="showTime" input-align="right" right-icon="arrow" label="请假开始时间" placeholder="请选择时间" />
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
<!-- 请假结束时间 -->
    <div class="ast" style="margin-top:1.5rem">
      <Field  disabled required v-model="endTime" @click="showEndTime" input-align="right" right-icon="arrow" label="请假结束时间" placeholder="请选择时间" />
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
<!-- 请假事由 -->
<div style="margin-top:1rem">    <Field
  v-model="message"
  rows="2"
  autosize
  label="请假事由"
  type="textarea"
  maxlength="50"
  placeholder="请输入请假事由"
  show-word-limit
/></div>
<!-- 审批人区域 -->
<!-- <div class="addReviewer"> -->
  <!-- 审批人列表 -->
<!--  <div class="addReviewerMessage" style="margin-bottom:1rem"><span style="margin-left:0.6rem">请添加审批人 </span><span style="color:#7B7B7B">(按从上到下依次审批)</span></div>
<div v-for="item in reviewerList" :key="item.userName" class="approved">
<van-tag plain type="primary" size="large" closeable  @close="deleteReviewer">{{item.userName}}</van-tag>
<img src="@/assets/down.png" alt="">
</div> -->
  <!-- 添加审批人按钮 -->
<!-- <div><img src="@/assets/addReviewer.png" alt="" @click="addReviewer"></div>
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
</div> -->
<!-- 添加抄送人区域 -->
<!-- <div class="addCcPerson">
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
</div> -->
<!-- 提交请假信息 -->
<div class="submitApplication" @click="submitApplication"><van-button style="border-radius:8px" type="info">提交申请</van-button></div>

  </div>
</template>
<script>
import {NavBar, Field, DatetimePicker, Popup, RadioGroup, Radio, Toast, Picker, Button, Tag, Divider, Checkbox, CheckboxGroup, Notify, Cell, CellGroup} from 'vant'
import { timeFormatter } from '@/utils/formatter.js'
import { httpPost, httpGet } from '@/utils/restful'
import { listApproveUser, doApproveVacationByStudent, insert, getAiuserMessage } from '@/api/url'
import { getDepInfo, getWxInfo, getUserInfo } from '@/utils/userInfo.js'
// import { mapGetters } from 'vuex' // 引入vuex辅助函数
// import { httpGet } from '@/utils/restful'
export default {
  name: '',
  data () {
    return {
      radio: '',
      leavetypeShow1: false,
      currentDate: new Date(),
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      result: [], // 选择的抄送员
      ccPersonShow: false, // 抄送员弹窗
      addReviewerShow: false, // 底部弹出层-用于选择审批员
      reviewerList: [], // 审批人列表
      allReviewerList: [], // 全部审批人列表
      message: '', // 请假事由
      useInfo: {},
	    check: [],
      columns: [
        // {vacationName: '年假', vacationType: 0},
        {vacationName: '事假', vacationType: 1},
        {vacationName: '病假', vacationType: 2}
        // {vacationName: '调休假', vacationType: 3},
        // {vacationName: '婚假', vacationType: 4},
        // {vacationName: '产假', vacationType: 5},
        // {vacationName: '陪产假', vacationType: 6},
        // {vacationName: '其他', vacationType: 7}
      ],
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
    vanCellGroup: CellGroup,
    vanCell: Cell,
    vanRadio: Radio,
    vanRadioGroup: RadioGroup,
    [Notify.Component.name]: Notify.Component
  },
  created () {
    this.getData()
    this.getUserInfo()
  },
  // computed: {
  //   ...mapGetters('user', ['userId', 'userInfo', 'active', 'wxInfo', 'departmentId'])
  // },
  methods: {
    getFieldValue (e) {
      this.message = e.detail
    },
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
      } else if (type === 'minute') {
        return `${val}分`
      }
      return val
    },
    onCancel () {
      this.addReviewerShow = false
    },
    getUserInfo () {
	  let arr = []
      httpGet(getAiuserMessage + getWxInfo().unicode + '/' + getWxInfo().account).then((res) => {
        if (res.data) {
          res.data.forEach((item, index) => {
            if (item.user) {
              // this.useInfo = item
              item.userName = item.user.userName
			        arr.push(item)
            }
          })
		      if (arr.length > 0) {
			      if (arr.length / 1 === 1) {
              this.useInfo = arr[0]
            } else {
              this.check = arr
              this.useInfo = arr[0]
            }
		      } else {
            Toast('请先绑定用户信息')
            setTimeout(() => {
              this.$router.replace('/faceAI/userAdmin/')
            }, 3000)
          }
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
    // 请求审批人数据
    getData () {
      // this.userInfo.dutyCompanyId
      // console.log(listApproveUser)
      httpPost(listApproveUser, {offset: 1, limit: 999, departmentId: getDepInfo().departmentId})
        .then(res => {
          console.log(res)
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
    // 提交请假申请
    submitApplication () {
      if (this.leavetype.vacationType == undefined ||
      this.beginTime == undefined ||
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
      httpPost(insert, {
        departmentId: getDepInfo().departmentId, // 部门 发布时修改 this.userInfo.dutyCompanyId
        aiUserId: this.useInfo.user.id, // 用户id 发布时修改 this.userInfo.id
        vacationType: this.leavetype.vacationType, // 请假的类型
        attendanceType: 1, // 申请类型
        startDate: this.beginTime, // 请假开始时间
        endDate: this.endTime, // 请假结束时间
        vacationReasons: this.message, // 请假事由
        approveUserIds: [{
          approveUserId: this.useInfo.user.dutyCompanyId,
          level: 1
        }], // 审批员
        dutyCompanyName: this.useInfo.user.dutyCompanyName, // 名字
        aiUserName: this.useInfo.user.userName // 用户名
        // ccUserIds: newCcList // 抄送员
      }).then(res => {
        if (res.code / 1 == 1) {
          Toast('提交成功')
          this.$router.replace('/faceAI/userModel/')
        } else {
          Toast.fail(res.message)
        }
      }).catch((err) => {
        Toast.fail(err)
      })
    },
    // 确认请假类型时触发
    onConfirm (value, index) {
      this.leavetype = value
      this.leavetypeShow = false
    },
    onConfirm1 (value, index) {
      console.log(value)
      this.useInfo = value
      this.leavetypeShow1 = false
    },
    // 展示请假类型
    showLeavetype () {
      this.leavetypeShow = true
    },
    showLeavetype1 () {
      this.leavetypeShow1 = true
    },
    onClickLeft () { // 返回按钮
      this.$router.replace('/faceAI/userModel/')
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
