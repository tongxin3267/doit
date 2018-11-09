<template>
  <div>
    <div class="qwui-title_detaildata">
     <div class="qwui-title_box">
       <span class="qwui-title_item_title">{{$t(templateObj.nav)}} <span v-show="isRequired" class="qwui-required_mark">*</span></span>
       <div class="qwui-flexItem" v-if="templateObj.templateType">
         <div class="please_select_box" :class="typeErrorTip?'qwui-flexItem-err':''" v-show="!templateObj.templateTypeId">
           <span class="please_select_text">{{selectTypeTitle}}</span>
           <span class="ic_arrow"></span>
         </div>
        <select  v-model="templateObj.templateTypeId" @change="setTitle" class="qwui-title_item_select"
                 :class="{'noSelect':!templateObj.templateTypeId,'active':templateObj.isDisabled}" :disabled="templateObj.isDisabled?templateObj.isDisabled:false">
          <option value="" >{{$t('i18n.pleaseSelect')}}</option>
          <option v-for='(list, index) in templateObj.templateType' :value="list.id" >{{ list.name }}</option>
        </select>
      </div>
       <div class="select_bg_scale"></div>
    </div>
          <div class="qwui-title_inner_f_item qwui-flexItem">
            <input type="text" v-model="templateObj.title" :maxlength="titleMaxLength" :placeholder="titleErrorTip?titleErrorTip:$t(templateObj.titlePlaceholder)" class="item_title" :class="titleErrorTip?'error_tip':''">
            <p class="qwui-title_counter" v-show="titleNum>0">{{titleNum}}/{{titleMaxLength}}</p>
          </div>
          <div class="qwui-tape_box">

            <!--  PC端富文本  -->
            <div v-if="isUseUeditor">
              <UE :defaultMsg=defaultMsg :config=config :agentCode="agent" ref="ue"></UE>
            </div>
            <!--  手机端样式  -->
            <div v-else>
              <textarea class="item_content"  v-model="templateObj.content" :maxLength="contentMaxLength" :class="contentErrorTip?'error_tip':''"
                        @input="updateValue($event.target.value)" ref="input"cols="30" rows="3" :placeholder="contentErrorTip?contentErrorTip:$t(templateObj.contentPlaceholder)"></textarea>
              <p class="qwui-dialog_textarea_counter" v-show="contentNum>0">{{contentNum+'/'+contentMaxLength}}</p>
            </div>
            <div class="more_function" :class="{'active': isUseUeditor}" v-show="templateObj.moreFunctions && templateObj.moreFunctions.length>0">
              <div class="icon-circular" @click="switchUse" v-if="isPC">
                <i class="icon-circular-ueditor" :class="{'active':switchUeditor}"></i>
              </div>
              <div class="icon-circular" @click="moreFunction(item)" v-for="item in templateObj.moreFunctions">
                <i class="icon-circular-ic" ></i>
              </div>
              <div class="qwui-tape" :class="{'qwui-tape_play': isTaping}" @click="clickTape()"></div>
            </div>
          </div>
     </div>
  </div>
