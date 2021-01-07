<template>
  <div class="wgcard-content">
    <div class="add-wgcard-content">
      <h2 v-html="title"></h2>
      <div class="input-box">
        <input
          type="number"
          v-model.number="wiegandCard"
          placeholder="请输入wg卡号..."
        />
      </div>
      <van-button
        class="commit-button"
        @click="commitCard"
        plain
        type="info"
        size="small"
        round
        block
        hairline
        >确定添加</van-button
      >
    </div>
  </div>
</template>
<script>
import { apiWiegandCard } from '@/api/url'
import { httpGet } from '@/utils/restful'

export default {
  name: 'Wgcard',
  data () {
    return {
      title: '',
      wiegandCard: ''
    }
  },
  created () {
    this.title = this.$route.meta.title
    console.log(this.title)
  },
  methods: {
    commitCard () {
      httpGet(apiWiegandCard, { wiegandCard: this.wiegandCard.trim() })
        .then(res => {
          console.log(res)
          // 成功通知
          this.$Notify({
            type: 'success',
            duration: '2000',
            message: '设置成功！'
          })
        })
        .catch(_ => {
          this.$Notify({
            type: 'error',
            duration: '2000',
            message: '请重新提交！'
          })
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
    h2 {
      color: #666;
    }
    .input-box {
      margin: 0.5rem 0;
      box-shadow: 0 0 5px 2px #eee;
      border-radius: 5px;
      width: 80%;
      height: 2rem;

      box-sizing: border-box;
      padding: 0.1rem 20px;
      input {
        height: 100%;
        width: 100%;
        display: block;
        border: 0;
        outline: 0;
      }
    }
    .commit-button {
      width: 50%;
      margin-top: 2rem;
    }
  }
}
</style>
