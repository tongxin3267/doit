<template>
  <div class="wrap" >
    <div class="qwui-rate_nav_box">
      <div class="qwui-rate_nav_height"></div>
      <div class="qwui-rate_nav_fixed">
        <menu-tab :menudata="menuData"></menu-tab>
      </div>
      <div class="homework_rateContent">
        <ul>
          <li class="homework_rateContent_list" v-for="(item,index) in homeworkRate.loadMore.padeConfig.pageData" @click="showRateDetailed(item)">
            <p class="qwui-message_list_headPic"  :class="{'qwui-user_no_images':item.headPic==''||item.headPic=='0'}">
              <img v-if="item.headPic!='0' && item.headPic!=''"  :src="item.headPic" alt="" />
            </p>
            <span class="list_name">{{item.personName}}</span>
            <p class="homework_message_flexItem">
              <span class="list_rate">{{item.rate>0? item.rate:0}}%</span>
              <progress class="progress" max="100" :value="item.rate>0? item.rate:0"></progress>
            </p>
            <i class="qwui-icon_arrow_fr icon_gray"></i>
          </li>
        </ul>
        <load-more :loadmore="loadMore" ref="loadMoreFun" describeWord="i18n.progress"></load-more>
      </div>
      <flow-button :buttondata="navPageData"></flow-button>
    </div>
  </div>
</template>
<script>
  import menuTab from '@/components/button/menu_tab';
  import flowButton from '@/components/button/flow_button';
  import loadMore from '@/components/base/load_more';
  export default {
    name: 'detailNav',
    data(){
      return{
        dataBase:dataBase,
        homeworkRate:dataBase.detailData.homeworkRate,
        isGetRateLoaging:false,
        currentType:"0",
      }
  	},
    created:function(){
      _.showLoading();
      this.homeworkRate.loadMore.pageIndexName="page";//声明接口请求的page参数名称
      this.homeworkRate.loadMore.data={
        isOver:"0",
        page:1,
        homeworkId:this.$route.query.homeworkId,
      };
      for(var i=0;i<this.homeworkRate.menuNav.navBar.length;i++){
        this.homeworkRate.menuNav.navBar[i].callBack=this.dealRateType;
      }
      this.homeworkRate.buttonConfig.primaryList[0].callBack=this.remindPerson;
      this.homeworkRate.buttonConfig.defaultList[0].callBack=this.closeNav;
    },
    computed:{
      menuData:function(){
        return this.homeworkRate.menuNav;
      },
      navPageData:function(){
        return this.homeworkRate.buttonConfig;
      },
      loadMore:function () {
        return this.homeworkRate.loadMore;
      },
    },
  	methods:{
      dealRateType(msg){ //改变接口请求的参数
        this.homeworkRate.loadMore.data.isOver=msg.type;
        this.homeworkRate.loadMore.data.page=1;
        this.homeworkRate.loadMore.padeConfig={ //重置列表数据
          currPage:"",
          maxPage:"",
          pageData:[],  //返回的列表数据
          totalRows:"",//数据总条数
        };
//        this.$refs.loadMoreFun.loadRequestDes();//更新列表状态
        this.$refs.loadMoreFun.requestData();//重新请求
      },
      showRateDetailed:function(msg){  //查找弹窗列表
        if(this.isGetRateLoaging){
          return;
        }
        var self=this;
        var title=msg.personName+self.$t('i18n.progressDetail');
        var btnConfig={
          primaryBtn:{name:'i18n.confirm', callBack:null}, //主操作按钮
        };
        if(!msg.id){
          _.showMsg(title,null,null);
          return;
        }
        self.isGetRateLoaging=true;
        _.ajax({
          url: _.baseURL + self.homeworkRate.getRateDetailed.url,
          type: 'POST',
          data: {
            "rateId": msg.id,
            "creater": msg.recId,
          },
          success: function (result) {
            var getRateData=result.data.rateDetailedList;
            var content=[{type:"rateType",rateList:[]}];
            if(getRateData.length>0){ //有进度数据状态弹窗
              for(var i=0;i<getRateData.length;i++){
                content[0].rateList.push({
                  text:getRateData[i].remark,
                  time:getRateData[i].createTime,
                  rateValue:getRateData[i].rate
                });
              }
            }
            _.showMsg(title,content,btnConfig);
            self.isGetRateLoaging=false;
          }
        });
      },
      remindPerson:function () { //打开更新提醒弹窗
        var content=[{type:"comment",comment:{maxLength:50, placeholder:'i18n.fillInReminder', value:'i18n.homeworkNotCompleted',},}];
        var btnConfig={
          primaryBtn:{
            name:'i18n.sendReminder', callBack:this.remindUnOver
          },
          defaultBtn:{
            name:'i18n.cancel', callBack:null
          }
        };
        _.showMsg("",content,btnConfig);
      },
      remindUnOver:function(msg){ //提交更新提醒
        if(!msg[0].value){
          _.alertError('i18n.fillInReminder');
          return;
        }
        _.showLoading('i18n.sending',true);
        var self=this;
        _.ajax({
          url: _.baseURL + self.homeworkRate.remindOver.url,
          type: 'POST',
          data: {
            "id": self.$route.query.homeworkId,
            "remark": msg.comment,
          },
          success: function (result) {
            _.hideLoading();
            _.showMsgHide();
            if(result.code=="0"){
              _.tooltips_succeed('i18n.operationSuccess');
            }else{
              _.alert('i18n.notice',result.desc);
            }
          }
        })
      },
      closeNav:function(){  //返回关闭菜单页面
        this.$router.go(-1);
      },
  	},
    components:{
      menuTab,
      flowButton,
      loadMore
    }
}
</script>
<style>
  .qwui-rate_nav_box{
    position: relative;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    width: 100%;
    background-color: #f8f8f8;
    -webkit-overflow-scrolling: touch;
    z-index: 9;
  }
  .qwui-rate_nav_height{
    height: 46px;
  }
  .qwui-rate_nav_fixed{
    position: fixed;
    z-index: 10;
    top:0;
    width: 100%;
  }
  .homework_rateContent{
    margin-bottom: 60px;
  }
  .homework_rateContent_list{
    display: flex;
    position: relative;
    overflow: hidden;
    padding: 12px 15px;
    font-size: 14px;
    color: #333;
    line-height: 22px;
  }
  .homework_rateContent_list p{
    display: inline-block;
    margin-right: 20px;
    text-align: right;
  }
  .list_name{
    display: inline-block;
    width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .homework_rateContent_list .list_rate{
    display: inline-block;
    width: 40px;
    margin-right: 15px;;
  }
  .homework_rateContent_list .progress{
    display: inline-block;
    width: 100px;
    height: 10px;
    border: none;
    background-color: #ddd;
    vertical-align: middle;
  }
 .homework_rateContent_list:after{
   content: " ";
   position: absolute;
   bottom: 0;
   left: 0;
   width: 100%;
   border-bottom: 1px solid #e5e5e5;
   -webkit-transform: scaleY(0.5);
   transform: scaleY(0.5);
   -webkit-transform-origin: 0 0;
   transform-origin: 0 0;
   -webkit-box-sizing: border-box;
   box-sizing: border-box;
}

</style>
