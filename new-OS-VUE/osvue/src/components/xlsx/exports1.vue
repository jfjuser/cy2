<template>
  <div  class="exports">
  <vxe-toolbar>
          <template v-slot:buttons>
           <vxe-button @click="exportDataEvent">导出数据</vxe-button>
            <vxe-button @click="importDataEvent">导入数据</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-table
          border
          highlight-hover-row
          import-config
          export-config
          ref="xTable"
          height="400"
          :data="tableData">
          <!-- <vxe-table-column type="seq" width="60"></vxe-table-column> -->
          <vxe-table-column field="type" title="类型"></vxe-table-column>
          <vxe-table-column field="delTotal" title="删除条数"></vxe-table-column>
          <vxe-table-column field="operator" title="操作人" sortable></vxe-table-column>
          <vxe-table-column field="remark" title="备注" sortable></vxe-table-column>
          <vxe-table-column field="delAt" title="删除时间" sortable></vxe-table-column>
          <vxe-table-column field="img" title="图片" show-overflow>
           <template v-slot="{ row }">
           <!-- {{row}} -->
              <img :src="row.img">
           </template>
          </vxe-table-column>
        </vxe-table>
  </div>
</template>
<script>
import { timeFormatters, trashFormatters } from '@/utils/formatter.js'
export default {
  data () {
    return {
      // tableColumn: [
      //   { type: 'checkbox', width: 60 },
      //   { field: 'name', title: 'Name' },
      //   { field: 'role', title: 'Role' },
      //   { field: 'sex', title: 'Sex', formatter: this.formatterSex },
      //   { field: 'date3', title: 'Date' },
      //   { field: 'address', title: 'Address', showOverflow: true }
      // ],
      // tableData1: []
      timeFormatters: timeFormatters,
      trashFormatters: trashFormatters
    }
  },
  props: {
    tableColumn: {
      type: Array,
      default: null
    },
    tableData2: {
      type: Array,
      default: null
    },
    ename: {
      type: String,
      default: undefined
    }
  },
  computed: {
    tableData () {
      let obj = JSON.parse(JSON.stringify(this.tableData2))
      obj.forEach((item, index) => {
        item.img = 'https://avatar.csdnimg.cn/9/8/3/2_xiaoxiaojie12321.jpg'
      })
      return obj
    }
  },
  methods: {
    exportDataEvent () {
      this.$refs.xTable.openExport({ types: ['csv'] })
    },
    importDataEvent () {
      this.tableData = []
      this.$refs.xTable.importData({ types: ['csv'] })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
