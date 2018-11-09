import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from './dataBase'
import router from './router'
import i18nFun from "@/lang"
window.dataBase = dataBase;

getLoginMessagePromise().then(function (data) {
  var i18n = i18nFun(_.lang)
  new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: {
      App
    }
  });

  Vue.filter('formatMoney', function (money = 0) {
    // 返回处理后的值
    var v, j, sj, rv = "";
    money = money.toString();
    v = money.replace(/,/g, "").split(".");
    j = v[0].length % 3;
    sj = v[0].substr(j).toString();
    for (var i = 0; i < sj.length; i++) {
      rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
    }
    var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
    if (rvalue.charCodeAt(0) == 44) {
      rvalue = rvalue.substr(1);
    }
    return rvalue;
  })
})
