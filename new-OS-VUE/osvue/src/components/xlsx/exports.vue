<template>
  <div  class="exports">
  <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button @click="exportEvent">导出.xlsx</vxe-button>
          </template>
        </vxe-toolbar>
        <vxe-grid
          border
          ref="xGrid2"
          height="300"
          :span-method="rowspanMethod"
          :columns="tableColumn"
          :data="tableData2" ></vxe-grid>
  </div>
</template>
<script>
// import XLSX from 'xlsx'
// import FileSaver from 'file-saver'
import { timeFormatters, trashFormatters } from '@/utils/formatter.js'
import { formatJson } from '@/utils/xlsx.js'
import { toExportExcel } from '@/utils/Export2Excel'
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
  methods: {
    rowspanMethod ({ row, _rowIndex, column, visibleData }) {
      let fields = ['id']
      let cellValue = row[column.property]
      // console.log(cellValue)
      if (cellValue && fields.includes(column.property)) {
        let prevRow = visibleData[_rowIndex - 1]
        let nextRow = visibleData[_rowIndex + 1]
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          let countRowspan = 1
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    exportEvent () {
      const filterVal = []
      let table = []
      this.tableData2.forEach((item, index) => {
        table.push({
          type: item.type,
          delTotal: item.delTotal,
          operator: item.operator,
          remark: item.remark,
          delAt: item.delAt,
          img: 'https://avatar.csdnimg.cn/9/8/3/2_xiaoxiaojie12321.jpg'
        })
      })
      const list = table.map((item, index) => {
        if (index === 0) {
          for (var k in item) {
            filterVal.push(k)
          }
        }
        return {
          type: item.type,
          delTotal: item.delTotal,
          operator: item.operator,
          remark: item.remark,
          delAt: item.delAt,
          img: 'https://avatar.csdnimg.cn/9/8/3/2_xiaoxiaojie12321.jpg'
        }
      })
      console.log(list)
      const tHeader = ['类型', '删除条数', '操作人', '备注', '删除时间', '图片']
      const data = formatJson(filterVal, list)
      console.log(data)
      const filename = '导出模板'
      toExportExcel(tHeader, data, filename)
      // const toBuffer = (wbout) => {
      //   const buf = new ArrayBuffer(wbout.length)
      //   const view = new Uint8Array(buf)
      //   for (let index = 0; index !== wbout.length; ++index) view[index] = wbout.charCodeAt(index) & 0xFF
      //   return buf
      // }
      // // 转换数据
      // const table = this.$refs.xGrid2.$el.querySelector('.body--wrapper>.vxe-table--body')
      // const book = XLSX.utils.book_new()
      // // console.log()
      // const sheet = XLSX.utils.table_to_sheet(table)
      // XLSX.utils.book_append_sheet(book, sheet)
      // const wbout = XLSX.write(book, { bookType: 'xlsx', bookSST: false, type: 'binary' })
      // const blob = new Blob([toBuffer(wbout)], { type: 'application/octet-stream' })
      // // 保存导出
      // FileSaver.saveAs(blob, this.ename + '.xlsx')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
