<template>
  <div class="wrap">
      <!--标题和类型-->
      <data_detail :dataDetailMsg="add_nav" v-on:listenToChild="showMsgFromDataDetail"></data_detail>
      <!--上传图片-->
      <img_detail :dataDetailMsg="add.imgUpload" v-on:listenToChild="showMsgFromImgDetail"></img_detail>
      <!--上传附件-->
      <file_detail :dataDetailMsg="add.fileUpload" v-on:listenToChild="showMsgFromFileDetail"></file_detail>
      <!--开始时间、结束时间-->
      <time_detail :dataDetailMsg="timeData" v-on:listenToChild="showMsgFromTimeDetail"></time_detail>
      <!--选择负责、相关人-->
      <related_person_detail :selectconfig="dataBase.selectConfig" @selectPerson="selectPerson"></related_person_detail>
      <!--高级设置-->
      <advanced_setting :dataDetailMsg="dataBase.draft.add.advancedSetting" v-on:listenToChild="showMsgFromAdvancedSetting" ></advanced_setting>
    <!--底部操作按钮-->
    <div class="qwui_btn_top_bottom">
    <flow_button :buttondata="draftDetail.buttonConfig"></flow_button>
    </div>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>
  </div>
</template>

<script>
import data_detail from '../../../../components/add/add_title';
import img_detail from '../../../../components/add/add_img';
import file_detail from '../../../../components/add/add_file';
import time_detail from '../../../../components/base/time_detail';
import related_person_detail from '../../../../components/add/user_select_icon_right';
import advanced_setting from '../../../../components/add/advanced_setting';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '../../../../assets/js/time-util';

