
<template>
  <div class="qwui-dialog_overlay" v-show="dialogconfig.show" @touchmove.prevent>
    <div class="qwui-mask z-index_top" v-if="dialogconfig.type=='dialog1'"></div>
    <!--弹窗类型1-->
    <div class="qwui-dialog z-index_top" v-if="dialogconfig.type=='dialog1'">
      <!--普通弹窗标题-->
      <div class="qwui-dialog_header" v-if="dialogconfig.title">
        <strong class="qwui-dialog_title">{{$t(dialogconfig.title)}}</strong>
      </div>
      <div class="qwui-dialog_content" :class="{active:!dialogconfig.title}" v-html="$t(dialogconfig.content)"></div>
      <div class="qwui-dialog_footer">
        <a href="javascript:;" v-show="dialogconfig.btnConfig.defaultBtn.name!=''" class="qwui-dialog_btn qwui-dialog_btn_default" @click="dialogBtnClickTypeOne(dialogconfig.btnConfig.defaultBtn)">
          {{$t(dialogconfig.btnConfig.defaultBtn.name)}}</a>
        <a href="javascript:;" v-show="dialogconfig.btnConfig.primaryBtn.name!=''" class="qwui-dialog_btn qwui-dialog_btn_primary"  @click="dialogBtnClickTypeOne(dialogconfig.btnConfig.primaryBtn)">
          {{$t(dialogconfig.btnConfig.primaryBtn.name)}}</a>
      </div>
    </div>
    <div class="qwui-mask" v-if="dialogconfig.type=='dialog2'"></div>
    <!--弹窗类型2-->
    <div class="qwui-dialog" v-if="dialogconfig.type=='dialog2'">
      <div class="qwui-dialog_header" v-if="dialogconfig.title">
        <strong class="qwui-dialog_title">{{$t(dialogconfig.title)}}</strong>
      </div>
      <!--可编辑弹窗提示内容-->
      <div class="qwui-dialog_content_box" v-for="(obj,index) in dialogconfig.content">
        <!--进度列表-->
        <div class="qwui-dialog_rate" v-if="obj.type=='rateType'">
          <div class="qwui-dialog_rate_text" v-show="item.time && item.rateValue" v-for="(item,i) in obj.rateList">
            <div class="qwui-dialog_rate_time">
              <span>{{$t(item.time.substring(0,16))}}</span>
              <span class="qwui-dialog_rate_pracent">{{$t('i18n.finish')}}{{$t(item.rateValue)}}%</span>
            </div>
            <p v-show="item.text && item.text!=''">{{$t(item.text)}}</p>
          </div>
          <div class="qwui-dialog_noRate" v-show="obj.rateList.length==0">{{$t('i18n.noProgress')}}</div>
        </div>
        <!--拖动进度-->
        <div class="qwui-dialog_slider_box" v-if="obj.type=='updateRateType'">
            <cell :inline-desc="rateValueList[index].value+'%'" primary="content">
              <range v-model="rateValueList[index].value" :step="10" @on-change="setRateValue(index)"></range>
            </cell>
        </div>
        <!--单选-->
        <div class="qwui-dialog_radio_box" v-if="obj.type=='radioType'">
          <div class="qwui-radio_box_title" v-show="obj.radioType.title">{{$t(obj.radioType.title)}}</div>
          <div class="qwui-radio_box">
            <label class="qwui-radio_item" v-for="item in obj.radioType.list" @click.prevent.stop="selectRaidoClick(item.value,index)">
              <input v-model="radioValueList[index].value" :value="item.value" type="radio" class="qwui-check_btn"/><span>{{$t(item.text)}}</span>
            </label>
          </div>
        </div>

        <!--时间-->
        <div v-if="obj.type=='dateTime'">
          <div class="qwui-dialog_secondary_title" v-show="obj.dateTime.title">
            <span class="qwui-dialog_secondary_title_span">{{$t(dialogconfig.title)}}</span>
          </div>
          <div class="qwui-dialog_secondary_content">
            <datetime v-model="dateValueList[index].value" @on-change="onChangeTime(index)"  format="YYYY-MM-DD HH:mm" year-row="{value}年"
                      month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')"></datetime>
          </div>
        </div>
        <!--选人-->
        <user_add v-if="obj.type=='relative'" :userselect="dataBase.selectConfig" @selectPerson="selectPerson"></user_add>

        <!--评分-->
        <div class="qwui-score_box" v-if="obj.type=='scoreType'">
          <div class="qwui-score_box_title">{{obj.scoreType.title}}</div>
          <div class="qwui-score_box_select">
            <span class="qwui-score_star" :class="{actived:start>scoreValueList[index].starIndex,'start':Number(obj.scoreType.num)<=7 && Number(obj.scoreType.num)>=3}"  v-for="(n,start) in Number(obj.scoreType.num)>0? Number(obj.scoreType.num):10" @click="scoreIconClick(obj.scoreType.num,obj.scoreType.score,index,start)"></span>
          </div>
        </div>

        <!--评语-->
          <div class="qwui-dialog_textarea" v-if="obj.type=='comment'"  :class="{'active':obj.error && obj.error!=''}">
              <textarea cols="30" rows="2" v-model="commentValueList[index].value" ref="input" @input="updateValue($event,index)" :placeholder="obj.comment.placeholder? $t(obj.comment.placeholder):$t('i18n.noMoreThan')" :maxlength="maxLengthList[index]"></textarea>
              <p class="qwui-dialog_textarea_counter">{{maxLengthList[index]-messageNumList[index]}}/{{maxLengthList[index]}}</p>
          </div>
        <!--错误提示、每个列表有一个错误标签提示-->
        <p v-if="errorTipList[index] && errorTipList[index]!=''" class="qwui-dialog_textarea_tips">{{$t(errorTipList[index])}}</p>
      </div>
      <!--按钮-->
      <div class="qwui-dialog_footer" v-if="dialogconfig.btnConfig">
        <a class="qwui-dialog_btn qwui-dialog_btn_default" @click="dialogBtnClickTypeTwo(dialogconfig.btnConfig.defaultBtn)" v-if="dialogconfig.btnConfig.defaultBtn">
          {{$t(dialogconfig.btnConfig.defaultBtn.name)}}</a>
        <a class="qwui-dialog_btn qwui-dialog_btn_primary"  @click="dialogBtnClickTypeTwo(dialogconfig.btnConfig.primaryBtn)">
          {{$t(dialogconfig.btnConfig.primaryBtn.name)}}</a>
      </div>
    </div>
  </div>
