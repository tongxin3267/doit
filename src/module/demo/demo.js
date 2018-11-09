import '../../assets/js/common.js'
import '../../../static/js/prism.js'
import Vue from 'vue'
import App from './App'
import dataBase from'./dataBase'
import store from'./store'
import 'babel-polyfill';
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)
import newRouterFun from './router';
import i18nFun from "@/lang"

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
})
