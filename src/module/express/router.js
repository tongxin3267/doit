import Vue from 'vue'
import Router from 'vue-router'
const express = r => require.ensure([], () => r(require('./components/express')),'express')
const add = r => require.ensure([], () => r(require('./components/add/express_add.vue')),'express_add')
const detail = r => require.ensure([], () => r(require('./components/detail/express_detail.vue')),'express_detail')

Vue.use(Router);
function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'express',
        meta: {title: "拿快递"},
        component: express
      },
      {
        path: '/add',
        name: 'add',
        meta: {title: "录入快递"},
        component: add
      },
      {
        path: '/detail',
        name: 'detail',
        meta: {title: "快递详情"},
        component: detail
      }
    ]
  });
  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title || document.title) {
      document.title = route.meta.title || document.title;
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter
}
export default newRouterFun
