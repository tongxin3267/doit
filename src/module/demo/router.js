import Vue from 'vue'
import Router from 'vue-router'
const demo = r => require.ensure([], () => r(require('./components/demo')),'demo_index')
const treeList = r => require.ensure([], () => r(require('./tree/treeList')),'treeList')
const treeList2 = r => require.ensure([], () => r(require('./tree/treeList2')),'treeList2')
const advancedSearch = r => require.ensure([], () => r(require('./advancedSearch/index')),'advancedSearch')

Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'demo',
      component: demo
    },
    {
      path: '/open/',
      name: 'demo',
      component: demo
    },
    {
      path: '/treeList',
      name: 'treeList',
      component: treeList
    },
    {
      path: '/treeList2',
      name: 'treeList2',
      component: treeList2
    },
    {
      path: '/advancedSearch',
      name: 'advancedSearch',
      component: advancedSearch
    }
  ]
})
  return newRouter;
}
export default newRouterFun
