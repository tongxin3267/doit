<template>
  <div class="qwui-comment_cell_box">
    <div class="qwui-comment_cell_header">
      <div class="qwui-comment_cell_title">
        {{
          $t('i18n.comment') + '(' +
          (
            listcomment.totalPages ?
              listcomment.totalPages :
              listcomment.comments.length
          ) +
          ')'
        }}
      </div>
      <div class="qwui-comment_cell_fr"  @click="commentStatusClick(offBtn=!offBtn)" v-if="isShowOnlyCommentBtn">
        {{$t('i18n.commentOnly')}}
        <div class="qwui-comment_cell_switch">
          <input type="checkbox" class="qwui-comment_cell_input">
        </div>
      </div>
    </div>
    <div class="qwui-comment_cell_list listcomment_comments">
        <ul>
          <li v-for="(item,index) in listcomment.comments" :id="item.commentId">
            <div class="qwui-comment_list_person">
              <img :src="dealHeadPic(item)" @click.stop.prevent="showPersonDetail(item)" :class="{'active':item.headPic=='0'||item.headPic==''}" alt=""/>
            </div>
            <div class="qwui-comment_list_fr">
              <div class="qwui-comment_list_tips">
                <span class="name" v-html="dealPersonName(item)"></span>
                <span class="time">{{item.time}}</span>
              </div>
              <p v-if="item.type=='2' && item.content.indexOf('已被管理员')!=0">
                <img class="qwui-comment_list_img previewer-demo-img-comment" @click="preview($event.target)" :src="imgCompressURL(item.content)"/>
              </p>

              <p class="qwui-type" v-else-if="idAddLabelType(item)">
                <span :class="dealLabelType(item.commentStatus)"></span>
                {{item.content}}
              </p>

              <p v-else :class="{'qwui-meeting_icon icon_icon7':(item.type!='2' && item.commentStatus=='2')||(item.type!='2' && item.status=='2'),
              'qwui-meeting_icon icon_icon6':(item.type!='2' && item.commentStatus=='3')||(item.type!='2' && item.status=='3')}"
                 v-html="dealListContent(item)"></p>
              <span class="qwui-comment_list_delete" v-if="showDeleteComment(item.time,item)" @click="deleteCommentClick(index,item.commentId)">{{$t('i18n.deleteOne')}}</span>
            </div>
          </li>
        </ul>
      <div v-transfer-dom>
        <previewer :list="list" ref="previewer" :options="options"></previewer>
      </div>
    </div>
    <div class="qwui-comment_list_showMore" v-windowscroll="scrollMoreComment">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="tips==$t('i18n.loading')"></i>{{tips}}</p>
    </div>
  </div>
