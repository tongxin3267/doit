<template>
  <div class="wrap">
    <header class="qwui-public_phone">
      <search-box :searchinput="searchBar"
                  placeholder="请输入企业名称或CorpID"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </header>
    <div class="qwui-search_height"></div>

    <!--  无法拨打的客户start  -->
    <div class="qwui-uncall_link" v-if="cannotCall">
      <div class="to_uncall" @click="toUncall">
        <div class="left_word">
          <i class="phone_cannot"></i>无法拨打的客户
        </div>
        <div class="right_word">
          <span class="uncall_num">{{unableDialNum}}</span>
          <i class="clickIcon"></i>
        </div>
      </div>
    </div>
    <div class="qwui-uncall_height" v-if="cannotCall"></div>
    <!--  无法拨打的客户end  -->

    <!-- nav_tabs开始 -->
    <nav-tabs v-if="tabShow"
              :tabs="tabs"
              position="top"
              :numShow=true
              :numHeight="'num'"
              :activeIndex="indexControl"
              defaultClass="num_padding"
              @listenNavTabs="listenNavTabsBack">
      <div slot="height" style="height:10px;"></div>
    </nav-tabs>
    <div class="qwui-nav_height" v-if="tabShow"></div>
    <!-- nav_tabs结束 -->
    <refresh :load-finished="loadFinished"
             ref="refresh"
             @requestData="requestData"></refresh>

    <!--   列表样式start  -->
    <div class="searchResult"
         @touchstart="start($event)"
         @touchmove="move($event)"
         @touchend="end($event)">
      <div v-for="(item,index) in examData" :key="index" class="items">
        <div class="content_padding" @click="toDetail(item)">
          <div class="listTitle">
            <div class="listTitleMsg">
              <p>{{item.orgName | noneMsg}}</p>
            </div>
            <div class="listPhone" @click.stop.prevent="callThis(item,index)"></div>
          </div>
          <div class="listContent">
            <div class="listContentMsg">
              <p>联系信息:{{item.contactName | noneMsg}} | {{item.lastCallTime | timeRecord}}{{item.callCount | callCount}}</p>
            </div>
            <transition name="fade">
              <div class="listContentMsg">
                <p>接入时间:{{item.regisTime | noneMsg}}</p>
                <p>企业信息:{{item.staffNumber | noneMsg}} | {{item.industry | noneMsg}} - {{item.corpSubIndustry | noneMsg}}</p>
              </div>
            </transition>
            <transition name="fade">
              <div class="listContentMsg">
                <div class="explain">
                  <span>已托管:</span>
                </div>
                <div class="apps" v-if="item.agentName != ''">
                  <div class="application" v-for="i in toArray(item.agentName)" :key="i">{{i}}</div>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <!-- 按钮Start -->
        <div v-if="tabShow">
          <div class="qwui-btns">
            <div class="item" v-for="(btnItem,index) in btns" :key="index" @click="showDialog(index,item)">
              {{btnItem.text}}
            </div>
          </div>
        </div>
      <!-- 按钮end -->
      
      </div>
    </div>
    <!--  列表样式结束  -->

    <loadMore :loadmore="loadMore" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></loadMore>

    <div class="qwui-footer_height"></div>
    <div class="qwui-footer">
      <div class="item" v-for="(item,index) in footer" :key="index" :class="{'blue':index==footerIndex}" @click="clickFooter(index)">
        {{item.text}}
      </div>
    </div>

    <!--返回-->
    <flow-button :buttondata="buttonConfigBottom" v-if="!footerShow"></flow-button>
    <div class="qwui-footer_height" v-if="!footerShow"></div>

    <!--  选人  -->
    <user-select :selectconfig="dataBase.selectConfig"
                 @chooseDone="chooseDone"
                 v-if="dataBase.selectConfig.show"></user-select>
    <!-- 弹出框Start -->
    <dialog-group :title="dialogTitle"
                      :show="dialogShow"
                      @cancel="cancelDialog"
                      @confirm="confirmDialog"
                      cancelText="取消"
                      confirmText="确定">
          <slot>
            <!-- 备注信息 -->
            <div v-if="dialogContent.remarkShow" class="dialogBorder">
              <div class="dialogItem">
                <span class="label">电话:</span>
                <input type="text" placeholder="请输入" ref="phoneInput" @input="handleInput($event.target.value,'phoneInput',20)" v-model="experienceInfoPO.mobile" maxlength="20">
              </div>
              <div class="dialogItem">
                <span class="label">微信:</span>
                <input type="text" placeholder="请输入" ref="weixinInput" @input="handleInput($event.target.value,'weixinInput',100)" v-model="experienceInfoPO.weixinNum" maxlength="100">
              </div>
              <div class="remarkItem">
                <span class="label">备注:</span>
                <textarea class="areaText"  rows="4" placeholder="请输入" v-model="experienceInfoPO.remark" maxlength="500"></textarea>
              </div>
            </div>
            <!-- 分级 -->
            <div class="classification" v-if="dialogContent.classificationShow">
              <qwui-group-radio :radio="radio" @radio="radioReturn">
                <qwui-radio label="1">A级</qwui-radio>
                <qwui-radio label="2">B级</qwui-radio>
                <qwui-radio label="3">C级</qwui-radio>
                <qwui-radio label="4">未接通</qwui-radio>
              </qwui-group-radio>
            </div>
            <!-- 退回公海池 -->
            <div v-if="dialogContent.returnShow" class="returnTip">
              <p>你将退回客户到公海池</p>
            </div>
          </slot>
    </dialog-group>
    <!-- 弹出框end -->
  </div>
