<template>
    <div>
        <header class="header" :style="bgimg" v-once></header>
        <section>
            <van-cell-group>
                <van-cell title="个人信息" is-link to="/userInfo/" />
                <van-cell title="修改密码" is-link to="/modifyPassword/" />
                <!-- <van-cell title="信息中心" is-link to="/messageCenter/" /> -->
                <van-cell title="我的建议" to="/feedback/" is-link />
            </van-cell-group>
        </section>
        <div class="btnbox" v-once>
            <van-button type="danger" block round class="btn" @click="logout">退出登录</van-button>
        </div>
    </div>
</template>

<script>
import { Cell, CellGroup, Button, Dialog } from 'vant'
export default {
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button
  },
  data () {
    return {
      bgimg: {
        background: 'url(' + require('@/assets/img/me-bg.png') + ') no-repeat top',
        backgroundSize: '100% 100%'
      }
    }
  },
  methods: {
    logout () {
      Dialog.confirm({
        title: '提示',
        message: '确定退出当前登录状态？'
      }).then(() => {
        // 前端退出
        this.$store.dispatch('WebLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
    height: 150px;
}
.btnbox {
    padding: 20px 15px 0;
}
</style>
