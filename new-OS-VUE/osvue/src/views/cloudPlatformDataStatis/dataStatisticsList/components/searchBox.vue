<template>
  <div class="search">
     <div style="margin-top: 15px;">
  <el-input placeholder="请输入内容" v-model="inputValue" class="input-with-select">
    <el-select v-model="checkSelector" slot="prepend" placeholder="请选择">
      <el-option label="餐厅名" value="1"></el-option>
      <el-option label="订单号" value="2"></el-option>
      <el-option label="用户电话" value="3"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
</div>
  </div>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      inputValue: '',
      checkSelector: '1'
    }
  }

}
</script>
<style lang='scss' scoped>
</style>
