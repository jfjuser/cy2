import Axios from 'axios'
import { Notify } from 'vant' // Dialog,
import { timeFormatter } from './formatter.js'
// import router from '@/router'
import store from '@/store'
const service = Axios.create({
  //  请求接口  超时时间
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 判断是否具有token
  // 如果存在则让每一个请求都携带token
  // config.headers['AdminToken'] = 'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJDWUtKIiwiZXhwIjoxNTY5NDE2MzA0LCJ4LXVzZXJJZCI6Mn0.HejeLqpokjr2sauWhywN5zL9NOiSlTNw9V4YUoviqL8'
  // config.headers['departmentId'] = 1602
  // 判断是否是old页
  if (config.url.indexOf('pv/') > -1) {
    // config.url = process.env.API_HOST + '/' + config.url
    config.url = process.env.API_HOST + 'pb/' + config.url
  } else {
    // config.url = process.env.API_HOST + 'at/' + config.url
    config.url = process.env.API_HOST + 'pb/at/' + config.url
  }
  // 判断是不是下载文件的
  if (config.responseType === 'blob') {
    config.timeout = 600000
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
    Notify({
      message: response.data.message,
      type: 'warning',
      duration: 4 * 1000
    })
    return Promise.reject(response.data.message)
  } else {
    return response.data
  }
}, error => {
  if ((error + '').search('timeout') !== -1) {
    Notify({
      message: '请求超时！',
      type: 'danger',
      duration: 4 * 1000
    })
  } else {
    let code = error.response.status
    if (error.response && code === 400) {
      Notify({
        message: error.response.data.message,
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 404) {
      Notify({
        message: '请求资源不存在',
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 405) {
      Notify({
        message: '请求方法不正确',
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 408) {
      Notify({
        message: '请求超时',
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 500) {
      Notify({
        message: '服务器错误,请稍后再试',
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (error.response && code === 504) {
      Notify({
        message: '请求超时，请重新请求',
        type: 'danger',
        duration: 4 * 1000
      })
    }
    if (((error + '').search('401') !== -1) || (error.response && code === 401)) {
      Notify(error) // token过期
      let defaultInfo = {
        userName: '',
        companyName: undefined,
        phone: undefined,
        photo: '',
        addr: '',
        dutyCompanyId: undefined,
        depName: '',
        type: '0',
        beginTime: undefined,
        endTime: undefined,
        remarks: undefined
      }
      // localStorage.setItem('active', 0)
      // 清空数据，回复默认值
      store.dispatch('user/SaveActive', 0)
      store.dispatch('user/SaveUserInfo', defaultInfo).then(() => {
        this.$router.replace('/addInfo')
      })
    }
  }
  return Promise.reject(error)
})
export default service
