'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MOCK: 'true',
  // API_HOST: '"http://cyai.cytingchechang.com/"'
  // API_HOST: '"http://cy.40mi.com"'
  // API_HOST: '"http://192.168.0.197:9000"'
  // API_HOST: '"https://beta.cytingchechang.com"'
  // API_HOST: '"http://192.168.0.136:9000"'
  // API_HOST: '"http://cy.40mi.com"'
  // API_HOST: '"http://192.168.0.136:9000"'
  // API_HOST: '"https://beta.cytingchechang.com"'
  API_HOST: '"https://www.cytingchechang.com"'
})
