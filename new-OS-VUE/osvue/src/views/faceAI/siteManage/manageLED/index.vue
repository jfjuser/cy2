<template>
  <div class="app-container">
    <div class="table-main">
      <p class="box-title">
        当前LED屏
      </p>
      <el-select v-model="ledSetting.ledAppId" placeholder="请选择" @change="handleChangeLed">
        <el-option v-for="item in ledList" :key="item.id" :label="item.localName" :value="item.id"></el-option>
      </el-select>
      <p class="box-title">
        LED显示预览<span>(显示提示: 最终效果以LED显示为准)</span>
      </p>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane :label="this.x + '*' + this.y" name="first">
          <div class="box-led">
            <LEDScreen :data="ledSetting.data" :x="x" :y="y"></LEDScreen>
          </div>
        </el-tab-pane>
      </el-tabs>
      <p class="box-title">
        LED显示设置
      </p>
      <div class="box-setting">
        <el-button type="primary" @click="handleAdd()" class="box-button-add">添加节目</el-button>
          <div v-for="(item, index) in ledSetting.data" :key="index" class="box-checkbox">
          <el-checkbox v-model="item.select" :label="item.ledAppId" :checked="true">{{item.ledViewName}}</el-checkbox>
          <span>坐标X<el-input-number size="small" v-model="item.ledXSize" controls-position="right" :min="0" :max="x"></el-input-number></span>
          <span>坐标Y<el-input-number size="small" v-model="item.ledYSize" controls-position="right" :min="0" :max="y"></el-input-number></span>
          <span>宽度<el-input-number size="small" v-model="item.ledWidth" controls-position="right" :min="0"></el-input-number></span>
          <span>高度<el-input-number size="small" v-model="item.ledHeight" controls-position="right" :min="0"></el-input-number></span>
          <div class="box-twoLine">
            <span>字号:<el-input-number size="small" v-model="item.fontSize" controls-position="right" :min="1" :max="64"></el-input-number></span>
            <span class="line"></span>
            <!-- <el-radio v-model="item.ledShowType" label="0" @change="handleChangeShowType(index, 0)">固定节目</el-radio>
            <el-radio v-model="item.ledShowType" label="1" @change="handleChangeShowType(index, 1)">动态节目</el-radio> -->
            <span>速度:<el-input-number size="small" v-model="item.showSpeed" controls-position="right" :min="1" :max="64"></el-input-number></span>
            <span class="line"></span>
            <span>特效:</span>
            <el-radio v-model="item.moveType" label="1">静止显示</el-radio>
            <el-radio v-model="item.moveType" label="4">向左</el-radio>
            <el-radio v-model="item.moveType" label="38">向右</el-radio>
            <el-radio v-model="item.moveType" label="40">向下</el-radio>
            <el-radio v-model="item.moveType" label="6">向上</el-radio>
            <span v-show="item.ledShowType === '1'">
              <span>运行模式:</span>
              <el-select  class="filter-item" v-model="item.runMode" size="small" placeholder="请选择">
                <el-option v-for="type in ledRunModeType" :key="type.valueNo" :label="type.valueName" :value="type.valueNo"></el-option>
              </el-select>
            </span>
          </div>
          <div class="box-threeLine">
            <div class="box-title">{{item.ledShowType === '1' ? '动态' : '固定'}}参数设置</div>
            <div class="box-dtparams">
              <div v-for="(info, index2) in showContentList" :key="index2">
                <div v-show="item.ledShowType === '1'" :class="item.showContent && item.showContent.indexOf(info.value) > -1 ? 'box-check box-check-yes' : 'box-check box-check-no'" @click="handleChickParams(index, index2)">
                  {{info.name}}
                </div>
                <el-input v-if="info.value === 0 && item.showContent.indexOf(info.value) > -1" class="box-input" v-model="item.showText" maxlength="128" placeholder="请输入项目名"></el-input>
              </div>
              <!-- <div v-for="(info, index2) in (item.showContent ? item.showContent.spilt(',') : [])" :key="index2" class="box-check-true">{{info}}</div> -->
              <!-- <el-input class="box-input" v-model="item.showText" maxlength="128" placeholder="固定文本输入" v-show="item.ledShowType === '0'"></el-input> -->
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="box-dtparams">
        <div class="box-title">动态参数设置<span>（光标移到要插入参数的位置，再点参数插入）</span></div>
        <div v-for="(item, index) in showContentList" :key="index" :class="item.select ? 'box-check box-check-yes' : 'box-check box-check-no'" @click="handleChickParams(index)">{{item.name}}</div>
      </div> -->
      <div class="box-button"><el-button type="primary" @click="setLedSetting()">保存</el-button></div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box-title {
  font-size: 22px;
  font-weight: bold;
  span {
    font-size: 14px;
    font-weight: normal;
    margin-left: 10px;
  }
}
.box-led {
  border: 1px solid #c5c5c5;
  background-color: rgb(238, 238, 238);
  width: 100%;
  min-height: 300px;
}
.LEDScreen {
  height: 100%;
}
.box-setting {
  border: 1px solid #c5c5c5;
  padding: 30px;
  position: relative;
  .box-button-add {
    position: absolute;
    top: 50px;
    right: 5%;
  }
}
.box-checkbox {
  padding: 10px 30px;
  border-bottom: 1px solid rgb(238, 238, 238);
  span {
    font-size: 14px;
    margin-left: 20px;
  }
  .el-radio {
    margin: 0 5px !important;
  }
  .el-input-number {
    margin-left: 8px !important;
    width: 100px !important;
  }
  .box-twoLine {
    margin: 16px 0 0 70px;
  }
  .line {
    margin: 0 8px 0 16px;
    border-left: 1px solid rgb(238, 238, 238);
  }
  .box-threeLine {
    margin: 12px 0 10px 90px;
    .box-title {
      font-size: 14px;
    }
    .box-dtparams {
      display: flex;
      align-items: center;
      height: 70px;
      .box-title {
        font-size: 14px;
      }
      .box-input {
        float: left;
        width: 200px;
        margin-right: 10px;
      }
      .box-check {
        float: left;
        padding: 8px 25px;
        background-color: white;
        border-radius: 3px;
        margin: 0 10px 0 0;
        font-size: 14px;
        cursor: pointer;
      }
      .box-check-yes {
        color: #409EFF;
        border: 1px solid #409EFF !important;
        background: #ffffff url(./../../../../assets/face/site/icon_select_blue.png) no-repeat right bottom;
      }
      .box-check-no {
        border: 1px solid #c5c5c5;
      }
    }
  }
}
.box-button {
  margin: 10px 45%;
}
</style>
<script>
import LEDScreen from './components/index'
import { ledRunModeType } from '@/utils/selectAble.js'
import { ledSetting, listCheck } from '@/api/url.js'
import { httpGet, httpPost } from '@/utils/restful.js'
export default {
  components: {
    LEDScreen
  },
  data () {
    return {
      activeName: 'first',
      ledRunModeType: ledRunModeType,
      ledList: [],
      ledSetting: {
        departmentId: this.$store.getters.departmentId,
        ledAppId: undefined,
        data: []
      },
      checkedLed: [],
      x: 800,
      y: 320,
      showContentList: [
        {name: '项目名称', value: 0},
        {name: '进场人数', value: 1},
        {name: '离场人数', value: 2},
        {name: '在场人数', value: 3},
        {name: '欢迎xx进出工地', value: 4},
        {name: '带班人姓名', value: 5},
        {name: '班组名称', value: 6}
      ]
    }
  },
  created () {
    // let self = this
    // self.$nextTick(() => {
    //   console.log(self.$refs.led)
    //   self.$refs.led.style.width = self.x
    //   self.$refs.led.style.height = self .y
    // })
    this.initData()
    this.getLedAppList()
  },
  methods: {
    // 如果没有数据或不足一行时填充一行
    initData () {
      this.handleAdd()
    },
    handleAdd () {
      let len = this.ledSetting.data.length
      // 重新整理顺序
      this.sortLedSetting()
      let item = {
        // select 只做判断不保存，默认是true
        select: true,
        ledViewId: len + 1,
        ledViewName: '节目' + (len + 1),
        ledXSize: 0,
        ledYSize: 0,
        ledWidth: this.x,
        ledHeight: this.y,
        fontSize: 16,
        showContent: '',
        ledShowType: '1',
        showSpeed: 30,
        moveType: '4',
        runMode: 0
      }
      this.ledSetting.data.push(item)
      this.$forceUpdate()
    },
    sortLedSetting () {
      for (let i = 0; i < this.ledSetting.data.length; i++) {
        this.ledSetting.data[i].ledViewId = i + 1
        this.ledSetting.data[i].ledViewName = '节目' + (i + 1)
      }
    },
    // 获取列表
    getLedAppList () {
      httpGet(listCheck + '/' + this.$store.getters.departmentId).then(res => {
        this.ledList = res.data
        if (!this.ledSetting.ledAppId && this.ledList) {
          // 选择为空时,默认第一个
          this.ledSetting.ledAppId = this.ledList[0].id
          this.x = this.ledList[0].ledWidth
          this.y = this.ledList[0].ledHeight
          console.log(this.x + '-----' + this.y)
          this.getLedSetting()
        }
      }).catch(() => {
      })
    },
    handleChangeLed () {
      for (let i = 0; i < this.ledList.length; i++) {
        if (this.ledSetting.ledAppId === this.ledList[i].id) {
          this.x = this.ledList[i].ledWidth
          this.y = this.ledList[i].ledHeight
          break
        }
      }
      this.getLedSetting()
    },
    handleChangeShowType (dataIndex, type) {
      if (type === 0) {
        let item = this.ledSetting.data[dataIndex]
        if (item) {
          if (item.showContent && item.showContent.indexOf('0') > -1) {
            item.showContent = '0'
          } else {
            item.showContent = ''
          }
          this.ledSetting.data[dataIndex] = item
          this.$forceUpdate()
        }
      } else {
        let item = this.ledSetting.data[dataIndex]
        item.showText = ''
        this.ledSetting.data[dataIndex] = item
        this.$forceUpdate()
      }
    },
    handleChickParams (dataIndex, enumIndex) {
      let item = this.ledSetting.data[dataIndex]
      let temp = item.showContent ? item.showContent.split(',') : []
      let isSelect = false
      for (let i = 0; i < temp.length; i++) {
        if (!temp[i] || temp[i] === '') {
          continue
        }
        if (Number(temp[i]) === this.showContentList[enumIndex].value) {
          // 选中 -> 未选状态
          isSelect = true
          item.showText = ''
          temp.splice(i, 1)
          break
        }
      }
      if (!isSelect) {
        if (!(temp.indexOf(this.showContentList[enumIndex].value) > -1)) {
          // 不包含则添加
          temp.push(this.showContentList[enumIndex].value)
        }
        if (enumIndex === 0) {
          item.showText = this.$store.getters.depName
        }
      }
      item.showContent = temp.join(',')
      this.ledSetting.data[dataIndex] = item
      this.$forceUpdate()
    },
    getLedSetting () {
      let params = {
        departmentId: this.ledSetting.departmentId,
        ledAppId: this.ledSetting.ledAppId
      }
      httpGet(ledSetting, params).then(res => {
        this.ledSetting.data = res.data
        if (this.ledSetting.data.length > 0) {
          for (let i = 0; i < this.ledSetting.data.length; i++) {
            // if (this.ledSetting.data[i].moveType === 1) {
            //   this.ledSetting.data[i].ledShowType = 0
            // }
            this.ledSetting.data[i].ledShowType = String(this.ledSetting.data[i].ledShowType)
            this.ledSetting.data[i].moveType = String(this.ledSetting.data[i].moveType)
          }
        } else {
          this.handleAdd()
        }
      }).catch(() => {
      })
    },
    setLedSetting () {
      // 过滤提交的数据
      // 重新整理顺序
      this.sortLedSetting()
      // 1： 固定模式改成  滚动 -> 静态显示
      let params = Object.assign({}, this.ledSetting)
      console.log(this.checkedLed)
      for (let i = 0; i < params.data.length; i++) {
        console.log(i + '-' + params.data[i].select)
        if (params.data[i].select === false) {
          // 没勾选, 去除
          params.data.splice(i, 1)
          i--
          continue
        }
        // 空或填固定模式
        // if (!params.data[i].ledShowType || params.data[i].ledShowType === '0') {
        //   params.data[i].ledShowType = 1
        //   params.data[i].moveType = 1
        // }
        // // 如果是有固定的文本, 还是设置为固定模式
        // if (!params.data[i].showContent && params.data[i].showText) {
        //   params.data[i].ledShowType = 0
        //   params.data[i].moveType = -1
        // } else if (params.data[i].showContent === '0') {
        //   // 只选了项目名称 或 项目名称 + 固定文本
        //   params.data[i].ledShowType = 0
        //   params.data[i].moveType = -1
        // }
        params.data[i].ledViewId = i + 1
        params.data[i].ledViewName = '节目' + (i + 1)
        params.data[i].ledShowType = Number(params.data[i].ledShowType)
        params.data[i].moveType = Number(params.data[i].moveType)
      }
      httpPost(ledSetting, this.ledSetting).then(res => {
        this.getLedSetting()
        // location.reload() // 刷新，避免BUG
        this.$message.success(res.message)
      }).catch(() => {
      })
    }
  }
}
</script>
