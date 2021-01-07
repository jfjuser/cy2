<template>
  <div id="app">
    <router-view/>
    <div v-wechat-title="$route.meta.title"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app{
  min-height: 100%;
  height: 100%;
  /* margin-top: 60px; */
}
p {
  margin: 0 auto;
}
a {
  text-decoration: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* min-height: 100%; */
  /* height: 100%; */
  /* margin-top: 60px; */
}
/* 人脸用户页面主题 */
.face-theme {
  min-height: 100%;
  height: 100%;
  background-image: url(./assets/icon/wx/face-home-back.jpg);
  background-size: 100% 100% !important;
  position: relative !important;
}
/* 卡片框 */
.mybox {
  width: 90%;
  margin: 0 3%;
  padding: .3125rem .625rem;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 0 1.25rem #bee7e9;
}
.vux-img {
  background-size: 100% 100% !important;
}
.blue {
  color: #409EFF;
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff !important;
  box-shadow: 0 0 1.25rem #bee7e9 !important;
}
.green {
  color: #67c23a;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0 !important;
  box-shadow: 0 0 1.25rem #ddf8d0 !important;
}
.grey {
  color: #909399;
  background: #f4f4f5;
  border: 1px solid #c9cacc !important;
  box-shadow: 0 0 1.25rem #d8d9db !important;
}
.orange {
  color: #e6a23c;
  background: #fdf6ec;
  border: 1px solid #ebc893 !important;
  box-shadow: 0 0 1.25rem #f3d9b3 !important;
}
.red {
  color: #f56c6c;
  background: #fef0f0;
  border: 1px solid #ec9f9f !important;
  box-shadow: 0 0 1.25rem #f5b7b7 !important;
}
.left {
  float: left;
}
.right {
  float: right;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
</style>
