<template>
  <div class="wrap" v-windowscroll="scrollFun">

    <div v-show="showSearchBar" class="qwui-searchBox_height"></div>
    <!--搜索框-->
    <div v-show="showSearchBar" class="qwui-menu_tab_fixed active">
      <search_bar :searchinput="searchBarData" :keyWord="searchWord" @listenToSearchBox="searchKeywordClick" ></search_bar>
    </div>

    <!--待处理-->
    <div v-show="!showMy" >
      <ul>
        <user_title_list v-for="item in home.List"
                         :key="item.moveapproveId"
                         :toParams="{}"
                         :headPic="item.headPic|formatHeadPic"
                         :title="item.title"
                         @routerLinkClick="routerLinkClick(item)"
                         :styleObject="{paddingLeft:'25px'}">
          <span v-if="item.notRead=='1'" class="qwui-yuan_red" slot="tip"></span>
          <span class="list_user_name">{{item.personName}}</span>
          <span class="list_user_time">{{item.createTime|formatTime}}</span>
        </user_title_list>
      </ul>
    </div>

    <!--我的-->
    <Nav_tabs v-show="showMy"
              :defaultActiveKey="my.activeKey"
              :activeIndex="myIndexActive"
              position="top"
              :tabs="Tabs" @listenNavTabs="listenNavTabsBack">
      <div slot="height" style="height: 50px;"></div>
      <ul slot="mySubmit" tab="我提交的" class="qwui-my_waitDeal">
        <user_title_list  v-for="(item,index) in mySubmit.List"
                          :key="item.moveapproveId"
                          :showRightMenu="true"
                          :title="item.title"
                          :toParams="{name:'moveapproveDetail',params: { moveId: item.moveapproveId},query: { moveId: item.moveapproveId}}">
          <applyStatus :applystatus="append_status(item.auditStatus)"></applyStatus>
          <p class="list_content paddingLeft">{{item.content}}</p>
          <div slot="rightMenu" class="qwui-list_menu_box qwui-list_menu_more" @click.stop.prevent="clickMenu(item.moveapproveId,index)"></div>
        </user_title_list>
      </ul>
      <ul slot="myOwner" tab="我负责的" class="qwui-my_waitDeal">
        <user_title_list v-for="item in myOwner.List"
                         :key="item.moveapproveId"
                         :headPic="item.headPic|formatHeadPic"
                         :title="item.title"
                         :toParams="{name:'moveapproveDetail',params: { moveId: item.moveapproveId},query: { moveId: item.moveapproveId}}">
          <applyStatus :applystatus="append_status(item.auditStatus)"></applyStatus>
          <span class="list_user_name paddingLeft">{{item.personName}}</span>
          <span class="list_user_time">{{item.createTime|formatTime}}</span>
        </user_title_list>
      </ul>
      <ul slot="myRelation" tab="我相关的" class="qwui-my_waitDeal">
          <user_title_list  v-for="item in myRelationList"
                            :key="item.moveapproveId"
                            :headPic="item.headPic|formatHeadPic"
                            :title="item.title"
                            :toParams="{name:'moveapproveDetail',params: { moveId: item.moveapproveId},query: { moveId: item.moveapproveId}}">
            <applyStatus :applystatus="append_status(item.auditStatus)"></applyStatus>
            <span class="list_user_name paddingLeft">{{item.personName}}</span>
            <span class="list_user_time">{{item.createTime|formatTime}}</span>
          </user_title_list>
      </ul>
      <ul slot="myNoRead" tab="未阅的" class="qwui-my_waitDeal">
        <user_title_list  v-for="item in myNoRead.List"
                          :key="item.moveapproveId"
                          :headPic="item.headPic|formatHeadPic"
                          :title="item.title"
                          :toParams="{name:'moveapproveDetail',params: { moveId: item.moveapproveId},query: { moveId: item.moveapproveId}}">
          <applyStatus :applystatus="append_status(item.auditStatus)"></applyStatus>
          <span class="list_user_name paddingLeft">{{item.personName}}</span>
          <span class="list_user_time">{{item.createTime|formatTime}}</span>
        </user_title_list>
      </ul>
    </Nav_tabs>
      <!--end-->

    <!--加载更多-->
    <Load_more v-show="myTotalRows>0" :loading="loading"
               :currPage="myCurrentRows"
               :maxPage="myMaxPage" @loadMoreClick="homeLoadMore">
      <span>共 {{myTotalRows}} 记录 <span v-show="!showMy && home.notReadNum">
        <span class="qwui-notReadNum">|</span>其中 {{home.notReadNum}} 未阅</span>
      </span>
    </Load_more>

    <!--无记录-->
    <No_record v-show="showRecord" :setTop="true" :hasRecord="recordData"></No_record>

    <!--底部导航-->
    <Nav_footer>
      <Tab_one icon="icon-renwufenpai-daichuli" tab="待处理"
               :num="Number(home.totalRows)"
               :index="1"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="tabOneClickMy"></Tab_one>
      <Nav_icon icon="qwui-cross_icon" @navIconClick="navIconClick"></Nav_icon>
      <Tab_one icon="icon-shenpiqingshi_wode" tab="我的"
               :index="2"
               defaultColor="icon-LightBlue"
               :activeIndex="tabActiveIndex"
               @tabOneClick="tabOneClickMy"></Tab_one>
    </Nav_footer>

    <!--新建、草稿弹窗-->
    <Mask_fix :show.sync="showMaskFix" :position="'bottom'" :modal="true" :modalExtent="modalExtent" @modelClick="closeClick">
      <transition name="maskFix">
        <div class="qwui-addDraft_nav" v-if="showMaskFix1">
          <Nav_icon icon="qwui-addDraft_icon icon_edit" @navIconClick="navIconClickAdd">
            <p class="qwui-addDraft_nav_text">新建申请</p>
          </Nav_icon>
          <Nav_icon icon="qwui-addDraft_icon icon_draft" @navIconClick="navIconClickDraft">
            <p class="qwui-addDraft_nav_text">草稿 <span v-if="draftNum" class="text-num">({{draftNum}})</span></p>
          </Nav_icon>
        </div>
      </transition>

      <!--删除交叉图标-->
      <div class="qwui-footer_close_fixed" @click="closeClick">
        <transition name="close">
        <i class="qwui-close_icon" v-show="showCloseIcon"></i>
        </transition>
      </div>
    </Mask_fix>


    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogConfig"></dialog_mask_bottom>
  </div>
