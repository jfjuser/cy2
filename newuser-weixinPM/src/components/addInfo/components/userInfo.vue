<template>
<div>
    <div class="user-info">
    <van-cell-group  >
        <h2 class="title"><span>个人信息</span></h2>
      <van-cell  title="用户名" :value="userInfo.userName" />
      <van-cell title="ID编号" :value="userInfo.id" />
      <van-cell title="手机号" :value="userInfo.phone" />
      <van-cell title="公司名称" :value="userInfo.companyName" />
      <van-cell title="部门名称" :value="userInfo.depName" />
    </van-cell-group>
  </div>
  <!-- <button @click="saveIsShow(true)">展示动画</button> -->
    <transition name="slide-fade">
    <div @click="toAudit" v-if="isShow" class="informationTips">
    <img src="@/assets/approval.png" alt="">
    您有{{total}}条申请需审批
  </div>
  </transition>
</div>
</template>
<script>
import { NavBar } from 'vant'
import { mapGetters, mapActions } from 'vuex' // 引入vuex辅助函数Dialog
import {listVacation} from '@/api/url'
export default {
  name: '',
  data () {
    return {
      total: '',
      show: false,
      approvalFormData: {
        attendanceType: '',
        approveUserId: undefined,
        departmentId: undefined,
        offset: 1,
        limit: 10,
        approveStatus: 3
      }
    }
  },
  created () {
    this.saveIsShow(false)
    this.approvalFormData.approveUserId = this.userId
    this.approvalFormData.departmentId = this.departmentId
    this.$http.post(listVacation, this.approvalFormData).then(res => {
      if (res.data.total > 0) {
        this.total = res.data.total
        this.saveIsShow(true)
      }
    })
    // console.log('userInfo', this.userInfo)
  },
  components: {
    vanNavBar: NavBar
  },
  computed: {
    ...mapGetters('user', [
      'wxInfo',
      'userId',
      'userInfo',
      'active',
      'departmentId',
      'isShow'
    ])
  },
  methods: {
    ...mapActions('user', [
      'saveIsShow',
      'SaveUserId',
      'SaveUserInfo',
      'SaveActive',
      'SaveUerStatus',
      'saveIsShow'
    ]),
    toAudit () {
      this.saveIsShow(false)
      this.$router.push({path: '/attendance/', query: {page: 2}})
    }
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.informationTips{
background:#FFE4C4;
color:#8B4513;
height:2rem;
line-height: 2rem;
border-radius: 10px;
position: fixed;
right: 10px;
bottom: 20vh;
padding:0 10px;
}
.user-info{
    width: 80%;
    margin: 0 auto;
    margin-top: 2rem;
    border: 1px solid #eee;
    border-radius: 10px;
    box-sizing: border-box;
    padding: .5rem;

    .title{
        font-size: 1rem;
        letter-spacing: 1rem;
        text-align: center;
        line-height: 3rem;
        color: #666;
        span{
            color: #1E90FF;
            border-radius: 10px;
            padding: .5rem 1rem;
        }
    }
}
</style>
