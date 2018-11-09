<template>
  <div class="wrap" v-windowscroll="scrollFun">

    <!--头部菜单栏以及搜索栏,getSearchRequest:监听搜索事件-->
  	<header>
  		<home-head-nav :headrdata="headData" :footerIndex="homeFooterList.nav_on" v-on:getSearchRequest="getSearchRequest"></home-head-nav>
    </header>

    <!--相关页面的tab菜单-->
    <nav v-show="homeFooterList.nav_on!=0" class="qwui-menu_tab_fixed" :class="{'active':!headData.show && !headData.searchBar.show,'actived':
  	!headData.show && headData.searchBar.show}">
      <select_card :selectdata="menuChangeData" v-on:listenTabChange="showMsgFromSelectCard"></select_card>
    </nav>

    <!--主体-->
    <section class="main">

      <!--列表-->
    	<home-work-list :listdata="homeContentList" :loadmore="loadMore" :footernav="homeFooterList.nav_on" :isscore="isScore"></home-work-list>

      <!--加载状态-->
      <load-more :loadmore="loadMore" describeWord="i18n.informTotal" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></load-more>
    </section>

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
import home_work_list from './list/home_work_list';
import loadMore from '@/components/base/load_more';
import select_card from '@/components/button/menu_tab_two';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';

export default {
  name: 'index',
  data(){
    return {

      headData:dataBase.home.headData,//头部和搜索框
      menuChangeData:dataBase.home.selectData,//相关页面tab菜单切换数据结构
      homeContentList:dataBase.home.homeContentList,//数据列表
      loadMore:dataBase.home.loadMore,//加载列表组件数据
      homeFooterList: dataBase.home.homeFooterList,//底部菜单
      lastScrollTop:0,
      showSearchBar:true,//控制搜索框显示或者隐藏，true:显示
      doSearch:false,//判断搜索状态，true:不判断显示隐藏搜索框，false:判断隐藏或显示
      lock_roll:false,//默认滚动
      isScore:0,//默认开启评分
      nav:[ //我的 tab
        {
          content: 'i18n.inProgress',
          data:{ //点击切换传递的数据
            page:1,
            pageSize:10,
            keyWord:'',
            status:6,
            type:2
          },
        },
        {
          content: 'i18n.overDue',
          data:{ //点击切换传递的数据
            page:1,
            pageSize:10,
            keyWord:'',
            status:5,
            type:2
          },
        },
        {
          content: 'i18n.isEnded',
          data:{ //点击切换传递的数据
            page:1,
            pageSize:10,
            keyWord:'',
            status:2,
            type:2
          },
        }
      ],
      navMore:[//待我处理 tab
        {
          content: 'i18n.toDeal',
          data:{ //点击切换传递的数据
            page:1,
            pageSize:10,
            keyWord:'',
            status:0,
            type:2
          },
        },
        {
          content: 'i18n.unRead',
          num:'',
          data:{ //点击切换传递的数据
            page:1,
            pageSize:10,
            keyWord:'',
            status:3,
            type:2
          },
        },
      ],
    }
  },
  created:function(){

    //请求草稿和代办条数
    this.initThis();

    //判断旧页面的类型，改变接口请求参数和tab位置
    this.getUrlType();
    //底部菜单回调
    for(var i=0;i<this.homeFooterList.nav.length;i++){
      this.homeFooterList.nav[i].data.keyWord="";
      this.homeFooterList.nav[i].callBack=this.footerChange;
    }
    var self = this;
    self.navMore.forEach(function (e) {
      e.data.keyWord = ''
    })
    self.nav.forEach(function (e) {
      e.data.keyWord = ''
    })
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
            self.headData.nav[1].num = result.data.homeworkCount;
            self.homeFooterList.nav[1].num = result.data.needDoCount;
            self.navMore[1].num = result.data.noReadCount?('(' + result.data.noReadCount+')'):'';
            if(self.homeFooterList.nav_on==2){
              self.menuChangeData.nav = self.nav;
            } else if (self.homeFooterList.nav_on==1){
              self.menuChangeData.nav = self.navMore;
            }
            if(result.data.isScore!=undefined && result.data.isScore!=""){
              self.isScore= result.data.isScore;
            }
          } else {
            _.alert("i18n.notice", result.desc);
          }
        }
      })
    },

    //判断旧页面的类型，改变接口请求参数和tab位置
    getUrlType(){
      var status=_.getUrlParam("status");
      var type=_.getUrlParam("type");

      if(type=="2"){
        if(status=="0"){//待办
          this.homeFooterList.nav_on=1;
          this.loadMore.data=this.homeFooterList.nav[this.homeFooterList.nav_on].data;
        }else{
          this.homeFooterList.nav_on=2;
          switch(true){
            case status=="2"://已结束
              this.menuChangeData.index=2;
              break;
            case status=="3"://未阅
              this.menuChangeData.index=0;
              break;
//            case status=="4"://进行中
//              this.menuChangeData.index=1;
//              break;
            case status=="5"://逾期
              this.menuChangeData.index=1;
              break;
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
        this.headData.searchBar.show=true;
        if(this.homeFooterList.nav_on==0){
          this.headData.searchBar.show = data.totalRows > 20 ? true : false;
        }
      }
    },

    //重置页面底部状态和列表
    initFooterStatus(){
      if(this.homeFooterList.nav_on==null){
        this.homeFooterList.nav_on=0;
      }
      if(this.homeFooterList.nav_on!=0){
        this.loadMore.data=this.menuChangeData.nav[this.menuChangeData.index].data;
      }else{
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
    getSearchRequest:function(val){
      this.loadMore.data.keyWord=val;
      this.doSearch=true;//正在进行搜索
      this.$refs.loadMoreFun.clearLoadFun(); //清空列表数据，重新请求
    },

    //底部菜单回调
    footerChange(msg,index){
      this.headData.searchBar.show=false;
      this.doSearch=false;//无搜索状态
      this.loadMore.data.keyWord=""; //赋值接口参数、清空keyword
      if(index!=0){
        this.menuChangeData.nav=index==2?this.nav:this.navMore;
        this.showMsgFromFooter(this.menuChangeData.nav[this.menuChangeData.index]);
      }else{
        this.showMsgFromFooter(msg);
      }
    },
    //底部菜单切换重置请求列表、相关页面的tab菜单切换请求重置列表
    showMsgFromFooter:function (msg) {
      //hasRecord 设置无内容提示图标、标题、提示内容
      this.loadMore.data=msg.data;
      this.$refs.loadMoreFun.clearLoadFun();  //清空列表数据，重新请求
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
    "home-work-list":home_work_list,
    loadMore,
    select_card,
    dialog_mask_bottom
  }
}

</script>
