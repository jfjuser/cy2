<template>
  <div class="logo">
    <transition name="fade">
      <span v-if="isCollapse" class="logo_title is-bold " key="0" :class="{'is-text':!type,'is-img':type}">
        <template v-if="type">
          <i class="fa fa-cloud"></i>
        </template>
      </span>
    </transition>
    <transition-group name="fade">
      <template v-if="!isCollapse">
        <span v-if= "logoFlag" class="logo_title is-bold" key="1">{{sysName}}</span>
        <img v-else :src="imgUrl" alt="logo" key="2">
      </template>
    </transition-group>
  </div>
</template>

<script>
import { getSysName } from '@/utils/cookie.js'
import { httpGet } from '@/utils/restful'
import { LogoUrl } from '@/api/url'
import Logo from '@/assets/logo.png'
export default {
  name: 'logo',
  data () {
    return {
      sysName: '物联云平台',
      imgUrl: Logo,
      logoFlag: false
    }
  },
  props: ['isCollapse'],
  created () {
    this.session()
  },
  computed: {
    type: function (val) {
      return true
    }
  },
  methods: {
    session () {
      if (sessionStorage.getItem('imgUrl') !== null) {
        this.imgUrl = sessionStorage.getItem('imgUrl')
      } else {
        this.getLogo()
      }
    },
    getLogo () {
      document.title = getSysName()
      httpGet(LogoUrl + '/' + this.$store.getters.departmentId)
        .then(res => {
          if (res.data !== null) {
            this.logoFlag = false
            this.imgUrl = 'data:image/jpg;base64,' + res.data
            sessionStorage.setItem('imgUrl', this.imgUrl)
          } else {
            let title = getSysName()
            if (title.length > 6) {
              this.sysName = title.slice(0, 5) + '..'
            } else {
              this.sysName = title
            }
            this.logoFlag = true
          }
        }).catch(() => {
          if (getSysName().length > 6) {
            this.sysName = getSysName().slice(0, 5) + '..'
          } else {
            this.sysName = getSysName()
          }
          this.logoFlag = true
        })
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-active {
  transition: opacity 2.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  line-height: 50px;
  background: #243142;
  color: #fdfdfd;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  box-sizing: border-box;
}
.logo_title {
  padding: 0 5px 0 0;
  color: #25b8cc;
  font-size: 20px;
  &.is-bold {
    font-weight: 700;
  }
}
.is-text {
  position: absolute;
  top: 0;
}
.logo_subtitle {
  font-size: 16px;
  padding-top: 5px;
}
img{
  width: 150px;
  height: 50px;
  margin-top: 15px;
}
</style>
