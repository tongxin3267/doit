import Vue from 'vue'
import Router from 'vue-router';
//主页
const home = r => require.ensure([], () => r(require('./views/index')), 'moveapprove_index')

//详情页
const detail = r => require.ensure([], () => r(require('./views/detail/moveapprove_detail')), 'moveapprove_detail')

//草稿列表页
const draft = r => require.ensure([], () => r(require('./views/draft_list.vue')), 'moveapprove_draft')

//新增页
const add = r => require.ensure([], () => r(require('./views/add/moveapprove_add.vue')), 'moveapprove_add')

Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
    routes: [
    {
      path: '/',
      name: 'home',
      meta: {title: '审批请示'},
      component: home
    },
      {
        path: '/my/submit',
        name: 'mySubmit',
        meta: {title: '审批请示'},
        component: home
      },
      {
        path: '/my/myOwner',
        name: 'myOwner',
        meta: {title: '审批请示'},
        component: home
      },
      {
        path: '/my/myNoRead',
        name: 'myNoRead',
        meta: {title: '审批请示'},
        component: home
      },
      {
        path: '/my/relative',
        name: 'myRelation',
        meta: {title: '审批请示'},
        component: home
      },
    {
      path: '/add',
      name: 'addMoveapprove',
      meta: {title: '新建申请'},
      component: add
    },
    {
      path: '/draft',
      name: 'draft',
      meta: {title: '草稿'},
      component: draft
    },
    {
      path: '/detail',
      name: 'moveapproveDetail',
      meta: {title: '申请详情'},
      component: detail
    }
    ]
  });
  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title) {
      document.title = route.meta.title;
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try {
      _.initializedData(); //初始化配置数据
    } catch (e) {

    }
  });
  return newRouter
}
export default newRouterFun
/*必配 end*/
