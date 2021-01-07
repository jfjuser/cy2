<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="width: 100%" shadow="always">
          <div slot="header" class="clearfix">
            <span>相机列表</span>
          </div>
          <div v-for="(item, index) in localList" :key="index" :class="[ activeIndex === index ? redClass : '', 'text', 'item']" @click="changeLocal(index, item)">
            <span style="float: left">{{ item.localName }}</span>
            <span class="macClass">{{ item.mac }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="width: 100%" shadow="always">
          <div slot="header" class="clearfix">
            <span>相机参数</span>
          </div>
          <el-form label-position="right" label-width="260px">
            <el-form-item label="车道ID"  >
              <el-input v-model="formRoad.point" :disabled="true"> </el-input>
            </el-form-item>
            <el-form-item label="车道名称" >
              <el-input  v-model="formRoad.localName"></el-input>
            </el-form-item>
            <el-form-item label="固定车车道">
              <el-select v-model="formRoad.roadPeg6" placeholder="请选择">
                <el-option v-for="item in optionRoadPeg" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="临时车道">
              <el-select v-model="formRoad.roadPeg7" placeholder="请选择">
                <el-option v-for="item in optionRoadPeg" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="出入口类型" >
              <el-select v-model="formRoad.type" placeholder="请选择">
                <el-option v-for="item in optionInOutType" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主辅机设置" v-show="isShow">
              <el-select v-model="formRoad.roadMain" placeholder="请选择">
                <el-option v-for="item in optionRoadMain" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主机等待的从机编号" v-show="isShow">
              <el-input-number v-model="formRoad.carWaitPoint"></el-input-number>
              <span style="color: red;">建议:1~99</span>
            </el-form-item>
            <el-form-item label="主机等待从机识别结果的时长" v-show="isShow">
              <el-input-number v-model="formRoad.carWaitTime"></el-input-number>
              <span style="color: red;">建议:0~25秒</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="createloading" @click="onSubmitRoad">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCamera, cameraParams } from '@/api/url'
import { httpGet, httpPost, httpPut } from '@/utils/restful'
export default {
  name: 'cameraParams',
  data () {
    return {
      activeIndex: 0,
      isShow: false,
      redClass: 'red',
      localList: [],
      isList: true,
      optionRoadPeg: [{
        value: 0,
        label: '有权限'
      }, {
        value: 1,
        label: '无权限'
      }],
      optionRoadMain: [{
        value: 2,
        label: '不启用主辅机'
      }, {
        value: 1,
        label: '主机'
      }, {
        value: 0,
        label: '辅机'
      }],
      optionInOutType: [{
        value: 0,
        label: '入口'
      }, {
        value: 1,
        label: '出口'
      }],
      createloading: false,
      formRoad: {
        id: undefined,
        departmentId: this.$store.getters.departmentId,
        point: undefined,
        localName: undefined,
        roadPeg6: 0,
        roadPeg7: 0,
        type: 0,
        roadMain: 2,
        carWaitPoint: 1,
        carWaitTime: 0
      }
    }
  },
  created () {
    this.loadLocals()
  },
  methods: {
    // -------------------------相机参数 -------------------------- \\
    // 获取相机
    loadLocals () {
      httpGet(getCamera + this.$store.getters.departmentId).then(res => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂无相机，请先绑定相机')
        } else {
          this.localList = res.data
          this.getLocalParams(res.data[0].id)
          if (res.data[0].cameraType === 6) {
            localStorage.setItem('idType', 6)
          }
          if (res.data[0].cameraType === 7) {
            localStorage.setItem('idType', 7)
          }
        }
        this.changeLocal(0, res.data[0])
      }).catch(() => {})
    },
    // 改变相机列表
    changeLocal (index, item) {
      this.activeIndex = index
      this.getLocalParams(item.id)
      if (item.mac.indexOf(':') > -1) {
        this.isShow = true
      } else {
        this.isShow = false
      }
      this.$emit('childmac', this.isShow)
    },
    // 获取设置参数
    getLocalParams (id) {
      httpGet(cameraParams + '/' + id)
        .then(res => {
          if (res.data !== null) {
            this.formRoad = res.data
          }
        }).catch(() => {})
    },
    // 保存设置参数
    onSubmitRoad () {
      let self = this
      this.createloading = true
      let HTTP
      if (this.formRoad.id) {
        HTTP = httpPut
      } else {
        HTTP = httpPost
      }
      HTTP(cameraParams, this.formRoad).then(res => {
        this.createloading = false
        if (!this.formRoad.id) {
          // 新增操作要重新加载id,避免重复提交
          self.loadLocals()
        }
        this.$message({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.createloading = false
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.text {
  font-size: 14px;
}
.clearfix:before,.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.item {
  margin-bottom: 18px;
  cursor: pointer;
  padding: 10px;
  height: 20px;
  line-height: 20px;
}
.item:hover{
  color: blue;
}
.red {
    color: red !important;
}
.macClass{
    float: right;
  font-size: 13px
}
</style>
