<template>
  <div>
  <div class="qwui-user_item" v-for="(item, index) in message">
    <div v-show="tab.show" class="qwui-select_letter_bar" v-if="(message[index-1]&&item.pinyin.toUpperCase().substr(0, 1)!=message[index-1].pinyin.toUpperCase().substr(0, 1))||index==0">
      {{item.pinyin.toUpperCase().substr(0, 1)}}
    </div>
    <div class="qwui-user_item_inner" @click="selectThis(item.userId)">
      <div class="qwui-user_select_icon ccuser_select_icon" :class="{active:userselected.idStr.indexOf(item.userId)!=-1}">
        <i></i>
      </div>
      <div class="avator" :class="{'qwui-user_no_images':item.headPic==''||item.headPic=='0'}">
        <img v-if="item.headPic!='0' && item.headPic!=''" :src="item.headPic" alt="">
      </div>
      <div class="title flexItem">
        <p class="name">{{item.personName}}</p>
      </div>
      <i v-show="tab.arrow" class="qwui-icon_arrow_fr icon_gray"></i>
    </div>
  </div>
  </div>
</template>

<script>
  export default {
    name: 'userItemTemp',
    props: ['message', 'selectdata', 'userselected',"userRestriction","tab"],
    created: function () {
    },
    methods:{
      //选择人员
      selectThis:function(id){
        this.$emit('selUser',this,id);
      },
    }
  }
</script>

<style type="text/css">
  .qwui-user_item {
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    clear: both;
    background-color: white;
    overflow: hidden;
  }
  .qwui-user_item .qwui-user_item_inner{
    display: flex;
    padding: 10px 15px;
  }
  .qwui-select_letter_bar{
    position: relative;
    padding: 0px 15px;
    line-height: 25px;
    font-weight: 600;
    background: #f5f5f5;
    color: #999;
  }
  .qwui-user_item:after,.qwui-select_letter_bar:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
  }
  .qwui-user_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
  }
  .qwui-user_item .avator img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .qwui-user_item .title{
    flex: 1;
  }
</style>
