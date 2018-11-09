<template lang="html">
  <div class="wrap qwui-mallDetail" :style="{ height: winHeight + 'px'}">
    <div class="wrap_inner" @scroll="scrollList" ref="scroll_wrap">
      <!-- 顶部预览区域 -->
      <div class="preview_wrap" :style="fillBottomStyle" ref="video_area">
        <div class="video_wrap">
          <!-- 封面 -->
          <div class="cover_wrap">
            <img
              class="cover"
              v-if="getCoverUrl(subject.subjectCover)"
              :src="getCoverUrl(subject.subjectCover)"
              v-picfix
            >
          </div>
          <!-- 音视频预览区域 -->
          <div id="sourcevid" class="video_view" v-if="playVideo">
            <div
              id="preview_video"
              class="video_box"
              ref="video_box"
            ></div>
          </div>
          <!--图片预览区域-->
          <div class="cover_wrap" v-else>
            <img
              class="previewImages"
              :src="compressUrl"
              v-picfix
              @click="preview"
            >
          </div>
          <!-- 购买浮层 -->
          <div v-if="isShowBuy" class="buy_course_warp">
            <div class="buy_box">
              <p class="end_tips">{{$t('i18n.trySeeEnd')}}</p>
              <div class="buy_course_btn" @click="wantBuy">{{$t('i18n.buy')}}</div>
            </div>
          </div>
          <!-- 续播提示 -->
          <div class="goOnTips" v-if="isShowTips">
            {{$t('i18n.lastTimeWatch') + parseInt(currentPlayTime / 60 % 60) + $t('i18n.minute') + parseInt(currentPlayTime % 60) + $t('i18n.goonPlay')}}
          </div>
        </div>
      </div>

      <!--tab选项卡-->
      <menu-tab-two
        class="qwui-nav_tabs top"
        :style="setTopStyle"
        :selectdata="selectData"
      ></menu-tab-two>

      <!-- 介绍 -->
      <div v-if="selectData.index == 0" key="introduce" class="introduce_wrap">
        <div class="course_info mall_section">
          <h1 class="course_title">{{subject && subject.subjectName}}</h1>
          <p v-if="subject && subject.totalLearnerNum>=0" class="learn_num">{{subject && subject.totalLearnerNum}}{{$t('i18n.hasStudy')}}</p>
          <p v-if="isFree" class="free">{{$t('i18n.free')}}</p>
          <p v-else class="const">
            <span class="money">￥</span>{{subject && subject.priceStr | parsePrice}}/{{$t('i18n.personPerYear')}}
          </p>
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
              >
              </teacher-info>
            </li>
          </ul>
        </div>
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
              v-for="(courseware, cour_index) of chapter.enclosureVOs"
              @click="filePreview(chap_index, cour_index, $event)"
              :key="courseware.enclosureId"
            >
              <div class="course_info flex_item">
                <p :class="['course_name', 'ellipsis', {'current_play': chap_index == curChapter && cour_index == curCourseware}]">
                  {{cour_index + 1}}.{{courseware.file_name}}
                </p>
                <p class="learn_time"><span v-if="isFree">{{courseware.expend + $t('i18n.minutes')}} / </span>{{courseware.studyTime + $t('i18n.minutes')}}</p>
              </div>
              <div class="course_state">
                <circular-progress
                  class="progress"
                  v-if="isFree"
                  :targetId="courseware.id"
                  :size="20"
                  :borderSize="3"
                  :proGress="courseware | getProgress"
                >
                </circular-progress>
                <span v-else>
                  <i v-if="!courseware.trySeeTime" class="iconfont icon-peixunxuexi_suoding lockFlag"></i>
                  <span v-else class="ableTryBtn">{{$t('i18n.canTrySee')}}</span>
                </span>
              </div>
            </li>
          </ul>

        </div>
      </div>
      <!-- 底部想学高度 -->
      <div v-if="!isFree" class="btn_height"></div>
    </div>

    <!-- 想学按钮 -->
    <div
      class="wantLearn_btn"
      v-if="!isFree"
      @click="wantBuy"
    >
      {{$t('i18n.wantLearn')}}
    </div>

    <!--图片预览组件-->
    <preview-images :urls="imgUrls" :useWxPreview="false"></preview-images>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import { getUserFlow, getVideoUrl, recordLearnTime, recordFlow, getManager } from '../../api/getData';
