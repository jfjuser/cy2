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
