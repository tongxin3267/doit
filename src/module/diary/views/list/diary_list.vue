<template>
  <div class="qwui-check_header" :class="{'active':pageData&&pageData.length==0}">
    <div class="qwui-tips" v-show="tipShow">
      该日志由富文本生成，仅支持PC端富文本模式下汇总
    </div>
    <ul class="diaryList">
      <transition-group :name="footernav!='3'?'fade':(tab==0?'listLeft':'listRight')" tag="p" mode="out-in">
      <li v-for="(item,index) in pageData" class="qwui-check_box_list" v-bind:key="index">
        <!-- check框 开始-->
        <div class="qwui-list_check_box" v-if="useCheck">
          <label :for="item.diaryId" class="qwui-check_box" :class="{'active':ueditorCheck && item.isUEditor == 1}" @click="toDetail('',item.isUEditor)">
            <input type="checkbox"  v-model="checkList" :value="item.diaryId" :id="item.diaryId" :disabled="ueditorCheck && item.isUEditor == 1">
            <span ></span>
          </label>
        </div>
        <!-- check框 结束-->
        <div class="qwui-list_item" :class="{active:homePage==0 && !useCheck}">
          <div class="qwui-list_item_content" :class="{active:homePage!=0}" @click="toDetail(item.diaryId, item.isUEditor)">
            <img class="qwui-list_remarks_headpic" :src="item.headPic == '0'?defaultHeadPic:item.headPic"v-if="homePage!=0"/>
            <p class="qwui-list_item_title" :class="{'active':ueditorCheck && item.isUEditor == 1}">{{item.title}}</p>
            <p class="qwui-list_remarks qwui-list_remarks_time" :class="{active:homePage==0 && !useCheck}">
              <span class="qwui-list_apply_status" v-if="item.createTime">{{getFormatTime(item.createTime)}}</span>
            </p>
            <p class="qwui-list_remarks" v-if="homePage==0">
              <span class="qwui-list_content" >{{checkURL(item.content)}}</span>
            </p>
            <p class="qwui-list_remarks" v-else>
              <span class="qwui-list_user_name">{{item.personName}}</span>
            </p>
          </div>
        </div>
        <div class="qwui-list_menu" @click="showOperate(item, index)" v-if="homePage==0 && !useCheck"></div>
      </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import * as timeUtil from '../../../../assets/js/time-util';

  export default {
  name: 'diaryList',
  props:['listdata',"loadmore", 'footernav', 'useCheck', 'ueditorCheck', 'tab'],
  data(){
    return {
      buttonConfig: {
        primaryBtn:{name:"确定", callBack:null},
        defaultBtn:{name:"取消", callBack:null},
      },
      operateDiary:{
        creator:"",//创建者
        id: '',//diaryId
        index: '',//要操作的数据的位置
      },
      checkList:[],
      isUEditor:'',
      isPC:_.isWeChat() && !_.isWeChatApp(),//true表示pc端才可以使用
      tipShow:false,
      defaultHeadPic: require('../../../../assets/images/touxiang02.png')//没有头像时的默认头像
    }
  },
  computed:{
    pageData(){
      if(this.loadmore.padeConfig.pageData){
        return this.loadmore.padeConfig.pageData;
      }
    },
    diaryStatus(){
      if(this.footernav == 0){
        return '0'
      } else if (this.footernav == 1){
        return '2'
      } else{
        return this.loadmore.data.status
      }
    },
    diaryKeyword(){
      if(this.loadmore.data.keyWord){
        return this.loadmore.data.keyWord;
      }
    },
    homePage(){
      if(this.footernav){
        return this.footernav;
      }
      return false;
    }
  },
  watch:{
    checkList:function (val) {
      this.$emit("listenToDiaryList", val);
    }
  },
  methods:{
    toDetail:function (id, check) {//跳转到详情
      if(this.ueditorCheck && check == '1'){
        this.tipShow = true;
        var self = this;
        setTimeout(function () {
          self.tipShow = false;
        },2000);
        return
      } else if(id != '') {
        this.$router.push({
          path: '/detail',
          query: {diaryId: id, status: this.diaryStatus, keyWord: this.diaryKeyword}
        })
      }
    },
    checkURL(obj){
      return _.checkHtmlURL(obj);
    },
    showOperate:function (item, index) { // 点击操作的日志 ,底部弹框对应的操作
      this.operateDiary.creator = item.creator;
      this.operateDiary.id = item.diaryId;
      this.operateDiary.index = index;
      this.isUEditor = item.isUEditor;
      var btnConfig = [
        {title: "复制", callBack: this.copyThis},
        {title: "编辑", callBack: this.resubmit},
        {title: "删除", callBack: this.delThis, primary: true},
        {title: "取消", callBack: null}
      ];
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
          {title:"取消", callBack:null}
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
      if(this.isUEditor == '1' && !(_.isWeChat() && !_.isWeChatApp())) {
        _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
      } else {
        this.$router.push({
          path: '/add',
          query: {diaryId: this.operateDiary.id, isCopy: true, status: 1}
        })
      }
    },

    resubmit:function () {
      this.closeBottomMsg();
      if(this.isUEditor == '1' && !(_.isWeChat() && !_.isWeChatApp())) {
        _.alert('提示', '内容由富文本编辑器生成，请在PC端修改')
      } else {
        this.$router.push({
          path: '/add',
          query: {diaryId: this.operateDiary.id, status: 1}
        })
      }
    },
    delThis:function () {
      this.closeBottomMsg();

      var buttonConfig = {
        primaryBtn:{name:"确定", callBack:this.doDel},
        defaultBtn:{name:"取消", callBack:null},
      };
      _.alert('提示',"确定删除吗？",buttonConfig)
    },

    //删除列表
    doDel:function () {
      var self = this;
      _.showMsgHide();
      self.listdata.delete.data['ids'] = self.operateDiary.id;
      _.ajax({
        url:_.baseURL + self.listdata.delete.checkUrl,
        type:"post",
        data:self.listdata.delete.data,
        success:function(result) {
          self.listdata.dialogListConfig.show = false;
          if(result.code=="0"){
            if(result.data.haveComment){
              _.alert('提示', '标题为【'+result.data.comments[0]+'】已被评论，不可以删除');
            }else {
              _.ajax({
                url:_.baseURL + self.listdata.delete.url,
                type: "post",
                data: self.listdata.delete.data,
                success: function (result) {
                  if (result.code == "0") {
                    self.loadmore.padeConfig.pageData.splice(self.operateDiary.index, 1);
                    self.loadmore.padeConfig.totalRows -= 1;
                    _.tooltips_succeed('删除成功', true);
                  }else{
                    _.alert('提示',result.desc);
                  }
                }
              })
            }
          }else{
            _.alert('提示',result.desc);
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
    getFormatTime:function(time){
        return _.getFormatTime(time)
    }
  },
}

</script>

<style type="text/css">
  .listRight-enter-active,.listRight-leave-active {
    transition: transform .2s ease-in-out;
    transform:translateX(0) scale(1);
  }
  .listRight-enter,.listLeft-leave-to{
    transform: translateX(100%) scale(1);
  }
  .listLeft-enter-active, .listLeft-leave-active {
    transition: transform .2s ease-in-out;
    transform:translateX(0) scale(1);
  }
  .listLeft-enter, .listRight-leave-to {
    transform: translateX(-100%) scale(1);
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .qwui-top_head_list{
    padding-top: 44px;
  }
  .qwui-tips{
    z-index:10;
    position: fixed;
    top:0;
    width:100%;
    height: 31px;
    padding-top: 6px;
    background: #E1E3EA;
    text-align: center;
    color: #818690;
    font-size: 14px;
  }
.diaryList .qwui-list_item{
  position: relative;
  font-size: 16px;
  line-height: 2.2;
  padding-right: 65px;
  background-color:#fff;
  overflow: hidden;
}
.diaryList .qwui-list_item.active{
  padding-right: 95px;
}
.diaryList .qwui-list_item a{
  display: block;
}
.diaryList .qwui-list_item_content{
  padding: 15px;
  line-height: 1.4;
  overflow: hidden;
  cursor: pointer;
}
.diaryList .qwui-list_remarks{
  display: flex;
  font-size: 13px;
  color: #999;
  overflow: hidden;
}
.qwui-list_remarks .qwui-list_user_name{
  flex: 1;
  vertical-align: middle;
  line-height: 15px;
}
.qwui-list_remarks .qwui-list_content{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.qwui-list_remarks_time{
  position: absolute;
  right: 10px;
  top: 18px;
}
.qwui-list_remarks_time.active{
  right:45px
}
.diaryList .qwui-list_remarks_headpic{
  position:absolute;
  left:0;
  top:16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  vertical-align: sub;
  background: #ddd;
  overflow: hidden;
}
.diaryList .qwui-list_menu{
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
.diaryList .qwui-list_apply_status{
  display: inline-block;
  position: relative;
  left:0;
  line-height: 1;
  font-size: 12px;
  text-align: center;
}
.diaryList .qwui-status_blue{
  border: 1px solid #458be9;
  color: #458be9;
}
.diaryList .qwui-list_item_Important{
  color: #FF3333;
  margin-right: 5px
}
  .qwui-check_header{
    position: relative;
    background: #fff;
  }
  .qwui-check_header.active:after{
    border:none
  }
  .qwui-check_box_list{
    display: flex;
    position: relative;
    margin-left: 15px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .qwui-check_header .qwui-list_item{
    flex:1;
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    background-color:#fff;
    overflow: hidden;
  }
  .qwui-check_header:after, .qwui-check_box_list:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-check_box_list:last-child:after{border: none;}
  .qwui-check_header .qwui-list_item_content{
    padding: 15px 15px 15px 0;
    overflow: hidden;
  }
  .qwui-check_header .qwui-list_item_content.active{
    padding-left:50px
  }
  .qwui-check_header .qwui-list_item_title{
    display: block;
    margin-bottom: 10px;
    line-height: 20px;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-check_header .qwui-list_item_title.active{
    color:#999;
  }
  .qwui-check_header .qwui-list_remarks{
    font-size: 13px;
    color: #999;
    line-height: 14px;
    overflow: hidden;
  }
  .qwui-list_check_box{
    position: relative;
    left: 0;
    bottom: 0;
    width: 30px;
  }
  .qwui-list_check_box input{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    visibility: hidden;
  }
  .qwui-list_check_box span{
    position:absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width:15px;
    height:15px;
    margin: auto;
    border:1px solid #cacaca;
    border-radius:4px;
    background:#fff;
  }
  .qwui-check_box{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 2;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .qwui-check_box.active input + span{
    background-color: #eee;
  }
  .qwui-check_box input:checked + span{
    background-color: #2f7dcd;
    border:1px solid #2f7dcd;
  }

  .qwui-check_box input:checked + span:after{
    content: '';
    width: 10px;
    height: 4px;
    position: absolute;
    top: 3px;
    left: 2px;
    border: 2px solid white;
    border-top: none;
    border-right: none;
    border-radius: 1px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
</style>
