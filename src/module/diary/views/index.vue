<template>
  <div class="wrap" v-windowscroll="scrollFun">

    <!--头部菜单栏以及搜索栏,getSearchRequest:监听搜索事件-->
    <header v-show="homeFooterList.nav_on!=2">
      <home-head-nav :headrdata="headData" :footerIndex="homeFooterList.nav_on" v-on:getSearchRequest="getSearchRequest"></home-head-nav>
    </header>

    <!--相关页面的tab菜单-->
    <nav v-show="homeFooterList.nav_on==3 && homeFooterList.nav_on!=2" class="qwui-menu_tab_fixed" :class="{'active':!headData.show && !headData.searchBar.show,'actived':
  	!headData.show && headData.searchBar.show}">
      <select_card :selectdata="menuChangeData" v-on:listenTabChange="showMsgFromSelectCard"></select_card>
    </nav>

    <!--主体列表(除去日志统计)-->
    <section class="main" v-show="homeFooterList.nav_on!=2">

      <!--列表-->
      <diary-list :listdata="homeContentList" :loadmore="loadMore" :footernav="homeFooterList.nav_on"  :useCheck="false" :tab="menuChangeData.index"></diary-list>

      <!--加载状态-->
      <load-more :loadmore="loadMore" describeWord="i18n.diaryTotal" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></load-more>
    </section>

    <!--日志统计-->
    <statistic_list v-if="homeFooterList.nav_on==2" :isHistory="false"></statistic_list>

    <!--底部菜单-->
    <footer>
      <footer-nav :footernavdata="homeFooterList"></footer-nav>
    </footer>

    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="homeContentList.dialogListConfig" v-if="homeFooterList.nav_on==0"></dialog_mask_bottom>

  </div>
</template>