</template>
<script>
  import Datetime from 'vux/src/components/datetime';
  import Range from 'vux/src/components/range';
  import Cell from 'vux/src/components/cell';
  import user_add from '@/components/add/user_select_build';
  export default{
    name: "dialogMask",
    data(){
      return {
        dataBase:dataBase,//选人
        dialogconfig:dataBase.dialogConfig,
        messageNumList:[],//评论剩余字数列表
        commentValueList:[],//评语值
        maxLengthList:[],//评论框长度列表
        radioValueList:[],//单选项列表的值
        rateValueList:[],//进度
        scoreValueList:[], //评分
        dateValueList:[],//时间
        errorTipList:[],
        userId:"",//选择的人员id
        hasComment:false,//是否有评论
      }
    },
    watch:{
      "dialogconfig.show":function (val) {
        if(val){
          document.getElementsByTagName("body")[0].style.cssText = "overflow-y: hidden;";
          document.body.style.cssText = "overflow-y: hidden;";
        }
        if(val && this.dialogconfig.type=="dialog2"){
          this.maskType();//计算显示弹窗内容
        }else{
          document.getElementsByTagName("body")[0].style.cssText = "";
          document.body.style.cssText = "";
          this.clearMask();//初始化数据
        }
        document.body.scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        window.scroll(0, document.documentElement.scrollTop||document.body.scrollTop);
      }
    },
    methods:{
      //确定选择的人员放回的数据
      selectPerson(el,obj){
        if(obj && obj.user){
          this.userId=obj.user.idStr.replace(/\|/g,",");
        }
      },
      clearMask(){
        this.messageNumList=[];//剩余字数
        this.commentValueList=[];//输入框值
        this.maxLengthList=[];//限制最长
        this.radioValueList=[];//单选项
        this.rateValueList=[];//进度
        this.scoreValueList=[]; //评分
        this.dateValueList=[];//时间
        this.errorTipList=[];
        this.hasComment=false;
        this.userId="";
      },
      // 显示进度标题
      maskType:function (){
        if(Object.prototype.toString.call(this.dialogconfig.content) === "[object Array]"){
          for(var i=0;i<this.dialogconfig.content.length;i++){

            // <!-- 比例拖动列表 -->
            if(this.dialogconfig.content[i].type=="updateRateType" && this.dialogconfig.content[i].updateRateType){
              this.countRateValue(i);
            }

            // <!-- 单选项列表 -->
            if(this.dialogconfig.content[i].type=="radioType" && this.dialogconfig.content[i].radioType){
                this.countRadioValue(i);
            }
            //评分列表
            if(this.dialogconfig.content[i].type=="scoreType"){
              this.countScoreValue(i);
            }

            // <!-- 输入框内容列表 -->
            if(this.dialogconfig.content[i].type=="comment" && this.dialogconfig.content[i].comment){
              this.hasComment=true;
              this.countCommentValue(i);
            }

            // <!-- 选择时间列表 -->
            if(this.dialogconfig.content[i].type=="dateTime" && this.dialogconfig.content[i].dateTime){
              this.countDateTime(i);
            }
          }
        }
      },
      //计算单选项列表值,默认第一位
      countRadioValue(index){
        if(Object.prototype.toString.call(this.dialogconfig.content[index].radioType.list) === "[object Array]"){

          var name=this.dialogconfig.content[index].radioType.name;
          this.radioValueList[index]={};
          this.radioValueList[index].name=name? name:"radio";

          if(this.dialogconfig.content[index].radioType.list[0].value || this.dialogconfig.content[index].radioType.list[0].value===0){
            this.radioValueList[index].value=this.dialogconfig.content[index].radioType.list[0].value;
          }else{
            this.radioValueList[index].value="";
          }
        }
      },
      //单选框列表点击选择
      selectRaidoClick(value,index){
        var name=this.radioValueList[index].name;
        if(value && name){
          this.radioValueList.splice(index,1,{name:name,value:value});
        }
        this.deleteErrorTip(index);//删除错误提示
      },
      // 计算拖动进度值
      countRateValue(index){
        var name=this.dialogconfig.content[index].updateRateType.name;
        this.rateValueList[index]={};
        this.rateValueList[index].name=name? name:"updateValue";

        if(this.dialogconfig.content[index].updateRateType.rateValue || this.dialogconfig.content[index].updateRateType.rateValue===0){
          this.rateValueList[index].value =this.dialogconfig.content[index].updateRateType.rateValue;
        }else{
          this.rateValueList[index].value =0;
        }
      },
      //更新拖动进度值
      setRateValue:function (index) {
        var name=this.rateValueList[index].name;
        var value=this.rateValueList[index].value;
        if(!isNaN(value) && name){
          this.rateValueList.splice(index,1,{name:name,value:value});
        }
      },
      //计算评分列表值
      countScoreValue(index){
        if(Object.prototype.toString.call(this.dialogconfig.content[index].scoreType) === "[object Object]"){

          var name=this.dialogconfig.content[index].scoreType.name;
          var num=Number(this.dialogconfig.content[index].scoreType.num);
          var score=Number(this.dialogconfig.content[index].scoreType.score);

          this.scoreValueList[index]={};
          this.scoreValueList[index].name=name? name:"score";
          if(!isNaN(num) && !isNaN(score)){
            this.scoreValueList[index].starIndex=(num>0 && num<=10)? num:10;
            this.scoreValueList[index].value=(num>0 && num<=10 && score>0 && score<=10)? num*score:10;
          }else{
            this.scoreValueList[index].starIndex=10;
            this.scoreValueList[index].value=10;
          }
        }
      },
      //评分选择处理
      scoreIconClick(num,score,index,start){
        var val=start+1;
        var num=Number(num);
        var score=Number(score);
        var name=this.scoreValueList[index].name;
        if(num>0 && num<=10 && score>0 && score<=10){
          this.scoreValueList.splice(index,1,{name:name,starIndex:start,value:val*score});
        }else{
          this.scoreValueList.splice(index,1,{name:name,starIndex:start,value:1*val});
          this.scoreValueList[index].value=1*val;
        }
        this.deleteErrorTip(index);//删除错误提示
      },

      //日期时间选择
      countDateTime(index){
        if(Object.prototype.toString.call(this.dialogconfig.content[index].dateTime) === "[object Object]"){
          var name=this.dialogconfig.content[index].dateTime.name;
          var value=this.dialogconfig.content[index].dateTime.value;
          this.dateValueList[index]={};
          this.dateValueList[index].name=name? name:"dateTime";
          if(value){
            this.dateValueList.splice(index,1,{value:value.substring(0,16)});
          }else{
            this.dateValueList.splice(index,1,{value:_.getCurrentTime()});
          }
        }
      },
      //监听时间变化后，删除错误提示
      onChangeTime(index){
        this.deleteErrorTip(index);//删除错误提示
      },
      //计算评论框值
      countCommentValue(index){
        if(this.dialogconfig.content[index].comment.maxLength){
          this.maxLengthList[index]=Number(this.dialogconfig.content[index].comment.maxLength);
        }else{
          this.maxLengthList[index]=100;
        }
        //统计name\value
        var name=this.dialogconfig.content[index].comment.name;
        this.commentValueList[index]={};
        this.commentValueList[index].name=name? name:"comment";

        if(this.dialogconfig.content[index].comment.value || this.dialogconfig.content[index].comment.value===0){
          this.commentValueList[index].value=this.$t(this.dialogconfig.content[index].comment.value);
          if(this.maxLengthList[index]-this.dialogconfig.content[index].comment.value.length>=0){
            this.messageNumList[index]=this.maxLengthList[index]-this.dialogconfig.content[index].comment.value.length;
          }else{
            this.messageNumList[index]=this.maxLengthList[index];
          }
        }else{
          this.commentValueList[index].value="";
          this.messageNumList[index]=this.maxLengthList[index];
        }
      },
      //显示错误提示
      showErrorTip(){
        for(var i=0;i<this.dialogconfig.content.length;i++){
          this.errorTipList[i]=null;
          if(this.dialogconfig.content[i]){
            var text=this.dialogconfig.content[i].error;
            text? this.errorTipList.splice(i,1,text):this.errorTipList.splice(i,1,null);
          }
        }
      },
      //删除错误提示
      deleteErrorTip(index){
        //删除错误提示
        if(this.errorTipList[index]){
          this.errorTipList.splice(index,1,null);
        }
      },
      //类型一的弹窗点击
      dialogBtnClickTypeOne:function (msg) {
        if(!msg){
          _.showMsgHide();
          return;
        }
        if(msg.callBack) {
          msg.data? msg.callBack(msg.data):msg.callBack();
        }
        _.showMsgHide();
      },
      //类型二的弹窗点击
      dialogBtnClickTypeTwo:function (msg) {
        if(!msg){
          _.showMsgHide();
          return;
        }

        if(msg.callBack){
          //处理无效数据后得出的的内容值数组
          var newCommentValueList=[];
          var comment="";
          var hasUserSelect=false;
          if(this.dialogconfig.type=="dialog2"){

            for(var i=0;i<this.dialogconfig.content.length;i++){
              //清空错误信息
              if(this.dialogconfig.content[i]){
                this.dialogconfig.content[i].error="";
                if(!hasUserSelect && this.dialogconfig.content[i].type=="relative"){
                  hasUserSelect=true;
                }
              }
              if(this.commentValueList[i]){
                newCommentValueList.push(this.commentValueList[i]);
              }
              if(this.rateValueList[i]){
                newCommentValueList.push(this.rateValueList[i]);
              }
              if(this.radioValueList[i]){
                newCommentValueList.push(this.radioValueList[i]);
              }
              if(this.scoreValueList[i]){
                newCommentValueList.push(this.scoreValueList[i]);
              }
              if(this.dateValueList[i]){
                newCommentValueList.push(this.dateValueList[i]);
              }
            }
            if(hasUserSelect){
              newCommentValueList.splice(0,0,{name:this.dataBase.selectConfig.selectList[this.dataBase.selectConfig.signIndex].userName,value:this.userId});
              this.userId="";
            }
            comment=newCommentValueList.length>0? newCommentValueList:"";
          }

          msg.callBack(comment);
          //是否可以自动关闭弹窗
          if(this.dialogconfig.canClose){
            _.showMsgHide();
          }else{
            this.showErrorTip();
            this.dialogconfig.canClose=true;//回调后配置可关闭\除非又出现提示错误
          }
        }else{
          _.showMsgHide();
        }
      },
      //自定义textarea控件
      updateValue:function ($el,index) {
        var value=$el.target.value;
//        计算剩余字数
        if((this.maxLengthList[index]-value.length)<=0){
          this.messageNumList.splice(index,1,this.maxLengthList[index]);
          this.commentValueList[index].value=value.substring(0,this.maxLengthList[index]);
        }else{
          this.messageNumList.splice(index,1,this.maxLengthList[index]-value.length);
        }

        this.deleteErrorTip(index);//删除错误提示
//        计算占位符
        var len = 0;
        for (var i = 0; i < value.length; i++) {
          var a = value.charAt(i);
          if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
          }
          else {
            len += 1;
          }
        }
//        判断换行
        switch (true){
          case len>=64:
            $el.target.rows=3;
            break;
          case len>=32:
            $el.target.rows=2;
            break;
          default:
            $el.target.rows=1;
        }
      },
    },
    components:{
      Datetime,
      Range,
      Cell,
      user_add
    }
  }