</template>

<script>
  import searchBox from '@/components/base/search_box'
  import loadMore from '@/components/base/load_more';
  import refresh from '../components/refresh'
  import userSelect from '@/components/base/user_or_dept_select';
  import flowButton from '@/components/button/flow_button';
  import {getCall,getRemarkInfo,remarkInfo,classify,returnCustomer} from '../api/getData'
  import navTabs from '@/components/base/nav_tabs'
  import dialogGroup from '@/components/base/dialog/dialog-group'
  import qwuiGroupRadio from '@/components/base/qwuiRadio/radio_group'
  import qwuiRadio from '@/components/base/qwuiRadio/radio'
  export default {
    name: "enterprise-list",
    data(){
      return {
        dataBase:dataBase,
        searchBar:{
          show:true,
          moreFunction:{
            show:false,
            option:[
              {name:_.personName, callback:null, placeholder:'请输入企业名称或CorpID',value:1},
              {name:'全部', callback:null, placeholder:'请输入企业名称或CorpID',value:2}
            ],
            defaultChoose:''
          }
        },
        footerIndex:0,
        footerShow:true, //底部按钮显示，当点击无法拨打的客户时隐藏(搜索框下的标题栏也隐藏)
        footer:[
          {text:"公海池(0)", index:0},
          {text:"我的(0)", index:1}
        ],
        loadMore:{//加载更多组件
          url:"/portal/publishcountPortalCtl/getExperienceInfo.do",
          pageIndexName:"page",
          data:{ //ajax入参数据
            userId:'',
            keyWord: '',
            isDial:1,
            level:"",
            flag:1
          },
          padeConfig:{
            currPage:"",
            maxPage:"",
            pageData:[],  //返回的列表数据
            totalRows:"",//数据总条数
          },
          hasRecord:{}
        },
        examData:[], //列表数据
        totalRows:{ //记录第一次进入页面时公海池的总数
          isFirstTime:false,
          num:0
        },
        unableDialNum:0, //无法拨打电话数量
        //下拉刷新使用参数
        oldClientY:0,
        markDistance:0,
        loadFinished:false,
        //底部返回
        buttonConfigBottom:{
          primaryList:[],
          defaultList:[{type:"default",name:'返回', callBack:this.backToCall}],
          class:"active"//按钮是否置底部 active :底部、"":相对定位
        },
        tabShow:false, //控制nav_tabs组件显示，也用于控制列表按钮
        cannotCall:true,//控制无法拨打显示
        tabs:[ //tab栏显示内容
          {text:"未分级",num:0},
          {text:"A级",num:0},
          {text:"B级",num:0},
          {text:"C级",num:0},
          {text:"未接通",num:0}
        ],
        btns:[ //按钮内容
          {text:"备注信息",index:0},
          {text:"客户分级",index:1},
          {text:"退回客户",index:2}
        ],
        experienceInfoPO:{ //备注信息
          corpId:"",
          mobile:"",
          weixinNum:"",
          remark:"",
          id:""
        },
        dialogTitle:"",//弹出框标题
        dialogShow:false, //弹出框显示
        dialogContent:{ //弹出框内容
          remarkShow:false,
          classificationShow:false,
          returnShow:false
        },
        radio:"1",//单选默认选项
        nowItem:{}, //存储点击的item
        indexControl:0
      }
    },
    computed: {
    },
    created:function () {
      this.userSelectInit();
    },
    methods: {
      //返回主页列表
      backToCall:function () {
        this.footerShow = true;
        this.cannotCall = true;
        this.loadMore.data.isDial = 1;
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //到无法打电话
      toUncall:function () {
        this.footerShow = false;
        this.cannotCall = false;
        this.loadMore.data.isDial = 0;
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //去到详情
      toDetail:function (val) {
        this.$router.push({
          path: '/detail',
          name: 'detail',
          query:{ corpId: val.corpId }
        })
      },
      //打电话
      callThis:function (val,index) {
        if(val.callCount > 0 && val.callUserId != _.userId){
          _.alert('提示', '该客户已被认领')
        } else {
          getCall(val.corpId, (data)=> {
            if(data == '10284056'){
              this.examData[index].lastCallTime = '无法进行拨号'
            }
          })
        }
      },
      toArray:function (val) {
        return val.split(',')
      },
      //列表数据
      showMsgFromLoadMore:function (val) {
        if(val.totalRows && !this.totalRows.isFirstTime){
          this.totalRows.num = val.totalRows;
          this.footer[0].text = "公海池("+val.totalRows+")";
          this.totalRows.isFirstTime = true;
        }
        val.unableDialNum ? this.unableDialNum = val.unableDialNum:'';
        val.myCallExperience ? (this.footer[1].text = '我的('+val.myCallExperience+')'):'';
        if(val.pageData) {
          this.examData = this.examData.concat(val.pageData);
        }
        for(let i=0;i<this.tabs.length;i++){
          this.tabs[i].num = 0;
        }
        if(val.levelList){
          for(let i=0;i<val.levelList.length;i++){
            let levelObj = (val.levelList)[i];
            this.tabs[(levelObj.customerLevel)*1].num = levelObj.levelCount
          }
        }
      },
      //选人初始化
      userSelectInit:function () {
        this.dataBase.selectConfig.selectList["toPersonList"].deptSelectedShow = false;
        this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = false;
        this.dataBase.selectConfig.selectList["toPersonList"].deptSelected = [];
        this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected = [];
        this.dataBase.selectConfig.selectList["ccPersonList"].userRestriction=1;
        this.dataBase.selectConfig.signIndex="ccPersonList";
        this.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];
      },
      //点击底部
      clickFooter:function (index) {
        this.footerIndex = index;
        if(index == 0){
          this.loadMore.data.userId = '';
          this.searchBar.moreFunction.show = false;
          this.tabShow = false;
          this.loadMore.data.level = "";
          this.loadMore.data.flag = 1;
          this.cannotCall = true;
        }else{
          this.loadMore.data.userId = _.userId;
          this.searchBar.moreFunction.show = true;
          this.searchBar.moreFunction.option[0].name = _.personName;
          this.searchBar.moreFunction.defaultChoose = '';
          this.searchBar.moreFunction.defaultChoose = _.personName;
          this.loadMore.data.level = 0;
          this.tabShow = true;
          this.loadMore.data.flag = 2;
          this.cannotCall = false;
          this.indexControl = 0;
        }
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //跳到选人
      choosePerson:function () {
        this.dataBase.selectConfig.show = true;
      },
      //选人完成，触发搜索
      chooseDone:function () {
        this.searchBar.moreFunction.option[0].name=this.dataBase.selectConfig.selectList["ccPersonList"].userSelected[0].personName;
        this.loadMore.data.userId = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected[0].userId;
        this.searchBar.moreFunction.defaultChoose = this.searchBar.moreFunction.option[0].name;
        if(this.dataBase.selectConfig.selectList["ccPersonList"].userSelected[0].userId == _.userId){
          this.tabShow = true;
          this.indexControl = 0;
          this.loadMore.data.level = "0";
        }else{
          this.loadMore.data.level = "";
          this.tabShow = false;
        }
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //移动端事件
      start:function (e) {
        e = e || window.event;
        this.oldClientY = e.targetTouches[0].clientY //触碰时手指的位置
      },
      move:function (ev) {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var self = this;
        var nowPosition = ev.changedTouches[0].clientY;
        var distance = nowPosition-self.oldClientY > 0 ? nowPosition-self.oldClientY:0;
        self.markDistance = distance;
        if(distance > 0 && scrollTop <= 0) { //向下滑动
          self.$el.querySelectorAll('.searchResult')[0].style.paddingTop = distance.toString()+'px';
        }
      },
      end:function () {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(this.markDistance > 0 && scrollTop <= 0) {
          this.loadFinished = true;
          this.$refs.refresh.requestData();
          this.$el.querySelectorAll('.searchResult')[0].style.paddingTop = '0';
        }
        this.markDistance = 0;
        this.oldClientY = 0;
      },
      //下拉刷新重新请求列表
      requestData:function () {
        var self = this;
        setTimeout(function () {
          self.examData = [];
          self.resetRequestData(self.loadMore);
          self.loadFinished = false;
        }, 1500)
      },
      //重新请求列表数据
      resetRequestData:function (msg) {
        this.loadMore.data=msg.data;
        this.loadMore.page = '';
        this.$refs.loadMoreFun.clearLoadFun();
      },
      //搜索返回关键字
      showMsgFromSearchBox(keyWord, val, isOption){
        if(val && val == 1 && isOption){
          this.choosePerson();
          return
        }
        this.loadMore.data.keyWord = keyWord;
        if(this.footerIndex == 0 || (val && val == 2)){
          this.tabShow = false;
          this.loadMore.data.userId = '';
          this.loadMore.data.level = '';
        }else{
          this.loadMore.data.userId = this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.length>0?
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected[0].userId:_.userId;
        }
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //弹出框确定事件
      confirmDialog(){
        this.dialogShow = false;
        let val = this.nowItem;
        if(this.dialogContent.remarkShow){
          this.dialogContent.remarkShow = false;
          remarkInfo(this.experienceInfoPO,(data)=>{
            this.nowItem = {};
          })
        }else if(this.dialogContent.classificationShow){
          this.dialogContent.classificationShow = false;
          classify(val.callInfoId,(this.radio)*1,()=>{
            this.nowItem = {};
            this.radio = "1";
            this.examData = [];
            this.resetRequestData(this.loadMore);
          })
        }else{
          this.dialogContent.returnShow = false;
          returnCustomer(val.corpId,()=>{
            this.nowItem = {};
            this.examData = [];
            this.resetRequestData(this.loadMore);
          })
        }
      },
      //弹出框取消事件
      cancelDialog(){
        this.dialogTitle = "";
        this.dialogShow = false;
        this.dialogContent.remarkShow = false;
        this.dialogContent.classificationShow = false;
        this.dialogContent.returnShow = false;
        this.nowItem = {};
      },
      //弹出框弹出事件
      showDialog(index,val){
        this.nowItem = val;
        if(index==0){
          this.experienceInfoPO.mobile = "";
          this.experienceInfoPO.weixinNum = "";
          this.experienceInfoPO.remark = "";
          this.experienceInfoPO.corpId = "";
          this.experienceInfoPO.id = "";
          getRemarkInfo(val.corpId,(data)=>{
            this.dialogShow = true;
            this.dialogTitle = "备注信息";
            this.dialogContent.remarkShow = true;
            this.experienceInfoPO.corpId = val.corpId;
            if(data.remarkInfo){
              this.experienceInfoPO.mobile = data.remarkInfo.mobile;
              this.experienceInfoPO.weixinNum = data.remarkInfo.weixinNum;
              this.experienceInfoPO.remark = data.remarkInfo.remark;
              this.experienceInfoPO.corpId = data.remarkInfo.corpId;
              this.experienceInfoPO.id = data.remarkInfo.id;
            }
          })
        }else if(index==1){
          this.radio = "1";
          this.dialogShow = true;
          this.dialogTitle = "客户分级";
          this.dialogContent.classificationShow = true;
        }else{
          this.dialogShow = true;
          this.dialogTitle = "退回客户";
          this.dialogContent.returnShow = true;
        }
      },
      //tabs切换
      listenNavTabsBack(index){
        this.indexControl = index
        this.loadMore.data.level = index;
        this.examData = [];
        this.resetRequestData(this.loadMore);
      },
      //单选框点击事件
      radioReturn(val){
        this.radio = val;
      },
      //输入框限制
      handleInput(value,refName,len){
        if(value.length>len){
          if(refName == "phoneInput"){
            this.experienceInfoPO.mobile=value.substring(0,len);
          }else{
            this.experienceInfoPO.weixinNum=value.substring(0,len);
          }
        }
      }
    },
    filters:{
      noneMsg(val){
        if(!val){
          return '-'
        }
        return val
      },
      timeRecord(val){
        if(!val){
          return '暂未联系'
        }
        return val.substring(0,16)
      },
      callCount(val){
        if(val == 0){
          return ''
        }
        return '(第'+val+'次)'
      }
    },
    components: {
      searchBox,
      loadMore,
      userSelect,
      refresh,
      flowButton,
      navTabs,
      dialogGroup,
      qwuiGroupRadio,
      qwuiRadio
    }
  }
</script>

<style scoped>
  .qwui-public_phone{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
  .qwui-uncall_link{
    position: absolute;
    top: 43px;
    margin: 10px 0;
    width: 100%;
  }
  .to_uncall{
    display: flex;
    position: relative;
    height: 50px;
    background: #fff;
    font-size: 16px;
    line-height: 50px;
  }
  .left_word{
    flex:1;
    color: #36404A;
    padding-left: 40px;
  }
  .phone_cannot{
    position: absolute;
    left: 15px;
    top: 15px;
    height: 19px;
    width: 19px;
    background: url(../img/ic_phone_connot.png) center no-repeat;
    background-size: 19px 19px;
  }
  .right_word{
    flex:1;
    color:#AAB0B6;
  }
  .uncall_num{
    position: absolute;
    right: 35px;
  }
  .qwui-footer{
    z-index:2;
    display: flex;
    flex:1;
    position: fixed;
    bottom: 0;
    width:100%;
    height:49px;
    background: #FAFAFA;
  }
  .qwui-footer_height{
    height: 49px;
  }
  .qwui-search_height{
    height:43px;
  }
  .qwui-uncall_height{
    height:70px;
  }
  .qwui-footer:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-footer .item:nth-child(1):after{
    content: " ";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    border-right: 1px solid #e5e5e5;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
  .qwui-footer .item{
    flex:1;
    position: relative;
    line-height:49px;
    color: #4A4A4A;
    font-size: 15px;
    text-align: center;
  }
  .searchResult {
    padding-top: 0;
  }
  .searchResult .items{
    position: relative;
    margin-bottom: 10px;
    background-color: #fff;
  }
  .resultItem {
    display: block;
    padding: 18px 0 14px;
  }
  .resultTitle {
    padding-right: 30px;
    word-wrap: break-word;
    font-size: 16px;
    color: #333;
  }
  .resultId {
    font-size: 13px;
    color: #999;
  }
  .mgBottom{
    margin: 13px 0;
  }
  .resultTip {
    font-size: 13px;
    color: #666;
  }
  .listTitleMsg{
    display: inline-block;
    width: 90%;
    margin-bottom: 3px;
    font-size: 17px;
    color: #333;
  }
  .listTitle{
    position: relative;
  }
  .listContentMsg{
    display: inline-block;
    width:100%;
    margin-top: 2px;
    font-size: 14px;
    color:#999;
  }
  .listPhone{
    position: absolute;
    right:0;
    top:0;
    height:30px;
    width:30px;
    background: url(../img/ic_phone.png) center no-repeat;
    background-size: 30px 30px;
  }
  .listContentMsg p{
    margin-bottom: 2px;
  }
  .listContentMsg .explain{
    float:left;
  }
  .listContentMsg .apps{
    display: inline-block;
    float:right;
    width: 80%;
  }
  .listContentMsg .application{
    display: inline-block;
    height:21px;
    margin: 0 5px 5px 0;
    padding: 5px;
    line-height: 21px;
    background: #EFF3F9;
    color:#6B97D0;
    font-size: 12px;
    text-align: center;
  }
  .clickIcon {
    position: absolute;
    top: 18px;
    right: 16px;
    width: 8px;
    height: 16px;
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    cursor: pointer;
  }
  .blue {
    color: #307DCD!important;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s ease;
  }
  .fade-enter, .fade-leave-to{
    transform: translateY(10px);
    opacity: 0;
  }
  @media screen and (min-width: 1024px) {
    .searchResult,.qwui-footer,.qwui-public_phone,.to_uncall,.wrap{
      width:740px!important;
    }
  }
  .qwui-nav_height{
    height:50px;
  }
  .qwui-btns{
    display: flex;
    height: 50px;
    border-top:1px solid #f1f1f1;
  }
  .qwui-btns .item{
    width: 33.3%;
    display: inline-block;
    margin:18px 0 19px;
    color: #6B97D0;
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    cursor: pointer;
  }
  .content_padding{
    padding:10px 20px;
  }
  .dialogBorder{
    border-top: 1px solid #f1f1f1;
    padding: 12px 0 18px;
  }
  .dialogItem{
    position: relative;
    display: flex;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: left;
    color: #333;
  }
  .label{
    display: inline-block;
    width: 15%;
    font-size: 14px;
    text-align: left;
    margin-left: 22px;
  }
  .dialogItem input{
    display: inline-block;
    width: 70%;
    text-align: left;
    line-height: 16px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .remarkItem{
    position: relative;
    display: flex;
    line-height: 30px;
    font-size: 14px;
    text-align: left;
    color: #333;
  }
  .remarkItem .areaText{
    width: 70%;
    border:none;
    margin-top:5px;
    resize: none;
    overflow-y: visible;
  }
  .returnTip{
    border-top:1px solid #f1f1f1;
    font-size: 15px;
    text-align: center;
    padding:20px;
  }
  .classification{
    border-top:1px solid #f1f1f1;
    text-align:left;
    padding: 10px 20px;
  }
</style>
