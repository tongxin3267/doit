<template>
  <div class="wrap qwui-lean_search">
    <!--搜索框-->
    <header class="qwui-nav_tabs top fixed_set_top">
      <search-box
        :keyWord="keyWord"
        :searchinput="searchBar"
        :searchIndex="searchVal.searchType"
        @listenToSearchBox="showMsgFromSearchBox"
      >
        <label class="search_cancel" slot="rightSpan" @click="$router.back()">{{$t('i18n.cancel')}}</label>
      </search-box>
    </header>

    <!-- 搜索课程内容显示 -->
    <search-course
      v-if="searchType === 0"
      ref="searchCourse"
      :contentData="contentData.coursesData"
      @listenToSearchContent="showMsgFromSearchContent"
      @getSearchData="getSearchData"
    ></search-course>

    <!-- 搜索直播内容显示 -->
    <search-live
      v-else-if="searchType === 1"
      ref="searchLive"
      :contentData="contentData.liveData"
      @listenToSearchContent="showMsgFromSearchContent"
    ></search-live>

    <!-- 搜索考试内容显示 -->
    <search-practice
      v-else
      ref="searchPractice"
      :contentData="contentData.practiceData"
      @listenToSearchContent="showMsgFromSearchContent"
      @getSearchData="getSearchData"
    ></search-practice>

    <!-- 无数据提示 -->
    <no-record
      :hasrecord="comHasRecord"
    ></no-record>

    <!--登陆后台提示会话框-->
    <dialog-group
      class="dialog"
      :show="dialogShow"
      @confirm="dialogConfirm"
      :title="$t('i18n.createTestTips')"
      :confirmText="$t('i18n.iKnow')"
    >
      <p class="dialog_content">{{$t('i18n.phoneTips')}}</p>
      <p class="dialog_content">{{$t('i18n.loginBackground')}}<br>https://work.weixin.qq.com/login</p>
    </dialog-group>

  </div>
</template>

