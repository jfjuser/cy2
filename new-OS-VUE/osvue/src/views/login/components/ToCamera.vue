<!--
 * @Author: your name
 * @Date: 2020-05-09 14:09:36
 * @LastEditTime: 2020-05-19 00:26:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \os-vue\src\views\login\components\ToCamera.vue
 -->
 <!-- 跳转相机新平台  -->
<template>
  <div class="toLinks">
    <div class="link-group" v-if="cameraVersionstate === platformSelect.cartPlatform.type">
      <a :href="platformSelect.facePlatform.url" style="text-decoration: underline; font-size: 28px;"  target="_blank"><span class="el-icon-d-arrow-right"></span>{{oldAppInfo.title}}</a>
      <p class="title">我们已在《2020年05月09日》新增测温相机</p>
      <el-button
        class="newAppTitle"
        style="text-decoration: underline;"
        type="text"
        @click="centerDialogVisible = true"
        >{{ model_oldAppInfo.title }}</el-button
      >
    </div>
    <!-- v-if="cameraVersionstate == 1" -->
    <div class="newVersion" v-else>
      {{ newCameraTitle }}
    </div>
    <div class="appLogInfo">
      <el-dialog
        :modal="false"
        title="测温相机说明"
        :visible.sync="centerDialogVisible"
        width="600px"
        height="500px"
        center
      >
        <div class="newAppInfo">
          <ul class="list-gourp">
            <li class="header flex">
              <span class="flex-3">测温相机:</span>
              <span class="flex-7">
                <img :src="newImg1" alt="newImg1" />
                <img :src="newImg2" alt="newImg2" />
              </span>
            </li>
            <li class="flex titleInfo">
              <span class="flex-3"> 备注:</span><br />
              <span class="flex-7"
                ><span>{{ model_oldAppInfo.log }}</span></span
              >
            </li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import newImg1 from '@/assets/newAppImg/image1.jpg'
import newImg2 from '@/assets/newAppImg/image2.jpg'
export default {
  data () {
    return {
      newImg1,
      newImg2,
      cameraVersionstate: null,
      centerDialogVisible: false,
      platformSelect: null,
      platformSelectBase: null,
      nowHost: null,
      oldAppInfo: {
        title: '人脸相机新平台入口'
      },
      model_oldAppInfo: {
        title: '如何区分新旧平台说明',
        log: `以上相机已转移至新平台，不在以上列表的设, 保持不变。`
      },
      newCameraTitle: '人脸识别平台'
    }
  },
  created () {
    /** ********  获取 $store 当前地址源  **********/
    this.cameraVersionstate = this.$store.getters.platformType
    this.nowHost = window.location.origin
    /** ********  取出存储配置平台地址  **********/
    this.platformSelect = this.$store.getters.platformSelect
    this.platformSelectBase = this.$store.getters.platformSelectBase
    /** ********  测试测试测试  **********/
    if (process.env.NODE_ENV === 'development') {
      this.nowHost = this.nowHost + (window.location.pathname !== '/' ? window.location.pathname : '')
    }
    // ===========================================================================
    /** ********  判断当前地址源是否是 n平台地址源  **********/
    if (this.nowHost === this.platformSelect.cartPlatform.url || this.nowHost === this.platformSelectBase.cartPlatform.url) {
      // console.log('车场....', this.nowHost, this.cameraVersionstate)
      this.cameraVersionstate = this.platformSelect.cartPlatform.type
      // this.newCameraTitle = this.platformSelect.cartPlatform.title
    } else if (this.nowHost === this.platformSelect.facePlatform.url || this.nowHost === this.platformSelectBase.facePlatform.url) {
      // console.log('人脸....', this.nowHost, this.cameraVersionstate)
      this.cameraVersionstate = this.platformSelect.facePlatform.type
      this.newCameraTitle = this.platformSelect.facePlatform.title
    }
  },
  watch: {
    cameraVersionstate (v) {
      this.$store.commit('PLATFORM_TYPE', v)
    }
  }
}
</script>

<style lang="scss" scoped>
.toLinks{
  width: 100%;
  height: 100%;
  position: relative;
}
.link-group {
  position: absolute;
  top: 60%;
  left: 10%;
  color: #ffffff;
  font-size: bold;
  p.title {
    margin-top: 50px;
    font-size: 12px;
    color: #ffffff;
  }
  .newAppTitle {
    color: #ffffff;
    font-size: 12px;
  }
}

.flex {
  height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  line-height: 150px;
  .flex-3 {
    flex: 2;
    display: flex;
    font-size: 20px;
    justify-content: flex-end;
    align-content: center;
    margin-right: 20px;
  }
  .flex-7 {
    flex: 8;
    text-align: left;
    display: flex;
    font-size: 15px;
    justify-content: flex-start;
    align-content: center;
  }
}
.newVersion {
  position: absolute;
  top: 60%;
  left: 30%;
  font-size: 30px;
  font-weight: bolder;
  color: #ffffff;
}
.flex.titleInfo {
  height: 100px;
  .flex-3 {
    line-height: 100px;
  }
  .flex-7 {
    margin-top: 35px;
    line-height: 25px;
  }
}
.newAppInfo {
  content {
    width: 100%;
  }
}

ul,
li {
  list-style: none;
}
.appLogInfo {
  height: 500px;
  width: 600px;
  .showlogInfo {
    position: absolute;
    color: #fff;
    top: 50%;
    left: 10%;
    height: 100%;
    width: 100%;
    z-index: 999;
  }
  img {
    width: 150px;
    height: 150px;
    margin: 0 5px;
  }
}
</style>
