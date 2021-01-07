<template>
    <div class="page bgc-grey full-height box-sizing">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o" >
        左滑可解绑、编辑，点击更多查看更多。
      </van-notice-bar>
        <van-list
          v-model="listLoading"
          :finished="finished"
          finished-text="无更多数据"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="fetchData"
        >
          <van-cell-group>
            <template v-for="(item, index) in listData">
              <van-swipe-cell :key="index">
                <van-cell is-link center :border="false" :title="`通道名称：${item.localName}`" :label="`MAC地址: ${item.mac||''}`" value="更多" @click="showInfo(item)">
                    <template #title>
                      <span class="custom-title">通道名称:{{item.localName}}</span>
                      <van-tag type="primary" size="medium" @click.stop="switchingOff(item.mac)">远程开门</van-tag>
                    </template>
                  </van-cell>
                <template slot="right">
                  <div style="font-size: 0;height: 100%">
                    <!-- <van-button square type="danger" text="解绑" @click="handleRemoveBind(item.id, index)" style="height: 100%;" v-if="item.isBind === 1" /> -->
                    <van-button square type="danger" text="解绑" @click="handleRemoveBind(item.id, index)" style="height: 100%;" />
                    <van-button square type="info" text="编辑" @click="onshowName(item)"  style="height: 100%;" />
                  </div>
                </template>
              </van-swipe-cell>
            </template>
          </van-cell-group>
        </van-list>

        <div class="btnbox box-sizing">
          <van-button type="info" block round @click="toSetDev" class="mar-b-10">添加</van-button>
          <van-button type="info" block round plain @click="showMenu = true" id="step1">更多设置</van-button>
        </div>

        <van-action-sheet v-model="showMenu" :actions="listData.length > 0 && VersionFlag1 / 1 === 1 ? actions1 : actions" @select="onSelect" :round="false" close-on-click-action cancel-text="取消" @cancel="showMenu=false" />
        <van-popup v-model="show">
          <div class="infobox">
            <van-cell-group>
                <van-cell title="通道名称" :value="infoData.localName" />
                <van-cell title="MAC地址" :value="infoData.mac" />
                <van-cell title="状态">
                  <template v-if="infoData.status === 0">离线</template>
                  <template v-if="infoData.status === 1">在线</template>
                </van-cell>
                <van-cell title="最近在线时间" :value="timeFormatter(infoData.loginAt)" />
                <van-cell title="最近离线时间" :value="timeFormatter(infoData.loginOutAt)" />
                <van-cell title="出/入口" :value="inOutFormatter(infoData.type)" />
                <van-cell title="绑定状态" :value="isBindFormatter(infoData.isBind)" />
                <van-cell title="TCP协议版本" :value="infoData.tcpVersion" />
                <van-cell title="网络连接类型" :value="networkTypeFormatter(infoData.networkType)" />
                <van-button type="info" style="width:100%" @click="toDepartment">修改部门</van-button>
                <van-button v-if="VersionFlag / 1 ===1" type="info" style="width:100%;margin-top: 5px" @click="toChangePassword">修改密码</van-button>
                <van-button v-if="VersionFlag / 1 ===1" type="info" style="width:100%;margin-top: 5px" @click="toSettingparameters">设置参数</van-button>
                <van-button v-if="VersionFlag / 1 ===1"  type="info" style="width:100%;margin-top: 5px" @click="autoRegister">自动注册</van-button>

            </van-cell-group>
          </div>
        </van-popup>
        <van-dialog
        v-model="showName"
        title="修改通道状态"
        show-cancel-button
        close-on-popstate
        :before-close="beforeCloseName"
        >
        <div style="margin-left:10px">修改通道昵称</div>
            <van-field v-model.trim="form.localName" placeholder="请输入通道名称" :error-message="nameErr" />
        <div style="margin-left:10px">修改通道状态</div>
        <div style="margin-top:10px;margin-left:10px;margin-bottom:10px">
            <van-radio-group direction="horizontal" v-model="form.type">
              <van-radio :name='0' >入口</van-radio>
              <van-radio :name='1' >出口</van-radio>
              <van-radio :name='2' >不区分</van-radio>
            </van-radio-group>
        </div>

        </van-dialog>
    </div>
</template>

