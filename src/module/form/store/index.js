import Vue from 'vue'
import Vuex from 'vuex'
import userSelected from './modules/userSelected'
import formBase from './modules/formBase'
import detail from './modules/detail'
import selectNode from '@/components/flow/getNodeInfo'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		selectNode,
		userSelected,
		formBase,
		detail
	},
})