export default {
  data(){
    return {
      dataBase:dataBase,
      commitDraft: dataBase.draft.draftDetail.commitDraft,
      draftDetail: dataBase.draft.draftDetail,
      draftUpdate: dataBase.draft.add.draftUpdate,
      addHomework: dataBase.draft.add.addHomework,
      homeFooterList: dataBase.home.homeFooterList,//底部菜单
      draftId: '',
      add: dataBase.draft.add, // 传入组件的详细数据
      timeData: [],
      isClickWhich: '', // 0代表保存，1代表提交
      addOrUpdateUrl: "", // 功能接口url back
      getDeptsAndUrl:"/portal/departmentAction!getDeptsAndUsers.action",//查询历史已选部门和人员,
      add_nav:{ //数据详情头部信息
        nav: 'i18n.homeworkType', //头部标题
        title:"",
        titlePlaceholder: 'i18n.fillInTitle',
        content:"",
        contentPlaceholder: 'i18n.fillInContent',
        templateTypeId:"",
        templateType:[],
      }
    }
  },
  created:function(){
    _.showLoading(this.$t('i18n.loading'),true);
    //判断是复制或者重新编辑
    if(this.$route.query.homeworkId){
      this.draftId = this.$route.query.homeworkId;
      this.loadDraftData();
      if(this.$route.query.isCopy) { // 如果是 复制 功能，url变为新增接口，否则为更新接口
        this.addOrUpdateUrl = this.addHomework.url;
      } else {
        this.addOrUpdateUrl = this.draftUpdate.url;
      }
    } else {
      this.addOrUpdateUrl = this.addHomework.url;
      this.loadLastSetting(); //点击新增才会调用这个方法 获取后台的设置(高级设置)
    }

    this.draftDetail.buttonConfig.primaryList[0].callBack=this.checkCommit;
    this.draftDetail.buttonConfig.defaultList[0].callBack=this.checkDraft;
    this.commitDraft.draftFormData = { // 清除数据
      'tbQyHomeworkPO.homeworkId': '',
      'tbQyHomeworkPO.creator': '',
      'oldHomeworkStatus': '',
      'tbQyHomeworkPO.homeworkType': '',
      'tbQyHomeworkPO.title': '',
      'tbQyHomeworkPO.content': '',
      'tbQyHomeworkPO.homeworkStart': '',
      'tbQyHomeworkPO.homeworkStop': '',
      'tbQyHomeworkPO.priority': 0,
      'tbQyHomeworkPO.sendStartRemindMsg': 0,
      'tbQyHomeworkPO.startRemindMsg': 1, // 从该行往下5行为对应的高级设置
      'tbQyHomeworkPO.endRemindMsg': 1,
      'tbQyHomeworkPO.isUseRate': 1,
      'tbQyHomeworkPO.closeSwitch': 1,
      'tbQyHomeworkPO.isChargeEach': 1,
      'tbQyHomeworkPO.homeworkStatus': '',
      'typeId': 1,
      'toUserIds': '',
      'toDeptIds': '',
      'ccUserIds': '',
      'ccDeptIds': '',
      'userId': '', // 以下三行为新增数据要用到
      'mediaIds': '',
      'imageUrls': ''
    };
//    初始化选人、部门
    this.dataBase.selectConfig.selectList["toPersonList"].deptSelected=[];
    this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected=[];
    this.add.advancedSetting.switchControl.forEach(function (e) {
      e.onOff = true;
    });
    this.getHomeworkType();
  },
  methods: {
    loadLastSetting:function(){ //点击新增才会调用这个方法 获取后台的设置(高级设置)
      var self = this;
      _.ajax({
        url: _.baseURL + self.add.getLastSetting.url,
        type: 'post',
        success: function (result) {
          if(result.code=="0"){
            self.add.advancedSetting.option = [];
            var temp = result.data.settingPO;
            if(temp){
              self.add.advancedSetting.option.splice(0,0, temp.priority?temp.priority:'', temp.startRemindMsg?temp.startRemindMsg:'',
                temp.endRemindMsg?temp.endRemindMsg:'', temp.isUseRate?temp.isUseRate:'',
                temp.closeSwitch?temp.closeSwitch:'',temp.isChargeEach?temp.isChargeEach:'');
            }
          }else{
            _.alert("提示",result.desc);
          }
        },
      })
    },
    getHomeworkType:function(){
      var self = this;
      _.ajax({
        url: _.baseURL + self.add.homeworkTemplate.url,
        type: 'post',
        success: function (result) {
           _.hideLoading();
          if(result.code=="0"){
            self.add_nav.templateType = result.data.template;
          }else{
            _.alert('i18n.notice',result.desc);
          }
        },
      })
    },
    loadDraftData:function(){
      var self = this;
      _.ajax({
        url:_.baseURL+self.draftDetail.url + self.draftId +"&status=0",
        type:"get",
        success:function(result){
          if(result.code==0){
            // 将接口返回数据打包
            var obj=result.data.vo;
            self.add_nav.title= obj.title;
            self.add_nav.content=obj.content;
            self.add_nav.templateTypeId=obj.homeworkType;
            self.commitDraft.draftFormData['tbQyHomeworkPO.homeworkType'] = obj.homeworkType;
            self.add.imgUpload.picList = obj.picList;
            self.add.fileUpload.mediaList = result.data.mediaList;
            self.add.fileUpload.moduleId = self.$route.query.homeworkId;
            self.add.fileUpload.agent = self.dataBase.wxqyh_uploadfile.agent;
            self.timeData.splice(self.timeData.length,0, obj.homeworkStart, obj.homeworkStop);
            self.add.advancedSetting.option = [];
            self.add.advancedSetting.option.splice(0,0, obj.priority,obj.startRemindMsg,obj.endRemindMsg, obj.isUseRate, obj.closeSwitch,obj.isChargeEach);
            self.commitDraft.draftFormData['tbQyHomeworkPO.homeworkId'] = obj.homeworkId;
            self.commitDraft.draftFormData['tbQyHomeworkPO.creator'] = obj.creator;
            self.commitDraft.draftFormData['oldHomeworkStatus'] = obj.homeworkStatus;

            self.getDeptsAndUsers("toPersonList",obj.toPersons,obj.toDept);
            self.getDeptsAndUsers("ccPersonList",obj.ccPersons,obj.ccDept);

          }else{
            _.alert('i18n.notice',result.desc);
          }
        }
      })
    },
    //查询历史选择的部门数据
    getDeptsAndUsers(type,person,Dept){
      var userIds="";
      if(Dept=="" && person && !(person.length>0)){
        return;
      }
      for(var i=0;i<person.length;i++){
        userIds+=person[i].userId+"|";
      }
      var self=this;
      _.ajax({
          url:_.baseURL+self.getDeptsAndUrl,
          type:"POST",
          data:{userIds:userIds, deptIds:Dept},
          success:function(result){
              if(result.code=="0"){
                if(result.data.deptList && result.data.userList){
                  self.dataBase.selectConfig.selectList[type].userSelected=result.data.userList;
                  self.dataBase.selectConfig.selectList[type].deptSelected=result.data.deptList;
                  if(type=="toPersonList"){
                    self.commitDraft.draftFormData['toDeptIds'] =Dept;
                    self.commitDraft.draftFormData['toUserIds'] =self.dealBackPersonMsg(result.data.userList);
                  }else{
                    self.commitDraft.draftFormData['ccDeptIds'] =Dept;
                    self.commitDraft.draftFormData['ccUserIds'] = self.dealBackPersonMsg(result.data.userList);
                  }
                }
              }
          }
      });
    },
    showMsgFromImgDetail:function (imgurl) {
      this.commitDraft.draftFormData['imageUrls'] = '';
      this.commitDraft.draftFormData['imageUrls'] = imgurl.join(',');
    },
    showMsgFromFileDetail:function (mediaId) {
      this.commitDraft.draftFormData['mediaIds'] = mediaId.join(',');
    },
    showMsgFromDataDetail:function (data) { // 子组件传来数据
      if(data == null){
        this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkType'] = '';
      } else if (data.id && this.add_nav.templateType.length>0) { //自动设置标题、内容、负责人相关人
        this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkType'] = data.id;
        this.commitDraft.draftFormData["tbQyHomeworkPO.title"] = this.add_nav.title;
        this.commitDraft.draftFormData["tbQyHomeworkPO.content"] = this.add_nav.content;

        this.dataBase.selectConfig.selectList['toPersonList'].userSelected = [];
        this.dataBase.selectConfig.selectList['ccPersonList'].userSelected=[];
        if (data.ccTbQyHomeworkGivenVOList && data.ccTbQyHomeworkGivenVOList.length > 0) {
          this.commitDraft.draftFormData['ccUserIds'] = this.dealBackPersonMsg(data.ccTbQyHomeworkGivenVOList);
          this.dataBase.selectConfig.selectList['ccPersonList'].userSelected = data.ccTbQyHomeworkGivenVOList;
        }
        if (data.tbQyHomeworkGivenVOList && data.tbQyHomeworkGivenVOList.length > 0) {
          this.commitDraft.draftFormData['toUserIds'] =this.dealBackPersonMsg(data.tbQyHomeworkGivenVOList);
          this.dataBase.selectConfig.selectList['toPersonList'].userSelected = data.tbQyHomeworkGivenVOList;
        }
      }
    },
    dealBackPersonMsg(data){
      var idStr="";
      if(data && data.length>0){
        for(var i=0;i<data.length;i++){
          idStr+=data[i].userId+'|';
        }
      }
      return idStr;
    },
    showMsgFromTimeDetail:function (startTime, endTime) {
      this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStart'] = startTime + ':00';
      this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStop'] = endTime+ ':00';
    },
    showMsgFromAdvancedSetting:function (priority, switchControl) {
      this.commitDraft.draftFormData['tbQyHomeworkPO.priority'] = priority;
      this.commitDraft.draftFormData['tbQyHomeworkPO.sendStartRemindMsg'] = '1';
      this.commitDraft.draftFormData['tbQyHomeworkPO.startRemindMsg'] = switchControl[0];
      this.commitDraft.draftFormData['tbQyHomeworkPO.endRemindMsg'] = switchControl[1];
      this.commitDraft.draftFormData['tbQyHomeworkPO.isUseRate'] = switchControl[2];
      this.commitDraft.draftFormData['tbQyHomeworkPO.closeSwitch'] = switchControl[3];
      this.commitDraft.draftFormData['tbQyHomeworkPO.isChargeEach'] = switchControl[4];
    },
    checkCommit:function () {
      this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStatus'] = 1; // 提交
      this.isClickWhich = 1; //返回的是一个vue对象，所以可以直接调用其方法
      this.isCheck();
    },
    checkDraft:function () {
      this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStatus'] = 0; // 保存为草稿
      this.isClickWhich = 0;
      this.isCheck();
    },
    isCheck: function () { // 父组件点击提交检验数据
      this.commitDraft.draftFormData["tbQyHomeworkPO.title"] =  this.add_nav.title;
      this.commitDraft.draftFormData["tbQyHomeworkPO.content"] = this.add_nav.content;
      if(this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkType']==""){
        _.alert('i18n.notice','i18n.selectType');
        return;
      } else if(this.commitDraft.draftFormData["tbQyHomeworkPO.title"]==""){
        _.alert('i18n.notice','i18n.fillInTitle');
        return;
      } else if(this.commitDraft.draftFormData["tbQyHomeworkPO.content"]==""){
        _.alert('i18n.notice','i18n.fillInContent');
        return;
      }
      if(this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStart'] == ''){
        this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStart'] = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStop'] = timeUtil.changeFormat(new Date(), 'yyyy-MM-dd') + ' 22:00:00'
      }
      if(this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStart'] >= this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStop']) {
        _.alert('i18n.notice', 'i18n.endBeyondStart');
        return;
      } else if(this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStop'] <= timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')) {
        _.alert('i18n.notice', 'i18n.endBeyondNow');
        return;
      }
      this.update();
    },
    selectPerson(el,obj){
      if(el=="toPersonList"){
        this.commitDraft.draftFormData['toUserIds'] = obj.user.idStr;
        this.commitDraft.draftFormData['toDeptIds'] = obj.dept.idStr;
      }
      if(el=="ccPersonList"){
        this.commitDraft.draftFormData['ccUserIds'] = obj.user.idStr;
        this.commitDraft.draftFormData['ccDeptIds'] = obj.dept.idStr;
      }
    },
    update:function () {
      var self = this;
      _.showLoading("i18n.submitting");
      _.ajax({
        url: _.baseURL + self.addOrUpdateUrl,
        type: 'POST',
        data: self.commitDraft.draftFormData,
        dataType: 'json',
        success: function (result) {
          _.hideLoading();
          if(result.code=="0"){
            _.tooltips_succeed("i18n.operationSuccess");
            setTimeout(()=>{
              if(self.isClickWhich == 1){
                self.homeFooterList.nav_on = 0;
                self.$router.push({path:'/'})
              } else {
                self.$router.push({path:'/draft'})
              }
            },1000)
          }else{
            _.alert('i18n.notice',result.desc);
          }
        }
      })
    }
  },
  components:{
    data_detail,
    img_detail,
    file_detail,
    time_detail,
    related_person_detail,
    advanced_setting,
    flow_button,user_select
  },
}
</script>
