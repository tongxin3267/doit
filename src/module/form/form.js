import '../../assets/js/common.js'
import '../../assets/fonts/form/iconfont.js'
import Vue from 'vue'
import App from './App'
import dataBase from'./dataBase'
import newRouterFun from './router';
import i18nFun from "@/lang"
import store from './store/index'
import infiniteScroll from 'vue-infinite-scroll'
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)

Vue.use(infiniteScroll)
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
