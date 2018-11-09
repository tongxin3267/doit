<template>
  <div class="qwui-check_page">
    <!--搜索框-->
    <div>
      <search_box :keyWord="searchWord" :searchinput="searchBar" :placeholder="searchText" @listenToSearchBox="searchKeywordClick"></search_box>
    </div>

    <!--主体-->
    <section class="main" v-if="isTabShow">
    <nav_tabs :defaultActiveKey="my.activeKey"
                :activeIndex="myIndexActive"
                class="qwui-check_nav"
                :tabs="Tabs" @listenNavTabs="listenNavTabsBack">
    </nav_tabs>
      <div class="qwui-check_list" v-scroll="loadMoreList">
      <client_check_list :loadmore="loadMore"></client_check_list>
      <!--加载状态-->
      <load_more :loading="loadingMore" :currPage="loadMore.padeConfig.currPage" :maxPage="loadMore.padeConfig.maxPage">
        <div class="qwui-check_tips" v-if="my.activeKey == 'Client'">共 {{loadMore.padeConfig.totalRows}}个客户</div>
        <div class="qwui-check_tips" v-else>共 {{loadMore.padeConfig.totalRows}}个联系人</div>
      </load_more>
      </div>
    </section>
    <!--无记录-->
    <no_record v-show="showRecord" :setTop="true" :hasRecord="recordData"></no_record>
    <flow_button v-if="showClient" :buttondata="buttonClientConfig" class="qwui-add_btn"></flow_button>
    <flow_button v-if="showContact" :buttondata="buttonContactConfig" class="qwui-add_btn"></flow_button>
  </div>
</template>
<script>
import search_box from '@/components/base/search_box';
import nav_tabs from '@/components/base/nav_tabs';
import no_record from '@/components/base/noRecord';
import load_more from  '@/components/list/load_more';
import client_check_list from '../base/client_check_list';
import flow_button from '@/components/button/flow_button';
import checkData from './data'
import { searchClientRepeat,searchContactRepeat } from '../../api/check/getData';

