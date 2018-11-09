<template>
  <div class="qwui-lean_search_course" @click.capture="banClick">
    <!--tab选项卡-->
    <header class="qwui-nav_tabs top fixed_set_top">
      <menu-tab-two
        :selectdata="selectData"
        @listenTabChange="showMsgFromCoursesTab"
      ></menu-tab-two>
    </header>

    <!-- 搜索课程内容 -->
    <div class="search_content">
        <!-- 课程列表 -->
        <div v-show="coursesTabIndex === 0">
          <section  class="course_list">
            <qw-course-item
              v-for="item in courseData.pageData"
              :item="item"
              :key="item.courseId"
            >
              <div class="item_section" slot="section">
                <div class="item_section_people clearfix">
                  <i class="iconfont icon-peixunxuexi_renshu"></i>
                  {{item.studyTime + $t('i18n.hasStudy')}}
                  <span class="item_section_price" :class="{free: item.price == '0'}">{{parsePrice(item.priceStr)}}</span>
                </div>
              </div>
            </qw-course-item>
          </section>

          <!-- 加载更多组件 -->
          <load-more
            :loading="courseData.loading"
            :maxPage="courseData.maxPage"
            :currPage="courseData.currPage"
            :borderTop=false
            colorType="transparent"
            @loadMoreClick="loadMoreList"
          >
            <span>{{$t('i18n.nomore')}}</span>
          </load-more>
        </div>


        <!-- 学习任务 -->
        <div v-show="coursesTabIndex === 1" class="learn_task">
          <!-- 必学课 -->
          <section  class="course_list"
                v-if="mustCourse && mustCourse.length">
            <p class="course_type">{{$t('i18n.mustLearn')}}</p>
            <!-- 必学课列表 -->
            <qw-course-item
              v-for="item in mustCourse"
              :item="item"
              :hiddenEndClass=true
              :key="item.id"
            >
              <!-- 进度圈插槽 -->
              <div class="item_rate" slot="rate">
                <!-- 进度圈 -->
                <circular-progress
                  :targetId="item.id"
                  :proGress="item.rate"
                  :font="getFont(item)"
                ></circular-progress>
                <!-- 进度圈下方补充说明 -->
                <p class="item_status">{{item.rate == 100? $t('i18n.completed'): $t('i18n.studied')}}</p>
              </div>

              <!-- 补充信息插槽 -->
              <div class="item_section" slot="section">
                <!-- 截止时间 -->
                <div class="clearfix">
                  {{getEndTime(item) + ' ' + $t('i18n.asOf')}}
                  <span class="item_section_time">{{getTimeDesc(item)}}</span>
                </div>
              </div>

            </qw-course-item>
          </section>
          <!-- 选学课 -->
          <section class="course_list"
                v-if="mustNotCourse && mustNotCourse.length">
            <p class="course_type">{{$t('i18n.choseLearn')}}</p>
            <!-- 选学课列表 -->
            <qw-course-item
              v-for="item in mustNotCourse"
              :item="item"
              :hiddenEndClass=true
              :key="item.id"
            >
              <!-- 进度圈插槽 -->
              <div class="item_rate" slot="rate">
                <!-- 进度圈 -->
                <circular-progress
                  :targetId="item.id"
                  :proGress="item.rate"
                  :font="getFont(item)"
                ></circular-progress>

                <!-- 进度圈下方补充说明 -->
                <p class="item_status">{{item.rate == 100? $t('i18n.completed'): $t('i18n.studied')}}</p>
              </div>

            </qw-course-item>
          </section>
        </div>
    </div>
  </div>
</template>

<script>
import MenuTabTwo from '@/components/button/menu_tab_two'; // nav选项菜单组件
import QwCourseItem  from '../../components/CourseItem';
import CircularProgress from '../../components/CircularProgress';
import LoadMore from '@/components/list/load_more'; // 加载更多组件

