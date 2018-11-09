<template>
  <div class="wrap">
    <div class="qwui-search_box_height"></div>
    <div class="qwui-menu_tab_fixed active">
      <search-bar :searchinput="searchBar" @listenToSearchBox="search"></search-bar>
    </div>
    <!--  头部标题栏start  -->
    <div v-if="unReadNum>0" class="qwui-unread" :class="{active:!unReadPage}">
      <span class="to_unread" v-if="!unReadPage" @click="toUnReadPage">
        <span>{{unReadNum}}个未阅动态</span>
        <i class="to_unread_icon"></i>
      </span>
      <span class="mark_unread" v-if="!unReadPage" @click="markUnread">标记为已阅</span>
      <span v-else @click="markUnread">全部标记为已阅({{unReadNum}})</span>
    </div>
    <div v-if="dynamicNum>0" class="qwui-unread" @click="toDynamicAudit(1)">
      <span>
        {{dynamicNum}}个动态审核<i class="to_unread_icon"></i>
      </span>
    </div>
    <div v-if="commentNum>0" class="qwui-unread"  @click="toDynamicAudit(2)">
      <span>
        {{commentNum}}个评论审核<i class="to_unread_icon"></i>
      </span>
    </div>
    <!--  头部标题栏end  -->

    <!--  主列表  -->
    <index-list :list="contentList" :listParam="listParam"></index-list>
    <load-more :loadmore="loadMore" describeWord=" 新闻" ref="loadMoreFun"
               @showMsgFromLoadMore="showMsgFromLoadMore"></load-more>


    <action-sheet :dialogConfig="actionSheet"></action-sheet>
  </div>
</template>
<script>
  import searchBar from '../../../components/base/search_box.vue';
  import indexList from './list/indexList.vue'
  import loadMore from './login/loadMore.vue';
  import actionSheet from '../../../components/base/dialog_mask_bottom';
  import homePage from '../js/homePage'
  import {getDynamicType, getTitle, getDynamicNum, getCommentNum, markUnreadPower, markUnread} from '../api/getData'
  export default {
  props:{
    originId:{
      type:String,
      default:''
    },
    originName:{
      type:String,
      default:''
    }
  },
  data(){
    return {
      dataBase:dataBase,
      searchBar:homePage.searchBar,
      actionSheet:homePage.actionSheet,
      homeFooter:homePage.homeFooter,
      loadMore:homePage.loadMore,
      unReadPage:false, //true表示进入到未阅页
      dynamicNum:0, //动态审核未阅数量
      commentNum:0, //评论审核未阅数量
      unReadNum:0, //未阅动态数量
      listParam:{ //传到list页的数据
        dynamicType:1, //记录当前选择的类型
        schType:this.$route.query.schType?this.$route.query.schType:'',
        keyWord:'',
        isPassReview:false
      },
    }
  },
  created:function () {
    this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = this.originId != ''?this.originId:1;
    this.searchBar.moreFunction.defaultChoose = this.originName != ''?this.originName:'';
    this.originName != ''?document.title = this.originName:'';
    if(this.$route.query.schType == '8'){
      this.unReadPage = true;
      this.loadMore.data['schType'] = '8';
      this.loadMore.data['tbXyhDynamicinfoPO.dynamicType'] = '4';
      this.searchBar.moreFunction.show=false;
    }
    this.loadTitleIcon();
    //如果不是新闻公告，就要删除后面两个选项
    this.searchBar.moreFunction.option = _.getUrlParam("agentCode").indexOf('dynamic') != -1
      ? [{name:'员工祝福', callback:null, placeholder:'搜索', value:0},
        {name:'私人信箱', callback:null, placeholder:'搜索', value:1}]
      :  [];
    this.loadTitle();
    this.actionSheet.show = false;
    this.searchBar.rightSpan.callback = this.setActionSheet;
  },
  computed:{
    contentList:function(){
      return this.loadMore.pageConfig.pageData
    }
  },
  methods:{
    //标记为已阅
    markUnread:function () {
      markUnreadPower( (result) =>{
        if(result.isBatchRead == '0'){
          _.alert('提示','后台没有开启一键已阅功能,请联系管理员开启')
        } else {
          var buttonConfig = {
            primaryBtn:{name:"确定", callBack:this.doMarkUnread},
            defaultBtn:{name:"取消", callBack:null},
          };
          _.alert("标记为已阅","确定将所有未阅标记为已阅？",buttonConfig)
        }
      })
    },
    doMarkUnread:function () {
      markUnread( (result) =>{
        this.unReadNum = 0;
      })
    },
    //未阅界面
    toUnReadPage:function () {
      this.$router.push({
        path: '/index',
        query: { schType: '8'}
      })
      location.reload();
    },
    //搜索，keyword关键字，val左部选项的查询条件（id）
    search:function (keyWord, val) {
      this.loadMore.data['tbXyhDynamicinfoPO.title']=keyWord?keyWord:'';
      this.loadMore.data['tbXyhDynamicinfoPO.dynamicType']=val?val:(this.originId?this.originId:'');
      this.listParam.dynamicType = val;
      this.listParam.keyWord = keyWord;
      this.resetRequestListData();
    },
    //重新请求列表数据
    resetRequestListData:function(){
      this.$refs.loadMoreFun.clearLoadFun();//重新请求
    },
    //获取页面标题
    loadTitle:function () {
      getTitle( (result) =>{
        if(result.isTrust){
          document.title = result.agentName
        }
      })
    },
    //获取搜索框的切换选项
    loadTitleIcon:function () {
      var self = this;
      getDynamicType( (result) =>{
        result.list.reverse().forEach(function (e) {
          self.searchBar.moreFunction.option.splice(0,0,
            {name:e.typeName, callback:null, placeholder:'搜索', value:e.id})
        })
      })
    },
    showMsgFromLoadMore:function (val) {
      //权限判断 获取 动态审核数量 和 评论审核数量
      if(val.isCommentReviewer){
        getCommentNum( (result) =>{
          this.commentNum = result.waitReview
        });
        (this.actionSheet.btnConfig[0].data == 2 || this.actionSheet.btnConfig[0].data == 1)
          ? ''
          : this.actionSheet.btnConfig.splice(0,0,{title: "评论审核", data:2, callBack: null})
      }
      if(val.isDynamicReviewer){
        getDynamicNum( (result) =>{
          this.dynamicNum = result.waitReview
        });
        (this.actionSheet.btnConfig[0].data == 1)
          ? ''
          : this.actionSheet.btnConfig.splice(0,0,{title: "新闻审核", data:1, callBack: null})
      }
      this.searchBar.rightSpan.show=(this.actionSheet.btnConfig.length==3 && this.originId != '')?false:true;
      this.unReadNum = val.totalRows;
    },
    setActionSheet:function () { //设置actionsheet回调函数
      var self = this;
      self.actionSheet.btnConfig.forEach(function (e,index) {
        if(index < self.actionSheet.btnConfig.length-1){
          e.callBack = self.toDynamicAudit
        }
      })
      self.actionSheet.show = true;
    },
    //跳到actionList
    toDynamicAudit(data) {
      this.$router.push({
          path:'/actionList',
          query: {data:data}
        });
    },
  },
  components:{searchBar, indexList, loadMore, actionSheet},
}
</script>
<style src="../scss/index.scss" lang="scss">
</style>
