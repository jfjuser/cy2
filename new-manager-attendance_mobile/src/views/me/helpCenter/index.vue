<template>
    <div class="page bgc-grey full-height">
        <van-collapse v-model="activeNames" class="mar-b-10">
            <van-collapse-item title="如何新注册一个公司？" name="1">
                1、扫描设备二维码，检测设备是否已被绑定，若是，即可【下一步】进入注册，否则，无权限注册管理员
                2、进入注册页，填写手机号，点击【下一步】验证手机号。<br>
                3、如手机号未注册过，则输入新密码和短信验证码；如手机号已注册，则输入短信验证码，点击【下一步】。<br>
                4、请设置wifi信息，以便设备联网使用，完成点击【下一步】或【跳过】。<br>
                5、使用扫一扫识别设备二维码，获得设备MAC地址，并填写必要信息，点击【下一步】。<br>
                6、填写完基本信息，点击【创建】。<br>
                7、如中途退出，或中途长时间未进行下一步操作，则会注册失败或超时，请重新注册。
            </van-collapse-item>
            <van-collapse-item title="如何邀请人进入公司？" name="2">
                1、进入考勤组管理页，点击【邀请】（没有考勤组请先添加）。<br>
                2、目前只支持链接分享方式，点击【链接分享】。<br>
                3、被邀请人打开分享链接并填写完信息，点击【完成】。<br>
                4、加入考勤组成功，即加入了该公司。
            </van-collapse-item>
            <van-collapse-item title="员工离职如何删除？" name="3">
                1、我的->【成员管理】。<br>
                2、选择成员并向左滑动，点击【删除 】。
            </van-collapse-item>
            <van-collapse-item title="如何添加/绑定设备？" name="4">
                1、进入首页，点击底部导航中间的【加号】按钮。<br>
                2、点击【添加】按钮，进入扫一扫页。<br>
                3、使用扫一扫识别设备二维码，获得设备MAC地址，并填写必要信息，点击【添加】。
            </van-collapse-item>
            <van-collapse-item title="如何审核加入的申请？" name="5">
                1、我的->【申请消息】。<br>
                2、选择要审核的申请消息，点击并选择【同意】或【拒绝】。
            </van-collapse-item>
            <van-collapse-item title="如何审核补卡申请？" name="6">
                1、首页->【申请管理】。<br>
                2、选择要审核的补卡申请，点击查看。<br>
                3、选择【同意】或【拒绝】。
            </van-collapse-item>
            <van-collapse-item title="如何修改打卡结果？" name="7">
                1、首页->【考勤统计】->【日统计】，选择要进入的统计记录。<br>
                2、点击上班或下班展开，点击【修改】，选择修改结果，点击【保存】。
            </van-collapse-item>
            <van-collapse-item title="如何生成临时访客，扫码通行？" name="8">
                1、首页->【访客管理】，填写完信息，点击【提交】。<br>
                2、提交成功，点击【分享】发送给访客。<br>
                3、访客点开链接并扫设备屏幕下方二维码。<br>
                4、成功开闸通行。
            </van-collapse-item>
            <van-collapse-item title="为什么页面底部空缺或留白？" name="9">
                某些微信版本可能会出现的问题，请关闭页面重新从公众号进入。
            </van-collapse-item>
        </van-collapse>

        <!-- <div @touchstart="ontouchstart" @touchmove="ontouchmove" @touchend="ontouchend" class="debug"><van-cell title="开发者选项" icon="setting-o" label="请在开发者引导下使用" /></div> -->
        <div class="debug" @click.prevent.stop="onclick"><van-cell title="开发者选项" icon="setting-o" label="请在开发者引导下使用" /></div>
    </div>
</template>

<script>
import { Collapse, CollapseItem } from 'vant'

export default {
  components: {
    'van-collapse': Collapse,
    'van-collapse-item': CollapseItem
  },
  data () {
    return {
      activeNames: ['1'],
      timeOutEvent: null,
      num: 0,
      vConsole: null
    }
  },
  methods: {
    // 连续点击8次
    onclick () {
      if (this.timeOutEvent) clearTimeout(this.timeOutEvent)
      if (this.vConsole) return
      this.num++
      // console.log(this.num)
      if (this.num === 8) {
        return
      }
      this.timeOutEvent = setTimeout(() => {
        this.num = 0
      }, 2000)
    }
    // 长按8秒 ios有问题
    // ontouchstart (e) {
    //   e.preventDefault()
    //   this.timeOutEvent = setTimeout(() => {
    //     /* eslint-disable-next-line */

    //   }, 5000)
    // },
    // ontouchmove (e) {
    //   e.preventDefault()
    //   if (this.timeOutEvent) clearTimeout(this.timeOutEvent)
    // },
    // ontouchend (e) {
    //   e.preventDefault()
    //   if (this.timeOutEvent) clearTimeout(this.timeOutEvent)
    // }
  },
  activated () {
    if (this.$route.query.type) {
      const type = this.$route.query.type + ''
      this.activeNames = [type]
    }
  },
  beforeRouteLeave (to, from, next) {
    this.activeNames = ['1']
    next()
  }
}
</script>

<style lang="scss" scoped>
.page {
    /deep/ .van-collapse-item__content {
        background-color: #f6f6f6
    }
}
.debug {
  user-select:none;
  cursor:pointer;
}
</style>
