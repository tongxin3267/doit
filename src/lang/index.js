
import VueI18n from 'vue-i18n';
import Vue from 'vue';

Vue.use(VueI18n) // 通过插件的形式挂载

var lang=navigator.language.indexOf("en")!=-1? "en":"zh-CN";

const i18n = function(data) {
  var i18n =  new VueI18n({//创建 i18n 实例
    locale: data||lang,
    messages: {
      "zh-CN": require("../lang/zh"),
      "en": require("../lang/en")
    }
  })
  return i18n
};
export default i18n;


