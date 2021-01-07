<template>
  <div>
    <div ref='lineBar' class='line-bar' style="width: 100%; height: 100%;"></div>
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
  name: 'LineBar',
  props: {
    data: Object
  },
  watch: {
    data (curVal, oldVal) {
      this.resetEchart()
      if (curVal) {
        this.title = curVal.title
        if (curVal.unit) {
          this.unit = curVal.unit
        }
        for (let i = 0; i < curVal.series.length; i++) {
          const element = curVal.series[i]
          this.legendData.push(element.name)
          this.seriesArray.push({
            type: 'line',
            name: element.name,
            data: element.data,
            smooth: true,
            symbolSize: 5,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: curVal.colors[i * 2] + '60'
                }, {
                  offset: 1,
                  color: curVal.colors[i * 2 + 1] + '00'
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0, color: curVal.colors[i * 2]
                  }, {
                    offset: 1, color: curVal.colors[i * 2 + 1]
                  }
                ]),
                lineStyle: {
                  width: 3,
                  type: 'solid',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0, color: curVal.colors[i * 2]
                    }, {
                      offset: 1, color: curVal.colors[i * 2 + 1]
                    }
                  ], false)
                }
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0, color: curVal.colors[i * 2]
                  }, {
                    offset: 1, color: curVal.colors[i * 2 + 1]
                  }
                ]),
                lineStyle: {
                  width: 2,
                  type: 'dotted',
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0, color: curVal.colors[i * 2]
                    }, {
                      offset: 1, color: curVal.colors[i * 2 + 1]
                    }
                  ])
                }
              }
            }
          })
        }
        this.xAxisData = curVal.xAxis
        this.initEcharts()
      }
    }
  },
  data () {
    return {
      legendData: [],
      seriesArray: [],
      xAxisData: [],
      title: '',
      unit: '元'
    }
  },
  methods: {
    resetEchart () {
      this.legendData = []
      this.seriesArray = []
      this.xAxisData = []
    },
    initEcharts () {
      let lineBar = echarts.init(this.$refs.lineBar, null, {renderer: 'svg'})
      let self = this
      lineBar.showLoading({
        text: '正在努力的读取数据中...'
      })
      lineBar.clear()
      lineBar.setOption({
        title: {
          text: this.title,
          textStyle: {
            color: '#118899'
          },
          left: '3%',
          top: '1%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let value = params[0].name + '<br/>'
            for (let i = 0; i < params.length; i++) {
              const element = params[i]
              value += element.seriesName + ': ' + Number(element.data).toFixed(2) + self.unit + '<br/>'
            }
            return value
          }
        },
        legend: {
          data: this.legendData,
          bottom: '3%'
        },
        toolbox: {
          show: true,
          feature: {
            // dataView: {
            //   show: true,
            //   readOnly: false
            // },
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {
              show: true
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: '{value}' + this.unit
            },
            offset: -5
          }
        ],
        series: this.seriesArray,
        animationEasing: 'quadraticIn'
      })
      lineBar.hideLoading()
    }
  }
}
</script>