</template>
<script>
  import loadMore from '@/components/base/load_more';
  import '../../assets/js/emojify.min.js';
  import previewer from 'vux/src/components/previewer';
  import transferDom from 'vux/src/directives/transfer-dom';
  export default {
    name: 'listComment',
    props: {
      listcomment: {
        type: Object,
        required: true
      },
      isShowOnlyCommentBtn: {
        type: Boolean,
        default: true
      },
      isIgnore: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        tips:"",//描述
        loadMoreData:{},
        oldComments:[],
        offBtn:true,
        delectObject:{
          index:"",
          delectId:""
        },
        onceComeIn:true,//第一次加载数据，
        lock_roll:false,//限制滚动加载
        hasMore:false, //存在更多，可加载
        list: [], //图片列表
        httpContent:"",//评论链接
        options: {
          getThumbBoundsFn (index) {
            let thumbnail = document.querySelectorAll('.previewer-demo-img-comment')[index];
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            let rect = thumbnail.getBoundingClientRect();
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
          }
        },
        page: 1,
      }
    },
    created:function () {
      this.listcomment.get.data[this.listcomment.get.pageIndexName]=1;
      if(!this.listcomment.comments){
        this.listcomment.comments=[];
      }
      if(this.listcomment.get.hasMore!=null && this.listcomment.get.hasMore!=undefined){
        this.hasMore=this.listcomment.get.hasMore;
      }

      if (this.isIgnore) {
        setTimeout(() => {
          var demo=document.querySelector(".listcomment_comments");
          emojify.run(demo);
        }, 0);
      }
    },
    watch:{
      "listcomment.get.hasMore":function (val) {
        this.hasMore=val;
      },
      'listcomment.comments': {
        handler: function (val) {
          var self = this;
          self.list = [];
          if(val&&val.length>0) {
            val.forEach(function (e) {
              if(e.type=='2' && e.content.indexOf('已被管理员')!=0) {
                if ((/^http:\/\/.*$/.test(e.content)) || (/^https:\/\/.*$/.test(e.content))) {
                } else {
                  e.content = _.compressURL + e.content
                }
                self.list.push({src: e.content.replace('/compress/','/')});//评论里是压缩图，预览需还原
              }
            });
          }
        },
        deep: true
      }
    },
    updated:function () { //数据更新
      var demo=document.querySelector(".listcomment_comments");
      if(this.oldComments.length>0){
        this.listcomment.comments=this.oldComments;
        this.oldComments=[];
      }
      if(this.onceComeIn){
        this.onceComeIn=false;
        this.loadRequestDes();
      }
      if(this.listcomment.comments && this.listcomment.comments.length>0 && !this.hasMore){
        this.tips=this.$t('i18n.total')+this.listcomment.comments.length+this.$t('i18n.commentTotal')
      }

      this.$nextTick(function () {
        emojify.run(demo);
      });
    },
    beforeDestroy(){
      this.lock_roll=true;
    },
    methods:{
      //预览图片
      preview (item) {
        var commentPic = document.querySelectorAll('.previewer-demo-img-comment');
        var position = 0;
        commentPic.forEach(function (e,index) {
          if(e == item){
            position = index;
            return;
          }
        })
        this.$refs.previewer.show(position);
      },
      //处理已阅、已修改\网页链接
      dealListContent:function (item) {
        if (this.isIgnore || (item.commentStatus && item.commentStatus!="2" && item.commentStatus!="3") || (item.status && item.status!="2" && item.status!="3")){
          if(item.content.indexOf('http')!=-1){
            return _.checkURL(item.content,true);
          }else{
            return String(item.content);
          }
        }
      },
      //处理用户头像
      dealHeadPic:function(item){
        if(this.agent == "crm"){
          if(item.commentStatus=='3'||item.commentStatus=='4'||item.commentStatus=='5'||item.commentStatus=='6'||item.commentStatus=='7'){
            return String(this.infoTipAvator);//系统消息头像
          }else{
            return String(item.headPic);//用户名称
          }
        }else{
          return String(item.headPic);
        }
      },
      //处理用户名称
      dealPersonName:function(item){
        if(this.agent == "crm"){
          if(item.commentStatus=='3'||item.commentStatus=='4'||item.commentStatus=='5'||item.commentStatus=='6'||item.commentStatus=='7'){
            return String(this.systemMessPersonName);//系统消息
          }else{
            return String(item.personName);//用户名称
          }
        }else{
          return String(item.personName);
        }
      },
      //是否添加crm标签类型
      idAddLabelType:function(item){
        if(this.agent == "crm" && item.userId == null && (item.commentStatus=='3'|| item.commentStatus=='4' || item.commentStatus=='5'|| item.commentStatus=='6' || item.commentStatus=='7')){
          return true;
        }else{
          return false;
        }
      },
      //判断添加的类型
      dealLabelType:function(commentStatus){
        if(this.agent == "crm"){
          switch(commentStatus){
            case "3": return Object({'qwui-crm_infoType crm_type_fenpei':true});break;
            case "4": return Object({'qwui-crm_infoType crm_type_lingqu':true});break;
            case "5": return Object({'qwui-crm_infoType crm_type_tuihui':true});break;
            case "6": return Object({'qwui-crm_infoType crm_type_huishou':true});break;
            case "7": return Object({'qwui-crm_infoType crm_type_zhuangyi':true});break;
          }
        }
      },

      showDeleteComment:function (time,item) {  //是否显示删除评论按钮
        let creator = item.creator || item.userId;

        if ((time == this.$t("i18n.justNow") || (time.indexOf(this.$t("i18n.minsAgo")) > 0 && parseInt(time.split(this.$t("i18n.justNow"))[0]) < 30)) && creator == _.userId) {
          if ((item.commentStatus !== undefined && item.commentStatus=='9') || (item.status !== undefined && item.status=='0') || item.commentStatus === null) {
            return true;
          }
        }
        return false;
      },
      //查看个人信息
      showPersonDetail:function (data){
        if((data.creator && data.creator!=_.userId)||(data.userId && data.userId!=_.userId)){
          this.$emit("showThisPersonUtil",data);
        }
      },
      imgCompressURL:function (url) { //图片路径处理
        if(url.indexOf("http")!=-1){
          return url;
        }
        return _.compressURL+url;
      },
      commentStatusClick:function () { //点击只看评论按钮
        this.listcomment.get.data[this.listcomment.get.pageIndexName]=1;
        this.listcomment.get.data.commentStatus=this.offBtn? 1:2;
        this.resetReplyComment(); //重新请求评论内容
      },
      loadMoreClick:function () { //点击加载更多
        this.lock_roll=true;
        if(this.hasMore){
          this.tips=this.$t('i18n.loading');
          this.listcomment.get.data[this.listcomment.get.pageIndexName]+=1;
          this.requestLoadMore();
        }
      },
      scrollMoreComment:function (e) { //下拉加载
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.loadMoreClick();
          }
        }
      },
      requestLoadMore:function () { //请求加载更多
        var self=this;
        var temp = {};
        if(self.listcomment.getMore){ //如果加载更多评论接口和初始化接口不一样
          temp = self.listcomment.getMore;
          if(self.listcomment.getMore.type === 'partyConstruction'){
            temp.data.page = ++this.page;
          } else {
            temp.data.commentStatus = self.offBtn ? 1 : 2;
            if (self.listcomment.comments[self.listcomment.comments.length - 1]) {
              self.listcomment.getMore.data.lastCommentId = this.agent == 'crm' ? self.listcomment.comments[self.listcomment.comments.length - 1].id :
                self.listcomment.comments[self.listcomment.comments.length - 1].commentId;
            } else {
              self.listcomment.getMore.data.lastCommentId = '';
            }
          }
        } else{
          temp = self.listcomment.get
        }

        _.ajax({
            url: _.baseURL+temp.url,
            type: 'POST',
            data:temp.data,
            success: function (result) {
              if(result.code=="0"){
                self.hasMore=result.data.hasMore;
                if(result.data.comments){
                  self.listcomment.comments=self.listcomment.comments.concat(result.data.comments);
                }else{
                  self.listcomment.comments=[];
                }
                self.lock_roll=false;
                self.loadRequestDes();
              }else{
                _.alert("i18n.notice",result.desc);
              }
            }
        })
      },
      resetReplyComment:function(){ //重新请求
        var self=this;
        if(self.listcomment.get.url){
          _.ajax({
            url: _.baseURL + self.listcomment.get.url,
            type: 'POST',
            data: self.listcomment.get.data,
            success: function (result) {
              if (result.code == "0") {
                var newListComment = result.data;
                self.hasMore = newListComment.hasMore;  //接口没有放回页数和总数。有问题
                self.listcomment.comments = [];
                if (newListComment.comments) {
                  self.oldComments = newListComment.comments;
                }
                self.lock_roll = false;
                self.loadRequestDes();
              } else {
                _.alert("i18n.notice", result.desc);
              }
            }
          })
        }
      },
      loadRequestDes(){
         if(this.listcomment.comments && this.listcomment.comments.length>0 && this.hasMore){
           this.tips=this.$t('i18n.loadMore');
         }else if(this.listcomment.comments && this.listcomment.comments.length>0 && !this.hasMore){
           this.tips=this.$t('i18n.total')+this.listcomment.comments.length+this.$t('i18n.commentTotal');
         }else{
           this.tips=this.$t('i18n.noComment');
         }
      },
      deleteCommentClick(index,id){ //删除评论
        var btnConfig={
          primaryBtn:{name:'i18n.confirm', callBack:this.sureDelectComment},
          defaultBtn:{name:'i18n.cancel', callBack:null}, //主操作按钮
        };
        this.delectObject={
          index:index,
          delectId:id,
        };
        _.alert('i18n.notice','i18n.deleteAnyway',btnConfig);

      },
      sureDelectComment(){
        var self=this;
        self.listcomment.delete.data[self.listcomment.delete.commentId]=self.delectObject.delectId;
        _.ajax({
          url: _.baseURL+self.listcomment.delete.url,
          type: 'POST',
          data:self.listcomment.delete.data,
          success: function (result) {
            if(result.code=="0"){
              self.oldComments=JSON.parse(JSON.stringify(self.listcomment.comments));
              self.listcomment.comments=[];
              self.oldComments.splice(self.delectObject.index,1);
              self.loadRequestDes();
              _.tooltips_succeed(self.$t('i18n.deleteSuccess'));
              self.listcomment.totalPages -= 1;
            }else{
              _.alert('i18n.notice',result.desc);
            }
          }
        });
      }
    },
    directives: {
      transferDom
    },
    components:{
      loadMore,
      previewer
    }
  }
