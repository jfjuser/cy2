<template>
  <!-- 建言献策 -->
  <div class="main-body">
    <div class="box-page1" v-if="index === 1">
      <p class="box-tip box-padding">欢迎您提供宝贵的意见和建议</p>
      <checker v-model="form.suggestionSelect" name="checker1" default-item-class="box-checker-item">
        <p class="box-padding"><checker-item value="0" class="green" @click.native.prevent="handleClick(2, 0)">咨询</checker-item></p>
        <p class="box-padding"><checker-item value="1" class="blue" @click.native.prevent="handleClick(2, 1)">建议</checker-item></p>
        <p class="box-padding"><checker-item value="2" class="red" @click.native.prevent="handleClick(2, 2)">投诉</checker-item></p>
      </checker>
    </div>
    <div class="box-page2" v-if="index === 2">
      <div class="box-title">反馈类型<span class="box-tip">(更高效的定位及处理您的意见和建议)</span></div>
      <checker v-model="form.suggestionType" name="checker2" default-item-class="box-checker-item" selected-item-class="box-checker-item-selected">
        <checker-item value="0">付款流程</checker-item>
        <checker-item value="1">不开闸</checker-item>
        <checker-item value="2">加载慢</checker-item>
        <checker-item value="3">固定车月卡</checker-item>
        <checker-item value="4">服务态度</checker-item>
        <checker-item value="5">其他</checker-item>
      </checker>
      <div style="clear: both"/>
      <div class="box-title">反馈内容</div>
      <x-textarea class="box-contact" name="contact" :max="500" v-model="form.suggestionContact" placeholder="我们将不断为您改进" :rows="6"></x-textarea>
      <div class="box-title">联系方式</div>
      <group>
      <x-input class="box-phone" name="phone" type='tel' title="手机号" mask="99999999999" v-model="form.phone" placeholder="请输入您的手机号" :max="11" is-type="china-mobile" :show-clear="false"></x-input>
      </group>
      <x-button class="box-submit" @click.native.prevent="handleSubmit()" type="primary">提交</x-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.main-body {
  padding: 5% 5% 10%;
}
.box-padding {
  margin: 1.25rem 0;
}
.box-page1 {
  margin-top: 30%;
  .box-tip {
    color: #707070;
  }
  .box-checker-item {
    border-radius: 10px;
    border: 1px solid #ececec;
    padding: 8% 20%;
  }
}
.box-page2 {
  .box-title {
    margin: 2% 0 4%;
    font-size: 16px;
    text-align: left;
  }
  .box-tip {
    margin-left: 5px;
    font-size: 12px;
    color: #707070;
  }
  .box-checker-item {
    width: 30%;
    margin: 10px 0;
    padding: 8px 0;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
    float: left;
  }
  .box-checker-item-selected {
    background: #ffffff url(./../../../assets/icon/icon_select_blue.png) no-repeat right bottom;
    border-color: #b3d8ff;
  }
  .box-contact {
    border: 1px solid #ccc;
    font-size: 16px;
  }
  .box-submit {
    width: 80%;
    margin: 20% 10% 0;
  }
}
</style>
<script>
import { suggestion } from '@/api/url.js'
import { httpPost } from '@/utils/restful.js'
import { Checker, CheckerItem, XTextarea, XInput, XButton, Group } from 'vux'
document.title = '建言献策'
export default {
  components: {
    Checker,
    CheckerItem,
    XTextarea,
    XInput,
    XButton,
    Group
  },
  data () {
    return {
      index: 1,
      form: {
        phone: undefined,
        suggestionContact: undefined,
        suggestionSelect: undefined,
        suggestionType: undefined,
        type: 7,
        kind: 0,
        uuid: ''
      }
    }
  },
  created () {
  },
  methods: {
    handleClick (index, suggestionSelect) {
      this.form.suggestionSelect = suggestionSelect
      this.index = index
    },
    handleSubmit () {
      httpPost(suggestion, this.form).then(res => {
        this.$vux.toast.text('提交成功', 'bottom')
        // 重置
        this.form = {
          phone: undefined,
          suggestionContact: undefined,
          suggestionSelect: undefined,
          suggestionType: undefined,
          type: 1,
          kind: 0,
          uuid: ''
        }
        this.index = 1
      }).catch(() => {
      })
    }
  }
}
</script>
