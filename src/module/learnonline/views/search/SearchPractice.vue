<template>
  <div class="qwui-lean_search_practice">
    <!-- tab选项卡 -->
    <header class="qwui-nav_tabs top fixed_set_top">
      <menu-tab-two
        :selectdata="selectData"
        @listenTabChange="showMsgFromCoursesTab"
      ></menu-tab-two>
    </header>

    <!-- 搜索考试/练习内容 -->
    <div
      class="search_content"
      ref="scroll_wrap"
    >

      <!-- 待考试和已考试的列表 -->
      <div v-if="coursesTabIndex < 2">
        <div
          class="exam_list"
          v-for="(item, index) in nowContentData.pageData"
          :key="index"
        >
          <div class="data_bar" v-if="item.list">{{item.data}} {{item.week}}</div>
          <qw-search-practice-exam
            class="exam_item"
            v-for="(exam, index) in item.list"
            :exam="exam"
            :coursesTabIndex="coursesTabIndex"
            :key="index"
          ></qw-search-practice-exam>
        </div>
      </div>

      <!-- 练习的列表 -->
      <div v-else>
        <div
          class="practice_item"
          @click="enterDetal(item.id)"
          v-for="(item, index) in nowContentData.pageData"
          :key="index">

          <div class="clearfix">
            <p class="practice_name">{{item.practiceName}}</p>
            <p class="practice_time">
              <i class="iconfont icon-peixunxuexi_shijian"></i>
              {{item.startTime}} {{$t('i18n.to')}} {{item.endTimeStr}}
            </p>
            <p class="practice_explain">{{item.practiceExplain}}</p>
            <div class="practice_img_list clearfix">
              <div v-for="imgItem in item.picList"><img :src="imgItem|filterImg"></div>
            </div>

            <div
              class="practice_button"
              :class="{practice_button_wait: item.practiceState == 1}"
              @click.stop="enterExam(item)"
            >{{getButtonText(item)}}</div>
          </div>
        </div>
      </div>

      <!-- 加载更多组件 -->
      <load-more
        :loading="nowContentData.loading"
        :maxPage="nowContentData.maxPage"
        :currPage="nowContentData.currPage"
        :borderTop=false
        colorType="transparent"
        @loadMoreClick="loadMoreList"
      >
        <span>{{$t('i18n.nomore')}}</span>
      </load-more>
    </div>
  </div>
</template>

