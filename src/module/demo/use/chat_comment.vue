<template>
  <div class="qwui-chat_comment_box" :class="{active:isBlur}">
    <div class="qwui-chat_comment_mask" @click="closeChatDialog"></div>
    <div class="qwui-chat_comment_inner">
      <div class="qwui-chat_comment_face">
        <span class="qwui-chat_comment_add" @click.stop.prevent="chatBarClick"></span>
      </div>
      <div class="qwui-chat_comment_input">
        <textarea cols="30" rows="1" v-model="messageValue" ref="input" @input="updateValue($event.target.value)" @click="textareaClick"></textarea>
      </div>
      <div class="qwui-chat_comment_send" @click="sendChatComment"><span class="qwui-chat_comment_btn">发表</span></div>
    </div>
    <div class="qwui-chat_comment_footer" :class="{active:isChatBtnShow}" v-show="isChatBtnShow">
        <ul class="qwui-chat_comment_bar" v-show="!isShowEmoji">
          <li>
            <div class="qwui-chat_bar_icon qwui-iconPerson" @click.stop.prevent="chatBtnClick"></div>
            <p>点名@人</p>
          </li>
          <li>
            <div class="qwui-chat_bar_icon qwui-iconEmoji" @click.stop.prevent="chatBtnClick"></div>
            <p>表情</p>
          </li>
          <li>
            <div class="qwui-chat_bar_icon qwui-iconImage" @click.stop.prevent="chatBtnClick"></div>
            <p>图片</p>
          </li>
        </ul>
      <div class="qwui-swiper_container emoji_list_viewport" v-show="isShowEmoji">
        <div class="qwui-swiper_wrapper flipsnap">
          <div class="qwui-swiper_slide" v-for="item in smile_array">
            <ul>
              <li  v-for="strData in item" @click.stop.prevent="selectEmoji">
                <a href="javascript:" :title="strData">
                  <img align="absmiddle" class="emoji" :src="'../static/images/emoji/'+strData.split(':').join('')+'.png'" :title="strData" :alt="strData" >
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
  import '../../../assets/js/flipsnap.js'
  export default {
    name: 'chatComment',
    props:['listcomment'],
    data(){
      return{
        isBlur:false, //是否聚焦
        isChatBtnShow:false,//是否显示评论功能选择
        isShowEmoji:false,//是否显示表情
        isLoadingSend:false, //正在发送中，防止多次提交
        messageValue:"",//输入的值
        currentPoint:0,//当前表情页
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
      if(this.isBlur){
        document.querySelector(".wrap").style.height=document.documentElement.clientHeight+'px';
      }else{
        document.querySelector(".wrap").style.height="auto";
      }
    },
    computed:{
      showEmojify:function () {
        return this.smile_array;
      },
    },
    methods:{
      chatBarClick:function () { //点击加号
        this.isChatBtnShow=!this.isChatBtnShow;
        this.isShowEmoji=false;
      },
      chatBtnClick:function (even){ //点击展示表情
        this.isShowEmoji=true;
      },
      closeChatDialog(){  //关闭置顶聊天窗口
        this.isBlur=false;
        this.isChatBtnShow=false;
        this.isShowEmoji=false;
        this.$refs.input.rows=1;
      },
      textareaClick:function () { //点击聚集
        this.isBlur=true;
        this.isChatBtnShow=true;
        this.updateValue(this.messageValue);
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
        if(value.length>300){ //限制300字，以后可配置长度
          value=value.substring(0,300);
          this.$refs.input.value=value;
          this.messageValue=value;
        }
      },
      selectEmoji(even){ //点击选择表情
        this.messageValue+='['+this.codeToWord(even.target.getAttribute("title"))+']';
        if(this.isBlur){
          this.updateValue(this.messageValue);
        }
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
      sendChatComment:function () { //点击发送
        if(this.messageValue=="" ||this.isLoadingSend ||this.listcomment.send.url==""){
          return;
        }
        this.isLoadingSend=true;
        var value=this.imgToCode(this.messageValue);
        this.listcomment.send.data[this.listcomment.send.contentObject]=value;
        var _this=this;
        _.ajax({
          url: _.baseURL + _this.listcomment.send.url,
          type: 'POST',
          data: _this.listcomment.send.data,
          success: function (result) {
            if(result.code=="0"){
              _this.messageValue=value;
              _this.showSendContent(_this.listcomment.send.data.type,result.data);
              _this.listcomment.send.data.type="1";
              _this.messageValue="";
              _this.isBlur=false;
              _this.isChatBtnShow=false;
              _this.isShowEmoji=false;
              _this.isLoadingSend=false;
            }
          }
        })
      },
      showSendContent:function (type,data) {
        this.listcomment.comments.unshift({
          headPic:data.headPic,
          personName:data.personName,
          creator:data.creator,
          type:type,
          content:this.messageValue,
          time:"刚刚",
          commentStatus:"0",
        });
        this.messageValue="";
      }
    }
  }
</script>
<style>
  .qwui-chat_comment_box{
    position: relative;
    overflow: hidden;
    left:0;
    right: 0;
    bottom: 0;
    width: 100%;
    margin: auto;
    z-index: 11;
  }
  .qwui-chat_comment_box.active{
    position: fixed;
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
  }
  .qwui-chat_comment_add{
    display: inline-block;
    position: relative;
    top: 50%;
    width: 30px;
    height: 30px;
    margin-top: -15px;
    background: url(../../../assets/images/icon-comment-add.png) no-repeat;
    background-size: contain;
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
    border: solid 1px #ddd;
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
    top: 50%;
    margin-top: -17px;
    width:60px;
    font-size: 16px;
    color:rgba(255,255,255,1);
    background:rgba(47,125,205,1);
    line-height: 35px;
    border-radius: 5px;
    text-align: center;
    text-decoration: none;
    box-sizing: border-box;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
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
    background: url(../../../assets/images/qwui_icon_momment.png) no-repeat;
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
  .qwui-chat_comment_footer:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
  }
  .qwui-chat_comment_box.active .qwui-chat_comment_inner:before{
    border-top: none;
 }

</style>
