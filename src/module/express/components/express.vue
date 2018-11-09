<template>
  <div class="wrap">
    <div class="qwui-search_box_height"></div>
    <div class="qwui-menu_tab_fixed active">
      <search_bar :searchinput="home.searchBar" v-on:listenToSearchBox="showMsgFromSearchBar" ></search_bar>
      <menu_tab :selectdata="home_nav" v-on:listenTabChange="showMsgFromMenuTab"></menu_tab>
    </div>
    <home_list :listdata="home.homeList.loadMore.padeConfig" :listoperation="listOperation" v-on:listenToExpressList="showMsgFromExpressList"></home_list>
    <load_more :loadmore="home.homeList.loadMore" describeWord="i18n.expressTotal" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></load_more>

    <!--录入权限-->
    <home_footer :footernavdata="home.homeFooter" @footerNavMsg="footerNavClickMsg" v-if="isPower">
      <i class="qwui-footer_icon"></i>
    </home_footer>

    <!--底部催领按钮-->
    <flow_button :buttondata="dataBase.home.buttonConfig" v-if="isPower && dataBase.home.buttonConfig.show"></flow_button>

    <!--弹窗-->
    <dialog_mask_bottom :dialogConfig="dataBase.home.dialogBottomConfig"></dialog_mask_bottom>
  </div>
