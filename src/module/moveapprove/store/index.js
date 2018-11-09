import Vue from 'vue'
import Vuex from 'vuex'
import userSelected from './modules/userSelected'
import detail from './modules/detail'
import selectNode from '@/components/flow/getNodeInfo'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    selectNode,
    userSelected,
    detail
  },
})
