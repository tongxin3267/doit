import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";

//主页
const home = r => require.ensure([], () => r(require('./views/index')),'index');

// 客户新增编辑
const clientOperate = r => require.ensure([], () => r(require('./views/client/ClientOperate/ClientOperate')),'clientOperate');
// 联系人新增编辑
const contactOperate = r => require.ensure([], () => r(require('./views/contact/contactOperate/contactOperate')),'ContactsOperate');
//客户查重
const checkList = r => require.ensure([], () => r(require('./views/check/checkList')),'checkList');
// 合同回款统计
const dataStatistics = r => require.ensure([], () => r(require('./views/dataStatistics/dataStatistics')),'dataStatistics');
// 我的小程序
const smallProgram = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/smallProgram')),'smallProgram');
// 我的名片
const callingCard = r => require.ensure([], () => r(require('./views/marketingProgram/callingCard/callingCard')),'callingCard');
// 编辑名片
const editCard = r => require.ensure([], () => r(require('./views/marketingProgram/callingCard/editCard')),'editCard');
// 联系管理员开通权限
const openAuthority = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/openAuthority')), 'openAuthority');
// 动态
const marketingDynamic = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/marketingDynamic')), 'marketingDynamic');
// 消息
const message = r => require.ensure([], () => r(require('./views/marketingProgram/message/message')), 'message')
// 聊天室
const chat = r => require.ensure([], () => r(require('./views/marketingProgram/message/chat')), 'chat')


Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        meta: {title: "移动CRM"},
        component: home
      },
      {
        path: '/clientOperate',
        name: 'clientOperate',
        meta: {title: "新建客户"},
        component: clientOperate
      },
      {
        path: '/contactOperate',
        name: 'contactOperate',
        meta: {title: "新建联系人"},
        component: contactOperate
      },
      {
        path: '/checkList',
        name: 'checkList',
        meta: {title: "客户查重"},
        component: checkList
      },
      {
        path: '/dataStatistics',
        name: 'dataStatistics',
        meta: {title: "合同回款统计"},
        component: dataStatistics
      },
      {
        path: '/clientList',
        name: 'clientList',
        meta: { title: '客户列表', keepAlive: true },
        component: () => import('./views/client/ClientList/ClientList')
      },
      {
        path: '/contactList',
        name: 'contactList',
        meta: { title: '联系人列表', keepAlive: true },
        component: () => import('./views/contact/ContactList/ContactList')
      },
      {
        path: '/visitList',
        name: 'visitList',
        meta: { title: '拜访列表', keepAlive: true },
        component: () => import('./views/visit/VisitList/VisitList')
      },
      {
        path: '/businessList',
        name: 'businessList',
        meta: { title: '商机列表', keepAlive: true },
        component: () => import('./views/business/BusinessList/BusinessList')
      },
      {
        path: '/contractList',
        name: 'contractList',
        meta: { title: '合同列表', keepAlive: true },
        component: () => import('./views/contract/ContractList/ContractList')
      },
      {
        path: '/poolList',
        name: 'poolList',
        meta: { title: '公海池', keepAlive: true },
        component: () => import('./views/pool/PoolList/PoolList')
      },
      {
        path: '/clientTypeList',
        name: 'clientTypeList',
        meta: { title: '客户列表', keepAlive: true },
        component: () => import('./views/client/ClientTypeList/ClientTypeList')
      },
      {
        path: '/smallProgram',
        name: 'smallProgram',
        meta: {title: "我的小程序"},
        component: smallProgram
      },
      {
        path: '/callingCard',
        name: 'callingCard',
        meta: {title: "我的名片"},
        component: callingCard
      },
      {
        path: '/editCard',
        name: 'editCard',
        meta: {title: "编辑名片"},
        component: editCard
      },
      {
        path: '/openAuthority',
        name: 'openAuthority',
        meta: {title: "我的小程序"},
        component: openAuthority
      },
      {
        path: '/marketingDynamic',
        name: 'marketingDynamic',
        meta: {title: "动态"},
        component: marketingDynamic
      },
      {
        path: '/message',
        name: 'message',
        meta: {title: '消息'},
        component: message
      },
      {
        path: '/chat',
        name: 'chat',
        component: chat
      },
      {
        path: '/homeTest',
        name: 'homeTest',
        meta: {title: "移动CRM"},
        component: () => import('./views/indexTest/indexTest')
      }
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'clientOperate'){
      document.title = route.query.clientId ? "编辑客户":"新建客户"
    }else if(route.name == 'contactOperate'){
      document.title = route.query.contactId ? "编辑联系人":"新建联系人"
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
