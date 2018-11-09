import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from'./database';
import newRouterFun from './router';
import i18nFun from "@/lang"
import store from './store'
import 'babel-polyfill';
window.dataBase = dataBase;
import { DatetimePlugin } from 'vux';
Vue.use(DatetimePlugin)
var vm;
getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  var router = newRouterFun()
  vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
  });
})
