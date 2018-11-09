<template>
  <div v-windowscroll="scrollFun">
    <!--列表-->
    <ul>
      <user_title_list  v-for="(item,index) in myDraft.List"
                        :key="item.moveapproveId"
                        :showRightMenu="true"
                        :title="item.title"
                        :toParams="{name:'addMoveapprove',params: { moveId: item.moveapproveId},query: { moveId: item.moveapproveId}}">
        <p class="list_content">{{item.content}}</p>
        <div slot="rightMenu" class="qwui-list_menu_box qwui-list_menu_more" @click.stop.prevent="clickMenu(item.moveapproveId,index)"></div>
      </user_title_list>
    </ul>

    <!--加载更多-->
    <Load_more v-show="myTotalRows>0" :loading="loading"
               :currPage="myCurrentRows"
               :maxPage="myMaxPage" @loadMoreClick="homeLoadMore">
      <span>共 {{myTotalRows}} 草稿</span>
    </Load_more>

    <!--无记录-->
    <No_record v-show="showRecord" :setTop="true" :hasRecord="recordData"></No_record>

    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogConfig"></dialog_mask_bottom>
  </div>
</template>
<script>
  import user_title_list from '@/components/list/user_title_list';
  import Load_more from '@/components/list/load_more';
  import No_record from '@/components/base/noRecord';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import {getMyDraftMoveList,requestBatchDeleteList} from "../../moveapprove/api/getData";
  export default {
  name:"draft",
  data() {
    return{
      loading:false,//正在加载更多
      pageSize:20,//查询20页数据
      isGetNextRequest:false,//正在请求
      myDraft:{
        firstLoading:true,//第一次加载
        lock_roll:false,
        List:[],//列表
        currPage:"",
        maxPage:"",
        totalRows:"",//底部我待处理红色数量提示
      },
      recordData:{
        icon: 'qwui-icon_blue_text2',
        title: "暂无数据",
        text: '',
      },
      dialogConfig: { // 点状弹窗列表操作
        show: false,
        title: '',//头部标题
        btnConfig: []
      },
      isParams:{//删除草稿入参
        ids:""
      },
      delDraftIndex:""//需要删除的列表index
    }
  },
    created(){
      getMyDraftMoveList(this.settingOptions(),this.showMoveDraftList);
     },
    computed:{
      showRecord(){
        return this.myDraft.totalRows!=="" && this.myDraft.totalRows==0;
      },
      //传输当前页数
      myCurrentRows(){
        return this.myDraft.currPage;
      },
      //传输最大页数
      myMaxPage(){
        return this.myDraft.maxPage;
      },
      //显示数据总数
      myTotalRows(){
        return this.myDraft.totalRows;
      },
    },
    methods:{
      //我提交的列表操作
      clickMenu(data,index){
        if(data){
          this.isParams.ids=data;
          this.delDraftIndex=index;
          this.dialogConfig.show=true;
          this.dialogConfig.title="是否删除该草稿？";
          this.dialogConfig.btnConfig=[
            {title: "删除", callBack: this.delThis, primary: true},
            {title: "取消", callBack: null}
          ];
        }
      },
      delThis(){
        requestBatchDeleteList(this.isParams,this.sereDelThis);
      },
      //确定删除草稿
      sereDelThis(){
        _.tooltips_succeed("删除成功");
        this.dialogConfig.show=false;
        this.myDraft.List.splice(this.delDraftIndex,1);
        this.myDraft.totalRows--;
      },
      //重置请求入参
      settingOptions(){
        var isParams={
          status: 0,
          type: 1,
          keyWord:"",
          page: 1,
          pageSize:this.pageSize
        };
        return isParams;
      },
      //点击加载更多：加页
      homeLoadMore(){
        var isParams=this.settingOptions();
        isParams.page=this.myDraft.currPage;
        isParams.page++;
        getMyDraftMoveList(isParams,this.showMoveDraftList);
      },
      //返回的数据
      showMoveDraftList(data){
        if (data){
          data.pageData? this.myDraft.List.push(...data.pageData):"";
          this.myDraft.maxPage=data.maxPage;
          this.myDraft.totalRows=Number(data.totalRows);
          this.myDraft.currPage=data.currPage;
        }
      },
      //滚动事件
      scrollFun(){
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          console.log("滚动")
          if(this[this.$route.name] && !this[this.$route.name].lock_roll && this[this.$route.name].currPage<this[this.$route.name].maxPage){
            this[this.$route.name].lock_roll=true;
            this.homeLoadMore();
          }
        }
      },
    },
    components:{
      user_title_list,
      Load_more,
      No_record,
      dialog_mask_bottom,
    }
  }
</script>
<style scoped>
  .list_content{
    flex: 1;
    font-size: 13px;
    color: #999;
    line-height: 18px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
