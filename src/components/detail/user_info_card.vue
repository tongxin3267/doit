<template>
  <div class="qwui-user_detail_mask" v-show="showDialog">

    <div class="qwui-user_detail" v-show="!isAllInfo">
      <div class="qwui-user_detail_close" @click="close">
        <i class="iconfont icon-shenpiqingshi-tuishen"></i>
      </div>
      <div class="qwui-user_detail_info" >
        <span class="img" :class="{'active':person.headPic=='0'||person.headPic==''}">
          <img :src="person.headPic!='0' && person.headPic!=''? person.headPic:defaultHeadPic" @click="previewImg(person.headPic)">
        </span>
        <div class="name">
          <span :class="[person.sex == '1'? 'qwui-icon_male': 'qwui-icon_female']" >{{person.personName}}</span>
        </div>
        <div>
          <div class="qwui-user_detail_info_word" v-if="person.position">{{person.position}}</div>
          <div class="qwui-user_detail_info_word" v-if="person.departmentName">{{person.departmentName}}</div>
          <div class="qwui-user_detail_info_word" v-if="isDeparted">已离职</div>
        </div>
      </div>
      <div class="qwui-user_detail_icon" v-show="!isDeparted">
        <!--个人信息入口-->
        <div v-if="hasPermission" class="qwui-user_detail_icon_name" @click="userMsgClick">
          <div class="qwui-user_info_icon"></div>
        </div>
        <!--电话-->
        <a :href="'tel:'+person.mobile" v-if="hasPermission && isPhone && person.mobile" class="qwui-user_detail_icon_name">
          <div class="qwui-user_info_icon phone"></div>
        </a>
        <!--会话-->
        <div class="qwui-user_detail_icon_name" v-if="hasPermission && isWxQY" @click="createWxChat(person.wxUserId)">
          <div class="qwui-user_info_icon word"></div>
        </div>
        <!--@-->
        <div class="qwui-user_detail_icon_name" v-if="isUseAt">
          <div class="qwui-user_info_icon icon2" @click="sayUserClick"></div>
        </div>

      </div>
    </div>

    <!--信息列表-->
    <div class="qwui-user_info_fixed" v-show="isAllInfo">
      <div class="qwui-user_info_header">
        <div class="qwui-user_info_header_bg">
          <img :src="person.headPic!='0' && person.headPic!=''? person.headPic:defaultHeadPic" >
        </div>
        <div class="qwui-user_info_header_person">
          <p>
            <span :class="[person.sex == '1'? 'qwui-icon_male': 'qwui-icon_female']">{{person.personName}}</span>
          </p>
        </div>
      </div>
      <div class="qwui-user_info_list">
        <ul>
          <li v-for="item in inFoConfig" v-if="item.text">
            <span>{{item.fieldName}}</span>
            <p v-if="item.name!='birthday' && item.name!='remindType'">{{item.text}}</p>
            <p v-if="item.name=='birthday'">{{item.text.substring(5,10)}}</p>
            <p v-if="item.name=='remindType'">{{item.text=='1'? '按阳历':'按农历'}}</p>
            <a v-if="(item.name=='mobile' || item.name=='shorMobile' || item.name=='phone') && isWeChatApp" :href="'tel:'+item.text" class="qwui-user_info_phone qwui-user_info_icon phone"></a>
          </li>
        </ul>

      </div>

      <div class="qwui-user_info_list_mark">
        <ul>
          <li>
          <p>留言</p>
          <p><input type="text" placeholder="给Ta发条微信消息吧" @click="showInputMark"></p>
        </li>
        </ul>
      </div>

      <div class="qwui-user_info_footer">
        <p>① 可在后台隐藏特定成员联系方式；</p>
        <p>② 可将特定人员排在通讯录最前面。</p>
      </div>
      <flowButton :buttondata="buttonConfig"></flowButton>
    </div>
  </div>
