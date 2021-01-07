<template>
  <div class="theme-face-home">
    <div class="other-body">
      <div class="other-name">
        <div class="other-body-left"><img src="@/assets/icon/wx/recordBox/icon-GPS.png"/></div>
        <div class="other-body-right" @click="handleScan()"><img src="@/assets/icon/wx/recordBox/icon-scan.png"/></div>
        <div @click="handleSwitch()">{{depInfo.departmentName !== undefined ? depInfo.departmentName : '请选择学校'}}</div>
      </div>
      <div v-transfer-dom>
        <popup v-model="showSwitch">
          <div class="switch-body">
            <div class="switch-dep"><span style="margin-right: 1rem">当前:</span>{{depInfo.departmentName !== undefined ? depInfo.departmentName : '无'}}</div>
            <div class="switch-tip">请选择切换的学校:</div>
            <search
              class="switch-search"
              @result-click="handleSearchResultClick"
              @on-change="handleSearchChange"
              :results="searchData"
              v-model="searchText"
              :auto-fixed="false"
              auto-scroll-to-top
              @on-focus="handleSearchFocus"
              @on-cancel="handleSearchCancel"
              @on-submit="handleSearchSubmit"
              ref="search"></search>
            <panel v-show="searchData.length > 0" type="3" header="搜索结果" :list="searchData" @on-click-item="handleClickSearchItem"></panel>
            <group title="最近访问" style="margin-top: 2rem">
              <div v-for="(item, index) in switchList" :key="item.departmentId">
                <p :class="activeStyle(index)" v-if="item.type === 1" @click="handleSwitchDep(item)">
                  <span>{{item.departmentName}}</span>
                  <span v-if="item.province && item.city" class="switch-addr">({{item.province.replace('省', '')}}-{{item.city.replace('市', '')}})</span>
                  <img v-if="item.current === 0" src="@/assets/icon/wx/icon-switch.png"/>
                  <img v-if="item.current === 1" src="@/assets/icon/wx/icon-curr.png"/>
                </p>
              </div>
            </group>
            <div class="switch-return" @click="showSwitch = false">返回</div>
          </div>
        </popup>
      </div>
    </div>
    <div class="adv-body body">
      <swiper :list="advList" :auto="true"></swiper>
    </div>
    <cell title="通知" :border-intent="false" v-if="list.length != 0">
      <marquee>
        <marquee-item v-for="(i, t) in list" :key="t" @click.native="onClick">{{i.title}}</marquee-item>
      </marquee>
    </cell>
    <div class="fun-body body" v-if="menuLoading">
      <!-- 垂直 - 类型 -->
      <flexbox orient="vertical">
        <flexbox-item v-for="k in funType" :key="k.type">
          <!-- 横向 - 背景 -->
          <flexbox :class="funBackStyle(k.type)">
            <!-- 横向 - 类型说明 -->
            <flexbox-item :span="1/5" class="fun-type">
              <div class="fun-type-text">{{k.name}}</div>
            </flexbox-item>
            <flexbox-item :span="4/5">
              <!-- 横向 - 功能按钮 -->
              <flexbox :gutter="0" wrap="wrap">
                <template v-for="i in fun">
                  <flexbox-item :span="1/3" :key="i.id" v-if="i.type == k.type" :style="tip.show?'z-index: 10001;':''">
                    <div class="fun-box" @click="handleClickFun(i)" v-show="!tip.show">
                      <div class="fun-box-img"><img slot="icon" :src="i.img"></div>
                      <div class="fun-box-text">{{i.title}}</div>
                    </div>
                    <popover placement="top" v-show="tip.show">
                      <div slot="content" class="item-tip">
                        <div v-if="filterTip(i.id)">{{i.tip}}</div>
                        <div v-else>暂无功能介绍</div>
                      </div>
                      <div class="fun-box" ref="itemtip">
                        <div class="fun-box-img"><img slot="icon" :src="i.img"></div>
                        <div class="fun-box-text">{{i.title}}</div>
                      </div>
                    </popover>
                  </flexbox-item>
                </template>
              </flexbox>
            </flexbox-item>
          </flexbox>
        </flexbox-item>
      </flexbox>
    </div>
    <div style="height:4rem"></div>
    <tabbar class="menu-body">
      <tabbar-item class="menu-text" link="/faceAI/userModel/" :selected="true">
        <img class="menu-icon" slot="icon" src="@/assets/icon/wx/menu-home.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item class="menu-text" link="/faceAI/myInfo/">
        <img class="menu-icon" slot="icon" src="@/assets/icon/wx/menu-user.png">
        <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar>
    <!-- 功能介绍遮罩层 -->
    <div class="box-fixed" v-show="tip.show">
      <div class="tip-img tip-img-next" @click="tipNextClick">
        <img src="@/assets/icon/wx/tip-next.png"/>
        <span>下一步</span>
      </div>
      <div class="tip-img tip-img-success" @click="tipSuccessClick">
        <img src="@/assets/icon/wx/tip-success.png"/>
        <span>关闭</span>
      </div>
    </div>
    <!-- // 开发环境下使用的二维码开发调试 -->
    <div v-if="qrcodeConfig.isDev" class="qrcode-content">
      <button @click="qrcodeConfig.isQRcodeShow = !qrcodeConfig.isQRcodeShow" class="qrcode-button">{{qrcodeConfig.isQRcodeShow?'关闭':'打开'}}dev二维码</button>
      <div class="qrcode"  v-show="qrcodeConfig.isQRcodeShow">
        <QRcode :value="qrcodeConfig.value" :size="qrcodeConfig.size" level="H"></QRcode>
      </div>
    </div>
  </div>
