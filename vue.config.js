const { defineConfig } = require('@vue/cli-service');
const { AntDesignVueResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  // publicPath: './',
  assetsDir: 'static',
  transpileDependencies: ['vuex-module-decorators'],
  lintOnSave: false,
  devServer: {
    proxy: {
      '/security': {
        // target: 'https://www.bjnfbk.com',
        // target: 'http://10.178.4.87:8021',//杨建飞
        // target: 'http://10.178.4.47:8020',//张建
        // target: 'http://10.57.4.110:8801',//杨建飞
        // target: '10.57.112.36',//环境-测试
        // target: 'http://10.178.4.43:8020',
        target: 'https://mptst.picclife.cn/dop/iug/zuul',//测试环境
        // target: 'http://10.178.4.41:8020',//俊达-运营位
        // target: '10.34.21.159:8001',//生产
        changeOrigin: true,
        // pathRewrite: {
        //   //表示需要rewrite重写的c
        //   '^/security': '',
        // },
      },
      '/dop/iug/zuul': {
        // target: '10.34.21.159:8001',//生产
        // target: 'http://10.178.4.41:8021',//俊达-运营位
        // target: 'http://10.178.4.47:8021',//张建
        // target: 'http://10.178.4.65:8021',//戈超-内容中心和标签管理
        // target: 'http://10.178.4.43:8021',//后端-孙东波
        target: 'https://mptst.picclife.cn',//测试环境
        // target: 'http://10.178.4.87:8021',//后端-杨建飞
        // target: '10.57.112.36',//测试环境
        changeOrigin: true, //表示是否跨域，
        // pathRewrite: {
        // //   // 表示需要rewrite重写的
        //   '^/api': '',
        // },
      }
      // host:'10.178.4.87'
    },
  },
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        resolvers: [AntDesignVueResolver()],
      })
    ],
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          globalVars: {
            hack: 'true; @import \'~@/styles/variables.less\';'
          }
        }
      },
    },
  },
  pwa: {
    iconPaths:{
        favicon32: 'favicon.ico',
        favicon16:'favicon.ico',
        appleTouchlcon:'favicon.ico',
        masklcon: 'favicon.ico',
        msTilelmage: 'favicon.ico',
    }
  },
  /* svg 相关配置 */
  chainWebpack: config => {
      // set svg-sprite-loader
      config.module
          .rule('svg')
          .exclude.add(resolve('src/icons'))
          .end();
      config.module
          .rule('icons')
          .test(/\.svg$/)
          .include.add(resolve('src/icons'))
          .end()
          .use('svg-sprite-loader')
          .loader('svg-sprite-loader')
          .options({
              symbolId: 'icon-[name]',
          })
          .end()
      config
          .plugin('html')
          .tap(args => {
              args[0].title= '人保集团引流触面'
              return args
          })
      
  }
});
