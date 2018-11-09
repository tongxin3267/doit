import Vue from 'vue'
import Vuex from 'vuex'
import rules from './modules/ruleData'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    rules
  },
})