import { formatDate } from '../../../../assets/js/time-util';
import MenuTabTwo from '@/components/button/menu_tab_two'; // nav组件
import teacherInfo from '../../components/TeacherInfo';
import circularProgress from '../../components/CircularProgress';
import previewImages from "@/components/detail/previewImages";
import axios from 'axios';
import EventBus from '@/utils/eventBus';

export default {
  name: 'MallDetail',
  components:{
    circularProgress,
    MenuTabTwo,
    previewImages,
    teacherInfo
  },
  filters:{
    // 计算组件进度
    getProgress: (courseware) => {
      if (courseware.studyTime === 0) {
        return courseware.expend > 0 ? 100 : 0;
      } else {
        return parseInt(courseware.expend / courseware.studyTime * 100);
      }
    },
    parsePrice(value) { // 价格处理，非0元则处理返回，否则返回免费
      return value.includes('.00') ? value.replace('.00', '') : value;
    }
  },
  data() {
    return {
      isFree: true, // 课程是否免费
      selectData: {
        index: 0,
        scroll: true,//是否开启滚动置顶功能
        nav: [  //@data：点击切换传递的数据
          {content: 'i18n.introduce', data: {type: 0}},
          {content: 'i18n.directory', data: {type: 1}}
        ]
      },

      countTimer: null, // 计算时长的定时器
      imgUrl : '',//图片无压缩地址
      compressUrl: '',//压缩图片地址
      imgUrls: [],//图片地址
      timeNums: 0, // 计算当前音视频观看时长
      countFlowr: null, // 计算流量的定时器
      player: {}, // 腾讯播放器对象
      curChapter: -1, // 当前选中课件所在的章节index（从0开始）
      curCourseware: -1, // 当前选中课件index（从0开始）
      hasBuffered: 0, // 上一次请求前已经缓存的视频比率
      isShowBuy: false, // 是否显示观看结束提示购买的浮层
      managerData: {}, // 管理员数据
      currentPlayTime: 0, // 该视频当前播放位置
      isShowTips: false, // 视频续播提示层是否显示
      showCover: true, // 是否显示封面图
      playVideo: false, // 是否正在观看音视频课件
      winHeight: 0, // 屏幕高度
      videoAreaHeight: 0, // video_area的高度
      menuTabHeight: 0, // nav公共组件栏的高度
      setTop: false, // 是否置顶设置nav,
    }
  },
  computed: {
    ...mapState([
      'mallDetailData'
    ]),
    // 课程信息
    subject() {
      return this.mallDetailData.subject;
    },
    // 讲师信息
    teacherList() {
      return this.mallDetailData.teacherRefPOList;
    },
    // 章节信息
    chapterList() {
      return this.mallDetailData.chapterEnclosureListVOList;
    },
    // 填充nav置顶瞬间的高度差
    fillBottomStyle() {
      let fillBottomStyle = {
        // 44 是nav栏高度
        marginBottom: this.setTop? '44px': 0
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

    this.getMallDetail(this.$route.query.id).then(() => {
      // 当前课程是否免费
      this.isFree = this.subject.price === 0 ? true : false;

      // 设置章节的显示隐藏变量,默认显示
      let length = this.chapterList;
      for (let i = 0; i < length; i++) {
        this.$set(this.chapterList[i], 'isShow', true);
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
      return url ? url.includes('http') ? url : _.compressURL +  url : url;
    },
    // 显示隐藏章节
    slideUpDown(index) {
      this.chapterList[index].isShow = !this.chapterList[index].isShow ;
    },
    // 滚动事件
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
    },
    // 点击预览课件， fileType : 1:图片 2：音频 3：视频 4：文档 5：图文 6：外部链接
    filePreview(par_index, index, event) {
      this.isShowBuy = false;
      let chapter = this.chapterList[par_index]; // 章节数据
      let courseware = chapter.enclosureVOs[index]; // 课件数据
      let courseFlow = courseware.fileSize; // 课件总大小（用于计算流量）

      // 如果点击的是同一个课件，或者是付费的课程且该课件不可试看则return
      if (this.curChapter === par_index && this.curCourseware === index || !this.isFree && !courseware.trySeeTime) {
        if(!this.isFree && !courseware.trySeeTime) {
          _.tooltips_succeed("i18n.canotTrySee", true, '', 3000);
        } else {
          courseware.fileType === 1 && this.preview();
        }
        return false;
      }

      // 如果是音频和视频
      if (courseware.fileType === 2 || courseware.fileType === 3) {
        // 音/视频需要回到顶部
        this.$refs.scroll_wrap.scrollTop = 0;

        this.playVideo = true;
        // 查询流量是否足够
        getUserFlow({}, data => {
          let totalFlow = data.volumeFlow.volumeFlowInfoPO.overplusFlow; // 企业目前剩余流量
          let lastTenflag = false; // 音视频是否到了最后十秒
          let trySeeTime = parseInt(courseware.trySeeTime); // 课件试看时间

          // 当流量足够时
          if (courseFlow <= totalFlow) {

            // 获取音视频真实url
            getVideoUrl({
              id: courseware.id,
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
                listener: this.videoListener(courseware) // 设置监听事件
              });

              // 记录当前音视频学习时长(免费课程才需要)
              if (this.isFree) {
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
              }

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
                    mediaId: courseware.id,
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
        //每一次操作之前都要先把第一个删除
        this.imgUrls.shift();
        //必须放在第一个位置
        this.imgUrls.unshift(obj);
        EventBus.$emit('previewImages',this.imgUrl);
        //免费课程记录学习时长
        if(this.isFree){
          //每6秒加1
          let indexReadTime = 0;
          //每一分钟过后清0
          let tenForme = 0;
          clearInterval(this.countTimer);
          this.countTimer = setInterval(() => {
            indexReadTime++;
            tenForme++;
            if((tenForme*6)>=60){
              courseware.expend++;
              tenForme=0;
              //满1分钟上传一次参数
              recordLearnTime({
                subjectId: chapter.subjectId, //课件id
                enclosureId: courseware.id, // 课程id
                expend: 1, // 看了多少分钟（目前固定1分钟请求一次）
                lastRate: 0, // 该课件已经看了多少比例（0-1）
              }, () => {})
            }
          }, 6000)
        }
      }else {
        // 选中课件
        this.curChapter = par_index;
        this.curCourseware = index;
        let isHttps = courseware.url.includes(_.wxqyh_scheme);
        //外链为https协议并且在个人网页版打开
        if(courseware.fileType === 6 && isHttps && !(_.isWeChat() || _.isQiyeweixin()|| _.isHefeixin())){
          //提示：个人网页版暂不支持https外链的学习
          _.alert(this.$t('i18n.notice'), this.$t('i18n.noSuppot') + _.wxqyh_scheme + this.$t('i18n.outChain'), this.$t('i18n.confirm'));
        }else {
          let url = encodeURIComponent(courseware.url);
          //跳转到预览组件
          this.$router.push({
            name: 'preview_detail', params: {} ,query: {
              fileUrl: url || 'default', fileName: courseware.file_name, fileType: courseware.fileType,
              fileId: courseware.id, isFree: this.isFree, subjectId: chapter.subjectId
            }
          });
        }
      }
    },
    //预览图片课件
    preview() {
      EventBus.$emit('previewImages',this.imgUrl);
    },
    // 发送计算时长请求, chapter：章节的数据, courseware: 课件的数据
    recordTimelearn(chapter, courseware) {
      this.timeNums = 0;
      // 计算看到百分之多少
      let lastRate = (this.player.currentTime() / this.player.duration()).toFixed(2);
      recordLearnTime({
        subjectId: chapter.subjectId, //课件id
        enclosureId: courseware.id, // 课程id
        expend: 1, // 看了多少分钟（目前固定1分钟请求一次）
        lastRate: lastRate, // 该课件已经看了多少比例（0-1）
      }, data => {
        courseware.expend++;
      })
    },
    // 事件监听函数
    videoListener(courseware) {
      let self = this; // 内部监听事件需要用到外边的this对象
      return function (msg) {
        let trySeeTime = parseInt(courseware.trySeeTime);
        // 付费课程监听事件
        if(!self.isFree) {
          // 当有限制试看时长时，监听时间变化事件
          if(msg.type == 'timeupdate' && trySeeTime > 0) {

            //定时器
            let watchTimeChange = true;
            trySeeTime = trySeeTime * 60;
            //监听播放的或者拖动的时候检测是否超过试看时间，超过则终止
            if (watchTimeChange && this.currentTime() >= trySeeTime) {
              // 暂停并显示提示购买浮层
              watchTimeChange = false;
              this.pause();
              self.isShowBuy = true;
              setTimeout(() => {
                watchTimeChange = true;
              }, 1000);
            }
          }
          // 所有付费课程一旦结束都显示购买浮层
          if(msg.type == 'ended') {
            self.isShowBuy = true;
          }
        // 免费课程的监听事件
        } else {
          // 监听时长已获取到
          if(msg.type == 'load') {
            this.currentTime(parseInt(this.duration() * courseware.recentRate));
          }
          if(msg.type == 'loadeddata') {
            self.goOnPlay(courseware);
          }
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
    // 点击购买请求按钮,跳转到管理员列表
    wantBuy() {
      this.$router.push({
        name: 'manager_list',
        query: {
          cover: this.subject.subjectCover,
          name: this.subject.subjectName,
          id: this.$route.query.id
        }
      });
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

.qwui-mallDetail {
  .qwui-nav_bar .active {
    color: #458be9;
    border-bottom: 3px solid #458be9;
  }
  .wrap_inner {
    height: 100%;
    overflow-y: auto;

    /* 顶部区域 */
    .preview_wrap {
      width: 100%;
      .video_wrap {

        @include cover-wrap('../../../../assets/images/default_bg.png');

        .video_view, .buy_course_warp {
          position: absolute;
          left: 0;
          top: 0;
          &, .video_box {
            width: 100%;
            height: 100%;
          }
        }
        .buy_course_warp {
          background-color: rgba(0, 0, 0, .6);
          .buy_box {
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            width: 225px;
            height: 80px;
            margin: auto;
            .end_tips {
              font-size: 14px;
              color: #fff;
              text-align: center;
            }
            .buy_course_btn {
              width: 105px;
              height: 36px;
              margin: 20px auto 0;
              line-height: 36px;
              color: #fff;
              text-align: center;
              font-size: 15px;
              border: 1px solid #fff;
              border-radius: 18px;
              background-color: rgba(31, 34, 36, .5);
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
          font-size: 18px;
          color: #333;
        }
      }
      .course_info {
        .course_title {
          margin-bottom: 6px;
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
    .chapter {
      .chapter_bar {
        height: 40px;
        padding: 0 15px;
        line-height: 40px;
        background-color: rgba(245,245,245,1);
        .chapter_name {
          font-size: 14px;
          color: rgba(153, 153, 153, 1);
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
              color:rgba(86, 145, 198, 1);
            }
          }
        }
      }
    }
  }
  .wantLearn_btn {
    position: fixed;
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