</template>
<script>
import * as timeUtil from '@/assets/js/time-util.js'
import UE from '../base/editor.vue';
export default {
  props:{
    dataDetailMsg:{
      type:Object,
      default:function () {
        return {}
      }
    },
    selectTypeTitle: {
      type: String,
      default: '请选择'
    },
    agent:String,
    autoCaching:{
      type: Boolean,
      default: false
    },
    titleMaxLength:{
      type:Number,
      default:100
    },
    contentMaxLength:{
      type:Number,
      default:2048
    },
    isUseUeditor:{
      type:Boolean,
      default:false
    },
    typeErrorTip:{
      type:String,
      default:''
    },
    titleErrorTip:{
      type:String,
      default:''
    },
    contentErrorTip:{
      type:String,
      default:''
    },
    isRequired: {
      type:Boolean,
      default:false
    }
  },
  components:{UE},
  data(){
    return {
        isTaping: false,
        messageNum:0,//输入框的字数
        templateObj:this.dataDetailMsg,
        defaultMsg:'',
        isPC:_.isWeChat() && !_.isWeChatApp(),//true表示pc端才可以使用
        switchUeditor:this.isUseUeditor,//true为不使用富文本
        config: {
          initialFrameHeight: 350,
          zIndex: 10,
          saveInterval: 1000,
          maximumWords:60000,
          wordCountMsg:"{#count}/60000",
          wordOverFlowMsg:"<span style='color:red;'>您输入的字符已超出6W限制，将无法提交日志！</span>",
          autoHeightEnabled:false, //禁止自动改变高度
          toolbars:[[ 'fullscreen', 'source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline','forecolor', '|',  'insertorderedlist',
            'insertunorderedlist', 'fontsize', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', 'insertimage']]
        }
    }
  },
  updated: function () { //进入组件时，更新内容文本域状态
    this.$nextTick(function () {
      !this.isUseUeditor?this.updateValue(this.templateObj.content):''
    })
  },
  beforeDestroy(){                          //添加缓存功能
    if(this.autoCaching){
      this.autoCachingFun();
    }
  },
  computed:{
    titleNum:function () {//标题字数
      return this.templateObj.title.length
    },
    contentNum:function () {//内容字数
      return this.templateObj.content.length
    },
  },
  watch:{
    'templateObj.content':function (val) {
      this.defaultMsg=val.replace(/\n/g, '<br>');
      this.$emit("content",val);
    },
    'templateObj.summaryContent':function (val) {
      let str = this.$refs.ue.getUEContent() + val.replace(/\n/g, '<br>');
      this.isUseUeditor?this.$refs.ue.setUEContent(str):'';
    }
  },
  methods:{
    switchUse:function () { //切换富文本
      var btn={
        primaryBtn:{name:'切换', callBack:this.switchStatus},
        defaultBtn:{name:"取消", callBack:null},
      };
      if(!this.switchUeditor){
        _.alert('','富文本模式发布的日志不支持在手机端编辑，是否切换？', btn)
      }else{
        if(this.$refs.ue.getUEContent()!= ''){
          _.alert('','纯文本模式将清除当前内容的格式，是否切换？', btn)
        } else {
          this.switchStatus();
        }
      }
    },
    switchStatus:function () {
      this.switchUeditor = !this.switchUeditor;
      if(!this.switchUeditor){
        this.templateObj.content = this.$refs.ue.getUEContentTxt()
      }else{
        this.defaultMsg = this.templateObj.content.replace(/\n/g, '<br>');
      }
      this.$emit('changeUeditor', this.switchUeditor);
    },
    getUEContent() { //获取富文本编辑器内容
      return this.isUseUeditor?this.$refs.ue.getUEContent():false;
    },
    getUEContentIsOver() { // 获取是否超限
      return this.$refs.ue.getUEContentIsOver()
    },
    moreFunction:function(item){ //更多功能
      this.$emit("moreFunction",item);
    },
    autoCachingFun(){                                       //开启自动缓存
      let cachingData=this.templateObj;
      if(this.agent && cachingData && (cachingData.title||cachingData.content)){
        let name=this.agent+"_add_"+_.userId;
        localStorage.setItem(name, JSON.stringify(cachingData));
      }
    },
    setTitle:function () { //选择了option后自动赋值 内容 标题
      var data=null;
      if(this.templateObj.templateTypeId!=""){
        var templateList=this.templateObj.templateType;
        for (var i = 0; i < templateList.length; i++) {
          if (this.templateObj.templateTypeId== templateList[i].id) {
            this.templateObj.title=templateList[i].title?
              templateList[i].title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(),"yyyyMMdd")):
              this.templateObj.title;
            data=templateList[i];
            if((this.templateObj.content && templateList[i].content)||this.getUEContent()){
              this.alertReplace(templateList[i]);
            }else{
              templateList[i].content? this.templateObj.content=templateList[i].content:"";
            }
            break;
          }
        }
      }
      this.$emit("listenToChild",data);
    },
    //弹窗提示是否替换
    alertReplace(data){
      var btn={
        primaryBtn:{name:'替换',data:data.content, callBack:this.sureReplace},
        defaultBtn:{name:"不替换", callBack:null},
      };
      _.alert("提示",'是否用['+data.name+']的模板内容替换正文内容？',btn);
    },
    //确定替换
    sureReplace(data){
      this.isUseUeditor?this.templateObj.content='':"";
      this.templateObj.content=data?data:this.templateObj.content;
    },
    clickTape(){
      this.isTaping = !this.isTaping;
    },
    updateValue:function (value) { //监听textarea控件
      if(value.length<=0){
        this.$refs.input.value=value.substring(0,this.maxLength);
      }
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
      if(len/32>=3){
        this.$refs.input.rows=(len/32)>20? 20:len/32;
      }else{
        this.$refs.input.rows=3;
      }
    }
  }
}

</script>

