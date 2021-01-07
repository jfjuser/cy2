<template>
    <div>
        <van-cell-group>
            <van-cell title="申请人" :value="data.aiUserName" />
            <!-- <van-cell title="部门" value="研发" /> -->
            <van-cell title="补卡时间" :value="timeFormatter(data.applyTime)" />
            <van-cell title="补卡理由" :label="data.reason" :border="false" />
            <van-image
            width="100"
            height="100"
            class="img"
            fit="contain"
            @click="showimg=true"
            :src="imgUrl"
            v-if="data.assistPhoto"
            />
        </van-cell-group>
        <!-- 待审核才显示 -->
        <div class="bottom flex-jc-around" v-if="data.isCheck === 0">
          <van-button type="danger" round @click="show = true">拒绝</van-button>
          <van-button type="info" round @click="onConfirm">同意</van-button>
        </div>

        <van-dialog
        v-model="show"
        title="确定拒绝吗？"
        show-cancel-button
        close-on-popstate
        :before-close="beforeClose"
        >
            <van-field v-model.trim="form.failReason" placeholder="请输入拒绝理由" :error-message="err" />
        </van-dialog>
        <van-popup v-model="showimg" safe-area-inset-bottom style="background-color: transparent;">
          <van-image
            width="100vw"
            height="100vh"
            fit="contain"
            :src="imgUrl"
            class="bigimg"
            @click="showimg=false"
            />
        </van-popup>
    </div>
</template>

<script>
import { auditPunchIn } from '@/api/url'
import { timeFormatter } from '@/utils/formatter'
import { Session } from '@/utils/storage'
export default {
  data () {
    return {
      data: JSON.parse(decodeURI(this.$route.query.data)) || {},
      timeFormatter,
      show: false,
      err: '',
      form: {
        failReason: '',
        id: undefined,
        userId: this.$store.getters.userId,
        isChekc: undefined
      },
      imgUrl: Session.get('PunchInImgUrl', false) ? Session.get('PunchInImgUrl', false) : '',
      showimg: false
    }
  },
  methods: {
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.form.failReason === '') {
          this.err = '不能为空'
          done(false)
          return
        }
        this.cancel(done)
      } else {
        this.err = ''
        done()
      }
    },
    // 拒绝
    cancel (done) {
      this.err = ''
      done()
      this.form.isChekc = 2
      this.form.id = this.data.id
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(auditPunchIn, this.form).then(res => {
        ToastLoading.clear()
        this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
          // this.$router.go(-1)
          history.go(-1)
        })
      }).catch(() => { ToastLoading.clear() })
    },
    // 同意
    onConfirm () {
      this.form.isChekc = 1
      this.form.id = this.data.id
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(auditPunchIn, this.form).then(res => {
        ToastLoading.clear()
        this.$dialog({ closeOnPopstate: true, message: res.message }).then(() => {
          // this.$router.go(-1)
          history.go(-1)
        })
      }).catch(() => { ToastLoading.clear() })
    }
  }
}
</script>

<style lang="scss" scoped>
.img {
    margin-left: 15px;
}
.bigimg {
  background-color: transparent;
}
.bottom {
  padding: 20px 0;
  /deep/ .van-button {
    padding: 0 30px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
