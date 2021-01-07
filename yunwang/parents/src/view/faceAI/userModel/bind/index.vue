<template>
  <div>
    <div class="title">请选择认证方式</div>
    <div class="box-mode">
      <div class="box-mode-outFrame">
        <div class="box-mode-inFrame" @click="handleModeCode">
          <div class="box-mode-title">激活码</div>
          <div class="box-mode-text">
            <p>预激活码可通过学校/公司/小区管理处获得</p>
          </div>
          <div class="box-mode-tip">
            <p>效率: 高</p>
            <p>便捷性: 一般</p>
          </div>
        </div>
      </div>
      <div class="box-mode-outFrame">
        <div class="box-mode-inFrame" @click="handleModeFace">
          <div class="box-mode-title">人脸认证</div>
          <div class="box-mode-text">
            <p>通过上传个人照片进行认证绑定</p>
          </div>
          <div class="box-mode-tip">
            <p>效率: 较高</p>
            <p>便捷性: 高</p>
          </div>
        </div>
      </div>
      <div class="box-mode-outFrame">
        <div class="box-mode-inFrame" @click="handleModePhone">
          <div class="box-mode-title">预留手机号认证</div>
          <div class="box-mode-text">
            <p>通过在物业预留的手机号进行短信认证绑定</p>
          </div>
          <div class="box-mode-tip">
            <p>效率: 高</p>
            <p>便捷性: 高</p>
          </div>
        </div>
      </div>
      <div class="box-mode-outFrame">
        <div class="box-mode-inFrame" @click="handleModeEmail">
          <div class="box-mode-title">预留邮箱认证</div>
          <div class="box-mode-text">
            <p>通过在物业预留的邮箱进行邮箱认证绑定</p>
          </div>
          <div class="box-mode-tip">
            <p>效率: 一般</p>
            <p>便捷性: 一般</p>
          </div>
        </div>
      </div>
    </div>
    <div class="box-bind-manager" @click="goBindManager">查看绑定情况</div>
  </div>
</template>
<script>
import { httpPost } from '@/utils/restful'
import { bindFace } from '@/api/url.js'
import { getWxInfo, getDepInfo } from '@/utils/userInfo.js'
export default {
  components: {
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    handleModeCode () {
      let self = this
      this.$vux.confirm.show({
        // 组件除show外的属性
        title: '人脸绑定',
        placeholder: '请输入预激活码',
        confirmText: '激活',
        showInput: true,
        onShow () {
          self.$vux.confirm.setInputValue('')
        },
        onCancel () {
        },
        onConfirm (value) {
          let params = {
            departmentId: getDepInfo().departmentId,
            account: getWxInfo().account,
            unicode: getWxInfo().unicode,
            code: value,
            type: 1
          }
          httpPost(bindFace, params).then(res => {
            self.$vux.toast.text('绑定成功', 'bottom')
            // if (!params.departmentId) {
            // httpPost(switchUnion, params).then(res2 => {
            //   params.departmentId = res.data
            //   // 重新从登录页进入
            //   let host = process.env.API_HOST
            //   let redirectUrl = encodeURIComponent(host + 'view/faceAI/userLogin/?account=' + params.account)
            //   window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + params.account + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_base'
            // }).catch(() => {})
            // } else {
            // 回到首页
            this.$router.push({path: '/faceAI/userModel/'})
            // }
          }).catch(() => {
            // self.$vux.toast.text('绑定失败', 'bottom')
          })
        }
      })
    },
    handleModeFace () {
      this.$vux.toast.text('暂不支持,敬请期待', 'bottom')
    },
    handleModePhone () {
      this.$vux.toast.text('暂不支持,敬请期待', 'bottom')
      // this.$router.push({path: '/faceAI/userModel/bind/captcha/phone/'})
    },
    handleModeEmail () {
      this.$vux.toast.text('暂不支持,敬请期待', 'bottom')
    },
    goBindManager () {
      this.$router.push({path: '/faceAI/userModel/bind/manager/'})
    }
  }
}
</script>
<style lang='scss' scoped>
.title {
  padding-top: 15%;
  font-size: .875rem;
  color: rgb(110, 110, 110);
}
.box-mode {
  display: flex;
  flex-wrap: wrap;
  .box-mode-outFrame {
    width: 50%;
    cursor: pointer;
    .box-mode-inFrame {
      margin: 1.25rem 4.5%;
      height: 12.5rem;
      border: 1px solid #c9cacc !important;
      .box-mode-title {
        height: 3.75rem;
        line-height: 3.75rem;
        font-size: 1.125rem
      }
      .box-mode-text {
        height: 4.6875rem;
        margin: 0 .9375rem;
        font-size: .875rem;
        color: rgb(110, 110, 110);
        p {
          margin: .5rem 0;
        }
      }
      .box-mode-tip {
        height: 3.75rem;
        font-size: .875rem;
        color: rgb(110, 110, 110);
        p {
          margin: .5rem 0;
        }
      }
    }
  }
}
.box-bind-manager {
  border-top: 1px solid rgb(31, 114, 28);
  border-left: 1px solid rgb(31, 114, 28);
  border-bottom: 1px solid rgb(31, 114, 28);
  border-top-left-radius: 1.25rem;
  border-bottom-left-radius: 1.25rem;
  background-color: #e8fae8;
  color: rgb(31, 114, 28);
  width: 8rem;
  font-size: 1rem;
  letter-spacing: .0625rem;
  padding: .1875rem 0;
  float: right;
  margin-top: 3rem;
}
</style>