</template>
<script>
  import flowButton from '@/components/button/flow_button';
  import wx from 'weixin-js-sdk';
  import checkApi from '../../assets/js/check_api';
  import EventBus from '@/utils/eventBus';
  export default {
    data() {
      return {
        showDialog: false,//显示弹窗
        isGetLoading:false,//正在查询
        backData:{},//接口参数
        person:{},//个人信息
        allCtrol:false,//控制底部全部图标
        hasPermission:true,//有权限查看
        isDeparted:false,//离职状态
        isWxQY:false,//显示企业会话
        isPhone:false,//显示电话
        isAllInfo:false,//显示个人列表信息
        isWeChatApp:false,
        isUseAt:true,// 显示 @ 功能
        getUserDetailUrl: '/portal/contactAction!ajaxGetUserInfoByID.action',
        getOpenUrl:"/portal/contactAction!isCommonUser.action",//开启常用联系人接口
        sendCancleUserUrl:"/portal/contactAction!cancleCommonUser.action",//取消联系人
        sendAddUserUrl:"/portal/contactAction!addCommonUser.action",//添加
        sendContactUrl:"/portal/contactAction!addguess.action",//发生留言
        getNewUserHeadic:"/portal/selectUserAction!getNewUserHeadic.action",//新头像接口
        defaultHeadPic: require('../../assets/images/touxiang02.png'),//没有头像时的默认头像
        currentButtonStatus:false,
        buttonConfig:{},
//     列表字段
        inFoConfig:{
          nickName :{fieldName:"昵称",name:"nickName", text:null},
          wxUserId : {fieldName:"账号",name:"wxUserId", text:null},
          weixinNum : {fieldName:"微信号",name:"weixinNum", text:null},
          mobile : {fieldName:"手机",name:"mobile", text:null},
          email : {fieldName:"邮箱",name:"email", text:null},
//          personName :{fieldName:"姓名",name:"personName", text:null},
          deptName : {fieldName:"所属部门",name:"deptName", text:null},
          position : {fieldName:"职位",name:"position", text:null},
          entryTime : {fieldName:"入职时间",name:"entryTime", text:null},
          qqNum : {fieldName:"QQ",name:"qqNum", text:null},
          shorMobile : {fieldName:"电话",name:"shorMobile", text:null},
          phone : {fieldName:"电话2",name:"phone", text:null},
          address :{fieldName:"地址",name:"address", text:null},
          birthday : {fieldName:"阳历生日",name:"birthday", text:null},
          lunarCalendar : {fieldName:"农历生日",name:"lunarCalendar", text:null},
          remindType : {fieldName:"生日祝福提醒",name:"remindType", text:null},
          identity:{fieldName:"身份证",name:"identity",text:null},
        },
        otherConfig:{
          mark :{fieldName:"多肉植物",name:"mark", text:null},
          mark :{fieldName:"备注",name:"mark", text:null},
        },
        itemData:null//记录相关人
      }
    },
    mounted(){
      EventBus.$on("showPersonUtil",this.showPersonMessage);
      EventBus.$on("atThisPersonUtil",this.showUserMessage);
      if(_.isWeChatApp()){
        this.isWeChatApp=true;
      }
    },
    //清空body限制滚动样式
    beforeDestroy(){
      document.getElementsByTagName("body")[0].style.cssText = "";
      document.body.style.cssText = "";
    },
    watch:{
      "showDialog":function(val){
        if(val){
          document.getElementsByTagName("body")[0].style.cssText = "overflow-y: hidden;";
          document.body.style.cssText = "overflow-y: hidden;";
        }else{
          document.getElementsByTagName("body")[0].style.cssText = "";
          document.body.style.cssText = "";
        }
      }
    },
    methods:{
      showPersonMessage(item,data){
        if(item && data){
          this.itemData={};
          this.itemData=item;
          this.showUserMessage(data);
        }
      },
      sayUserClick(){
        if(this.backData){
          this.showDialog=false;
          this.isAllInfo=false;
          if(this.itemData){
            this.itemData.show=!this.itemData.show;
          }
          EventBus.$emit("chatSendUtil",this.backData);  //传输数据给输入框组件，控制显示
          this.itemData=null;
        }
      },
      //预览图片
      previewImg(url){
        if(checkApi.checkJsApi_image && _.isWeChatApp() && url){
          wx.previewImage({
            current: url, // 当前显示的图片链接
            urls: [url] // 需要预览的图片链接列表
          });
        }
      },
      //关闭弹框
      close:function () {
        this.showDialog = false;
      },
      //关闭个人信息列表
      closeUserMark(){
        this.isAllInfo=false;
      },
      showInputMark(){
        var content=[
          {type:"comment",comment:{name:"comment",maxLength:50,placeholder:"请输入留言信息", value:""}}
        ];
        var btnConfig={
          primaryBtn:{name:"确定", callBack:this.sendContactAction},
          defaultBtn:{name:"取消", callBack:null}, //次操作按钮
        };
        _.showMsg("",content,btnConfig);
      },
      sendContactAction(msg){
        if(!msg[0].value){
          _.alertError("内容不能为空",0);
          return;
        }
        var self=this;
        _.showLoading('发送中');
        _.ajax({
            url: _.baseURL+self.sendContactUrl,
            type: 'POST',
            data: {'userId': self.backData.userId||self.backData.creator,"keyWord":msg[0].value,id:self.backData.userId||self.backData.creator,},
            success: function (result) {
              _.hideLoading();
              _.showMsgHide();
              if(result.code=="0"){
                _.tooltips_succeed("留言成功");
              }else{
                _.alert("提示",result.desc);
              }
            }
        });
      },
      showUserMessage(data,isUseAt){ //如果不需要@，就传true过来
        if(isUseAt){
          this.isUseAt = false;
        }
        if(this.isGetLoading||(!data.userId && !data.creator)){
          return;
        }
        this.backData=data;
        this.isGetLoading=true;
        var self=this;
        _.showLoading();
        _.ajax({
          url: _.baseURL+self.getUserDetailUrl,
          type: 'POST',
          data: {'userId': data.userId||data.creator},
          success: function (result) {
            if(result.code=="0"){
              var userInfo=result.data.userInfo;
              var fieldList = result.data.fieldList;
              if(userInfo){
                self.person=userInfo;
                //如果已经离职
                if(userInfo.userStatus =='-1'){
                  self.isDeparted=true;
                  self.allCtrol=true;
                }
                if(_.isWeChatApp()){
                  self.isWxQY=_.isQiyeweixinApp()? true:false;
                  //如果该用户是保密用户
                  if(userInfo.mobile == "" && userInfo.weixinNum == "" && userInfo.email == ""){
                    self.isWxQY=false;
                  }else{
                    self.isPhone=userInfo.userId!=_.userId? true:false;
                  }
                }
                self.showDialog = true;
                self.getOpenClick(userInfo.userId);//请求常用联系人数据
                if(fieldList && fieldList.length>0){
                    for(var x = 0; x < fieldList.length; x++){
                      var vo=fieldList[x];
                      if(self.inFoConfig[vo.field] && self.inFoConfig[vo.field].name==vo.field && "0"==vo.isDisplay) {
                        self.inFoConfig[vo.field].text=userInfo[self.inFoConfig[vo.field].name];
                      }
                  }
                }
              }
              _.hideLoading();
              _.ajax({ //获取新头像
                url: _.baseURL+self.getNewUserHeadic,
                type: 'POST',
                data: {'userId': userInfo.userId},
                success: function (result) {
                  self.isGetLoading=false;                                 //请求完成
                  if(result.code == "0"){
                    self.person.headPic = result.data.headPic?result.data.headPic:self.person.headPic;
                  }
                }
              });
              self.hasPermission=result.data.hasPermission;                     //没有权限
              self.$emit('getNewHeadPic',self.person.headPic)
            }else if(result.code=="1999"){
              _.hideLoading();
              self.person={
                headPic:data.headPic,//头像
                personName:data.personName,
                position:data.position,
                departmentName:data.departmentName
              };
              self.showDialog = true;
            }
          },
          error :function(result){
            return false;
          }
        });
      },
      //
      changeButton(val){
        if(val){
          this.buttonConfig={
            primaryList:[],
            defaultList:[{type:"default",name:"返回", callBack:this.closeUserMark},{type:"default",name:"取消常用联系人", callBack:this.cancelUpdated}],
            class:"active"
          }
        }else{
          this.buttonConfig={
            primaryList:[{type:"primary",name:"添加常用联系人", callBack:this.openUpdated}],
            defaultList:[{type:"default",name:"返回", callBack:this.closeUserMark}],
            class:"active"
          }
        }
      },
      userMsgClick(){
        if(this.currentButtonStatus!=null){
          this.isAllInfo=true;
        }
      },
//      查询常用联系人接口
      getOpenClick(userId){
        var self=this;
        if(userId){
          _.ajax({
            url: _.baseURL+self.getOpenUrl,
            type: 'POST',
            data: {'toUserId': userId},
            success: function (result) {
              if(result.code=="0" && result.data){
                self.currentButtonStatus=result.data.common=="1"? true:false;//已经开启/取消
                self.changeButton(self.currentButtonStatus);
              }else{
                _.alert("提示",result.desc);
              }
            }
          });
        }
      },
      //开启常用联系人
      openUpdated(){
        var self=this;
        if(self.backData.userId || self.backData.creator){
          _.ajax({
            url: _.baseURL + self.sendAddUserUrl,
            type: 'POST',
            data: {'toUserId': self.backData.userId||self.backData.creator},
            success: function (result) {
              if(result.code=="0"){
                self.currentButtonStatus=!self.currentButtonStatus;//已经取消
                self.changeButton(self.currentButtonStatus);
              }else{
                _.alert("提示",result.desc);
              }
            }
          });
        }
      },
      //取消常用联系人
      cancelUpdated(){
        var self=this;
        if(self.backData.userId || self.backData.creator){
          _.ajax({
            url: _.baseURL + self.sendCancleUserUrl,
            type: 'POST',
            data: {'toUserId': self.backData.userId||self.backData.creator},
            success: function (result) {
              if(result.code=="0"){
                self.currentButtonStatus=!self.currentButtonStatus;//已经取消
                self.changeButton(self.currentButtonStatus);
              }else{
                _.alert("提示",result.desc);
              }
            }
          })
        }
      },
      //企业微信会话
      createWxChat(wxUserId){
        wx.openEnterpriseChat({
          userIds: wxUserId,
          groupName: '', //openEnterpriseChat讨论组
          success: function(res){
            // 回调
          },
          fail: function(res){
            if(res.errMsg.indexOf('function not exist') > 0){
              _.alert('提示', '版本过低请升级');
            }else{
              _.alert('提示', '该功能不能使用，企业微信已停止提供企业消息会话服务');
            }
          }
        });
      }
    },
    components:{
      flowButton
    }
  }
