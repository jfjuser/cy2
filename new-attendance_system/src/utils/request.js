import Axios from 'axios'
import Store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/cookie.js'
import { timeFormatter } from './formatter.js'

const service = Axios.create({
  //  请求接口  超时时间
  baseURL: process.env.API_HOST + 'at/',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // console.log(config)
  // 判断是否具有token
  if (Store.getters.token) {
    // 如果存在则让每一个请求都携带token
    config.headers['AdminToken'] = getToken()
  }
  // 判断是否是登录页
  if (
    config.url.indexOf('/login') > -1 ||
    config.url.indexOf('/checkout') > -1 ||
    config.url.indexOf('/completeMessage') > -1 ||
    config.url.indexOf('/cameraForPhoto/getCameraMessage') > -1 ||
    config.url.indexOf('/cameraForPhoto/changeName') > -1
  ) {
    config.baseURL = process.env.API_HOST + 'pb/at'
  }
  // 判断是不是下载文件的
  if (config.responseType === 'blob') {
    config.timeout = 600000
  }
  // 配置取消请求
  config.cancelToken = Store.state.source.token
  // 配置完成之后返回过来
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
// let isRefreshing = false
service.interceptors.response.use(response => {
  // 刷新token尝试
  // console.log(response, 'response')
  // if (getTokenTime()) {
  //   let tokenTime = getTokenTime()
  //   let time = new Date().getTime() - tokenTime
  //   if (time > 3 * 60 * 1000) {
  //     console.log('超时')
  //     const config = response.config
  //     if (!isRefreshing) {
  //       isRefreshing = true
  //       return refreshToken().then(res => {
  //         config.url = config.url.split('os/')[1]
  //         return service(config)
  //       }).catch(res => {
  //         console.error('refreshtoken error =>', res)
  //       }).finally(() => {
  //         isRefreshing = false
  //       })
  //     }
  //   }
  // }
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
    Message({
      message: '服务器出错,请稍后再试',
      type: 'error',
      duration: 4 * 1000
    })
    /* eslint-disable-next-line */
    return Promise.reject({err: '服务器无响应数据返回'})
  }
  if (response.data.code === -1) {
    Message({
      message: response.data.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(response.data.message)
  }
  return response.data
}, error => {
  if ((error + '').search('timeout') !== -1) {
    Message({
      message: '请求超时！',
      type: 'error',
      duration: 4 * 1000
    })
  } else {
    let code = error.response.status
    if (error.response && code === 400) {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 404) {
      Message({
        message: '请求资源不存在',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 405) {
      Message({
        message: '请求方法不正确',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 408) {
      Message({
        message: '请求超时',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 500) {
      Message({
        message: '服务器错误,请稍后再试',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 504) {
      Message({
        message: '请求超时，请重新请求',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
      // if (!(window.location.href.indexOf('/login') > -1)) {
      MessageBox.confirm('登录失效请重新登录，取消则留在该页面', '确定退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Store.dispatch('WebLogOut').then(() => {
          location.reload() // 刷新，避免BUG
        })
      }).catch(() => {})
      // } else {
      //   Store.dispatch('WebLogOut').then(() => {
      //     location.reload() // 刷新，避免BUG
      //   })
      // }
    }
  }
  return Promise.reject(error)
})
export default service
