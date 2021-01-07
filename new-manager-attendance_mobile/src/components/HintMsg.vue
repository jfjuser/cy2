<template>
  <div class="hint-msg" v-if="isMsgShow" :class="{ 'hide-to': setHintMsg }">
    <span class="icon-next" @click="setHintMsg = false" v-show="setHintMsg"></span>
    <div class="msg">
      <p
        v-for="(item, index) in msgList"
        @click="msgEvent(index)"
        :key="index"
        class="msg-box"
        v-show="item.count !== 0"
      >
        <span class="count">{{ item.count }}</span
        ><span class="title">{{ item.title }}</span
        ><van-icon name="arrow" />
      </p>
    </div>
  </div>
</template>
<script>
import { getAdd2Group, apiExitCompany } from '@/api/url'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: '',
  data () {
    return {
      isHideTo: false,
      isMsgShow: false,
      msgList: [
        { title: '申请加入考勤组', count: 0, to: '/message/' },
        { title: '申请退出公司', count: 0, to: '/message/' }
      ]
    }
  },
  created () {
    // 检测获取添加考勤组信息
    this.getReqAddAttend()
    // 获取用户退出公司的申请信息
    this.getUserOutCompany()
    // console.log('用户id', this.userId)
  },
  computed: {
    ...mapGetters('app', ['reqAddAttendUser', 'reqUserOutCompany', 'isHintMsg']),
    ...mapGetters(['userId']),
    setHintMsg: {
      get () { return this.isHintMsg },
      set (flag) { return this.SaveIsHintMsg(flag) }
    }
  },
  mounted () {
    // console.log('获取退出公司申请数据：', this.reqUserOutCompany)
    // console.log('获取添加考勤组数据：', this.$route.name)
    // if ((this.reqAddAttendUser.length > 0 || this.reqUserOutCompany.length > 0) && this.$route.name === 'home') {
    //   //   console.log('显示显示显示。。。。。。。。。。。。。')
    //   this.isMsgShow = true
    // } else {
    //   this.isMsgShow = false
    // }
  },
  methods: {
    ...mapActions('app', ['SaveReqAddAttendUser', 'SaveReqUserOutCompany', 'SaveIsHintMsg']),
    msgEvent (index) {
      //   console.log('用户正在点击。。。', index)
      this.setHintMsg = true

      //   setTimeout(() => {
      //     ({
      //       path: this.msgList[index].to,
      //       query: {
      //         tid: index
      //       }
      //     })
      //   }, 1500)
    },
    // 获取添加考勤组信息
    getReqAddAttend () {
      this.$http
        .get(getAdd2Group)
        .then(res => {
          // console.log('获取添加考勤组信息', res)
          if (res.code === 1) {
            this.SaveReqAddAttendUser(res.data).then(() => {
              let len = res.data.length || 0
              this.msgList[0].count = len
            })
          }
        })
        .catch((err) => {
          console.log('获取申请考勤组失败信息：', err)
        })
    },
    // 获取用户退出公司的申请信息
    getUserOutCompany () {
      //   if (!this.userId) return
      //   apiExitCompany + this.userId
      this.$http
        .get(apiExitCompany)
        .then(res => {
          console.log('获取用户退出公司的申请信息', res.data)
          if (res.code === 1) {
            this.SaveReqUserOutCompany(res.data).then(() => {
              let len = res.data.length || 0
              this.msgList[1].count = len
            })
          }
        })
        .catch(err => {
          console.log('获取申请退出公司失败信息：', err)
          // this.$toast.fail(err.err)
        })
    }
  },
  watch: {
    //   监听路由
    '$route.path': {
      handler (newVal, oldVal) {
        if (newVal === '/home/') {
          if ((this.reqAddAttendUser.length > 0 || this.reqUserOutCompany.length > 0)) {
            // console.log('显示显示显示。。。。。。。。。。。。。')
            this.isMsgShow = true
          } else {
            this.isMsgShow = false
          }
        } else {
          this.isMsgShow = false
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
$nextIcon: "~@/assets/icon/next.png";
.hint-msg {
  position: fixed;
  right: 0;
  bottom: 1.53333rem;
  // width: 3rem;
  transition: all 0.5s;
  .icon-next {
    width: 0.5rem;
    height: 0.5rem;
    position: absolute;
    left: -0.6rem;
    top: 50%;
    background: url($nextIcon) no-repeat center;
    background-size: 100% 100%;
    transform: translateY(-50%) rotate(90deg);
  }
  &.hide-to {
    right: -3.6rem;
  }
  .msg-box {
    background: rgb(235, 107, 3);
    color: #fff;
    border-radius: 20px 0 0 20px;
    padding: 0 0.2rem;
    height: 0.6rem;
    display: flex;
    font-size: 0.2rem;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.1rem;
    .title{
      padding: 0 .2rem;
    }
    .count {
      background: rgb(243, 10, 10);
      min-width: 0.4rem;
      height: 0.4rem;
      text-align: center;
      box-sizing: border-box;
      border-radius: 50%;
    }
  }
}
</style>
