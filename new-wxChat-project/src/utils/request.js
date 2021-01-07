/*
*@Author: 李一番
* @Date: 2019-01-14 23:03:21
 * @Last Modified by: mikey.zhaopeng
<<<<<<< HEAD
 * @Last Modified time: 2020-11-10 17:10:05
=======
 * @Last Modified time: 2020-11-25 08:58:24
>>>>>>> 429f3bfc9aff6463449f41eef22244cd579b1a4e
*/

import Axios from 'axios'
import { getDepInfo } from './userInfo'

const service = Axios.create({
  //  请求接口  超时时间
  timeout: 15000,
  baseURL: process.env.API_HOST
  // baseURL: 'https://beta.cytingchechang.com'
  // baseURL: 'https://www.cytingchechang.com'
  // baseURL: 'http://cyai.cytingchechang.com'
  // baseURL: 'http://192.168.0.136:9000/'
})

// 请求拦截器
service.interceptors.request.use(config => {
  console.log('请求拦截： ', config)
  // config.url = process.env.API_HOST + 'pb/pv/' + config.url
  config.headers['departmentId'] = getDepInfo().departmentId
  if (/get/i.test(config.method)) { // 获取get请求
    config.params = config.params || {}
    config.params._ = Date.parse(new Date()) // 添加时间戳禁止get缓存
  }
  if (config.url.indexOf('/resultAdvMsg') > -1) {
    config.baseURL = process.env.API_HOST + '/'
  } else {
    config.baseURL = process.env.API_HOST + '/pb/pv/'
  }
  if (config.url.indexOf('/selectCurrentAdv') > -1 ||
  config.url.indexOf('/advSearchMsg') > -1 ||
  config.url.indexOf('/addAdvClickTimes') > -1) {
    config.baseURL = process.env.API_HOST
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  if (response.data.code === -1) {
    // this.$toast({message: response.data.message, position: 'bottom'})
    return Promise.reject(response.data.message)
  } else {
    return response.data
  }
}, error => {
  console.log('请求错误： ', error)
  if ((error + '').search('timeout') !== -1) {
    this.$vux.toast.text('请求超时!', 'bottom')
  } else {
    console.log(333, error, error.response)
    if (error && error.response) {
      let code = error.response.status
      if (error.response && code === 400) {
        console.log(error.response.data.message)
        // this.$vux.toast.text(error.response.data.message, 'bottom')
      }
      if (error.response && code === 404) {
        console.log('请求资源不存在')
        // this.$vux.toast.text('请求资源不存在', 'bottom')
      }
      if (error.response && code === 405) {
        console.log('请求方法不正确')
        // this.$vux.toast.text('请求方法不正确', 'bottom')
      }
      if (error.response && code === 408) {
        console.log('请求超时!')
        // this.$vux.toast.text('请求超时!', 'bottom')
      }
      if (error.response && code === 500) {
        console.log('服务器错误,请稍后再试!')
        // this.$vux.toast.text('服务器错误,请稍后再试!', 'bottom')
      }
      if (error.response && code === 504) {
        console.log('请求超时，请重新请求')
        // this.$vux.toast.text('请求超时，请重新请求', 'bottom')
      }
    }
  }
  error = '服务器内部错误，请稍后再试'
  console.log(error)
  return Promise.reject(error)
})
export default service
