/**
 *
 * Ajax请求
 *
 */

import axios from 'axios';

// 全局变量
let _ = window._;

// 配置

// 请求名
const NAME = '加载数据';

// 加载项
const LOADING = {
  // 加载超时
  timeout: 1000,
  // 显示回调
  async show (name) {
    if (_ && _.showLoading) {
      _.showLoading('正在' + name);
    }
  },
  // 隐藏回调
  async hide () {
    if (_ && _.hideLoading) {
      _.hideLoading();
    }
  }
};

// 处理器
const HANDLER = {
  // 响应处理器
  async response (res) {
    if (res.code === '0') {
      return Promise.resolve(res);
    } else {
      return Promise.reject(res.desc);
    }
  },
  // 异常处理器
  async error (err) {
    if (_ && _.alert) {
      _.alert('提示', err);
      console.log(err);
    }
    return err;
  }
};

export default {
  install (Vue, options) {
    // 引入配置
    options = options || {};
    const NAME_ = options.name || NAME;
    const LOADING_ = Object.assign({}, LOADING, options.loading);
    const HANDLER_ = Object.assign({}, HANDLER, options.handler);

    let http = async (url, config) => {
      // http.get简写
      if (typeof url === 'string') {
        return http.get(url, config);
      } else {
        config = url;
      }

      // 当前配置
      let name = config.name || NAME_;
      let loading = Object.assign({}, LOADING_, config.loading);
      let handler = Object.assign({}, HANDLER_, config.handler);

      // 超时显示loading
      let timer = setTimeout(async () => {
        await loading.show(name);
      }, loading.timeout);

      // 发出请求
      let res = await axios(config);

      clearTimeout(timer);

      // 隐藏loading
      await loading.hide();

      // 请求数据处理
      try {
        return await handler.response(res);
      } catch (err) {
        err = await handler.error(err);
        return Promise.reject(err);
      }
    };

    // GET方法简写
    http.get = async (url, config) => {
      return await http({
        url,
        method: 'get',
        ...config
      });
    };

    // POST方法简写
    http.post = async (url, data, config) => {
      return await http({
        url,
        data,
        method: 'post',
        ...config
      });
    };

    Vue.http = http;
    Vue.prototype.$http = http;
  }
}