<script>
import { SwipeCell, NoticeBar, ActionSheet, Button, RadioGroup, Radio, Tag, Dialog } from 'vant'
import { unBindAICamera, getAICamera, editAICameraName, opendoor, isNewVersion } from '@/api/url'
import { checkDataArr, inOutFormatter, isBindFormatter, timeFormatter, networkTypeFormatter } from '@/utils/formatter'
import { Storage } from '@/utils/storage'
import Intro from '@/utils/intro'
export default {
  components: {
    'van-swipe-cell': SwipeCell,
    'van-notice-bar': NoticeBar,
    [ActionSheet.name]: ActionSheet,
    vanButton: Button,
    vanRadioGroup: RadioGroup,
    vanRadio: Radio,
    vanTag: Tag,
    [Dialog.Component.name]: Dialog.Component
  },
  data () {
    return {
      VersionFlag: undefined,
      VersionFlag1: undefined,
      accessstatus: undefined,
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      listData: [],
      finished: false,
      listLoading: false,
      error: false,
      infoData: {},
      show: false,
      inOutFormatter,
      isBindFormatter,
      timeFormatter,
      networkTypeFormatter,
      showName: false,
      nameErr: '',
      form: {
        type: '',
        localName: '',
        id: undefined
      },
      showMenu: false,
      actions: [
        { name: '设置wifi' },
        { name: '设置参数' }
      ],
      actions1: [
        { name: '设置wifi' }
      ]
    }
  },
  mounted () {
    this.showHelp()
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  methods: {
    // 设置参数
    toSettingparameters () {
      this.$dialog.confirm({
        title: '提示',
        message: '非技术人员请勿操作'
      }).then(() => {
        this.$router.push({ path: '/setParameters/',
          query: {id: this.infoData.id, VersionFlag: this.VersionFlag, tcpVersion: this.infoData.tcpVersion
          }})
      }).catch(() => { })
    },
    // 修改密码
    toChangePassword () {
      this.$router.push({ path: '/setParameters/',
        query: {id: this.infoData.id, VersionFlag: this.VersionFlag, tcpVersion: this.infoData.tcpVersion, showName: 'sys_pwd'
        }})
    },
    autoRegister () {
      this.$router.push({ path: '/setParameters/',
        query: {id: this.infoData.id, VersionFlag: this.VersionFlag, tcpVersion: this.infoData.tcpVersion, showName: 'reg_mode'
        }})
    },
    // 点击一键开闸
    switchingOff (mac) {
      Dialog.confirm({
        title: '提示',
        message: '确定要开闸吗？'
      }).then(() => {
        return this.$http.get(opendoor + mac)
      }).then((res) => {
        this.$toast.success('开闸成功')
      }).catch(() => {
        this.$toast.error('开闸失败')
      })
    },
    toDepartment () {
      this.$router.push({ path: '/modifyDepartment',
        query: {
          mac: this.infoData.mac
        }})
    },
    showHelp () {
      if (Storage.get('equipmentShowHelp')) return
      Intro.setOptions({
        steps: [
          {
            element: '#step1 .van-button__text',
            intro: '设置wifi功能在这儿',
            position: 'top'
          }
        ]
      })
      this.$nextTick(() => {
        Intro.start()
        // 退出引导回调
        Intro.onexit(function () {
          Storage.set('equipmentShowHelp', 1)
        })
      })
    },
    onSelect (item, index) {
      // console.log(item.name, index)
      if (index === 0) {
        this.$router.push('/bindWifi/')
      }
      if (index === 1) {
        this.$dialog.confirm({
          title: '提示',
          message: '非技术人员请勿操作'
        }).then(() => {
          this.$router.push({ path: '/setParameters/', query: {VersionFlag: this.VersionFlag1} })
        }).catch(() => { })
      }
    },
    async showInfo (data) {
      let res = await this.$http.get(isNewVersion + data.id)
      this.VersionFlag = res.code
      this.infoData = data
      this.show = true
    },
    async showInfo1 () {
      let index = 0
      this.listData.forEach((item, index) => {
        if (item.tcpVersion.indexOf('12-14') < 0) {
          index++
        }
      })
      if (index > 0) {
      } else {
        if (this.listData.length > 0) {
          let res = await this.$http.get(isNewVersion + this.listData[0].id)
          this.VersionFlag1 = res.code
        }
      }
    },
    toSetDev () {
      this.$router.push('/scan/add/')
    },
    fetchData () {
      this.$http.get(getAICamera, {params: this.listQuery}).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.listData = this.listData.concat(res.data.rows)
          this.showInfo1()
          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    handleRemoveBind (id, index) {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定解绑吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.put(unBindAICamera + '/' + id)
          .then(res => {
            ToastLoading.clear()
            this.listData.splice(index, 1)
            this.$toast.success(res.message)
          }).catch(() => { ToastLoading.clear() })
      }).catch(() => {})
    },
    onshowName (item) {
      // console.log(item)
      this.form.type = item.type
      this.form.localName = item.localName
      this.form.id = item.id
      this.showName = true
    },
    beforeCloseName (action, done) {
      if (action === 'confirm') {
        if (this.nameVal === '') {
          this.nameErr = '不能为空'
          done(false)
          return
        }
        this.submitName(done)
      } else {
        this.nameErr = ''
        done()
      }
    },
    submitName (done) {
      this.nameErr = ''
      this.$http.put(editAICameraName, this.form).then(res => {
        this.listQuery.offset = 1
        this.listData = []
        this.fetchData()
        done()
      }).catch(() => { done(false) })
    }
  },
  beforeDestroy () {
    Intro.exit()
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 75px;
  /deep/ .van-popup--center {
    border-radius: 5px;
  }
}
.infobox {
  width: 300px;
}
.btnbox {
    width: 100%;
    padding: 0 15px 15px;
    position: fixed;
    bottom: 0;
    left: 0;
}
.tip {
  padding: 15px;
  padding-bottom: 0;
}
</style>
