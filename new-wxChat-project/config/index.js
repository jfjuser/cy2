/*
 * @Author: your name
 * @Date: 2020-05-10 00:00:51
 * @LastEditTime: 2020-05-21 09:59:09
 * @LastEditors: sueRimn
 * @Description: In User Settings Edit
 * @FilePath: \weChat-project\config\index.js
 */
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://192.168.0.227:9000', // 设置调用接口域名和端口号别忘了加http
        target: 'https://www.cytingchechang.com', // 设置调用接口域名和端口号别忘了加http
        // target: 'https://beta.cytingchechang.com', // 设置调用接口域名和端口号别忘了加http
        // target: 'http://47.106.35.188', // 新的测试IP
        // target: 'http://cyai.cytingchechang.com', // 新的人脸域名地址
        // target: 'http://192.168.0.136:9000', // 新的车场域名地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // 这里理解成用‘/api’代替target里面的地址，组件中我们调接口时直接用/api代替
          // 比如我要调用'http://0.0:300/user/add'，直接写‘/api/user/add’即可 代理后地址栏显示/
        }
      }
    },
    // Various Dev Server settings // => localhost
    // host: '192.168.0.120', // can be overwritten by process.env.HOST
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 3000, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../view/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../view'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/view/',

    /**
     * Source Maps
     */
    // 关闭map文件
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
