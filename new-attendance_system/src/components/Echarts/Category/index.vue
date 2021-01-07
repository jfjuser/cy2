<template>
  <div style='padding:10px 10px 0 0'>
    <div ref='Category' class='line-bar' style='width: 100%; height: 100%; text-align: center'></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/toolbox')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  name: 'Category',
  props: {
    data: Array
  },
  watch: {
    data (curVal, oldVal) {
      this.resetEchart()
      this.departmentInfoList = curVal
      // 排序
      let len = this.departmentInfoList.length
      for (let i = 0; i < len - 1; i++) {
        for (let k = 0; k < len - 1 - i; k++) {
          let departmentInfo = this.departmentInfoList[k]
          let departmentInfo2 = this.departmentInfoList[k + 1]
          if ((departmentInfo2.cashFee + departmentInfo2.epayFee) > (departmentInfo.cashFee + departmentInfo.epayFee)) {
            let temp = departmentInfo2
            this.departmentInfoList[k + 1] = departmentInfo
            this.departmentInfoList[k] = temp
            break
          }
        }
      }
      this.initEcharts()
    }
  },
  data () {
    return {
      departmentInfoList: []
    }
  },
  methods: {
    resetEchart () {
      this.departmentInfoList = []
    },
    initEcharts () {
      let list = this.departmentInfoList
      let baifenbi = []
      let paiming = []
      let grayBar = [1]
      baifenbi.push(1.00)
      for (let i = 1; i < list.length && i < 7; i++) {
        baifenbi.push(((list[i].cashFee + list[i].epayFee) / (list[0].cashFee + list[0].epayFee)).toFixed(2))
        paiming.push((list.length > 7 ? 7 : list.length) - i + 1)
        grayBar.push(1)
      }
      paiming.push(1)
      baifenbi.reverse()
      let lineBar = echarts.init(this.$refs.Category)
      lineBar.showLoading({
        text: '正在努力的读取数据中...'
      })
      lineBar.clear()
      lineBar.setOption({
        title: {
          text: '车场排行',
          left: '5%',
          textStyle: {
            color: '#118899'
          }
        },
        grid: {
          left: '5%',
          bottom: '3%',
          top: '8%',
          right: '5%'
        },
        // 进度条颜色
        color: ['#61A8FF'],
        xAxis: [
          {
            show: false
          },
          {
            show: false
          }
        ],
        yAxis: {
          type: 'category',
          axisLabel: {
            show: false,
            axisLabel: {
              show: false
            },
            formatter: function (value) {
            }
          },
          itemStyle: {},
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: paiming
        },
        series: [
          // 背景色--------------------我是分割线君------------------------------//
          {
            show: true,
            type: 'bar',
            barGap: '-100%',
            // 统计条宽度
            barWidth: '30%',
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: 'rgba(102, 102, 102,0.5)'
              }
            },
            z: 1,
            data: grayBar
          },
          // 蓝条--------------------我是分割线君------------------------------//
          {
            show: true,
            type: 'bar',
            barGap: '-100%',
            barWidth: '30%',
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: '#3dc0e9'
                    },
                    {
                      offset: 1,
                      color: '#45e3cf'
                    }
                  ],
                  globalCoord: false
                }
              }
            },
            max: 1,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'inside',
                formatter: function (data) {
                  return (baifenbi[[data.dataIndex]] * 100).toFixed(2) + '%'
                }
              }
            },
            labelLine: {
              show: false
            },
            z: 2,
            data: baifenbi
          },
          // 数据条--------------------我是分割线君------------------------------//
          {
            show: true,
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            // 统计条宽度
            barWidth: '35%',
            itemStyle: {
              normal: {
                barBorderRadius: 20,
                color: 'rgba(22,203,115,0.05)'
              },
              shadowOffsetY: 10
            },
            label: {
              normal: {
                show: true,
                position: [0, '-100%'],
                rich: {
                  // 富文本
                  black: {
                    // 自定义颜色
                    color: '#000'
                  },
                  green: {
                    color: '#70DDA7'
                  },
                  yellow: {
                    color: '#FEC735'
                  }
                },
                formatter: function (data) {
                  return '{black|' + paiming[data.dataIndex] + '  ' + list[paiming[data.dataIndex] - 1].departmentName + '}{black|    临时车总收入:}{yellow|' + (list[paiming[data.dataIndex] - 1].cashFee + list[paiming[data.dataIndex] - 1].epayFee).toFixed(2) + '}{black|元,其中,现金支付:}' + '{green|' + list[paiming[data.dataIndex] - 1].cashFee.toFixed(2) + '}{black|元,电子支付:}' + '{green|' + list[paiming[data.dataIndex] - 1].epayFee.toFixed(2) + '}{black|元}'
                }
              }
            },
            data: paiming
          }
        ]
      })
      lineBar.hideLoading()
    }
  }
}
</script>
