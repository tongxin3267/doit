import Vue from 'vue'
import Router from 'vue-router'

//主页
const home = r => require.ensure([], () => r(require('./views/index')),'others_index')
//方案定制主页
const scheme = r => require.ensure([], () => r(require('./views/scheme/scheme')),'others_index')

Vue.use(Router)
const newRouter = new Router({
  routes: [
    {
      path:'/open/',
      component: home,
      name: 'home',
      meta: {
        title: '活动'
      }
    },
    {
      path: '/open/scheme',
      component: scheme,
      name: 'scheme',
      meta: {
        title: '活动'
      }
    }
  ]
})
newRouter.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || document.title;
  next();
});
/*必配 start*/
newRouter.afterEach(function (to, from, next) {
  try{
    _.initializedData();//初始化配置数据
  }catch(e){

  }
});
/*必配 end*/
export default newRouter