export default {
  components: {
    search_box,
    nav_tabs,
    no_record,
    load_more,
    client_check_list,
    flow_button
  },
  data() {
    return {
      searchText:"名称 / 联系电话",
      searchWord:"",
      searchBar:checkData.searchBar,
      loadMore:checkData.loadMore,//加载列表组件数据
      my:{
        indexActive:0,//默认tab
        activeKey:"Client",//客户 当前的tab
      },
      //客户
      Client:{
        index:0,
        firstLoading:true,//第一次加载
        lock_roll:false,
        List:[],//列表
        keyWord:"",
        currPage:"",
        maxPage:"",
        totalRows:"",
      },
      //联系人
      Contact:{
        index:0,
        firstLoading:true,//第一次加载
        lock_roll:false,
        List:[],//列表
        keyWord:"",
        currPage:"",
        maxPage:"",
        totalRows:"",
      },
      Tabs:[ {text:"客户",key:"Client"},{text:"联系人",key:"Contact"}],
      isTabShow:false,
      recordData : {},
      buttonClientConfig:{ //操作按钮
        primaryList:[
          {type:"primary",name:'新建客户',callBack:this.addClient},
          ],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
      buttonContactConfig:{ //操作按钮
        primaryList:[
          {type:"primary",name:'新建联系人',callBack:this.addContact},
        ],
        style:{class:""}//按钮是否置底部 active :底部、"":相对定位
      },
      page:1,//默认当前页
      hasMore: true,  // 是否还有数据
      loadingMore: false,  // 是否正在加载
      clientList: [],
      contactList: [],
      isAccurate:false,//判断是否精确查询
    }
  },
  computed: {
    //当前tabs的位置
    myIndexActive() {
    },
    //显示无记录图标
    showRecord(){
      if(!this.isTabShow ){
        this.recordData = {
          show: true,
          icon: "qwui-icon_no_check",
          title: "输入关键字查询",
          text: '',
        };
        return true
      }
      else if(this.isTabShow&&this.loadMore.padeConfig.totalRows==0&&this.loadMore.listConfig.type=='Client'){
        this.recordData = {
          show: true,
          icon: "qwui-icon_no_repeat",
          title: " 没有重复的客户",
          text: '',
        };
        return true
      }
      else if(this.isTabShow&&this.loadMore.padeConfig.totalRows==0&&this.loadMore.listConfig.type=='Contact'){
        this.recordData = {
          show: true,
          icon: "qwui-icon_no_repeat",
          title: "没有重复的联系人",
          text: '',
        };
        return true
      }
      else{
        return false
      }
    },
    showClient(){
      return this.loadMore.padeConfig.totalRows==0&&this.loadMore.listConfig.type=='Client'
    },
    showContact(){
      return this.loadMore.padeConfig.totalRows==0&&this.loadMore.listConfig.type=='Contact'
    },
  },
  created(){
    var keyword=this.getUrlParam("keyword");
    if( keyword !== null){
      this.isAccurate = true;
      this.searchWord = keyword;
      this.searchKeywordClick(keyword);
    }
  },
  methods: {
    //搜索关键字
    searchKeywordClick(keyWord){
      this.isTabShow=true;
      this.loadMore.data.keyWord=keyWord;
      this.searchWord = keyWord;
      this.clientList=[];
      this.contactList=[];
      this.page=1;
      this.searchRepeatList();
    },
    // 加载更多列表
    loadMoreList(el){
      let scrollTop = el.scrollTop;
      let offsetHeight = el.offsetHeight;
      let scrollHeight = el.scrollHeight;
      if(scrollTop + offsetHeight == scrollHeight){
        if(this.hasMore && !this.loadingMore){
          this.page++;
          this.searchRepeatList();
        }
      }
    },
    //获取查重列表
    searchRepeatList(){
      let params = {
        keyWord: this.loadMore.data.keyWord,
        isAccurate: this.isAccurate,
        page:this.page,
      };
      this.loadingMore = true;
      if(this.my.activeKey == 'Client'){
        let listConfig = {
          type:this.my.activeKey,
          topItem:"负责人",
          secondItem:"创建时间",
          lastItem:"最近成交",
        };
        this.loadMore.listConfig = listConfig;
        searchClientRepeat(params,(data) => {
          let list = data.clientPage.pageData;
          let arr = [];
          this.loadingMore = false;
          list.map((item,idx) => {
            let dataObj = {
              clientName: item.clientName,
              createTime: item.createTime,
              chargePersonList: item.chargePersonList,
              successTime: item.successTime,
              userId:item.id,
              poolId:item.poolId,
            };
            arr.push(dataObj);
          });
          this.clientList = this.clientList.concat(arr);
          this.loadMore.padeConfig.pageData=this.clientList;
          this.loadMore.padeConfig.totalRows = data.clientPage.totalRows;
          this.loadMore.padeConfig.maxPage  = data.clientPage.totalPages;
          this.loadMore.padeConfig.currPage = data.clientPage.currentPage;
          this.hasMore = data.clientPage.currentPage >= data.clientPage.totalPages? false : true;
        })
      }
      else{
        if(this.isAccurate == true){
          //如果是精确查询，没有联系人列表
          let listConfig = {
            type: this.my.activeKey,
          };
          this.loadMore.listConfig = listConfig;
          this.contactList = [];
          this.loadMore.padeConfig.pageData=[];
          this.loadMore.padeConfig.totalRows = 0;
          this.loadMore.padeConfig.maxPage  = 0;
          this.loadMore.padeConfig.currPage = 0;
          this.hasMore = false;
        }else{
          //模糊查询
        let listConfig = {
          type:this.my.activeKey,
          topItem:"负责人",
          secondItem:"创建时间",
          lastItem:"所属客户",
        };
        this.loadMore.listConfig = listConfig;
        searchContactRepeat(params,(data) => {
          let list = data.contactsPage.pageData;
          let arr = [];
          this.loadingMore = false;
          list.map((item,idx) => {
            let dataObj = {
              clientName: item.clientName,
              createTime: item.createTime,
              chargePersonList: item.chargePersonList,
              contactsName:item.contactsName,
              userId:item.id,
            }
            arr.push(dataObj);
          });
          this.contactList = this.contactList.concat(arr);
          this.loadMore.padeConfig.pageData = this.contactList;
          this.loadMore.padeConfig.totalRows = data.contactsPage.totalRows;
          this.loadMore.padeConfig.maxPage  = data.contactsPage.totalPages;
          this.loadMore.padeConfig.currPage = data.contactsPage.currentPage;
          this.hasMore = data.contactsPage.currentPage >= data.contactsPage.totalPages? false : true;
        })
      }
      }
      this.isAccurate = false;
    },
    getUrlParam(name) {
      var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)","i"); //构造一个含有目标参数的正则表达式对象
      if(reg.test(window.location.href)){ //匹配目标参数
        return decodeURI(RegExp.$2.replace(/\+/g," "))
      }
      return null; //返回参数值
    },
    //tab点击事件
    listenNavTabsBack(index){
      this.my.activeKey = this.Tabs[index].key;
      this.clientList=[];
      this.contactList=[];
      this.page=1;
      this.searchRepeatList();
    },
    addClient(){
      location.href = _.baseURL+'/jsp/wap/crm/client/client_add.jsp?keyword=' + this.searchWord;
    },
    addContact(){
      location.href = _.baseURL+'/jsp/wap/crm/contact/contact_add.jsp?keyword='+ this.searchWord;
    }
  },
}
</script>
<style lang="scss" scoped>
  .qwui-check_page{
    position: relative;
    height:  -fill-available;
    height:  -webkit-fill-available;
    overflow: hidden;
  }
  .qwui-check_list{
    position: absolute;
    top:93px;
    bottom:0;
    left:0;
    right:0;
    overflow-y: auto;
    z-index: 2;
  }
  .qwui-check_tips{
    color: #999;
    text-align: center;
  }
  .qwui-add_btn{
    position: fixed;
    top:64%;
    left:30%;
    width:40% !important;
    line-height: 36px;
  }
</style>
