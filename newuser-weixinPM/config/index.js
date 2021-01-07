'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'runtime'],
      minChunks: Infinity // >=3
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons', // ( 公共chunk(commnons chunk) 的名称)
      filename: 'commons.[chunkhash:4].js', // ( 公共chunk 的文件名)
      minChunks: 3 // (模块必须被 3个 入口chunk 共享)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true, // (选择所有被选 chunks 的子 chunks)
      minChunks: 3 // (在提取之前需要至少三个子 chunk 共享这个模块)
    })
  ],
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // target: 'http://localhost:9000',
        // target: 'https://beta.cytingchechang.com',
        // target: 'http://47.106.35.188', // 新测试服IP
        target: 'http://cy.40mi.com', // 新人脸服务器地址
        // target: 'http://192.168.0.111:8084',
        // target: 'http://192.168.0.227:9000',// 张哥本地接口对接
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/mock':{
        target: 'http:127.0.0.1:3000', // 新人脸服务器地址
        // target: 'http://192.168.0.109:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/mock': '/'
        }
      }
    },

    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
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
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/attendance/user/',

    /**
     * Source Maps
     */
    // 关闭Map
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
