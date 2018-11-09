import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from'./dataBase'
import router from './router'

window.dataBase = dataBase;
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