</template>
<script>
  import search_bar from '../../../components/base/search_box.vue';
  import Nav_tabs from '@/components/base/nav_tabs';
  import user_title_list from '@/components/list/user_title_list';
  import applyStatus from '@/components/part/apply_status';
  import Nav_footer from '@/components/part/nav_footer';
  import Tab_one from '@/components/part/tab_one';
  import Nav_icon from '@/components/part/nav_icon';
  import Mask_fix from '@/components/part/mask_fix';
  import Load_more from '@/components/list/load_more';
  import No_record from '@/components/base/noRecord';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import {requestBatchDeleteList,getHomeDraftNum} from "../../moveapprove/api/getData";
  import defaultHeadPic from '@/assets/images/touxiang02.png';
  export default {
    name:"index",
    data() {
      return{
        showMy:false,
        loading:false,//正在加载更多

        searchBarData:{ //头部搜索框
          show:true,
        },
        //关键字
        searchWord:"",
        //我待处理的
        home:{
          List:[],//待处理
          firstLoading:true,//第一次加载
          lock_roll:false,
          keyWord:"",
          currPage:"",
          maxPage:"",
          totalRows:"",
          notReadNum:0
        },
        draftNum:0,// 草稿条数
        recordData:{},
        //我的
        my:{
          indexActive:0,//默认tab
          activeKey:"mySubmit",//记录我的 当前的tab
        },
        getTaskUrl:"/portal/moveapprove/findMyMoveapproveTaskTodo.do",//待处理
        getMyMoveUrl:"/portal/moveapprove/myMove.do", //我的URL
        //我提交的
        mySubmit:{
          index:0,
          firstLoading:true,//第一次加载
          lock_roll:false,
          List:[],//列表
          keyWord:"",
          currPage:"",
          maxPage:"",
          totalRows:"",
        },
        //我负责的
        myOwner:{
          index:1,
          firstLoading:true,//第一次加载
          lock_roll:false,
          List:[],//列表
          keyWord:"",
          currPage:"",
          maxPage:"",
          totalRows:"",
        },
        //我相关的
        myRelation:{
          index:2,
          firstLoading:true,//第一次加载
          lock_roll:false,
          List:[],//列表
          keyWord:"",
          currPage:"",
          maxPage:"",
          totalRows:"",//底部我待处理红色数量提示
        },
        //我的未阅
        myNoRead:{
          index:3,
          firstLoading:true,//第一次加载
          lock_roll:false,
          List:[],//列表
          keyWord:"",
          currPage:"",
          maxPage:"",
          totalRows:"",//底部我待处理红色数量提示
        },

        Tabs:[{text:"我提交的",num:5}, {text:"我负责的",}, {text:"我相关的"},{text:"未阅"}],

        showCloseIcon:false,
        pageSize:20,//查询20页数据
        dialogConfig: { // 点状弹窗列表操作
          show: false,
          title: '',//头部标题
          btnConfig: []
        },
        isGetNextRequest:false,//正在请求
        isParams:{//删除wo入参
          ids:""
        },
        showMaskFix: false,//显示新建、草稿弹窗
        showMaskFix1: false, //显示新建、草稿图标
        modalExtent:0.9,
        ListIndex:"",//需要删除的列表index
      }
    },
    computed:{
      //当前tabs的位置
      myIndexActive(){
        if(this.$route.name!="home"){
          return this[this.$route.name].index;
        }
      },
      //当前底部导航位置
      tabActiveIndex(){
        return this.$route.name=="home"? "1":"2";
      },
      //传输当前页数
      myCurrentRows(){
        return this[this.$route.name].currPage;
      },
      //传输最大页数
      myMaxPage(){
        return this[this.$route.name].maxPage;
      },
      //显示数据总数
      myTotalRows(){
        return this[this.$route.name].totalRows;
      },
      //显示无记录图标
      showRecord(){
        this.recordData = {
          icon: this.$route.name=="home"? "qwui-icon_blue_text1":'qwui-icon_blue_text2',
          title: this.$route.name=="home"? '没有需您处理的事项':"暂无数据",
          text: '',
        }
        return this[this.$route.name].totalRows!=="" && this[this.$route.name].totalRows==0;
      },
      myRelationList(){
        return this.myRelation.List;
      },
      showSearchBar(){
        if(this.$route.name=="home"){
          return !(this[this.$route.name].keyWord=="" && this[this.$route.name].totalRows==0);
        }else{
          return true;
        }
      }
    },
    filters:{
      //过滤当前列表的时间
      formatTime(data){
        return _.getFormatListTime(data);
      },
      //过滤头像
      formatHeadPic(data){
        return data && data!='0'? data: defaultHeadPic
      }
    },
    created(){
      if(this.$route.name!="home"){
        this.showMy=true;
        this.my.activeKey=this.$route.name;
        this.my.indexActive=this[this.$route.name].index;
      }
      //初始化请求
      this.requestGetdata(this.settingOptions(this.$route.name));
      this.getHomeNumDraftNum();
    },
    //监听路由变化
    watch: {
      '$route': 'fetchRouteData'
    },
    methods: {
      //待办数量、草稿条数
      getHomeNumDraftNum (){
        let self = this
        getHomeDraftNum().then(function (result) {
          if(result.code=='0'){
            self.home.totalRows = result.data.todoNum? result.data.todoNum : 0;
            self.draftNum = result.data.draftNum? result.data.draftNum :0 ;
          }else{
            _.alert('提示',result.desc)
          }
        })
      },
      append_status(name){
        return _.append_status(name,false);
      },
      //重置请求入参
      settingOptions(type){
        var status={
          "home":{},
          "mySubmit":{status:"all",type:1},
          "myOwner":{status:6,type:2},
          "myRelation":{status:1,type:2},
          "myNoRead":{status:4,type:2}
        };
        status[type].keyWord=this[this.$route.name].keyWord;
        status[type].page=1;
        status[type].pageSize=this.pageSize;
        return status[type];
      },
      //监听路由变化
      fetchRouteData(){
        if(this.$route.name!="home"){
          this.my.activeKey=this.$route.name;
          this.my.indexActive=this[this.$route.name].index;
        }else{
          this.showMy = false;
        }
        if(this[this.$route.name].firstLoading){
          this.requestGetdata(this.settingOptions(this.$route.name));
        }
      },
      //搜索关键字
      searchKeywordClick(data){
        this[this.$route.name].keyWord=data;
        this.$route.name === "home"? this.home.notReadNum = 0:''
       //重新请求列表
        this.requestGetdata(this.settingOptions(this.$route.name));
      },
      //接口数据处理
      requestGetdata(data){
        this[this.$route.name].firstLoading? _.showLoading():"";
        var url=this.$route.name=="home"? this.getTaskUrl:this.getMyMoveUrl;
        var self=this;
        self.loading=true;
        _.ajax({
          url: _.baseURL + url,
          type: 'POST',
          data: data,
          success: function (result) {
            _.hideLoading();
            self.loading=false;
            self[self.$route.name].firstLoading=false;
            if(result.code==='0'){
              self.showMoveTaskList(result.data);
              self[self.$route.name].lock_roll=false;
            }else{
              _.alert('提示',result.desc)
            }
          }
        });
      },
      //加载更多：加页
      homeLoadMore(){
        var data=this.settingOptions(this.$route.name);
        data.page=this[this.$route.name].currPage;
        data.page++;
        this.requestGetdata(data);
      },
      //返回数据处理
      showMoveTaskList(data){
        if (data){
          data.currPage==1? this[this.$route.name].List.length=0:"";
          if(this.$route.name === 'home'){
            this.home.notReadNum+= data.notReadNum;
          }
          data.pageData? this[this.$route.name].List.push(...data.pageData) : '';
          this[this.$route.name].maxPage = data.maxPage;
          this[this.$route.name].totalRows = Number(data.totalRows);
          this[this.$route.name].currPage = data.currPage;
          this.searchBarData.show = this[this.$route.name].totalRows>0? true:false;
        }
      },
      //我提交的列表操作
      clickMenu(id,index){
        if(id){
          this.isParams.ids=id;
          this.ListIndex=index;
          this.dialogConfig.show=true;
          this.dialogConfig.title="是否删除该申请单？";
          this.dialogConfig.btnConfig=[
            {title: "删除", callBack: this.delThis, primary: true},
            {title: "取消", callBack: null}
            ];
        }
      },
      //点击删除我提交的列表
      delThis(){
        requestBatchDeleteList(this.isParams,this.sereDelThis);
      },
      //确定删除我提交的
      sereDelThis(data){
        this.dialogConfig.show=false;
        if(data){
          _.tooltips_succeed("删除成功");
          this.mySubmit.List.splice(this.ListIndex,1);
          this.mySubmit.totalRows--;
        }
      },
      //路由列表点击跳转
      routerLinkClick (data){
        this.$router.push({
          path: '/detail',
          params: {"moveId":data.moveapproveId},
          query: {"moveId":data.moveapproveId}
        })
      },
      //头部tab点击切换
      listenNavTabsBack(index){
        if(index!=undefined){
          var obj=["/my/submit", "/my/myOwner","/my/relative","/my/myNoRead"];
          this.$router.push({
            path: obj[index]
          });
        }
      },
      //底部导航点击
      tabOneClickMy(){
        if(this.$route.name=="home" ){
          var path={
            "mySubmit":"/my/submit",
            "myOwner":"/my/myOwner",
            "myRelation":"/my/relative",
            "myNoRead":"/my/myNoRead"
          };
          this.$router.push({
            path: path[this.my.activeKey]
          });
          this.showMy=true;
        }else{
          this.$router.push({
            path: '/'
          });
          this.showMy=false;
        }
      },
      closeClick(){
        this.modalExtent = 0
        this.showMaskFix1=false
        this.showCloseIcon = false;
        var self=this;
        setTimeout(function () {
          self.showMaskFix = false
          self.showMaskFix1=false
          self.showCloseIcon = false
        },500)
      },
      navIconClick(){
        this.showMaskFix1 = true
        this.showMaskFix = true
        this.modalExtent = 0.9
        this.showCloseIcon=true;
      },
      navIconClickAdd(){
        this.$router.push({path:'/add'});
      },
      navIconClickDraft(){
        this.$router.push({path:'/draft'});
      },
      scrollFun(){
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(this[this.$route.name] && !this[this.$route.name].lock_roll && this[this.$route.name].currPage<this[this.$route.name].maxPage){
            this[this.$route.name].lock_roll=true;
            this.homeLoadMore();
          }
        }
      },
    },
    components:{
      search_bar,
      Nav_tabs,
      user_title_list,
      applyStatus,
      Nav_footer,
      Tab_one,
      Nav_icon,
      Mask_fix,
      Load_more,
      No_record,
      dialog_mask_bottom,
    }
  }
