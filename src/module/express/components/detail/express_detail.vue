<template>
<div class="wrap" v-show="showContent">
  <div class="qwui-express_detail_header">
    <img :src="requestData.headPic">
    <div class="qwui-express_detail_person">
      <p class="qwui-express_detail_name">{{requestData.personName}}</p>
      <p class="qwui-express_detail_time" v-if="requestData.createTime">{{requestData.createTime.substring(0,16)}}</p>
    </div>
    <span class="qwui-express_detail_icon qwui-express_icon_record"></span>
  </div>

  <div class="qwui-separate_bar"></div>
  <div class="qwui-express_detail_content">
    <!--收件人-->
    <div class="qwui-express_detail_annotation" v-if="requestData.receiveUser">
      <span>收件人</span>
      <p>{{requestData.receiveUser}}</p>
      <span class="qwui-express_detail_icon qwui-express_icon_get" v-if="requestData.status=='1' && requestData.lastType=='1'"></span>
    </div>

    <!--代领人-->
    <div class="qwui-express_detail_annotation" v-if="requestData.receiveRefUser">
      <span>代领人</span>
      <p>{{requestData.receiveRefUser}}</p>
      <span class="qwui-express_detail_icon qwui-express_icon_get" v-if="requestData.status=='1' && requestData.lastType=='2'"></span>
    </div>

    <div class="qwui-express_detail_tip" v-if="requestData.trackingNumber">
      <p class="qwui-express_detail_remark">快递单号</p>
      <p class="qwui-express_detail_description">{{requestData.trackingNumber}}</p>
    </div>

    <!--到付金额-->
    <div class="qwui-express_detail_payMoney" v-if="requestData.payMoney">
      <span>到付金额</span>
      <span>{{requestData.payMoney}}</span>元
    </div>

    <!--图片-->
    <div class="qwui-express_detail_tip" v-if="requestData.picList && requestData.picList.length>0">
      <ul>
        <li v-for="(item, index) in list">
          <p>
          <img class="previewer-demo-img" :src="item.src" @click="preview(index)">
          </p>
        </li>
        <div v-transfer-dom>
          <previewer :list="list" ref="previewer" :options="options"></previewer>
        </div>
      </ul>
    </div>

    <!--备注说明-->
    <div class="qwui-express_detail_tip" v-if="requestData.content">
      <p class="qwui-express_detail_remark">备注说明</p>
      <p class="qwui-express_detail_description">{{requestData.content}}</p>
    </div>

    <!--代领留言-->
    <div class="qwui-express_detail_tip" v-if="requestData.refRemarks">
      <p class="qwui-express_detail_remark">代领留言</p>
      <p class="qwui-express_detail_description">{{requestData.refRemarks}}</p>
    </div>

    <!--关闭说明-->
    <div class="qwui-express_detail_tip" v-if="requestData.status=='1' && requestData.remarks">
      <p class="qwui-express_detail_remark">关闭说明</p>
      <p class="qwui-express_detail_description">{{requestData.remarks}}</p>
      <span class="qwui-express_detail_icon qwui-express_icon_close"></span>
    </div>
    <!--时间-->
    <div class="qwui-express_detail_markTime" v-if="requestData.status=='1'">
      <div class="qwui-express_detail_timeOut">{{(requestData.lastType=='1' || detail.lastType=='2')? "领取时间":"关闭时间"}} :<span>{{requestData.receiveTime.substring(0,16)}}</span></div>
    </div>
  </div>
  <!--操作按钮-->
  <flow_button :buttondata="requestData.buttonConfig" v-if="requestData.buttonConfig"></flow_button>
  <div class="qwui-express_detail_height"></div>
  <!--返回事件-->
  <flow_button :buttondata="requestData.buttonConfigBottom"></flow_button>

  <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>
