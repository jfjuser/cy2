<template>
  <div class="app-container">
    <div class="table-main">
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="业务开通">
          <el-form  :model="form" autoCompete = "on" label-position="right" label-width="120px">
            <el-form-item label="白名单">
              <template>
                <el-radio-group v-model="form.isMonthlyCard">
                  <el-radio :label="0">不开通</el-radio>
                  <el-radio :label="1">开通</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <div v-if="form.isMonthlyCard === 1">
              <el-form-item label="白名单类型">
                <template>
                  <el-radio-group v-model="form.monthlyCardType">
                    <el-radio :label="0">普通白名单</el-radio>
                    <el-radio :label="1">高级白名单</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </div>
            <el-form-item label="储值车">
              <template>
                  <el-radio-group v-model="form.isStoreCard">
                    <el-radio :label="0">不开通</el-radio>
                    <el-radio :label="1">开通</el-radio>
                  </el-radio-group>
                </template>
            </el-form-item>
            <el-form-item label="免费车">
              <template>
                  <el-radio-group v-model="form.isFreeCard">
                    <el-radio :label="0">不开通</el-radio>
                    <el-radio :label="1">开通</el-radio>
                  </el-radio-group>
                </template>
            </el-form-item>
            <el-form-item label="特殊车">
              <template>
                  <el-radio-group v-model="form.isSpecialCard">
                    <el-radio :label="0">不开通</el-radio>
                    <el-radio :label="1">开通</el-radio>
                  </el-radio-group>
                </template>
            </el-form-item>
            <!-- <el-form-item label="收费推送">
              <template>
                  <el-radio-group v-model="form.isAppFee">
                    <el-radio :label="0">不开通</el-radio>
                    <el-radio :label="1">开通</el-radio>
                  </el-radio-group>
                </template>
            </el-form-item> -->
            <el-form-item label="线上优惠" >
              <template>
                <el-radio-group v-model="form.isTicket">
                  <el-radio :label="0">不开通</el-radio>
                  <el-radio :label="1">开通</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="区分车类型" >
              <template>
                <el-radio-group v-model="form.isDistCardType">
                  <el-radio :label="0">不区分</el-radio>
                  <el-radio :label="1">区分</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="小程序推送" >
              <template>
                <el-radio-group v-model="form.isPushForFree">
                  <el-radio :label="0">不推送</el-radio>
                  <el-radio :label="1">推送</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="进出记录推送" >
              <template>
                <el-radio-group v-model="form.pushPhoto">
                  <el-radio :label="0">不推送</el-radio>
                  <el-radio :label="1">推送</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="onSubmit">确认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="清空相机">
          <el-form autoCompete = "on" label-position="right" label-width="120px">
            <el-form-item label="相机名称">
              <el-select v-model="localIds" multiple>
                <el-option v-for="item in cameraList"  :key="item.localId" :label="item.localName" :value="item.localId"></el-option>
              </el-select>
            </el-form-item>
            <div style="color:red;font-size:14px;">
              <p style="text-indent: 54px">说明：清空所选相机及其对应平台中的在场记录、白名单记录</p>
            </div>
            <el-form-item>
              <el-button :loading="clearLoading" type="primary" @click="clearSubmit">确认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { DepBuiness, getCamera, clearCameraSetting } from '@/api/url'
import { httpGet, httpPut, httpDelete } from '@/utils/restful'
export default {
  data () {
    return {
      form: {
        id: undefined,
        isTicket: 0,
        isMonthlyCard: 0,
        isStoreCard: 0,
        monthlyCardType: undefined,
        isFreeCard: 0,
        isSpecialCard: 0,
        isPushForFree: 0,
        pushPhoto: 0
        // isAppFee: 0
      },
      loading: false,
      clearLoading: false,
      cameraList: [],
      localIds: []
    }
  },
  methods: {
    getDepBuiness () {
      httpGet(DepBuiness + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
      }).catch(() => {})
    },
    tabClick (tab) {
      if (this.a !== 2) {
        this.a = 1
        if (tab.label === '清空相机') {
          this.getCamera()
        }
        this.a++
      }
    },
    onSubmit () {
      this.loading = true
      httpPut(DepBuiness, this.form).then(res => {
        this.loading = false
        this.$message.success(res.message)
      }).catch(() => {
        this.loading = false
      })
    },
    // 获取相机
    getCamera () {
      httpGet(getCamera + this.$store.getters.departmentId).then((res) => {
        if (res.data === null || res.data.length === 0) {
          this.$message.error('暂未绑定相机，请先绑定相机')
        } else {
          this.cameraList = res.data
        }
      }).catch(() => {})
    },
    clearSubmit () {
      if (this.localIds.length === 0) {
        this.$message.warning('请先选择相机')
      } else {
        this.$confirm('清空所选相机及其对应平台中的在场记录、白名单记录, 确认提交吗？', '提示', {})
          .then(() => {
            this.clearLoading = true
            httpDelete(clearCameraSetting, {localIds: this.localIds, departmentId: this.$store.getters.departmentId}).then(res => {
              this.clearLoading = false
              this.$message.success(res.message)
            }).catch(() => {
              this.clearLoading = false
            })
          }).catch(() => {})
      }
    }
  },
  mounted () {
    this.getDepBuiness()
  }
}
</script>
