<template>
  <div class="wrap qwui-lean_myStudy" @click.capture="banClick">
    <!--tab选项卡-->
    <menu-tab-two
      :selectdata="selectData"
      @listenTabChange="showMsgFromCoursesTab"
    ></menu-tab-two>

    <!-- 搜索课程内容 -->
    <div
      class="course_content"
      :style="{ height: winHeight }"
      ref="scroll_wrap"
      @scroll="scrollList"
    >

      <!-- 学习中列表 -->
      <div class="courseList" v-show="coursesTabIndex == 0">
        <qw-course-item
          v-for="item in learnPageData.pageData"
          :item="item"
          :hiddenEndClass=false
          :key="item.courseId"
        >
          <!-- 进度圈插槽 START-->
          <div class="item_rate" slot="rate">
            <!-- 进度圈 -->
            <circular-progress
              :targetId="item.courseId"
              :proGress="getRate(item)"
              :font="getFont(item)"
            ></circular-progress>

            <!-- 进度圈下方补充说明 -->
            <p
              class="item_status"
              :class="{item_status_over: item.courseState != 2}"
            >{{item.courseState !=2 ? $t('i18n.ended') : $t('i18n.studied')}}</p>
          </div>
          <!-- 进度圈插槽 END-->
        </qw-course-item >
      </div>

      <!-- 已完成列表 -->
      <div class="courseList" v-show="coursesTabIndex == 1">
        <qw-course-item
          v-for="item in finishPageData.pageData"
          :item="item"
          :hiddenEndClass=true
          :key="item.courseId"
        >
          <!-- 进度圈插槽 START 待删除 -->
          <div slot="rate"></div>
          <!-- 进度圈插槽 END-->
        </qw-course-item >
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
        <span>{{$t('i18n.total') + nowContentData.pageData.length + $t('i18n.defaultDescribe')}}</span>
      </load-more>
    </div>


    <!-- 无数据提示 -->
    <no-record
      :hasrecord="hasRecord"
    ></no-record>

  </div>
</template>

<script>
import MenuTabTwo from '@/components/button/menu_tab_two'; // nav组件
import LoadMore from '@/components/list/load_more'; // 加载更多组件
import NoRecord from '@/components/base/no_record'; // 暂无数据组件
import QwCourseItem from '../../components/CourseItem'; // 课程项组件
import CircularProgress from '../../components/CircularProgress'; // 进度圈组件
import { getMyStudyCourse} from "../../api/getData";

export default {
  name: 'QwMyStudy',
  components: {
    MenuTabTwo,
    LoadMore,
    NoRecord,
    QwCourseItem,
    CircularProgress
  },
  data(){
    return {
      /*database配置数据*/
      selectData: dataBase.myStudy.selectData,// Tab选项组件设置
      hasRecord: dataBase.myStudy.hasRecord,// 无数据组件设置


      /*该组件使用数据*/

      // 存放学习中数据
      learnPageData: {
        pageData: [],
        maxPage: 1,
        currPage: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        scrollTop: 0, // 记录滚动的位置
        state: 1, // 请求参数, 学习中是1, 已完成5
        firstFlag: true, // 第一次加载
      },

      // 存放已完成数据
      finishPageData: {
        pageData: [],
        maxPage: 1,
        currPage: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        scrollTop: 0, // 记录滚动的位置
        state: 5, // 请求参数, 学习中是1, 已完成5
        firstFlag: true, // 第一次加载
      },

      canClick: false, // 是否准许点击 （在DOM操作后

    };
  },
  computed: {
    // 当前下标，用来tab切换显示
    coursesTabIndex() {
      return this.selectData.index;
    },
    nowContentData() {
      return  this.selectData.index === 0? this.learnPageData: this.finishPageData;
    },
    winHeight() {
      let height = this.nowContentData.pageData.length? window.innerHeight - 44: 0; // 减去nav栏44px
      return height + 'px';
    },
  },
  created() {
    this.loadMoreList().then(() => {
      this.nowContentData.firstFlag = false;
    });
  },
  mounted() {
    setTimeout(() => {this.canClick = true;}, 350);// 防止用户进入页面后快速触击
  },
  methods:{
    // 禁止点击
    banClick(e) {
      if (!this.canClick) {
        e.stopPropagation? e.stopPropagation() : e.cancelBubble = true;
      }
    },

    // tab组件切换监听
    showMsgFromCoursesTab(value, index) {
      // 渲染后, 再读回前一次的滚动条位置 (异步)
      this.$refs.scroll_wrap.scrollTop = 0; // 防止nav切换高低差触发加载更多
      this.$nextTick().then(() => {
        this.$refs.scroll_wrap.scrollTop = this.nowContentData.scrollTop;
      });

      if (this.nowContentData.firstFlag && !this.nowContentData.pageData.length) { // 第一次如果没数据就请求数据
        this.nowContentData.firstFlag = false;
        this.hasRecord.show = false;// 后面有请求, 把无数据显示关了
        this.loadMoreList();
      } else {
        this.hasRecordCherk(); // 非初次请求 则切换触发无数据显示设置
      }
    },

    // 滚动加载更多事件
    scrollList(event){
      // 将当前滚动高度存储
      let nowContentData = this.nowContentData;
      let scrollTop = event.target.scrollTop || window.pageYOffset || document.body.scrollTop;
      nowContentData.scrollTop = scrollTop;

      // 如果有请求事件则锁定, 不再请求
      if (nowContentData.scrollLock) return;

      if (scrollTop + window.innerHeight >= this.$refs.scroll_wrap.scrollHeight) {
        nowContentData.scrollLock = true; // 防止滚动多次请求
        if (!nowContentData.loading && nowContentData.currPage < nowContentData.maxPage) {
          this.loadMoreList();
        }
      }
    },

    // 获取课程数据请求
    _getMyStudyCourse(obj) {
      this.nowContentData.loading = true; // 下拉加载中显示设置

      return new Promise((resolve, reject) => {
        getMyStudyCourse({
          state: obj.state,
          page: obj.currPage,
          pageSize: 10
        }, data => {
          let pageData = this.nowContentData.pageData;
          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false}); // 数据赋值
          this.hasRecordCherk(); // 有无数据组件判断设置

          resolve();
        });
      });
    },

    // 有无数据组件判断设置
    hasRecordCherk() {
      this.hasRecord.show = this.nowContentData.pageData.length? false: true;
    },

    // 加载更多数据
    loadMoreList() {
      return this._getMyStudyCourse({
        state: this.nowContentData.state,
        currPage: ++this.nowContentData.currPage
      });
    },

    // 得到进度圈的百分比
    getRate(item) {
      // 如果是已结束的课程 就不用进度条了
      return item.courseState != 2? 0 :Math.floor(item.finishEnclosureCount / item.enclosureCount * 100);
    },
    // 得到进度圈中间文字设置
    getFont(item) {
      return { // 进度圈中间字体
        text: item.courseState !=2? '': this.getRate(item) + '%',
        fontStyle: '400 12px PingFangSC-Regular',
        color: '#45A8F5'
      };
    },
  }
};

</script>

<style lang="scss" scoped>
.qwui-lean_myStudy {
  .course_content {
    overflow-y: scroll;
    .courseList {
      padding-top: 10px;
      background: #fff;

      .item_rate {
        float: right;
        margin-left: 14px;
        text-align: center;
        .item_status {
          font-size: 12px;
          color: #45A8F5;
          line-height: 12px;
        }
        .item_status_over {
          color: #999;
        }
      }
    }
  }
}
</style>
