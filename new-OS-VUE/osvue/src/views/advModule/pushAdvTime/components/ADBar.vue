<template>
  <div>
    <div ref='Bar' class='bar' style="width: 100%; height: 100%;margin-top:50px"></div>
  </div>
</template>

<script>
import { timeHourMinFormatter, HHssNumToTimeFormatter } from '@/utils/formatter.js'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/custom')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
// let Bar

export default {
  name: 'ADBar',
  props: {
    data: Array
  },
  data () {
    return {
    }
  },
  watch: {
    data (curVal, oldVal) {
      if (curVal) {
        this.setOptions(curVal)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setOptions(this.data)
    })
  },
  methods: {
    setOptions (data) {
      var myChart = echarts.init(this.$refs.Bar)
      // console.log(data)
      let arr = []
      let arr1 = []
      data.forEach((item, index) => {
        arr.unshift(item.advTitle)
        arr1.unshift({
          itemStyle: {normal: {color: '#3398DB'}},
          name: item.resume,
          value: [data.length - 1 - index, `2019-09-09 ${HHssNumToTimeFormatter(item.pushBegin)}`, `2019-09-09 ${HHssNumToTimeFormatter(item.pushEnd)}`]
        })
      })
      const colors = ['#3398DB']
      myChart.setOption({
        color: colors,
        tooltip: {
          formatter: function (params) {
            // console.log(params)
            return '备注:' + params.data.name + '<br>开始时间:' + params.value[1].split('2019-09-09')[1] + '<br>结束时间:' + params.value[2].split('2019-09-09')[1]
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          top: '1%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          // data: arr1,
          type: 'time',
          name: '时间段',
          min: '2019-09-09 00:00',
          max: '2019-09-09 23:59',
          axisLabel: {
            formatter: function (value, index) {
              return timeHourMinFormatter(value)
            }
          },
          position: 'top',
          splitLine: {show: false}
        },
        yAxis: {
          data: arr,
          axisTick: {
            show: false
          },
          textStyle: {
            color: '#f0f0f0'
          }
        },
        series: [
          {
            type: 'custom',
            renderItem: function (params, api) {
              var categoryIndex = api.value(0)
              var start = api.coord([api.value(1), categoryIndex])
              var end = api.coord([api.value(2), categoryIndex])
              var height = 15
              return {
                type: 'rect',
                shape: echarts.graphic.clipRectByRect({
                  x: start[0],
                  y: start[1] - height / 2,
                  width: end[0] - start[0],
                  height: height
                }, {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                }),
                style: api.style()
              }
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: arr1
          }
        ]
      })
      this.autoHeight(myChart)
    },
    autoHeight (Bar) {
      let autoHeight = this.data.length * 50
      if (this.data.length < 4) autoHeight = 200
      Bar.getDom().style.height = autoHeight + 'px'
      Bar.getDom().childNodes[0].style.height = autoHeight + 'px'
      Bar.getDom().childNodes[0].childNodes[0].setAttribute('height', autoHeight)
      Bar.getDom().childNodes[0].childNodes[0].style.height = autoHeight + 'px'
      Bar.resize()
    }
  }
}
</script>
