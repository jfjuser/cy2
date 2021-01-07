<template>
    <div>
        <van-cell-group>
          <van-cell title="类型" :value="typeVal" is-link @click="showPicker = true"></van-cell>
          <van-field
            v-model.trim="form.phone"
            label="手机号"
            type="number"
            placeholder="请输入"
            :error-message="phoneErr"
          />
          <van-field
            v-model.trim="form.suggestionContact"
            label="内容"
            type="textarea"
            autosize
            placeholder="请输入"
            :error-message="contentErr"
          />
        </van-cell-group>

        <div class="btn-box">
            <van-button type="info" block round @click="onSubmit" :loading="loading">保存</van-button>
        </div>

        <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
          <van-picker
            show-toolbar
            :columns="columns"
            value-key="valueName"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
    </div>
</template>

<script>
import { Cell, CellGroup, Field, Button, Dialog, Picker, Popup } from 'vant'
import { checkPhone } from '@/utils/validator.js'
import { suggestionAdd } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
import { suggestionSelectType } from '@/utils/selectAble.js'
export default {
  components: {
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup
  },
  data () {
    return {
      loading: false,
      form: {
        phone: '',
        suggestionContact: '',
        suggestionSelect: undefined,
        type: 1,
        kind: 0,
        uuid: ''
      },
      phoneErr: '',
      contentErr: '',
      typeVal: '',
      showPicker: false,
      columns: suggestionSelectType
    }
  },
  methods: {
    onSubmit () {
      const suggestionSelect = this.form.suggestionSelect
      const phone = this.form.phone
      const suggestionContact = this.form.suggestionContact
      if (suggestionSelect === undefined) {
        this.$toast.fail('请选择反馈类型')
        return
      }
      if (checkPhone(phone)) {
        this.phoneErr = '请输入正确的手机号码'
      } else { this.phoneErr = '' }
      if (suggestionContact === '') {
        this.contentErr = '请输入建议信息'
      } else { this.contentErr = '' }
      if (checkPhone(phone) || suggestionContact === '') return

      this.loading = true
      httpPost(suggestionAdd, this.form).then(res => {
        this.loading = false
        Dialog.confirm({
          message: res.message,
          closeOnPopstate: true
        }).then(() => {
          history.go(-1)
        }).catch(() => {})
      }).catch(() => {
        this.loading = false
      })
    },
    onConfirm (value, index) {
      // console.log(value)
      this.form.suggestionSelect = value.valueNo
      this.typeVal = value.valueName
      this.showPicker = false
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
    padding: 20px;
}
</style>
