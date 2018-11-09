<template>
  <div>
    <div class="qwui-search_box_height" v-show="pageIndex=='3'||pageIndex=='4'"></div>
    <div class="qwui-menu_tab_fixed active" v-show="pageIndex==3||pageIndex==4">
      <search-bar :searchinput="searchBar" @listenToSearchBox="search"></search-bar>
    </div>
    <tab :selectdata="nav" @listenTabChange="clickTab" v-show="pageIndex!=4"></tab>

    <!--  列表  -->
    <action-list
       v-if="pageIndex == '1' || pageIndex == '2'"
       :list="contentList"
       :useCheck="useCheck"
       :listIndex="pageIndex"
       @returnList="returnList"></action-list>
    <other-list
       v-else
       :list="contentList"
       :listParam="listParam"
       :isDraft="pageIndex"
       useDelete
       @delete="doDeleteThis"></other-list>
    <load-more :loadmore="loadMore" describeWord=" 条" ref="loadMoreFun"
               ></load-more>

    <action-sheet :dialogConfig="actionSheet"></action-sheet>

    <flow-button :buttondata="buttonConfig" v-show="pageIndex!=4&&pageIndex!=3"></flow-button>
    <!--  底部按钮高度  -->
    <div class="qwui-button_height" v-show="pageIndex=='1'||pageIndex=='2'"></div>
  </div>
</template>

