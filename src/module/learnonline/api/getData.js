import axios from 'axios';
//封装接口方法  url: 接口url， isLoad：是否需要loading过程
function getData(url, isLoad = true) {
  const SUCCESS_CODE = '0';
  return (data, cb, errCb = null) => {
    isLoad && _.showLoading('');
    axios.post(_.baseURL + url, { ...data })
    .then(result => {
      isLoad && _.hideLoading('');
      // 公共axios拦截错误在报错404时, 此函数依然会跑到result.code报错
      if (!result) return; // 如果result为undefined 直接返回
      if (result.code === SUCCESS_CODE) {
        cb && cb(result.data);
      } else {
        _.alert('提示',result.desc, {
          primaryBtn:{
            name:'i18n.confirm',
            callBack() {
              errCb && errCb(result);
            }
          }, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
      }
    })
  }
}

/* 可以公用的 */
// 获取当前机构流量数据
let getUserFlow = getData('/portal/alicloudupload/portalAliCloudUploadAction!volumeFlow.action' ,false);

// 记录流量
let recordFlow = getData('/portal/alicloudupload/portalAliCloudUploadAction!expendFlow.action' ,false);

// 获取视频真实Url
let getVideoUrl = getData('/portal/QCloud/qCloudAction!getVodPermission.action' ,false);



/* 商城(发现)相关 */
// 获取商城列表数据
let getMallListData = getData('/portal/learn/subjectMarket/findLike.do');

// 获取商城详情页数据
let getMallDetailData = getData('/portal/learn/subjectMarket/ajaxViewShopSubject.do');

//课程商城图文的预览
let getArticleContent = getData('/portal/learn/subjectMarket/ajaxViewArticle.do');

// 记录学习时长（详情页）
let recordLearnTime = getData('/portal/learn/subjectMarket/recondStudyTime.do', false);

// 获取管理员列表
let getManager = getData('/portal/managesetting!getUserList.action');

// 发送购买请求
let sendBuyAsk = getData('/portal/learn/subjectMarket/sendBuyRequest.do');



/* 直播相关 */
// 获取直播列表数据
let getLiveListData = getData('/portal/learnonline/portalLiveAction!searchLive.action');

// 获取直播详情页数据
let getLiveDetailData = getData('/portal/learnonline/portalLiveAction!searchWxLiveDetail.action');

// 进入直播间的请求
let getLivePlayData = getData('/portal/learnonline/portalLiveAction!enterLive.action');

// 直播间和回放间发送统计学习时长的请求
let recordLiveTime = getData('/portal/learnonline/portalLiveAction!updateLiveViewTime.action', false);

// 直播间获取评论
let getLiveCommentData = getData('/portal/learnonline/portalLiveAction!searchLiveComment.action', false);

// 直播间发送评论
let sendLiveCommentData = getData('/portal/learnonline/portalLiveAction!addLiveComment.action', false);

// 进入回放间的请求
let getReplayData = getData('/portal/learnonline/portalLiveAction!enterLiveVideo.action');

// 回放间发送记录流量请求
let recordReplayFlow = getData('/portal/learnonline/portalLiveAction!updateVideoFlow.action', false);



/* 学习任务相关 */
// 初始化开课信息
let portalCourseInit = getData('/portal/learnonline/portalCourseAction!courseInite.action');

// 获悉学习任务的课程 / 获得搜索的课程
let getCoursesData = getData('/portal/learnonline/portalCourseAction!ajaxIndex.action');

// 获取是否显示【前往后台弹窗提示】的标志
let getIsRemind = getData('/portal/managesetting!ajaxIsRemindUser.action');

// 关闭【前往后台弹窗提示】反馈给服务器
let closeGuideDialog = getData('/portal/managesetting!ajaxUpdateRemindUser.action');



/* 我的相关 */
// 获取用户信息：头像、姓名等, 用于【我的】
let getLearnUserInfo = getData('/portal/learnonline/portalCourseAction!ajaxMyStudy.action');

//个人学分明细
let scoreDetail = getData('/portal/learn/creditDetail.do');

// 获取最近学习课程
let getMyStudyCourse = getData('/portal/learnonline/portalCourseAction!ajaxStudyCourse.action');



/* 搜索相关 */
// 搜索课程
let searchSubject = getData('/portal/learn/subjectMarket/searchSubject.do');

// 搜索直播
let searchLive = getData('/portal/learnonline/portalLiveAction!searchLive.action');

// 查询是否有正在进行的考试
let searchExamCount =  getData('/portal/portalExamAction!seachExamCount.action');

// 搜索考试
let searchExam = getData('/portal/portalExamAction!seachExamList.action');

// 搜索练习
let searchPractice = getData('/portal/exam/practice/practicePortalAction!ajaxWxPracticePage.action');



/* 课程详情相关 */
// 获取必学课/选学课详情页数据
let getCourseDetailData = getData('/portal/learnonline/portalCourseAction!ajaxPersonCourse.action');

// 获取目录
let getCatalog = getData('/portal/learnonline/portalCourseAction!ajaxCourseChapter.action');

// 获取课件类型
let getFileType = getData('/portal/learnonline/portalCourseAction!ajaxStudyEnclosure.action', false);

// 记录时长
let recordCourseTime = getData('/portal/learnonline/portalCourseAction!studyEnclosure.action', false);

// 获取课程评论
let getCourseCommentData = getData('/portal/learnonline/portalCourseAction!listMoreComment.action');

// 发送课程评论
let sendCourseCommentData = getData('/portal/learnonline/portalCourseAction!addSubjectComment.action');

// 删除课程评论
let delCourseCommentData = getData('/portal/learnonline/portalCourseAction!delCommentPO.action');


/* 课程相关 */
//获取课程的目录
let getCourseCategory = getData('/portal/learnonline/portalCourseAction!loadCategory.action');

/* 获取课程的数据 */
let getCourseListData = getData('/portal/learnonline/portalCourseAction!ajaxCoursePage.action');

/* 获取课程学习情况的详细数据 */
let getLeanDetail = getData('/portal/learnonline/portalCourseAction!ajaxStudyEnclosure.action');

/* 发送学习时长 */
let sendLearnTime = getData('/portal/learnonline/portalCourseAction!studyEnclosure.action', false);

export {
  getMallListData,
  getMallDetailData,
  getArticleContent,
  getLiveListData,
  getLiveDetailData,
  getLivePlayData,
  getUserFlow,
  getVideoUrl,
  recordLearnTime,
  recordFlow,
  getManager,
  sendBuyAsk,
  recordLiveTime,
  getLiveCommentData,
  sendLiveCommentData,
  getReplayData,
  portalCourseInit,
  getCoursesData,
  getIsRemind,
  closeGuideDialog,
  getLearnUserInfo,
  scoreDetail,
  getMyStudyCourse,
  searchSubject,
  searchLive,
  searchExamCount,
  searchExam,
  searchPractice,
  getCourseDetailData,
  getCatalog,
  getFileType,
  recordCourseTime,
  recordReplayFlow,
  getCourseCommentData,
  sendCourseCommentData,
  delCourseCommentData,
  getCourseCategory,
  getCourseListData,
  getLeanDetail,
  sendLearnTime
};
