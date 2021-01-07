import Axios from 'axios'
import Store from '@/store'
import { Toast, Notify } from 'vant' // Dialog,
import { getToken } from '@/utils/cookie.js'
import { timeFormatter } from './formatter.js'
// import router from '@/router'

const service = Axios.create({
  //  请求接口  超时时间
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 判断是否具有token
  if (Store.getters.token) {
    // 如果存在则让每一个请求都携带token
    config.headers['AdminToken'] = getToken()
  }
  config.headers['departmentId'] = Store.getters.departmentId
  // 判断是否是登录页
  if (config.url.indexOf('pv/') > -1) {
    config.url = process.env.API_HOST + 'pb/' + config.url
  } else {
    config.url = process.env.API_HOST + 'os/' + config.url
  }
  // 判断是不是下载文件的
  if (config.responseType === 'blob') {
    config.timeout = 600000
  }
  if (/get/i.test(config.method)) { // 获取get请求
    config.params = config.params || {}
    config.params._ = Date.parse(new Date()) // 添加时间戳禁止get缓存
  }
  console.log(config.url)
  console.log(process.env.API_HOST)
  // 配置完成之后返回过来
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // ----------------文件下载直接处理----------------\\
  if (response.headers['content-type'] === 'application/octet-stream' || response.headers['Content-Type'] === 'application/octet-stream') {
    let title
    if (response.headers['content-disposition'] === undefined) {
      title = timeFormatter(new Date()) + '.xls'
    } else if (decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])) {
      title = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
    } else if (decodeURI(response.headers['Content-Disposition'].split(';')[1].split('=')[1])) {
      title = decodeURI(response.headers['Content-Disposition'].split(';')[1].split('=')[1])
    } else {
      title = response.headers['Content-Disposition'].split(';')[1].split('=')[1]
    }
    const content = response.data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a')
      elink.download = title
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else { // IE10+下载
      navigator.msSaveBlob(blob, title)
    }
  }
  if (response.data.code === -1) {
    Toast({
      message: response.data.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(response.data.message)
  } else {
    return response.data
  }
}, error => {
  if ((error + '').search('timeout') !== -1) {
    Toast({
      message: '请求超时！',
      type: 'error',
      duration: 4 * 1000
    })
  } else {
    let code = error.response.status
    if (error.response && code === 400) {
      Toast({
        message: error.response.data.message,
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 404) {
      Toast({
        message: '请求资源不存在',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 405) {
      Toast({
        message: '请求方法不正确',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 408) {
      Toast({
        message: '请求超时',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 500) {
      Toast({
        message: '服务器错误,请稍后再试',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 504) {
      Toast({
        message: '请求超时，请重新请求',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
      if (!(window.location.href.indexOf('/login') > -1)) {
        // Dialog.confirm({
        //   title: '提示',
        //   message: '登录失效请重新登录',
        //   type: 'warning'
        // }).then(() => {
        // var str = window.location.href
        var str = process.env.API_HOST
        Store.dispatch('WebLogOut').then(() => {
        //   // location.reload() // 刷新，避免BUG
          if (str.indexOf('beta') > -1) {
            window.location.href = 'https://beta.cytingchechang.com/face/'
          } else if (str.indexOf('www')) {
            window.location.href = 'https://www.cytingchechang.com/face/'
          } else if (str.indexOf('120.25')) {
            window.location.href = 'http://120.25.152.27/face/'
          } else if (str.indexOf('cyai')) {
            window.location.href = 'http://cyai.cytingchechang.com/face/'
          } else if (str.indexOf('cy.40mi')) {
            window.location.href = 'http://cyai.cytingchechang.com/face/'
          } else {
            Notify('操作失败，请点击左上角退出')
          }
          // router.push('/login/')
          // var host = process.env.API_HOST
          // var appid = localStorage.getItem('appid')
          // var redirectUrl = encodeURIComponent(host + 'face' + '/')
          localStorage.setItem('marks', 123)
          localStorage.setItem('title', '')
        // var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base#wechat_redirect`
        // window.location.href = url
        // window.location.href = '/login'
        // })
        // window.location.href = '/'
        }).catch(() => {})
      } else {
      //   // var str1 = window.location.href
        var str1 = process.env.API_HOST
        Store.dispatch('WebLogOut').then(() => {
          // location.reload() // 刷新，避免BUG
          // router.push('/login/')
          if (str1.indexOf('beta') > -1) {
            window.location.href = 'https://beta.cytingchechang.com/face/'
          } else if (str1.indexOf('www')) {
            window.location.href = 'https://www.cytingchechang.com/face/'
          } else if (str1.indexOf('120.25')) {
            window.location.href = 'http://120.25.152.27/face/'
          } else if (str1.indexOf('cy.40mi')) {
            window.location.href = 'http://cyai.cytingchechang.com/face/'
          } else {
            Notify('操作失败，请点击左上角退出')
          }
          // var host = process.env.API_HOST
          // var appid = localStorage.getItem('appid')
          // var redirectUrl = encodeURIComponent(host + 'face' + '/')
          localStorage.setItem('marks', 123)
          localStorage.setItem('title', '')
        // var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_base#wechat_redirect`
        // window.location.href = url
        // window.location.href = '/login'
        })
      }
    }
    // if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
    //   Dialog({
    //     message: '登录失效请重新登录!',
    //     type: 'error',
    //     duration: 4 * 1000
    //   })
    // }
  }
  return Promise.reject(error)
})
export default service
