<template>
  <div class="detailBox">
    <!--  PC端样式开始  -->
    <div>
      <div v-if="companyVO">
        <div class="topContent topContentPc">
          <p class="orgName">{{companyVO.orgName}}</p>
          <p class="tip">
            <span class="title">VIP类型</span>
            <span class="content">{{companyVO.isVIP}}<span v-if="companyVO.personMax">{{' · '+companyVO.personMax+' 人'}}</span></span>
          </p>
          <p class="tip" v-if="companyVO.vipStartTime || companyVO.vipEndTime">
            <span class="title">有效时间</span>
            <span class="content">{{companyVO.vipStartTime | noneMsg}} 至 {{companyVO.vipEndTime | noneMsg}}</span>
          </p>
          <p class="tip" v-if="companyVO.vipEndTime && (dealEndTime(companyVO.vipEndTime)>=0)">
            <span class="title">剩余时间</span>
            <span class="content">{{dealEndTime(companyVO.vipEndTime)}}天</span>
          </p>
          <p class="tip" v-if="historyVipInfo&&(historyVipInfo._getSource_desc||historyVipInfo._interfaceCode_desc)">
            <span class="title">历史购买</span>
            <span class="content">
              {{historyVipInfo._interfaceCode_desc?historyVipInfo._interfaceCode_desc:historyVipInfo._getSource_desc}}&nbsp
              {{historyVipInfo.startDay}}&nbsp至&nbsp{{historyVipInfo.endDay}}
            </span>
          </p>
          <p class="tip">
            <span class="title">CorpID</span>
            <span class="content">{{companyVO.corpId}}</span>
          </p>
        </div>
      </div>
      <div class="msgCard msgCardPc" v-if="companyVO">
        <p class="msg">
          <span class="title">接入全称</span>
          <span class="content">{{companyVO.name | noneMsg}}</span>
        </p>
        <p class="msg">
          <span class="title">联系人</span>
          <span class="content">{{companyVO.contactName | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">管理账户</span>
          <span class="content">{{companyVO.userId | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">手机号</span>
          <a class="content blue">{{companyVO.tel | noneMsg}}</a>
        </p>
        <p class="tip">
          <span class="title">邮箱</span>
          <span class="content">{{companyVO.email}}</span>
        </p>
        <p class="tip">
          <span class="title">接入时间</span>
          <span class="content">{{companyVO.regisTime | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">工商全称</span>
          <span class="content">{{companyVO.corpName | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">微信认证到期</span>
          <span class="content">{{companyVO.verifiedEndTime | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">企业规模</span>
          <span class="content">{{companyVO.staffNumber | noneMsg}}</span>
        </p>
        <p class="tip">
          <span class="title">行业信息</span>
          <span class="content">{{companyVO.industry | noneMsg}} - {{companyVO.corpSubIndustry | noneMsg}}</span>
        </p>
      </div>
      <div class="msgCard msgCardPc" v-for="(data,j) in cardData ">
        <p class="pcTitle">
          <span>{{data.pcTitle}}</span>
          <a class="clickIcon" :class="{'clickIconUp':expand[j]}" @click="clickExpand(j)"></a>
        </p>
        <div v-show="expand[j]">
          <p class="countsTitle" v-if="data.countsTitle">
            {{data.countsTitle}}
          </p>
          <div v-if="j == 1"> <!--  历史发单量  -->
            <div class="historyCountLeft" v-if="billCountInfos.length>0">
              <div class="tableTitle"><ul><li class="bgGrey">应用</li></ul></div>
              <div class="tableContent"><ul><li>发单总量</li></ul></div>
              <div class="tableContent"><ul><li class="bgGrey">日均发单量</li></ul></div>
            </div>
            <div v-if="billCountInfos.length>0" class="historyCountRight" onselectstart="return false;" >
              <div class="tableScroll" @mousedown="moveThis($event)" >
                <div class="tableTitle">
                  <ul><li v-for="item in data.countsKey" class="bgGrey">{{item}}</li></ul>
                </div>

                <div class="tableContent">
                  <ul><li v-for="i in data.billSum" :title="i">{{i | noneMsg}}</li></ul>
                </div>
                <div class="tableContent">
                  <ul><li v-for="i in data.billCount" class="bgGrey" :title="i">{{i | noneMsg}}</li></ul>
                </div>
              </div>
            </div>
          </div>
          <div class="tableScroll" @mousedown="moveThis($event)" v-else>
            <div class="tableTitle">
              <ul><li v-for="item in data.countsKey" class="bgGrey">{{item}}</li></ul>
            </div>
            <div class="tableContent" v-for="(item,index) in data.monthCounts" :class="{bgGrey: index%2 == 1}">
              <ul v-if="j == 2"> <!--  备注信息  -->
                <li v-for="(i,n,m) in item" :class="{bgGrey: index%2 == 1, blue:n.indexOf('mobile')!=-1}" v-if="m>1" :title="i">{{i | noneMsg}}</li>
              </ul>
              <ul v-else>
                <li v-for="(i,n) in item" :class="{bgGrey: index%2 == 1, blue:n.indexOf('mobile')!=-1}" :title="i">{{i | noneMsg}}</li>
              </ul>
              <i class="editIcon" v-if="data.useEdit" @click="addInfoHandle(item,index)"></i>
            </div>
          </div>
          <a class="addInfoBtn blue" @click="addInfoHandle('')" v-if="data.useEdit">+ 添加</a>
        </div>
      </div>
    </div>
    <!--  PC端样式结束  -->

    <dialog_group :title="dialogTitle"
                  :show="dialogShow"
                  @cancel="cancelDialog"
                  @confirm="confirmDialog"
                  cancelText="取消"
                  confirmText="确定">
      <div class="dialogContent">
        <div class="dialogItem">
          <span class="label">企业名</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.orgName">
        </div>
        <div class="dialogItem">
          <span class="label">联系人</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.contacts">
        </div>
        <div class="dialogItem">
          <span class="label">手机</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.mobile">
        </div>
        <div class="dialogItem">
          <span class="label">邮箱</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.email">
        </div>
        <div class="dialogItem">
          <span class="label">微信</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.weixinNum">
        </div>
        <div class="dialogItem">
          <span class="label">QQ</span>
          <input type="text" placeholder="请输入" v-model="experienceInfoPO.qqNum">
        </div>
      </div>
    </dialog_group>

    <dialog_group :show="dialogVIPInfo"
                  @confirm="showVipInfo"
                  title="用户类型"
                  confirmText="知道啦"
                  v-if="companyVO">
      <div class="dialogMsgContent">
        <p class="dialogMsgItem">
          <span class="dialogMsglabel">vip类型：</span>
          <span class="text">{{companyVO.isVIP}}</span>
        </p>
        <p class="dialogMsgItem">
          <span class="dialogMsglabel">开通时间：</span>
          <span class="text">{{companyVO.regisTime}}</span>
        </p>
        <p class="dialogMsgItem">
          <span class="dialogMsglabel">有效时间：</span>
          <span class="text">{{companyVO.vipEndTime}}</span>
        </p>
        <p class="dialogMsgItem">
          <span class="dialogMsglabel">剩余时间：</span>
          <span class="text">{{vipEndTime}}</span>
        </p>
      </div>
    </dialog_group>
  </div>
</template>

<script>
  import {getCompanyDetail,operationRemarks } from '../api/getData'
  import dialog_group from '@/components/base/dialog/dialog-group'

  export default {
    name: "enterprise-detail",
    data(){
      return {
        corpId: this.$route.query.corpId,
        companyVO: null,
        recentLoginAccount:[], //历史活跃信息
        monthCounts: [],
        billCountInfos:[],
        historyVipInfo:{}, //历史购买信息
        experienceInfos: null,
        experienceInfoPO: {
          corpId: this.$route.query.corpId,
          id: '',
        },
        dialogShow: false,
        dialogTitle:'',
        dialogVIPInfo: false,
        btnConfig:{
          primaryBtn:{name:"知道啦", callBack:null}, //主操作按钮
          defaultBtn:{name:"", callBack:null}, //次操作按钮
        },
        editIndex:null,
        isPhone:_.isAndroid()||_.isIOS(), //判断是否是手机端，true为是
        expand:{0:true,1:true,2:true,3:true},//控制 展开 收起
        cardData:[
          {
            pcTitle:'通讯录',
            countsTitle:'历史活跃信息(近6个月)',
            countsKey:['年月', '日均登录人次', '日均发单量', '月活跃天数'],
            monthCounts:[],
          },
          {
            pcTitle:'应用',
            countsTitle:'历史发单量  (近7天)',
            countsKey:[],
            billSum:[],
            billCount:[],
          },
          {
            pcTitle:'备注信息',
            countsTitle:'',
            countsKey:['联系人', '手机', '邮箱','微信', 'QQ'],
            monthCounts:[],
            useEdit:true
          },
          {
            pcTitle:'管理账户信息',
            countsTitle:'',
            countsKey:['账户名', '绑定用户', '绑定手机','通讯录手机', '通讯录邮箱', '登录帐号','最近登录'],
            monthCounts:[],
          }
        ],
      }
    },
    computed: {
      // 到期时间
      vipEndTime(){
        let endTime = this.companyVO.vipEndTime
        if(!endTime) {return}
        let Now = new Date().getTime()
        let endYear = Number(endTime.slice(0, 4));
        let endMonth = Number(endTime.slice(5, 7))-1;
        let endDay = Number(endTime.slice(8, 10));
        let duringTime = new Date(endYear,endMonth,endDay).getTime() - Now
        return Math.ceil(duringTime/(24*60*60*1000)) + ' 天'
      },
    },
    created() {
      getCompanyDetail(this.corpId, (data)=> {
        this.companyVO = data.companyVO
        this.monthCounts = data.monthCounts?data.monthCounts:this.monthCounts;
        this.billCountInfos = data.billCountInfos?data.billCountInfos:[];
        this.recentLoginAccount = data.recentLoginAccount
        this.experienceInfos = data.experienceInfos
        this.historyVipInfo = data.historyVipInfo
        this.dealData(data);
      })
      if(_.isAndroid()||_.isIOS()) {//手机端的分享链接
        this.shareLink();
      }
    },
    methods: {
      //分享链接，配文字图片
      shareLink:function () {
        _.checkApi.setDataForWeixinValue('企业信息','','['+_.personName+']分享了一条企业信息，点击查看',window.location.href);
      },
      //鼠标按住拖动
      moveThis:function (e) {
        e = e || window.event;
        var target = e.currentTarget;
        var oldClientX = e.clientX //点击时鼠标的位置
        var oldScrollLeft = e.currentTarget.scrollLeft //点击时table的相对左边位置
        document.onmousemove =function (ev) { /*注册document的mousemove事件*/
          var distance = ev.clientX-oldClientX > 0 ? ev.clientX-oldClientX:oldClientX-ev.clientX;
          if(ev.clientX-oldClientX > 0) { //向右滚动
            target.scrollLeft = oldScrollLeft-distance;
          }else{ //向左滚动
            target.scrollLeft = oldScrollLeft+distance;
          }
        };
        document.onmouseup = function () {/*鼠标放开清除事件*/
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      getPos(ev){
        let scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        let scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        return {x: ev.clientX+scrollLeft, y: ev.clientY+scrollTop};
      },
      dealData(data){ //格式化后台数据
        this.cardData[0].pcTitle = '通讯录'+data.companyVO.userSum+'人·已关注'+data.companyVO.validSum+'人',
          this.cardData[1].pcTitle = (data.companyVO.agentCount?data.companyVO.agentCount:0)+'个应用';
        var self = this;
        if(data.monthCounts&&data.monthCounts.length>0){ //历史活跃信息
          data.monthCounts.forEach(function (e) {
            self.cardData[0].monthCounts.push(
              {
                "time": e.time,
                "loginCount": e.loginCount,
                "billCount": e.billCount,
                "activeDay": e.activeDay
              }
            )
          })
        } else {
          self.cardData[0].monthCounts = [];
        }
        if(data.billCountInfos&&data.billCountInfos.length>0){ //历史发单量
          data.billCountInfos.forEach(function (e) {
            self.cardData[1].countsKey.push(e.agentName)
            self.cardData[1].billSum.push(e.billSum)
            self.cardData[1].billCount.push(e.billCount)
          })
        } else {
          self.cardData[1].monthCounts = [];
        }
        if(data.experienceInfos&&data.experienceInfos.length>0){ //备注信息
          data.experienceInfos.forEach(function (e) {
            self.cardData[2].monthCounts.push(
              {
                "id": e.id,
                "orgName": e.orgName,
                "contacts": e.contacts,
                "mobile": e.mobile,
                "email": e.email,
                "weixinNum": e.weixinNum,
                "qqNum": e.qqNum
              }
            )
          })
        } else {
          self.cardData[2].monthCounts = [];
        }
        if(data.recentLoginAccount&&data.recentLoginAccount.length>0){ //管理账户信息
          data.recentLoginAccount.forEach(function (e) {
            self.cardData[3].monthCounts.push(
              {
                "personName": e.personName,
                "qyUserName": e.qyUserName,
                "bindMobile": e.bindMobile,
                "mobile": e.mobile,
                "email": e.email,
                "userName": e.userName,
                "lastLoginTime": e.lastLoginTime
              }
            )
          })
        } else {
          self.cardData[3].monthCounts = [];
        }
      },
      clickExpand:function (j) {
        this.expand[j] = !this.expand[j]
      },
      dealEndTime(time){//剩余天数
        time = time.substring(0,10);
        var d1 = Date.parse(time)
        var d2 = (new Date()).getTime()
        return (parseInt((d1-d2)/1000/60/60/24)+1>=0)?parseInt((d1-d2)/1000/60/60/24)+1:0
      },
      showApp() {
        _.alert('已托管应用',this.companyVO.agentName,this.btnConfig)
      },
      showVipInfo() {
        this.dialogVIPInfo = !this.dialogVIPInfo
      },
      addInfoHandle(item,index) {
        this.dialogShow = !this.dialogShow
        if(!item){
          this.dialogTitle = '新增备注信息'
          this.experienceInfoPO = {
            corpId: this.$route.query.corpId,
            orgName: this.companyVO.orgName,
            id: '',
          }
        }else {
          this.dialogTitle = '编辑备注信息'
          this.editIndex = index
          Object.assign(this.experienceInfoPO,item)
          this.experienceInfoPO["corpId"]=this.$route.query.corpId;
        }
      },
      cancelDialog() {
        this.dialogShow = false
      },
      checkType:function (string,type){		//验证邮箱格式、手机格式、qq
        if(type==1 && !/(^(\d{3,4}-)?\d{7,8})$|(^1[3|4|5|8|7][0-9]\d{4,8})$/.test(string)){
          return false;
        }
        if(type==2 && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(string)){
          return false;
        }
        if(type==3 && !(/^[1-9][0-9]{4,14}$/.test(string))){
          return false;
        }
        return true;
      },
      confirmDialog() {
        if(this.experienceInfoPO.mobile && !this.checkType(this.experienceInfoPO.mobile,1)){
          _.alert("提示","请输入正确的手机号码");
          return
        }
        if(this.experienceInfoPO.email && !this.checkType(this.experienceInfoPO.email,2)){
          _.alert("提示","请输入正确的邮箱");
          return
        }
        if(this.experienceInfoPO.qqNum && !this.checkType(this.experienceInfoPO.qqNum,3)){
          _.alert("提示","请输入正确的QQ号");
          return
        }
        if(!this.experienceInfoPO.contacts&&!this.experienceInfoPO.mobile&&!this.experienceInfoPO.email
          &&!this.experienceInfoPO.weixinNum&&!this.experienceInfoPO.qqNum){
          _.alert('提示','不能全部为空')
          return
        }
        let self = this
        this.dialogShow = false
        operationRemarks(this.experienceInfoPO, function (data) {
          if(!self.experienceInfoPO.id){  // 新增没有id
            self.experienceInfos.push(data.experienceInfoPO)
            var temp = data.experienceInfoPO;
            self.cardData[2].monthCounts.push(
              {
                "id": temp.id,
                "orgName": temp.orgName,
                "contacts": temp.contacts,
                "mobile": temp.mobile,
                "email": temp.email,
                "weixinNum": temp.weixinNum,
                "qqNum": temp.qqNum
              }
            )
          }else {
            self.experienceInfos.splice(self.editIndex,1,data.experienceInfoPO)
            var temp = data.experienceInfoPO;
            self.cardData[2].monthCounts.splice(self.editIndex,1,
              {
                "id": temp.id,
                "orgName": temp.orgName,
                "contacts": temp.contacts,
                "mobile": temp.mobile,
                "email": temp.email,
                "weixinNum": temp.weixinNum,
                "qqNum": temp.qqNum
              }
            )
          }

          self.experienceInfoPO = {
            corpId: self.$route.query.corpId,
            id: '',
          }
        },function () {
          self.experienceInfoPO = {
            corpId: self.$route.query.corpId,
            id: '',
          }
        })
      }
    },
    filters:{
      noneMsg(val){
        if(!val){
          return '-'
        }
        return val
      }
    },
    components: {
      dialog_group
    }

  }
</script>

<style scoped>
  .topContent {
    padding: 15px;
    background:#5077AA;
    color: #fff;
  }
  .topContentPc{
    padding-left:34px;
  }
  .topContent .corpId {
    font-size: 15px;
    font-weight: 100;
    margin-bottom: 10px;
    color: rgba(255,255,255,0.7);
  }
  .topContent .orgName {
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 100;
  }
  .msgCard {
    margin: 15px;
    padding: 20px 15px;
    background:#fff;
    border-radius: 5px;
    box-shadow:5px 0 30px rgba(0,0,0,0.1);
  }
  .msgCardPc{
    margin-left: 20px;
  }
  .msgCard:last-child {
    margin-bottom: 30px;
  }
  .msgCard .title, .topContent .title {
    display: inline-block;
    width:85px;
  }
  .msgCard .msg {
    font-size: 13px;
    color: #333;
    padding-bottom: 2px
  }
  .msgCard .tip .title,.msgCard .countsTitle,.msgCard .tip .content{
    font-size: 13px;
    color: #999;
    padding-bottom: 2px
  }
  .topContent .tip .title,.topContent .tip .content{
    font-size: 13px;
    color:rgba(255, 255, 255, 0.6);
    padding-bottom: 2px;
  }
  .blue {
    color: #307DCD!important;
  }
  .addInfoBtn {
    display: inline-block;
    padding-top: 16px;
  }

  .dialogContent .label {
    display: inline-block;
    width: 20%;
    text-align: left;
  }
  .dialogContent .dialogItem{
    position: relative;
    display: block;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    text-align: left;
    color: #333;
  }
  .dialogContent input {
    width: 78%;
    text-align: right;
    box-sizing: border-box;
  }
  .dialogContent .dialogItem:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .dialogMsgItem {
    text-align: left;
    margin: 2px 20px;
  }
  .dialogMsglabel {
    display: inline-block;
    width: 30%;
  }
  .dialogMsgContent {
    margin-bottom: 20px;
  }
  .msgCardPc .pcTitle{
    position: relative;
    width:100%;
    padding-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #353D45;
  }
  .msgCardPc .monthCountsTitle{
    margin-bottom: 5px;
  }
  .historyCountLeft{
    float: left;
    width: 100px;
  }
  .historyCountRight{
    cursor: -webkit-grab;
  }
  .msgCardPc .tableTitle, .msgCardPc .tableContent {
    width: fit-content;
    min-width: 100%;
  }
  .msgCardPc .tableTitle, .bgGrey{
    background: #F2F2F2;
  }
  .msgCardPc .tableContent{
    position: relative;
    height:34px;
  }
  .msgCardPc .tableTitle li, .msgCardPc .tableContent li{
    display: inline-block;
    width: 90px;
    height: 18px;
    padding: 6px 40px 6px 11px;
    color: #666;
  }
  .historyCountRight li{
    padding: 6px 4px !important;
  }
  .msgCardPc .tableContent li{
    font-size: 13px;
    color: #333 !important;
    overflow-x: scroll;
  }
  .msgCardPc .tableContent li::-webkit-scrollbar{
    width:0 !important;
    height:0 !important;
  }
  .msgCardPc .tableContent li::-webkit-scrollbar-thumb{
    background: rgba(0,0,0,0.1) !important;
  }
  .clickIcon {
    position: absolute;
    top: 0;
    right: 0;
    margin: auto;
    width: 9px;
    height: 15px;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    cursor: pointer;
  }
  .clickIcon.clickIconUp{
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
  }
  .editIcon{
    position: absolute;
    width: 15px;
    height: 15px;
    right: 8px;
    top: 10px;
    vertical-align: middle;
    background: url(../../../assets/images/ic_topicfabu.png) center no-repeat;
    background-size: 15px;
    cursor: pointer;
  }
  .tableScroll{
    overflow-x: scroll;
    white-space: nowrap;
    cursor: -webkit-grab;
  }
  .tableScroll::-webkit-scrollbar{
    width:0 !important;
    height:4px !important;
  }
  .tableScroll::-webkit-scrollbar-thumb{
    background: rgba(0,0,0,0.1) !important;
  }
</style>
