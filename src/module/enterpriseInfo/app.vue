<template>
  <div id="app">
    <router-view v-if="dataBase.config" v-show="dataBase.isShow"></router-view>
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
        showTip:false,
      }
    },
    created(){
      this.$i18n.locale = "zh-CN";
      if(_.isAndroid()||_.isIOS()) {//手机端的分享链接
        this.shareLink();
      }
    },
    methods:{
      //分享链接，配文字图片
      shareLink:function () {
        _.checkApi.setDataForWeixinValue('企业信息','','['+_.personName+']分享了一条企业信息，点击查看',window.location.href);
      },
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
