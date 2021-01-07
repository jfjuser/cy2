<template>
  <div class="advanced">
  <el-dialog :visible.sync="dialogVisible" width="25%" title="高级查询">
      <el-row v-for="(item, index) in query" :key="index" type="flex" align="center" justify="center" style="margin-bottom:20px">
        <el-col :span="4" style="line-height:40px;text-align:right;margin-right:20px">{{item.title}}:</el-col>
        <el-col :span="18">
        <el-input v-model="item.keyword" :label="item.title" :placeholder="'请输入'+item.title"></el-input>
        </el-col>
     </el-row>
     <el-row type="flex" align="center" justify="end">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="search">查询</el-button>
     </el-row>
  </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    // query: {
    //   type: Array,
    //   default: null
    // }
  },
  data () {
    return {
      dialogVisible: true,
      query: [
        {
          title: '账号',
          key: 'del',
          keyword: ''
        },
        {
          title: '账号',
          key: 'del',
          keyword: ''
        },
        {
          title: '账号',
          key: 'del',
          keyword: ''
        }
      ]
    }
  },
  created () {},
  methods: {
    search () {
      console.log(this.query)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
