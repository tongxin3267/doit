<template>
  <div class="qwui-no_record_box" :class="{'active':setTop}">
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
      setTop: {
        type:Boolean,
        default: true
      },
      hasRecord: {
        type: Object,
        default: function () {
          return {
            icon: '',
            title: '',
            text: '',
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
  /*无权限*/
  .qwui-icon_permission{
    background-position: -520px 0;
  }
  /*蓝色无记录*/
  .qwui-icon_blue_text1{
    background-position: -650px 0;
  }
  .qwui-icon_blue_text2{
    background-position: -790px 0;
  }
  /*无查重结果*/
  .qwui-icon_no_check {
    background: url(../../assets/images/icon_noCheck.png) center no-repeat;
    background-size: cover;
  }
  /*无重复*/
  .qwui-icon_no_repeat {
    background: url(../../assets/images/icon_noRepeat.png) center no-repeat;
    background-size: cover;
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
