<template>
  <div>
    <ValidationObserver slim ref="form">
      <van-cell-group>
        <ValidationProvider name="商户名称" rules="required" v-slot="{ errors }" slim>
          <van-field
            v-model.trim="form.shopName"
            label="商户名称"
            placeholder="请输入商户名称"
            required
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="系统名称" rules="required|min:2|max:8" v-slot="{ errors }" slim>
          <van-field
            v-model.trim="form.sysName"
            label="系统名称"
            placeholder="请输入系统名称"
            required
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="联系方式" rules="required|phone" v-slot="{ errors }" slim>
          <van-field
            v-model.trim="form.phone"
            label="联系方式"
            placeholder="请输入联系方式"
            type="number"
            required
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider name="详细地址" rules="required" v-slot="{ errors }" slim>
          <van-field
            v-model.trim="form.address"
            label="详细地址"
            placeholder="请输入详细地址"
            required
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <van-field
          v-model.trim="form.resume"
          label="备注信息"
          placeholder="请输入备注信息"
          type="textarea"
          autosize rows="1"
        />
      </van-cell-group>
    </ValidationObserver>

    <div class="btn-box">
        <van-button v-if="!queryData" type="info" :loading="createLoading" @click="createData" block round>保存</van-button>
        <van-button v-if="queryData" type="info" :loading="updataLoading" @click="updateData" block round>修改</van-button>
    </div>
  </div>
</template>

<script>
import { CellGroup, Field, Button } from 'vant'
import { httpPost, httpPut } from '@/utils/restful'
import { BuinessInfo } from '@/api/url'
import { extend } from 'vee-validate'
import { max, min } from 'vee-validate/dist/rules'
extend('max', max)
extend('min', min)

export default {
  components: {
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field
  },
  data () {
    return {
      createLoading: false,
      updataLoading: false,
      form: {
        id: undefined,
        address: '',
        phone: '',
        resume: '',
        shopName: '',
        sysName: ''
      }
    }
  },
  computed: {
    queryData () {
      return this.$route.query.data
    }
  },
  created () {
    if (this.$route.query.data) {
      this.form = Object.assign({}, JSON.parse(this.$route.query.data))
    }
  },
  methods: {
    createData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.createLoading = true
        this.form = Object.assign(this.form, {departmentId: this.$store.getters.departmentId})
        httpPost(BuinessInfo, this.form).then((res) => {
          this.createLoading = false
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
    },
    // 修改
    updateData () {
      this.$refs.form.validate().then(success => {
        if (!success) return
        this.updataLoading = true
        const updateFormData = Object.assign({}, this.form)
        httpPut(BuinessInfo, updateFormData).then(res => {
          this.updataLoading = false
          this.$notify({
            message: res.message,
            type: 'success'
          })
          history.go(-1)
        }).catch(() => {
          this.updataLoading = false
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
</style>
