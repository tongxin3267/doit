<template>
  <div class="wrap">
    <div>
      <!--是否需要补交日志-->
      <div class="qwui-diary_uncommit" v-if="needCommit.show" @click="doCommit">
        <span>你有日志未提交，点击前往补交</span>
      </div>
      <!--标题和类型-->
      <data_detail :contentMaxLength="60000" :dataDetailMsg="add_nav" agent="diary" @listenToChild="showMsgFromDataDetail" @moreFunction="doMoreFunction"
                   @content="doContentCache" ref="diaryTitle" :isUseUeditor="isUseUeditor" @changeUeditor="changeUeditor"></data_detail>
      <!--上传图片-->
      <img_detail :dataDetailMsg="add.imgUpload" @listenToChild="showMsgFromImgDetail" v-if="!isUseUeditor"></img_detail>
      <!--上传附件-->
      <file_detail :dataDetailMsg="add.fileUpload" @listenToChild="showMsgFromFileDetail"></file_detail>
      <div class="qwui-separate_bar"></div>
      <!--选人组件-->
      <user_add :userselect="dataBase.selectConfig" @selectPerson="selectPerson" @confirmPick="confirmPick"></user_add>
      <div class="qwui-padding_twenty"></div>
      <!--底部操作按钮-->
      <flow_button :buttondata="draftDetail.buttonConfig"></flow_button>
    </div>
    <!--选择人员-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>

    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogListConfig" ></dialog_mask_bottom>

  </div>
</template>

<script>
import data_detail from '../../../../components/add/add_title';
import img_detail from '../../../../components/add/add_img';
import file_detail from '../../../../components/add/add_file';
import user_add from '@/components/add/user_select_build';
import flow_button from '@/components/button/flow_button';
import user_select from '@/components/base/user_or_dept_select';
import * as timeUtil from '../../../../assets/js/time-util';
import addUpdate from '../../js/add'
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';

