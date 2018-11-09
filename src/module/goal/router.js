import Vue from 'vue'
import Router from 'vue-router'
const goalDetail = r => require.ensure([], () => r(require('./views/goalDetail')), 'goalDetail');
const distributionGoal = r => require.ensure([], () => r(require('./views/distributionGoal')), 'distributionGoal');
const searchMember = r => require.ensure([], () => r(require('./views/searchMember')), 'searchMember');
const memberGoal = r => require.ensure([], () => r(require('./views/memberGoal')), 'memberGoal');
const searchMemberGoal = r => require.ensure([], () => r(require('./views/searchMemberGoal')), 'searchMemberGoal');

Vue.use(Router);

const newRouter = new Router({
    routes: [
        {
            path: '/',
            component: goalDetail,
            name: 'goalDetail',
            meta: {
                title: '目标详情'
            }
        },
        {
            path: '/distributionGoal',
            component: distributionGoal,
            name: 'distributionGoal',
            meta: {
                title: '分配目标'
            }
        },
        {
            path: '/searchMember',
            component: searchMember,
            name: 'searchMember',
            meta: {
                title: '分配目标'
            }
        },
        {
            path: '/memberGoal',
            component: memberGoal,
            name: 'memberGoal',
            meta: {
                title: '成员目标'
            }
        },
        {
            path: '/searchMemberGoal',
            component: searchMemberGoal,
            name: 'searchMemberGoal',
            meta: {
                title: '成员目标'
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