<script>
import MenuTabTwo from '@/components/button/menu_tab_two'; // nav选项菜单组件
import LoadMore from '@/components/list/load_more'; // 加载更多组件
import QwSearchPracticeExam from './SearchPracticeExam'; // 列表组件
export default {
  name: 'SearchPractice',
  components: {
    MenuTabTwo,
    LoadMore,
    QwSearchPracticeExam
  },
  directives: {
    bodyscroll: {
      bind: function (el, binding){
        window.addEventListener('scroll', binding.value);
      }
    }
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
      selectData: dataBase.search.practiceTabData, // tab选项设置
    };
  },
  computed:{
    // 当前下标，用来tab切换显示
    coursesTabIndex() {
      return this.selectData.index;
    },
    nowContentData() {
      return  this.selectData.index === 0? this.contentData.waitForTest:
              this.selectData.index === 1? this.contentData.haveTest: this.contentData.practice;
    },
  },
  mounted() {
    //不用局部设高+scroll，因为前一个页面有键盘，安卓键盘有问题，ios的前进后退栏有问题
    window.addEventListener('scroll', this.scrollList);
  },
  beforeDestroy() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  methods:{
    // 课程内的tab组件切换监听
    showMsgFromCoursesTab(value, index) {
      // this.$refs.scroll_wrap.scrollTop = 0; // 切换时回到首部，防止load-more触发
      this.$emit('getSearchData', {
        tabIndex: this.coursesTabIndex,
        page: 1
      });

    },

    // 进入练习详情页
    enterDetal(examId) {
      window.location.href=_.baseURL+"/jsp/wap/examination/practice/practice_detail.jsp?id=" + examId;
    },

    // 进入练习页
    enterExam (exam) {
      if (this.getButtonText(exam) == this.$t('i18n.practiceNotStarted')) return;
      window.location.href=_.baseURL+"/jsp/wap/examination/practice/practice_answer.jsp?id=" + exam.id;
    },

    // 加载更多列表 触发数据请求
    loadMoreList() {
      this.$emit('getSearchData', {
          tabIndex: this.coursesTabIndex,
          page: ++this.nowContentData.currPage,
          addFlag: true // 点击更多数据添加的, 不是新搜索
      });
    },

    // 滚动更多列表
    scrollList(event){
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (this.nowContentData.scrollLock || !scrollTop) return;
      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 44) { // 44是loadmore高度
        this.nowContentData.scrollLock = true; // 防止滚动多次请求
        if (!this.nowContentData.loading && this.nowContentData.currPage < this.nowContentData.maxPage) {
          this.loadMoreList();
        }
      }
    },

    // 更改無數據顯示標志
    changeHasRecord() {
      let showHasRecord = false,
          title = this.$t('i18n.noExam'),
          text = this.$t('i18n.noExamTips');
      if (this.coursesTabIndex == 0) { // 待考试
        if (!this.nowContentData.pageData.length) {
          title = this.$t('i18n.noExam');
          text = this.$t('i18n.noExamTips');
          showHasRecord = true;
        }
      } else if(this.coursesTabIndex == 1) { // 已考试
        if (!this.nowContentData.pageData.length) {
          title = this.$t('i18n.noExam');
          text = this.$t('i18n.noExamTips');
          showHasRecord = true;
        }
      } else { // 练习
          if (!this.nowContentData.pageData.length) {
          title = this.$t('i18n.noPractice');
          text = this.$t('i18n.noPracticeTips');
          showHasRecord = true;
        }
      }

      this.$emit('listenToSearchContent', showHasRecord, title, text);
    },

    // 判断得到按钮的文字
    getButtonText(item) {
      let text =  item.practiceState == 1? this.$t('i18n.practiceNotStarted'):
                  item.answerState == 0? this.$t('i18n.continuePractice'):
                  item.answerState == 1 || item.answerState == 2? this.$t('i18n.startPractice'): '';
      return text;
    },

  },

  filters: {
    filterImg(url) {
      return _.fileDownURL + url;
    },
  }
};

</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
  .qwui-lean_search_practice {
    padding-top: 44px;
    font-family: arial, sans-serif;
    font-size: 14px;
    line-height: 20px;

    .fixed_set_top {
      top: 43px;
    }
    .search_content {
      overflow-y: auto;

      .exam_list {
        margin-bottom: 10px;
        padding-left: 15px;
        background: #fff;

        &:last-of-type {
          margin-bottom: 0;
        }

        .data_bar {
          padding-top: 25px;
          color: #999;
          font-size: 18px;
          line-height: 24px;
        }

        .exam_item {
          &:not(:last-of-type) {
            @include border-b-1px(#E6E6E6);
          }
        }
      }
      .practice_item {
        padding: 10px 15px 14px 0;
        padding-left: 15px;
        background: #fff;

        .practice_name {
          color: #333;
          font-size: 16px;
          line-height: 20px;
        }
        .practice_time {
          margin: 5px 0;
          color: #999;
        }
        .practice_explain {
          margin-bottom: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .practice_img_list {
          margin: 10px 0 5px;
        }
        .practice_button {
          float: right;
          display: inline-block;
          height: 28px;
          padding: 0 15px;
          color: #45a8f5;
          line-height: 28px;
          border: 1px #45a8f5 solid;
          border-radius: 4px
        }
        .practice_button_wait {
          color:#ccc;
          border:1px #ccc solid;
        }
      }
    }

  }
</style>
