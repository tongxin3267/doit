import '../../assets/js/common.js';
import Vue from 'vue';
import App from './App';
import dataBase from'./database';
import store from'./store'
import newRouterFun from './router';
import i18nFun from "@/lang";

window.dataBase = dataBase;
var vm;
getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  var router = newRouterFun()
  vm = new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: { App }
  });
});


// 缓存input和textarea数据
Vue.directive('storage', {
  bind (el, binding) {
    let storageName = binding.value;
    let storageValue = '', obj = {};

    if(!storageName) return;

    // 有name才绑定事件
    if(el.getAttribute('name')){
      // 赋上缓存的值
      el.value = obj[el.getAttribute('name')] || '';

      // 失去焦点时缓存数据
      el.handleInput = function(){
        obj[el.getAttribute('name')] = el.value;
        localStorage.setItem(storageName, JSON.stringify(obj));
      }

      // 获得焦点时获取缓存数据
      el.handleFocus = function(){
        storageValue = localStorage.getItem(storageName);
        obj = storageValue? JSON.parse(storageValue) : {};
      }

      el.addEventListener('focus',el.handleFocus);
      el.addEventListener('input',el.handleInput);
    }
  },
  unbind (el) {
    el.removeEventListener('focus',el.handleFocus);
    el.removeEventListener('input',el.handleInput);
  }
});
