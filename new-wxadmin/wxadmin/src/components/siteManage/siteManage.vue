<template>
    <div class="container12">
      <div>
        <NavBar
          title="工地管理"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
        <div style="margin-top:1rem;opacity:0.5">
          <Cell title="LED屏绑定" icon="pending-payment" is-link to="/bindLED/" />
          <Cell title="工种管理" icon="setting-o" is-link to="/workTypeManage/" />
          <Cell title="通道管理" icon="user-circle-o" is-link to="/channelManage/" />
          <Cell title="平台LED" icon="qr" is-link to="/platformLED/" />
          <Cell title="LED屏管理" icon="send-gift-o" is-link to="/manageLED/" />
          <Cell title="生成卡号" icon="send-gift-o" is-link to="/generateCard/" />
        </div>
    </div>
    </div>
</template>
<script>
import { NavBar, Button, Cell } from 'vant'
export default {
  name: 'siteManage',
  data () {
    return {}
  },
  components: {
    NavBar,
    Button,
    Cell
  },
  methods: {
    onClickLeft () {
      this.$router.push('/indexPage/')
    }
  }
}
</script>
<style lang="scss" scoped>
.container12{
  background: url(../../assets/bind-back.jpg);
  background-size: 100%;
  height: 100vh
}
</style>
