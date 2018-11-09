<template>
  <div class="qwui-detail_header">
    <div class="qwui-detail_header_title">
      <span>{{filterTitle}}</span>
      <apply-status :applystatus="filterStatus"></apply-status>
    </div>
    <div class="qwui-detail_header_time">
      <span>{{createTime}}</span>
      <span class="qwui-detail_header_creator" :class="{disabled:titledata.creator && titledata.creator.userId==userId}" @click.stop.prevent="showPersonDetail(titledata.creator)">{{$t(titledata.personName)}}</span>
      <a v-if="isEditCopy" @click="clickEditOrCopy(isEditCopy)">{{configDes.editField}}</a>
      <a v-if="isConfigCopy" @click="clickEditOrCopy(isConfigCopy)">{{configDes.copyField}}</a>
      <a v-if="false">{{configDes.prints}}</a>
    </div>
    <!--  tips  -->
    <div class="qwui-detail_tips" v-if="titledata.tips">
      <i class="qwui-detail_tips_icon"></i>
      <span class="iconTips_font">{{titledata.tips}}</span>
    </div>

    <div class="qwui-detail_header_content " v-if="titledata.describes || isPriority">
      <div class="qwui-detail_header_item" v-if="isPriority">
        <div class="qwui-detail_item_title">{{$t('i18n.priority')}}</div>
        <div class="qwui-detail_item_content" :class="{'red':titledata.priority!='0'}">{{isPriority}}</div>
      </div>
      <div class="qwui-detail_header_item" v-for="(item,i) in titledata.describes" v-if="item.content!=''">
        <div :class="item.class && item.class!=''? item.class:'qwui-detail_item_title'">
          <i v-if="item.figure" :class="item.figure && item.figure!=''? item.figure:''"></i>{{$t(item.text)}}</div>
        <div class="qwui-detail_item_content">{{$t(item.content)}}
          <i v-if="item.icon" class="qwui-icon" :class="item.icon && item.icon!=''? item.icon:''" @click="rightIconClick(item)"></i>
        </div>
      </div>
    </div>
    <div class="qwui-detail_instruct">
      <div class="qwui-detail_instruct_word" v-show="titledata.content" v-html="titleContent">{{checkURL(titledata.content)}}</div>
      <!--图片列表-->
      <div class="qwui-detail_instruct_images" v-if="isPicList">
        <img :src="dealImagesUrl(item.picPath)" class="previewer-demo-img previewImages" @click="preview(item.picPath)" v-for="(item,index) in titledata.picList">
      </div>
      <!--   文件   -->
      <div class="qwui-detail_instruct_mediaList" v-if="isMediaList">
        <div class="qwui-detail_mediaList_title">{{$t('i18n.attachment')}}({{titledata.mediaList.length}})</div>
        <ul>
          <li v-for="item in titledata.mediaList">
            <span class="qwui-detail_mediaList_images" :class="item.fileExt"></span>
            <div class="qwui-detail_mediaList_fuJian">
              <p class="name">{{item.fileName}}</p>
              <p class="size">{{item.fileSizeStr}}</p>
            </div>
            <div class="qwui-detail_mediaList_down">
              <span @click="openPreviewFile(item)" v-if="fileType(item.fileExt)"><i class="qwui-operate-icon qwui-operate-icon-preview"></i></span>
              <span @click="downloadFileClick(item)"><i class="qwui-operate-icon qwui-operate-icon-download"></i></span>
            </div>
          </li>
        </ul>
      </div>
      <!--   评分列表   -->
      <div class="qwui-detail_score" v-if="isScoreList">
        <div class="title"><span>评分({{titledata.scoreList.length}})</span></div>
        <div class="star" v-for="(item,index) in titledata.scoreList">
          <span class="name">{{item.personName}}</span>
          <div class="qwui-score_box_select qwui-inline_block">
            <span class="qwui-score_star" :class="{actived:start>=item.score}"  v-for="(n,start) in 10" ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Datetime from 'vux/src/components/datetime';
  import applyStatus from '@/components/part/apply_status';
  import flow_button from '@/components/button/flow_button';
  import EventBus from '@/utils/eventBus';
  export default{
    name:"detailTile",
    props:{
      titledata:{
        type:Object,
        default:function () {
          return {}
        }
      },
    },
    data(){
      return {
        titleContent:"",
        configDes:{
          editField:'编辑',
          copyField:this.$t('i18n.copy'),
          prints:this.$t('i18n.printPreview'),
          },
        prioritys:{
          '0':this.$t('i18n.general'),
          '1':this.$t('i18n.ibnu'),
          '2':this.$t('i18n.nibu'),
          '3':this.$t('i18n.iau')
        },
        userId:_.userId,
      }
    },
    computed:{
      createTime:function(){  //当天、今年、非今年
        return _.getFormatTime(this.titledata.createTime);
      },
      //过滤标题
      filterTitle(){
        return this.titledata.title.indexOf("i18n")==-1? this.titledata.title:this.$t(this.titledata.title);
      },
      //过滤审批状态
      filterStatus(){
        return this.titledata.status? this.titledata.status:{};
      },
      isConfigCopy(){
        if(this.titledata.configCopy && JSON.stringify(this.titledata.configCopy)!="{}"){
          return this.titledata.configCopy;
        }
        return false;
      },
      isEditCopy(){
        if(this.titledata.configEdit && JSON.stringify(this.titledata.configEdit)!="{}"){
          return this.titledata.configEdit;
        }
        return false;
      },
      isPriority(){
        if(this.titledata.priority){
          var s=this.titledata.priority;
          return this.prioritys[s];
        }
        return false;
      },
      isPicList(){
        if(this.titledata.picList){
          return this.titledata.picList.length>0? true:false;
        }
        return false;
      },
      isMediaList(){
        if(this.titledata.mediaList){
          return this.titledata.mediaList.length>0? true:false;
        }
        return false;
      },
      isScoreList(){
        if(this.titledata.scoreList){
          return this.titledata.scoreList.length>0? true:false;
        }
        return false;
      }
    },
    methods:{
      //点击编辑或复制
      clickEditOrCopy:function (val) {
        this.$emit('clickEditOrCopy',val)
      },
      //预览图片
      preview (src) {
        EventBus.$emit("previewImages",src);
      },
      //点击显示创建人信息
      showPersonDetail:function (creator) {
        if(creator && creator.userId != _.userId){
          this.$emit("showThisPersonUtil",creator);
        }
      },
      checkURL(obj){
        this.titleContent=_.checkURL(obj,false);
      },
      dealImagesUrl(url){ //图片路径
        if(url.indexOf("http")!=-1){
          return url;
        }
        return (_.compressURL+url).replace('/compress/','/');
      },
      fileType(fileExt){
        if(/ZIP|RAR/.test(fileExt) || (/MP4|WMV/.test(fileExt) && _.isWeChatApp() && _.isIOS())){
          return false;
        }
        return true;
      },
      rightIconClick(item){ //右边的图标点击回调事件
        if(item.callBack){
          item.callBack(item);
        }
      },
      openPreviewFile(item){  //预览附件
        _.wxqyh_previewFile(item.id,item.url,item.fileName,item.fileExt);
      },
      downloadFileClick(item){ //下载附件
        _.wxqyh_downloadFile(item.id,item.url,item.fileName);
      }
    },
    components:{
      applyStatus,
      flow_button,
    }
  }