</script>
<style scoped>
  .qwui-user_detail_mask{
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .qwui-user_detail{
    display:block;
    width: 270px;
    margin: 0 auto;
    top: 45%;
    position: absolute;
    left: 50%;
    background: #fff;
    text-align: center;
    z-index: 1111;
    line-height: 1.5;
    border-radius: 5px;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
  }
  .qwui-user_detail_close{
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }
  .qwui-user_detail_info{
    margin-bottom: 12px;
  }
  .qwui-user_detail_info img{
    width: 75px;
    height: 75px;
    border-radius: 50%;
    margin-top: 15px;
    vertical-align: middle;
    background-color: #ccc;
  }
  .qwui-user_detail_info img.active{
    background: url("../../assets/images/icon_person.png") no-repeat ;
    background-size: cover;
  }
  .qwui-user_detail_info .name {
    font-size: 16px;
    color: #333;
    margin-top: 8px;
  }
  .qwui-icon_male {
    padding-right: 20px;
    background: url(../../assets/images/ic_male.png) no-repeat right 0 top 3px;
    background-size: 15px 15px;
  }
  .qwui-icon_female {
    padding-right: 20px;
    background: url(../../assets/images/ic_female.png) no-repeat right 0 top 3px;
    background-size: 15px 15px;
  }
  .qwui-user_detail_info_word {
    margin: 0 15px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
  }
  .qwui-user_detail_icon {
    display: flex;
    position: relative;
    height: 50px;
    margin-top: 12px;
    padding: 0 10px;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
  }
  .qwui-user_detail_icon_name{
    flex: 1;
    margin-top: 10px;
  }
  .qwui-user_detail_icon::before {
    content: '';
    width: 100%;
    height: 1px;
    position: absolute;
    left: 0;
    top: 0;
    background: #ccc;
    transform: scaleY(.5);
    -webkit-transform: scaleY(.5);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
  }
  .qwui-user_info_icon {
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(../../assets/images/personalInfo.png) no-repeat;
    background-size: 30px 120px;
  }
  .qwui-user_info_icon.icon2{
    background-position: 0 -90px;
  }
  .qwui-user_info_icon.phone{
    background-position: 0 -30px;
  }
  .qwui-user_info_icon.word{
    background-position: 0 -60px;
  }
  .qwui-user_detail_close i {
    font-size: 22px;
    color: #BBB;
  }
  /*信息列表*/
  .qwui-user_info_fixed{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    margin: auto;
    overflow-y: scroll;
    background: #fff;
  }
  .qwui-user_info_fixed::-webkit-scrollbar {
    width: 0;
    height: 6px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-user_info_fixed{
    width: 740px !important;
    }
  }
  .qwui-user_info_header{
    padding:20px 0 15px 0;
    text-align: center;
    background: #5077aa ;
  }
  .qwui-user_info_header_bg{
    position: relative;
    display: inline-block;
    width: 79px;
    height: 79px;
    background: #fff;
    border-radius: 50%;
  }
  .qwui-user_info_header img {
    display: inline-block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 75px;
    height: 75px;
    border-radius: 50%;
  }
  .qwui-user_info_header_person span{
    margin: 12px 0;
    font-size: 16px;
    color: #fff;
  }
  .qwui-user_info_list,.qwui-user_info_list_mark{
    display: flex;
    padding:  0 0 0 15px;
  }
  .qwui-user_info_list ul,.qwui-user_info_list_mark ul{
    flex: 1;
  }
  .qwui-user_info_list li,.qwui-user_info_list_mark li{
    display: flex;
    position: relative;
    padding: 9px 0;
  }
  .qwui-user_info_list li:after,.qwui-user_info_list_mark li:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
  }
  .qwui-user_info_list li span,.qwui-user_info_list li p,.qwui-user_info_list_mark li p{
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .qwui-user_info_list li span,.qwui-user_info_list_mark li p:first-child{
    min-width: 128px;
    width: 128px;
    font-size: 15px;
    color: #999;
  }
  .qwui-user_info_list li p,.qwui-user_info_list_mark li p:last-child{
    padding-right: 15px;
    font-size: 15px;
    color: #333;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .qwui-user_info_list_mark input{
    -webkit-appearance: none;
    outline: none;
    border: none;
    font-size: 16px;
    color: #666666;
    width: 100%;
  }
  .qwui-user_info_footer{
    padding: 10px 15px 70px;
    color: rgb(153, 153, 153);
    font-size: 12px;
    line-height: 20px;
    background: white;
  }
  .qwui-user_info_phone{
    position: absolute;
    right: 15px;
    top: 0;
    bottom: 0;
    margin: auto;
  }
</style>
