<template>
  <div class="qwui-chat_comment_box" :class="{active:isBlur}">
    <div class="qwui-chat_comment_mask" @click="closeChatDialog"></div>
    <div class="qwui-chat_comment_inner">
      <div class="qwui-chat_comment_face">
        <span class="qwui-chat_comment_add" @click.stop.prevent="chatBarClick"></span>
      </div>
      <div class="qwui-chat_comment_input">
        <textarea class="qwui-textarea" cols="30" rows="1" v-model="messageValue" ref="input" @input="updateValue($event.target.value)" @click="textareaClick($event.target)"></textarea>
      </div>
      <div class="qwui-chat_comment_send" @click="sendChatComment"><span class="qwui-chat_comment_btn" :class="{'active':messageValue!=''||imagesValue!=''}">{{$t('i18n.publish')}}</span></div>
    </div>
    <div class="qwui-chat_comment_footer" :class="{active:isChatBtnShow}" v-show="isChatBtnShow">
        <ul class="qwui-chat_comment_bar" v-show="!isShowEmoji">
          <li>
            <div class="qwui-chat_bar_icon qwui-iconPerson" @click.stop.prevent="selectUserClick"></div>
            <p>{{$t('i18n.naming')}}</p>
          </li>
          <li>
            <div class="qwui-chat_bar_icon qwui-iconEmoji" @click.stop.prevent="chatBtnClick"></div>
            <p>{{$t('i18n.emoji')}}</p>
          </li>
          <li>
            <div class="qwui-chat_bar_icon qwui-iconImage">
              <input v-if="isMobile" @click.prevent="selectImagesClick($event)" accept="image/jpeg,image/jpg,image/png,image/gif" type="file" class="qwui-images_upload"/>
              <input v-else @change='qw_uploadImages' class="qwui-images_upload" type=file accept="image/jpeg,image/jpg,image/png,image/gif"/>
            </div>
            <p>{{$t('i18n.picture')}}</p>
          </li>
        </ul>
      <div class="qwui-swiper_container emoji_list_viewport" v-show="isShowEmoji">
        <div class="qwui-swiper_wrapper flipsnap">
          <div class="qwui-swiper_slide"  v-for="item in smile_array">
            <ul>
              <li  v-for="strData in item" >
                <a href="javascript:" :title="strData" @click.stop.prevent="selectEmoji">
                  <img v-if="onceEmojiClick" align="absmiddle" class="emoji" :src="'../static/images/emoji/'+strData.split(':').join('')+'.png'" :title="strData" :alt="strData" >
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="qwui-swiper_pagination">
          <span class="qwui-swiper_pagination_bullet" v-for="(item,index) in smile_array" :class="{'active':index==currentPoint}"></span>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import '../../assets/js/flipsnap.js'
  import wx from 'weixin-js-sdk';
  import checkApi from '../../assets/js/check_api';
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'chatComment',
    props:['listcomment'],
    data(){
      return{
        dataBase:dataBase,
        isBlur:false, //是否聚焦
        isMobile:false,
        isChatBtnShow:false,//是否显示评论功能选择
        isShowEmoji:false,//是否显示表情
        isLoadingSend:false, //正在发送中，防止多次提交
        messageValue:"",//输入的值
        imagesValue:"",//上传的图片路径值
        currentPoint:0,//当前表情页
        selectPerson:{},//@人所选择的人员
        oldComments:[],
        onceEmojiClick:false,
        smile_array : [{
          '微笑': ':smile:',
          '脸红': ':blush:',
          '心眼': ':heart_eyes:',
          '大笑': ':grin:',
          '喜极而泣': ':joy:',
          '味道好': ':yum:',
          '墨镜': ':sunglasses:',
          '吐舌头': ':stuck_out_tongue_closed_eyes:',
          '睡觉': ':sleeping:',
          '激动': ':flushed:',
          '开心': ':relieved:',
          '失望': ':disappointed:',
          '惊讶': ':astonished:',
          '愤怒': ':rage:',
          '哭泣': ':sob:',
          '络腮胡': ':neckbeard:',
          '魔鬼': ':smiling_imp:',
          '害怕': ':fearful:',
          '流汗': ':sweat:',
          '冷汗': ':cold_sweat:',
          '尖叫': ':scream:',
        },
          {
            '无嘴': ':no_mouth:',
            '无语': ':neutral_face:',
            '张嘴': ':open_mouth:',
            '鬼': ':ghost:',
            '月脸': ':new_moon_with_face:',
            '不好': ':no_good:',
            '便便': ':shit:',
            '丘比特': ':cupid:',
            '爱心': ':heart:',
            '心碎': ':broken_heart:',
            '感叹号': ':exclamation:',
            '问号': ':question:',
            '+1': ':thumbsup:',
            '-1': ':-1:',
            '胜利': ':v:',
            'OK': ':ok_hand:',
            '鼓掌': ':clap:',
            '祈祷': ':pray:',
            '雨伞': ':umbrella:',
            '太阳': ':sunny:',
            '音乐': ':musical_note:',
          },
          {
            '木槿': ':hibiscus:',
            '玫瑰': ':rose:',
            '四叶草': ':four_leaf_clover:',
            '啤酒': ':beers:',
            '鸡尾酒': ':cocktail:',
            '红酒杯': ':wine_glass:',
            '批萨': ':pizza:',
            '意面': ':spaghetti:',
            '米饭': ':rice:',
            '冰激凌': ':icecream:',
            '生日蛋糕': ':birthday:',
            '西瓜': ':watermelon:',
            '步行': ':walking:',
            '自行车': ':bike:',
            '公交车': ':bus:',
            '火车': ':train:',
            '子弹头': ':bullettrain_side:',
            '爆炸': ':boom:',
            '星星': ':star:',
            '闪电': ':zap:',
            '打针': ':syringe:',
          },
          {
            '礼物': ':gift:',
            '花束': ':bouquet:',
            '波板糖': ':lollipop:',
            '美元': ':dollar:',
            '钱袋': ':moneybag:',
            '王冠': ':crown:',
            '水晶': ':crystal_ball:',
            '礼帽': ':tophat:',
            '祝': ':congratulations:',
            '密': ':secret:',
            '吉他': ':guitar:',
            '跑步': ':running:',
            '消息泡泡': ':speech_balloon:',
            '说话': ':speak_no_evil:',
            '猴脸': ':monkey_face:',
            '天真': ':innocent:',
          }
        ],
      }
    },
    created:function(){
      this.listcomment.send.data.type="1";
      this.dataBase.selectConfig.signIndex="";
      this.dataBase.selectConfig.selectList["ccPersonList"]={
        "selectType": "user",
        "userName": "relatives",
        "userSelected": [],
        "callBack": {
          "confirm": this.chatConfirmSelect
        }
      };
      EventBus.$on("chatSendUtil",this.getChatComment);
      if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp()){
        this.isMobile=true;
      }
    },
    mounted:function () {
      this.$nextTick(function () {
        var _this=this;
        var windowH=document.documentElement.clientWidth<1024? document.documentElement.clientWidth:740;
        var emoji_list_flipsnap = Flipsnap('.emoji_list_viewport .flipsnap', {
          distance: windowH
        });
        emoji_list_flipsnap.element.addEventListener('fspointmove', function() {
          _this.currentPoint=emoji_list_flipsnap.currentPoint;
        }, false);
      });
    },
    updated:function () { //数据更新
      if(this.oldComments.length>0){
        this.$set(this.listcomment, 'comments', this.oldComments);
        // this.listcomment.comments=this.oldComments;
        this.oldComments=[];
      }
    },
    methods:{
      //判断是否重复@人,没重复再加入输入框内容
      getChatComment(msg){
        if(!this.listcomment.send.data.userIds){
          this.listcomment.send.data.userIds="";
        }
        var userId=msg.userId||msg.creator;
        if(msg && msg.personName && this.listcomment.send.data.userIds.indexOf(userId)==-1){
          this.messageValue+="@"+msg.personName+" ";
          this.listcomment.send.data.userIds+=userId+',';
        }
      },
      chatBarClick:function () { //点击加号
        this.isChatBtnShow=!this.isChatBtnShow;
        this.isShowEmoji=false;
      },
      chatBtnClick:function (even){ //点击展示表情
        this.isShowEmoji=true;
        this.onceEmojiClick=true;
      },
      textareaClick:function (even) { //点击聚集
        this.isBlur=true;
        this.isChatBtnShow=true;
        this.updateValue(this.messageValue);
        setTimeout(function () {
          even.scrollIntoView(true);
        },100);
      },
      selectUserClick(){ //@人
        this.isBlur=false;
        _.openSelectUser("ccPersonList");//显示选人界面
      },
      chatConfirmSelect(el,obj){
        this.isBlur=false;
        this.isChatBtnShow=false;
        if(el=="ccPersonList" && obj){
          var oldMessageValue="";
          var newMessageValue="";
          if(this.messageValue!=""){
              oldMessageValue=this.messageValue.replace(/@.*?\s/g,"");
          }
          for(var i=0;i<obj.user.data.length;i++){
            if(oldMessageValue.indexOf("@"+obj.user.data[i].personName)<0){
              newMessageValue+="@"+obj.user.data[i].personName+" ";
              }
          }
          this.messageValue=newMessageValue+oldMessageValue;//记录选人后的输入值
          this.listcomment.send.data.userIds=obj.user.idStr;//记录人员id
          this.selectPerson={el:el, data:obj.user.data,};//记录所选择的人员
        }
      },
      selectEmoji(even){ //点击选择表情
        this.messageValue+='['+this.codeToWord(even.target.getAttribute("title"))+']';
        if(this.isBlur){
          this.updateValue(this.messageValue);
        }
      },
      //    手机端图片上传
      selectImagesClick(event){
        if(checkApi.checkJsApi_image && _.isWeChatApp()){
          var localId= [];
          var serverId= [];
          var self=this;
          wx.chooseImage({
            count: 1, //限制上传一张图片
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              //选择图片成功后
              localId = res.localIds;
              if (localId.length == 0) {
                _.alert("",'i18n.plzChoosePic');
                return;
              }
              _.showLoading(self.$t('i18n.readyToUpload')+localId.length+self.$t('i18n.pictureMounts'),true);
              var i = 0, length = localId.length;
              setTimeout(uploadFormult,500);

              function uploadFormult() {
                wx.uploadImage({
                  localId: localId[i],
                  isShowProgressTips:0,
                  success: function (res) {
                    _.showLoading(self.$t('i18n.uploadingPic')+(i+1)+self.$t('i18n.pictureMounts'),true);
                    i++;
                    serverId.push(res.serverId);
                    if (i < length) {
                      setTimeout(uploadFormult,500);
                    }
                    if(serverId.length==localId.length){
                      self.newimageupload(serverId);
                    }
                  },
                  fail: function (res) {
                    _.hideLoading();
                    _.alert("",this.$t("i18n.uploadFail")+res.errMsg+"，"+this.$t("i18n.reupload"));
                  }
                });
              }
            },
            error : function(){
              _.alert("",'i18n.uploadFail');
            }
          });
        }
      },
      newimageupload(serverId){
        var serverIds="";
        for(var i=0;i<serverId.length;i++){
          serverIds+=serverId[i]+",";
        }
        var self=this;
        _.ajax({
          url:_.baseURL+"/portal/newimageupload/newimageUploadAction!newimageUpload.action",
          type:"POST",
          data: {
            serverIds: serverIds,
            isOpen: false,
            isUsePublic: checkApi.wxqyh_isUsePublic,
            drawString: "",
            agent:self.dataBase.wxqyh_uploadfile.agent
          },
          dataType:"json",
          success:function(result){
            _.hideLoading();
            if(result.code=="0"){
              var urlList=result.data.urlList;
              if(urlList.length>0){
                self.listcomment.send.data.type="2";
                self.imagesValue=_.compressURL+urlList[0];
                self.sendChatComment();
              }
            }else{
              _.alert('i18n.notice', result.desc);
            }
          }
        });
      },
      //点击选择图片,pc端图片上传
      qw_uploadImages(even){
        var obj=even.target;
        var imagePath = obj.value;
        //如果上传图片的后缀为空，不过滤，直接上传
        if(_.chooseImageTypes&&_.chooseImageTypes.length==1&&_.chooseImageTypes[0]=='camera'){
          _.alert('i18n.notice','i18n.uploadByPhone');
          return false;
        }
        if(imagePath.lastIndexOf('.')>-1){
          var type = imagePath.substring(imagePath.lastIndexOf('.') + 1, imagePath.length).toLowerCase();
          if (type != undefined && type != "" && type != 'jpg' && type != 'png' && type != 'jpeg') {
            _.alert('i18n.imgError','i18n.imgErrorMsg');
            return false;
          }
        }
        if (obj.files && obj.files[0]) {
          var file = obj.files[0];
          var URL = window.URL || window.webkitURL;
          _.showLoading(this.$t('i18n.imgUploading'),true);
          var img = new Image();
          img.src = URL.createObjectURL(file);
          var self=this;
          img.onload = function () {
            var that = this;
            var quality=1;
            var maxWidth=2560;
            var base64 = "";

            var w = that.width, h = that.height, scale = w / maxWidth; //生成比例
            if(w> maxWidth){ //如果图片大于最大宽度
              quality = 0.8;//压缩图片质量0-1，值越大质量越好
              w = maxWidth;
              h = h / scale;
            }
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(that, 0, 0, w, h);
            base64 = canvas.toDataURL('image/jpeg', quality );
            _.ajax({
              url: _.baseURL + "/portal/imageupload/imageUploadAction!doUploadImageBase64.action",
              type: 'post',
              data: {
                imgFileBase: base64,
                agent:self.dataBase.wxqyh_uploadfile.agent
              },
              success: function (result) {
                _.hideLoading();
                if(result.code === "0"){
                  self.listcomment.send.data.type="2";
                  self.imagesValue=result.data.imgurl;
                  self.sendChatComment();
                } else {
                  _.alert('i18n.notice',result.desc);
                }
              },
            })
          };
        }
      },
      sendChatComment:function () { //点击发送
        var value;
        if((this.messageValue=="" && this.imagesValue=="") ||this.isLoadingSend ||this.listcomment.send.url==""){
          return;
        }
        _.showLoading("i18n.commentSending", true);
        this.isLoadingSend=true;
        if(this.listcomment.send.data.type=="2" && this.imagesValue!=""){
          value=this.imagesValue;
        }else{
          value=this.imgToCode(this.messageValue);
        }
        this.listcomment.send.data[this.listcomment.send.contentObject]=value;
        var self=this;
        _.ajax({
          url: _.baseURL + self.listcomment.send.url,
          type: 'POST',
          data: self.listcomment.send.data,
          success: function (result) {
            _.hideLoading();
            if(result.code=="0"){
              self.showSendContent(self.listcomment.send.data.type,value,result.data.id?result.data.id:result.data.commentId?result.data.commentId:result.data.comment && result.data.comment.id);//插入评论
              self.messageValue="";
              self.imagesValue="";
              delete self.listcomment.send.data.userIds;
              self.listcomment.send.data.type="1";
              self.closeChatDialog();
              self.isLoadingSend=false;
              if(self.dataBase.selectConfig.selectList["ccPersonList"].userSelected.length>0){
                self.$emit("dealccPerson",self.selectPerson);//发送选人后的数据
                self.selectPerson={};
              }
              self.dataBase.selectConfig.selectList["ccPersonList"].userSelected=[];//清空选人
              self.$emit('addComment', {
                value,
                type: self.listcomment.send.data.type,
                id: result.data.id ? result.data.id : result.data.commentId
              })
            }else{
              _.alert('i18n.notice',result.desc);
            }

          }
        })
      },
      showSendContent:function (type,value,id) {//发送成功后现在新增评论
        this.oldComments=JSON.parse(JSON.stringify(this.listcomment.comments));
        this.listcomment.comments=[];
        this.listcomment.totalPages = (parseInt(this.listcomment.totalPages)+1).toString();
        this.oldComments.splice(0,0,{
          commentId:id,
          headPic:_.headPic,
          personName:_.personName,
          creator:_.userId,
          type:type,
          content:value,
          time:this.$t('i18n.justNow'),
          commentStatus:"9",
        });
      },
      closeChatDialog(){  //关闭置顶聊天窗口
        this.isBlur=false;
        this.isChatBtnShow=false;
        this.isShowEmoji=false;
        this.$refs.input.rows=1;
      },
      imgToCode(value){ //评论输入内容转换（表情标签转编码）
        var emojis = value.match(/\[.*?\]/g);
        emojis = (emojis==null)?"":emojis;
        if(typeof(emojis)=="object"){
          for(var i=0;i<emojis.length;i++){
            var word = emojis[i];
            var code = this.wordToCode(word.substring(1,word.length-1));
            if(code!=null){
              value = value.replace(word," "+code);
            }
          }
        }
        return value;
      },
      wordToCode(word){
        for(var i=0;i<this.smile_array.length;i++){
          for(var s in this.smile_array[i]){
            if(s==word){
              return this.smile_array[i][s];
            }
          }
        }
        return null;
      },
      codeToWord(code){ //处理表情字段
        for(var i=0;i<this.smile_array.length;i++){
          for(var s in this.smile_array[i]){
            if(this.smile_array[i][s]==code)
              return s;
          }
        }
        return null;
      },
      updateValue:function (value) { //监听textarea控件
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
        switch (true){
          case len>=64:
            this.$refs.input.rows=3;
            break;
          case len>=32:
            this.$refs.input.rows=2;
            break;
          default:
            this.$refs.input.rows=1;
        }
        if(value.length>500){ //限制500字，以后可配置长度
          value=value.substring(0,500);
          this.$refs.input.value=value;
          this.messageValue=value;
        }
        //
        if(this.messageValue==""){
          delete this.listcomment.send.data.userIds;
        }
      },
    }
  }
