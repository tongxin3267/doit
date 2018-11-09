<template>
    <div class="qwui-no_record_box" v-if="hasrecord.show" :class="{'active':hasrecord.setTop}">
      <i class="qwui-no_record_icon" :class="hasrecord.icon"></i>
      <p class="qwui-no_record_title" v-if="hasrecord.title" :class="{'actived':hasrecord.text==''}">{{$t(hasrecord.title)}}</p>
      <p class="qwui-no_record_text" v-if="hasrecord.text || hasrecord.operation">
        {{$t(hasrecord.text)}}
        <span v-if="hasrecord.operation" @click="doOperation" class="qwui-font_operation">{{$t(hasrecord.operation.text)}}</span>
      </p>
    </div>
</template>
<script>
  export default {
    name: 'hasRecord',
    props: ['hasrecord'],
    data() {
      return {
      }
    },
    methods:{
      doOperation:function () {
        if(this.hasrecord.operation.callBack){
          this.hasrecord.operation.callBack()
        }
      }
    }
  }
</script>
<style>
  .qwui-font_operation{
  color:#586C94
  }
  .qwui-no_record_box {
    position: relative;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: 98px;
    text-align: center;
  }
  .qwui-no_record_box.active{
    position: fixed;
    margin-top: -92px;
  }
  .qwui-no_record_icon{
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url(../../assets/images/icon_noContent.png) center no-repeat;
    background-size: cover;
  }
  /*空盒子*/
  .qwui-icon_box{
    background-position: 0 0;
  }
  /*无记录*/
  .qwui-icon_text {
    background-position: -130px 0;
  }
  /*搜索无记录*/
  .qwui-icon_search{
    background-position: -260px 0;
  }
  /*私人邮箱*/
  .qwui-icon_mail{
    background-position: -390px 0;
  }
  /*无权限*/
  .qwui-icon_noPermission{
    background-position: -520px 0!important;
  }
  .qwui-no_record_title{
    font-size: 18px;
    color: #666;
  }
  .qwui-no_record_title.actived{
    font-size: 16px;
    color: #bbb;
  }
  .qwui-no_record_text{
    margin-top: 10px;
    font-size: 14px;
    color: #bbb;
    line-height: 1;
  }
</style>
