<template>
  <div class="wrap" v-show="hasContent">
    <div>
      <!--详情标题头部-->
      <detail-title :titledata="homeworkDetail.detail" @showThisPersonUtil="getCreatorDetail" @clickEditOrCopy="clickEditOrCopy"></detail-title>

      <!--自定义内容-->
      <detail-content :detailcontent="homeworkDetail" :homeworkrate="homeworkRate" @showRate="showRateDetailed"></detail-content>

      <!--操作按钮-->
      <flow-button :buttondata="buttonConfig"></flow-button>

      <!--负责人和相关人内容-->
      <div class="qwui-detail_margin_top qwui-border_top">
        <user-select :userselect="userSelect"></user-select>
      </div>

      <!--评论列表-->
      <list-comment :listcomment="listComment" @showThisPersonUtil="getCreatorDetail"></list-comment>
    </div>

    <!--评论输入框组件-->
    <chat-comment :listcomment="listComment" @dealccPerson="backUserSelect"></chat-comment>

    <!--选择人组件-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>

    <!--负责人、相关人详细列表-->
    <user-show :userselect="userSelect"></user-show>

    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>

    <!--预览图片组件-->
    <previewImages :urls="previewImageUrl"></previewImages>
  </div>
</template>
<script>
  import Vue from 'vue'
  import detailTitle from '@/components/detail/detail_title';
  import detailContent from './detailContent';
  import flowButton from '@/components/button/flow_button';
  import userSelect from '@/components/detail/user_select';
  import userShow from '@/components/base/user_show';
  import listComment from '@/components/detail/list_comment';
  import chatComment from '@/components/detail/chat_comment';
  import user_select from '@/components/base/user_or_dept_select';
  import user_info from '@/components/detail/user_info_card';//个人信息
  import previewImages from "@/components/detail/previewImages";
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'detail',
    data(){
      return{
        dataBase:dataBase,
        homeworkDetail:dataBase.detailData.homeworkDetail,
        homeworkRate:dataBase.detailData.homeworkRate,
        isGetRateLoaging:false,//正在提交

        isScore:"0",//默认使用评分功能
        isUseRateVal:"", //启用重置进度
        recIsClose:1,//负责人是否可结束作业
        hasContent:true, //请求成功
        previewImageUrl:[],                                                     //需要预览的图片列表
      }
    },
    created:function(){
      _.showLoading("",false);
      this.homeworkDetail.data.homeworkId=this.$route.query.homeworkId;
      this.homeworkDetail.listComment.get.data.id=this.$route.query.homeworkId;
      this.detailShow();
    },
    computed:{
      buttonConfig:function(){ //详情操作按钮
        return this.homeworkDetail.detail.buttonConfig;
      },
      userSelect:function(){  //负责人、相关人
        return this.homeworkDetail.detail.userListConfig;
      },
      listComment:function () { //评论数据
        return this.homeworkDetail.listComment;
      },
    },
    methods:{
      clickEditOrCopy:function (val) {
        this.$router.push({
          path: val.name,
          query: val.params
        })
      },
      detailShow:function(){ //详情加载
        var self=this;
        self.homeworkDetail.data.userId=_.userId;
        _.ajax({
            url: _.baseURL+self.homeworkDetail.url,
            type: 'POST',
            data:self.homeworkDetail.data,
            success: function (result) {
              if(result.code=="0"){
                var detailDataConfig=result.data;
                var scoreSetting=detailDataConfig.tbQyHomeworkScoresettingVO;//是否开启评分
                var homeworkStatus=detailDataConfig.detail.homeworkStatus; //作业状态，是否结束
                if(scoreSetting){
                  self.isScore= scoreSetting.isScore=="1"? "1":"0";
                  if(!(JSON.stringify(scoreSetting)!="{}" && detailDataConfig.detail.homeworkStatus=="2" && scoreSetting.isScore=="0" && detailDataConfig.detail.scoreInfo)){
                    detailDataConfig.detail.scoreInfo={};
                    detailDataConfig.detail.scoreInfo.score="";
                  }
                }
                if(detailDataConfig.detail.isUseRate){
                  self.isUseRateVal=detailDataConfig.detail.isUseRate;
                }

                //判断审批状态
                var status="";
                if(detailDataConfig.detail.isTimeOut=="1" && detailDataConfig.detail.homeworkStatus!="2"){
                  status=self.$t('i18n.overDue');
                }else if(detailDataConfig.detail.homeworkStatus=="2"){
                  status=self.$t('i18n.isEnded');
                }
                var configCopy={};//复制图标
                var canEditTime="";
                if(detailDataConfig.detail.creator==_.userId){
                  configCopy={name:"/add", params:{"homeworkId":self.$route.query.homeworkId,  isCopy:true}}
                  if(homeworkStatus!='2'){ //是否可修改截止时间
                    canEditTime="qwui-icon_edit";
                  }
                }
                self.previewImageUrl=detailDataConfig.detail.picList;
                self.homeworkDetail.detail={
                  openPrint:true,
                  status:_.append_status(status,true),
                  creator:{
                    userId:detailDataConfig.detail.creator,
                    personName:detailDataConfig.detail.personName,
                    headPic:detailDataConfig.detail.headPic,
                    createPerson:detailDataConfig.detail.creator,
                  },
                  title:detailDataConfig.detail.title,
                  personName:detailDataConfig.detail.personName,
                  createTime:detailDataConfig.detail.creatorTime,
                  content:detailDataConfig.detail.content,
                  priority:detailDataConfig.detail.priority,
                  configCopy:configCopy,
                  picList:detailDataConfig.detail.picList,//上传的图片列表
                  mediaList:detailDataConfig.mediaList,//上传的附件列表
                  buttonConfig:{
                    primaryList:[],
                    defaultList:[],
                  },
                  userListConfig:{
                    toPersonList:{
                      title:"i18n.approverParents",
                      show:false,
                      num:detailDataConfig.detail.toPersons.length,
                      userSelected:detailDataConfig.detail.toPersons,
                    },
                    ccPersonList:{
                      title:"i18n.relatedPeople",
                      show:false,
                      num:detailDataConfig.detail.ccPersons.length,
                      userSelected:detailDataConfig.detail.ccPersons,
                    }
                  },
                  describes:[
                    {
                      text:"i18n.homeworkType",
                      content:detailDataConfig.detail.homeworkTypeDesc,
                    },
                    {
                      text:"i18n.startTime",
                      content:detailDataConfig.detail.homeworkStart.substring(0,16),
                    },
                    {
                      text:"i18n.endTime",
                      content:detailDataConfig.detail.homeworkStop.substring(0,16),
                      icon:canEditTime,
                      callBack:self.changeOverTime,
                    },
                  ],
                  isUseRate:detailDataConfig.detail.isUseRate,
                };
                self.homeworkDetail.listRecRate=detailDataConfig.listRecRate;     //学习进度数据
                self.homeworkDetail.listComment.get.hasMore=detailDataConfig.hasMore; //更多
                self.homeworkDetail.listComment.totalPages=detailDataConfig.totalPages;
                self.homeworkDetail.listComment.send.contentObject="tbQyHomeworkCommentPO.content";
                self.homeworkDetail.listComment.send.data={
                  "id":detailDataConfig.detail.homeworkId,
                  "type":"1",
                  "userId":_.userId,
                  "tbQyHomeworkCommentPO.content":"",
                  "tbQyHomeworkCommentPO.homeworkId":detailDataConfig.detail.homeworkId,
                  "tbQyHomeworkCommentPO.commentStatus":"9",
                }
                if(detailDataConfig.comments){
                  self.homeworkDetail.listComment.comments=detailDataConfig.comments;//评论列表数据
                }else{
                  self.homeworkDetail.listComment.comments=[];//评论列表数据
                }
                //按钮配置区域
                var listRecRate=detailDataConfig.listRecRate;
                var toPersonsArr="";
                if(listRecRate){
                  for(var i=0;i<listRecRate.length;i++){
                    toPersonsArr+=listRecRate[i].recId+"|";
                  }
                  if(toPersonsArr.indexOf(_.userId)!=-1 && homeworkStatus=="1"){
                    self.recIsClose=0;
                    self.dealButton("primary","i18n.updateProgress",self.updateRated);
                  }
                }

                if(detailDataConfig.detail.operator=="1" && detailDataConfig.detail.creator==_.userId){  //是操作员且是负责人
                  if(homeworkStatus=="2"){ //已结束
                    self.dealButton("default","i18n.restart",self.restartTask);
                  }else{
                    self.dealButton("default","i18n.done",self.endTask);
                    if(detailDataConfig.detail.isModify=="1"){
                      self.dealButton("primary","i18n.homeworkResubmit",self.noAgainSubmit);
                    }else{
                      self.dealButton("primary","i18n.homeworkResubmit",self.againSubmit);
                    }
                  }
                  //未结束，允许负责人结束作业，并且作业未结束未完成，并且可更新进度
                }else if(detailDataConfig.detail.operator=="1" && detailDataConfig.detail.closeSwitch=="1" && homeworkStatus!= "2" && self.recIsClose==0 && detailDataConfig.detail.isUseRate=="1"){
                  self.dealButton("default","i18n.finishHomework",self.endTask);
                }
                _.hideLoading();
              }else{
                _.hideLoading();
                self.hasContent=false;
                _.alert("i18n.notice",result.desc);
              }
            }
        });
      },
      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },
      dealButton:function(type,text,call){ //处理按钮名称和回调配置
        if(type=="primary" && this.homeworkDetail.detail.buttonConfig.primaryList.length==0){
          this.homeworkDetail.detail.buttonConfig.primaryList.push({type:"primary",name:text, callBack:call});
        }else{
          this.homeworkDetail.detail.buttonConfig.defaultList.push({type:"default",name:text, callBack:call});
        }
      },
      showRateDetailed:function(msg){ //根据查询具体成员的进度数据显示弹窗状态
        if(this.isGetRateLoaging){
          return;
        }
        var self=this;
        var title=msg.personName+this.$t('i18n.progressDetail');
        var btnConfig={
          primaryBtn:{name:'i18n.confirm', callBack:null}, //主操作按钮
        };
        if(!msg.id){
          _.alert(title,'暂无进度')
          return;
        }
        self.isGetRateLoaging=true;
        _.ajax({
          url: _.baseURL + self.homeworkDetail.getRateDetailed.url,
          type: 'POST',
          data: {
            "rateId": msg.id,
            "creater": msg.recId,
          },
          success: function (result) {
            if(result.code=="0"){
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
              content[0].rateList.reverse();
              _.showMsg(title,content,btnConfig);
              self.isGetRateLoaging=false;
            }else{
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      //更新进度按钮
      updateRated:function () {
        var content=[{type:"updateRateType", updateRateType:{name:"updateValue",rateValue:this.homeworkDetail.updateRated.oldRate, limit:10}}];
        var btnConfig={
          primaryBtn:{name:'i18n.confirm', callBack:this.submitUpdateRated}, //主操作按钮
          defaultBtn:{name:"i18n.cancel", callBack:null}, //次操作按钮
        };
        _.showMsg("i18n.completeProgress",content,btnConfig);
      },
      //修改截止时间
      changeOverTime(msg){
        var content=[];
        if(msg){
          var content=[
            {
              type:"dateTime",
              dateTime:{
                name:"dateTime",
                title:"",
                value:msg.content
              }
            },
            {
              type:"comment",
              comment:{//评语
              maxLength:100,
              placeholder:"i18n.modifyReason",
              value:"i18n.homeworkUnfinished",
              },
            }
          ];
          var btnConfig={
            primaryBtn:{name:"i18n.confirm", callBack:this.sureUpdateOverTime}, //确定修改截止时间
            defaultBtn:{name:"i18n.cancel", callBack:null}, //次操作按钮
          }
          _.showMsg("i18n.modifyDeadline",content,btnConfig);
        }
      },
      sureUpdateOverTime(msg){//确定修改截止时间
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
        this.homeworkDetail.updateOverTime.data={
          homeworkId:this.$route.query.homeworkId,
          homeworkStop:value,
          reason:msg[1].value,
        };
        var self = this;
        _.ajax({
          url: _.baseURL+self.homeworkDetail.updateOverTime.url,
          type: 'POST',
          data:self.homeworkDetail.updateOverTime.data,
          success: function (result) {
            _.hideLoading();
            _.showMsgHide();
            if(result.code=="0"){
              _.tooltips_succeed("i18n.modifiedSuccess");
              self.detailShow();//重新请求数据
            }else{
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      submitUpdateRated:function (msg) { //提交更新
        if(!msg){
          _.alert("i18n.notice","i18n.noProgressValue");
          return;
        }
        _.showLoading("i18n.updating");
        var data={
          rate:msg[0].value, //进度
          type:"1",
          homeworkId:this.homeworkDetail.data.homeworkId,
          updateUserId:_.userId,
          reason:"" //描述内容
        };
        var self=this;
        _.ajax({
          url: _.baseURL+self.homeworkDetail.updateRated.url,
          type: 'POST',
          data:data,
          success: function (result) {
            _.hideLoading();
            if(result.code=="0"){
              _.tooltips_succeed("i18n.updateSuccessfully");
              self.detailShow();
            }else{
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },

      //结束作业弹窗
      endTask:function () {
        var content=[];
        content.push({
          type:"radioType",
          radioType:{
            title:"i18n.endType",
            name:"radio",
            list:[{text:"i18n.done", value:"1",}, {text:"i18n.terminate", value:"2",}, {text:"i18n.cancel", value:"3",},],
          }
        });
        if(this.isScore=="0" && this.homeworkDetail.detail.creator.id==_.userId){
          content.push({type:"scoreType",scoreType:{title:"给该作业评分",name:"score",num:"10",score:"1"}});
        }
        content.push({type:"comment",comment:{maxLength:100,placeholder:"i18n.finishReason",value:"i18n.praise"}});
        var btnConfig={
          primaryBtn:{name:"i18n.confirm", callBack:this.endHomeworkStatus},
          defaultBtn:{name:"i18n.cancel", callBack:null}, //次操作按钮
        };
        _.showMsg("i18n.finishHomework",content,btnConfig);
      },
      //结束作业请求
      endHomeworkStatus(msg){
        var comment="";
        var score="";
        var homeworkCloseType=msg[0].value;
        var index=null;

        if(this.isScore=="0" && this.homeworkDetail.detail.creator.id==_.userId){
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

        var self=this;
        _.ajax({
          url: _.baseURL + self.homeworkDetail.endHomeworkTesk.url,
          type: 'POST',
          data: {
            'reason': comment,//备注
            'score': score,//分数
            "status": "2",
            'homeworkCloseType': homeworkCloseType,
            "homeworkId": self.$route.query.homeworkId,
            'isScore': self.isScore,//开启评分，"0":开启
          },
          success: function (result) {
            _.showMsgHide();
            if(result.code=="0"){
              _.tooltips_succeed("i18n.operationSuccess");
              if(self.homeworkDetail.detail.creator.id==_.userId){
                setTimeout(function () {
                  self.$router.push({path:'/'})
                },1000);
              }else {
                self.detailShow();
              }
            }else{
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },

      //重启作业弹窗
      restartTask:function () {
        var content=[];
        //启动重置进度选择
        if(this.isUseRateVal=="1"){
          content.push({
            type:"radioType",
            radioType:{
              title:"i18n.restartAll",
              name:"radio",
              list:[{text:"i18n.no", value:"0",}, {text:"i18n.yes", value:"1",}],
            }
          });
        }
        content.push({type:"comment",comment:{name:"comment",maxLength:100,placeholder:"i18n.restartReason", value:"",}});
        var btnConfig={
          primaryBtn:{name:"i18n.confirm", callBack:this.updataHomeworkStatus},
          defaultBtn:{name:"i18n.cancel", callBack:null}, //次操作按钮
        };
        _.showMsg("",content,btnConfig);

      },

      //重启作业请求
      updataHomeworkStatus(msg){
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
          _.alertError("i18n.restartReason",index);
          return;
        }
        var self=this;
        _.ajax({
          url: _.baseURL+self.homeworkDetail.endHomeworkTesk.url,
          type: 'POST',
          data:{
            'reason':comment,
            "status":"1",
            "homeworkId":self.$route.query.homeworkId,
            'resetType':resetType //重置进度
          },
          success: function (result) {
            _.showMsgHide();
            if(result.code=="0"){
              _.tooltips_succeed("i18n.restartSuccess");
              self.detailShow();
            }else{
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      noAgainSubmit:function () {
        _.alert("i18n.notice","i18n.contactAdmin");
      },
      againSubmit:function () {//重新提交
        this.$router.push({
          path:'/add',
          params: {homeworkId: this.$route.query.homeworkId},
          query: {homeworkId: this.$route.query.homeworkId}
        });
      },
      backUserSelect(obj){ //@人后把人添加为相关人
        if(this.homeworkDetail.detail.userListConfig.ccPersonList.userSelected){
          var newRelativePerson=_.appendRelativePerson(this.homeworkDetail.detail.userListConfig.ccPersonList,obj);
          this.homeworkDetail.detail.userListConfig.ccPersonList.num=newRelativePerson.length;
          this.homeworkDetail.detail.userListConfig.ccPersonList.userSelected=newRelativePerson;
        }
      }
    },
    components:{
      detailTitle,
      detailContent,
      flowButton,
      userSelect,
      userShow,
      listComment,
      chatComment,
      user_select,
      user_info,
      previewImages
    },

  }
</script>