export default {
  name: 'SearchCourse',
  components: {
    MenuTabTwo,
    QwCourseItem,
    CircularProgress,
    LoadMore
  },
  props: {
    contentData: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      /*database配置数据*/
      selectData: dataBase.search.coursesTabData,

      /*该组件使用数据*/
      canClick: false // 是否准许点击 （src在渲染后
    }
  },
  computed:{
    // 当前下标，用来tab切换显示
    coursesTabIndex() {
      return this.selectData.index;
    },
    courseData() {
      return this.contentData.course;
    },
    mustCourse() {
      return this.contentData.learnTasks.mustCourse;
    },
    mustNotCourse() {
      return this.contentData.learnTasks.mustNotCourse;
    },
  },
  mounted() {
    setTimeout(() => {this.canClick = true;}, 350); // 防止用户进入页面后快速触击
    
    //不用局部设高+scroll，因为前一个页面有键盘，安卓键盘有问题，ios的前进后退栏有问题
    window.addEventListener('scroll', this.scrollList);
  },
  beforeDestroy() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  methods:{
    // 禁止点击
    banClick(e) {
      if (!this.canClick) {
        e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
      }
    },
    // 得到进度圈中间文字设置
    getFont(item) {
      return { // 进度圈中间字体
        text: item.rate + '%',
        fontStyle: '400 12px PingFangSC-Regular',
        color: '#45A8F5'
      };
    },

    // 结束时间提取为xxxx-xx-xx
    getEndTime(item) {
      return item.endTime.substr(0, 10);
    },

    // 用来描述结束时间与当前时间的关系
    getTimeDesc(item) {
      let time = new Date(this.getEndTime(item).replace(/-/g, "/")),
          now = new Date(),
          intervalDate = time.getTime() - now.getTime(),
          intervalDays = Math.floor(intervalDate / (24 * 3600 * 1000)) + 1;
      return intervalDays > 0? this.$t('i18n.remain') + intervalDays + this.$t('i18n.day'): '';
    },

    // 课程内的tab组件切换监听
    showMsgFromCoursesTab(value, index) {
      this.$emit('getSearchData', {
        tabIndex: index
      });
    },

    // 更改無數據顯示標志
    changeHasRecord() {

      let showHasRecord = false;
      if (this.coursesTabIndex === 1) { // 学习任务
        if (!this.mustCourse.length && !this.mustNotCourse.length) {
          showHasRecord = true;
        }
      } else if(!this.courseData.pageData.length) { // 课程列表
          showHasRecord = true;
      }

      this.$emit('listenToSearchContent', showHasRecord);
    },

    // 加载更多列表 触发数据请求
    loadMoreList() {
      this.$emit('getSearchData', {
          tabIndex: this.coursesTabIndex,
          page: ++this.courseData.currPage,
          addFlag: true // 点击更多数据添加的, 不是新搜索
      });
    },

    // 滚动更多列表
    scrollList(event){
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (this.courseData.scrollLock || !scrollTop || this.coursesTabIndex) return; // 锁定/在顶处/学习任务不用触发滚动
      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 44) { // 44是loadmore高度
        this.courseData.scrollLock = true; // 防止滚动多次请求
        if (!this.courseData.loading && this.courseData.currPage < this.courseData.maxPage) {
          this.loadMoreList();
        }
      }
    },

    // 价格处理，非0元则处理返回，否则返回免费
    parsePrice(value) {
      return value === '0' ? this.$t('i18n.free') : value.includes('.00') ? '￥' + value.replace('.00', '') + '/' + this.$t('i18n.personPerYear'): '￥' + value + '/' + this.$t('i18n.personPerYear');
    }
  },
};
</script>

<style lang="scss" scoped>
  .qwui-lean_search_course {
    padding-top: 44px;

    .fixed_set_top {
      top: 43px;
    }
    .search_content {
      overflow-y: scroll;

      .learn_task {
        background: #fff;
      }

      .course_list {
        margin-bottom: 10px;
        background: #fff;

        &:last-of-type {
          margin-bottom: 0;
        }
        .course_type {
          font-size: 20px;
          line-height: 19px;
          font-weight: 600;
          padding: 20px 0 9px 16px;
        }

        .item_section {
          position: relative;
          margin-top: 5px;
          font-size: 12px;
          color: #999;
          overflow: hidden;

          .item_section_people {
            margin-top: -2px;
            .item_section_price {
              float: right;
              font-size: 16px;
              margin-top: -2px;
              color: #FA9025;
            }
            .free {
              color: #45A8F5;
            }
          }

          .item_section_time {
            float: right;
          }
        }

        .item_rate {
          float: right;
          margin-left: 14px;
          text-align: center;
          .item_status {
            font-size: 12px;
            color: #45A8F5;
            line-height: 12px;
          }
        }
      }
    }
  }
</style>
