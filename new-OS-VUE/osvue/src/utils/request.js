import Axios from 'axios'
import Store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/cookie.js'
import { timeFormatter } from './formatter.js'
const service = Axios.create({
  //  请求接口  超时时间
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // console.log('请求拦截器: ', config)

  // 判断是否具有token
  if (Store.getters.token) {
    // 如果存在则让每一个请求都携带token
    config.headers['AdminToken'] = getToken()
    config.headers['departmentId'] = Store.getters.departmentId
  }
  // 判断是否是登录页
  // console.log(this)
  if (config.url.indexOf('login') > -1 || config.url.indexOf('autoDecode') > -1) {
    config.url = process.env.API_HOST + 'pb/' + config.url
  } else {
    // config.url.indexOf('departmentTask/') > -1 || config.url.indexOf('typeTask') > -1
    // if (config.url.indexOf('department/api') > -1) {
    //   config.url = 'http://192.168.0.88:9000/os/' + config.url
    // } else {
    config.url = process.env.API_HOST + 'os/' + config.url
    // }
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
  // console.log('响应拦截器: ', response)
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
  if (response.data.code === -1) {
    Message({
      message: response.data.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(response.data.message)
  } else {
    // ReToken()
    return response.data
  }
}, error => {
  if ((error + '').search('timeout') !== -1) {
    Message({
      message: '网络不佳，请重试！',
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
        message: '网络不佳，请重试',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 500) {
      Message({
        message: '服务器端错误,请稍后再试',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 504) {
      Message({
        message: '网络不佳，请重试',
        type: 'error',
        duration: 4 * 1000
      })
    }
    if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
      if (!(window.location.href.indexOf('/login') > -1)) {
        MessageBox.confirm('登录失效请重新登录，取消则留在该页面', '确定退出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Store.dispatch('WebLogOut').then(() => {
            location.reload() // 刷新，避免BUG
          })
        }).catch(() => {})
      } else {
        alert('当前登录失效,请重新登录')

        Store.dispatch('WebLogOut').then(() => {
          location.reload() // 刷新，避免BUG
        })
      }
    }
    // if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
    //   Message({
    //     message: '登录失效请重新登录!',
    //     type: 'error',
    //     duration: 4 * 1000
    //   })
    // }
  }
  return Promise.reject(error)
})
export default service