<style scoped>
  .qwui-title_detaildata{
    position: relative;
    margin-top:15px;
    padding-left:15px;
    background-color:#fff;
  }
  .qwui-title_box{
    display: flex;
    align-items: flex-end;
    position: relative;
    min-height: 19px;
    padding: 10px 15px 10px 0;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
  .qwui-title_inner_f_item{
    display: flex;
    align-items: flex-end;
    position: relative;
    min-height: 19px;
    padding: 12px 15px 12px 0;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
  .qwui-title_box:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
  }
  .qwui-title_item_title {
    margin-right: 10px;
    color: #333;
    font-size:16px;
  }
  .qwui-title_item_select {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;
    padding-right: 20px;
    direction: rtl;
    font-size: 16px;
    line-height: 24px;
    color: #666666;
    -webkit-appearance:none;
    -moz-appearance:none;
    outline:none;
    border: none;
    background: url(../../assets/images/ic_arrow.png) no-repeat scroll right
    center transparent;
    background-size: 8px 14px;
  }
  .noSelect{
    opacity: 0;
  }
  .qwui-title_item_select.active{
    padding-right: 0;
    background: none;
  }
  .qwui-dialog_textarea_counter{
    color: #B2B2B2;
    text-align: right;
    vertical-align: top;
  }
  .qwui-flexItem {
    flex: 1;
  }
  img{max-width:100%;vertical-align:middle;}
  .qwui-tape{
    position: relative;
    display: none;
    width: 35px;
    height: 35px;
    margin-top: 5px;
    line-height: 35px;
    text-align: center;
    float: right;
    border-radius: 50%;
    clear: both;
    cursor: pointer;
    background:-20px 5px  url("../../assets/images/tapeNoPlay.jpg") no-repeat;
    background-size: 60px;
  }
  .qwui-tape_play{
    background:-20px 5px  url("../../assets/images/tapePlay.gif") no-repeat;
    background-size: 60px;
  }
  .qwui-title_inner_f_item .item_title{
    flex: 1;
    width:85%;
    height: 24px;
    border: 0;
    line-height: 24px;
    font: normal 18px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    color: #333;
    box-sizing: content-box;
    background: transparent;
  }
  .qwui-title_counter{
    position: relative;
    padding-left: 4px;
    color: #B2B2B2;
    line-height: 24px;
  }
  .qwui-tape_box .item_content{
    width: 100%;
    min-height: 140px;
    max-height: 300px;
    font-size: 16px;
    color: #333;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .qwui-tape_box{
    position: relative;
    min-height: 19px;
    padding: 12px 15px 0 0;
    color: #333;
    font-size: 14px;
    line-height: 22px;
    background: #fff;
  }
  .qwui-tape_box .more_function{
    text-align: right;
  }
  .qwui-tape_box .more_function.active{
    position: absolute;
    right: 25px;
    bottom: 70px;
    z-index: 10;
  }
  .icon-circular{
    display: inline-block;
    position: relative;
    width: 35px;
    height: 35px;
    margin:5px 10px 5px 0;
    background: #fff;
    line-height: 35px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .icon-circular.active:before{
    border:none
  }
  .icon-circular::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 200%;
    height: 200%;
    border: 1px solid #999;
    border-radius: 50%;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    box-sizing: border-box;
  }
  .icon-circular-ic {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../assets/images/icon-circular.png') no-repeat 0 0;
    background-size: 20px;
    vertical-align: middle;
  }
  .icon-circular-ueditor{
    display: inline-block;
    width: 45px;
    height: 38px;
    background: url('../../assets/images/ueditor.png') no-repeat 0 0;
    background-size: 36px!important;
    vertical-align: middle;
  }
  .icon-circular-ueditor.active{
    background: url('../../assets/images/utext.png') no-repeat 0 0;
  }
  .qwui-flexItem-err{
    color:#FF574D;
  }
  .please_select_box{
    display: flex;
    align-items: center;
    position: absolute;
    right:20px;
    font-size: 16px;
  }
  .please_select_text{
    line-height: 24px;
  }
  .ic_arrow{
    display: inline-block;
    position:relative;
    left:10px;
    width: 8px;
    height:14px;
    background: url(../../assets/images/ic_arrow.png) no-repeat;
    background-size: 100% 100%;
  }
  /*修改placeholder颜色*/
  .error_tip::-webkit-input-placeholder{
    color:#FF574D;
  }
  .error_tip::-moz-placeholder{
    color:#FF574D;
  }
  .error_tip:-moz-placeholder{
    color:#FF574D;
  }
  .error_tip:-ms-input-placeholder{
    color:#FF574D;
  }
</style>
