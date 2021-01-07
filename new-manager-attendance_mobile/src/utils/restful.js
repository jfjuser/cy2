import request from './request'

export function httpExport (url, data, config) {
  return request({
    url,
    params: data,
    config,
    method: 'GET',
    responseType: 'blob'
  })
}

export function httpGet (url, data, config) {
  return request({
    url,
    params: data,
    config,
    method: 'GET'
  })
}

export function httpPut (url, data, config) {
  return request({
    url,
    data,
    config,
    method: 'PUT'
  })
}

export function httpPost (url, data, config) {
  return request({
    url,
    data,
    config,
    method: 'POST'
  })
}
