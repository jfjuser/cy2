<template>
  <div class="page bgc-grey full-height">
    <div class="box box-shadow">
      <van-cell-group>
        <van-cell
          title="名字"
          is-link
          :value="userName"
          @click="showName = true"
        />
        <van-cell
          title="公司名称"
          is-link
          :label="departmentName"
          @click="showTeam = true"
        />
        <van-cell
          title="切换公司"
          is-link
          :label="departmentName"
          @click="onReCompanys"
        />
      </van-cell-group>
    </div>
    <van-dialog
      v-model="showName"
      title="修改名字"
      show-cancel-button
      close-on-popstate
      :before-close="beforeCloseName"
    >
      <van-field
        v-model.trim="nameVal"
        placeholder="请输入名字"
        :error-message="nameErr"
      />
    </van-dialog>
    <van-dialog
      v-model="showTeam"
      title="修改公司名称"
      close-on-popstate
      showConfirmButton
      showCancelButton
      :before-close="beforeCloseTeam"
    >
      <van-field
        v-model.trim="teamVal"
        placeholder="请输入公司名称"
        :error-message="teamErr"
      />
    </van-dialog>

    <van-dialog
      v-model="isCompanyShow"
      title="请选择公司"
      :showConfirmButton="false"
      show-cancel-button
      close-on-popstate
      :closeOnPopstate="true"
      class="company-select-wrap"
    >
      <van-cell-group title="公司数据">
        <van-cell
          :title="item.departmentName"
          :value="item.userName"
          v-for="item in userInfoCompanyData"
          :key="item.id"
          @click="selectCompany(item)"
        />
      </van-cell-group>
    </van-dialog>
    <!-- --------------------------注销管理员-------------------------------- -->
    <van-dialog
      v-model="isLogOffShow"
      title="注销管理员"
      :showConfirmButton="true"
      show-cancel-button
      close-on-popstate
      :closeOnPopstate="true"
      :before-close="logOffUser"
    >
      <van-field
        v-model.trim="logOffPwd"
        placeholder="请输管理员密码..."
        :error-message="logOffErr"
      />
    </van-dialog>
    <div class="btn-box">
      <van-button
        block
        round
        size="small"
        @touchstart.native.prevent.stop="openLogOff"
        type="warning"
        >注销管理员</van-button
      >
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import { modifyTeamName, modifyName, ApiLogOffUser } from '@/api/url'
export default {
  data () {
    return {
      showName: false,
      isCompanyShow: false,
      isLogOffShow: false,
      logOffPwd: '',
      logOffErr: '',
      nameVal: '',
      showTeam: false,
      teamVal: '',
      nameErr: '',
      teamErr: '',
      userInfoCompanyData: []
    }
  },
  computed: {
    ...mapGetters(['userName', 'departmentName', 'userAuthInfo'])
  },
  methods: {
    ...mapActions(['WebLogOut']),
    beforeCloseName (action, done) {
      if (action === 'confirm') {
        if (this.nameVal === '') {
          this.nameErr = '不能为空'
          done(false)
          return
        }
        this.submitName(done)
      } else {
        this.nameErr = ''
        done()
      }
    },
    beforeCloseTeam (action, done) {
      if (action === 'confirm') {
        if (this.teamVal === '') {
          this.teamErr = '不能为空'
          done(false)
          return
        }
        this.submitTeam(done)
      } else {
        this.teamErr = ''
        done()
      }
    },
    submitName (done) {
      this.nameErr = ''
      const formData = {
        userName: this.nameVal,
        id: this.$store.getters.userId
      }
      this.$http
        .put(modifyName, formData)
        .then(res => {
          this.$store.dispatch('setUserName', this.nameVal)
          done()
          this.$toast.success('成功')
        })
        .catch(() => {
          done(false)
        })
    },
    submitTeam (done) {
      this.teamErr = ''
      const formData = {
        departmentName: this.teamVal,
        id: this.$store.getters.departmentId
      }
      this.$http
        .put(modifyTeamName, formData)
        .then(res => {
          this.$store.dispatch('setTeamName', this.teamVal)
          done()
          this.$toast.success('成功')
        })
        .catch(() => {
          done(false)
        })
    },
    // 请求公司数据信息
    onReCompanys () {
      this.userInfoCompanyData = this.userAuthInfo
      if (this.userInfoCompanyData && this.userInfoCompanyData.length > 0) {
        this.isCompanyShow = true
      } else {
        this.$toast.fail('获取更多公司信息失败！')
      }
    },
    // 开始切换公司
    selectCompany (company) {
      // console.log('公司数据', company)
      this.$store.dispatch('setLoginInfo', company).then(() => {
        this.isCompanyShow = false // 关闭弹窗
        this.$router.push('/home/?a=123') // 切换后跳转首页
      })
    },
    openLogOff () {
      this.$dialog.confirm({
        title: '官方提示',
        message: '是否确定注销管理员，仅用于内部人员使用。'
      }).then(() => {
        this.isLogOffShow = true
      }).catch(() => {})
    },
    // 注销管理员
    logOffUser (action, done) {
      if (action === 'confirm') {
        if (this.logOffPwd === '') {
          this.logOffErr = '管理员密码不可为空！'
          done(false)
          return
        }
        // console.log('开始注销管理员。。。', this.$store.getters.departmentId)
        if (this.$store.getters.departmentId) {
          let PWD = 'cy2020'
          this.$http
            .get(ApiLogOffUser + this.$store.getters.departmentId + '/' + PWD)
            .then(res => {
              // console.log('注销成功', res)
              this.WebLogOut().then(() => {
                this.logOffPwd = ''
                this.logOffErr = ''
                done()
                this.$notify({
                  type: 'success',
                  message: '注销成功！'
                })
                this.$router.push({
                  path: '/login'
                })
              })
            })
            .catch(err => {
              this.logOffErr = err
              done(false)
            })
        } else {
          this.$notify({
            type: 'danger',
            message: '获取公司信息失败！'
          })
        }
      } else {
        this.logOffPwd = ''
        this.logOffErr = ''
        done()
      }
    }
  },
  activated () {
    this.nameVal = ''
    this.teamVal = ''
  }
}
</script>

<style lang="scss" scoped>
.page {
  overflow: hidden;
}
.company-select-wrap >>> {
  height: 60%;
  .van-dialog__content {
    height: 70%;
    max-height: 70%;
    overflow: auto;
  }
  .van-dialog__footer {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    border-top: 1px solid #ddd;
  }
}
.box {
  border-radius: 10px;
  overflow: hidden;
  margin: 20px;
}
.btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #eee;
  box-sizing: border-box;
  padding: 0.5rem;
}
</style>
