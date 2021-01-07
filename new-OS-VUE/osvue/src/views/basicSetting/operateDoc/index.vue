<template>
  <div class="app-container" >
    <div class="table-main" style="margin: 0 auto;" >
      <el-row :span="20">
        <el-col :span="6">
          <el-button type="primary" @click="downLoad">下载说明书</el-button>
          <br>
          <el-select style="margin-top: 10px;" v-model="type" placeholder="白名单类型">
            <el-option v-for="item of list" :key="item.value" :label="item.name" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="downWhite">下载白名单</el-button>
        </el-col>
        <el-col :span="12">
          <div  v-html="html"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getWord, exportDescriptions, exportWhite } from '@/api/url.js'
import { httpGet, httpExport } from '@/utils/restful.js'
var marked = require('markdown-it')({
  html: true
})
export default {
  data () {
    return {
      html: '',
      type: 5,
      list: [
        {value: 5, name: '普通白名单导入模板'},
        {value: 6, name: '高级白名单导入模板'},
        {value: 7, name: '盒子固定车导入模板'},
        {value: 8, name: '盒子免费车导入模板'}
      ]
    }
  },
  mounted () {
    this.getMarkWord()
  },
  methods: {
    // -------------- markdown编辑 ---------------- \\
    getMarkWord () {
      httpGet(getWord).then(res => {
        this.html = marked.render(res.data.content)
      }).catch(() => {})
    },
    downLoad () {
      httpExport(exportDescriptions)
        .then(() => {})
        .catch(() => {})
    },
    downWhite () {
      httpExport(exportWhite + this.type)
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
<style lang='scss' scoped>
  table {
    display: block;
    width: 100%;
    overflow: auto;
    box-sizing: border-box;
    border-collapse:collapse;
    thead {
      border-left: 1px solid #ebeef5;
      border-top: 1px solid #ebeef5;
      color: #909399;
    }
    tbody {
      border-left: 1px solid #ebeef5;
      color: #606266;
    }
    tr {
      background-color: #fff;
      // border-top: 1px solid #ebeef5;
      display: table-row;
    }
    th, td {
      padding: 6px 13px;
      border-bottom: 1px solid #ebeef5;
      border-right: 1px solid #ebeef5;
    }
  }
</style>
