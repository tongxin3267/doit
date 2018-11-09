// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var date=new Date(),
second=date.getSeconds()>10? date.getSeconds():"0"+String(date.getSeconds());

module.exports = {
  build: {
    version:date.getFullYear()+"."+(date.getMonth() + 1)+"."+date.getDate()+"_"+date.getHours()+"_"+date.getMinutes()+"_"+second,//版本号
    env: require('./prod.env'),// 使用 config/prod.env.js 中定义的编译环境
    index: path.resolve(__dirname, '../../../wxqyh/src/main/webapp/vp/index.html'),
    assetsRoot: path.resolve(__dirname, '../../../wxqyh/src/main/webapp/vp'),
    assetsSubDirectory: 'static',// 编译输出的二级目录
    assetsPublicPath: '../',// 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    /*什么是Source map
    简单说，Source map就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。
    有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。(谷歌能运行)*/
    productionSourceMap: false,
    productionGzip: false,// 是否开启 gzip
    productionGzipExtensions: ['js', 'css'],// 需要使用 gzip 压缩的文件扩展名
    bundleAnalyzerReport: process.env.npm_config_report// 是否展示webpack构建打包之后的分析报告
  },
  dev: {
    env: require('./dev.env'),// 使用 config/dev.env.js 中定义的编译环境
    port: 8089,
    url:'/vp/module/dynamic.html',//自动打开浏览器url
    autoOpenBrowser: true,//用于判断是否要自动打开浏览器的布尔变量
    assetsSubDirectory: 'static',// 编译输出的二级目录
    assetsPublicPath: '/vp/',// 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: {
        '/wxqyh': {
            target: 'http://localhost:8080/wxqyh',//代理路径
            changeOrigin: true,
            pathRewrite: {
              '^/wxqyh': '/'
            }
        }
    },
    cssSourceMap: false
  }
}
