<template>
  <div>
    <div ref='Pie' class='Pie' style="width: 100%; height: 100%;"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'Pie',
  props: {
    data: Object
  },
  watch: {
    data (curVal, oldVal) {
      this.resetEchart()
      for (let i = 0; i < curVal.list.length; i++) {
        const element = curVal.list[i]
        this.legendData.push(element.name)
      }
      this.color = curVal.colors
      this.title = curVal.title
      this.dataList = curVal.list
      this.initEcharts()
    }
  },
  data () {
    return {
      color: [],
      title: '',
      legendData: [],
      dataList: []
    }
  },
  methods: {
    resetEchart () {
      this.color = []
      this.title = ''
      this.legendData = []
      this.dataList = []
    },
    initEcharts () {
      let Pie = echarts.init(this.$refs.Pie, null, {renderer: 'svg'})
      Pie.showLoading({
        text: '正在努力的读取数据中...'
      })
      Pie.clear()
      let option = {
        title: {
          text: this.title,
          textStyle: {
            color: '#118899'
          },
          left: '5%',
          top: '2%'
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true
            }
          }
        },
        color: this.color,
        legend: {
          bottom: '3%',
          data: this.legendData,
          itemGap: 20
        },
        series: [
          {
            name: this.title,
            selectedMode: 'single',
            type: 'pie',
            radius: ['20%', '40%'],
            minAngle: 1,
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 5,
                smooth: 0.5
              }
            },
            data: this.dataList
          }
        ],
        animationEasing: 'quadraticIn'
      }
      if (this.title === '支付统计' || this.title === '优惠折扣分析') {
        const formatter = function (params) {
          let value = params.value
          // if (value > 10000 && value < 100000000) {
          //   value = (value / 10000).toFixed(2) + '万'
          // } else if (value > 100000000) {
          //   value = (value / 100000000).toFixed(2) + '亿'
          // }
          return (`${params.name}: ${value}元\r\n\r\n占比: ${params.percent}%`)
        }
        option.series[0].label.normal.formatter = formatter
      } else {
        option.series[0].label.normal.formatter = '{b}: {c}\n占比: {d}%'
      }
      Pie.setOption(option)
      Pie.hideLoading()
    }
  }
}
</script>
