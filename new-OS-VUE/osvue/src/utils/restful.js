/*
*@Author: lyf
*@Date: 2018-11-06 11:29:43
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-10-24 11:08:35
*/

import request from './request'

// GET请求
export function httpGet (url, data, config) {
  return request({
    url,
    params: data,
    config,
    method: 'GET'
  })
}

// POST请求
export function httpPost (url, data, config) {
  return request({
    url,
    data,
    config,
    method: 'POST'
  })
}

// PUT请求
export function httpPut (url, data, config) {
  return request({
    url,
    data,
    config,
    method: 'PUT'
  })
}

// DELETE请求
export function httpDelete (url, data) {
  return request({
    url,
    method: 'DELETE',
    data
  })
}

// PATCH请求
// export function httpPost (url, data) {
//   return request({
//     url,
//     method: 'PATCH',
//     data
//   })
// }

// 文件下载
export function httpExport (url, data, config) {
  return request({
    url,
    params: data,
    config,
    method: 'GET',
    responseType: 'blob'
  })
}

// 长请求时间POST请求
export function httpPostLong (url, data, config) {
  return request({
    url,
    data,
    config,
    timeout: 3600 * 60 * 1000,
    method: 'POST'
  })
}
