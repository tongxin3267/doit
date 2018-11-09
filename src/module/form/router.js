import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "@/lang"
//主页
const home = r => require.ensure([], () => r(require('./components/index')), 'index')
const formtype = r => require.ensure([], () => r(require('./components/formtype')), 'formtype')
const add = r => require.ensure([], () => r(require('./components/add/add')), 'add') //this.$route.params.id
const submited = r => require.ensure([], () => r(require('./components/list/submited')), 'submited')
const audit = r => require.ensure([], () => r(require('./components/list/audit')), 'audit')
const relate = r => require.ensure([], () => r(require('./components/list/relate')), 'relate')
const detail = r => require.ensure([], () => r(require('./components/detail/detail')), 'detail')
const open = r => require.ensure([], () => r(require('./components/list/open')), 'open')
const detailData = r => require.ensure([], () => r(require('./components/list/detailData')), 'detailData') // 明细数据页
const formlist = r => require.ensure([], () => r(require('./components/formlist')), 'formlist') // 表单列表
const draft = r => require.ensure([], () => r(require('./components/list/draft')), 'draft')
const collection = r => require.ensure([], () => r(require('./components/list/collection')), 'collection')
const openDetail = r => require.ensure([], () => r(require('./components/detail/openDetail')), 'openDetail')


Vue.use(Router)

function newRouterFun() {
	const i18n = i18nFun(_.lang)
	const locale = i18n.locale;

	const title = i18n.messages[locale].i18n;

	const newRouter = new Router({
		routes: [
			{
				path: '/',
				redirect: '/submited'//audit//submited
			},
			{
				path: '/open/add',
				name: 'openForm',
				meta: {title: ""},
				component: add,
			},
			{
				path: '/open/detail',
				name: 'openDetail',
				meta: {title: ""},
				component: openDetail,
			},
			{
				path: '/',
				name: 'home',
				meta: {title: "表单流程"},
				component: home,
				children: [
					{
						path: '/submited',
						name: 'submited',
						meta: {title: "表单流程"},
						component: submited
					},
					{
						path: '/audit',
						name: 'audit',
						meta: {title: "待办"},
						component: audit
					},
					{
						path: '/relate',
						name: 'relate',
						meta: {title: "我相关的"},
						component: relate
					},
					{
						path: '/open',
						name: 'open',
						meta: {title: "我的外部单"},
						component: open
					}
				]
			},
			{
				path: '/formtype',
				name: 'formtype',
				meta: {title: '发起表单流程'},
				component: formtype
			},
			{
				path: '/draft',
				name: 'draft',
				meta: {title: '草稿'},
				component: draft
			},
			{
				path: '/collection',
				name: 'collection',
				meta: {title: '收藏'},
				component: collection
			},
			{
				path: '/add',
				name: 'add',
				meta: {title: '填写表单'},
				component: add
			},
			{
				path: '/detail',
				name: 'detail',
				meta: {title: '表单详情'},
				component: detail
			},
			{
				path: '/detailData',
				name: 'detailData',
				meta: {title: '明细数据'},
				component: detailData
			},
			{
				path: '/formlist',
				name: 'formlist',
				meta: {title: '表单列表'},
				component: formlist
			}
		]
	})

	newRouter.beforeEach((route, redirect, next) => {
		document.title = route.meta.title || document.title;
		if (route.name == 'submited') {
			dataBase.home.homeFooterList.nav_on = 0;
		} else if (route.name == 'audit') {
			dataBase.home.homeFooterList.nav_on = 1;
		} else if (route.name == 'relate') {
			dataBase.home.homeFooterList.nav_on = 2;
		} else if (route.name == 'open') {
			dataBase.home.homeFooterList.nav_on = 3;
		}
		next();
	});

	/*必配 start*/
	newRouter.afterEach(function (to, from, next) {
		try {
			_.initializedData();//初始化配置数据
		} catch (e) {

		}
	});

	return newRouter;
}

export default newRouterFun
/*必配 end*/





