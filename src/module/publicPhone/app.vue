<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive&&dataBase.config"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive&&dataBase.config" v-show="dataBase.isShow"></router-view>
    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading v-if="dataBase.config"
             :show="dataBase.loading.show"
             :icon="dataBase.loading.icon"
             :text="dataBase.loading.text">
    </loading>
    <dialog_mask v-if="dataBase.config"></dialog_mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>
<script>
  import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
  import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    created(){
      this.$i18n.locale = "zh-CN";
    },
    components:{
      dialog_mask,
      loading,
    }
  }

</script>

<style>
  @import '../../assets/css/style.css';
  @media screen and (min-width: 1024px){
    body{
      width: 1100px !important;
      margin: auto;
    }
    .qwui-enterprise_box_fixed,.qwui-search_mask,.qwui-mask{
      width: 1100px !important;
      margin: auto;
    }
  }
</style>
