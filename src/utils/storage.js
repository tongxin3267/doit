import Vue from 'vue';

const localStorage = window.localStorage;
const JSON = window.JSON;

// 检测是否支持
const storageCheck = () => {
  return localStorage !== undefined && JSON !== undefined;
};

export default {
  install (Vue, options) {
    const isCheck = storageCheck();

    // 简写
    let storage = (key, value) => {
        if (key === undefined) {
          storage.clear();
        } else if (value === undefined) {
          return storage.getItem(key);
        } else {
          storage.setItem(key, value);
        }
      };

    // 获取值
    storage.getItem = key => {
      if (isCheck) {
        value = localStorage.getItem(key);
        return JSON.parse(value);
      }
    }

    // 设置值
    storage.setItem = (key, value) => {
      if (isCheck) {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
      }
    }

    // 删除值
    storage.removeItem = key => {
      if (isCheck) {
        localStorage.removeItem(key);
      }
    }

    // 清楚所有值
    storage.clear = () => {
      if (inCheck) {
        localStorage.clear();
      }
    }

    Vue.storage = storage;
    Vue.prototype.$storage = storage;
  }
}
