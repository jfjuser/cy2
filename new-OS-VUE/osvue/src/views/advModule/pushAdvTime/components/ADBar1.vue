<template>
  <div>
    <div ref='Bar' class='bar' style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import { timeHourMinFormatter, HHssNumToTimeFormatter } from '@/utils/formatter.js'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
let Bar

export default {
  name: 'ADBar',
  props: {
    data: Array
  },
  data () {
    return {
      option: {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            var sta = params[1]
            var end = params[0]
            let content = `${sta.name}<br/>${sta.seriesName} : ${sta.value.split(' ')[1]}<br/>${end.seriesName} : ${end.value.split(' ')[1]}`
            return content
          }
        },
        grid: {
          containLabel: true,
          left: '4%',
          right: '4%'
        },
        xAxis: [
          {
            type: 'time',
            name: '时间段',
            min: '2019-09-09 00:00',
            max: '2019-09-09 23:59',
            axisLabel: {
              formatter: function (value, index) {
                return timeHourMinFormatter(value)
              }
            },
            splitLine: {show: false},
            position: 'top'
          }
        ],
        yAxis: [
          {
            type: 'category',
            name: '广告名称',
            data: [],
            axisTick: {alignWithLabel: true},
            offset: 2,
            inverse: true
          }
        ],
        series: [
        //   {
        //     name: '结束时间',
        //     type: 'bar',
        //     stack: '时间',
        //     barCategoryGap: '50%',
        //     itemStyle: {
        //       normal: {
        //         barBorderColor: 'rgba(255,255,255)'
        //       }
        //     },
        //     data: ['2019-09-09 23:06', '2019-09-09 17:06']
        //   },
        //   {
        //     name: '开始时间',
        //     type: 'bar',
        //     stack: '时间',
        //     barCategoryGap: '50%',
        //     itemStyle: {
        //       normal: {
        //         barBorderColor: 'rgba(255,255,255)',
        //         color: 'rgba(255,255,255)'
        //       },
        //       emphasis: {
        //         barBorderColor: 'rgba(255,255,255)',
        //         color: 'rgba(255,255,255)'
        //       }
        //     },
        //     // data: ['2019-09-09 00:00','2019-09-09 12:06']
        //     data: [
        //       '2019-09-09 00:00',
        //       {
        //         value: '2019-09-09 12:06',
        //         name: '备注:测试中.....测试中.....'
        //       }
        //     ]
        //   }
        ]
      }
    }
  },
  watch: {
    data (curVal, oldVal) {
      if (curVal) {
        let {yAxisData, seriesStartData, seriesEndtData} = this.initData(curVal)
        // console.log(yAxisData, 'yAxisData')
        // console.log(seriesStartData, 'seriesStartData')
        // console.log(seriesEndtData, 'seriesEndtData')
        this.updataEcharts(yAxisData, seriesStartData, seriesEndtData)
      }
    }
  },
  mounted () {
    Bar = echarts.init(this.$refs.Bar)
    Bar.setOption(this.option)
    this.initEcharts()
  },
  methods: {
    autoHeight () {
      let autoHeight = this.data.length * 100
      if (this.data.length < 4) autoHeight = 300
      Bar.getDom().style.height = autoHeight + 'px'
      Bar.getDom().childNodes[0].style.height = autoHeight + 'px'
      Bar.getDom().childNodes[0].childNodes[0].setAttribute('height', autoHeight)
      Bar.getDom().childNodes[0].childNodes[0].style.height = autoHeight + 'px'
      Bar.resize()
    },
    initData (data) {
      let yAxisData = []
      let seriesStartData = []
      let seriesEndtData = []
      for (const v of data) {
        yAxisData.push(v.advTitle)
        seriesStartData.push({
          value: `2019-09-09 ${HHssNumToTimeFormatter(v.pushBegin)}`,
          name: `备注:${v.resume}`
        })
        let endData = `2019-09-09 ${HHssNumToTimeFormatter(v.pushEnd)}`
        seriesEndtData.push(endData)
      }
      return {
        yAxisData,
        seriesStartData,
        seriesEndtData
      }
    },
    initEcharts () {
      // this.data = [
      //   ...this.data,
      //   {advTitle: '假数据', pushBegin: 100, pushEnd: 1000, resume: ''},
      //   {advTitle: '假数据', pushBegin: 200, pushEnd: 500, resume: ''},
      //   {advTitle: '假数据', pushBegin: 1000, pushEnd: 1400, resume: ''},
      //   {advTitle: '假数据假数据假', pushBegin: 1000, pushEnd: 1400, resume: ''},
      //   {advTitle: '假数据', pushBegin: 1000, pushEnd: 1400, resume: ''},
      //   {advTitle: '假数据', pushBegin: 100, pushEnd: 1400, resume: ''},
      //   {advTitle: '假数据', pushBegin: 1000, pushEnd: 1400, resume: ''},
      //   {advTitle: '假数据', pushBegin: 300, pushEnd: 1200, resume: ''},
      //   {advTitle: '假数据10', pushBegin: 1000, pushEnd: 1400, resume: ''}
      // ]
      let data = this.data
      if (data) {
        let {yAxisData, seriesStartData, seriesEndtData} = this.initData(data)
        this.updataEcharts(yAxisData, seriesStartData, seriesEndtData)
      }
    },
    updataEcharts (yAxisData, seriesStartData, seriesEndtData) {
      const option = {
        yAxis: [
          {
            type: 'category',
            name: '广告名称',
            data: yAxisData,
            axisTick: {alignWithLabel: true},
            offset: 2,
            inverse: true
          }
        ],
        series: [
          {
            name: '结束时间',
            type: 'bar',
            stack: '时间',
            barMaxWidth: '20%',
            itemStyle: {
              normal: {
                barBorderColor: 'rgba(255,255,255)'
              }
            },
            data: seriesEndtData
          },
          {
            name: '开始时间',
            type: 'bar',
            stack: '时间',
            barMaxWidth: '20%',
            itemStyle: {
              normal: {
                barBorderColor: 'rgba(255,255,255)',
                color: 'rgba(255,255,255)'
              },
              emphasis: {
                barBorderColor: 'rgba(255,255,255)',
                color: 'rgba(255,255,255)'
              }
            },
            data: seriesStartData
          }
        ]
      }
      this.autoHeight()
      this.$nextTick(() => {
        Bar.setOption(option)
      })
    }
  }
}
</script>