</script>
<style>
  .qwui-chat_comment_box{
    position: fixed;
    overflow: hidden;
    left:0;
    right: 0;
    bottom: 0;
    width: 100%;
    margin: auto;
    z-index: 9;
  }
  .qwui-chat_comment_box.active{
    top: 0;
  }
  .qwui-chat_comment_box.active .qwui-chat_comment_mask{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0,0,0,0.5);
  }
  .qwui-chat_comment_inner{
    display: flex;
    position: relative;
    padding: 7px 5px;
    background: #fff;
  }
  .qwui-chat_comment_face,.qwui-chat_comment_send{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
  .qwui-chat_comment_add{
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    background: url(../../assets/images/icon-comment-add.png) no-repeat;
    background-size: contain;
    cursor: pointer;
  }
  .qwui-chat_comment_input{
    display: flex;
    flex: 1;
    margin: 0 10px;
  }
  .qwui-chat_comment_input textarea{
    width: 100%;
    max-height: 72px;
    padding: 5px;
    border: solid 1px #e5e5e5;
    font-size: 16px;
    border-radius: 4px;
    background-color: #fff;
    -webkit-appearance: none;
    outline: 0;
    word-wrap: break-word;
    resize: none;
    box-sizing: border-box;
  }
  .qwui-chat_comment_btn{
    display: block;
    position: relative;
    width:60px;
    font-size: 16px;
    line-height: 35px;
    border-radius: 5px;
    color: #333;
    background: #fbfafc;
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
  }
  .qwui-chat_comment_btn.active{
    color:rgba(255,255,255,1);
    background:rgba(47,125,205,1);
  }
  .qwui-chat_comment_btn:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
  }
  .qwui-chat_comment_footer{
    position: relative;
    background: #fafafa;
  }
  .qwui-chat_comment_bar{
    display: flex;
    padding: 0 10px;
    font-size: 12px;
    color: #888;
  }
  .qwui-chat_comment_bar li{
    flex: 1;
    padding: 8px 0;
    text-align: center;
  }
  .qwui-chat_bar_icon{
    width: 30px;
    height: 30px;
    border: none;
    margin: 0 auto;
    line-height: 30px;
    background: url(../../assets/images/qwui_icon_momment.png) no-repeat;
    background-size: cover;
  }
  .qwui-chat_comment_bar .qwui-iconPerson{
    background-position: 0 0;
  }
  .qwui-chat_comment_bar .qwui-iconEmoji{
    background-position: -30px 0;
  }
  .qwui-chat_comment_bar .qwui-iconImage{
    background-position: -60px 0;
  }
  .qwui-images_upload{
    width: 45px;
    height: 45px;
    overflow: hidden;
    opacity: 0;
  }
  .qwui-swiper_container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    padding:10px 0;
    list-style: none;
    z-index: 1;
  }
  .qwui-swiper_wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition-property: transform,-webkit-transform;
    box-sizing: content-box;
  }
  .qwui-swiper_slide{
    display: flex;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 18px;
    background: #fff;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .qwui-swiper_slide ul{
    width: 100%;
    padding: 0 5px;
  }
  .qwui-swiper_slide li{
    position: relative;
    float: left;
    width: 14.2857%;
    padding: 5px 0;
    text-align: center;
    box-sizing: border-box;
  }

  .qwui-swiper_slide li a{
    display: inline-block;
    width: 28px;
    height: 28px;
  }
  @media screen and (min-width: 740px) {
    .qwui-swiper_slide li a{
      display: inline-block;
      width: 2em;
      height: 2em;
    }
  }
  .qwui-swiper_slide li .emoji{
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .qwui-swiper_pagination{
    width: 100%;
    position: relative;
    padding-top: 6px;
    text-align: center;
    transition: .3s opacity;
    transform: translate3d(0,0,0);
    z-index: 10;
  }
  .qwui-swiper_pagination_bullet {
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 4px;
    border-radius: 100%;
    background: #000;
    opacity: .2;
    cursor: pointer;
  }
  .qwui-swiper_pagination_bullet.active {
    opacity: 1;
    background: rgba(47,125,205,1);
  }
  /*一像素*/
  .qwui-chat_comment_inner:before,.qwui-chat_comment_footer:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .qwui-chat_comment_box.active .qwui-chat_comment_inner:before{
    border-top: none;
 }

</style>
