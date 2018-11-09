<template>
  <div class="qwui-no_record_box" v-if="hasRecord.show" :class="{'active':setTop}">
    <i class="qwui-no_record_icon" :class="hasRecord.icon"></i>
    <p class="qwui-no_record_title" v-if="hasRecord.title" :class="{'actived':hasRecord.text==''}">{{hasRecord.title}}</p>
    <p class="qwui-no_record_text" v-if="hasRecord.text">{{hasRecord.text}}</p>
    <slot name="tip"></slot>
  </div>
</template>
<script>
  export default {
    name: 'noRecord',
    props: {
      position: {
        type:Boolean,
        default: true
      },
      icon: {
        type: Object,
        default: function () {
          return {
            icon:"",
            title:"",
            description:"",
          }
        }
      }
    },
    data() {
      return {
      }
    },
  }
</script>
<style>
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
    margin-top: -79px;
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
  /*私人邮箱*/
  .qwui-icon_permission{
    background-position: -520px 0;
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
