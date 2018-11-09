<template>
  <div class="wrap" v-show="hasContent">
    <div>
      <!--详情标题头部-->
      <detail-title :titledata="diaryDetail.detail" @showThisPersonUtil="getCreatorDetail" @clickEditOrCopy="clickEditOrCopy"></detail-title>

      <!--操作按钮-->
      <div class="qwui-background_white">
      <flow-button :buttondata="buttonConfig" v-if="diaryDetail.detail.isScore"></flow-button>
      </div>

      <!--负责人和相关人内容-->
      <user-select :userselect="userSelect"></user-select>

      <!--上一篇 下一篇-->
      <div class="qwui-pageNumber">
        <div class="prev" @click="nextDiary('pre')">上一篇日志</div>
        <div class="next" @click="nextDiary('next')">下一篇日志</div>
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
  import flowButton from '@/components/button/flow_button';
  import userSelect from '@/components/detail/user_select';
  import userShow from '@/components/base/user_show';
  import listComment from '@/components/detail/list_comment';
  import chatComment from '@/components/detail/chat_comment';
  import user_select from '@/components/base/user_or_dept_select';
  import user_info from '@/components/detail/user_info_card';//个人信息
  import previewImages from "@/components/detail/previewImages";
  import detail from '../../js/detail'
  export default {
    name: 'detail',
    data(){
      return{
        dataBase:dataBase,
        diaryDetail:detail.detailData.diaryDetail,
        isSubmitLoading:false,//正在提交

        isScore:"0",//默认使用评分功能
        recIsClose:1,//负责人是否可结束作业
        hasContent:false, //请求成功
        previewImageUrl:[],                                                     //需要预览的图片列表
      }
    },
    created:function(){
      _.showLoading("",false);
      this.diaryDetail.data.diaryId=this.$route.query.diaryId;
      this.diaryDetail.listComment.get.data.id=this.$route.query.diaryId;
      this.diaryDetail.data.status=this.$route.query.status;
      this.detailShow();
    },
    computed:{
      buttonConfig:function(){ //详情操作按钮
        return this.diaryDetail.detail.scoreButtonConfig;
      },
      userSelect:function(){  //负责人、相关人
        return this.diaryDetail.detail.userListConfig;
      },
      listComment:function () { //评论数据
        return this.diaryDetail.listComment;
      },
    },
    methods:{
      //跳转到上一篇/下一篇
      nextDiary:function(type){
        _.showLoading('加载中')
        var self = this;
        var tempStatus = self.$route.query.status;
        if(tempStatus==''||tempStatus==null||tempStatus==undefined){
          tempStatus='2';
        }
        _.ajax({
          url: _.baseURL+detail.nextUrl,
          type: 'POST',
          data:{
            'id':self.$route.query.diaryId,
            'status':tempStatus,
            'type':type,
            'typeId':'',
            'keyWord':self.$route.query.keyWord,
            "historyYear":''
          },
          success: function (result) {
            if(result.code=="0"){
              self.$router.push({
                path: '/detail',
                query: {diaryId: result.data.diaryId, status: tempStatus, keyWord: self.$route.query.keyWord}
              })
              location.reload();
            }else{
              _.hideLoading()
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      //点击编辑复制
      clickEditOrCopy:function (val) {
        if(val.isCheckUEditor){
          _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
        } else {
          this.$router.push({
            path: val.name,
            query: val.params
          })
        }
      },
      detailShow:function(){ //详情加载
        var self=this;
        self.diaryDetail.data.userId=_.userId;
        _.ajax({
            url: _.baseURL+self.diaryDetail.url,
            type: 'POST',
            data:self.diaryDetail.data,
            success: function (result) {
              if(result.code=="0"){
                var detailDataConfig=result.data;
                detailDataConfig.detail.title? document.title = detailDataConfig.detail.title:"";
                var scoreSetting=detailDataConfig.isScore;//是否开启评分
                if(scoreSetting){
                  self.isScore= scoreSetting.isScore=="1"? "1":"0";
                  if(!(JSON.stringify(scoreSetting)!="{}" && scoreSetting.isScore=="0" && detailDataConfig.detail.scoreInfo)){
                    detailDataConfig.detail.scoreInfo={};
                    detailDataConfig.detail.scoreInfo.score="";
                  }
                }
                //判断负责人ID 是否和当前登录人的ID相等，如果相等当前登录人就是负责人；
                var curUserIdIsChargePerson = false;
                var toPersons = detailDataConfig.detail.toPersons;
                if(toPersons&&toPersons.length>0) {
                  for (var i = 0; i < toPersons.length; i++) {
                    if (toPersons[i].userId == _.userId)
                      curUserIdIsChargePerson = true;
                  }
                }
                var configCopy={};//复制图标
                var configEdit={};//编辑图标
                //是否使用富文本编辑器判断
                let isCheckUEditor = detailDataConfig.detail.isUEditor == '1' && !(_.isWeChat() && !_.isWeChatApp());
                if(detailDataConfig.detail.creator==_.userId){ //如果是本人，显示编辑复制按钮
                  configCopy={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, isCopy:true, status:1}};
                  configEdit={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, status:1}};
                } else if(curUserIdIsChargePerson && detailDataConfig.isEditor){ //如果是负责人，根据是否后台设置，显示编辑按钮
                  configEdit={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, status:1}};
                }
                var isScore = false;
                if(curUserIdIsChargePerson && detailDataConfig.isScore){ //如果是负责人，并且设置可以评分
                  isScore =true;
                }
                self.previewImageUrl=detailDataConfig.detail.picList;
                self.diaryDetail.detail={
                  openPrint:false,
                  creator:{
                    userId:detailDataConfig.detail.creator,
                    personName:detailDataConfig.detail.personName,
                    headPic:detailDataConfig.detail.headPic,
                    createPerson:detailDataConfig.detail.creator,
                  },
                  title:detailDataConfig.detail.title,
                  personName:detailDataConfig.detail.personName,
                  createTime:detailDataConfig.detail.createTime,
                  content:detailDataConfig.detail.content,
                  configEdit:configEdit,
                  configCopy:configCopy,
                  picList:detailDataConfig.detail.picList,//上传的图片列表
                  tips:detailDataConfig.detail.typeName,
                  mediaList:detailDataConfig.mediaList,//上传的附件列表
                  isScore:isScore,//是否可评分
                  scoreButtonConfig:{ //评分操作按钮
                    primaryList:[{type:"primary",name:'评分',callBack:self.scoreThis}],
                    defaultList:[],
                    class:""//按钮是否置底部 active :底部、"":相对定位
                  },
                  scoreList:detailDataConfig.detail.scoreList,//评分列表
                  userListConfig:{
                    toPersonList:{
                      title:"负责人",
                      show:false,
                      num:detailDataConfig.detail.toPersons.length,
                      userSelected:detailDataConfig.detail.toPersons,
                    },
                    ccPersonList:{
                      title:"相关人",
                      show:false,
                      num:detailDataConfig.detail.ccPersons.length,
                      userSelected:detailDataConfig.detail.ccPersons,
                    }
                  },
                };
                self.diaryDetail.listComment.get.hasMore=detailDataConfig.hasMore; //更多
                self.diaryDetail.listComment.totalPages=detailDataConfig.detail.commentCount;
                self.diaryDetail.listComment.send.contentObject="tbQyDiaryCommentPO.content";
                self.diaryDetail.listComment.send.data={
                  "id":detailDataConfig.detail.diaryId,
                  "type":"1",
                  "userId":_.userId,
                  "tbQyDiaryCommentPO.content":"",
                  "tbQyDiaryCommentPO.diaryId":detailDataConfig.detail.diaryId,
                }
                if(detailDataConfig.comments){
                  self.diaryDetail.listComment.comments=detailDataConfig.comments;//评论列表数据
                }else{
                  self.diaryDetail.listComment.comments=[];//评论列表数据
                }
                self.hasContent=true;
                _.hideLoading();
              }else{
                _.hideLoading();
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

      backUserSelect(obj){ //@人后把人添加为相关人
        if(this.diaryDetail.detail.userListConfig.ccPersonList.userSelected){
          var newRelativePerson=_.appendRelativePerson(this.diaryDetail.detail.userListConfig.ccPersonList,obj);
          this.diaryDetail.detail.userListConfig.ccPersonList.num=newRelativePerson.length;
          this.diaryDetail.detail.userListConfig.ccPersonList.userSelected=newRelativePerson;
        }
      },
      //评分
      scoreThis:function () {
        var content = [
          {type:"scoreType",scoreType:{title:"给该日志评分",name:"score",num:"10",score:"1"}},
          {type:"comment",comment:{maxLength:100,placeholder:"理由",value:"很好"}}
        ];
        var buttonConfig = {
          primaryBtn:{name:"i18n.confirm", callBack:this.doScore},
          defaultBtn:{name:"i18n.cancel", callBack:null},
        };
        _.showMsg("", content, buttonConfig);
      },
      doScore:function (msg) {
        var self = this;
        if(!msg[1].value){
          _.alertError("i18n.cannotEmpty",1);
          return;
        }
        _.ajax({
          url: _.baseURL + detail.scoreUrl,
          type: "post",
          data: {
            'diaryId':self.$route.query.diaryId,
            'score': msg[0].value,
            'reason': msg[1].value
          },
          success: function (result) {
            if (result.code == "0") {
              self.hasContent = false;
              _.showLoading("",false);
              self.detailShow();
            } else {
              _.alert("i18n.notice", result.desc);
            }
          }
        })
      }
    },
    components:{
      detailTitle,
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
<style>
  .qwui-background_white{
    position: relative;
    background-color: white;
  }
  .qwui-background_white:after, .qwui-pageNumber:after{
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-pageNumber{
    position: relative;
    height: 45px;
    background-color: white;
    line-height: 45px;
    color: #666;
    font-size: 14px;
  }
  .qwui-pageNumber .prev{
    float: left;
    padding-left: 10px;
    cursor: pointer;
  }
  .qwui-pageNumber .prev:before{
    content: '';
    background: url('../../../../assets/images/CSSSprites.png');
    width: 10px;
    height: 15px;
    display: inline-block;
    background-size: 101px 101px;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    margin-right: 10px;
    vertical-align: -2px;
  }
  .qwui-pageNumber .next{
    float: right;
    padding-right: 10px;
    cursor: pointer;
  }
  .qwui-pageNumber .next:after{
    content: '';
    background: url('../../../../assets/images/CSSSprites.png');
    width: 10px;
    height: 15px;
    display: inline-block;
    background-size: 101px 101px;
    margin-left: 10px;
    vertical-align: -2px;
  }
</style>