</script>
<style scoped>
  .qwui-searchBox_height{
    height: 43px;
  }
  .qwui-footer_close_fixed{
    display: inline-block;
    position: fixed;
    bottom: 12px;
    left: 50%;
    height: 21px;
    margin-left: -11px;
    z-index: 8;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }

  .qwui-flow_selectNode_title{
    padding-top: 20px;
    font-size: 16px;
    color: #333;
  }
  .qwui-flowNodeList_select{
    display: flex;
    padding: 10px;
    font-size: 16px;
    color: #333;
    border-radius: 4px;
    margin-top: 15px;
    background: #fff;
  }
  .qwui-my_waitDeal{
    width: 100%;
    flex-shrink: 0;
  }
  .qwui-addDraft_nav{
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding-bottom: 100px;
  }
  .qwui-addDraft_nav_text{
    padding-top: 5px;
    font-size: 14px;
    color: #333;
  }
  /*列表的样式*/
  .list_content{
    flex: 1;
    font-size: 13px;
    color: #999;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .list_user_name{
    padding-right: 15px;
    line-height: 18px;
    vertical-align: middle;
  }
  .list_user_time{
    margin-right: 10px;
    line-height: 18px;
    vertical-align: middle;
  }
  .paddingLeft{
    padding-left: 10px;
  }
  .text-num{
    color: #999;
  }
  .select_node_mask{
    padding: 10px 15px 0;
    overflow-y: scroll;
  }
  .select_node_mask::-webkit-scrollbar{
    width: 0;
  }
  .qwui-notReadNum{
    padding: 0 10px;
    color:#ddd
  }

  .maskFix-enter-active,.maskFix-leave-active{
    transition: all .5s;
  }
  .maskFix-enter,.maskFix-leave-to {
    opacity: 0;
    transform: translateY(100%);
  }
  /*关闭图标*/
  .qwui-close_icon{
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url(../../../assets/images/icon_cross_1.png) no-repeat;
    background-size: cover;
  }
  .close-enter-active{
    transition: all .3s;
  }

  .close-leave-active{
    transition: all .5s;
  }
  .close-enter{
    opacity: 0.6;
    transform: rotate(-180deg);
  }
  .close-leave-to{
    opacity: 0.6;
    transform: rotate(-225deg);
  }
</style>
