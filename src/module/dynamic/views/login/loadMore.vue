<template>
  <div v-show="loadFinished">
    <div class="qwui-showMoreList" v-if="tips!=''"  v-windowscroll="scrollLoadMore">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="tips==$t('i18n.loading')"></i>{{tips}}</p>
    </div>
    <no-record :hasrecord="loadmore.hasRecord"></no-record>
  </div>
</template>

<script>
  import noRecord from '@/components/base/no_record';
  export default {
    name: 'loadMore',
    props:['loadmore','describeWord'],
    data(){
      return{
        tips:"",//描述
        hasMore:false,
        lock_roll:false,
        loadFinished:false,
        defaultDescribe:'i18n.defaultDescribe'
      }
    },
    created:function () {
      //第一次请求列表
      this.clearLoadFun();
      _.hideLoading();
    },
    watch:{
      'loadmore.pageConfig.totalRows':function(val){
        if(val != null && val != undefined && val != '') {
          this.loadRequestDes();
        }
      }
    },
    beforeDestroy:function () { //路由跳转后，限制滚动
      this.lock_roll=true;
    },
    methods:{
      //清空数据，第一次或重新请求数据
      clearLoadFun(){

        //初始化第一页
        if(this.loadmore.pageIndexName){
          this.loadmore.data[this.loadmore.pageIndexName]=1;
        }else{
          this.loadmore.data.page=1;
        }
        //初始化返回数据
        this.loadmore.pageConfig={
          currPage:"",
          pageData:[],  //返回的列表数据
          totalRows:"",//数据总条数
        };
        //开始第一次请求
        this.requestData();
      },
      //点击加载
      loadMoreClick:function () {
        this.lock_roll=true;
        if(this.hasMore){
          this.tips=this.$t('i18n.loading');
          this.loadmore.data[this.loadmore.pageIndexName]+=1;
          this.requestData();//加载请求
        }
      },
      //下拉加载
      scrollLoadMore:function (e) {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.loadMoreClick();
          }
        }
      },
      //请求接口数据
      requestData(){
        if(JSON.stringify(this.loadmore)=='{}'){
          _.alert('i18n.notice','i18n.loadRequestFail');
          return;
        }else if(this.loadmore.pageConfig.totalRows==""||this.loadmore.pageConfig.pageData.length==0){
          this.tips="";
        }
        this.loadmore.hasRecord.show=false;//隐藏图标
        var self=this;
        _.ajax({
          url: _.baseURL+self.loadmore.url,
          type: 'POST',
          data:self.loadmore.data,
          success: function (result) {
            self.lock_roll=false;
            if(result.code=="0"){
              let temp = result.data;
              if(temp.dynamicInfos != undefined) {
                self.loadmore.pageConfig.pageData = self.loadmore.pageConfig.pageData.concat(temp.dynamicInfos);
                self.loadmore.pageConfig.totalRows = self.loadmore.pageConfig.pageData.length;
                self.hasMore = temp.hasMore;
              } else {
                self.loadmore.pageConfig.pageData = self.loadmore.pageConfig.pageData.concat(
                  temp.dynamicPage != undefined
                  ? temp.dynamicPage
                  : temp.commentPage
                );
                self.loadmore.pageConfig.totalRows = temp.totalRows;
                self.hasMore = temp.currPage < temp.maxPage ? true: false;
              }
              self.loadRequestDes();
              self.$emit("showMsgFromLoadMore",temp);
            }else{
              _.alert('i18n.notice',result.desc);
            }
            self.loadFinished = true;
          }
        });
      },
      //判断列表状态
      loadRequestDes(){
        this.loadmore.hasRecord.show=false;//隐藏图标
        if(this.hasMore){
          return this.tips=this.$t('i18n.loadMore');
        }else if(this.loadmore.pageConfig.totalRows==0){
          if(!this.loadmore.hasRecord.icon){
            return this.tips=this.$t('i18n.noRecord');
          }else{
            this.loadmore.hasRecord.show=true;//显示无记录图标
            return this.tips="";
          }
        }else if(this.loadmore.pageConfig.totalRows>0 && !this.hasMore){
          return this.tips=this.$t('i18n.total')+this.loadmore.pageConfig.totalRows+this.$t((this.describeWord?this.describeWord:this.defaultDescribe));
        }else{
          return this.tips="";
        }
      }
    },
    components:{
      noRecord
    }
  }
</script>
<style>
  .qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
</style>
