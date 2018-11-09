<template>
  <div class="qwui-nav_bar">
    <div class="qwui-navbar_item" :class="{active:index == menudata.navNum}" v-for="(item,index) in menudata.navBar" @click="navClick(item,index)">{{navName(item)}}</div>
  </div>
</template>
<script>
  export default {
    name: 'menuTab',
    props:['menudata'],
    data(){
      return{
      }
    },
    methods:{
      navClick:function(item,index){
        this.menudata.navNum=index;
        if(item.callBack){
          item.callBack(item.data);  //执行回调
        }
      },
      navName:function(msg){
        if(msg.num && msg.num!=""){
          return this.$t(msg.name)+'('+msg.num+')';
        }else{
          return this.$t(msg.name);
        }
      }
    }
  }
</script>
<style>
  .qwui-nav_bar{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    position: relative;
    z-index: 9;
    background: #fff;
  }
  .qwui-nav_bar .active{
    border-bottom: 3px solid rgba(47,125,205,1);
    color:rgba(47,125,205,1);
  }
  .qwui-navbar_item{
    position: relative;
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 13px 0;
    margin: 0 15px 1px;
    font-size: 14px;
    text-align: center;
  }
  .qwui-nav_bar:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #ccc;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>
