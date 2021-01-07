<template>
  <div class="wgcard-content">
    <div class="add-wgcard-content">
      <h2 v-html="title"></h2>
      <div class="input-box"><input type="text" v-model="account" placeholder="请输入用户账号" /></div>
      <div class="input-box"><input type="number" v-model.number="wgcard" placeholder="请输出wg卡号！" /></div>
     <van-button class="commit-button" @click="commitCard" plain type="info" size="small" round block hairline>确定添加</van-button>
    </div>
  </div>
</template>
<script>
// import { ApiWgcard } from '@/api/url'
export default {
  name: 'Wgcard',
  data () {
    return {
      title: '',
      wgcard: '',
      account: ''
    }
  },
  created () {
    this.title = this.$route.meta.title
  },
  methods: {
    commitCard () {
      this.$http.get('https://mock.yonyoucloud.com/mock/7034/Api/wgcard', {account: this.account, wgcard: this.wgcard}).then(res => {
        console.log(res)
        // 成功通知
        this.$Notify({ type: 'success', duration: '2000', message: '设置成功！' })
      }).catch(_ => {
        this.$Notify({ type: 'error', duration: '2000', message: '请重新提交！' })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wgcard-content {
  width: 100%;
  height: 100%;
  position: relative;
  .add-wgcard-content {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    width: 100% - 10%;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h2{ color: #666;}
    .input-box{
        margin-top: .5rem;
       box-shadow: 0 0 5px 2px #eee;
       border-radius: 5px;
        width: 80%;
        height: 1rem;
        box-sizing: border-box;
        padding: .1rem 20px;
        input{
            height: 100%;
            width: 100%;
            display: block;
        }
    }
    .commit-button{
        width: 50%;
        margin-top: 1rem;
    }
  }

}
</style>
