<template>
  <div class="app-container">
    <div class="table-main">
      <el-form label-width="80px">
        <!-- ref="form" :model="form" -->
        <el-form-item label="生成卡号" prop="mac">
          <el-input class="filter-item" style="width:200px" disabled v-model="form.mac"></el-input>
          <el-button type="primary" @click="getMac" :disabled="isCen">生成</el-button>
        </el-form-item>
      </el-form>
      <div v-for="(item, index) in cardData" :key=index style="line-height:60px">
        <span style="margin-left:80px">{{item}}</span><span style="padding-left:20px;color:red" ref="sty"></span>
        <el-button v-show="form.mac !== undefined" style="margin-left:50px" :disabled="heheCat" ref="ssd" type="primary" @click="checkMac(item, index)">校验</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { httpPost, httpGet } from '@/utils/restful'
import { getMac, validtorMac } from '@/api/url'
export default {
  data () {
    return {
      form: {
        mac: undefined
      },
      cardData: [],
      led: '',
      isCen: false,
      heheCat: false
    }
  },
  methods: {
    getMac () {
      httpPost(getMac)
        .then((res) => {
          this.form.mac = res.data
          this.cardData = [res.data].concat(this.cardData)
          console.log(this.cardData)
          this.isCen = true
          if (this.cardData.length === 10) {
            this.isCen = true
          }
        })
    },
    checkMac (item, index) {
      httpGet(validtorMac + '/' + item)
        .then((res) => {
          this.$message({
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
.app-container{
  -webkit-user-select: none;
}
</style>
