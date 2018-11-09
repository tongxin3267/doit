import Vue from 'vue'
import Router from 'vue-router'
const list = r => require.ensure([], () => r(require('./views/list')),'list')
const detail = r => require.ensure([], () => r(require('./views/detail')),'detail')

Vue.use(Router)

const newRouter = new Router({
  routes: [
    {
      path:'/',
      component: list,
      name: 'list',
      meta: {
        title: '公费电话客户列表',
        keepAlive: true
      }
    },
    {
      path:'/detail',
      component: detail,
      name: 'detail',
      meta: {
        title: '企业信息'
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
export default newRouter
/*必配 end*/
