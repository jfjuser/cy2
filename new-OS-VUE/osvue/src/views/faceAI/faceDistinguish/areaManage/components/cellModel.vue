<template>
  <div class="table-main" style="margin-bottom: 20px;">
    <div class="close"><i class="el-icon-question questionicon" @click="onQuestion" title="操作说明"></i><slot></slot></div>
    <section>
      <el-form ref="buildingInput" :class="{'inputbox': isplanData}">
        <el-input class="inputLine" size="medium" clearable v-model.trim="buildingForm.floorStart" @input="autoCreate"></el-input>
          --
        <el-input class="inputLine" size="medium" clearable v-model.trim="buildingForm.floorEnd" @input="autoCreate"></el-input>{{themeType === 3 ? '年级' : '层'}}
        <el-input class="inputLine" size="medium" clearable style="margin-left:10px" v-model.trim="buildingForm.roomStart" @input="autoCreate"></el-input>
          --
        <el-input class="inputLine" size="medium" clearable v-model.trim="buildingForm.roomEnd" @input="autoCreate"></el-input>{{themeType === 3 ? '班' : '号房'}}
        <el-button style="margin-left:10px" type="info" plain @click="reset">重置</el-button>
        <el-button style="margin-left:10px" type="primary" plain  @click="showSaveDialog">保存</el-button>
      </el-form>
      <div class="history" style="margin-top:1rem;font-weight:bold">
        <el-tag type="danger">△模板创建前，先点【重置】后再输入保存</el-tag>
      </div>
      <div class="history">
        <p>详细信息：</p>
        <p v-for="(item, i) in form.roomsInfo" :key="i">{{item.floorStart + (item.floorEnd == item.floorStart?'':'-'+item.floorEnd) + (themeType === 3 ? '年级' : '层，') + item.roomStart + (item.roomEnd == item.roomStart?'':'-'+item.roomEnd) + (themeType === 3 ? '班' : '号房')}}</p>
      </div>
    </section>
    <transition name="el-fade-in">
      <PlanModel :planData="planData" v-if="isplanData" @editorRoom="editorRoom" style="padding-top: 35px;"></PlanModel>
    </transition>
    <el-dialog title="保存" :visible.sync="dialogVisible" width="30%" append-to-body>
      <el-form :rules="formRules" ref="dataform" :model="form" autoComplete="on" label-position="right" label-width="100px">
        <el-form-item label="模板名称" prop="templateId">
          <el-input v-model="form.templateId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-alert
        title="保存前请确认生成模板,将按生成后的模板保存信息"
        type="warning"
        :closable="false"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading = "saveLoading" @click="saveModel">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PlanModel from '@/components/PlanModel'