export default {
  data(){
    return {
      dataBase:dataBase,
      commitDraft: addUpdate.draftDetail.commitDraft,
      draftDetail: addUpdate.draftDetail,
      draftUpdate: addUpdate.add.draftUpdate,
      addDiary: addUpdate.add.addDiary,
      homeFooterList: dataBase.home.homeFooterList,//底部菜单
      summaryData:dataBase.home.summaryData,//汇总数据
      draftId: '',//对将要操作的日志id保存起来
      add: addUpdate.add, // 传入组件的详细数据
      isClickWhich: '', // 0代表保存，1代表提交
      addOrUpdateUrl: '', // 功能接口url back
      isPhoto:0,//图片是否必须
      selectListCache:{ //缓存 上次加载 的选人内容
        "toPersonList":{"userSelected": []},
        "ccPersonList":{"userSelected": []},
      },
      add_nav:{ //数据详情头部信息
        nav: '日志类型', //头部标题
        title:"",
        titlePlaceholder: '请输入日志标题',
        content:"",
        contentPlaceholder: '请输入日志内容',
        templateTypeId:"",
        templateType:[],
        isDisabled:false,
        moreFunctions:[],
        summaryContent:''
      },
      // 底部弹窗列表操作
      dialogListConfig: {
        show: false,
        title: '',
        btnConfig: []
      },
      needCommit:{ //补交日志
        show:false,
        unSubmitNum:0
      },
      temptoUser:[],
      tempccUser:[],
      isPC:_.isWeChat() && !_.isWeChatApp(),//true表示pc端才可以使用
      getUnSubmit:"/portal/diaryAction!getAllUnSubmitByPerson.action",//查询一个未提及列表id
      isUseUeditor:false,   //个人网页版,true：是
    }
  },
  watch: {
    '$route' (to, from) { //从补交页面返回
      if(to.fullPath == '/add') {
        this.resetSelectPerson();
        this.add_nav.moreFunctions = [{name: "summaryDiary"}]
        this.getDiaryType();
        this.needCommit.show = true;
        this.add_nav.isDisabled = false;
        this.add_nav.templateTypeId='';
        this.add_nav.title='';
      }
    }
  },
  created:function(){
    _.showLoading("加载中",true);
    this.resetSelectPerson();
    this.draftDetail.buttonConfig.primaryList[0].callBack=this.checkCommit;
    if(this.draftDetail.buttonConfig.defaultList.length != 0){
      this.draftDetail.buttonConfig.defaultList[0].callBack=this.checkDraft;
    }
    if(this.$route.query.diaryId){ //如果有id，说明是复制或者编辑功能
      this.draftId = this.$route.query.diaryId;
      this.loadDraftData();
      if(this.$route.query.isCopy) { // 如果是 复制 功能，url变为新增接口，否则为更新接口
        this.addOrUpdateUrl = this.addDiary.url;
        this.add.fileUpload.moduleId = '';
      } else {
        this.addOrUpdateUrl = this.draftUpdate.url;
        this.add.fileUpload.moduleId = this.$route.query.diaryId;
      }
    } else { //如果没有，就是新增，新增页面才能选择汇总日志
      this.addOrUpdateUrl = this.addDiary.url;
      var cache = JSON.parse(localStorage.getItem("diaryContentCache"))
      if(cache&&cache.userId == _.userId&&cache.agentCode=='diary'){ //新建的时候使用缓存
        this.add_nav.content = cache.content
      }
      this.add_nav.moreFunctions = [{name:"summaryDiary"}]
    }
    this.draftDetail.buttonConfig.defaultList = (this.$route.query.status=="1" && !this.$route.query.isCopy)? []
      :[{type:"default",name:'保存为草稿', callBack:this.checkDraft}];
    if(this.$route.query.fromSummary || this.$route.query.summaryIds){ //如果不是从汇总页面跳转过来，就要清除旧数据
    }else{
      this.commitDraft.draftFormData = { // 清除数据
        'tbQyDiaryPO.currentDay':'',
        'tbQyDiaryPO.diaryType': '',
        'tbQyDiaryPO.title': '',
        'tbQyDiaryPO.content': '',
        'toSelectId':0,
        'ccSelectId':0,
        'incharges':'',
        'relatives':'',
        'tbQyDiaryPO.diaryStatus': '',
        'mediaIds': '',
        'imageUrls': '',
        'tbQyDiaryPO.diaryId':'',
        'tbQyDiaryPO.creator':'',
        'tbQyDiaryPO.isUEditor':''
      };
    }
    this.getDiaryType();
    if(this.$route.query.ueditorStatus&&(this.$route.query.ueditorStatus=='true'||this.$route.query.ueditorStatus!='false')){
      this.isUseUeditor = true;
    }else{
      this.isUseUeditor = false;
    }
  },
  methods: {
    changeUeditor:function (val) {//改变是否使用富文本
      this.isUseUeditor = val
    },
    resetSelectPerson(){
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
      this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
      this.dataBase.selectConfig.selectList["toPersonList"].title="负责人";
      this.dataBase.selectConfig.selectList["ccPersonList"].title="相关人";
      this.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:true,name:"加载上次"};
      this.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:true,name:"加载上次"};
    },
    //获取日志类型
    getDiaryType:function(){
      var self = this;
      _.ajax({
        url: _.baseURL + self.add.diaryTemplate.url,
        type: 'post',
        success: function (result) {
          if(result.code=="0"){
            self.add_nav.templateType = result.data.template;
            //是否有未提交日志，只有新增页面才能点击前往补交日志
            if (_.is_vip && !self.$route.query.diaryId && result.data.unSubmitNum && result.data.unSubmitNum > 0 && self.$route.query.unCommitted != "1") {
              self.needCommit.show = true;
              self.needCommit.unSubmitNum = result.data.unSubmitNum;
            }

            if(!self.$route.query.diaryId) { //如果有id，说明是复制或者编辑功能
              //赋值默认负责人和相关人
              if (result.data.tolist && result.data.tolist.length > 0) {
                self.commitDraft.draftFormData['incharges'] = result.data.tolist.map(value=>{
                  return value.userId
                }).join(',');
                self.dataBase.selectConfig.selectList['toPersonList'].userSelected = result.data.tolist;
              }
              if (result.data.cclist && result.data.cclist.length > 0) {
                self.commitDraft.draftFormData['relatives'] = result.data.cclist.map(value=>{
                  return value.userId
                }).join(',');
                self.dataBase.selectConfig.selectList['ccPersonList'].userSelected = result.data.cclist;
              }
            }
            //是否是补交日志
            self.isUncommittedDiary();

            if(self.$route.query.summaryIds){ //加载完类型后，如果是从选择汇总的日志界面过来，则根据id生成content
              self.initSummaryDiarys(self.$route.query.summaryIds);
            }
            _.hideLoading();
          }else{
            _.alert("提示",result.desc);
          }
        },
      })
    },
    //点击补交日志
    doCommit:function () {
      if(this.needCommit.unSubmitNum==1){
        this.temptoUser = this.dataBase.selectConfig.selectList["toPersonList"].userSelected;
        this.tempccUser = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected;
        this.findSubmitList();
      }else if(this.needCommit.unSubmitNum > 1){ //前往补交页面列表
        this.$router.push({
          path: '/unCommittedList',
        })
      }
    },
    findSubmitList(){
      var self=this;
      _.ajax({
        url: _.baseURL + self.getUnSubmit,
        type: 'post',
        success: function (result) {
          if(result.data.pageDate){
            var data=result.data.pageDate;
            if(data.pageData){
              self.$router.replace({
                path: '/add',
                query: { unCommitted: '1', unSubmitNum:'1',"diaryTypeId":data.pageData[0].diaryId,
                  "personId":data.pageData[0].personId,"countDay":data.pageData[0].countDay.substring(0,10)}
              });
              self.needCommit.show=false;
              self.temptoUser.length>0?
                self.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(...self.temptoUser):"";
              self.tempccUser.length>0?
                self.dataBase.selectConfig.selectList["ccPersonList"].userSelected.push(...self.tempccUser):"";
              self.resetSelectPerson();
              //是否是补交日志
              self.isUncommittedDiary();
            }
          }
        }
      });
    },
    //判断进来本页面是否是补交日志
    isUncommittedDiary:function () {
      if(this.$route.query.unCommitted == '1'){
        var self = this;
        var flag = false;
        self.needCommit.show = false;
        self.add_nav.templateType.forEach(function (e) { //在类型数据中寻找 补交日志传来的类型id
          if(e.id == self.$route.query.diaryTypeId){
            flag = true;
            self.isPhoto=e.isPhoto;
            var day = self.$route.query.countDay.replace('-','/').replace('-','/')
            self.add_nav.title = e.title?
              e.title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(day),"yyyyMMdd")):
              _.personName+'_'+timeUtil.moreDateInfo();
            self.add_nav.content = e.content?e.content:'';
            if (e.defaultCclist && e.defaultCclist.length > 0) {
              self.commitDraft.draftFormData['relatives'] = e.defaultCclist.map(value=>{
                return value.userId
              }).join(',');
              self.dataBase.selectConfig.selectList['ccPersonList'].userSelected.push(...e.defaultCclist);
            }
            return false;
          }
        });
        if(flag == false){
          var btnConfig={
            primaryBtn:{name:"确定", callBack:this.routeBack},
            defaultBtn:{name:"", callBack:null}, //次操作按钮
          };
          _.alert("提示","无法使用该日志类型模板，请联系管理员添加进使用范围",btnConfig);
          return;
        }
        self.add_nav.templateTypeId = self.$route.query.diaryTypeId;
        self.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = self.$route.query.diaryTypeId;
        self.add_nav.isDisabled = true;
        self.commitDraft.draftFormData['tbQyDiaryPO.currentDay'] = self.$route.query.countDay.substring(0,10);
        delete self.commitDraft.draftFormData['tbQyDiaryPO.diaryId'];
        delete self.commitDraft.draftFormData['tbQyDiaryPO.creator'];
        //隐藏加载上次
        self.dataBase.selectConfig.selectList["toPersonList"].loadLast={show:false};
        self.dataBase.selectConfig.selectList["ccPersonList"].loadLast={show:false};
        //加载负责人，负责人不可以重新选择
        self.dataBase.selectConfig.selectList["toPersonList"].isOptional=false;
        if(self.commitDraft.draftFormData['incharges'].indexOf(self.$route.query.personId)==-1){
          _.ajax({
            url: _.baseURL + addUpdate.unCommitted.getToPersonUrl,
            type: 'POST',
            data: {userId: self.$route.query.personId},
            dataType: 'json',
            success: function (result) {
              if(result.code == "0") {
                if(result.data.userInfo) {
                  var isExist = false;
                  self.dataBase.selectConfig.selectList["toPersonList"].userSelected.forEach(function (e) {
                    if(e.userId == result.data.userInfo.userId){
                      isExist = true;
                      return;
                    }
                  })
                  if(!isExist) {
                    self.dataBase.selectConfig.selectList["toPersonList"].userSelected.push(result.data.userInfo);
                    self.commitDraft.draftFormData['incharges'] += ','+ self.$route.query.personId;
                  }
                }
              }
            }
          })
        }
      }
    },
    routeBack(){
      this.$router.push({path:'/'});
    },
    //头部传来，需要更多操作,新增页面才能选择汇总日志
    doMoreFunction:function (item) {
      if(item.name="summaryDiary"){
        this.summaryDiary();
      }
    },
    //根据需要汇总的日志id，生成content
    initSummaryDiarys:function (val) {
      var self = this;
      _.ajax({
        url: _.baseURL + self.summaryData.url,
        type: 'POST',
        data: {
          "ids": val
        },
        success: function (result) {
          if (result.code == "0") {
            _.hideLoading();
            var diaryList = result.data.summaryDiaryList;
            var targetStr = "";
            var isLast = "";
            for (var i = 0; i < diaryList.length; i++) {
              isLast = (i != diaryList.length - 1) ? "\r\n" : "";
              targetStr += diaryList[i].title + "\r\n" + diaryList[i].content + isLast;
            }
            if(self.isUseUeditor) { //富文本
              self.add_nav.summaryContent = targetStr;
            }else {
              self.add_nav.content = self.add_nav.content ? (self.add_nav.content + "\r\n" + targetStr) : targetStr;
            }
          } else {
            _.alert('提示', result.desc);
          }
        }
      })
    },
    summaryDiary:function () {
      var btnConfig = [
        {title: "从我提交的日志汇总", callBack: this.jumpToSubmit},
        {title: "从我负责的日志汇总", callBack: this.jumpToDue},
        {title: "取消", callBack: null}
      ];
      this.showBottomMsg('将已有的日志内容合并到当前日志', btnConfig);
    },
    //显示底部弹窗列表
    showBottomMsg:function (title, btnConfig) {
      this.dialogListConfig.title = title? title: "";
      this.dialogListConfig.btnConfig={};
      if(btnConfig){
        this.dialogListConfig.btnConfig=btnConfig;
      }else{
        this.dialogListConfig.btnConfig=[
          {title:"取消", callBack:null}
        ]
      }
      this.dialogListConfig.show = true;
    },
    jumpToSubmit:function () {//我提交的
      this.$router.push({
        path: '/summary',
        query: {status:1, isUeditor:this.isUseUeditor}
      })
    },
    jumpToDue:function () {//我负责的
      this.$router.push({
        path: '/summary',
        query: {status:3, isUeditor:this.isUseUeditor}
      })
    },
    //从编辑或者复制界面进来导入旧数据
    loadDraftData:function(){
      var self = this;
      _.ajax({
        url:_.baseURL+self.draftDetail.url + self.draftId +"&status="+self.$route.query.status,
        type:"get",
        success:function(result){
          _.hideLoading();
          if(result.code==0){
            // 将接口返回数据打包
            var obj=result.data.vo;
            self.isUseUeditor = obj.isUEditor == '1'?true:false;
            self.add_nav.title= obj.title.replace(/[0-9]{8}/, timeUtil.changeFormat(new Date(),"yyyyMMdd"));
            self.add_nav.content=obj.content;
            self.add_nav.templateTypeId=obj.diaryType;
            self.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = obj.diaryType;
            self.add.imgUpload.picList = obj.picList;
            self.add.fileUpload.mediaList = result.data.mediaList;
            self.add.fileUpload.agent = self.dataBase.wxqyh_uploadfile.agent;
            self.commitDraft.draftFormData['tbQyDiaryPO.diaryId'] = obj.diaryId;
            self.commitDraft.draftFormData['tbQyDiaryPO.creator'] = obj.creator;
            if(obj.ccPersons){
              self.commitDraft.draftFormData['relatives'] = obj.ccPersons.map(value=>{
                return value.userId
              }).join(',');
              _.historySelectPerson("ccPersonList",obj.ccPersons);
            }
            if(obj.toPersons){
              self.commitDraft.draftFormData['incharges'] = obj.toPersons.map(value=>{
                return value.userId
              }).join(',');
              _.historySelectPerson("toPersonList",obj.toPersons);
            }
          }else{
            _.alert("提示",result.desc);
          }
        }
      })
    },
    showMsgFromImgDetail:function (imgurl) {
      this.commitDraft.draftFormData['imageUrls'] = '';
      this.commitDraft.draftFormData['imageUrls'] = imgurl.join(',');
    },
    showMsgFromFileDetail:function (mediaId) {
      this.commitDraft.draftFormData['mediaIds'] = mediaId.join(',');
    },
    doContentCache:function (val) { //保存内容cache
      if(!this.$route.query.diaryId) {
        var jsonCache = {
          'content': val,
          'userId': _.userId,
          'agentCode': 'diary'
        }
        localStorage.setItem("diaryContentCache", JSON.stringify(jsonCache));
      }
    },
    //切换类型，自动设置标题、内容、负责人相关人
    showMsgFromDataDetail:function (val) {
      if(val){
        this.isPhoto = val.isPhoto?val.isPhoto:0;
        this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = val.id;
        this.commitDraft.draftFormData['tbQyDiaryPO.title'] = this.add_nav.title;
        this.commitDraft.draftFormData['tbQyDiaryPO.content'] = this.add_nav.content;

        this.commitDraft.draftFormData['relatives']="";
        this.dataBase.selectConfig.selectList['ccPersonList'].userSelected=[];
        if (val.defaultCclist && val.defaultCclist.length > 0) {
          this.commitDraft.draftFormData['relatives'] = val.defaultCclist.map(value=>{
            return value.userId
          }).join(',');
          this.dataBase.selectConfig.selectList['ccPersonList'].userSelected = val.defaultCclist;
        }
      }else{
        this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] = '';
      }
    },
    checkCommit:function () {
      this.commitDraft.draftFormData['tbQyDiaryPO.diaryStatus'] = 1; // 提交
      this.isClickWhich = 1; //返回的是一个vue对象，所以可以直接调用其方法
      this.isCheck();
    },
    checkDraft:function () {
      this.commitDraft.draftFormData['tbQyDiaryPO.diaryStatus'] = 0; // 保存为草稿
      this.isClickWhich = 0;
      this.isCheck();
    },
    isCheck: function () { // 父组件点击提交检验数据
      this.commitDraft.draftFormData["tbQyDiaryPO.isUEditor"] = this.isUseUeditor?'1':'0';
      this.commitDraft.draftFormData["tbQyDiaryPO.title"] =  this.add_nav.title;
      if(this.isUseUeditor&&this.$refs.diaryTitle.getUEContentIsOver()){
        _.alert("提示","内容输入字符超限");
        return;
      }
      this.commitDraft.draftFormData["tbQyDiaryPO.content"] = !this.isUseUeditor?
        this.add_nav.content:this.$refs.diaryTitle.getUEContent();
      if(this.commitDraft.draftFormData['tbQyDiaryPO.diaryType'] == ''){
        _.alert("提示","请选择日志类型");
        return;
      } else if(this.commitDraft.draftFormData["tbQyDiaryPO.title"] == ''){
        _.alert("提示","请填写日志标题");
        return
      } else if(this.commitDraft.draftFormData["tbQyDiaryPO.content"] == ''){
        _.alert("提示","请填写日志内容");
        return
      } else if(this.isPhoto == 1 && !this.isUseUeditor && this.commitDraft.draftFormData['imageUrls'] == ''){
        _.alert("提示","请上传图片");
        return
      }
      this.update();
    },
    //确定选择的人员返回的数据
    selectPerson(el,obj){
      if(el=="toPersonList"){
        this.commitDraft.draftFormData['incharges'] = obj.user.idStr.replace(/\|/g,",");
      }
      if(el=="ccPersonList"){
        this.commitDraft.draftFormData['relatives'] = obj.user.idStr.replace(/\|/g,",");
      }
    },

    //选人 加载上次
    confirmPick(el,isGet){
      var self = this;
      if(!isGet){
        self.dataBase.selectConfig.selectList[el].userSelected = [];
        el == "toPersonList"?self.commitDraft.draftFormData['incharges'] = '':self.commitDraft.draftFormData['relatives'] = ''
      }else if(self.selectListCache[el].userSelected.length > 0){
        self.dataBase.selectConfig.selectList[el].userSelected = self.selectListCache[el].userSelected.slice(0);
      }else {
        _.showLoading();
        _.ajax({
          url: _.baseURL + self.add.getLastPick.url,
          type: 'POST',
          data: {type: el == "toPersonList"?0:1},
          dataType: 'json',
          success: function (result) {
            if(result.code=="0"){
              self.dataBase.selectConfig.selectList[el].userSelected = result.data.ccOrTolist;
              self.selectListCache[el].userSelected = result.data.ccOrTolist.slice(0);
              if(el == "toPersonList"){//需要初始化要提交的参数
                self.commitDraft.draftFormData['incharges'] = result.data.ccOrTolist.map(value=>{
                  return value.userId
                }).join(',');
              } else{
                self.commitDraft.draftFormData['relatives'] = result.data.ccOrTolist.map(value=>{
                  return value.userId
                }).join(',');
              }
            }else{
              _.alert("提示",result.desc);
            }
            _.hideLoading();
          }
        })
      }
    },
    //新增&保存为草稿
    update:function () {
      var self = this;
      _.showLoading('提交中');
      _.ajax({
        url: _.baseURL + self.addOrUpdateUrl,
        type: 'POST',
        data: self.commitDraft.draftFormData,
        dataType: 'json',
        success: function (result) {
          if(result.code=="0"){
            localStorage.removeItem("diaryContentCache")
            localStorage.removeItem("ueditor_preference")
            if(self.isClickWhich == 1){
              self.homeFooterList.nav_on = 0;
              self.$router.push({path:'/'})
            } else {
              self.$router.push({path:'/draft'})
            }
          }else{
            _.hideLoading();
            _.alert("提示",result.desc);
          }
        }
      })
    }
  },
  components:{
    data_detail,
    img_detail,
    file_detail,
    user_add,
    flow_button,
    user_select,
    dialog_mask_bottom
  },
}

</script>
<style>
  .qwui-diary_uncommit{
    padding: 10px 0;
    color: #fff;
    font-size: 13px;
    line-height: 1.5em;
    text-align: center;
    background: #85868d;
  }
  .qwui-padding_twenty{
    position: relative;
    width: 100%;
    height: 20px;
    background-color: #f5f5f5;
  }
</style>
