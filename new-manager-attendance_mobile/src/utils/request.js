import Axios from 'axios'
import Store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/cookie.js'
import { Notify, Dialog } from 'vant'
import { timeFormatter } from './formatter.js'
// console.log(process.env.API_HOST)
const service = Axios.create({
  //  请求接口  超时时间
  baseURL: process.env.API_HOST,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // console.log(11111111111, config)
  // 判断是否具有token
  if (!config.headers['AdminToken']) {
    if (Store.getters.token) {
      // 如果存在则让每一个请求都携带token
      config.headers['AdminToken'] = getToken()
    }
  }
  if (config.url.indexOf('/os/v1/') > -1
  ) {
    config.baseURL = process.env.API_HOST
  } else {
    config.baseURL = process.env.API_HOST + 'at/'
  }

  // 判断是否是登录页
  if (
    config.url.indexOf('/login') > -1 ||
    config.url.indexOf('/checkout') > -1 ||
    config.url.indexOf('/completeMessage') > -1 ||
    config.url.indexOf('/wx/sweep') > -1 ||
    config.url.indexOf('/getOpenId') > -1 ||
    config.url.indexOf('/getWifiP') > -1 ||
    config.url.indexOf('/workaiToken/checkCamera') > -1 ||
    config.url.indexOf('/aiUser/checkPhoto') > -1 ||
    config.url.indexOf('/aiUser/noCheckPhoto') > -1 ||
    config.url.indexOf('/forgetPassword') > -1
  ) {
    // 初始
    if (config.url.indexOf('/aiUser/checkPhoto') > -1 || config.url.indexOf('/aiUser/noCheckPhoto') > -1) {
      config.baseURL = process.env.API_HOST + 'pb/'
    } else {
      config.baseURL = process.env.API_HOST + 'pb/at'
    }
  }
  if (config.url.indexOf('/WorkForCyCarUser') > -1
  ) {
    config.baseURL = process.env.API_HOST + 'at'
  }
  if (config.url.indexOf('/listApproveUser') > -1 ||
      config.url.indexOf('/delApproveUser') > -1 ||
      config.url.indexOf('/insert') > -1 ||
      config.url.indexOf('/listVacation') > -1
  ) {
    config.baseURL = process.env.API_HOST + 'pb/pv'
  }
  if (config.url.indexOf('/getPhoto') > -1
  ) {
    config.baseURL = process.env.API_HOST
  }
  if (config.url.indexOf('/insertVisitor') > -1
  ) {
    config.baseURL = process.env.API_HOST + 'pb/at'
  }

  if (config.url.indexOf('/opendoor') > -1
  ) {
    config.baseURL = process.env.API_HOST
  }

  // 判断是不是下载文件的
  if (config.responseType === 'blob') {
    config.timeout = 600000
  }
  // 配置取消请求
  config.cancelToken = Store.state.source.token
  if (/get/i.test(config.method)) { // 获取get请求
    config.params = config.params || {}
    config.params._ = Date.parse(new Date()) // 添加时间戳禁止get缓存
  }
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
    if (response.headers['content-disposition'] === undefined && response.headers['Content-Disposition'] === undefined) {
      title = timeFormatter(new Date()) + '.xls'
    } else if (response.headers['content-disposition']) {
      title = decodeURI(response.headers['content-disposition'].split(';')[1].split('=')[1])
    } else if (response.headers['Content-Disposition']) {
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

  if (!response.data) {
    console.log('错误响应：', response)
    Notify({ type: 'danger', message: '服务器出错,请稍后再试' })
    /* eslint-disable-next-line */
    return Promise.reject({err: '服务器无响应数据返回'})
  }
  if (response.data.code <= -1 && response.config.url.indexOf('/isNewVersion') === -1) {
    console.log(response)
    console.log(5555, response.data.code)
    Notify({ type: 'danger', message: response.data.message })
    return Promise.reject(response.data.message)
  }
  return response.data
}, error => {
  if ((error + '').search('timeout') !== -1) {
    Notify({ type: 'danger', message: '请求超时！' })
  } else {
    let code = error.response.status
    if (error.response && code === 400) {
      Notify({ type: 'danger', message: error.response.data.message })
    }
    if (error.response && code === 404) {
      Notify({ type: 'danger', message: '请求资源不存在' })
    }
    if (error.response && code === 405) {
      Notify({ type: 'danger', message: '请求方法不正确' })
    }
    if (error.response && code === 408) {
      Notify({ type: 'danger', message: '请求超时' })
    }
    if (error.response && code === 500) {
      // console.log('错误响应：', error)
      Notify({ type: 'danger', message: '服务器错误,请稍后再试' })
    }
    if (error.response && code === 504) {
      Notify({ type: 'danger', message: '请求超时，请重新请求' })
    }
    if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
      // Notify({ type: 'warning', message: '登录失效请重新登录!' })
      Dialog.confirm({ message: '登录失效，请重新登录' }).then(() => {
        router.push('/login')
      })
    }
  }
  return Promise.reject(error)
})
export default service
