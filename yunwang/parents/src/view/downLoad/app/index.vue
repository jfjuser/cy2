<template>
  <!-- 支付跳转页 -->
  <div id="box">
    <!-- <div id="shade">
      <p style="color: white;">如果在微信中无法直接下载，可以点击右上角选择在<span>浏览器中打开</span>即可下载。</p>
      <img id='img' src="./libs/share.png" alt="pic">
    </div> -->
    <div id="pic">
      <img src="./libs/logo.png" alt="车场小秘书">
      <p>车场小秘书</p>
    </div>
    <div id="loading">
      <a id='load_ios' onclick="downLoad()">Android下载</a>
    </div>
    <p id="message" style="color: red; text-align:center;display: none;font-size: 14px">暂不支持Android以外的平台</p>
  </div>
</template>
<style lang="scss" scoped>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
  overflow-x: hidden;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

* {
  box-sizing: border-box;
}

body,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
textarea,
p,
blockquote,
th,
td,
hr,
button,
article,
aside,
details,
figcaption,
figure,
footer,
header,
menu,
nav,
section {
  margin: 0;
  padding: 0;
  border: 0;
}

a {
  text-decoration: none;
}

button {
  user-select: none;
}

img {
  vertical-align: middle;
}

img:not([src]),
img[src=""] {
  opacity: 0;
}

ul,
ol {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

input,
select,
button,
textarea {
  font-size: 100%;
  font: inherit;
  -webkit-tap-highlight-color: rgba(255, 0, 0, 0);
  -webkit-appearance: none;
}

#box {
  position: relative;
  height: calc(100vh);
  width: 100%;
  background: url('./libs/bg.jpg') no-repeat;
  background-size: cover;
}

#loading {
  text-align: center;
  position: absolute;
  top: calc(100vh - 50%);
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  line-height: 1.12px;
  margin-top: 1.8rem;
}

#loading a {
  color: #E60012;
  border: 1px solid #cccccc;
  width: 5.267rem;
  height: 1.12rem;
  border-radius: 1.33rem;
  font-size: 0.4rem;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

#loading #load_android {
  margin-top: 1rem;
}

#loading #load_android img {
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  width: 0.48rem;
  height: 0.512rem;
}

#loading #load_ios img {
  margin-right: 0.2rem;
  width: 0.48rem;
  height: 0.56rem;
}
#pic {
  text-align: center;
  position: absolute;
  width: 100%;
}

#pic img {
  width: 4.2rem;
  height: 3.833rem;
  margin-top: 4rem;
  padding: 0.133rem;
}

#pic p {
  width: 100%;
  font-size: 0.54rem;
  color: #FFFFFF;
  text-align: center;
}

#shade {
  position: relative;
  text-align: center;
}

#shade p {
  position: absolute;
  color: white;
  font-size: 0.4rem;
  text-align: left;
  top: 0.2rem;
  width: 100%;
  left: 0.4rem;
  padding-right: 1.5rem;
}

#shade p span {
  border-bottom: 1px solid #FFFFFF;
}

#img {
  position: absolute;
  display: block;
  right: 0.1rem;
  top: 0;
  width: 0.94rem;
  height: 1rem;
}
</style>
<script type="text/javascript" src=""></script>
<script>
import { flexible } from './libs/flexible.js'
import { newApp } from '@/api/url.js'
import { httpGet } from '@/utils/restful.js'
export default {
  data () {
    return {
    }
  },
  downLoad () {
    if (/android/i.test(navigator.userAgent)) {
      var isWeiXin = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 ? true : false
      var ajax = new XMLHttpRequest();
      httpGet(newApp).then(res => {
        if (res.code === 1) {
          console.log(res);
          var result = JSON.parse(res)
          if (isWeiXin) {
            window.location.hash = 'downLoad'
          }
          window.location.href = result.data
        }
      }).catch(() => {})
    } else {
      var message = document.getElementById('message')
      message.style.display = 'block'
    }
  }
}
</script>
