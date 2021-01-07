<template>
    <div class="container">
      <div>
        <NavBar
          title="生成卡号"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
        />
<van-row type="flex" justify="center">
  <van-col span="18" >
<Field v-model="value"  disabled placeholder="生成卡号" style="padding: 9px 15px;border: 1px solid rgb(238, 238, 238);box-sizing: border-box;border-radius:4px 0 0 4px;border-right:none" />
  </van-col>
  <Button type="info" @click="createCard" :disabled="isCen">生成</Button>
</van-row>

 <div v-for="(item, index) in cardData" :key=index style="margin-top:10px">
 <van-row type="flex" justify="center" align="center">
  <van-col span="18" >
     {{item}}
  </van-col>
  <Button type="info" v-show="value !== undefined" @click="checkMac(item, index)" >校验</Button>
</van-row>
 </div>
    </div>
    </div>
</template>
<script>
import { NavBar, Button, Field, Row, Col, Toast } from 'vant'
import { generateCard, generateCard1 } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  name: 'generateCard',
  data () {
    return {
      value: '',
      isCen: false,
      cardData: []
    }
  },
  components: {
    NavBar,
    Button,
    Field,
    'van-row': Row,
    'van-col': Col,
    Toast
  },
  methods: {
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    createCard () {
      httpPost(generateCard).then(res => {
        this.value = res.data
        this.cardData = [res.data].concat(this.cardData)
        console.log(this.cardData)
        this.isCen = true
        if (this.cardData.length === 10) {
          this.isCen = true
        }
      }).catch((err) => {
        Toast.fail(err)
      })
    },
    checkMac (item, index) {
      httpGet(generateCard1 + '/' + item)
        .then((res) => {
          Toast({
            message: res.message,
            type: 'warning',
            duration: 4000
          })
        }).catch(() => {
          this.isCen = false
        })
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
