<template>
  <div class="bgc-grey full-height">
    <van-swipe :autoplay="3000" indicator-color="white" :height="180">
      <van-swipe-item v-for="(item, index) in imgList" :key="index">
        <van-image :src="item.img" class="full-img" />
      </van-swipe-item>
    </van-swipe>
    <van-notice-bar text="欢迎使用智能门禁考勤" left-icon="volume-o" mode="closeable" />
    <section class="nav-menu bgc">
      <div class="swiper-container">
      <div class="swiper-wrapper">
      <van-grid class="swiper-slide" clickable :border="false">
        <van-grid-item
          :icon="shiftsIcon"
          text="班次管理"
          to="/shifts/"
          class="gridItem"
          :data-step="homeSteps.shifts.step"
          :data-intro="homeSteps.shifts.intro"
          :data-position="homeSteps.shifts.position"
          :data-disable-interaction="true"
        />
        <van-grid-item
          class="gridItem"
          :icon="attendGroupInIcon"
          text="考勤组管理"
          to="/attendGroup/"
          :data-step="homeSteps.attendGroup.step"
          :data-intro="homeSteps.attendGroup.intro"
          :data-position="homeSteps.attendGroup.position"
          :data-disable-interaction="true"
        />
        <van-grid-item
          class="gridItem"
          :icon="attendCountIcon"
          text="考勤统计"
          to="/attendCount/"
          :data-step="homeSteps.attendCount.step"
          :data-intro="homeSteps.attendCount.intro"
          :data-position="homeSteps.attendCount.position"
          :data-disable-interaction="true"
        />
        <van-grid-item
          class="gridItem"
          :icon="writeOffIcon"
          text="审批记录"
          to="/writeOff/"
          :data-step="homeSteps.writeOff.step"
          :data-intro="homeSteps.writeOff.intro"
          :data-position="homeSteps.writeOff.position"
          :data-disable-interaction="true"
        />
        <!-- <van-grid-item
          class="gridItem"
          :icon="againPunchInIcon"
          text="申请管理"
          to="/againPunchIn/"
          :data-step="homeSteps.punchIn.step"
          :data-intro="homeSteps.punchIn.intro"
          :data-position="homeSteps.punchIn.position"
          :data-disable-interaction="true"
        /> -->
        <van-grid-item
          class="gridItem"
          :icon="departmentInIcon"
          text="部门管理"
          to="/department/"
          :data-step="homeSteps.department.step"
          :data-intro="homeSteps.department.intro"
          :data-position="homeSteps.department.position"
          :data-disable-interaction="true"
        />
        <van-grid-item
          class="gridItem"
          :icon="userIcon"
          text="成员管理"
          to="/user/"
          :data-step="homeSteps.user.step"
          :data-intro="homeSteps.user.intro"
          :data-position="homeSteps.user.position"
          :data-disable-interaction="true"
        />
        <van-grid-item
          class="gridItem"
          :icon="visitorIcon"
          text="访客管理"
          to="/visitor/"
          :data-step="homeSteps.visitor.step"
          :data-intro="homeSteps.visitor.intro"
          :data-position="homeSteps.visitor.position"
          :data-disable-interaction="true"
        />
                <van-grid-item
          class="gridItem"
          :icon="accessRecordsIcon"
          text="进出记录"
          to="/accessRecords/"
          :data-step="homeSteps.accessRecords.step"
          :data-intro="homeSteps.accessRecords.intro"
          :data-position="homeSteps.accessRecords.position"
          :data-disable-interaction="true"
        />
      </van-grid>
      <van-grid class="swiper-slide" clickable :border="false">
                <van-grid-item
          v-if="this.$store.getters.departmentId === 9573"
          class="gridItem"
          :icon="attendanceAbnormalIcom"
          text="设备解绑"
          to="/attendanceAbnormal/"
          :data-step="homeSteps.attendanceAbnormal.step"
          :data-intro="homeSteps.attendanceAbnormal.intro"
          :data-position="homeSteps.attendanceAbnormal.position"
          :data-disable-interaction="true"
        />
      </van-grid>
      </div>
      <div class="swiper-pagination"></div>
    </div>
      <!-- <div class="text-c fc-grey">更多<van-icon name="arrow-down" /></div> -->
    </section>
    <!-- 首页工具列表 -->
    <!-- <section class="home-nav-tools-list">
      <div class="nav-tools-slide">
        wg 卡
        <div class="nav-tools-item"><WgCard /></div>
      </div>
    </section>-->
    <section class="summary">
      <div>
        <van-divider
          content-position="left"
          :style="{ color: '#000', borderColor: '#ccc', padding: '0 16px' }"
        >
          <span class="title">考勤汇总</span>
          <!-- <van-tag type="primary" class="tag" @click="showTagPicker">
            {{ tagval }}
            <van-icon name="arrow-down" />
          </van-tag> -->
          <van-tag type="primary" class="tag">
            昨日
          </van-tag>
        </van-divider>
      </div>
      <van-grid style="background:#f6f6f6"  :border="false" :column-num="2" :gutter="10">
        <van-grid-item @click="exceptionDetails(1)">
          <div class="num mar-b-10 yellow">{{ beginNoPunchCard - 0 + (endNoPunchCard - 0) }}</div>
          <p class="fc-grey">缺卡</p>
        </van-grid-item>
        <van-grid-item @click="exceptionDetails(2)">
          <div class="num mar-b-10 warning">{{ lateNum }}</div>
          <p class="fc-grey">迟到</p>
        </van-grid-item>
        <van-grid-item @click="exceptionDetails(3)">
          <div class="num mar-b-10 danger">{{ leaveEarlyNum }}</div>
          <p class="fc-grey">早退</p>
        </van-grid-item>
        <van-grid-item @click="exceptionDetails(4)">
          <div class="num mar-b-10 fc-grey">{{ absenteeismDay }}</div>
          <p class="fc-grey">旷工</p>
        </van-grid-item>
      </van-grid>
      <div style="height:1rem;background:#f6f6f6"></div>
    </section>
    <!-- <section>
          <van-divider content-position="left" :style="{ color: '#000', borderColor: '#ccc', padding: '0 16px' }">考勤异常记录</van-divider>
    </section>-->
    <van-popup v-model="showPicker" position="bottom" safe-area-inset-bottom>
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
    <!-- <div style="height:1rem"></div> -->

    <!-- 开发时使用 -->
    <div v-if="qrcodeData.isDev" class="dev-qrcode">
      <div class="qrcode-box" v-show="qrcodeData.qrcodeShow">
        <QRcode :value="qrcodeData.value" :size="qrcodeData.size"></QRcode>
      </div>
      <button @click="qrcodeData.qrcodeShow = !qrcodeData.qrcodeShow" class="qrcode-btn">点开开发二维码</button>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import {
  Swipe,
  SwipeItem,
  Tag,
  Grid,
  GridItem,
  Picker,
  Divider,
  NoticeBar
} from 'vant'
import { statistical } from '@/api/url'
import adv2 from '@/assets/ad/home-adv2.jpg'
import againPunchInIcon from '@/assets/icon/home/againPunchIn-icon.png'
import attendCountIcon from '@/assets/icon/home/attendCount-icon.png'
import attendGroupInIcon from '@/assets/icon/home/attendGroup-icon.png'
import departmentInIcon from '@/assets/icon/home/department-icon.png'
import shiftsIcon from '@/assets/icon/home/shifts-icon.png'
import userIcon from '@/assets/icon/home/user-icon.png'
import writeOffIcon from '@/assets/icon/home/writeOff-icon.png'
import visitorIcon from '@/assets/icon/home/visitor-icon.png'
import accessRecordsIcon from '@/assets/icon/home/accessRecords-icon.png'
import attendanceAbnormalIcom from '@/assets/icon/home/attendanceAbnormal-icon.png'

