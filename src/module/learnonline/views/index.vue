<template>
  <div class="wrap qwui-learnonline" >

  <!--头部菜单栏以及搜索栏,showMsgFromSearchBox:监听搜索事件-->
    <header class="qwui-nav_tabs top fixed_set_top">
      <search-box
        v-if ="tabActiveIndex === 0"
        :keyWord="keyWord"
        :searchinput="searchData"
        :searchIndex="searchIndex"
        @listenToSearchBox="showMsgFromSearchBox"
      ></search-box>
    </header>

    <div class="content">
      <keep-alive>
        <component :is="componentMap"></component>
      </keep-alive>
    </div>

    <!-- 底部导航 -->
    <nav-footer class="fillBackground">
      <tab-one
        v-for="(navItem, index) in footerListData.nav"
        v-bind="navItem"
        :activeIndex="tabActiveIndex"
        :defaultColor="'icon-skyBlue'"
        :key="navItem.icon"
        @tabOneClick="tabOneClickMy(index)"
      >
      </tab-one>
    </nav-footer>
  </div>
</template>

<script>
  import search_box from '@/components/base/search_box';
  import footer_nav from '@/components/home/footer_nav';
  import navFooter from '@/components/part/nav_footer';
  import tabOne from '@/components/part/tab_one';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import LivePlayList from './live/LivePlayList';
  import MallList from './mall/MallList';
  import LearningTasks from './learnTask/LearningTasks';
  import MyRelavent from './myRelavent/MyRelavent';
  import { mapState, mapMutations } from 'vuex';

  import homePage from '../js/homePage';
  import * as timeUtil from '@/assets/js/time-util';

  export default {
    name: 'index',
    components: {
      "footer-nav": footer_nav,
      "search-box": search_box,
      LivePlayList,
      MallList,
      LearningTasks,
      MyRelavent,
      tabOne,
      navFooter
    },
    data() {
      return {
        footerListData: dataBase.home.footerListData,
        searchData: homePage.searchData,
        keyWord: '',
        searchIndex: 0, // 搜索类型的索引
        tabActiveIndex: 0, // 底部导航当前选中tab
      }
    },
    computed: {
      ...mapState([
      'searchVal'
      ]),
      componentMap() {
        let componentArr = ['learning-tasks', '', 'live-play-list', 'mall-list', 'my-relavent'];
        return componentArr[this.tabActiveIndex];
      },
    },
    activated() {
      let querySearchType = Number(this.searchVal.searchType);
      if(!isNaN(querySearchType)) {
        this.searchIndex = querySearchType;
      }
    },
    methods: {
      ...mapMutations([
        'SET_SEARCH_VALUE'
      ]),
      // 点击底部导航的任一项
      tabOneClickMy(index) {
        if(index == this.tabActiveIndex) {
          return ;
        } else if (index == 1) {
          window.location.href = _.baseURL + '/jsp/wap/examination/exam_index.jsp?agentCode=examination';
          return ; /*需改 防止在微信处点击考试后返回被激活, 考试重构需要改回*/
        }
        this.tabActiveIndex = index;

        // 变换active图标
        this.footerListData.nav.forEach((item, i) => {
          item.icon = item.icon.replace(/on$/, 'off');
        })
        let iconActiveClass = this.footerListData.nav[index].icon.replace(/off$/, 'on');
        this.footerListData.nav[index].icon = iconActiveClass;
      },
      // 搜索
      showMsgFromSearchBox(keyWord, index) {

        this.SET_SEARCH_VALUE({ // 更改仓库的index,在搜索页面可读取
            keyWord: keyWord,
            searchType: index
          });
        this.searchIndex = index; // 更改搜索组件的搜索类型index

        if (keyWord) {
          this.$set(this, 'keyWord', keyWord);
          setTimeout(()=>{
            this.$set(this, 'keyWord', '');
          }, 100);
        }
        /*
        确认搜索后需要清空输入栏 watch需要有变动才会更新
        但keyWord连续更新过快，watch监听不到变化,
        此处用异步清空
        */
        this.$router.push({name: 'search'});
      }
    }
  };

</script>

<style lang="scss" scoped>
  .wrap {
    .fixed_set_top {
      z-index: 3; // 因为公共组件下方的nav栏为 2, 默认的1点出的白屏无法遮挡
    }
  }
  .fillBackground /deep/ .qwui-nav_footer_height {
    height: 47px; //ios按公共组件上的48px会露底
  }
  .qwui-learnonline /deep/ .qwui-iconfont{
    font-size: 28px;
  }
</style>
