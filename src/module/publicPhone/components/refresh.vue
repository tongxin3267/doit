<template>
  <div v-show="loadFinished">
    <div class="qwui-showMoreList">
      <p><i class="qwui-icon_loadingMore"></i>{{tips}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loadMore',
    props:{
      loadFinished:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        tips:"刷新中",//描述
      }
    },
    created:function () {
      _.hideLoading();
    },
    methods:{
      //请求接口数据
      requestData(){
        this.$emit('requestData')
      },
    },
  }
</script>
<style>
  .qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
</style>
