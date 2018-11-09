<template lang="html">
  <div class="wrap qwui-courseDetail" :style="{ height: winHeight + 'px' }">
    <div class="scroll_wrap" :style="{ height: scrollHeight }" @scroll="scrollList" ref="scroll_wrap">
      <!-- 顶部预览区域 -->
      <div class="preview_wrap" :style="fillBottomStyle" ref="video_area">
        <div class="video_wrap">
          <!-- 封面 -->
          <div class="cover_wrap">
            <img
              class="cover"
              :src="getCoverUrl(subject.subjectCover)"
              v-picfix
            >
          </div>
          <!-- 音视频预览区域 -->
          <div
            v-if="playVideo"
            id="sourcevid"
            class="video_view"
          >
            <div
              id="preview_video"
              class="video_box"
              ref="video_box"
              @contextmenu.prevent
            ></div>
          </div>

          <!--图片预览区域-->
          <div class="cover_wrap" v-else>
            <img
              v-if="compressUrl"
              class="previewImages"
              :src="compressUrl"
              @click="preview"
              ref="previewImages"
              v-picfix
            >
          </div>
          <!-- 续播提示 -->
          <div class="goOnTips" v-if="isShowTips">
            {{$t('i18n.lastTimeWatch') + parseInt(currentPlayTime / 60 % 60) + $t('i18n.minute') + parseInt(currentPlayTime % 60) + $t('i18n.goonPlay')}}
          </div>

          <!-- 提示浮层 -->
          <div v-if="showTip" class="tip_warp">
            <div class="tip_box">

              <!-- 课程无记录 播放图标 -->
              <div v-if="subject.myState == 3">
                <div class="start_learn_wrap" @click="filePreview(curChapter, curCourseware, $event)">
                  <div class="start_learn_triangle"></div>
                </div>
            </div>

              <!-- 课程有记录 继续观看 -->
              <div v-else-if="subject.state == 2 && showContinueTip">
                <p class="tip_last_learn">{{$t('i18n.recentlyLearned') + courseDetailData.recent.enclosureName}}</p>
                <div class="tip_btn" @click="filePreview(curChapter, curCourseware, $event)">{{$t('i18n.continueLearn')}}</div>
              </div>

              <!-- 课程已结束 -->
              <div v-else-if="subject.state == 3" class="tip_over">{{$t('i18n.courseEnd')}}</div>

            </div>
          </div>

        </div>
      </div>

      <!--tab选项卡-->
      <menu-tab-two
        class="qwui-nav_tabs top"
        :style="setTopStyle"
        :selectdata="selectData"
        @listenTabChange="showMsgFromCoursesTab"
      ></menu-tab-two>

      <!-- 介绍 -->
      <div v-if="selectData.index == 0" key="introduce" class="introduce_wrap">
        <div class="course_info mall_section">
          <h1 class="course_title">{{subject && subject.subjectName}}</h1>
          <p v-if="subject && subject.joinNum>=0" class="learn_num">{{subject && subject.joinNum + $t('i18n.hasStudy')}}</p>
        </div>
        <div class="coureContent_wrap mall_section">
          <h2 class="small_title">{{$t('i18n.courseIntroduce')}}</h2>
          <div class="content" v-html="subject.content"></div>
        </div>
        <div class="suitPeople_wrap mall_section">
          <h2 class="small_title">{{$t('i18n.suitPeople')}}</h2>
          <p class="suitPeople">{{subject.suit}}</p>
        </div>
        <div class="teacher_wrap mall_section">
          <h2 class="small_title">{{$t('i18n.teacherIntroduce')}}</h2>
          <ul class="teacher_list">
            <li
              class="teacher_item"
              v-for="teacher in teacherList"
              :key="teacher.id"
            >
              <teacher-info
                :headPic="teacher.headPic"
                :userName="teacher.userName"
                :position="teacher.position"
                :content="teacher.content"
              ></teacher-info>
            </li>
          </ul>
        </div>
        <!-- 评论列表 -->
        <comment-list
          :title="$t('i18n.leavingMessage')"
          :commentList="listComment.comments"
          :totalRow="listComment.commentsInfo.totalRows"
          :hiddenSwitch=true
          @atThisPersonUtil="getPersonDetail"
          @commentListImagesURL="commentListImagesURL"
          @delete="_delCourseCommentData"
        ></comment-list>

        <!--加载更多-->
        <load-more
          :loading="listComment.get.loading"
          :currPage="listComment.get.currPage"
          :maxPage="listComment.get.maxPage"
          @loadMoreClick="loadMoreList"
        >
          <span v-if="listComment.get.totalRows>0">{{$t('i18n.total') + listComment.get.totalRows + $t('i18n.commentTotal')}}</span>
          <span v-else>{{$t('i18n.noComment')}}</span>
        </load-more>

      </div>

      <!-- 目录 -->
      <div v-else key="directory" class="directory_wrap">
        <div
          class="chapter"
          v-for="(chapter, chap_index) of chapterList"
          :key="chapter.id">

          <!-- 章节头 -->
          <div class="chapter_bar" @click="slideUpDown(chap_index)">
            <p class="chapter_name fl">
              {{chapter.chapterName}}
            </p>
            <div class="chapter_state fr">
              <i :class="[{'slideDown': chapter.isShow}, 'upDown']"></i>
            </div>
          </div>

          <!-- 章节的课件列表 -->
          <ul class="chapter_list" v-show="chapter.isShow">
            <li
              class="courseware flex_box"
              v-for="(courseware, cour_index) of chapter.enclosureViewVOList"
              @click="filePreview(chap_index, cour_index, $event)"
              :key="courseware.enclosureId"
            >
              <div class="course_info flex_item">
                <p :class="['course_name', 'ellipsis', {'current_play': chap_index == curChapter && cour_index == curCourseware}]">
                  {{cour_index + 1}}.{{courseware.enclosureName}}
                </p>
                <p class="learn_time"><span>{{courseware.expend + $t('i18n.minutes')}} / </span>{{courseware.studyTime + $t('i18n.minutes')}}</p>
              </div>
              <div class="course_state">
                <circular-progress
                  class="progress"
                  :key="courseware.enclosureId"
                  :targetId="courseware.enclosureId"
                  :size="20"
                  :borderSize="3"
                  :proGress="courseware | getProgress"
                ></circular-progress>
              </div>
            </li>
          </ul>

        </div>

        <!-- 考试头 -->
        <div class="chapter_bar" v-if="examData.list.length" @click="slideUpDown">
          <p class="chapter_name fl">{{$t('i18n.test')}}</p>
          <div class="chapter_state fr">
              <i :class="[{'slideDown': examData.isShow}, 'upDown']"></i>
          </div>
        </div>

        <!-- 考试列表 -->
        <ul class="chapter_list" v-show="examData.isShow">
          <li
            class="courseware flex_box exam_wrap"
            v-for="(exam, exam_index) of examData.list"
            @click="enterExam(exam.examId)"
            :key="exam.examId"
          >
            <p class="exam_name ellipsis">
              {{exam_index + 1}}.{{exam.examName}}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 评论输入框组件 -->
    <chat-comment :listcomment="listComment"></chat-comment>

    <!--选择人组件-->
    <user-select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user-select>

    <!--个人信息-->
    <user-info ref="loadPersonalMsg"></user-info>

    <!--图片预览组件-->
    <preview-images :urls="imgUrls" :useWxPreview="false"></preview-images>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { formatDate } from '../../../../assets/js/time-util';
