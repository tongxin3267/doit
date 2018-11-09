import Vue from 'vue'
import Router from 'vue-router'
const error = r => require.ensure([], () => r(require('./components/error')),'error_index')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'error',
      component: error
    }
  ]
})
