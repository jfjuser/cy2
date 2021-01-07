<template>
  <div>
    <section class="list-wrap" v-if="setReqAddAttendUser && setReqAddAttendUser.length > 0">
      <van-cell-group>
        <!--  -->
        <van-cell
          v-for="(item, index) in setReqAddAttendUser"
          @click.prevent="handle(item, index)"
          :key="index"
        >
          <!--  value-class="right-value"
          label-class="left-label" -->
          <template #title
            ><div>
              <span class="left-txt">考勤组:</span><span>{{ item.name }}</span>
            </div></template
          >
          <template #label
            ><div>
              <span class="left-txt">申请人:</span
              ><span>{{ item.userName }}</span>
            </div></template
          >
          <template #default
            ><div>
              <span>申请理由：</span><span>{{ item.remarks }}</span>
            </div></template
          >
        </van-cell>
      </van-cell-group>
    </section>
    <!-- 空空 -->
    <div class="empty" v-else><h1>空空如也...</h1></div>
    <!-- :before-close="beforeClose" -->
    <van-dialog
      v-model="isModelShow"
      title="官方提示"
      confirm-button-text="同意"
      cancel-button-text="拒绝"
      show-cancel-button
      :before-close="beforeClose"
    >
      <template #default>
        <div class="dialog-content">
          是否同意 <strong>{{ userName }}</strong> 加入
          <strong>{{ attend }}</strong> 考勤组?
        </div>
      </template>
    </van-dialog>
    <!-- 拒绝理由 -->
    <van-dialog v-model="isShowRefuse" title="拒绝理由"  :before-close="adminCancel" show-cancel-button>
      <van-field v-model.trim="dataForm.failReason"  :error-message="errMsg" placeholder="请输入拒绝理由..." />
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { auditAdd2Group } from '@/api/url'
export default {
  name: '',
  data () {
    return {
      errMsg: '',
      dataForm: {
        failReason: '',
        id: undefined,
        userId: undefined,
        isChekc: undefined
      },
      index: undefined,
      isModelShow: false,
      userName: '',
      attend: '',
      message: '',
      isShowRefuse: false,
      refuseValue: ''
    }
  },
  created () {
  },
  computed: {
    ...mapGetters('app', ['reqAddAttendUser', 'reqUserOutCompany']),
    setReqAddAttendUser: {
      get () {
        return this.reqAddAttendUser
      },
      set (data) {
        return this.SaveReqAddAttendUser(data)
      }
    }
  },
  methods: {
    ...mapActions('app', ['SaveReqAddAttendUser', 'SaveReqUserOutCompany']),
    handle (data, index) {
      this.dataForm.id = data.id
      this.dataForm.userId = data.userId
      this.userName = data.userName
      this.index = index
      this.attend = data.name
      this.isModelShow = true
    },
    beforeClose (action, done) {
      this.errMsg = ''
      if (action === 'confirm') {
        this.confirm(done)
      } else if (action === 'cancel') {
        this.isShowRefuse = true
        done()
      }
    },
    // 同意
    confirm (done) {
      this.errMsg = ''
      this.dataForm.isChekc = 1
      this.dataForm.failReason = ''
      this.$http
        .post(auditAdd2Group, this.dataForm)
        .then(res => {
          this.$toast.success(res.message)
          console.log(this.setReqAddAttendUser)

          this.setReqAddAttendUser.splice(this.index, 1)
          done()
        })
        .catch(() => {
          done()
        })
    },
    // 拒绝
    adminCancel (action, done) {
      if (action === 'confirm') {
        if (this.dataForm.failReason === '') {
          this.errMsg = '不能为空'
          done(false)
        } else {
          this.errMsg = ''
          this.dataForm.isChekc = 0
          this.$http
            .post(auditAdd2Group, this.dataForm)
            .then(res => {
              console.log(res)

              this.$toast.success('拒绝成功！')
              this.setReqAddAttendUser.splice(this.index, 1)
              done()
            })
            .catch(() => {
              done()
            })
        }
      } else {
        done()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.empty {
  margin: 0 auto;
  text-align: center;
  color: #6666;
  margin-top: 3rem;
}
.left-label {
  color: rgb(100, 97, 96);
}
.left-txt {
  width: 1.5rem;
  display: inline-block;
  text-align: right;
  margin-right: 0.3rem;
}
.dialog-content {
  color: #666;
  font-size: 0.3rem;
  text-align: center;
  padding: 0.3rem 0;
}
</style>
