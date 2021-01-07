<template>
  <div  class="exports">
   <vxe-toolbar>
          <template v-slot:buttons>
            <vxe-button @click="impotEvent">选择文件</vxe-button>
          </template>
        </vxe-toolbar>

        <vxe-grid
          border
          ref="xGrid1"
          height="300"
          :span-method="rowspanMethod"
          :columns="tableColumn"
          :data="tableData1" style="display:none" ></vxe-grid>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { timeFormatter } from '@/utils/formatter.js'
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
      tableData1: [],
      timeFormatter: timeFormatter
    }
  },
  props: {
    tableColumn: {
      type: Array,
      default: null
    }
  },
  methods: {
    rowspanMethod ({ row, _rowIndex, column, visibleData }) {
      let fields = ['id']
      let cellValue = row[column.property]
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
    impotEvent () {
      this.$refs.xGrid1.readFile({
        types: ['xls', 'xlsx']
      }).then(evnt => {
        const files = evnt.target.files
        const fileReader = new FileReader()
        fileReader.onload = (ev) => {
          const data = ev.target.result
          let imgReg = /<img.*?(?:>|\/>)/gi
          // let imgReg1 = /<tr[^>]*>[\s\S]*?<\/tr>/gi
          // let arrr = data.match(imgReg1)
          // console.log(data.match(imgReg1))
          let arr = data.match(imgReg)
          let srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
          let arr1 = []
          for (var i = 0; i < arr.length; i++) {
            var src = arr[i].match(srcReg)
            arr1.push(src[1])
          }
          // console.log(data)
          console.log(arr1)
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true })
          // const workbook1 = XLSX.read(data, { type: 'base64', cellDates: true })
          // console.log(workbook)
          Object.keys(workbook.Sheets.Sheet1).forEach(val => {
            if (JSON.stringify(workbook.Sheets.Sheet1[val]['v'] + '').indexOf('GMT+0800') >= 0) {
              workbook.Sheets.Sheet1[val]['w'] = this.timeFormatter(workbook.Sheets.Sheet1[val]['v'])
            }
          })
          const csvData = XLSX.utils.sheet_to_csv(workbook.Sheets.Sheet1)
          const tableData = []
          // 解析数据
          csvData.split('\n').forEach((vRow) => {
            if (vRow) {
              // console.log(vRow)
              const vCols = vRow.split(',')
              const item = {}
              vCols.forEach((val, cIndex) => {
                // console.log(this.tableColumn, cIndex)
                const column = this.tableColumn[cIndex]
                if (column && column.field) {
                  item[column.field] = val
                }
              })
              tableData.push(item)
            }
          })
          tableData.splice(0, 1)
          this.tableData1 = tableData
        }
        fileReader.readAsBinaryString(files[0])
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
