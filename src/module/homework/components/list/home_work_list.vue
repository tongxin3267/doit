<template>
    <ul class="homeWorkList">
      <li v-for="(item,index) in pageData" class="qwui-list_item">
        <div>
          <router-link :to="{name: 'homeworkDetail', params: { homeworkId: item.homeworkId}, query: { homeworkId: item.homeworkId}}">
          <div class="qwui-list_item_content">
            <p class="qwui-list_item_title"><span class="qwui-list_item_Important">{{priority(item.priority)}}</span>{{item.title}}</p>
            <p class="qwui-list_remarks">
              <apply-status :applystatus="statusFormat(item)" v-show="item.homeworkStatus"></apply-status>
              <span class="qwui-list_user_time" v-if="item.homeworkStop">{{getFormatTime(item.homeworkStop)}}{{' '+$t('i18n.closingDay')}}</span>
            </p>
            <p class="qwui-list_remarks">
              <img class="qwui-list_remarks_headpic" :src="item.headPic"/>
              <span class="qwui-list_user_name">{{item.personName}}</span>
            </p>
          </div>
          </router-link>
        </div>
        <div class="qwui-list_menu" @click="showOperate(item, index)" v-if="homePage==0"></div>
      </li>
    </ul>
</template>

<script>
import applyStatus from '@/components/part/apply_status';
import * as timeUtil from '../../../../assets/js/time-util';

  export default {
  name: 'homeWorkList',
  props:['listdata',"loadmore", 'footernav',"isscore"],
  data(){
    return {
      buttonConfig: {
        primaryBtn:{name:"i18n.confirm", callBack:null},
        defaultBtn:{name:"i18n.cancel", callBack:null},
      },
      operateHomework:{
        creator:"",//创建者
        id: '',//homeworkId
        index: '',//位置
        oldTime: ''//当前的截止时间
      },
    }
  },
  computed:{
    pageData(){
      if(this.loadmore.padeConfig.pageData){
        return this.loadmore.padeConfig.pageData;
      }
    },
    homePage(){
      if(this.footernav){
        return this.footernav;
      }
      return false;
    }
  },
  methods:{
    showOperate:function (item, index) { // 点击操作的homework ,底部弹框对应的操作
      this.operateHomework.creator = item.creator;
      this.operateHomework.id = item.homeworkId;
      this.operateHomework.index = index;
      this.operateHomework.oldTime = item.homeworkStop;
      var btnConfig = [];
      if(item.homeworkStatus == 1) {
        btnConfig = [
          {title: "i18n.copy", callBack: this.copyThis},
          {title: "i18n.modifyDeadline", callBack: this.editTimeThis},
          {title: "i18n.resubmit", callBack: this.resubmit},
          {title: "i18n.finishHomework", callBack: this.endThis},
          {title: "i18n.deleteOne", callBack: this.delThis, primary: true},
          {title: "i18n.cancel", callBack: null}
        ];
      } else {
        btnConfig = [
          {title: "i18n.copy", callBack: this.copyThis},
          {title: "i18n.restart", callBack: this.restartThis},
          {title: "i18n.deleteOne", callBack: this.delThis, primary: true},
          {title: "i18n.cancel", callBack: null}
        ];
      }
      this.showBottomMsg('', btnConfig);
    },
    //显示底部弹窗列表
    showBottomMsg:function (title, btnConfig) {
      this.listdata.dialogListConfig.show = false;
      this.listdata.dialogListConfig.title = title? title: "";
      this.listdata.dialogListConfig.btnConfig={};
      if(btnConfig){
        this.listdata.dialogListConfig.btnConfig=btnConfig;
      }else{
        this.listdata.dialogListConfig.btnConfig=[
          {title:"i18n.cancel", callBack:null}
        ]
      }
      this.listdata.dialogListConfig.show = true;
    },
    //关闭底部弹窗列表
    closeBottomMsg(){
      this.listdata.dialogListConfig.show = false;
    },
    //点击复制
    copyThis:function () {
      this.closeBottomMsg();

      this.$router.push({
        path: '/add',
        params: { homeworkId: this.operateHomework.id, isCopy: true},
        query: { homeworkId: this.operateHomework.id, isCopy:true}
      })
    },
    //结束弹窗
    endThis:function () {
      this.closeBottomMsg();

      var content = [
        {
          type:"radioType",
          radioType:{
            title:"i18n.endType",
            name:"radio",
            list:[{text:"i18n.done", value:"1",}, {text:"i18n.terminate", value:"2",}, {text:"i18n.cancel", value:"3",},],
          }
        }
      ];

      if(this.isscore=="0" && this.operateHomework.creator==_.userId){
        content.push({type:"scoreType",scoreType:{title:"给该作业评分(必选)",name:"score",num:"10",score:"1"}});
      }
      content.push({type:"comment",comment:{maxLength:100,placeholder:"i18n.finishReason",value:"i18n.praise"}});
      var buttonConfig = {
        primaryBtn:{name:"i18n.confirm", callBack:this.doEndTask},
        defaultBtn:{name:"i18n.cancel", callBack:null},
      };
      _.showMsg("i18n.finishHomework", content, buttonConfig);
    },

    //确定结束作业
    doEndTask:function(msg){ // 弹框确定的回调
      var comment="";
      var score="";
      var homeworkCloseType=msg[0].value;
      var index=null;

      if(this.isscore=="0" && this.operateHomework.creator==_.userId){
        comment=msg[2].value;
        score=msg[1].value;
        index=2;
      }else{
        comment=msg[1].value;
        index=1;
      }
      if(!comment){
        _.alertError("i18n.cannotEmpty",index);
        return;
      }

      var self = this;
      _.ajax({
        url: _.baseURL + self.listdata.restartOrEndHomework.url, // + self.operateHomework.id +'&status=2', // 重启status=1
        type: "POST",
        data: {
          'reason': comment,//备注
          'score': score,//分数
          "status": "2",
          'homeworkCloseType': homeworkCloseType,
          'homeworkId': self.operateHomework.id,
          'isScore': self.isscore,//开启评分，"0":开启
        },
        success: function (result) {
          if (result.code == "0") {
            _.showMsgHide();
            _.tooltips_succeed("i18n.operationSuccess");
            self.loadmore.padeConfig.pageData[self.operateHomework.index].homeworkStatus = '2';
          } else {
            _.alert("i18n.notice", result.desc);
          }
        }
      })
    },

    //重启作业
    restartThis:function () {
      this.closeBottomMsg();

      var content = [
        {type:"radioType", radioType:{title:"i18n.restartAll", list:[{text:"i18n.no", value:"0"}, {text:"i18n.yes", value:"1"}]},},
        {type:"comment",comment:{maxLength:100, placeholder:"i18n.restartReason"}},
      ];

      var buttonConfig = {
        primaryBtn:{name:"i18n.confirm", callBack:this.doRestart},
        defaultBtn:{name:"i18n.cancel", callBack:null},
      };
      _.showMsg("i18n.restart", content, buttonConfig);
    },

    //确定重启
    doRestart:function(msg){ // 弹框确定的回调
      var comment="";
      var resetType="";
      var index=null;

      if(msg.length==1){
        comment=msg[0].value;
        index=0;
      }else{
        resetType=msg[0].value;
        comment=msg[1].value;
        index=1;
      }
      if(!comment){
        _.alertError("i18n.cannotEmpty",index);
        return;
      }

      var self = this;
      _.ajax({
        url: _.baseURL + self.listdata.restartOrEndHomework.url,
        type: "post",
        data: {
          'reason':comment,
          "status":"1",
          "homeworkId": self.operateHomework.id,
          'resetType':resetType //重置进度
        },
        success: function (result) {
          _.showMsgHide();
          if (result.code == "0") {
            _.tooltips_succeed("i18n.operationSuccess");
            self.loadmore.padeConfig.pageData[self.operateHomework.index].homeworkStatus = '1';
          } else {
            _.alert("i18n.notice", result.desc);
          }
        }
      })
    },
    editTimeThis:function () {
      this.closeBottomMsg();

      var content = [
        {type:"dateTime", dateTime:{name:"dateTime",title:"", value:this.operateHomework.oldTime},},
        {type:"comment", comment:{maxLength:100, placeholder:"i18n.modifyReason", value:"i18n.homeworkUnfinished"}},
      ];
      var buttonConfig = {
        primaryBtn:{name:"i18n.confirm", callBack:this.changeOverTime},
        defaultBtn:{name:"i18n.cancel", callBack:null},
      };
      _.showMsg("i18n.modifyDeadline", content, buttonConfig);
    },

    //修改截止时间
    changeOverTime:function(msg){
      if(msg){
        if(!msg[0].value){
          _.alert("i18n.notice","i18n.newDeadline");
          return;
        }else{
          var value = msg[0].value+":00";
          if((new Date()) > (new Date(value.replace("-", "/").replace("-", "/")))){
            _.alertError("i18n.modifyFail",0);
            return;
          }
        }
        if(!msg[1].value){
          _.alertError("i18n.cannotEmpty",1);
          return;
        }
      }
      _.showLoading("i18n.modifying",true);
      var self = this;
       _.ajax({
         url: _.baseURL + self.listdata.updateHomeworkStop.url + self.operateHomework.id,
         type: "post",
         data: {
           'homeworkStop': msg[0].value+':00',
           'reason': msg[1].value
         },
         success: function (result) {
           self.listdata.dialogListConfig.show = false;
           _.hideLoading();
           if (result.code == "0") {
             _.showMsgHide();
             self.loadmore.padeConfig.pageData[self.operateHomework.index].homeworkStop = msg[0].value;
             _.tooltips_succeed("i18n.modifiedSuccess");
           } else {
             _.alert("i18n.notice", result.desc);
           }
         }
       })
    },
    resubmit:function () {
      this.closeBottomMsg();

      this.$router.push({
        path: '/add',
        params: { homeworkId: this.operateHomework.id},
        query: { homeworkId: this.operateHomework.id}
      })
    },
    delThis:function () {
      this.closeBottomMsg();

      var buttonConfig = {
        primaryBtn:{name:"i18n.confirm", callBack:this.doDel},
        defaultBtn:{name:"i18n.cancel", callBack:null},
      };
      _.alert("i18n.notice","i18n.deleteAnyway",buttonConfig)
    },

    //删除列表
    doDel:function () {
      var self = this;
      _.showMsgHide();
      self.listdata.delete.data['ids'] = self.operateHomework.id;
      _.ajax({
        url:_.baseURL + self.listdata.delete.checkUrl,
        type:"POST",
        data:self.listdata.delete.data,
        success:function(result) {
          self.listdata.dialogListConfig.show = false;
          if(result.code=="0"){
            if(result.data.haveComment){
              _.alert("i18n.notice",self.$t("i18n.title")+result.data.comments[0]+self.$t("i18n.deleteDeny"));
            }else {
              _.ajax({
                url:_.baseURL + self.listdata.delete.url,
                type: "post",
                data: self.listdata.delete.data,
                success: function (result) {
                  if (result.code == "0") {
                    self.loadmore.padeConfig.pageData.splice(self.operateHomework.index, 1);
                    _.tooltips_succeed("i18n.deleteSuccess", true);
                  }else{
                    _.alert("i18n.notice",result.desc);
                  }
                }
              })
            }
          }else{
            _.alert("i18n.notice",result.desc);
          }
        }
      });
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
    //详情状态
    statusFormat: function (value) {
      if (value.homeworkStatus == '1') {
        if (value.homeworkStop <= timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')) {
          return {name: "i18n.overDue", class: "status_red", active: false};
        } else {
          return {name: "i18n.inProgress", class: "status_blue", active: false};
        }
      } else if (value.homeworkStatus == '2') {
        return {name: "i18n.isEnded", class: "status_gray", active: false};
      }
    },
    getFormatTime:function(time){
        return _.getFormatTime(time)
    }
},
  components:{
    applyStatus
  },
}

</script>

<style type="text/css">
  .qwui-top_head_list{
    padding-top: 44px;
  }
.homeWorkList li{
  position: relative;
}
.homeWorkList .qwui-list_item{
  position: relative;
  padding-right: 50px;
  font-size: 16px;
  line-height: 2.2;
  background-color:#fff;
  overflow: hidden;
}
.homeWorkList .qwui-list_item a{
  display: block;
}
.homeWorkList .qwui-list_item:before{
  content: " ";
  position: absolute;
  left: 15px;
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
.homeWorkList .qwui-list_item:last-child:before{
  left:0
}
.homeWorkList .qwui-list_item_content{
  padding: 15px;
  line-height: 1.4;
  overflow: hidden;
  cursor: pointer;
}
.homeWorkList .qwui-list_item_title{
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
.homeWorkList .qwui-list_remarks{
  display: flex;
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #999;
  overflow: hidden;
}
.qwui-list_remarks .qwui-list_user_time{
  margin-left: 10px;
}
.qwui-list_remarks .qwui-list_user_name{
  flex: 1;
  vertical-align: middle;
  line-height: 15px;
  margin-left: 5px;
}
.homeWorkList .qwui-list_remarks_headpic{
  width: 15px;
  height: 15px;
  border-radius: 50%;
  vertical-align: sub;
  background: #ddd;
  overflow: hidden;
}
.homeWorkList .qwui-list_menu{
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
.homeWorkList .qwui-list_item_Important{
  color: #FF3333;
  margin-right: 5px
}

</style>