</div>
</template>
<script>
  import flow_button from '@/components/button/flow_button';
  import user_select from '@/components/base/user_or_dept_select';
  import previewer from 'vux/src/components/previewer';
  import transferDom from 'vux/src/directives/transfer-dom';
  export default{
    directives: {
      transferDom
    },
    data(){
      return {
        dataBase:dataBase,
        detail:dataBase.detail,
        requestData:{},
        isSubmitLoading:false,//正在提交
        receiveUserid:"",
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            let rect = thumbnail.getBoundingClientRect()
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
          }
        },
        list: [],
        showContent:false,//显示页面
      }
    },
    created:function () {
      _.showLoading("加载中",false);
      this.getDetail();
    },
    watch:{
      'requestData.picList': function () {
        var self = this;
        self.requestData.picList.forEach(function (e) {
          if (e.picPath.indexOf("http")==-1) {
            e.picPath = _.compressURL + e.picPath
          }
          self.list.push({src: e.picPath});
        });
      },
      'dataBase.selectConfig.show':function (val) { //点击选人，取消后回到界面，重现选人弹框
        if(val == false){
          this.findRecipient()
        }
      }
    },
    methods:{
      preview (index) {
        this.$refs.previewer.show(index)
      },
      getDetail:function () {
        var self = this;
        _.ajax({
          url: _.baseURL + self.detail.getDetail.url,
          type: 'POST',
          data:{id:this.$route.query.expressId},
          success: function (result) {
            _.hideLoading();
            if (result.code == '0') {
              self.detail.getDetail.detail =result.data.detail ;
              self.requestData=self.detail.getDetail.detail;
              self.receiveUserid=result.data.detail.receiveUserid;//收件人ID
              self.requestData.picList.forEach(function (e) {
                if (e.picPath.indexOf("http")==-1) {
                  e.picPath = _.compressURL + e.picPath;
                }
                e.picPath = e.picPath.replace("/compress","");
              });
            self.showContent=true;
            //处理按钮显示
              self.requestData.buttonConfig={primaryList:[],defaultList:[]};
              if(self.requestData.status=="0"){
                if(result.data.duser=='0'){
                  if(result.data.closepowe){
                    self.dealButton("default","关闭通知单",self.closeThis);
                  }
                  self.dealButton("primary","催领快递",self.doUrge);
                }else if(result.data.duser=='1' && self.requestData.receiveRefUser==""){
                  self.dealButton("primary","确认已领取",self.updateExpressStatus);
                  self.dealButton("default","找人代领",self.findRecipient);
                }else if(result.data.duser=='1' && self.requestData.receiveRefUser!=""){
                  self.dealButton("primary","确认已领取",self.updateExpressStatus);
                }
              }
              //返回按钮
              self.requestData.buttonConfigBottom={
                  primaryList:[],
                  defaultList:[{type:"default",name:'返回列表', callBack:self.backToList}],
                  class:"active"//按钮是否置底部 active :底部、"":相对定位
              }
            }else{
              _.alert("提示",result.desc);
            }
          }
        })
      },
      //返回列表
      backToList:function () {
        this.$router.push({path:'/'})
      },
      dealButton:function(type,text,call){ //处理按钮名称和回调配置
        if(type=="primary" && this.requestData.buttonConfig.primaryList.length==0){
          this.requestData.buttonConfig.primaryList.push({type:"primary",name:text, callBack:call});
        }else{
          this.requestData.buttonConfig.defaultList.push({type:"default",name:text, callBack:call});
        }
      },
      //确认领取
      updateExpressStatus(){
        var self = this;
        if(self.isSubmitLoading){
          return;
        }
        self.isSubmitLoading=true;
        _.showLoading("发送中...",true);
        _.ajax({
          url: _.baseURL + self.detail.update.url,
          type: 'POST',
          data:{id:self.$route.query.expressId},
          success: function (result) {
            _.hideLoading();
            _.tooltips_succeed("领取成功");
            self.isSubmitLoading=false;
            if (result.code == '0') {
              self.requestData.buttonConfig={primaryList:[],defaultList:[]};
              self.requestData.status='1' ;
              self.requestData.lastType='1';
              self.requestData.receiveTime = result.data.receiveTime;
            }else{
              _.alert("提示",result.desc);
            }
          }
        })
      },
      //找人代领
      findRecipient(){
        this.dataBase.selectConfig.selectList["ccPersonList"].title="请选择代领人";
        this.dataBase.selectConfig.selectList["ccPersonList"].userRestriction="1";
        var content = [
          {type:"relative", data:{}},
          {type:"comment", comment:{maxLength:100, placeholder:"", value:"请帮忙代领快递!"}},
        ];
        var buttonConfig = {
          primaryBtn:{name:"确定", callBack:this.sureRecipient},
          defaultBtn:{name:"取消", callBack:null},
        };
        _.showMsg("", content, buttonConfig);
      },
      //确定代领
      sureRecipient(msg){
        var self = this;
        if(!msg[0].value){
          _.alertError("代领人不能为空",0);
          return;
        }
        if(msg[0].value.indexOf(self.receiveUserid)>=0){
          _.alertError("代领人不能是收件人",0);
          return;
        }
        if(msg[0].value.indexOf(self.receiveUserid)>=0){
          _.alertError("代领人不能是收件人",0);
          return;
        }
        if(self.isSubmitLoading){
          return;
        }
        self.isSubmitLoading=true;
        _.showLoading("请求中...",true);
        _.ajax({
          url: _.baseURL + self.detail.addRecipient.url,
          type: 'POST',
          data:{addUserId:msg[0].value,expressid:self.$route.query.expressId,refRemarks:msg[1].value},
          success: function (result) {
            _.hideLoading();
            self.isSubmitLoading=false;
            self.dataBase.selectConfig.selectList[self.dataBase.selectConfig.signIndex].title="";
            self.dataBase.selectConfig.selectList[self.dataBase.selectConfig.signIndex].userSelected=[];
            if (result.code == '0') {
              _.tooltips_succeed("提交成功");
              setTimeout(function () {
                self.$router.push({path:'/'})
              },1000);
            }else{
              _.alert("提示",result.desc);
            }
          }
        });
      },
      //关闭通知单按钮
      closeThis:function () {
        var content = [
          {type:"comment", comment:{maxLength:100, placeholder:"", value:""}},
        ];
        var buttonConfig = {
          primaryBtn:{name:"确定", callBack:this.doClose},
          defaultBtn:{name:"取消", callBack:null},
        };
        _.showMsg("请填写关闭原因", content, buttonConfig);
      },
      //催领
      doUrge:function () {
        var self = this;
        if(self.isSubmitLoading){
          return;
        }
        self.isSubmitLoading=true;
        _.showLoading("发送中...",true);
        _.ajax({
          url: _.baseURL + self.detail.doUrge.url,
          type: 'POST',
          data:{id:self.$route.query.expressId},
          success: function (result) {
            self.isSubmitLoading=false;
            if (result.code == '0') {
              _.tooltips_succeed("催领成功");
            }else{
              _.alert("提示",result.desc);
            }
          }
        });
      },
      //确认关闭
      doClose:function (msg) {
        var self = this;
        if(!msg[0].value){
          _.alertError("内容不能为空",0);
          return;
        }
        _.ajax({
          url: _.baseURL + self.detail.update.url,
          type: 'POST',
          data:{
            id: self.$route.query.expressId,
            remark: msg[0].value
          },
          success: function (result) {
            if (result.code == '0') {
              _.tooltips_succeed("成功关闭");
              self.requestData.buttonConfig={primaryList:[],defaultList:[]};
              self.requestData.status='1';
              self.requestData.remarks=msg[0].value;
              self.requestData.receiveTime = result.data.receiveTime;
            }else{
              _.alert("提示",result.desc);
            }
          }
        })
      }
    },
    components:{flow_button,user_select,previewer}
  }
