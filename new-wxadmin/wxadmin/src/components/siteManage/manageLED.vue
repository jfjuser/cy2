<template>
  <div class="warp-container">
     <NavBar
        title="LED屏管理"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
      <div>
      <label style="line-height:2rem;font-size:1rem;margin-left:0.8rem">当前LED屏</label>
      <RadioGroup v-model="ledSetting.ledAppId" @change="checkSelect" style="line-height:1.8rem;font-size:0.9rem;margin:0rem 0 0.5rem 10%">
          <Radio v-for="item in ledList" style="display:inline-block;line-height:2rem;margin-left:2rem" :key="item.id" :name="item.id">{{item.localName}}</Radio>
      </RadioGroup>
      <Radio v-if="ledList && ledList.length === 0" disabled style="margin-left:1rem">暂无LED屏可选择</Radio>
      </div>
      <div>
        <Button type="info" style="margin:1rem 0 1rem 0.5rem;border-radius:7px" @click="handleAdd">添加节目</Button>
        <div v-for="(item, index) in ledSetting.data" :key="index" style="margin-bottom:2.5rem">
          <Checkbox v-model="item.select" style="margin:0 0 1rem 0.5rem;" :label="item.ledAppId" :checked="true"><span style="color:red">{{item.ledViewName}}</span></Checkbox>
          <label class="labelStyle">坐标X</label>
          <Stepper class="stepful" v-model="item.ledXSize" integer input-width="60px" :min="0" :max="x"/>
          <label class="labelStyle">坐标Y</label>
          <Stepper class="stepful" v-model="item.ledYSize" integer input-width="60px" :min="0" :max="y"/>
          <label class="labelStyle">宽度</label>
          <Stepper class="stepful" v-model="item.ledWidth" integer input-width="60px" :min="0"/>
          <label class="labelStyle">高度</label>
          <Stepper class="stepful" v-model="item.ledHeight" integer input-width="60px" :min="0"/>
          <label class="labelStyle">字号</label>
          <Stepper class="stepful" v-model="item.fontSize" integer input-width="60px" :min="1" :max="64"/>
          <label class="labelStyle">速度</label>
          <Stepper class="stepful" v-model="item.showSpeed" integer input-width="60px" :min="1" :max="64"/>
          <div>
            <div class="box-title">{{item.ledShowType === '1' ? '动态' : '固定'}}参数设置</div>
            <div v-for="(info, index2) in showContentList" :key="index2">
              <div v-show="item.ledShowType === '1'" :class="item.showContent && item.showContent.indexOf(info.value) > -1 ? 'box-check box-check-yes' : 'box-check box-check-no'" @click="handleChickParams(index, index2)">
                {{info.name}}
              </div>
              <Field style="margin-left:1rem;opacity:0.6" v-if="info.value === 0 && item.showContent.indexOf(info.value) > -1" class="box-input" v-model="item.showText" maxlength="128" placeholder="请输入项目名"/>
            </div>
          </div>
        </div>
        <Button type="info" style="width:60vw;margin:0.5rem 0 2rem 20vw;border-radius:10px" @click="setLedSetting">保存</Button>
      </div>
  </div>
</template>
<script>
import { NavBar, RadioGroup, Radio, Button, Checkbox, Field, Stepper, Toast } from 'vant'
import { httpGet, httpPost } from '@/utils/restful'
import { listCheck, ledSetting } from '@/api/url'
export default {
  name: 'manageLED',
  components: {
    NavBar,
    RadioGroup,
    Radio,
    Checkbox,
    Field,
    Button,
    Stepper
  },
  data () {
    return {
      ledSetting: {
        departmentId: this.$store.getters.departmentId,
        ledAppId: undefined,
        data: []
      },
      ledList: [],
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
    this.initData()
    this.getLedAppList()
  },
  methods: {
    initData () {
      this.handleAdd()
    },
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    checkSelect (value) {
      this.ledSetting.ledAppId = value
    },
    // 获取LED屏幕列表
    getLedAppList () {
      httpGet(listCheck + '/' + this.$store.getters.departmentId).then(res => {
        this.ledList = res.data
        if (!this.ledSetting.ledAppId && this.ledList) {
          // 选择为空时,默认第一个
          this.ledSetting.ledAppId = this.ledList[0].id
          this.x = this.ledList[0].ledWidth
          this.y = this.ledList[0].ledHeight
          this.getLedSetting()
        }
      }).catch(() => {
      })
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
            this.ledSetting.data[i].ledShowType = String(this.ledSetting.data[i].ledShowType)
            this.ledSetting.data[i].moveType = String(this.ledSetting.data[i].moveType)
          }
        }
      }).catch(() => {
      })
    },
    // 添加节目
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
        ledWidth: 100,
        ledHeight: 100,
        fontSize: 16,
        showContent: '',
        ledShowType: '1',
        showSpeed: 30,
        moveType: '3',
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
    // 动态参数选择
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
    // 保存提交参数
    setLedSetting () {
      this.sortLedSetting()
      let params = Object.assign({}, this.ledSetting)
      for (let i = 0; i < params.data.length; i++) {
        console.log(i + '-' + params.data[i].select)
        if (params.data[i].select === false) {
          // 没勾选, 去除
          params.data.splice(i, 1)
          i--
          continue
        }
        params.data[i].ledViewId = i + 1
        params.data[i].ledViewName = '节目' + (i + 1)
        params.data[i].ledShowType = Number(params.data[i].ledShowType)
        params.data[i].moveType = Number(params.data[i].moveType)
      }
      httpPost(ledSetting, this.ledSetting).then(res => {
        this.getLedSetting()
        // location.reload() // 刷新，避免BUG
        Toast.success(res.message)
      }).catch(() => {
        Toast.fail('提交失败！请选择相机')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.warp-container{
  background-color: rgb(134,163,195);
}
.labelStyle{
  line-height:2rem;
  margin-left:0.8rem;
  font-size:0.8rem;
}
.stepful{
  margin:0 0 1rem 3rem;
  opacity: 0.6;
}
 .box-title {
  font-size: 16px;
  font-weight: bold;
  margin-left:0.5rem
}
.box-input {
  width: 200px;
  border-radius: 4px;
  line-height: 1rem;
  margin-right: 10px;
}
 .box-check {
  padding: 8px 25px;
  background-color: white;
  border-radius: 3px;
  margin: 0.5rem 1rem 0.5rem 1rem;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
}
.box-check-yes {
  color: #409EFF;
  border: 1px solid #409EFF !important;
}
 .box-check-no {
  border: 1px solid #c5c5c5;
}
</style>
