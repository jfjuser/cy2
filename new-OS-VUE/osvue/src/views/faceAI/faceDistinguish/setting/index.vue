<template>
  <div class="app-container">
    <div>
      <el-row :span="20">
        <el-col :span="form.timeLimit === 1 ? 24 : 11" class="table-main" style="margin-right: 20px;">
          <el-form :rules="formRules" ref="dataform"  :model="form" autoCompete = "on" label-position="left" label-width="120px">
            <el-form-item :label="type === 1 ? '家人' :( type === 2 ? '员工' : ( type === 3 ? '学生' : '用户'))" prop="userCheck">
              <el-radio-group v-model="form.userCheck">
                <el-radio :label="0">人工审核</el-radio>
                <el-radio :label="1">自动审核</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否开启访客功能" prop="visitorCheck">
              <template>
                <el-radio-group v-model="form.visitorCheck">
                  <el-radio :label="0">关闭</el-radio>
                  <el-radio :label="1">开启</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="访客" prop="visitorCheck">
              <template>
                <el-radio-group v-model="form.visitorCheck">
                  <el-radio :label="0">人工审核</el-radio>
                  <el-radio :label="1">自动审核</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="韦根号" prop="openWigan">
              <!-- 学校模式中的特殊情况 不予显示 -->
              <template>
                <el-radio-group v-model="form.openWigan">
                  <el-radio :label="0">关闭</el-radio>
                  <el-radio :label="1">开启</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="微信推送" prop="openPush">
              <!-- 学校模式中的特殊情况 ----------------- 不予显示 -->
              <template>
                <el-radio-group v-model="form.openPush">
                  <el-radio :label="0">关闭</el-radio>
                  <el-radio :label="1">开启</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="!isShowColumnFormatter(['有为学校'])" label="地址类型" prop="addrType">
              <!-- 学校模式中的特殊情况 --------------------- 不予显示 -->
              <template>
                <el-radio-group v-model="form.addrType">
                  <el-radio  :label="1">筛选模式</el-radio>
                  <el-radio  :label="0">其他</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="进出时段" prop="timeLimit">
              <template>
                <el-radio-group v-model="form.timeLimit">
                  <el-radio :label="0">不开启</el-radio>
                  <el-radio :label="1">开启</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item>
              <el-button :loading="loading" type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="form.timeLimit === 1 ? 0 : 10" class="table-main">
          <el-alert style="margin-bottom: 20px;" title="当进出时段关闭的时候，请清除相机时段限制" type="warning" show-icon :closable="false"></el-alert>
          <el-form autoCompete = "on" label-position="right" label-width="80px">
            <el-form-item label="相机">
              <el-select v-model="id"  style="width:80%">
                <el-option v-for="item in localList" :key="item.id"  :value = "item.id" :label="item.localName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button :loading="clearLoading" type="danger" @click="onDelete">删除</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <Time v-if="form.timeLimit === 1"></Time>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { httpGet, httpPut, httpDelete } from '@/utils/restful'
import { AISetting, checkAICamera, deleteAIInOutTime } from '@/api/url'
import { isShowColumnFormatter } from '@/utils/formatter'
import Time from './Time.vue'
export default {
  computed: {
    ...mapGetters([
      'themeType'
    ])
  },
  components: {
    Time
  },
  data () {
    return {
      type: undefined,
      isShowColumnFormatter: isShowColumnFormatter,
      form: {
        id: undefined,
        userCheck: 0,
        visitorCheck: 0,
        openWigan: 0,
        timeLimit: 0,
        addrType: 0,
        openPush: 1
      },
      formRules: {
        userCheck: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        visitorCheck: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        openWigan: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        addrType: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        timeLimit: [
          {required: true, trigger: 'change', message: '不可为空'}
        ],
        openPush: [
          {required: true, trigger: 'change', message: '不可为空'}
        ]
      },
      clearLoading: false,
      loading: false,
      localList: [],
      id: undefined
    }
  },
  methods: {
    getCameraList () {
      httpGet(checkAICamera + this.$store.getters.departmentId).then(res => {
        // console.log('数据查看', res)

        this.localList = res.data
      }).catch(() => {})
    },
    getSetting () {
      httpGet(AISetting + '/' + this.$store.getters.departmentId).then(res => {
        this.form = Object.assign({}, res.data)
        // if (this.form.openWigan === undefined) {
        //   this.form.openWigan = 1
        // }
      }).catch(() => {})
    },
    onSubmit () {
      this.$refs.dataform.validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.themeType, this.isShowColumnFormatter(['有为学校']))
          if (this.themeType === 3 && this.isShowColumnFormatter(['有为学校'])) {
            this.form.addrType = 1
          }
          httpPut(AISetting, this.form).then(res => {
            this.loading = false
            this.$message({
              message: res.message,
              type: 'success',
              duration: 4 * 1000
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    onDelete () {
      if (this.id === undefined) {
        this.$message.error('请选择相机在进行提交！')
      } else {
        this.clearLoading = true
        httpDelete(deleteAIInOutTime + '/' + this.id).then(res => {
          this.clearLoading = false
          this.$message.success(res.message)
        }).catch(() => {
          this.clearLoading = false
        })
      }
    }
  },
  mounted () {
    this.getSetting()
    this.getCameraList()
    this.type = this.$store.getters.themeType
    console.log(this.type)
  }
}
</script>
