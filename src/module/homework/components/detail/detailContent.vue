<template>
  <div class="homework_message_bg" v-if="isListRecRate">
    <div class="qwui-separate_bar"></div>
    <div class="homework_message_box">
      <div class="homework_message_item">
        <i class="icon_homework_task icon_task_rate"></i>
        <p class="homework_message_title"><span>{{$t('i18n.homeworkProgress')}}</span>
          <span>{{$t('i18n.completed')+'（'+overNum+' '+$t('i18n.members')}}）</span>
          <i class="qwui-vertical_line">|</i>
          <span>{{$t('i18n.uncompleted')+'（'+isOverNum+'  '+$t('i18n.members')}}）</span></p>
      </div>
      <div class="homework_message_form">
        <ul>
          <li class="homework_message_list" v-if="index<5 && rateValue(item)" v-for="(item,index) in contentShow" @click="showRateDetailed(item)">
            <p class="qwui-message_list_headPic"  :class="{'qwui-user_no_images':item.headPic==''||item.headPic=='0'}">
              <img v-if="item.headPic!='0' && item.headPic!=''"  :src="item.headPic" alt="" />
            </p>
            <span class="list_name">{{item.personName}}</span>
            <p class="homework_message_flexItem">
              <span class="list_rate">{{item.rate>0? item.rate:0}}%</span>
              <progress max="100" :value="item.rate>0? item.rate:0"></progress>
            </p>
            <i class="qwui-icon_arrow_fr icon_gray"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="homework_show_progress" v-if="showProcess">
      <router-link :to="{name: 'homeworkRate', params: { homeworkId: detailcontent.data.homeworkId }, query: { homeworkId: detailcontent.data.homeworkId }}">
      <p class="show_progress_tips">
        <span class="show_progress_num">{{$t('i18n.seeAll')+' '+contentShow.length+' '+$t('i18n.progress')}}</span>
        <!--<i class="qwui-icon_arrow_fr icon_blue"></i>-->
      </p>
      </router-link>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'detailContent',
    props:{
      detailcontent:Object,
      homeworkrate:Object
    },
    data(){
      return {
        completedNum:0,
      }
    },
    created:function () {
    },
    computed:{
      isListRecRate(){
        if(this.detailcontent.listRecRate && this.detailcontent.detail.isUseRate=="1"){
          return this.detailcontent.listRecRate.length>0? true:false;
        }
        return false;
      },
      showProcess(){
        if(this.detailcontent.detail.creator.userId&&this.detailcontent.detail.creator.userId==_.userId){
          return true;
        }
        return false;
      },
      contentShow:function(){
        return this.detailcontent.listRecRate;
      },
      overNum:function(){
        this.completedNum=0;
        if(this.detailcontent.detail.creator.userId==_.userId){
          for (var i = 0; i < this.detailcontent.listRecRate.length; i++) {
            var rateVOId=this.detailcontent.listRecRate[i].id;
            var isOver=this.detailcontent.listRecRate[i].isOver;
            if(rateVOId && (0 == isOver || 1 == isOver)){
              this.completedNum+=1;
            }
          }
        }
        return this.completedNum;
      },
      isOverNum:function(){
        if(this.detailcontent.detail.creator.userId==_.userId){
          return this.detailcontent.listRecRate.length-this.completedNum;
        }
        return 0;
      }
    },
    methods:{
      rateValue:function (item) { //记录可操作用户的作业进度
        if(item.recId==_.userId){
          this.detailcontent.updateRated.oldRate=item.rate;
        }
        return true;
      },
      showRateDetailed:function(msg){ //自定义事件
        this.$emit('showRate',msg);
      },
    },
  }
</script>
<style>
  .homework_message_box{
    position: relative;
    padding-left: 15px;
    background-color: #fff;
  }
  .homework_message_item{
    display: flex;
    padding: 10px 15px 10px 0;
  }
  .icon_homework_task{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../../../../assets/images/qwui-content.png") center no-repeat;
    background-size: cover;
    vertical-align: bottom;
  }
  .icon_task_rate{background-position: 0 0;}
  .homework_message_title{
    display: inline-block;
    flex: 1;
    font-size: 14px;
    color: #666;
    line-height: 20px;
  }
  .homework_message_title span:first-child{
    margin:0 10px;
    font-size: 16px;
    color: #333;
  }
  .qwui-vertical_line{
    margin: 0 10px 0 5px;
  }
  .homework_message_form{
    width: 100%;
  }
  .homework_message_list{
    display: flex;
    position: relative;
    padding: 12px 15px 12px 0;
    font-size: 14px;
    color: #333;
    line-height: 22px;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .homework_message_flexItem{
    flex: 1;
  }
  .list_name{
    display: inline-block;
    width: 80px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .homework_message_list p{
    display: inline-block;
    margin-right: 20px;
    text-align: right;
  }
  .homework_message_list .list_rate{
    display: inline-block;
    width: 40px;
    margin-right: 5px;;
  }
  .homework_message_list progress{
    display: inline-block;
    width: 100px;
    height: 10px;
    border: none;
    background-color: #ddd;
    vertical-align: inherit;
  }
  .qwui-message_list_headPic{
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 5px;
    border-radius: 50%;
  }
  /*兼容chrome和firefox*/
  progress::-moz-progress-bar { background: #ddd; }
  progress::-webkit-progress-bar { background: #ddd; }
  progress::-webkit-progress-value  { background: #2F7DCD; }
  .homework_show_progress{
    padding: 15px 0;
    text-align: center;
  }
  .homework_show_progress .show_progress_tips{
    display: block;
    font-size: 14px;
    color: #576b95;
    text-decoration: none;
  }
  .homework_show_progress .show_progress_num{
    margin-right: 12px;
    cursor: pointer;
  }
  /*底部边框*/
  .homework_message_box:after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  /*头部边框*/
  .homework_message_list:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>
