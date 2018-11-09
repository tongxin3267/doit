<template>
  <!--评论列表-->
  <div class="qwui-commentList_box">
    <div class="qwui-commentList_marginTop"></div>
    <div class="qwui-user_select_revert">
      <slot name="title">
        <div class="qwui-user_cell_title">
          <span class="qwui-user_cell_LeftTitle">{{title}}</span>
          <p v-if="totalRow>0" class="qwui-user_cell_count">
            <span>{{totalRow}}</span>
          </p>
        </div>
      </slot>
      <slot name="switch">
        <div class="qwui-user_cell_fr" v-if="!hiddenSwitch">
          {{appendTitle}}
          <div class="qwui-user_cell_switch">
            <input type="checkbox" class="qwui-user_cell_input" @click="onlyComment">
          </div>
        </div>
      </slot>
    </div>
    <div class="listcomment_comments">
      <ul >
        <li v-for="(item,index) in commentList" :key="item.commentId" class="qwui-commentList_list">
          <div class="qwui-person_headPic_list">
            <p class="noHeadPic" @click="previewPerson(item)">
              <img class="img" :src="filterHeadPic(item.headPic)" alt=""/>
            </p>
          </div>
          <div class="qwui-commentList_title">
            <div class="qwui-commentList_userName">
              <span>{{filterPersonName(item.personName)}}</span>
              <span class="qwui-commentList_time">{{item.time}}</span>
            </div>
            <div v-if="item.type=='2'" class="qwui-commentList_content">
              <p v-if="checkImageType(item.content)">{{item.content}}</p>
              <img v-else class="qwui-commentList_img previewImages" :src="imgCompressURL(item.content)" @click="preview"/>
             </div>
            <div v-else class="qwui-commentList_content" :class="dealListType(item.status||item.commentStatus)">
              <p v-if="dealListContentStatus(item.status||item.commentStatus)"
								 class="qwui-content_word"
								 v-html="filterTextContent(item.content)"
								 @click="sendAddress($event,item)"></p>
              <img v-if="checkImageURL(item.content)" class="qwui-commentList_img previewImages"  :src="filterImageURL(item.content)" @click="preview"/>
            </div>
            <span class="qwui-commentList_delete" v-if="dealTimeType(item)" @click="deleteThisComment(item,index)">删除</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {
    filterOutText,
    filterImageURL,
    checkIsImages,
    defaultListHeadPic,
    defaultListIcon,
    deleteBtnFun
  } from './dealCommentList';
  import '@/assets/js/emojify.min.js';
  import EventBus from '@/utils/eventBus';
  export default {
    name: "QWCommentList",
    props:{
      title:{                                             //前置标题
        type:String,
        default: "回复"
      },
      appendTitle:{                                       //后置标题
        type:String,
        default: "只看评论"
      },
      commentList:[Array,Object],                        //评论列表
      totalRow:{                                         //列表总数
        type:[Number,String],
        default: 0
      },
      hiddenSwitch: {                                   //禁止只看评论按钮显示
        type: Boolean,
        default: false
      },
      //自定义过滤头像方法
      filterHeadPic: {
        type: Function,
        default: defaultListHeadPic
      },
      //自定义人员名字显示方法
      filterPersonName: {
        type: Function,
        default: function(personName){
          return personName
        }
      },
      //处理列表的图标显示方法
      dealListIcon: {
        type: Function,
        default: defaultListIcon
      },
      //处理列表的内容显示方法
      dealListContent: {
        type: Function,
        default: function (status) {
          return status!="2" && status!="3"? true:false;
        }
      },
      //处理删除按钮显示的默认方法
      dealListDelete: {
        type: Function,
        default: deleteBtnFun
      }
    },
    data() {
      return {
        deleteList:{},                                //删除评论的数据
        offBtn:false,                                  //  开启只看评论
      }
    },
    mounted() {
      this.dealEmojify();
      this.checkImagesUrl();
    },
    updated:function () { //数据更新
      this.dealEmojify();
      this.checkImagesUrl();
    },
    methods: {
      dealEmojify(){
        this.$nextTick(function () {
          var demo=document.querySelector(".listcomment_comments");
          emojify.run(demo);
        });
      },
      //处理列表图标类型显示
      dealListType(status){
        return this.dealListIcon(status)
      },
      //处理文本内容，剔除URL
      filterTextContent(content){
        return filterOutText(content);
      },
      //处理文本内容，把URL筛选出来
      filterImageURL(content){
        return filterImageURL(content);
      },
      //判断是文本内容
      dealListContentStatus(status){
        return this.dealListContent(status)
      },
      //判断是不是有图片
      checkImageURL(str){
        return str.indexOf('/upload/img/')==-1? false:true;
      },
      //处理删除按钮显示方法
      dealTimeType(item){
        return this.dealListDelete(item)
      },
      //只看评论按钮点击回调
      onlyComment(){
        this.offBtn=!this.offBtn;
        this.$emit("onlyComment",this.offBtn);
      },
      //删除评论方法
      deleteThisComment(item,index){
        var btnConfig={
          primaryBtn:{name:'i18n.confirm', callBack:this.sureDeleteComment},
          defaultBtn:{name:'i18n.cancel', callBack:null}, //主操作按钮
        };
        this.deleteList={
          index:index,
          data:item,
        };
        _.alert('i18n.notice','i18n.deleteAnyway',btnConfig);
      },
      sureDeleteComment(){
        this.$emit("delete",this.deleteList.data,this.deleteList.index);
      },
      checkImageType(content){
        return content.indexOf('已被管理员')!=-1? true:false;
      },
      imgCompressURL(src){
        return _.filterCompressURL(src);
      },
      previewPerson(user){                                        //查看个人信息
        const userId=user.creator||user.userId;
        if(userId && userId!=_.userId){
          this.$emit("atThisPersonUtil",user);
        }
      },
      preview(event){                                             //预览图片
        EventBus.$emit("previewImages",event.target.currentSrc.replace(/compress\//,''));
      },
      checkImagesUrl(){                                          //检出评论的全部图片src
        let urls=[];
        this.commentList.forEach((item,index)=>{
          let src=checkIsImages(item.content);
          if(src){
            urls.push({picPath:src});
          }
        });
        this.$emit("commentListImagesURL",urls);
      },
	   sendAddress({target},item){
      	if(item.type == 4){
					var data = {
						value: target.innerText,
						latitude: target.querySelector (".lat").value,
						longitude: target.querySelector ('.lag').value,
					}
					this.$emit("sendAddress",data)
				}
			}
    }
  }
</script>
<style scoped>
  .qwui-user_cell_fr{
    display: flex;
    padding: 14px 15px;
    color: #999;
    text-align: right;
  }
  .qwui-user_cell_title{
    display: flex;
    flex: 1;
    padding: 14px 15px;
    color: #999;
    line-height: 22px;
  }
  .qwui-user_cell_switch{
    flex: 1;
    padding-left: 10px;
    font-size: 0;
  }
  .qwui-user_cell_input{
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
  .qwui-user_cell_input:before{
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
  .qwui-user_cell_input:after{
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
  .qwui-user_cell_input:checked{
    border-color: #4C84C4;
    background-color: #4C84C4;
  }
  .qwui-user_cell_input:checked:before{
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  .qwui-user_cell_input:checked:after{
    -webkit-transform: translateX(18px);
    transform: translateX(18px);
  }
  /*头部*/
  .qwui-commentList_marginTop{
    margin-top: 10px;
  }
  .qwui-user_cell_count{
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 5px;
    font-size: 16px;
  }
  .qwui-commentList_box{
    background: #fff;
  }
  .qwui-commentList_box .qwui-user_select_title{
    padding: 15px 15px 12px;
    background: #fff;
  }
  .qwui-commentList_box .qwui-user_select_title:after{
    border: none;
  }
  .qwui-user_cell_LeftTitle{
    font-size: 16px;
    color: #333;
  }
  .qwui-user_cell_input{
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
  .qwui-commentList_list {
    display: flex;
    padding: 15px 0 0 15px
  }
  .qwui-commentList_title{
    position: relative;
    display: block;
    flex: 1;
    margin-top: -3px;
    padding: 0 15px 15px 0;
    font-size: 13px;
    color: #666;
    line-height: 21px;
    overflow: hidden;
  }
  .qwui-commentList_title:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-commentList_list:last-child .qwui-commentList_title:after{
    border: none;
  }
  .qwui-commentList_userName{
    margin-top: -2px;
  }
  .qwui-commentList_time{
    float: right;
    font-size: 13px;
    color: #B5B5B5;
  }
  .qwui-content_word{
    font-size: 16px;
    color: #333;
    white-space: pre-wrap;
  }
  /*个人头像图片 30*30px 50%*/
  .qwui-person_headPic_list{
    display: inline-block;
    width: 30px;
    height: 30px;
    padding-right: 12px;
  }
  .qwui-person_headPic_list .img{
    min-width: 30px;
    width: 100%;
    height: 100%;
    border-radius: 2px;
  }
  .qwui-person_headPic_list .img.borderRadius{
    border-radius: 50%;
  }
  .qwui-person_headPic_list .noHeadPic{
    height: 30px;
    cursor: pointer;
  }
  .qwui-commentList_img{
    width: 100%;
    max-width: 90px;
    height: 100%;
    padding-top: 8px;
    object-fit: contain;
  }
  .qwui-commentList_content{
    margin-top: 8px;
    font-size:16px;
    color:rgba(51,51,51,1);
    line-height: 21px;
    word-wrap: break-word;
  }
  .qwui-commentList_delete{
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
    width: 53px;
    height: 20px;
    background: url(../../assets/images/icon_comment.png) no-repeat;
    background-size: cover;
    overflow: hidden;
    vertical-align: middle;
  }
  /*已阅*/
  .qwui-meeting_icon.icon_icon7{
    background-position: -106px 0;
  }
  /*已修改*/
  .qwui-meeting_icon.icon_icon6{
    width: 63px;
    background-position: -212px 0;
  }
  .qwui-user_select_revert{
    display: flex;
    position: relative;
    font-size: 14px;
    color: #999;
    text-align: left;
    background: #fff;
  }
</style>
