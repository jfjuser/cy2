'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK: 'true',
  // API_HOST: '"/api/"',
  // API_HOST: '"https://beta.cytingchechang.com/"'
  // API_HOST: '"http://cyai.cytingchechang.com/"' // 正式服 人脸云
  // API_HOST: '"https://www.cytingchechang.com/"' // 正式服 车场云
  API_HOST: '"http://192.168.0.88:9000/"' // 正式服 车场云
})