import { createModel } from '@/api/url'
import { httpPost } from '@/utils/restful'
export default {
  components: {
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
      dialogVisible: false,
      saveLoading: false,
      formRules: {
        templateId: [{required: true, trigger: 'change', message: '模板名称不可为空'}]
      },
      form: {
        templateId: undefined,
        departmentId: this.$store.getters.departmentId,
        roomsInfo: []
      },
      timeout: undefined
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
    this.themeType = this.$store.getters.themeType
  },
  methods: {
    onQuestion () {
      // this.$alert('暂无', '操作说明', {showConfirmButton: false})
      const h = this.$createElement
      const message = h('div', null, [
        h('p', { style: 'font-weight: bold' }, '如何生成模板？'),
        h('p', null, '右边输入完对应值,左边会自动生成相对应模板。'),
        h('p', { style: 'font-weight: bold' }, '为何提示我“输入楼层不能有重复,或请重置”？'),
        h('p', null, '已输入过的楼层不能够重复输入，如需更改之前楼层，可点击重置重新输入。'),
        h('p', { style: 'font-weight: bold' }, '为何提示我“生成失败,请重试”？'),
        h('p', null, '请联系管理员。')
      ])
      this.$msgbox({
        title: '操作说明',
        message,
        showConfirmButton: false
      })
    },
    // 重置
    reset () {
      this.planData = []
      this.form.roomsInfo = []
      this.buildingForm.floorStart = ''
      this.buildingForm.floorEnd = ''
      this.buildingForm.roomStart = ''
      this.buildingForm.roomEnd = ''
    },
    // 输入自动生成
    autoCreate () {
      let context = this
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        context.buildingSubmit()
      }, 1600)
    },
    // 生成
    buildingSubmit () {
      let {floorStart, floorEnd, roomStart, roomEnd} = this.buildingForm
      // if (floorStart === '' || floorEnd === '' || roomStart === '' || roomEnd === '') {
      //   this.$message({
      //     message: '请将信息填写完整',
      //     type: 'warning',
      //     duration: 4000
      //   })
      //   return
      // }
      if (floorStart === '') return
      if (floorEnd === '') return
      if (roomStart === '') return
      if (roomEnd === '') return

      let reg = new RegExp(/^\d+$/)
      if (!reg.test(floorStart) || !reg.test(floorEnd) || !reg.test(roomStart) || !reg.test(roomEnd)) {
        this.$message({
          message: '必须输入数字,或不能负数',
          type: 'warning',
          duration: 4000
        })
        return
      }

      floorStart = Number(floorStart)
      floorEnd = Number(floorEnd)
      roomStart = Number(roomStart)
      roomEnd = Number(roomEnd)
      if (floorStart === 0 || floorEnd === 0 || roomStart === 0 || roomEnd === 0) {
        this.$message({
          message: '输入的数不能是0',
          type: 'warning',
          duration: 4000
        })
        return
      }
      if (floorStart > floorEnd) {
        this.$message({
          message: '前一个输入楼层数不能大于后一个输入楼层数',
          type: 'warning',
          duration: 4000
        })
        return
      }
      if (roomStart > roomEnd) {
        this.$message({
          message: '前一个输入房号数不能大于后一个输入房号数',
          type: 'warning',
          duration: 4000
        })
        return
      }

      try {
        this.calculate(floorStart, floorEnd, roomStart, roomEnd)
      } catch (error) {
        this.$message({
          message: '生成失败,请重试',
          type: 'warning',
          duration: 4000
        })
      }
    },
    // 生成算法
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
          this.$message({
            message: '输入楼层不能有重复,或请重置',
            type: 'warning',
            duration: 4000
          })
          return true
        }
      }
    },
    historySubmit (floorStart, floorEnd, roomStart, roomEnd) {
      let obj = {floorStart, floorEnd, roomStart, roomEnd}
      this.form.roomsInfo = this.form.roomsInfo.concat([obj])
    },
    editorRoom (row, column, room) {
      this.$prompt('', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: room,
        inputValidator (val) {
          if (!val || val === '') {
            return '不能为空'
          }
          if (val.length > 4) {
            return '限制字数4字'
          }
        }
      }).then(({ value }) => {
        this.$set(this.planData[row].rooms, column, value)
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(() => {})
    },
    showSaveDialog () {
      if (!this.isplanData) {
        this.$message({
          message: '请先生成模板',
          type: 'warning',
          duration: 4000
        })
        return
      }
      this.dialogVisible = true
    },
    saveModel () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.saveLoading = true
          let postdata = {
            ...this.form,
            templateInsertRooms: this.planData
          }
          httpPost(createModel, postdata).then((res) => {
            this.dialogVisible = false
            setTimeout(() => { this.saveLoading = false }, 300)
            this.$emit('saveafter')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.inputLine{
  display:inline-block;
  width:70px
}
.table-main {
  display: flex;
  position: relative;
}
.history {
  padding-top: 35px;
  letter-spacing: 4px;
}
section {
  min-height: 300px;
  width: 50%;
  position: relative;
}
.inputbox {
  position: fixed;
  top: 90px;
  z-index: 1;
}
.close {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
}
.questionicon {
  &:hover {
     cursor: pointer;
  }
}
</style>
