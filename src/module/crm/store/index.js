import Vue from 'vue'
import Vuex from 'vuex'
import tree from '@/components/tree/data'
import miniprogram from './modules/miniprogram'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tree,
    miniprogram
  },
})