</script>
<style scoped>
  .qwui-dialog_overlay.active{
    opacity: 1;
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
  .qwui-dialog{
    position: fixed;
    z-index: 11;
    top: 50%;
    left: 50%;
    width: 80%;
    max-width: 640px;
    max-height: 450px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 4px;
    text-align: center;
    background-color: #fff;
    overflow: hidden;
  }
  .qwui-dialog_header{
    padding: 20px 25px 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .qwui-dialog_title{
    font-size: 17px;
    color: #333;
    font-weight: 400;
    line-height: 28px;
  }
  .qwui-dialog_content,.qwui-dialog_noRate{
    min-height: 40px;
    padding: 0 20px 10px;
    font-size: 15px;
    color: #999;
    line-height: 24px;
    word-wrap: break-word;
    word-break: break-all;
  }
  .qwui-dialog_noRate{
    margin-top: 10px;
  }
  .qwui-dialog_content.active{
    padding: 40px 20px 24px;
    color:rgba(51,51,51,1);
  }
  .qwui-dialog_footer{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
    line-height: 48px;
    font-size: 18px;
  }
  .qwui-dialog_footer:after{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    color: #D5D5D6;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-dialog_btn{
    display: block;
    position: relative;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .qwui-dialog_btn_default{
    color:rgba(51,51,51,1);
  }
  .qwui-dialog_btn_default:after{
    content: " ";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    border-right: 1px solid #e5e5e5;
    color: #D5D5D6;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
  .qwui-dialog_btn_primary{
    color:rgba(70,125,185,1);
  }
  .qwui-header_title{
    position: relative;
    height: 46px;
    padding: 0 40px;
    font-size: 18px;
    color: #333;
    line-height: 46px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .qwui-icon_close{
    display: inline-block;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 40px;
  }
  .qwui-icon_close::after{
    content: "";
    display: inline-block;
    width: 13px;
    height: 13px;
    background: url(../../assets/images/CSSSprites.png) -30px 0px no-repeat;
  }
  .qwui-dialog_rate{
    max-height: 404px;
    margin:0 0 22px;
    overflow-y: scroll;
  }
  .qwui-dialog_rate_text{
    display:flex;
    position: relative;
    overflow: hidden;
    padding: 10px 15px;
    font-size: 14px;
    text-align: left;
    background-color: RGBA(255, 255, 255, 0)
  }
  .qwui-dialog_rate_text:after{
    content: " ";
    position: absolute;
    left: 2px;
    top: 16px;
    height: 8px;
    width: 8px;
    background: #BBB;
    border-radius: 8px;
  }
  .qwui-dialog_rate_text:before{
    content: " ";
    position: absolute;
    left: 5px;
    top: 25px;
    height: 20px;
    border-left: 1px solid #e5e5e5;
  }
  .qwui-dialog_rate_time:before{
    content: " ";
    position: absolute;
    left: 5px;
    top: 0;
    height: 15px;
    border-left: 1px solid #e5e5e5;
  }
  .qwui-dialog_rate_text:nth-last-child(2):before{
    border:none
  }
  .qwui-dialog_rate_text:nth-last-child(2):after{
    background: #2F7DCD;
  }
  .qwui-dialog_rate_text:first-child .qwui-dialog_rate_time:before{
    border:none
  }
  .qwui-dialog_rate_time{
    flex: 1;
    color: #666;
    line-height: 22px;
  }
  .qwui-dialog_rate_text p{
    padding-left: 10px;
    color: #999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-dialog_rate_pracent{
    float:right;
    padding-left: 15px;
    color: #333;
  }
  .qwui-dialog_slider_box{
    margin: 20px 0;
  }
  .qwui-dialog_slider{
    padding: 15px 0;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    -webkit-user-select: none;
    user-select: none;
  }
  .qwui-dialog_slider_value{
    margin-right:10px;
    width: 40px;
    color: #888;
    text-align: center;
    font-size: 14px;
  }
  .qwui-dialog_slider_inner{
    position: relative;
    height: 4px;
    border-radius: 10px;
    background-color: #E9E9E9;
  }
  .qwui-dialog_slider_progress{
    width: 0;
    height: 4px;
    border-radius: 10px;
    background-color: #2f7dcd;
  }
  .qwui-dialog_slider_handler{
    position: absolute;
    left: 0;
    top: 50%;
    width: 26px;
    height: 26px;
    margin-left: -14px;
    margin-top: -14px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
  }
  .qwui-dialog_textarea{
    position: relative;
    padding: 10px;
    margin: 10px 0 20px;
    border: 1px solid #e5e5e5;
  }
  .qwui-dialog_textarea.active{
    margin: 10px 0 6px;
  }
  .qwui-dialog_textarea textarea{
    width: 100%;
    font-size: 14px;
    color: #666;
    text-align: left;
    border: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    vertical-align: top;
  }
  .qwui-dialog_textarea_tips{
    padding-bottom: 4px;
    font-size: 12px;
    color: #FF1515;
    line-height: 18px;
    text-align: left;
  }
  .qwui-dialog_textarea_counter{
    color: #B2B2B2;
    text-align: right;
    vertical-align: top;
  }
  .qwui-dialog_content_box{
    padding: 0 10px;
  }
  .qwui-radio_box{
    display: flex;
    width: 100%;
    padding: 15px 0;
  }
  .qwui-radio_item{
    display: flex;
    flex: 1;
    padding-right: 15px;
    line-height: 23px;
  }
  .qwui-radio_item:last-child{
    padding-right: 0;
  }
  .qwui-radio_box span{
    display: inline-block;
    flex: 1;
    padding-left: 5px;
    font-size: 14px;
    color: #333;
    line-height: 22px;
    text-align: left;
  }
  .qwui-radio_box_title{
    padding-top: 15px;
    font-size: 14px;
    color: #999;
    line-height: 23px;
    text-align: left;
  }
  @media screen and (max-width: 374px) {
    .qwui-radio_box{
      display: block;
      width: 100%;
      padding: 15px 0;
    }
    .qwui-radio_item{
      margin-bottom: 10px;
    }
    .qwui-radio_item:last-child{
      margin-bottom: 0;
    }
    .qwui-score_box .qwui-score_box_select span{
     margin-right: 3px;
    }
  }
  .qwui-score_box_title{
    padding-top: 10px;
    font-size: 14px;
    color: #999;
    line-height: 22px;
    text-align: left;
  }
  .qwui-score_box_select{
    display: flex;
    position: relative;
    padding: 15px 0 11px;
    text-align: left;
  }
  .qwui-score_box_select span{
    display: inline-block;
    width:22px;
    height: 20px;
    margin-right: 5px;
    background: url(../../assets/images/icon_star_true.png) no-repeat;
    background-size: cover;
  }
  .qwui-score_box_select span.actived{
    background: url(../../assets/images/icon_star_false.png) no-repeat;
    background-size: cover;
  }
  .qwui-score_box_select span.start{
    margin-left: 10px;
  }
  .qwui-dialog_secondary_title {
    padding: 10px 25px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .qwui-dialog_secondary_title_span {
    font-size: 17px;
    color: #333;
    font-weight: 400;
    line-height: 28px;
  }

  .qwui-dialog_secondary_content {
    position: relative;
    padding: 5px;
    margin: 8px 0;
    font-size: 17px;
    line-height: 22px;
  }
  .qwui-dialog_secondary_content .weui-cell{
    padding:0;
    font-size: 14px;
    text-align: left;
  }
  .qwui-dialog_secondary_content .weui-cell_access .weui-cell__ft{
    text-align: left!important;
  }
  .qwui-dialog_secondary_content .weui-cell_access .weui-cell__ft:after{
    display: block;
  }
  .qwui-dialog_slider_box .weui-cell:before{
    content: none;
  }
  .qwui-dialog_slider_box .weui-cell{
    padding: 0;
  }
  .qwui-dialog_slider_box .vux-cell-bd{
    position: relative;
    left: 35px;
    width: 36px
  }
  .qwui-dialog_slider_box .range-min, .qwui-dialog_slider_box .range-max{
    display:none
  }
  .qwui-dialog_slider_box .range-bar{
    background-color: #B2B2B2;
    height:3px!important;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
  }
  .qwui-dialog_overlay .z-index_top{
    z-index: 13
  }
</style>
