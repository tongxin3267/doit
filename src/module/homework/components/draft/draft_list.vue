<template>
  <div  class="wrap">
    <!--搜索框-->
    <header class="qwui-nav_box_fixed">
      <search_box :searchinput="searchBar" v-on:listenToSearchBox="showMsgFromSearchBox"></search_box>
    </header>

    <!--草稿列表-->
    <section>
      <div class="qwui-search_box_height"></div>
      <ul class="draftList">
        <li v-for="(item, index) in loadMore.padeConfig.pageData">
          <div class="qwui-list_item">
            <router-link :to="{name: 'addHomework', params: { homeworkId: item.homeworkId}, query: { homeworkId: item.homeworkId}}">
              <div class="qwui-list_item_content">
                <p class="qwui-list_item_title"><span class="qwui-list_item_Important" v-show="item.priority!='0'">{{priority(item.priority)}}</span>{{item.title}}</p>
                <p class="qwui-list_remarks">
                  <span>{{getFormatTime(item.homeworkStop)}}</span>{{$t('i18n.closingDay')}}
                </p>
              </div>
            </router-link>
          </div>
          <div class="qwui-list_menu" @click="showDelThisDraft(item.homeworkId, index)"></div>
        </li>
      </ul>

      <!--加载组件-->
      <load-more :loadmore="loadMore" describeWord="i18n.draftTotal" ref="loadMoreFun"></load-more>
    </section>

    <dialog_mask_bottom :dialogConfig="dialogListConfig"></dialog_mask_bottom>
  </div>
</template>

<script>
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import footer_nav from '@/components/home/footer_nav';
  import loadMore from '@/components/base/load_more';
  import search_box from '@/components/base/search_box';

  export default {
    data(){
      return {
        searchBar:dataBase.draft.searchBar,//搜索框
        loadMore:dataBase.draft.loadMore,//加载更多组件数据
        deleteFun:dataBase.draft.deleteFun, //删除接口
        dialogListConfig:dataBase.draft.dialogListConfig,//底部弹窗
        delDraftId: '', // 保存需要删除的列表id
        draftIndex:'', // 记录当前点击的列表位置，以便删除查询数组的位置

      }
    },
    created:function(){
      this.loadMore.data.keyWord = '';
    },
    methods:{

      //搜索关键字
      showMsgFromSearchBox(val){
        this.loadMore.data.keyWord=val;
        this.resetRequestData(this.loadMore);
      },

      //请求列表数据
      resetRequestData:function (msg) {
        this.loadMore.data=msg.data;
        this.$refs.loadMoreFun.clearLoadFun();
      },

      //点击操作按钮
      showDelThisDraft:function(draftId, index){
        this.delDraftId = draftId;
        this.draftIndex = index;
        var btnConfig = [
            {title:"i18n.deleteOne", callBack:this.sureDelectDraft, primary:true}, //主操作按钮
            {title:"i18n.cancel", callBack:null}
        ];
        this.showBottomMsg("i18n.deleteDraft", btnConfig);
      },

      //显示操作弹框
      showBottomMsg:function (title, btnConfig) {
        this.dialogListConfig.show = false;
        this.dialogListConfig.title = title? title: "";
        this.dialogListConfig.btnConfig={};
        if(btnConfig){
          this.dialogListConfig.btnConfig=btnConfig;
        }else{
          this.dialogListConfig.btnConfig=[
            {title:"i18n.cancel", callBack:null}
          ]
        }
        this.dialogListConfig.show = true;
      },

      //接口请求删除
      sureDelectDraft:function () {
        var self = this;
        self.dialogListConfig.show = false;
        self.deleteFun.data['ids'] = self.delDraftId;
        _.ajax({
          url:_.baseURL+self.deleteFun.url,
          type:"POST",
          data: self.deleteFun.data,
          success:function(result){
            if(result.code=="0"){
              self.loadMore.padeConfig.pageData.splice(self.draftIndex, 1);
              self.loadMore.padeConfig.totalRows-=1;
              self.$refs.loadMoreFun.loadRequestDes();//更新列表状态
              _.tooltips_succeed("i18n.deleteSuccess");
            }
          }
        })
      },
      //紧急程度
      priority:function(priority){
        if(priority=='1'){
          return '!';
        }else if(priority=='2'){
          return '!!';
        }else if(priority=='3'){
          return '!!!';
        }
      },
      getFormatTime:function(time){
        if(time){
          return _.getFormatTime(time);
        }
        return "";
      },
    },
    components: {
      dialog_mask_bottom,
      footer_nav,
      loadMore,
      search_box
    },
  }

</script>

<style type="text/css">
  .qwui-search_box_height{
    height: 43px;
  }
  .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10
  }
  .draftList li{
    position: relative;
  }
  .draftList .qwui-list_item{
    position: relative;
    padding-right: 50px;
    font-size: 16px;
    line-height: 2.2;
    background-color:#fff;
    overflow: hidden;
  }
  .draftList .qwui-list_item a{
    display: block;
  }
  .draftList .qwui-list_item:before{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #dfdfdd;
    color: #dfdfdd;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .draftList .qwui-list_item_content{
    padding: 17px 15px 15px;
    line-height: 1.4;
    overflow: hidden;
    cursor: pointer;
  }
  .draftList .qwui-list_item_title{
    display: block;
    margin-bottom: 8px;
    line-height: 1;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .draftList .qwui-list_remarks{
    margin-top: 5px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
  }
  .draftList .qwui-list_remarks span{
    padding-right: 5px;
  }
  .draftList .qwui-list_remarks_headpic{
    width: 15px;
    height: 15px;
    border-radius: 50%;
    vertical-align: sub;
    background: #ddd;
    overflow: hidden;
  }
  .draftList .qwui-list_menu{
    position: absolute;
    top: 50%;
    margin-top: -25px;
    right: 0;
    width: 50px;
    height: 50px;
    background: url(../../../../assets/images/icon_more.png) center no-repeat;
    background-size: 3px;
    z-index: 2;
    cursor: pointer;
  }
  .draftList .qwui-list_apply_status{
    display: inline-block;
    line-height: 1;
    padding: 2px 3px;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
  }
  .draftList .qwui-status_blue{
    border: 1px solid #458be9;
    color: #458be9;
  }
  .draftList .qwui-list_item_Important{
    color: #FF3333;
    margin-right: 5px
  }
</style>