import isOS from '@/utils/isOS'
import Intro, { homeSteps } from '@/utils/intro'
import { Session } from '@/utils/storage'
import WgCard from './components/Wgcard'
import QRcode from 'qrcode.vue'

export default {
  components: {
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-tag': Tag,
    'van-grid': Grid,
    'van-grid-item': GridItem,
    [Picker.name]: Picker,
    [Divider.name]: Divider,
    [NoticeBar.name]: NoticeBar,
    QRcode,
    WgCard,
    Swiper
  },
  data () {
    return {
      attendanceAbnormalIcom,
      accessRecordsIcon,
      againPunchInIcon,
      attendCountIcon,
      attendGroupInIcon,
      departmentInIcon,
      shiftsIcon,
      userIcon,
      writeOffIcon,
      visitorIcon,
      imgList: [{ img: adv2 }, { img: adv2 }],
      showPicker: false,
      columns: ['昨日', '上月'],
      tagval: '昨日',
      statisticalQuery: {
        departmentId: this.$store.getters.departmentId,
        beginTime: this.$dayjs()
          .subtract(1, 'days')
          .format('YYYY-MM-DD') + ' 00:00:00',
        endTime: this.$dayjs()
          .subtract(1, 'days')
          .format('YYYY-MM-DD') + ' 23:59:59'
      },
      beginNoPunchCard: 0, // 上班缺卡
      endNoPunchCard: 0, // 下班缺卡
      lateNum: 0, // 迟到
      leaveEarlyNum: 0, // 早退
      absenteeismDay: 0, // 旷工
      homeSteps,
      qrcodeData: {
        isDev: false,
        qrcodeShow: false,
        // value: window.location.origin,
        value: 'http://112.74.50.105/t/index.html?code=68158&type=static',
        size: 200
      }
    }
  },
  created () {
    if (isOS() === 'iOS') {
      // console.log(this.$route.meta.firstLogin)
      if (!this.$route.meta.firstLogin) {
        return
      }
      if (location.href.indexOf('#reloaded') === -1) {
        location.hash = '#reloaded'
        location.reload() // 刷新，避免BUG
        return
      }
    }
    this.getStatistical(this.statisticalQuery)

    /** ********  【 检测当前用户是否在开发环境 】  **********/
    if (process.env.NODE_ENV === 'development') {
      console.log('检测当前用户是在开发环境 。。。。')
      this.qrcodeData.isDev = true
    } else {
      console.log('检测当前用户是在生产环境 。。。。')
      this.qrcodeData.isDev = false
    }
  },
  mounted () {
    this.init()
    window.onresize = () => {
      this.init()
    }
    this.$route.meta.firstLogin = false
    if (this.$route.query.a !== '123') {
    } else {
      if (!localStorage.getItem('start')) {
        this.$nextTick(() => {
          this.$dialog
            .confirm({
              closeOnPopstate: true,
              message: '欢迎使用手机考勤，点击开始新手帮助',
              confirmButtonText: '开始',
              cancelButtonText: '跳过不再提醒'
            })
            .then(() => {
              Intro.start()
              // 退出引导回调
              Intro.onexit(function () {
                Session.set('homeShowHelp', 1)
              })
            })
            .catch(() => {
              localStorage.setItem('start', 1)
            })
        })
      }
    }
  },
  methods: {
    exceptionDetails (type) {
      this.$router.push({path: '/exceptionDetailsPage', query: {type: type}})
    },
    // 初始化swiper
    init () {
      let swiper = new Swiper('.swiper-container', {
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination'
        }
      })
      console.log(swiper)
    },
    getMonthDays (year, month) {
      var thisDate = new Date(year, month, 0) // 当天数为0 js自动处理为上一月的最后一天
      return thisDate.getDate()
    },
    onConfirm (value) {
      // if (value === '今日') {
      //   const statisticalQuery = {
      //     departmentId: this.$store.getters.departmentId,
      //     day: this.$dayjs().format('YYYY-MM-DD')
      //   }
      //   this.getStatistical(statisticalQuery)
      // }
      if (value === '昨日') {
        const statisticalQuery = {
          departmentId: this.$store.getters.departmentId,
          beginTime: this.$dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.$dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD') + ' 23:59:59'
        }
        console.log(statisticalQuery)
        this.getStatistical(statisticalQuery)
      }
      if (value === '上月') {
        let timeList = this.$dayjs().subtract(1, 'M').format('YYYY-MM-DD').split('-')
        let year = timeList[0]
        let month = timeList[1]
        let day = this.getMonthDays(year, month)
        const statisticalQuery = {
          departmentId: this.$store.getters.departmentId,
          beginTime: year + '-' + month + '-01' + ' 00:00:00',
          endTime: year + '-' + month + '-' + day + ' 23:59:59'
        }
        this.getStatistical(statisticalQuery)
      }
      this.tagval = value
      this.showPicker = false
    },
    showTagPicker () {
      this.showPicker = true
    },
    // 汇总
    getStatistical (statisticalQuery) {
      const ToastLoading = this.$toast.loading({
        mask: false,
        message: '加载中...',
        position: 'middle'
      })
      this.$http
        .get(statistical, { params: statisticalQuery })
        .then(res => {
          ToastLoading.clear()
          if (res.data) {
            this.beginNoPunchCard = res.data.beginNoPunchCard || 0
            this.endNoPunchCard = res.data.endNoPunchCard || 0
            this.lateNum = res.data.lateNum || 0
            this.leaveEarlyNum = res.data.leaveEarlyNum || 0
            this.absenteeismDay = res.data.absenteeismDay || 0
          } else {
            this.beginNoPunchCard = 0
            this.endNoPunchCard = 0
            this.lateNum = 0
            this.leaveEarlyNum = 0
            this.absenteeismDay = 0
          }
        })
        .catch(() => {
          ToastLoading.clear()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.gridItem{
  height: 2.2rem;
}
.bgc-grey {
  height: 100%;
  padding-bottom: calc(1.4rem + 3px);
}
.dev-qrcode {
  .qrcode-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .qrcode-btn {
    position: absolute;
    left: 0;
    bottom: 1.4rem;
    padding: 0.2rem;
    border-radius: 15px;
  }
}
.height {
  height: 50px;
}
.blue {
  color: #409eff;
}
.yellow {
  color: #ffcc00;
}
.warning {
  color: #e6a23c;
}
.danger {
  color: #f56c6c;
}
.nav-menu {
  margin: 20px;
  margin-bottom: 0;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.summary {
  padding-bottom: 15px;
  .title {
    font-size: 15px;
  }
  .tag {
    margin-left: 10px;
  }
  .num {
    font-size: 18px;
  }
}
</style>

<style lang="scss" scoped>
/* 首页 home-nav-tools-list 样式表 */
.swiper-wrapper{
  height: 4rem;
}
.swiper-container{
  height: 5rem;
}
.swiper-pagination{
  margin-bottom: 0rem;
}
.home-nav-tools-list {
  background: #fff;
  width: 100% - 10%;
  height: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 0 5px 5px #f1f1f1;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.5rem auto;
  .nav-tools-slide {
    width: auto;
    height: 100%;
    // display: flex;
    // justify-content: flex-start;
    // align-items: center;
    overflow: auto;
    padding: 0.2rem 20px;

    border-radius: 5px;
    box-sizing: border-box;
    // 禁止换行
    white-space: nowrap;
    .nav-tools-item >>> {
      width: 2rem;
      height: 100%;
      border-radius: 8px;
      box-shadow: 0 0 5px 2px rgb(59, 61, 61) inset;
      font-size: 8px;
      font-weight: normal;
      color: #666;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1px;
      box-sizing: border-box;
      display: inline-block;
      margin-right: 0.3rem;
    }
    .nav-tools-item:hover >>> {
      color: rgb(255, 72, 0);
    }
  }
}
</style>
