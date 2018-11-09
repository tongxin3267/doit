import Vue from 'vue'
import Router from 'vue-router'

//主页
const home = r => require.ensure([], () => r(require('./views/index')),'diary_index')

//草稿列表页
const draft = r => require.ensure([], () => r(require('./views/draft/draft_list.vue')),'diary_draft')

//新增页
const add = r => require.ensure([], () => r(require('./views/add/diary_add.vue')),'diary_add')

//补交日志列表页
const unCommittedList = r => require.ensure([], () => r(require('./views/add/uncommitted_list.vue')),'unCommittedList')

//汇总页面
const summary = r => require.ensure([], () => r(require('./views/list/summary_list.vue')),'summary')

//详情页面
const detail = r => require.ensure([], () => r(require('./views/detail/detail.vue')),'detail')

// 规则设置
const ruleList = r => require.ensure([], () => r(require('./views/rule/ruleList')),'ruleList')
const ruleSetting = r => require.ensure([], () => r(require('./views/rule/ruleSetting')),'ruleSetting')

//日志统计
const historyList = r => require.ensure([], () => r(require('./views/statistic/history_list')),'historyList')
const statisticDetail = r => require.ensure([], () => r(require('./views/statistic/statistic_detail')),'statisticDetail')
/*必配 start*/
Vue.use(Router)
function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        meta: {title: "工作日志"},
        component: home
      },
      {
        path: '/draft',
        name: 'draft',
        meta: {title: "草稿"},
        component: draft
      },
      {
        path: '/add',
        name: 'add',
        meta: {title: "新建日志"},
        component: add
      },
      {
        path: '/unCommittedList',
        name: 'unCommittedList',
        meta: {title: "补交日志"},
        component: unCommittedList
      },
      {
        path: '/summary',
        name: 'summary',
        meta: {title: "汇总日志"},
        component: summary
      },
      {
        path: '/detail',
        name: 'detail',
        meta: {title: "日志详情"},
        component: detail
      },
      {
        path: '/rule',
        name: 'ruleList',
        component: ruleList,
        meta: {
          title: '规则设置',
        },
      },
      {
        path: '/rule/settings/:diaryId/:ruleName/:ruleId?',
        name: 'ruleSetting',
        component: ruleSetting,
        meta: {
          title: '规则设置',
        },
      },
      {
        path: '/historyList',
        name: 'historyList',
        meta: {title: "历史记录"},
        component: historyList
      },
      {
        path: '/statisticDetail',
        name: 'statisticDetail',
        meta: {title: "统计详情"},
        component: statisticDetail
      },
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'add'){
      document.title = route.query.diaryId ? "编辑日志":"新增日志"
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try{
      _.initializedData();//初始化配置数据
    }catch(e){

    }
  });
  return newRouter
}
export default newRouterFun
/*必配 end*/
