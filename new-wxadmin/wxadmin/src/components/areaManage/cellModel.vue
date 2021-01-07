<template>
    <div>
        <NavBar title="小区模块" left-text="返回"  left-arrow @click-left="onClickLeft" />
        <div class="inputbox">
            <div class="btnbox">
                <Button type="primary" size="small" @click="buildingSubmit">生成</Button>
                <Button type="default" size="small" @click="planData = [], form.roomsInfo = []">重置</Button>
                <Button type="info" size="small" @click="showSaveDialog">保存</Button>
            </div>
            <div>
                <input type="text" v-model.trim="buildingForm.floorStart">--<input type="text" v-model.trim="buildingForm.floorEnd">层
                <input type="text" v-model.trim="buildingForm.roomStart">--<input type="text" v-model.trim="buildingForm.roomEnd">号房
            </div>
        </div>
        <div class="history">
          <div>详细信息：</div>
          <div v-for="(item, i) in form.roomsInfo" :key="i">{{item.floorStart + (item.floorEnd == item.floorStart?'':'-'+item.floorEnd) + '层，' + item.roomStart + (item.roomEnd == item.roomStart?'':'-'+item.roomEnd) + '号房'}}</div>
        </div>
        <div>
            <PlanModel :planData="planData" v-if="isplanData"></PlanModel>
        </div>
        <van-dialog
            v-model="showdialog"
            title="保存"
            show-cancel-button
            :before-close="saveModel"
        >
            <Field required v-model="form.templateId" placeholder="请输入" label="模板名称"  />
            <div style="background-color: #fffbe8;color:#ed6a0c;font-size: 14px;padding:10px;">保存前请确认生成模板,将按生成后的模板保存信息</div>
        </van-dialog>
    </div>
</template>

<script>
import { NavBar, Field, Button, Toast } from 'vant'
import PlanModel from './components/PlanModel'
import { createModel } from '@/api/url'
import { httpPost } from '@/utils/restful'

export default {
  components: {
    NavBar,
    Field,
    Button,
    PlanModel
  },
  data () {
    return {
      buildingForm: {
        floorStart: 1,
        floorEnd: 5,
        roomStart: 1,
        roomEnd: 5
      },
      planData: [],
      form: {
        templateId: undefined,
        departmentId: this.$store.getters.departmentId,
        roomsInfo: []
      },
      showdialog: false
    }
  },
  computed: {
    isplanData () {
      if (this.planData.length === 0) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    this.calculate(1, 5, 1, 5)
  },
  methods: {
    onClickLeft () {
      this.$router.push('/areaManage/')
    },
    buildingSubmit () {
      let {floorStart, floorEnd, roomStart, roomEnd} = this.buildingForm
      if (floorStart === '' || floorEnd === '' || roomStart === '' || roomEnd === '') {
        Toast.fail('请将信息填写完整')
        return
      }

      let reg = new RegExp(/^\d+$/)
      if (!reg.test(floorStart) || !reg.test(floorEnd) || !reg.test(roomStart) || !reg.test(roomEnd)) {
        Toast.fail('必须输入数字,或不能负数')
        return
      }

      floorStart = Number(floorStart)
      floorEnd = Number(floorEnd)
      roomStart = Number(roomStart)
      roomEnd = Number(roomEnd)
      if (floorStart === 0 || floorEnd === 0 || roomStart === 0 || roomEnd === 0) {
        Toast.fail('输入的数不能是0')
        return
      }
      if (floorStart > floorEnd) {
        Toast.fail('前一个输入楼层数不能大于后一个输入楼层数')
        return
      }
      if (roomStart > roomEnd) {
        Toast.fail('前一个输入房号数不能大于后一个输入房号数')
        return
      }

      try {
        this.calculate(floorStart, floorEnd, roomStart, roomEnd)
      } catch (error) {
        Toast.fail('生成失败,请重试')
      }
    },
    // 生成平面图
    calculate (floorStart, floorEnd, roomStart, roomEnd) {
      const floorSum = floorEnd - floorStart + 1
      const roomSum = roomEnd - roomStart + 1

      let arr = []
      let floors = []
      for (let i = 0; i < floorSum; i++) {
        let floorNum = floorStart + i
        floors.push(floorNum)
        let obj = {
          floor: floorNum,
          rooms: []
        }
        for (let j = 0; j < roomSum; j++) {
          let roomNum = roomStart + j
          if (roomNum < 10) {
            roomNum = floorNum + '0' + roomNum
          } else {
            roomNum = String(floorNum) + roomNum
          }
          obj.rooms.push(roomNum)
        }
        arr.push(obj)
      }

      if (this.isFloorRepeat(floors)) return

      this.planData = this.planData.concat(arr)
      this.historySubmit(floorStart, floorEnd, roomStart, roomEnd)
    },
    isFloorRepeat (floors) {
      // 检测楼层是否重复
      for (let v of this.planData.values()) {
        if (floors.includes(v.floor)) {
          Toast.fail('输入楼层不能有重复,或请重置')
          return true
        }
      }
    },
    historySubmit (floorStart, floorEnd, roomStart, roomEnd) {
      let obj = {floorStart, floorEnd, roomStart, roomEnd}
      this.form.roomsInfo = this.form.roomsInfo.concat([obj])
    },
    showSaveDialog () {
      if (!this.isplanData) {
        Toast.fail('请先生成模板')
        return
      }
      this.showdialog = true
    },
    saveModel (action, done) {
      if (action === 'confirm') {
        let value = this.form.templateId
        if (!value || value === '') {
          done(false)
          return
        }
        let postdata = {
          ...this.form,
          templateInsertRooms: this.planData
        }
        httpPost(createModel, postdata).then((res) => {
          Toast.success('保存成功')
          done()
        }).catch(() => {
          done()
          Toast.fail('操作失败')
        })
      }
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
.inputbox {
    padding: .9rem;
    .btnbox {
        margin-bottom: .8rem;
    }
    input {
        width: 3rem;
        &:nth-of-type(3) {
            margin-left: 1rem;
        }
    }
}
.history {
   padding-left: .9rem;
   padding-bottom: .9rem;
}
</style>