<script>
  import home_head_nav from '@/components/home/home_head_nav';
  import footer_nav from '@/components/home/footer_nav';
  import diary_list from './list/diary_list';
  import loadMore from '@/components/base/load_more';
  import select_card from '@/components/button/menu_tab_two';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import homePage from '../js/homePage';
  import statistic_list from './statistic/statistic_list.vue'
  import * as timeUtil from '@/assets/js/time-util';

  export default {
    name: 'index',
    data(){
      return {
        headData:homePage.home.headData,//头部和搜索框
        menuChangeData:homePage.home.selectData,//相关页面tab菜单切换数据结构
        homeContentList:homePage.home.homeContentList,//数据列表
        loadMore:homePage.home.loadMore,//加载列表组件数据
        homeFooterList: dataBase.home.homeFooterList,//底部菜单
        lastScrollTop:0,
        showSearchBar:true,//控制搜索框显示或者隐藏，true:显示
        doSearch:false,//判断搜索状态，true:不判断显示隐藏搜索框，false:判断隐藏或显示
        lock_roll:false,//默认滚动
      }
    },
    created:function(){
      //请求草稿和代办条数
      this.initThis();

      //判断旧页面的类型，改变接口请求参数和tab位置
      this.getUrlType();
      //根据不同的界面切换搜索框选项
      this.headData.searchBar.moreFunction.option = this.homeFooterList.nav_on == 0?this.headData.searchOption:this.headData.searchOptionMore
      this.headData.searchBar.moreFunction.option[1].callback = this.showTimeInput;

      //底部菜单回调
      for(var i=0;i<this.homeFooterList.nav.length;i++){
        if(i != 2) {
          this.homeFooterList.nav[i].data.keyWord="";
          this.homeFooterList.nav[i].data.typeId="";
          this.homeFooterList.nav[i].callBack = this.footerChange;
        }
      }
      this.menuChangeData.nav[0].data.keyWord = '';
      this.menuChangeData.nav[1].data.keyWord = '';
    },
    //路由跳转后，限制滚动
    beforeDestroy:function () {
      this.headData.show=true;
      this.lock_roll=true;
    },
    methods:{
      //请求草稿、待办条数
      initThis:function () {
        var self = this;
        _.ajax({
          url: _.baseURL + self.homeContentList.indexCount.url,
          type: 'POST',
          success: function (result) {
            if (result.code == "0") {
              self.headData.nav[1].num = result.data.draftNum;
              self.homeFooterList.nav[1].num = result.data.unReadenNum;
            } else {
              _.alert('提示', result.desc);
            }
          }
        })
      },

      //判断旧页面的类型，改变接口请求参数和tab位置
      getUrlType(){
        var status=_.getUrlParam("status");
        var type=_.getUrlParam("type");

        if(type=="2"){
          if(status=="1"){//待阅
            this.homeFooterList.nav_on=1;
            this.loadMore.data=this.homeFooterList.nav[this.homeFooterList.nav_on].data;
          }else{
            this.homeFooterList.nav_on=2;
            if(status=="3"){//我负责的
              this.menuChangeData.index=0;
            }else if(status=="4"){//我相关的
              this.menuChangeData.index=1;
            }
            this.loadMore.data=this.menuChangeData.nav[this.menuChangeData.index].data;
          }
        }else{
          this.initFooterStatus();
        }
      },

      //判断是否切换了请求页面，来决定搜索框的显示隐藏
      showMsgFromLoadMore:function(data){
        this.headData.searchBar.show=true;
        if(!this.doSearch){
          if(this.homeFooterList.nav_on==0){
            this.headData.searchBar.show = data.totalRows > 20 ? true : false;
          }
          if(data.status == "1" && data.type == "2"){
            this.homeFooterList.nav[1].num = data.totalRows;
          }
        }
      },

      //重置页面底部状态和列表
      initFooterStatus(){
        if(this.homeFooterList.nav_on==null){
          this.homeFooterList.nav_on=0;
        }
        if(this.homeFooterList.nav_on==3){
          this.loadMore.data=this.menuChangeData.nav[this.menuChangeData.index].data;
        }else if(this.homeFooterList.nav_on!=2){
          this.loadMore.data=this.homeFooterList.nav[this.homeFooterList.nav_on].data;
        }
      },

      //相关页面tab切换
      showMsgFromSelectCard:function(msg,index){
        if(msg!=null && msg!==''&& msg!=undefined && msg.data){
          msg.data.keyWord = this.loadMore.data.keyWord;
          this.doSearch=true;
          this.showMsgFromFooter(msg);
        }
      },

      // 搜索关键字后重新请求
      getSearchRequest:function(keyWord, val){
        this.loadMore.data.keyWord=keyWord;
        this.loadMore.data.typeId=val;
        this.doSearch=true;//正在进行搜索
        this.resetRequestListData();
      },

      //底部菜单回调
      footerChange(msg){
        this.headData.searchBar.show=false;
        this.doSearch=false;//无搜索状态
        this.loadMore.data.keyWord=""; //赋值接口参数、清空keyword
        //根据不同的界面切换搜索框选项,再对选择时间的选项callBack赋值
        this.headData.searchBar.moreFunction.option = this.homeFooterList.nav_on == 0?this.headData.searchOption:this.headData.searchOptionMore
        var self = this;
        self.headData.searchBar.moreFunction.option.forEach(function (e) {
          if(e.name=="填写时间"){
            e.callback = self.showTimeInput;
          }
        });
        if(msg.text=="相关日志"){
          self.showMsgFromFooter(self.menuChangeData.nav[self.menuChangeData.index]);
        }else{
          self.showMsgFromFooter(msg);
        }
      },

      showTimeInput:function () { //搜索框的输入特殊功能，弹出时间插件
        var self = this;
        self.headData.searchBar.inputFocus = false;
        self.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: self.headData.searchBar.keyWord?self.headData.searchBar.keyWord:timeUtil.changeFormat(new Date(), 'yyyy-MM-dd'),
          onConfirm (val) {
            self.headData.searchBar.keyWord = val
          }
        })
      },

      //赋值请求参数、重置搜索框
      showMsgFromFooter:function (msg) {
        //hasRecord 设置无内容提示图标、标题、提示内容
        this.loadMore.data=msg.data;
        this.loadMore.data.typeId="";
        this.resetRequestListData();   //清空列表数据，重新请求
      },

      //重新请求列表数据
      resetRequestListData:function(){
        this.$refs.loadMoreFun.clearLoadFun();//重新请求
      },
      scrollFun:function(e){ //head滚动
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

        if(!this.lock_roll){
          if((scrollTop-this.lastScrollTop)>200){
            this.headData.show = false;//隐藏头部菜单
            this.lastScrollTop = scrollTop
          }
          if(this.lastScrollTop-scrollTop>10){
            this.headData.show = true;//显示头部菜单
            this.lastScrollTop = scrollTop
          }
        }
      }
    },
    components:{
      "home-head-nav":home_head_nav,
      "footer-nav":footer_nav,
      "diary-list":diary_list,
      loadMore,
      select_card,
      dialog_mask_bottom,
      statistic_list
    }
  }

</script>
<style>
  .dp-header .dp-item.dp-right{
    color:#2F7DCD!important;
  }
</style>
