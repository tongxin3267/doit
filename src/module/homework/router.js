import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
//主页
const home = r => require.ensure([], () => r(require('./components/index')),'homework_index')

//详情页
const detail = r => require.ensure([], () => r(require('./components/detail/detail')),'homework_detail')

//详情->进度列表页
const detailrate = r => require.ensure([], () => r(require('./components/detail/detailNav')),'homework_detailrate')

//草稿列表页
const draft = r => require.ensure([], () => r(require('./components/draft/draft_list.vue')),'homework_draft')

//新增页
const add = r => require.ensure([], () => r(require('./components/add/homework_add.vue')),'homework_add')

Vue.use(Router)

function newRouterFun() {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;

  const title = i18n.messages[locale].i18n;

  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        meta: {title: title.home},
        component: home
      },
      {
        path: '/draft',
        name: 'draft',
        meta: {title: title.draft},
        component: draft
      },
      {
        path: '/add',
        name: 'addHomework',
        meta: {title: title.addHomework},
        component: add
      },
      {
        path: '/detail',
        name: 'homeworkDetail',
        meta: {title: title.homeworkDetail},
        component: detail
      },
      {
        path: '/detail/rate',
        name: 'homeworkRate',
        meta: {title: title.homeworkRate},
        component: detailrate
      }
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {

    const title = i18n.messages[i18n.locale].i18n;
    if (title[route.name]) {
      document.title = title[route.name];
    }
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
