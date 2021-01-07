'use strict'
const merge = require('webpack-merge') // webpack 合并模块
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_HOST: '"http://cy.40mi.com/"'
  API_HOST: '"http://cyai.cytingchechang.com/"'
})