</script>
<style>
.qwui-comment_cell_header{
  display: flex;
  position: relative;
  padding: 10px 15px;
  font-size: 14px;
  align-items: center;
}
.qwui-comment_cell_title{
  flex: 1;
  color: #999;
  line-height: 20px;
}
.qwui-comment_cell_fr{
  display: flex;
  text-align: right;
  color: #999;
}
.qwui-comment_cell_switch{
  flex: 1;
  padding-left: 10px;
  font-size: 0;
}
.qwui-comment_cell_input{
  position: relative;
  width: 40px;
  height: 22px;
  border: 1px solid #dfdfdf;
  outline: 0;
  border-radius: 16px;
  box-sizing: border-box;
  background-color: #dfdfdf;
  cursor: pointer;
  appearance: none;
  transition: background-color 0.1s, border 0.1s;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.qwui-comment_cell_input:before{
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 38px;
  height: 20px;
  border-radius: 15px;
  background-color: #FDFDFD;
  transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.qwui-comment_cell_input:after{
  content: " ";
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  border-radius: 15px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.qwui-comment_cell_input:checked{
  border-color: #4C84C4;
  background-color: #4C84C4;
}
.qwui-comment_cell_input:checked:before{
  -webkit-transform: scale(0);
  transform: scale(0);
}
.qwui-comment_cell_input:checked:after{
  -webkit-transform: translateX(18px);
  transform: translateX(18px);
}
.qwui-comment_cell_list li{
  display: flex;
  position: relative;
  padding: 15px;
  background: #fff;
}
.qwui-comment_list_person{
  min-width: 38px;
  margin-right: 10px;
  cursor: pointer;
}
.qwui-comment_list_person img{
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 5px;
}
.qwui-comment_list_person img.active{
  background: url(../../assets/images/icon_person.png) no-repeat ;
  background-size: cover;
}
.qwui-comment_list_fr{
  position: relative;
  flex:1;
  word-break: break-all;
  word-wrap: break-word;
}
.qwui-comment_list_tips{
  display: flex;
  margin-bottom: 5px;
  line-height: 1;
}
.qwui-comment_list_tips .name{
  flex: 1;
  font-size: 14px;
  color: #666;
  text-align: left;
}
.qwui-comment_list_tips .time{
  flex: 1;
  font-size: 12px;
  color: #bbb;
  text-align: right;
}
.qwui-comment_list_fr p{
  font-size: 14px;
  color: #333;
}
.qwui-comment_list_fr .emoji{
  display: inline-block;
  width: 1.2em;
  height: 1.2em;
  margin:0 5px 5px 0;
}
.qwui-comment_list_img{
  max-width: 80px;
  max-height: 80px;
}
.qwui-comment_list_delete{
  display: inline-block;
  width: 50px;
  margin-top: 5px;
  font-size: 14px;
  color: orangered;
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  cursor: pointer;
}
.qwui-meeting_icon{
  display: inline-block;
  width: 50px;
  height: 21px;
  background: url(../../assets/images/qwui-meeting_icon.png) no-repeat;
  background-size: 63px 231px;
  overflow: hidden;
  vertical-align: middle;
}
.qwui-meeting_icon.icon_icon7{
  background-position: 0 -180px;
}
.qwui-meeting_icon.icon_icon6{
  background-position: 0 -150px;
}
.qwui-comment_list_showMore{
  margin-bottom: 48px;
  font-size: 14px;
  color: #999;
  line-height: 40px;
  text-align: center;
}
@keyframes weuiLoading {
  0% {
    -webkit-transform: rotate3d(0, 0, 1, 0deg);
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    -webkit-transform: rotate3d(0, 0, 1, 360deg);
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
.qwui-icon_loadingMore{
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=") no-repeat;
  background-size: 100%;
  vertical-align: middle;
}
.qwui-comment_cell_header:after,.qwui-comment_cell_list li:after{
  content: " ";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.qwui-crm_infoType{
  display: inline-block;
  vertical-align: middle;
  width: 33px;
  height: 18px;
  border-radius: 3px;
}
.qwui-crm_infoType.crm_type_fenpei{
  background: url(../../assets/images/crm/qwui-crm_fenpei.png) no-repeat 0px 0px ;
}
.qwui-crm_infoType.crm_type_lingqu{
  background: url(../../assets/images/crm/qwui-crm_lingqu.png) no-repeat 0px 0px ;
}
.qwui-crm_infoType.crm_type_tuihui{
  background: url(../../assets/images/crm/qwui-crm_tuihui.png) no-repeat 0px 0px ;
}
.qwui-crm_infoType.crm_type_huishou{
  background: url(../../assets/images/crm/qwui-crm_huishou.png) no-repeat 0px 0px ;
}
.qwui-crm_infoType.crm_type_zhuangyi{
  background: url(../../assets/images/crm/qwui-crm_zy.png) no-repeat 0px 0px ;
}
</style>