</template>
<script>
// import advSign from '@/assets/icon/wx/face-home-sign.jpg'
// import advFace from '@/assets/icon/wx/face-home-adv.jpg'
// import advFace2 from '@/assets/icon/wx/face-home-adv2.jpg'
import advSign from '@/assets/aaa/1.jpg'
import advFace from '@/assets/aaa/2.jpg'
import advFace2 from '@/assets/aaa/3.jpg'
import { httpGet, httpPost } from '@/utils/restful'
import { getMenu, switchUnion, searchUnion, switchSearchUnion, getNotice } from '@/api/url.js'
import { setMenuInfo, getMenuInfo, getFaceInfo, getWxInfo, setDepInfo, getDepInfo } from '@/utils/userInfo.js'
import { funBlock, funType, getDefaultFun } from '@/utils/funAble.js'
import { formatterTime2, timeFormatterDayEnd } from '@/utils/formatter.js'
import { Tabbar, TabbarItem, Flexbox, FlexboxItem, Swiper, TransferDom, Popup, Cell, Search, Panel, Group, Popover, Marquee, MarqueeItem } from 'vux'
import QRcode from 'qrcode.vue'// 引入 二维码组件
export default {
  directives: {
    TransferDom
  },
  components: {
    Tabbar,
    TabbarItem,
    Flexbox,
    FlexboxItem,
    Swiper,
    Popup,
    Search,
    Panel,
    Group,
    Popover,
    Marquee,
    MarqueeItem,
    Cell,
    QRcode
  },
  data () {
    return {
      depInfo: {},
      fun: getDefaultFun(),
      funType: funType,
      defParams: {},
      menuLoading: false,
      showSwitchTip: false,
      showSwitch: false,
      searchText: '',
      searchData: [],
      switchList: [],
      list: [],
      advList: [{
        url: '/faceAI/sign/',
        img: advSign,
        title: ''
      }, {
        url: 'javascript:',
        img: advFace,
        title: ''
      },
      // {
      //   url: 'javascript:',
      //   img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg', // 404
      //   title: '测试图3',
      //   fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
      // },
      {
        url: 'javascript:',
        img: advFace2,
        title: ''
      }],
      tip: {
        index: 0,
        show: false
      },
      // QRcode 配置
      qrcodeConfig: {
        isDev: false,
        isQRcodeShow: false,
        value: window.location.origin,
        // value: 'https://s.bolink.club/unionapi/t?p=13188',
        size: 200
      }
    }
  },
  mounted () {
    let menuInfo = getMenuInfo()
    if (menuInfo) {
      // 缓存数据快速回显
      this.fun = menuInfo
    }
    this.depInfo = getDepInfo()
    this.defParams = {
      departmentId: this.depInfo.departmentId,
      account: getWxInfo().account,
      unicode: getWxInfo().unicode
    }
    if (this.defParams.departmentId && this.defParams.departmentId !== undefined) {
      this.getMenu()
    } else {
      if (!(this.fun && this.fun.length > 0)) {
        this.fun = getDefaultFun()
      }
      this.menuLoading = true
    }
    this.loadSwitch()
  },
  created () {
    this.getNotify()
    if (process.env.NODE_ENV === 'development') {
      console.log('正在验证开发环境: .... ', process.env.NODE_ENV)
      this.qrcodeConfig.isDev = true
    } else {
      console.log('正在验证生产环境: .... ', process.env.NODE_ENV)
      this.qrcodeConfig.isDev = false
    }
  },
  methods: {
    getNotify () {
      if (getDepInfo() && getDepInfo().departmentId) {
        httpGet(getNotice + '/' + getDepInfo().departmentId)
          .then((res) => {
          // console.log(res)
            this.list = res.data
          }).catch(() => {})
      }
    },
    filterTip (id) {
      let arr = [1, 0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
      return arr.includes(id)
    },
    onClick () {
      this.$router.push({path: '/faceAI/msg/'})
    },
    getMenu () {
      if (this.defParams.account) {
        let self = this
        // console.log('请求数据： ', self.defParams)

        httpGet(getMenu, self.defParams).then(res => {
          console.log('菜单：', res.data)
          // 用户保存到的菜单信息
          self.fun = []
          let array = res.data.menus
          for (let i = 0; i < array.length; i++) {
            if (array[i] && array[i] > 0 && array[i] - 1 < funBlock.length) {
              self.fun.push(funBlock[(array[i] - 1)])
            }
          }
          console.log(333, self.fun)
          // 如果有绑定了的部门,默认添加一个定制功能菜单,用来管理菜单
          let index1 = -1
          let index2 = -1
          let index3 = -1
          let index4 = -1
          let index5 = -1
          // 如果有绑定了的部门,默认添加一个定制功能菜单,用来管理菜单
          self.fun.forEach((item, index) => {
            if (item.id === funBlock[0].id) {
              index1 = index
            } else if (item.id === funBlock[3].id) {
              index2 = index
            } else if (item.id === funBlock[4].id) {
              index3 = index
            } else if (item.id === funBlock[5].id) {
              index4 = index
            } else if (item.id === funBlock[6].id) {
              index5 = index
            }
          })
          if (index5 === -1) {
            self.fun.unshift(funBlock[6])
          }
          if (index4 === -1) {
            self.fun.unshift(funBlock[5])
          }
          if (index2 === -1) {
            self.fun.unshift(funBlock[3])
          }
          if (index3 === -1) {
            self.fun.push(funBlock[4])
          }
          if (index1 === -1) {
            self.fun.unshift(funBlock[0])
          }
          setMenuInfo(self.fun)
          this.menuLoading = true
        }).catch((err) => {
          console.log('菜单加载失败', err)

          // 如果有绑定了的部门,默认添加一个定制功能菜单,用来管理菜单
          // self.fun.push(funBlock[4])
          self.$vux.toast.text('菜单加载失败', 'bottom')
          self.fun = getDefaultFun()
          setMenuInfo(self.fun)
          this.menuLoading = true
        })
      } else {
        this.fun = funBlock
        this.$vux.toast.text('开启测试模式中', 'bottom')
      }
    },
    handleClickFun (info) {
      if (info) {
        // 没有部门编号强制选择部门
        if (!this.defParams.departmentId) {
          this.handleSwitch()
          return
        }
        switch (info.id) {
          case 1:
            // 记录查询
            this.$router.push({path: '/faceAI/inOut/'})
            break
          case 2:
            // 个人信息
            this.$router.push({path: '/faceAI/myInfo/'})
            break
          case 3:
            // 消息中心
            this.$router.push({path: '/faceAI/msg/'})
            break
          case 4:
            // 人脸绑定
            // this.$router.push({path: '/faceAI/bind/'})
            // 账户管理
            this.$router.push({path: '/faceAI/userAdmin/'})
            // let self = this
            // this.$vux.confirm.show({
            //   // 组件除show外的属性
            //   title: '人脸绑定',
            //   placeholder: '预激活码可通过学校/公司/小区管理获得',
            //   confirmText: '激活',
            //   showInput: true,
            //   onShow () {
            //     self.$vux.confirm.setInputValue('')
            //   },
            //   onCancel () {
            //   },
            //   onConfirm (value) {
            //     let params = Object.assign(self.defParams, {faceID: value})
            //     httpPost(bindFace, params).then(res => {
            //       self.$vux.toast.text('绑定成功', 'bottom')
            //       if (!self.defParams.departmentId) {
            //         self.defParams.departmentId = res.data
            //         // 重新从登录页进入
            //         let host = process.env.API_HOST
            //         let redirectUrl = encodeURIComponent(host + 'view/faceAI/userLogin/?account=' + self.defParams.account)
            //         window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + self.defParams.account + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_base'
            //       } else {
            //         // 重新加载切换列表
            //         this.loadSwitch()
            //       }
            //     }).catch(() => {
            //       self.$vux.toast.text('绑定失败', 'bottom')
            //     })
            //   }
            // })
            break
          case 5:
            // 定制功能
            this.$router.push({path: '/faceAI/menu/'})
            break
          case 6:
            // 资料上传
            // this.$router.push({path: '/faceAI/upload/'})
            this.$router.push({path: '/faceAI/userModel/bind/zhLogin/'})
            break
          case 8:
            // 来访申请
            let enableTime = new Date()
            let overdueTime = new Date(enableTime.getTime() + 1 * 24 * 60 * 60 * 1000)
            this.$router.push({path: '/faceAI/userModel/bind/addUser/', query: {cyFaceId: getFaceInfo().cyFaceId, wxUserId: getFaceInfo().wxUserId, depId: getDepInfo().departmentId, type: 1, ot: timeFormatterDayEnd(overdueTime), et: formatterTime2(enableTime)}})
            break
          case 7:
            // 账户认证
            this.$router.push({path: '/faceAI/auth/'})
            break
          case 9:
            // 绑定管理
            this.$router.push({path: '/faceAI/userModel/bind/manager/'})
            break
          case 10:
            // 功能介绍
            this.tip.show = true
            this.tip.index = 0
            this.$refs.itemtip[0].click()
            break
          case 11:
            // 操作说明
            this.$router.push({path: '/faceAI/userModel/bind/instructionBook/'})
            break
          case 12:
            // 操作说明
            this.$router.push({path: '/faceAI/edit/'})
            break
          case 13:
            // 操作说明
            this.$router.push({path: '/faceAI/list/'})
            break
        }
      }
    },
    handleSwitch () {
      this.showSwitch = true
    },
    handleScan () {
      // 扫一扫方法
    },
    handleSwitchDep (item) {
      // console.log(item)
      if (item.current === 1) {
        // this.$vux.toast.text('已经是选中的部门,无需切换', 'bottom')
        this.showSwitch = false
        return
      }
      let params = Object.assign(this.defParams, {departmentId: item.departmentId})
      // console.log(params)
      httpPost(switchUnion, params).then(res => {
        if (res.data === 5) { // data 为模式 1 小区物业  2 集团公司  3 学校  4 通用  5 工地模式  7 新考勤项目
          localStorage.setItem('themeType', 5)
        } else {
          localStorage.setItem('themeType', 111)
        }
        // 重新加载
        // 重新从登录页进入
        this.depInfo.departmentId = item.departmentId
        this.depInfo.departmentName = item.departmentName
        // this.depInfo.themeType = item.themeType
        setDepInfo(this.depInfo)
        // 切换部门!!!
        this.defParams.departmentId = item.departmentId
        // 重新加载数据
        this.getMenu()
        this.loadSwitch()
        this.showSwitch = false
      }).catch(() => {
        this.$vux.toast.text('切换失败', 'bottom')
        this.showSwitch = false
      })
    },
    loadSwitch () {
      // console.log(999999, this.defParams, this.depInfo.departmentId, getWxInfo().unicode, getWxInfo().account)
      httpGet(switchUnion, this.defParams).then(res => {
        this.switchList = res.data
        if (res.data.length >= 2) {
          // 可以进行切换
          this.showSwitchTip = true
        }
      }).catch(() => {})
    },
    // 切换样式
    activeStyle (index) {
      let i = index % 5
      if (i === 0) {
        return 'switch-p blue mybox'
      } else if (i === 1) {
        return 'switch-p green mybox'
      } else if (i === 2) {
        return 'switch-p orange mybox'
      } else if (i === 3) {
        return 'switch-p grey mybox'
      } else if (i === 4) {
        return 'switch-p red mybox'
      }
    },
    funBackStyle (type) {
      if (type === 1) {
        return 'fun-main fun-main-type1'
      } else if (type === 2) {
        return 'fun-main fun-main-type2'
      } else {
        return 'fun-main fun-main-type3'
      }
    },
    handleSearchResultClick (item) {
      this.handleClickSearchItem(item)
    },
    handleSearchChange (val) {
      if (!val) {
        // 输入为空
        this.searchData = []
        this.searchText = ''
        return
      }
      let tempVal = val
      let self = this
      this.searchText = val
      this.searchData = []
      setTimeout(function () {
        if (val === self.searchText) {
          httpGet(searchUnion + tempVal).then(res => {
            if (res.data && res.data.rows) {
              let result = res.data.rows
              for (let i = 0; i < result.length; i++) {
                let info = {
                  title: result[i].departmentName + (result[i].province && result[i].city ? '<span style="font-size: .75rem; margin-left: 0.5rem">(' + result[i].province.replace('省', '') + '-' + result[i].city.replace('市', '') + ')</span>' : ''),
                  name: result[i].departmentName,
                  id: result[i].id
                  // themeType: result[i].themeType
                }
                self.searchData.push(info)
              }
            }
          }).catch(() => {})
        }
      }, 500)
    },
    handleSearchFocus () {
    },
    handleSearchCancel () {
    },
    handleSearchSubmit () {
    },
    handleClickSearchItem (item) {
      // console.log(item)
      let params = {
        departmentId: item.id,
        account: getWxInfo().account,
        unicode: getWxInfo().unicode
      }
      // 选中搜索出来的列
      httpGet(switchSearchUnion, params).then(res => {
        let val = {
          departmentId: item.id,
          departmentName: item.name
          // themeType: item.themeType
        }
        this.handleSwitchDep(val)
      }).catch(() => {})
    },
    tipNextClick () {
      let tips = this.$refs.itemtip
      if (this.tip.index === tips.length - 1) {
        this.tip.index = 0
      } else {
        this.tip.index = this.tip.index + 1
      }
      tips[this.tip.index].click()
    },
    tipSuccessClick () {
      this.tip.show = false
    }
  }
}
</script>
<style lang='scss' scoped>
.switch-body {
  height: 40rem;
  background-color: #fff;
  padding: 1rem .625rem 1.875rem;
  position: relative;
  .switch-dep {
    font-size: .875rem;
    letter-spacing: .0625rem;
  }
  .switch-tip {
    font-size: .875rem;
    letter-spacing: .0625rem;
    padding: .3125rem 0;
  }
  .switch-p {
    margin: 0.75rem .3125rem;
    height: 1.5rem;
    width: auto;
    padding: .625rem 1.25rem;
    span {
      display: block;
      height: 1.5rem !important;
      line-height: 1.5rem !important;
      width: auto;
      float: left;
    }
    img {
      height: 1.5rem;
      float: right;
    }
  }
  .switch-addr {
    font-size: .75rem;
  }
  .switch-return {
    position: fixed;
    bottom: 0;
    left: 10%;
    width: 80%;
    text-align: center;
    padding: .3125rem;
    margin: .625rem 0;
    border: 1px solid #dfdfdf;
    border-radius: .3125rem;
  }
}
.theme-face-home {
  height: 100%;
  min-height: 100%;
  background-color: rgb(245, 255, 255);
}
.body {
  padding: 1% 2%;
  width: 96%;
  clear: both;
  color: #5c5c5c;
}
.box-marquee {
  margin-top: -1rem !important;
}
.weui-cell {
  // background-color: #fff;
  background-image:
  // linear-gradient(180deg, rgba(255, 255, 255, .5) 0%, #fff 20%, #fff 80%, rgba(255, 255, 255, .5) 100%),
  linear-gradient(90deg, rgba(255, 255, 255, .5) 0%, #fff 5%, #fff 95%, rgba(255, 255, 255, .5) 100%);
  text-align: left;
  &:before {
    border: none
  }
}
.fun-body {
  margin: .125rem 0 0rem;
  .fun-box {
    text-align: center;
    height: 4.5rem;
    font-size: .875rem;
    margin: 5px !important;
    background-color: #fff;
    padding: .3125rem;
    border: 1px solid #dfdfdf;
    border-radius: .3125rem;
    .fun-box-img {
      margin: 0 auto;
      img {
        width: 40px;
        height: 40px;
        margin-top: .25rem;
      }
    }
  }
}
.fun-main {
  min-height: 6rem;
  padding: .3125rem 3%;
  width: 94%;
  color: #5c5c5c;
  border-radius: .625rem;
  background-size: 100% 100% !important;
}
.fun-main-type1 {
  background-image: url('./../../../assets/icon/wx/fun/1.png');
}
.fun-main-type2 {
  background-image: url('./../../../assets/icon/wx/fun/2.png');
}
.fun-main-type3 {
  background-image: url('./../../../assets/icon/wx/fun/3.png');
}
.fun-type {
  position: relative;
  height: 4.5rem;
  .fun-type-text {
    position: absolute;
    left: 2%;
    width: 1.5rem;
    font-size: 1.5rem;
    letter-spacing: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    background-color: #fff;
    padding: 0.75rem;
    border: 1px solid #dfdfdf;
    border-radius: .3125rem;
    font-size: 1.25rem;
  }
}
.adv-body {
  margin-top: .625rem;
  .adv-title {
    font-size: 12px;
    font-weight: bold;
    text-align: left;
    padding: .3125rem .9375rem;
  }
  .vux-slider {
    border-radius: .5rem;
  }
}
.other-body {
  margin-top: 1%;
  text-align: left;
  background-color: #fff;
  padding: 1% 0;
  border-bottom: 1px solid rgb(235, 235, 235);
  .other-name {
    padding: .4375rem .625rem;
    .other-body-left {
      float: left;
      padding-right: 1rem;
      img {
        height: 24px;
      }
    }
    .other-body-right {
      float: right;
      padding-right: 1rem;
      img {
        height: 24px;
      }
    }
  }
}
.vux-swiper-desc {
  background-image: none !important;
}
.menu-icon {
  width: 32px;
  height: 32px;
  margin: 0 -10px;
}
.menu-text {
  text-decoration: none !important;
  text-align: center;
}
.box-fixed {
  position: fixed;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  background-color: rgba(153, 153, 153, 0.5);
  z-index: 10000;
  .tip-img {
    position: fixed;
    padding: .0625rem .625rem;
    border: .0625rem solid rgb(120, 219, 235);
    border-radius: .3125rem;
    background-color: rgb(242, 252, 252);
    z-index: 10001;
    width: 3rem;
    span {
      font-size: .75rem;
      width: 2.5rem;
      color: rgb(120, 219, 235);
    }
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  .tip-img-next {
    bottom: 0.5rem;
    right: 6rem;
  }
  .tip-img-success {
    bottom: 0.5rem;
    right: 1rem;
  }
}
.item-tip {
  padding: .25rem;
}

.qrcode-content{
  .qrcode-button{
    position: absolute;
    color: red;
    left: 0;
    bottom: 60px;
    height: 30px;
    padding:2px 10px;

  }
  .qrcode{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate( -50%, -50%);
    z-index: 11111111;
  }

}
</style>

<style>
.vux-popover {
  z-index: 10002 !important;
}
</style>
