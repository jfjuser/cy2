<template>
  <div class="base-container">
    <el-container style="width: 100%; height: 100%;">
      <el-main>
        <div class="base-nav-wrap">
          <img :src="logo" alt="logo" class="logo">
          <h2 class="base-title">{{ baseAPPType.APP_versions_select }}</h2>
          <div class="content">
            <div class="cartPlatform">
              <div class="head-titile">{{ baseAPPType.cartPlatform.title }}</div>
              <div class="expain">
                <span class="title"  v-html="baseAPPType.cartPlatform.explain.title"></span>
                <span class="exp" v-html="baseAPPType.cartPlatform.explain.exp"></span>
              </div>
              <el-button type="primary" @click="baseSelect(baseAPPType.cartPlatform.type)">{{
                baseAPPType.cartPlatform.btnTxt
              }}</el-button>
            </div>
            <div class="facePlatform">
              <div class="head-titile">{{ baseAPPType.facePlatform.title }}</div>
              <div class="expain">
                <span class="title" v-html="baseAPPType.facePlatform.explain.title"></span>
                <span class="exp" v-html="baseAPPType.facePlatform.explain.exp"></span>
              </div>
              <el-button type="primary" @click="baseSelect(baseAPPType.facePlatform.type)">{{
                baseAPPType.facePlatform.btnTxt
              }}</el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import storeWebLocal from '@/utils/storeWebLocal'
import logo from '@/assets/logo.png'
export default {
  data () {
    return {
      platformSelect: null,
      platformSelectBase: null,
      logo,
      baseAPPType: {
        APP_versions_select: '人脸云平台版本选项',
        facePlatform: {
          title: '人脸云平台',
          btnTxt: '进入人脸云平台',
          type: 1,
          explain: {
            title: '备注: ',
            exp: '人脸云平台'
          }
        },
        cartPlatform: {
          title: '车场云平台',
          btnTxt: '进入车场云平台',
          type: 0,
          explain: {
            title: '备注: ',
            exp: '车场云平台'
          }
        }
      }
    }
  },
  created () {
    this.platformSelect = this.$store.getters.platformSelect
    this.platformSelectBase = this.$store.getters.platformSelectBase
  },
  methods: {
    baseSelect (v) {
      var nextToObj = {}
      let getHost = window.location.origin
      /** ********  测试测试测试  **********/
      if (process.env.NODE_ENV === 'development') {
        getHost =
            getHost +
            (window.location.pathname !== '/' ? window.location.pathname : '')
      }
      switch (getHost) {
        case this.platformSelect.cartPlatform.url :
          nextToObj = this.platformSelect
          break
        case this.platformSelect.facePlatform.url:
          nextToObj = this.platformSelect
          break
        case this.platformSelectBase.facePlatform.url :
          nextToObj = this.platformSelectBase
          break
        case this.platformSelectBase.cartPlatform.url:
          nextToObj = this.platformSelectBase
          break
        default :
          nextToObj = this.platformSelect
      }

      // console.log('最终path：', nextToObj)
      storeWebLocal.setSessionStorage('BASE_TOKEN')
      if (v === nextToObj.cartPlatform.type) {
        this.$store.commit('PLATFORM_TYPE', v)
        window.location.href = nextToObj.cartPlatform.url
      } else {
        this.$store.commit('PLATFORM_TYPE', v)
        window.location.href = nextToObj.facePlatform.url
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* 主题背景颜色 */
$themeBgColor: #298bf0;
$themeBgImg: $themeBgColor url("~@/assets/b.jpg") no-repeat center;
.base-container {
  // background: $themeBgImg;
  background: $themeBgColor;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #666;
  .logo {
    width: 220px;
  }
  .base-title {
    border-bottom: #999 solid 1px;
    padding-bottom: 30px;
  }
}
.el-main {
  position: relative;
  height: calc(100% - 120px);
  .base-nav-wrap {
    position: absolute;
    width: 50%;
    height: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba($color: #f1f1f1, $alpha: 1);
    font-size: 20px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 0 2px 30px rgba($color: #fff, $alpha: 0.5);
    .content {
      display: flex;
      justify-content: space-around;
      align-content: center;
      .cartPlatform,
      .facePlatform {
        flex: 5;
        padding: 20px 10px;
        // background: #f1f1f1;
        color: #666;
        border-radius: 15px;
        border: 1px #666 solid;
      }
      .cartPlatform {
        margin-right: 5px;
        // border-right: 2px #666 solid;
      }
      .facePlatform {
        margin-left: 5px;
        // border-left: 2px #666 solid;
      }
      .head-titile {
        font-size: 18px;
        font-weight: bolder;
        height: 30px;
        line-height: 30px;
      }
      .expain {
        padding-bottom: 10px;
        font-size: 15px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        min-height: 100px;
        padding: 10px 0;
        .title {
          flex: 2;
          align-self: center;
          font-size: 18px;
          margin-right: 20px;
          font-weight: bolder;
        }
        .exp {
          flex: 8;
          align-self: center;
          text-align: left;
        }
      }
      .el-button {
        margin: 10px 0;
      }
    }
  }
}

.el-header,
.el-footer {
  height: 60px;
  line-height: 60px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