</script>
<style>
  .qwui-express_detail_height{
    height: 59px;
  }
  .qwui-express_detail_header{
    display: flex;
    position: relative;
    padding: 15px;
    font-size: 14px;
    color: #333;
    background: #fff;
  }
  .qwui-express_detail_person{
    flex: 1;
    padding-left: 13px;
  }
  .qwui-express_detail_name{
    font-size: 16px;
    color:rgba(51,51,51,1);
  }
  .qwui-express_detail_time{
    font-size: 13px;
    color:rgba(153,153,153,1);
  }

  .qwui-express_detail_icon{
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 9;
    height: 66px;
    width: 66px;
    background: url("../../../../assets/images/icon_express.png") no-repeat;
    background-size: cover;
  }
  /*收录*/
  .qwui-express_icon_record{
    background-position: 0 0;
  }
  /*领取*/
  .qwui-express_icon_get{
    background-position: -66px 0;
  }
  /*关闭*/
  .qwui-express_icon_close{
    background-position: -132px 0;
  }
  /*代领*/
  .qwui-express_icon_other{
    background-position: -198px 0;
  }
  .qwui-express_detail_content{
    position: relative;
    padding-left: 15px;
    color: #333;
    background: #fff;
  }
  .qwui-express_detail_annotation,.qwui-express_detail_payMoney{
    display: flex;
    position: relative;
    padding:10px 0;
  }
  .qwui-express_detail_annotation span,.qwui-express_detail_payMoney{
    font-size: 16px;
    color:#333;
  }
  .qwui-express_detail_payMoney span:last-child{
    padding-left: 20px;
    color: #666;
  }
  .qwui-express_detail_annotation p{
    flex: 1;
    padding-left: 20px;
    font-size: 16px;
    color: #666;
  }
  .qwui-express_detail_tip{
    position: relative;
    padding: 15px 0;
  }
  .qwui-express_detail_tip li{
    display: inline-block;
    padding-right: 15px;
    height: 45px;
  }
  .qwui-express_detail_header img,.qwui-express_detail_tip img{
    width:45px;
    height:45px;
    border-radius: 4px
  }
  .qwui-express_detail_remark{
    font-size: 16px;
    color: rgba(51,51,51,1);
    line-height: 1;
  }
  .qwui-express_detail_description{
    padding-top: 15px;
    font-size: 14px;
    color:rgba(102,102,102,1);
  }
  .qwui-express_detail_annotation:after,.qwui-express_detail_tip:after,.qwui-express_detail_content:after,.qwui-express_detail_payMoney:after{
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-express_detail_tip:last-child:after{
    border: none;
  }
  .qwui-express_detail_markTime{
    padding: 10px 15px 10px 0;
  }
  .qwui-express_detail_timeOut{
    background: #b4b4b4;
    font-size: 14px;
    color: #fff;
    line-height: 35px;
    text-align: center;
  }
  .qwui-express_detail_timeOut span{
    padding-left: 10px;
  }
</style>