<script>
import SearchBox from '@/components/base/search_box'; // 搜索框组件
import NoRecord from '@/components/base/no_record'; // 暂无数据组件
import DialogGroup from '@/components/base/dialog/dialog-group'; // 弹窗组件
import SearchCourse from './SearchCourse';
import SearchLive from './SearchLive';
import SearchPractice from './SearchPractice';
import { getCoursesData as searchLearnTasks, searchSubject, searchLive ,searchExam, searchPractice, getIsRemind, closeGuideDialog, searchExamCount} from "../../api/getData";
import { newDateObj } from '../../../../assets/js/time-util';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'Search',
  components: {
    SearchBox,
    SearchCourse,
    SearchLive,
    SearchPractice,
    NoRecord,
    DialogGroup
  },
  data() {
    return {
      /*database配置数据*/
      searchBar: dataBase.search.searchBar,
      hasRecord: dataBase.search.hasRecord, // 縂的hasRecord設置。用來快捷讀取hasRecord

      /*该组件使用数据*/
      nowHasRecord: dataBase.search.hasRecord.courses, // 當前的hasRecord,默認用課程的hasRecord
      searchType: 0,// 搜索类型 课程0 直播1 考试2
      keyWord: '',
      dialogShow: false, // 前往后台会话框显示标志
      firstSearchExam: true, // 第一次搜索考试标志，需要向请求是否显示前往后台会话框

      contentData: { // 搜索得到的数据- 后台发送回来的统一存在这
        /*课程数据*/
        coursesData: { // 课程数据, 在这声明初始化。后续即使后台传数据缺失也不报错
          course: {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false},
          learnTasks: {mustCourse: [], mustNotCourse: []},
          searchBoxCourseFlag: true,
          searchBoxTasksFlag: true
        },
        /*直播数据*/
        liveData: {endLiveList: [], livingList: [], willLiveList: []},
        /*考试/练习数据*/
        practiceData: {
          inTheExamMap: new Map(), // 考试中的数据
          waitForTest: {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false},
          haveTest: {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false},
          practice: {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false}
        },
      },
    };
  },
  computed: {
    ...mapState([
      'searchVal'
    ]),
    // 无数据提示, 根据searchType绑定对应dataBase.hasRecord.
    comHasRecord() { // 搜索类型 课程0 直播1 考试2
      return  this.searchType == 0? this.hasRecord.courses:
              this.searchType == 1? this.hasRecord.live: this.hasRecord.practice;
    }
  },
  created() {
    let tabIndex;
    this.initData(); // 初始化数据

    tabIndex = this.searchType == 0? dataBase.search.coursesTabData.index :dataBase.search.practiceTabData.index;
    this.getSearchData({tabIndex: tabIndex}); // 初始化完立即请求数据
  },
  methods:{
    ...mapMutations([
      'SET_SEARCH_VALUE'
    ]),
    // 初始化数据
    initData() {
      let queryKeyWord = this.searchVal.keyWord,
          querySearchType = Number(this.searchVal.searchType);


      this.keyWord =queryKeyWord? queryKeyWord: ''; // keyWord更新
      this.searchBar.moreFunction.initIndex = querySearchType? querySearchType: 0; // searchBox初始化当前选项更新
      this.searchType = querySearchType? querySearchType: 0;
      this.nowHasRecord = this.searchType == 0? this.hasRecord.courses:
                          this.searchType == 1? this.hasRecord.live: this.hasRecord.practice;
    },

    // 根据搜索类型向后台发送对应搜索请求, 子组件搜索内容的加载更多也会触发此事件
    getSearchData(data) {
      let searchType = this.searchType;

      // 先把所有无数据显示隐藏
      this.hasRecord.courses.show = false;
      this.hasRecord.live.show = false;
      this.hasRecord.practice.show = false;
      return  searchType === 0? this.getCoursesData(data):
              searchType === 1? this.getLiveData(data):
              data && data.tabIndex < 2? this._searchExamCount(data).then(() => {
                this.getPracticeData(data);
              }): this.getPracticeData(data);// 搜索练习不需要请求已考试数据
    },

    // 获取课程数据
    getCoursesData(data) {
      // 根据搜索课程内的nav下标 决定请求
      let coursesData = this.contentData.coursesData;
      if (data && data.tabIndex) {
        // 搜索学习任务
        if (!coursesData.searchBoxTasksFlag && (coursesData.learnTasks.mustCourse.length || coursesData.learnTasks.mustNotCourse.length)) {
          this.$refs.searchCourse.changeHasRecord();
          return; // 如果是切换搜索框搜索项则需要搜索, 普通切换nav有数据不用再次请求
        }

        // 学习任务数据请求
        searchLearnTasks({keyWord: this.keyWord}, data => {
          Object.assign(coursesData.learnTasks, data);
          coursesData.searchBoxTasksFlag = false; // 搜索过，后续切换nav则无需搜索
          // 调用子组件方法更新hasRecord.show， 如果没调用，在搜索遇到无数据后，再搜索到有数据，无数据提示不会消失
          // 在每次数据更新后，触发更新对应的hasRecord
          this.$refs.searchCourse.changeHasRecord(); // 下标为1才是学习任务
        });

      } else {
        // 搜索课程
        let course = coursesData.course,
            addFlag = false,
            page = 1;
        if (!coursesData.searchBoxCourseFlag && course.pageData.length) {
          this.$refs.searchCourse.changeHasRecord();
          return; // 如果是切换搜索框搜索项则需要搜索, 普通切换nav有数据不用再次请求
        }
        // loading显示
        course.loading = true;

        // 判断是否加载更多,进行赋值
        if (data) {
          page = data.page? data.page: page;
          addFlag = typeof data.addFlag === 'boolean'? data.addFlag: false;
        }
        // 课程数据请求
        searchSubject({"searchValue.keyword": this.keyWord, page: page}, data => {
          // 若是新搜索, 则初始化再添加进去
          if (!addFlag) { 
            course.pageData = [];
          }

          if (data.pageData) {
            course.pageData.push.apply(course.pageData, data.pageData);
            delete data.pageData;
          }

          Object.assign(course, data, {loading: false, scrollLock: false});

          if (data.maxPage == data.currPage) {
            coursesData.searchBoxCourseFlag = false;// 搜索满，后续切换nav则无需搜索
          }
          // 调用子组件方法更新hasRecord.show， 如果没调用，在搜索遇到无数据后，再搜索到有数据，无数据提示不会消失
          // 在每次数据更新后，触发更新对应的hasRecord
          this.$refs.searchCourse.changeHasRecord();
        });

      }
    },

    // 获取直播数据
    getLiveData(data) {
      return new Promise((resolve, reject) => {
        searchLive({
                'categoryId':'',
                'page': 1,
                'pageSize':10,
                'searchValue.isMust': 0,
                'searchValue.order': 1,
                'keyWord': this.keyWord},
        data => {
          Object.assign(this.contentData.liveData, data);
          // 在每次数据更新后，触发更新对应的hasRecord
          this.$refs.searchLive.changeHasRecord();
          resolve();
        });
      });
    },

    // 查询是否有正在进行的考试
    _searchExamCount(data) {
      let tabIndex = 0,
          nowPracticeData = null, // 本地存储当前请求对应的数据
          practiceData = this.contentData.practiceData;

      tabIndex = data.tabIndex? data.tabIndex: tabIndex;
      nowPracticeData = tabIndex === 0? practiceData.waitForTest:
                        tabIndex === 1? practiceData.haveTest: practiceData.practice;
      nowPracticeData.loading = true; // 【加载中】提示展示

      return new Promise((resolve, reject) => {
        searchExamCount({}, res => {
          let i,
              answerIngList = res.answerIngList;
          practiceData.inTheExamMap = new Map(); // 每次都初始化

          if (answerIngList) { // 如果有
            for(i = 0; i < answerIngList.length; i++){
              practiceData.inTheExamMap.set(answerIngList[i].id, answerIngList[i]);
            }
          }
          resolve();
        });
      });
    },

    // 获取考试数据
    getPracticeData(data) { // data为子组件传过来的数据, 例如Tab下标index
      let practiceData = this.contentData.practiceData,
          nowPracticeData = null, // 本地存储当前请求对应的数据
          tabIndex = 0,
          page = 1,
          addFlag = false;

      if (data) {
        tabIndex = data.tabIndex? data.tabIndex: tabIndex;
        page = data.page? data.page: page;
        addFlag = typeof data.addFlag === 'boolean'? data.addFlag: false;
      }

      // 取出当前请求的数据
      nowPracticeData = tabIndex === 0? practiceData.waitForTest:
                        tabIndex === 1? practiceData.haveTest: practiceData.practice;
      
      // 【加载中】提示展示
      nowPracticeData.loading = true;

       /* 根据判断发送对应请求, tab为0 1为搜索课程 2为搜索练习 并返回Promise对象 */
      return tabIndex !== 2?
      new Promise((resolve, reject) => {
        searchExam({ // 为0 1则是考试搜索
                examStatus: tabIndex,
                page: page,
                keyWord: this.keyWord},
        data => {
          let pageDataLength;

          // 将数据赋值到对应的存放点 且 【加载中】提示关闭
          if (!addFlag) { // 若是新搜索, 则初始化再添加进去
            practiceData.waitForTest.pageData = [];
            practiceData.haveTest.pageData = [];
          }

          if (this.firstSearchExam) { // 第一次搜索需要判断是否显示进入后台提示
            this.firstSearchExam = false;
            pageDataLength = data.pageData? data.pageData.length: 0;
            this._getIsRemind(pageDataLength);
          }

          if (data.pageData) {
            data.pageData = this.dataProcessing(data.pageData);// 数据处理
            nowPracticeData.pageData.push.apply(nowPracticeData.pageData, data.pageData);
            delete data.pageData;
          }

          Object.assign(nowPracticeData, data, {loading: false, scrollLock: false});

          // 调用子组件方法更新hasRecord.show， 如果没调用，在搜索遇到无数据后，再搜索到有数据，无数据提示不会消失
          // 在每次数据更新后，触发更新对应的hasRecord
          this.$refs.searchPractice.changeHasRecord();
          resolve();
        });
      }):
      new Promise((resolve, reject) => {
        searchPractice({ // 为2为练习搜索
          currentPage: page,
          keyWord: this.keyWord
        },
        data => {
          // 将数据赋值到对应的存放点 且 【加载中】提示关闭
          if (!addFlag) { // 若是新搜索, 则初始化再添加进去
            practiceData.practice.pageData = [];
          }
          nowPracticeData.pageData.push.apply(nowPracticeData.pageData, data.pageData);
          delete data.pageData;

          Object.assign(nowPracticeData, data, {loading: false, scrollLock: false});
          // 调用子组件方法更新hasRecord.show， 如果没调用，在搜索遇到无数据后，再搜索到有数据，无数据提示不会消失
          // 在每次数据更新后，触发更新对应的hasRecord
          this.$refs.searchPractice.changeHasRecord();
          resolve();
        });
      });
    },

    // 設置當前的hasRecord, comHasRecord内无法更改，但this.nowHasRecord跟他是同一个，可改动
    setNowHasRecord() { // 搜索类型 课程0 直播1 考试2
      this.nowHasRecord = this.searchType === 0? this.hasRecord.courses:
                          this.searchType === 1? this.hasRecord.live: this.hasRecord.practice;
    },

    showMsgFromSearchBox(keyWord, index) {
      let tabIndex,
          coursesData = this.contentData.coursesData,
          practiceData = this.contentData.practiceData;

      // 先隐藏上一个搜索的无数据显示。 来回切换时，遇到前有后无数据的情况，就不会导致无数据标识闪现
      this.nowHasRecord.show = false;
      this.SET_SEARCH_VALUE({
        searchType: index,
        keyWord: keyWord
      });
      this.searchType = index;
      this.keyWord = keyWord;
      this.setNowHasRecord(); // 切換對應的hasRecord

      // 如果是切换搜索类型,或查询课程，设置标志，方便搜索课程即使有数据，也能继续搜索。
      if (this.searchType == 0) {
        coursesData.searchBoxCourseFlag = true;
        coursesData.searchBoxTasksFlag = true;

        // 课程只要是搜索框内输入搜索，都需要滚动到置顶，避免搜索完滚动条正在老位置
        window.scrollTo(0, 0);
      }

      // 如果是考试，需要初始化数据
      if (this.searchType == 2) {
        practiceData.waitForTest = Object.assign({}, {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false});
        practiceData.haveTest = Object.assign({}, {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false});
        practiceData.practice = Object.assign({}, {pageData: [], maxPage: 1, currPage: 0, loading: false, scrollLock: false});
      }


      // 搜索课程 和 考试 才有nav切换, 传送对应的nav下标index
      tabIndex = this.searchType == 0? dataBase.search.coursesTabData.index :dataBase.search.practiceTabData.index;
      this.getSearchData({tabIndex: tabIndex});
    },

    // 監聽搜索内容的反饋，設置無數據是否顯示。如果數據為空，監聽到true，無數據提示顯示。
    showMsgFromSearchContent(value, title, text) {
      let nowHasRecord = this.nowHasRecord;
      nowHasRecord.show = value;
      nowHasRecord.title = title? title: nowHasRecord.title;
      nowHasRecord.text = text? text: nowHasRecord.text;
    },

    /**
     * 获取标志, 判断是否显示【前往后台弹窗提示】
     * @return {Promise}           promise对象
     */
    _getIsRemind(courseLength) {
      return new Promise((resolve, reject) => {
        getIsRemind({agentCode: dataBase.wxqyh_uploadfile.agent},
        data => {
          if (data.isRemind) {
            if(courseLength < 5){
              this.dialogShow = true;
            } else {
              closeGuideDialog({agentCode: dataBase.wxqyh_uploadfile.agent});
            }
          }
          resolve();
        });
      });
    },

    // 将前往后台的提示回话关闭
    dialogConfirm() {
      this.dialogShow = !this.dialogShow;
      closeGuideDialog({agentCode: dataBase.wxqyh_uploadfile.agent}); // 关闭反馈给服务器。
    },

    //获取当前年、月、日、时、分、秒、周期的对象（以对象形式返回）
    getDateObejct(newDate=Date.now()) {
      var date = new Date(newDate);
      var currentTime={};
      currentTime.year = date.getFullYear();
      currentTime.month = date.getMonth() + 1;
      currentTime.date = date.getDate();
      currentTime.day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
      currentTime.month = currentTime.month < 10 ? "0" + currentTime.month : currentTime.month;
      currentTime.date = currentTime.date < 10 ? "0" + currentTime.date : currentTime.date;
      currentTime.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      currentTime.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      currentTime.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      return currentTime;
    },

    // 从后台拿到的数据进行处理
    dataProcessing(pageData) {
      let i, j, nowPageData, picList, picListLength, // 临时数据
          inTheExamMap = this.contentData.practiceData.inTheExamMap,
          pageList = [], // 用来返回的，一个包含listItem数组
          listItem = {}, // 当前日期项对象，里面包含该日期点信息，以及包含考试数组
          dateTime= '',  // 当前日期, 与oldDateTime来判断是否新日期
          oldDateTime = '', // 老日期, 用来判断是否同新日期
          pageDataLength = pageData.length,
          dataObject = {}, // 存放时间的对象，可提取信息
          exam = {}; // 当前考试的信息。

      for (i = 0; i < pageDataLength; i++) {
        nowPageData = pageData[i];
        dateTime = nowPageData.startTime.substr(0, 10)? nowPageData.startTime.substr(0, 10): nowPageData.createTime.substr(0, 10);
        if (oldDateTime != dateTime && dateTime != '') { // 新的日期点
          oldDateTime && pageList.push(listItem); // 推入只在新日期(第一个新日期不用) 以及 最后一个推入

          listItem = {}; // 新的日期点需要新的listItem
          dataObject = this.getDateObejct(newDateObj(nowPageData.startTime)); // 需要把时间的-换成/ 兼容ios
          listItem.week = dataObject.day;
          listItem.data = `${dataObject.month}月${dataObject.date}日`;
          oldDateTime = dateTime;
          listItem.list = listItem.list || [];
        }
        // 日期点提取完，准备考试项赋值且推入listItem.list中
        listItem.list = listItem.list || [];// 未初始化则初始化。

        /* 考试数据赋值 */
        exam = {};
        // 判断是否在考试中，并赋值
        Object.assign(exam, nowPageData, {
          inTheExam: inTheExamMap.get(nowPageData.id)? true: false
        });

        listItem.list.push(exam); // 将考试推入当前日期点
      } // for循环完

      pageList.push(listItem); // 推入只在新日期 以及 最后一个推入
      return pageList;
      /* 返回结构
      pageList: [
        listItem: {
          week: '',
          data: '',
          list: [
            {
              exam：{}
            }
          ]
        }
      ]
      */
    }
  }
};

</script>

<style lang="scss" scoped>
.qwui-lean_search {
  padding-top: 43px;

  .fixed_set_top{
    z-index: 3;
  }
  .search_cancel {
    float: right;
    display: block;
    width: 38px;
    padding: 5px 0 0 7px;
    font-size: 14px;
    font-weight: 400;
    color: #467DB9;
    text-align: center;
    cursor: pointer;
  }
  & /deep/ .icon_search_noCourse {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('../../../../assets/images/noCourse.png') center no-repeat;
    background-size: cover;
  }

  .dialog {
    .dialog_content {
      margin: 15px 0;
      font-size: 14px;
      color: #9b9b9b;
      line-height: 24px;
      text-align: left;
    }
  }
}
</style>
