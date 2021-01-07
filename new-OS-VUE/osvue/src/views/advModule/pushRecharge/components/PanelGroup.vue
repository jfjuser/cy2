<template>
  <el-row class="panel-group" :gutter="40">
    <el-col :xs="24" :sm="24" :lg="24" class="box-main">
      <div class="box-text">合计</div>
      <div class="box-body">
        <div class="box-count">
          <div class="box-info clear">
          <div class="box-count-l">总付费金额</div>
          <div class="box-count-r">￥<count-to class="card-panel-num"  :decimals="data.price > 10000 ? 2 : 0" :suffix="data.price > 10000 ? (data.price > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="data.price > 10000 ? (data.price > 100000000 ? data.price / 100000000 : data.price / 10000) : data.price" :duration="3600"></count-to></div>
          </div>
        </div>
        <div class="box-body1">
          <div class="group-title line">条数</div>
          <div class="box-info line clear">
            <div class="left">总计</div>
            <div class="right"><count-to class="card-panel-num" :decimals="data.maxNum > 10000 ? 2 : 0" :suffix="data.maxNum > 10000 ? (data.maxNum > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="data.maxNum > 10000 ? (data.maxNum > 100000000 ? data.maxNum / 100000000 : data.maxNum / 10000) : data.maxNum" :duration="3600"></count-to></div>
          </div>
          <div class="box-info clear">
            <div class="left">剩余</div>
            <div class="right"><count-to class="card-panel-num" :decimals="data.restNum > 10000 ? 2 : 0" :suffix="data.restNum > 10000 ? (data.restNum > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="data.restNum > 10000 ? (data.restNum > 100000000 ? data.restNum / 100000000 : data.restNum / 10000) : data.restNum" :duration="3600"></count-to></div>
          </div>
        </div>
        <div class="box-body2">
          <div class="group-title line">天数</div>
          <div class="box-info line clear">
            <div class="left">总计</div>
            <div class="right"><count-to class="card-panel-num" :decimals="data.maxDays > 10000 ? 2 : 0" :suffix="data.maxDays > 10000 ? (data.maxDays > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="data.maxDays > 10000 ? (data.maxDays > 100000000 ? data.maxDays / 100000000 : data.maxDays / 10000) : data.maxDays" :duration="3600"></count-to></div>
          </div>
          <div class="box-info clear">
            <div class="left">剩余</div>
            <div class="right"><count-to class="card-panel-num" :decimals="data.restDays > 10000 ? 2 : 0" :suffix="data.restDays > 10000 ? (data.restDays > 100000000 ? '亿' : '万') : ' '" :startVal="0" :endVal="data.restDays > 10000 ? (data.restDays > 100000000 ? data.restDays / 100000000 : data.restDays / 10000) : data.restDays" :duration="3600"></count-to></div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import CountTo from 'vue-count-to'
export default {
  name: 'PanelGroup',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  components: {
    CountTo
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
  padding : 20px;
  .box-main{
    padding: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 8px;
    font-weight: bold;
    font-size: 20px;
  }
  .box-body {
    padding: 25px;
  }
  .box-body1 {
    float: left;
    width: 30%;
    margin: 0 5%;
    padding: 2%;
    border: 1px solid #0DAFFF;
    border-radius: 8px;
    margin-bottom: 20px;
    .group-title {
      font-weight: bold;
      color: #0DAFFF;
      font-size: 22px;
    }
  }
  .box-body2 {
    float: left;
    width: 30%;
    margin: 0 5%;
    padding: 2%;
    border: 1px solid #27AE60;
    border-radius: 8px;
    margin-bottom: 20px;
    .group-title {
      font-weight: bold;
      color: #27AE60;
      font-size: 22px;
    }
  }
  .box-info {
    height: 45px;
    line-height: 45px;
  }
  .box-count {
    float: left;
    width: 20%;
    padding-top: 10px;
    .box-count-l {
      width: 100%;
      text-align: right;
    }
    .box-count-r {
      width: 100%;
      text-align: right;
    }
  }
  .box-text {
    position: absolute;
    left: 2%;
    top: 18%;
    width: 26px;
    font-size: 26px;
    letter-spacing: 80px;
    line-height: 80px;
    color: rgb(233, 166, 43);
    border-right: 1px dashed rgb(233, 166, 43);
    padding-right: 3%;
  }
}
.line {
  border-bottom: 1px dashed #ddd;
  padding-bottom: 15px !important;
}
.clear {
  display: block;
  float: none;
  clear: both;
}
.left {
  float: left;
  width: 50%;
  text-align: left;
}
.right {
  float: right;
  width: 50%;
  text-align: right;
}
</style>
