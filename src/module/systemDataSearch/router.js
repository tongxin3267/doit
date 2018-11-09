import Vue from 'vue'
import Router from 'vue-router'
const selectHome = r => require.ensure([], () => r(require('./views/selectHome')),'selectHome');
const selectList = r => require.ensure([], () => r(require('./views/selectList')),'selectList');

Vue.use(Router)

const newRouter = new Router({
  routes:[
    {
      path:'/',
      component: selectHome,
      name: 'selectHome',
      meta: {
        title: '企微研发数据查询'
      }
    },
    {
      path:'/list',
      component: selectList,
      name: 'selectList',
      meta: {
        title: '研发数据查询列表'
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