import MenuTabTwo from '@/components/button/menu_tab_two'; // nav组件
import ChatComment from '@/components/detail/chat_comment'
import LoadMore from '@/components/list/load_more';
import CommentList from '@/components/list/comment_list';
import TeacherInfo from '../../components/TeacherInfo';
import UserSelect from '@/components/base/user_or_dept_select';
import CircularProgress from '../../components/CircularProgress';
import UserInfo from '@/components/detail/user_info_card';//个人信息
import previewImages from "@/components/detail/previewImages";
import EventBus from '@/utils/eventBus';
import {
  getCourseDetailData,
  getCatalog,
  getFileType,
  getCourseCommentData,
  sendCourseCommentData,
  delCourseCommentData,
  getUserFlow,
  getVideoUrl,
  recordCourseTime,
  recordFlow,
  getManager,
  sendLearnTime,
} from '../../api/getData';

export default {
  name: 'CourseDetail',
  components:{
    CircularProgress,
    MenuTabTwo,
    TeacherInfo,
    ChatComment, // 评论输入框组件
    CommentList, // 评论列表
    previewImages,//图片预览组件
    UserInfo,
    UserSelect,
    LoadMore
  },
  filters:{
    // 计算组件进度
    getProgress: (courseware) => {
      if (courseware.studyTime === 0) {
        return courseware.expend > 0 ? 100 : 0;
      } else {
        return parseInt(courseware.expend / courseware.studyTime * 100);
      }
    }
  },
  data() {
    return {
      /*数据*/
      dataBase:dataBase,
      courseDetailData: { // 课程详情
        personCourse: { // 课程介绍数据
          teacherVOList: {} // 教师数据
        },
        recent: {} // 最近学习数据
      },
      chapterList: [], // 章节数据 数据结构：chapterList：[{name:'',enclosureViewVOList:[]}]
      examData: {isShow: false, list: []}, // 考试数据

      /* 评论列表 */
      listComment: { //评论
        get: {  //获取
          url: "/portal/learnonline/portalCourseAction!listMoreComment.action",
          loading: false,
          maxPage: 0,
          currPage: 1,
          totalRows: 0,
          // pageIndexName: "page",//当前分页参数名称
          data: {
            subjectId: '',
            pageSize: 10,
            page: 0
            // commentStatus: "1",//1显示全部，2只看评论
          },
        },
        send: { //发送
          url: "/portal/learnonline/portalCourseAction!addSubjectComment.action",
          contentObject: 'comment.content',//传送的内容字符串
          data: {
            userId: '',
            type: 1 // course_detail.js 第1018行有更改, 但从没调用, 需要了解这个参数意义【需改】
          }
        },
        delete: { //删除
          url: "/portal/learnonline/portalCourseAction!delCommentPO.action",
          commentId: "commentId",//需要传的id字段
          data: {}
        },
        comments: [], //评论数据列表
        commentsInfo: {}
      },

      /*设置*/
      showTip: true, // 是否显示浮窗
      firstClickCourse: true, // 第一次点击课件(跟最近学习有关，用于第一次点击同课)

      selectData: {
        index: 0,
        scroll: true,//是否开启滚动置顶功能
        nav: [  //@data：点击切换传递的数据
          {content: 'i18n.introduce', data: {type: 0}},
          {content: 'i18n.directory', data: {type: 1}}
        ]
      },

      /*杂项*/
      countTimer: null, // 计算时长的定时器
      timeNums: 0, // 计算当前音视频观看时长
      countFlowr: null, // 计算流量的定时器
      player: {}, // 腾讯播放器对象
      curChapter: -1, // 当前选中课件所在的章节index（从0开始）
      curCourseware: -1, // 当前选中课件index（从0开始）
      hasBuffered: 0, // 上一次请求前已经缓存的视频比率
      currentPlayTime: 0, // 该视频当前播放位置
      isShowTips: false, // 视频续播提示层是否显示
      //图片预览部分
      imgUrl: '',//图片无压缩地址
      compressUrl: '',//压缩图片地址
      imgUrls: [],//图片地址数组
      saveImgUrls: [], // 切换到目录时缓存的评论预览图片数组
      isFirstPicShow: false, //预览的图片是否已显示(隐藏时预览数组去掉第一个)
      //目前课件类型
      winHeight: 0, // 屏幕高度
      playVideo: false,
      videoAreaHeight: 0, // video_area的高度
      setTop: false, // 是否置顶设置nav,
    };
  },
  computed: {
    // 课程信息
    subject() {
      return this.courseDetailData.personCourse;
    },
    // 讲师信息
    teacherList() {
      return this.courseDetailData.personCourse.teacherVOList;
    },
    // 最近学习信息
    recentData() {
      return this.courseDetailData.recent;
    },
    // 显示继续学习提示
    showContinueTip() {
      // 原代码保险起见需要识别是否有课件名. 目前不清楚无课件名这场景是否有，保险先保留
      return  this.recentData.enclosureName.length > 0? true: false;
    },
    // 滚动区域
    scrollHeight() {
      return (this.winHeight - 49) + 'px';
    },
    // 填充nav置顶瞬间的高度差
    fillBottomStyle() {
      let fillBottomStyle = {
        // 44 是nav栏高度
        marginBottom: this.setTop ? '44px': 0
      };
      return fillBottomStyle;
    },
    // nav栏置顶样式
    setTopStyle() {
      let setTopStyle = {
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: '1'
      };
      return this.setTop? setTopStyle: {};
    },
  },
  created() {
    this.$nextTick(() => {
      // 视频区域禁止右键
      this.$refs.video_area.oncontextmenu=function(e){
        return false;
      }
    });

    let getCoursePromise, getCatalogPromise;

    // 一、获取章节目录/考试
    getCatalogPromise = new Promise((resolve, reject) => {
      getCatalog({courseId: this.$route.query.id}, data => {
        let length,
            chapterList = this.chapterList;

        /* 考试赋值 */
        if (Array.isArray(data.exam)) {
          this.examData.list.push.apply(this.examData.list, data.exam);
        } else {
          data.exam && this.examData.list.push(data.exam);// 考试赋值， undefined不赋值
        }
        this.examData.isShow = this.examData.list.length? true: false; // 设置章节的显示隐藏变量

        /* 章节赋值 */
        chapterList.push.apply(chapterList, data.chapter); // 章节赋值
        length = chapterList.length;
        for (let i = 0; i < length; i++) {// 设置章节的显示隐藏变量,默认显示
          this.$set(chapterList[i], 'isShow', true);
        }
        resolve();
      }, reject);
    });

    // 一、也同时请求课程详情数据
    getCoursePromise = new Promise((resolve, reject) => {
      getCourseDetailData({courseId: this.$route.query.id}, data => {
        /* 课程介绍  教师 和 最近学习数据赋值 */
        this.courseDetailData = data;

        // 评论课件id设置
        this.listComment.get.data.subjectId = data.personCourse.subjectId;
        this.listComment.send.data['comment.subjectId'] = data.personCourse.subjectId;

        // 用户userId设置
        this.listComment.send.data.userId = data.personCourse.userId;
        resolve();
      }, reject);
    });

    // 二、获取课程详情后，获取评论
    getCoursePromise.then(()=>{
      this.getComment();
    });

    // 二、最近课程 和 目录 获取完，开始定位目录的当前选中项
    Promise.all([getCoursePromise, getCatalogPromise]).then(() => {
      let i, j, nowChapter, nowCourse,
          recentId = this.recentData.enclosureId;

      if (!recentId) {return;} // 如果当前id无 则不用循环了

      for (i = this.chapterList.length - 1; i >= 0; i--) {
        nowChapter = this.chapterList[i];
        for (j = nowChapter.enclosureViewVOList.length - 1; j >= 0; j--) {
          nowCourse = nowChapter.enclosureViewVOList[j];

          if (nowCourse.enclosureId && nowCourse.enclosureId == recentId) {
            this.curChapter = i; // 当前选中课件所在的章节index（从0开始）
            this.curCourseware = j;   // 当前选中课件index（从0开始）
            break;
          }
        }
      }
    }).catch(err => {
      if(err && err.code == '441101') {
        this.$router.back();
      } else {
        throw(err);
      }
    });

  },
  mounted() {
    this.$nextTick(() => {
      this.videoAreaHeight = this.$refs.video_area.offsetHeight;

      // 兼容微信网页的前进后退栏弹出
      setTimeout(() => {
        this.winHeight = window.innerHeight;
      }, 100)
    });
  },
  methods: {
    ...mapActions([
      'getMallDetail'
    ]),
    ...mapMutations([
      'CLEAR_MALL_DETAIL'
    ]),

    // 得到正确的封面图URL
    getCoverUrl(url) {
      return  !url? '':
              url.includes('http') ? url : _.compressURL +  url;
    },
    //预览图片课件
    preview() {
      EventBus.$emit('previewImages',this.imgUrl);
    },
    // 显示隐藏章节
    slideUpDown(index) {
      if (typeof index == 'object') {
        this.examData.isShow = !this.examData.isShow;
      } else {
        this.chapterList[index].isShow = !this.chapterList[index].isShow;
      }
    },

    // 进入考试
    enterExam(examId) {
      window.location.href = _.baseURL + '/jsp/wap/examination/exam_detail.jsp?id=' + examId;
    },

    // 删除评论
    _delCourseCommentData(item, index) {
      let commentId = item.id ? item.id : item.commentId;
      delCourseCommentData({id: commentId}, (data) => {
        // 删除成功后，同步删除data内的评论数据
        this.listComment.comments.splice(index, 1);
      });
    },

    // 监听介绍和目录的切换
    showMsgFromCoursesTab(item, index) {
      if(index === 0) {
        this.imgUrls.push(this.saveImgUrls);
      } else if(index === 1) {
        this.saveImgUrls = this.isFirstPicShow ? this.imgUrls.splice(1) : this.imgUrls.splice(0);
      }
    },

/*=======================以上方法基本不用改=====================================*/
    // 获取课件类型
    _getFileType(enclosureId) {
      return new Promise((resolve, reject) => {
        getFileType({
        courseId: this.$route.query.id,
        enclosureId: enclosureId
      }, data => {
          resolve();
        });
      });
    },
    // 获取评论
    getComment() {
      // 获取下一页
      this.listComment.get.data.page++;
      getCourseCommentData(this.listComment.get.data, data => {
        this.loading = false;
        let i,
            listComment = this.listComment;

        // 留言数据的对象重封装个属性上去, 用于刚刚组件comment_list.vue的 dealTimeType
        for (i = data.CommentPager.length - 1; i >= 0; i--) {
          data.CommentPager[i].time = data.CommentPager[i].strCreateTime;
          data.CommentPager[i].status = 9;
        }

        // 留言数据存入
        listComment.comments.push.apply(listComment.comments, data.CommentPager);
        listComment.get.maxPage = data.maxPage;
        listComment.get.currPage = data.currPage;
        listComment.get.totalRows = data.totalRows;
        listComment.get.loading = false;

        // 留言页数其他信息存入(原本的紧耦合,导致数据结构得保留，不敢大改)
        delete data.CommentPager;
        listComment.commentsInfo = data;
      });
    },
    // 滚动更多列表
    scrollList(event){
      let scrollTop = event.target.scrollTop || window.pageYOffset || document.body.scrollTop;

      // 如果屏幕高度加上视频高度， 超过滚动页面高度， 则无需置顶了
      if (this.winHeight + this.videoAreaHeight >= this.$refs.scroll_wrap.scrollHeight) {
        this.setTop = false;
        return;
      }

      // 当前滚动高度与视频高度的差值（大于0即从nav栏开始计算高度）
      let relativeHeight = scrollTop - this.videoAreaHeight;

      this.setTop = relativeHeight >= 0? true: false; // 滚动到nav时 进行置顶设置。

      if (this.selectData.index) {return;} // 如果是目录 无需加载更多

      if (scrollTop + window.innerHeight >= this.$refs.scroll_wrap.scrollHeight) {
        if (!this.listComment.get.loading && this.listComment.get.currPage<this.listComment.get.maxPage) {
          this.currentPage++;
          this.loadMoreList();
        }
      }
    },
    // 加载更多列表
    loadMoreList() {
      this.listComment.get.loading = true;
      this.getComment();
    },
    // 处理详情的全部图片src
    commentListImagesURL(urls){
      // 初始化预览图片数组
      this.imgUrls = this.isFirstPicShow ? [this.imgUrls[0]] : [];
      this.imgUrls.push(...urls);
    },
    // 点击预览课件， fileType : 1:图片 2：音频 3：视频 4：文档 5：图文 6：外部链接
    filePreview(par_index, index, event) {
      let chapter = this.chapterList[par_index]; // 章节数据
      let courseware = chapter.enclosureViewVOList[index]; // 课件数据
      let courseFlow = courseware.fileSize; // 课件总大小（用于计算流量）

      // 浮窗关闭
      this.showTip = false;

      // 第一次点击课程，不用判断是否同一课件。(因为一开始还没开始阅读，点击课件仅开始而已)
      if (this.firstClickCourse) {
        this.firstClickCourse = false;
      } else {
        // 如果点击的是同一个课件，图片需要展示，然后和其一样return
        if (this.curChapter === par_index && this.curCourseware === index) {
          courseware.fileType === 1 && this.preview();
          return false;
        }
      }

      // 音/视频需要回到顶部
      if (courseware.fileType === 2 || courseware.fileType === 3) {
        this.$refs.scroll_wrap.scrollTop = 0;
      }

      // 与商城详情页不同，需要先请求课件数据类型（叶哥说后台有进行操作，
      // 在播放前请求一下就行
      this._getFileType(courseware.enclosureId).then(() => {

        // 如果是音频和视频
        if (courseware.fileType === 2 || courseware.fileType === 3) {
          // 点一次视频时候去掉第一个预览图片
          if(this.isFirstPicShow) {
            this.imgUrls.shift();
            this.isFirstPicShow = !this.isFirstPicShow;
          }
          this.playVideo = true;
          // 查询流量是否足够
          getUserFlow({}, data => {
            let totalFlow = data.volumeFlow.volumeFlowInfoPO.overplusFlow; // 企业目前剩余流量
            let lastTenflag = false; // 音视频是否到了最后十秒

            // 当流量足够时
            if (courseFlow <= totalFlow) {
              // 获取音视频真实url
              getVideoUrl({
                id: courseware.enclosureId,
              }, data => {
                // 清空原音视频并清除原定时器
                let playBox = this.$refs.video_box;
                playBox.innerHTML = '';
                clearInterval(this.countTimer);

                // 选中课件
                this.curChapter = par_index;
                this.curCourseware = index;

                // 播放器控件，移动端则使用system才能满足全屏，pc端试用default防止出现下载按钮
                let controls = '';
                if(_.isWeChatApp() || _.isQiyeweixinApp()) {
                  controls = 'system';
                } else {
                  controls = 'default';
                }

                // 新建腾讯播放器
                this.player = new TcPlayer('preview_video', {
                  "m3u8": data.url.replace('http:', '').replace('https:', ''), //请替换成实际可用的播放地址
                  "flash": false,
                  "live": false, // 点播
                  "autoplay": true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
                  "x5_player": true,
                  "width": '100%', //视频的显示宽度，请尽量使用视频分辨率宽度
                  "height": '100%', //视频的显示高度，请尽量使用视频分辨率高度
                  "controls": controls,
                  listener:  this.videoListener(courseware) // 设置监听事件
                });

                // 记录当前音视频学习时长(免费课程才需要)
                this.timeNums = 0;
                this.countTimer = setInterval(() => {
                  // 正在播放则累计+1
                  this.player.playing() && this.timeNums++;

                  // 每累计观看一分钟上传一次
                  this.timeNums > 59 && this.recordTimelearn(chapter, courseware);

                  // 到了音视频结束前十秒时，计算上一次发送请求后到现在看的时长是否超过30秒，超过记一分钟，不超过舍去
                  if (!lastTenflag && (this.player.duration() - this.player.currentTime() <= 10)) {
                    lastTenflag = !lastTenflag;
                    this.timeNums >= 30 ? this.recordTimelearn(chapter, courseware) : this.timeNums = 0;
                  }
                }, 1000);

                // 记录当前音视频流量
                let logId = null; // 接口日志参数，第一次不用传，第二次开始用返回的id传回去
                let fromTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'); // 接口参数，从何时开始统计
                this.countFlowr = setInterval(() => {
                  let totalBuffer = this.player.buffered(); // 当前该视频所有已缓存比率（0-1）
                  let loadBuffer = totalBuffer - this.hasBuffered; // 上次请求后该视频新的缓存比率（0-1）
                  let bufferSize = parseInt(loadBuffer * courseFlow); // 本次请求需要扣除的流量
                  let toTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'); // 接口参数，统计到什么时候
                  this.hasBuffered = totalBuffer; // 记录已缓存比率

                  // 全部缓冲完成时清除定时器
                  totalBuffer >= courseFlow && clearInterval(this.countFlowr)

                  // 有缓冲数据时发送请求
                  if (bufferSize > 0) {
                    recordFlow({
                      id: logId,
                      mediaId: courseware.enclosureId,
                      flow: bufferSize,
                      fromTime: fromTime,
                      toTime: toTime,
                      'searchValue.agentcode': 'learnonline'
                    }, data => {
                      logId = data.id;
                    });
                  }
                  fromTime = toTime;
                }, 10000);
              });
            } else {
              _.alert('i18n.tips', 'i18n.flowNotEnough', 'i18n.sureBtn');
            }
          });
        } else if(courseware.fileType === 1){
          // 清除picfixed属性，方便v-picfix指令根据新的预览图片重新居中新图片
          this.$refs.previewImages && this.$refs.previewImages.removeAttribute('picfixed');
          this.playVideo = false;
          // 选中课件
          this.curChapter = par_index;
          this.curCourseware = index;
          //预览当前课件图片
          this.compressUrl = this.getCoverUrl(courseware.url);
          this.imgUrl = courseware.url;
          let obj = {
            src: '',
            picPath: ''
          };
          obj.src = this.getCoverUrl(courseware.url);
          obj.picPath = courseware.url;
          //每一次操作之前都要先把第一个删除thi
          if(this.isFirstPicShow) {
            this.imgUrls.shift();
          }
          //必须放在第一个位置
          this.imgUrls.unshift(obj);
          this.isFirstPicShow = true;
          EventBus.$emit('previewImages',this.imgUrl);
          //每6秒加1
          let indexReadTime = 0;
          //每一分钟过后清0
          let tenForme = 0;
          clearInterval(this.countTimer);
          this.countTimer = setInterval(() => {
            indexReadTime++;
            tenForme++;
            if((tenForme*6)>=60){
              tenForme=0;
              //判断课程是否完成
              if(courseware.expend >= (courseware.studyTime - 1)){
                courseware.state = 5;
              }
              //满1分钟上传一次参数
              sendLearnTime({
                courseId: this.subject.courseId,
                enclosureId: courseware.enclosureId,
                expend: 1,
                lastRate: 0,
                finish: courseware.state
              }, data => {
                courseware.expend++;
              });
            }
          }, 6000)
        } else {
          // 选中课件
          this.curChapter = par_index;
          this.curCourseware = index;
          let isHttps = courseware.url.includes(_.wxqyh_scheme);
          //外链为https协议并且在个人网页版打开
          if(courseware.fileType === 6 && isHttps && !(_.isWeChat() || _.isQiyeweixin()|| _.isHefeixin())){
            //提示：个人网页版暂不支持https外链的学习
            _.alert(this.$t('i18n.notice'), this.$t('i18n.noSuppot') + _.wxqyh_scheme + this.$t('i18n.outChain'), this.$t('i18n.confirm'));
          }else {
            //跳转到预览组件
            this.$router.push({ name: 'learn_detail', params: { id : this.subject.courseId , enclosureId : courseware.enclosureId } });
          }
        }
      });

    },
    // 发送计算时长请求, chapter：章节的数据, courseware: 课件的数据
    recordTimelearn(chapter, courseware) {
      this.timeNums = 0;
      // 计算看到百分之多少
      let lastRate = (this.player.currentTime() / this.player.duration()).toFixed(2);
      //判断课程是否完成
      if(courseware.expend >= (courseware.studyTime-1)){
        courseware.state = 5;
      }
      recordCourseTime({
        courseId: this.$route.query.id, // 开课id
        enclosureId: courseware.enclosureId, // 课程id
        expend: 1, // 看了多少分钟（目前固定1分钟请求一次）
        lastRate: lastRate, // 该课件已经看了多少比例（0-1）
        finish: courseware.state// 该课程是否完成标识，5表示已完成
      }, data => {
        courseware.expend++;
      })
    },
    // 试看的执行函数
    videoListener(courseware) {
      let self = this; // 内部监听事件需要用到外边的this对象
      return function (msg) {
        if(msg.type == 'load') {
          this.currentTime(parseInt(this.duration() * courseware.recentRate));
        }
        // 监听时长已获取到
        if(msg.type == 'loadeddata') {
          // 继续播放
          self.goOnPlay(courseware);
        }
      }
    },
    // 继续上次播放
    goOnPlay(courseware) {
      // 如果从头开始观看，则不需提示
      if (courseware.recentRate == 0) {
        return false;
      } else {
        let currtentTime = parseInt(this.player.duration() * courseware.recentRate);
        this.player.currentTime(currtentTime);
        this.currentPlayTime = currtentTime;
        this.isShowTips = true;
        setTimeout(() => {
          this.isShowTips = false;
        }, 3000);
      }
    },
    //查看个人信息
    getPersonDetail(creator) {
      if(creator){
        this.$refs.loadPersonalMsg.showUserMessage(creator);
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 组件离开前清除定时器
    clearInterval(this.countTimer);
    clearInterval(this.countFlowr);
    if(to.name !== 'manager_list') {
      // 切换时将vuex中的数据清除，防止出现闪烁问题
      this.CLEAR_MALL_DETAIL();
    }
    next();
  }
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-courseDetail {
  .qwui-nav_bar .active {
    color: #458be9;
    border-bottom: 3px solid #458be9;
  }
  .scroll_wrap {
    overflow-y: auto;

    /* 顶部区域 */
    .preview_wrap {
      width: 100%;
      .video_wrap {

        @include cover-wrap('../../../../assets/images/default_bg.png');

        .video_view, .tip_warp {
          position: absolute;
          left: 0;
          top: 0;
          &, .video_box {
            width: 100%;
            height: 100%;
          }
        }
        .tip_warp {
          background-color: rgba(0, 0, 0, .6);
          .tip_box {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            width: 290px;
            height: 80px;
            margin: auto;
            font-size: 16px;
            color: #fff;
            text-align: center;
            .tip_last_learn {
              font-size: 14px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .tip_btn {
              width: 105px;
              height: 36px;
              margin: 20px auto 0;
              font-size: 15px;
              line-height: 36px;
              border: 1px solid #fff;
              border-radius: 18px;
              background-color: rgba(31, 34, 36, .5);
            }
            .tip_over {
              position: absolute;
              top: 0;
              right: 0;
              left: 0;
              bottom: 0;
              width: 290px;
              height: 24px;
              margin: auto;
            }
            .start_learn_wrap {
              position: absolute;
              top: 0;
              right: 0;
              left: 0;
              bottom: 0;
              width: 70px;
              height: 70px;
              margin: auto;
              border: 1px solid #fff;
              border-radius: 50%;
              background: #1F2224;

              .start_learn_triangle {
                position: absolute;
                top: 0;
                right: 0;
                left: 20px;
                bottom: 0;
                width: 70px;
                height: 70px;
                margin: auto;
                width: 0;
                height: 0;
                border-width: 15px;
                border-left-width: 23px;
                border-style: solid;
                border-color: transparent transparent transparent #fff;
              }
            }
          }
        }
        .goOnTips {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 24px;
          line-height: 24px;
          padding-left: 10px;
          font-size: 13px;
          text-align: left;
          color: #fff;
          background: rgba(26,26,26,.75);
          -webkit-transition: bottom .3s ease;
          transition: bottom .3s ease;
          z-index: 9;
        }
      }
    }

    /* 介绍 */
    .introduce_wrap {
    /* 介绍中每个模块公用的 */
      .mall_section {
        margin-bottom: 10px;
        padding: 15px;
        background-color: #fff;
        &:last-child {
          margin-bottom: 0;
        }
        .small_title {
          font-family: 'PingFang-SC-Medium';
          font-size: 18px;
          color: #333;
        }
      }
      .course_info {
        .course_title {
          margin-bottom: 6px;
          font-family: 'PingFang-SC-Medium';
          font-size: 19px;
          color: #333;
        }
        .learn_num {
          margin-bottom: 10px;
          font-size: 13px;
          color: #999;
        }
        .free {
          font-size: 18px;
          color: #45a8f5;
        }
        .const {
          font-size: 18px;
          color: #fa9025;
          .money {
            font-size: 14px;
          }
        }
      }
      .coureContent_wrap {
        .small_title {
          margin-bottom: 8px;
        }
        .content {
          font-size: 14px;
          color: #666;
          overflow: hidden;
        }
      }
      .suitPeople_wrap {
        .small_title {
          margin-bottom: 4px;
        }
        .suitPeople {
          font-size: 14px;
          color: #666;
        }
      }
    }
    .btn_height {
      width: 100%;
      height: 75px;
    }
  }

  /* 目录区域 */
  .directory_wrap {
    .chapter_bar {
      height: 40px;
      padding: 0 15px;
      line-height: 40px;
      background-color: rgb(245,245,245);
      .chapter_name {
        font-size: 14px;
        color: rgb(153, 153, 153);
      }
      .chapter_state {
        color: #999;
        .upDown {
          display: inline-block;
          width: 10px;
          height: 6px;
          margin-left: 4px;
          background: url('../../../../assets/images/ic_down.png') no-repeat;
          background-size: cover;
          transition: .3s;
          &.slideDown {
            transform: rotate(180deg);
          }
        }
      }
    }

    /* 目录列表 */
    .chapter_list {
      padding-left: 15px;
      background-color: #fff;
      .courseware {
        height: 65px;
        cursor: pointer;

        @include border-b-1px(#ddd);

        &:last-child:after {
          border-top: none;
        }
        .course_info {
          min-width: 0;
          .course_name {
            padding-top: 12px;
            font-size: 16px;
            color: #333;
          }
          .current_play {
            color: #45A8F5;
          }
          .learn_time {
            font-size: 13px;
            color: #999;
          }
        }
        .course_state {
          position: relative;
          width: 70px;
          .progress, .lockFlag, .ableTryBtn {
            position: absolute;
            top: 0;
            right: 15px;
            bottom: 0;
            margin: auto;
          }
          .lockFlag {
            font-size: 18px;
            line-height: 65px;
          }
          .ableTryBtn {
            width: 53px;
            height: 24px;
            line-height: 24px;
            color: #45A8F5;
            border-radius: 5px;
            border: 1px solid #45A8F5;
            text-align: center;
          }
        }
        &.active {
          .course_name {
            color:rgb(86, 145, 198);
          }
        }

      }
      .exam_wrap  {
        height: 40px;
        .exam_name  {
          padding-top: 8px;
          font-size: 16px;
          color: #333;
        }
      }


    }
  }
  .wantLearn_btn {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 15px;
    width: 260px;
    height: 44px;
    margin: auto;
    line-height: 42px;
    text-align: center;
    color: #fff;
    font-size: 17px;
    border-radius: 22px;
    background-color: #45a8f5;
    box-shadow: 0 2px 10px 0 rgba(75, 232, 255, 0.4);
    .iconfont {
      position: relative;
      left: 2px;
      bottom: -2px;
      font-size: 18px;
    }
  }
}
/* 隐藏按钮 */
video::-internal-media-controls-download-button {
    display:none;
}

video::-webkit-media-controls-enclosure {
    overflow:hidden;
}

video::-webkit-media-controls-panel {
    width: calc(100% + 50px);
}
</style>
