import Vue from 'vue'
import Vuex from 'vuex'
import tree from '@/components/tree/data'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tree
  },
})
