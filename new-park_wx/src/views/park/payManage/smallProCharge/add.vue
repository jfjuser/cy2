<template>
    <div>
        <ValidationObserver slim ref="form">
            <van-cell title="相机MAC" :border="false">
                <template slot="label">
                    <ValidationProvider name="相机MAC" rules="required" v-slot="{ errors }">
                        <el-select v-model="form.macArr" multiple collapse-tags>
                            <el-option clearable v-for="item in localList" :key="item.mac"  :value="item.mac" :label="item.localName">
                                <span style="float: left">{{item.localName}}</span>
                                <span style="float: right; color: #8492a6;" class="fsz12">{{item.mac}}</span>
                            </el-option>
                        </el-select>
                        <p class="fc-red">{{errors[0]}}</p>
                    </ValidationProvider>
                </template>
            </van-cell>
            <van-cell title="用户" :border="false">
                <template slot="label">
                    <ValidationProvider name="用户" rules="required" v-slot="{ errors }">
                        <el-select v-model="form.userId">
                            <el-option clearable v-for="item in userList" :key="item.id"  :value="item.id" :label="item.userName"></el-option>
                        </el-select>
                        <p class="fc-red">{{errors[0]}}</p>
                    </ValidationProvider>
                </template>
            </van-cell>
        </ValidationObserver>

        <div class="btn-box">
            <van-button type="info" :loading="createLoading" @click="createData" block round>保存</van-button>
        </div>
    </div>
</template>

<script>
import { Field, Button, Cell, CellGroup } from 'vant'
import { Select, Option } from 'element-ui'
import { getOutCamera, SmallProChargeBindUser, SmallProChargeGetUser } from '@/api/url'
import { httpGet, httpPost } from '@/utils/restful'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data () {
    return {
      form: {
        id: undefined,
        userId: undefined,
        macArr: []
      },
      createLoading: false,
      localList: [],
      userList: []
    }
  },
  created () {
    this.getCameraList()
    this.getUser()
  },
  methods: {
    // 获取用户
    getUser () {
      httpGet(SmallProChargeGetUser + this.$store.getters.departmentId)
        .then(res => {
          this.userList = res.data
        }).catch(() => {})
    },
    // 获取相机
    getCameraList () {
      httpGet(getOutCamera + '/' + this.$store.getters.departmentId).then(res => {
        if (res.data.length === 0) {
          this.$notify({
            message: '请先配置出口通道',
            type: 'warning'
          })
        } else {
          this.localList = res.data
        }
      }).catch(() => {})
    },
    // 新增
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(SmallProChargeBindUser, this.form).then((res) => {
          this.$notify({
            message: res.message,
            type: 'success'
          })
          history.go(-1)
        }).catch(() => {
          this.createLoading = false
        })

        this.$nextTick(() => {
          this.$refs.form.reset()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
.fsz12 {
  font-size: 12px;
}
.el-select {
    width: 100%;
}
</style>