</template>
<script>
  import search_bar from '../../../components/base/search_box.vue';
  import menu_tab from '../../../components/button/menu_tab_two.vue';
  import home_footer from '../../../components/home/home_footer_button.vue';
  import home_list from './list/express_list.vue';
  import load_more from '../../../components/base/load_more.vue';
  import flow_button from '../../../components/button/flow_button';
  import dialog_mask_bottom from '../../../components/base/dialog_mask_bottom';
  import * as timeUtil from '@/assets/js/time-util';

  export default {
  data(){
    return {
      dataBase:dataBase,
      home_nav:dataBase.home.homeNav,
      home:dataBase.home,
      operateIds:[],//当前选择的列表ID
      isPower:false,//是否有录入权限
      listOperation:{
        navOn:false, //是否能够对列表进行操作
        navOnChange:false //是否需要清空选择的列表，当切换了列表或者关闭某些快递之后用到
      },
      keyWord:"是否速度发"
    }
  },
  watch:{
    'home_nav.index':function (val) {
      this.dataBase.home.buttonConfig.show = false;
    },
    operateIds:function (val) {
      this.home.buttonConfig.show = val.length > 0?true:false;
    }
  },
  created:function () {
    //判断旧页面的类型，改变接口请求参数和tab位置
    this.getUrlType();
  },
  methods:{
    //判断旧页面的类型，改变接口请求参数和tab位置
    getUrlType() {
      var status=_.getUrlParam("status");
      if(status) {
        this.home_nav.index = status == "0" ? 0 : 1;
        this.home.homeList.loadMore.data.keyWord="";
        this.home.homeList.loadMore.data.status=this.home_nav.nav[this.home_nav.index].data.status;
        this.home.homeList.loadMore.data.toptypes =this.home_nav.nav[this.home_nav.index].data.toptypes;
      } else if(this.home_nav.index==null){
        //重置页面底部状态和列表
        this.home_nav.index=0;
      }
    },
    //路由跳转
    footerNavClickMsg(text){
      if(text){
        this.$router.push({path:'/add'});
      }
    },
    //判断权限
    showMsgFromLoadMore(data){
      if(data && data.ispower){
        this.isPower=data.ispower;
        this.listOperation ={
          navOn: this.isPower && this.home_nav.index!= 1,
          navOnChange: !this.listOperation.navOnChange
        };
        this.home.searchBar.rightSpan.show = data.ispower && this.home_nav.index != 1 && data.totalRows>1;
        this.home.searchBar.rightSpan.callback = this.rightSpanOperation;
        this.home_nav.nav.splice(2,1,{content:'我录入的',data:{keyWord:'', page:1, status:0, toptypes:2}});
      }
      this.home.searchBar.moreFunction.option[1].callback = this.showTimeInput;
    },
    showTimeInput:function () { //搜索框的输入特殊功能，弹出时间插件
      var self = this;
      self.home.searchBar.inputFocus = false;
      self.$vux.datetime.show({
        cancelText: '取消',
        confirmText: '确定',
        format: 'YYYY-MM-DD',
        value: self.home.searchBar.keyWord?self.home.searchBar.keyWord:timeUtil.changeFormat(new Date(), 'yyyy-MM-dd'),
        onConfirm (val) {
          self.home.searchBar.keyWord = val;
        }
      })
    },
    rightSpanOperation:function () {
      var btnConfig = [
        {title: "一键催领", callBack: this.urgeThose},
        {title: "一键关闭", callBack: this.closeThose},
        {title: "取消", callBack: null}
      ];
      this.dataBase.home.dialogBottomConfig.show = false;
      this.dataBase.home.dialogBottomConfig.title = "";
      this.dataBase.home.dialogBottomConfig.btnConfig = btnConfig;
      this.dataBase.home.dialogBottomConfig.show = true;
    },
    urgeThose:function () {
      var buttonConfig = {
        primaryBtn:{name:"确定", callBack:this.oneKeyUrge},
        defaultBtn:{name:"取消", callBack:null},
      };
      _.alert('',"给所有未领取快递的收件人发通知，确定催领？",buttonConfig)
    },
    closeThose:function () {
      var content = [
        {type:"comment", comment:{maxLength:100, placeholder:"请填写关闭原因", value:"录入人关闭了快递通知单"}},
      ];
      var buttonConfig = {
        primaryBtn:{name:"确定", callBack:this.oneKeyClose},
        defaultBtn:{name:"取消", callBack:null},
      };
      _.showMsg("一键关闭所有未领取快递", content, buttonConfig);
    },
    oneKeyUrge:function () {
      var self = this;
      _.ajax({
        url: _.baseURL + self.dataBase.home.oneKeyUrge.url,
        type: 'POST',
        data:{'toptypes':self.home.homeList.loadMore.data.toptypes},
        success: function (result) {
          self.dataBase.home.dialogBottomConfig.show = false;
          _.tooltips_succeed("催领成功");
        }
      })
    },
    //确定一键关闭
    oneKeyClose:function (msg) {
      var self = this;
      self.dataBase.home.dialogBottomConfig.show = false;
      if(!msg[0].value){
        _.alertError("i18n.cannotEmpty",0);
        return;
      }

      _.ajax({
        url: _.baseURL + self.dataBase.home.oneKeyClose.url,
        type: 'POST',
        data:{
          'toptypes':self.home.homeList.loadMore.data.toptypes,
          'remark': msg[0].value
        },
        success: function (result) {
          _.showMsgHide();
          if(result.code =="0"){
            _.tooltips_succeed("关闭成功");
            self.$refs.loadMoreFun.loadRequestDes();//判断状态
          }else{
            _.alert("提示",result.desc);
          }
        }
      });
      self.home.homeList.loadMore.padeConfig.pageData=[]
    },
    showMsgFromExpressList:function (ids) { //点击复选框之后 底部按钮显示
      this.home.buttonConfig.defaultList[0].callBack = this.doUrge;
      this.home.buttonConfig.defaultList[1].callBack = this.doClose;
      this.operateIds = ids;
    },
    //催领成功
    doUrge:function () {
      var self = this;
      var str = self.operateIds.join('#');
      _.ajax({
        url: _.baseURL + self.dataBase.home.doUrge.url,
        type: 'post',
        data:{"ids":str},
        success: function (result) {
          if (result.code == '0') {
            self.operateIds = [];
            self.dataBase.home.buttonConfig.show = false;
            self.listOperation.navOnChange = !self.listOperation.navOnChange;//改变这个值以清空expressList中选中的list
            _.tooltips_succeed("催领成功");
          }else{
            _.alert("提示",result.desc);
          }
        }
      })
    },
    //关闭快递确定
    doClose:function () {
      var self = this;
      var str = self.operateIds.join('#');
      _.ajax({
        url: _.baseURL + self.dataBase.home.doClose.url,
        type: 'post',
        data:{"ids":str},
        success: function (result) {
          if (result.code == '0') {
            for(var i=0;i<self.operateIds.length;i++) {//页面删除数据
              for(var m=0;m<self.home.homeList.loadMore.padeConfig.pageData.length;m++){
                if(self.home.homeList.loadMore.padeConfig.pageData[m].id == self.operateIds[i]){
                  self.home.homeList.loadMore.padeConfig.pageData.splice(m,1);
                  break;
                }
              }
            }
            self.operateIds = [];
            self.listOperation.navOnChange = !self.listOperation.navOnChange;//改变这个值以清空expressList中选中的list
            self.dataBase.home.buttonConfig.show = false;
            _.tooltips_succeed("关闭成功");
            self.$refs.loadMoreFun.loadRequestDes();//判断状态
          }else{
            _.alert("提示",result.desc);
          }
        }
      })
    },
    showMsgFromMenuTab:function (val, index) { //清空列表数据，重新请求
      this.operateIds = [];
      this.home_nav.index = index;
      //var tempToptypes = this.home.homeList.loadMore.data.toptypes;//需要保存这个值，切换页面的时候就可以直接搜索
      this.home.homeList.loadMore.data.keyWord="";
      this.home.homeList.loadMore.data.status=val.data.status;
      this.home.homeList.loadMore.data.toptypes = (index == 2)?2:0;
      this.home.searchBar.keyWord ="";
      this.$refs.loadMoreFun.clearLoadFun();
    },
    showMsgFromSearchBar:function (keyWord,val) {
      this.home.homeList.loadMore.data.keyWord = keyWord;
      this.home.homeList.loadMore.data.toptypes = val!=null?val:'';
      this.$refs.loadMoreFun.clearLoadFun();
      this.keyWord="shanggang";
    }
  },
  components:{search_bar, menu_tab, home_list, home_footer, load_more, dialog_mask_bottom, flow_button},
}
</script>
<style>
 .qwui-search_box_height{
    height: 87px;
  }
 .dp-header .dp-item.dp-right {
   color: #2F7DCD;
 }
 .qwui-footer_icon{
   display: inline-block;
   position: relative;
   width: 15px;
   height: 15px;
   margin-right: 3px;
   vertical-align: middle;
   background: url(../../../assets/images/ic_topicfabu.png) center no-repeat;
   background-size: 15px;
 }
</style>
