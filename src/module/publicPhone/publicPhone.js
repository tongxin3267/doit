import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from './dataBase'
import router from './router'
import i18nFun from "@/lang"
window.dataBase = dataBase;

getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: { App }
  });
})