</script>
<style>
  .qwui-detail_header{
  position: relative;
  padding: 0 15px;
  background:rgba(255,255,255,1);
}
.qwui-detail_header_title{
  padding: 25px 0 7px;
  font-size: 20px;
  color:rgba(51,51,51,1);
  line-height: 1.5em;
  font-weight: 500;
  word-wrap: break-word;
}
.qwui-detail_header_title span:first-child{
  vertical-align: middle;
}
.qwui-detail_header_time{
  font-size: 14px;
  color: #888;
}
.qwui-detail_header_creator{
  color:#586c94;
  cursor: pointer;
}
.qwui-detail_header_creator.disabled{
  color:#888;
  cursor:unset;
}
.qwui-detail_header_time span{
  margin-right: 5px;;
}
.qwui-detail_header_time a{
  margin-right: 5px;
  color: #586c94;
}
.qwui-detail_header_content{
  padding-top: 25px;
}
.qwui-detail_header_item{
  display: flex;
  padding: 5px 0;
  font-size: 15px;
  line-height: 16px;
}
.qwui-detail_item_title{
  display: inline-block;
  padding-right: 20px;
  color: #666;
  text-align: left;
  overflow: hidden;
}
.qwui-detail_item_content{flex:1;color: #333;}
.qwui-detail_item_content.red{  color: red;  }
.qwui-icon{
  display: inline-block;
  margin-left: 10px;
  background: url(../../assets/images/qwui-icon.png) center no-repeat;
  background-size: contain;
  cursor: pointer;
}
.qwui-icon_edit{
  width: 15px;
  height: 15px;
  background-position: 0 0;
  vertical-align: bottom;
}
.qwui-detail_instruct{
  padding: 20px 0 15px;
  font-size: 16px;
  color: #333;
  line-height: 1.5em;
  word-wrap: break-word;
}
.qwui-detail_instruct_word{
  word-wrap:break-word
}
  .qwui-detail_instruct_images img{
    width: 100%;
    margin: 5px 0;
    object-fit: cover;
  }
  .qwui-detail_tips{
    display: flex;
    align-items: center;
    padding: 15px 0 0;
    color: #888;
    font-size: 13px;
  }
  .qwui-detail_tips_icon{
    width: 14px;
    height: 14px;
    background: url('../../assets/images/icon-tips.png');
    background-size: 14px 14px;
    display: inline-block;
    vertical-align: middle;
  }
  .iconTips_font{
    display: inline-block;
    padding-left: 8px;
    font-size: 14px;
    color: #888;
  }
  .qwui-detail_mediaList_title{
    font-size: 14px;
    color: #999;
    line-height: 38px;
    text-align: left;
  }
  .qwui-detail_instruct_mediaList li{
    display: flex;
    position: relative;
    overflow: hidden;
    padding: 5px 0;
    font-size: 16px;
  }
  .qwui-detail_mediaList_fuJian{
    flex: 1;
  }
  .qwui-detail_mediaList_fuJian .name{
    font-size: 15px;
    color: #333;
    line-height: 21px;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
  }
  .qwui-detail_mediaList_fuJian .size{
    font-size: 13px;
    color: #999;
    line-height: 18px;
  }
  .qwui-detail_mediaList_down span{
    display: inline-block;
    width: 36px;
    height: 100%;
    text-align: center;
  }
  .qwui-detail_instruct_mediaList li:after{
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
  .qwui-detail_score{
    padding: 20px 0 30px;
  }
  .qwui-detail_score .title{
    margin-bottom: 5px;
    color: #999;
  }
  .qwui-detail_score .star{
    padding: 5px 0;
    height: 18px;
    line-height: 18px;
  }
  .qwui-detail_score .star .name{
    color: #333;
    font-size: 15px;
    width: 60px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-inline_block{
    display:inline-block!important;
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
</style>
