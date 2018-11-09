import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
// 主页
const Learn = r => require.ensure([], () => r(require('./views/index')),'learn_index');

// 商城管理员列表
const ManagerList = r => require.ensure([], () => r(require('./views/mall/ManagerList')),'manager_list');

// 发现
const MallDetail = r => require.ensure([], () => r(require('./views/mall/MallDetail')),'mall_detail');

//发现课程预览
const PreviewDetail = r => require.ensure([], () => r(require('./views/mall/PreviewDetail')),'preview_detail');

// 直播
const LiveDetail = r => require.ensure([], () => r(require('./views/live/LiveDetail')),'live_detail');

const LivePlay = r => require.ensure([], () => r(require('./views/live/LivePlay')),'live_play');

const LiveReplay = r => require.ensure([], () => r(require('./views/live/LiveReplay')),'live_replay');

// 任务列表
const TaskList = r => require.ensure([], () => r(require('./views/learnTask/LearningTaskList')),'task_list');

//学习详情页面
const LearnDetail = r => require.ensure([], () => r(require('./views/learnTask/learningDetail')),'learn_detail');

// 我的
const MyStudy = r => require.ensure([], () => r(require('./views/myRelavent/MyStudy')),'my_Study'); // 最近学习

//学分明细
const ScoreDetail = r => require.ensure([], () => r(require('./views/myRelavent/ScoreDetail')),'score_detail');

// 搜索
const search = r => require.ensure([], () => r(require('./views/search/Search')),'search_index'); // 搜索首页

// 免费课程详情
const CourseDetail = r => require.ensure([], () => r(require('./views/courseDetail/CourseDetail')),'course_detail'); // 搜索首页

Vue.use(Router)

function newRouterFun() {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n;
  const newRouter = new Router({
    routes: [
      {
        path: '/', // 首页
        name: 'learn',
        meta: {
          title: title.learn,
          keepAlive: true
        },
        component: Learn
      },
      {
        path: '/liveDetail',  // 直播详情
        name: 'live_detail',
        meta: {title: title.liveDetail},
        component: LiveDetail
      },
      {
        path: '/livePlay', // 直播间
        name: 'live_play',
        meta: {title: title.liveDetail},
        component: LivePlay,
      },
      {
        path: '/liveReplay', // 回放间
        name: 'live_replay',
        meta: {title: title.liveDetail},
        component: LiveReplay
      },
      {
        path: '/mallDetail', // 商城详情
        name: 'mall_detail',
        meta: {title: title.courseDetail},
        component: MallDetail
      },
      {
        path: '/previewDetail',
        name: 'preview_detail',
        meta: {title: title.learn},
        component: PreviewDetail
      },
      {
        path: '/managerList', // 管理员列表
        name: 'manager_list',
        meta: {title: title.buyCourse},
        component: ManagerList
      },
      {
        path: '/taskList/:isMust',
        name: 'task_list',
        meta: {title: title.learn},
        component: TaskList
      },
      {
        path: '/learnDetail/:id/:enclosureId',
        name: 'learn_detail',
        meta: {title: title.learn},
        component: LearnDetail
      },
      {
        path: '/myStudy', // 我的学习页面
        name: 'my_Study',
        meta: {
          title: title.myStudy,
        },
        component: MyStudy
      },
      {
        path: '/scoreDetail',//学分明细
        name: 'score_detail',
        meta:{title: title.creditDetail},
        component: ScoreDetail
      },
      {
        path: '/search',
        name: 'search',
        meta: {
          title: title.search,
        },
        component: search
      },
      {
        path: '/courseDetail',
        name: 'course_detail',
        meta: {
          title: title.courseDetail,
        },
        component: CourseDetail
      },
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title;
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
