import '../../assets/js/common.js'
import Vue from 'vue';
import App from './App';
import dataBase from'./dataBase'
import newRouterFun from './router';
import 'babel-polyfill';
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
    template: '<App/>',
    components: { App }
  });
})
