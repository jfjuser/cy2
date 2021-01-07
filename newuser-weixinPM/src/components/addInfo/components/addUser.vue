<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div style="height:80vh">
    <van-cell
      style="color:#f03f09;font-style: italic;font-size:15px;background-color:#f1f1f1"
      title="请严格按照流程来进行操作"
    ></van-cell>
     <!-- 添加进度dom -->
      <van-tag  style="margin-top:0.75rem;margin-left:1rem" mark type="primary" @click.native="toDetails">操作指引</van-tag>

   <van-steps direction="vertical" :active="active" active-color="rgb(11, 187, 231)" active-icon='checked'>
    <van-step>
      <p>完善个人资料 <span v-show="active === 0" @click="toAchieve" class="spanCon" >去完善</span></p>
    </van-step>
    <van-step>
      <p>申请加入考勤组 <span v-show="active === 1" @click="toAttend" class="spanCon" >去申请</span></p>
    </van-step>
    <van-step>
      <p>等待审核<span v-show="active === 2" @click="checkLiu" class="spanCon" >{{ status }}</span ></p>
    </van-step>
    <van-step style="line-height:2rem;"><p>已完成</p></van-step>
   </van-steps>
   <div
      v-if="active === 2"
      style="text-align:center;font-size:2rem;color:rgb(107,171,240)"
    >
      <van-icon name="weapp-nav"></van-icon>
      <span style="display:block;font-size:1rem"
        >申请已提交给考勤管理员，等待审核</span
      >
   </div>
   </div>
   </van-pull-refresh>
  </div>
</template>
<script>
import { PullRefresh } from 'vant'
import { addGroupStatus } from '@/api/url'
import { httpGet } from '@/utils/restful'
import { mapGetters, mapActions } from 'vuex' // 引入vuex辅助函数Dialog
export default {
  name: '',
  data () {
    return {
      status: '',
      isLoading: false
    }
  },
  created () {
    // console.log('用户信息： ', this.status, this.wxInfo, this.active === 2)

    if (this.wxInfo || this.active === 2) {
      // 判断微信信息是否获取成功
      this.checkLiu() // 查询考勤组的状态码
    }
  },
  components: {
    vanPullRefresh: PullRefresh
  },
  mounted () {

  },
  computed: {
    ...mapGetters('user', [
      'wxInfo',
      'userId',
      'active',
      'userStatus'
    ])
  },
  methods: {
    onRefresh () {
      let that = this
      setTimeout(() => {
        if (that.wxInfo || that.active === 2) {
          that.checkLiu() // 查询考勤组的状态码
          that.isLoading = false
        }
      }, 1500)
    },
    ...mapActions('user', [
      'SaveUserId',
      'SaveUserInfo',
      'SaveActive',
      'SaveUerStatus'
    ]),
    toDetails () {
      this.$router.replace('/detailsShow/')
    },
    toAchieve () {
      this.$router.replace('/addFace/')
    },
    toAttend () {
      this.$router.replace('/addAttend/')
    },
    checkLiu () {
      let _this = this
      // console.log('开始检测当前的账户考勤状态：', this.userId)

      if (this.userId) {
        // 原始配置
        // let userId = localStorage.getItem('userid')
        httpGet(addGroupStatus, {
          userId: this.userId
        })
          .then(res => {
            // console.log('检查当前账户的考勤信息状态。。。：', res.data)
            if (res && res.data && res.data.status !== undefined) {
              let state = res.data.status
              switch (state) {
                case 0:
                  this.SaveActive(2).then(() => {
                    // console.log('测试', this.userStatus)

                    _this.status = '审核中'
                    if (this.userStatus === 0) {
                      this.$dialog.alert({
                        message: '考勤组状态：审核中'
                      })
                    }
                  })
                  break
                case 1:
                  this.SaveActive(3).then(() => {
                    this.status = '审核中'
                    if (this.userStatus === 0) {
                      this.$dialog.alert({
                        message: '考勤组状态：审核通过'
                      })
                    }
                  })
                  break
                case 2:
                  this.SaveActive(1).then(() => {
                    this.status = '审核中'
                    if (this.userStatus === 0) {
                      this.$dialog.alert({
                        message: '考勤组状态：审核未通过'
                      })
                    }
                  })
                  break
                case 3:
                  this.SaveActive(1).then(() => {
                    this.status = '审核中'
                    if (this.userStatus === 0) {
                      this.$dialog.alert({
                        message: '还未加入考勤组，请尽快申请加入'
                      })
                    }
                  })
                  break
                default:
                  this.SaveActive(1).then(() => {
                    this.status = '审核中'
                    if (this.userStatus === 0) {
                      this.$dialog.alert({
                        message: '还未加入考勤组，请尽快申请加入'
                      })
                    }
                  })
              }
              this.SaveUerStatus(1) // 记录状态
            }
          })
          .catch(err => {
            console.log('检查当前账户的考勤信息失败：', err)
            let info = {
              userName: '',
              companyName: undefined,
              phone: undefined,
              photo: '',
              addr: '',
              dutyCompanyId: undefined,
              depName: '',
              type: '0',
              beginTime: undefined,
              endTime: undefined,
              remarks: undefined
            }

            this.SaveActive(0)
            this.SaveUserInfo(info).then(() => {
              // DOTO....
            })
          })
      } else {
        this.SaveActive(0).then(() => {
          this.$notify({
            type: 'warning',
            // message: '用户信息为空！'
            message: '客官！请添加公司！'
          })
        })
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.spanCon {
  text-decoration: underline;
  color: #f03f09;
  position: absolute;
  right: 1rem;
}
.spanCon.static {
  color: rgb(50, 80, 214);
  background: rgb(11, 187, 231);
}
</style>