<script>
  import searchBar from '@/components/base/search_box'
  import tab from '@/components/button/menu_tab_two'
  import flowButton from '@/components/button/flow_button'
  import actionSheet from '@/components/base/dialog_mask_bottom';
  import actionList from './actionList'
  import otherList from '../list/indexList'
  import loadMore from '../login/loadMore'
  import dynamicAudit from '../../js/dynamicAudit'
  import commentAudit from '../../js/commentAudit'
  import publish from '../../js/publish'
  import {getDynamicNum,getCommentNum,getMyPublishNum, deleteDraft, passComment, passDynamic} from '../../api/getData'
  export default {
    data(){
      return{
        nav: {},
        buttonConfig:{},
        agent:dataBase.wxqyh_uploadfile.agent,
        checkList:[],//复选框选中
        searchBar:publish.searchBar,
        loadMore:publish.loadMore,
        actionSheet:publish.actionSheet,
        navs:{
          1:dynamicAudit.nav,
          2:commentAudit.nav
        },
        buttonConfigs:{
          1:dynamicAudit.buttonConfig,
          2:commentAudit.buttonConfig
        },
        titles:{
          1:"动态审核",
          2:"评论审核",
          3:"我发布的",
          4:"草稿"
        },
        dynamicData:[1,0,2], //动态审核tab对应的参数
        urls:{
          1:"/portal/dynamicinfo/dynamicinfoAction!ajaxAuditDynamicPager.action",
          2:"/portal/dynamicinfo/dynamicinfoAction!ajaxAuditCommentPager.action",
          3:"/portal/dynamicinfomanage/dynamicinfomanageAction!listPageDynamicInfoByType.action",
          4:"/portal/dynamicinfomanage/dynamicinfomanageAction!listPageDynamicInfoByType.action"
        },
        useCheck:true,//列表是否使用复选框
        pageIndex:this.$route.query.data,
        operateId: '',
        operatePosition: 0,
        listParam:{ //传到list页的数据
          dynamicType:3, //记录当前选择的类型
          schType:6,
          keyWord:'',
          isPassReview:true
        },
      }
    },
    computed:{
      contentList:function(){
        return this.loadMore.pageConfig.pageData
      }
    },
    created:function () {
      if(this.pageIndex == '1' || this.pageIndex == '2') {
        this.nav = this.navs[this.pageIndex];
        this.buttonConfig = this.buttonConfigs[this.pageIndex];
        this.buttonConfig.defaultList[0].callBack=this.backToList;
        this.buttonConfig.defaultList[1].callBack = this.pageIndex == '1' ? this.passOrNotThis : this.passOrDeleteThis;
        this.buttonConfig.primaryList[0].callBack = this.pageIndex == '1' ? this.passOrNotThis : this.passOrDeleteThis;
        this.loadMore.data={ //ajax入参数据
          isPassReview:1,
          page:1,
          belongAgent: this.agent
        };
      } else if(this.pageIndex == '3'){
        this.nav = this.navs[1];
        this.loadMore.data={
          page:1,
          size:10,
          status:1,
          schType:6,
          belongAgent: this.agent,
          'tbXyhDynamicinfoPO.dynamicType':3,
          'tbXyhDynamicinfoPO.isPassReview':1
        }
      } else if(this.pageIndex == '4'){
        this.loadMore.data={
          page:1,
          size:10,
          status:0,
          schType:6,
          belongAgent: this.agent,
          'tbXyhDynamicinfoPO.dynamicType':3,
        }
      }
      this.loadMore.url = this.urls[this.pageIndex];
      this.initList();
      document.title=this.titles[this.pageIndex];
    },
    methods:{
      //初始化
      initList:function () {
        if(this.pageIndex == '1'){
          getDynamicNum( (result) =>{
            this.nav.nav[0].num = '('+result.waitReview+')';
            this.nav.nav[1].num = '('+result.passReview+')';
            this.nav.nav[2].num = '('+result.notPassReview+')'
          });
        } else if(this.pageIndex == '2'){
          getCommentNum( (result) =>{
            this.nav.nav[0].num = '('+result.waitReview+')';
            this.nav.nav[1].num = '('+result.passReview+')';
          });
        } else if(this.pageIndex == '3'){
          getMyPublishNum( (result) =>{
            this.nav.nav[0].num = '('+result.waitReviewCount+')';
            this.nav.nav[1].num = '('+result.passReviewCount+')';
            this.nav.nav[2].num = '('+result.noPassReviewCount+')'
          });
        }
      },
      //返回
      backToList:function () {
        this.$router.push({ path:'/index'});
      },
      //点击tab
      clickTab:function (val,index) {
        if(this.pageIndex == '1' || this.pageIndex == '2') {
          if (index == 0) {
            this.buttonConfig.primaryList.splice(0, 0, {type: "primary", name: '通过', value:0, callBack: null});
            this.buttonConfig.primaryList[0].callBack = this.pageIndex == '1' ? this.passOrNotThis : this.passOrDeleteThis;
            this.buttonConfig.defaultList.splice(1, 0,
              this.pageIndex == '1'
                ? {type: "default", name: '不通过', value:2, callBack: this.passOrNotThis}
                : {type: "default",name: '删除',value:2, callBack: this.passOrDeleteThis});
          } else {
            this.buttonConfig.primaryList.splice(0, 1);
            this.buttonConfig.defaultList.splice(1, 1);
          }
          this.loadMore.data={ //ajax入参数据
            isPassReview:this.dynamicData[index],
            page:1,
            belongAgent: this.agent
          };
          this.useCheck = index == 0 ? true : false;
        } else {
          this.loadMore.data['tbXyhDynamicinfoPO.isPassReview'] = this.dynamicData[index]
        }
        this.resetRequestListData();   //清空列表数据，重新请求
      },
      //重新请求列表数据
      resetRequestListData:function(){
        this.$refs.loadMoreFun.clearLoadFun();//重新请求
      },
      //搜索
      search:function (val) {
        this.loadMore.data['tbXyhDynamicinfoPO.title'] = val;
        this.resetRequestListData();
      },
      //删除草稿
      doDeleteThis:function (id,index) {
        var btnConfig = [
          {title:"删除动态", callBack:this.doDelete, primary:true}, //主操作按钮
          {title:"取消", callBack:null}
        ];
        this.actionSheet={
          show: true,
          title: '是否删除该动态?',//头部标题
          btnConfig: btnConfig
        }
        this.operateId = id;
        this.operatePosition = index
      },
      doDelete:function () {
        this.actionSheet.show = false
        console.log(this.operatePosition)
        deleteDraft( this.operateId, (result) =>{
          this.loadMore.pageConfig.pageData.splice(this.operatePosition,1)
        });
      },
      //返回的选择内容
      returnList:function (val) {
        this.checkList = val
      },
      //通过或删除
      passOrDeleteThis:function (val) {
        if(this.checkList.length>0){
          passComment( this.checkList.join('|'), val, (result) =>{
            val == '0' ? _.tooltips_succeed('审核成功'):_.tooltips_succeed('删除成功');
            setTimeout(function () {
              location.reload();
            },1500);
          });
        }
      },
      //通过或不通过
      passOrNotThis:function (val) {
        if(this.checkList.length>0){
          passDynamic( this.checkList.join('|'), val, (result) =>{
            _.tooltips_succeed('审核成功');
            setTimeout(function () {
              location.reload();
            },1500);
          });
        }
      }
    },
    components:{searchBar, tab, flowButton, actionSheet, actionList, otherList, loadMore}
  }
</script>
<style scoped>
  .qwui-search_box_height{
    height:43px
  }
  .qwui-button_height{
    height:60px
  }
</style>
