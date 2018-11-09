import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
//登录页
const login = r => require.ensure([], () => r(require('./views/login')),'login')
//主页
const home = r => require.ensure([], () => r(require('./views/index')),'index')
//actionList
const actionList = r => require.ensure([], () => r(require('./views/actionList/actionList')),'actionList')
// 详情页
const partyDetail = r => require.ensure([], () => r(require('./views/PartyDetail/PartyDetail')), 'partyDetail')
const viewList = r => require.ensure([], () => r(require('./views/viewList')), 'viewList')

Vue.use(Router)

function newRouterFun() {
  const i18n = i18nFun(_.lang)

  const newRouter = new Router({
    routes: [
      {
        path: '/index',
        name: 'home',
        meta: {title: '智慧党建'},
        component: home
      },
      {
        path: '/',
        name: 'login',
        meta: {title: '智慧党建'},
        component: login
      },
      {
        path: '/actionList',
        name: 'actionList',
        meta: {title: ''},
        component: actionList
      },
      {
        path: '/partyDetail',
        name: 'partyDetail',
        meta: {title: '详情页'},
        component: partyDetail
      },
      {
        path: '/viewList',
        name: 'viewList',
        meta: {title: '人员列表'},
        component: viewList
      },
      {
        path: '/open/detail',
        name: 'open_detail',
        meta: {
          title: '详情页'
        },
        component: partyDetail,
        props: {
          isOpen: true
        }
      }
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    next();
  });


  /*必配 start*/
  newRouter.afterEach(function (route, redirect, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter;
}
export default newRouterFun
/*必配 end*/
