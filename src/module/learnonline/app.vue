<template lang="html">
  <div id="app">
    <!-- 需要缓存的 -->
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive && dataBase.config"
        v-show="dataBase.isShow"></router-view>
    </keep-alive>
    <!-- 不需要缓存的 -->
    <router-view
      v-if="!$route.meta.keepAlive && dataBase.config"
      v-show="dataBase.isShow"></router-view>

    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading
      v-if="dataBase.config"
      :show="dataBase.loading.show"
      :icon="dataBase.loading.icon"
      :text="dataBase.loading.text">
    ></loading>
    <dialog_mask v-if="dataBase.config"></dialog_mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>

<script>
  import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
  import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
  export default {
    name: 'app',
    data() {
      return {
        dataBase:dataBase,
      }
    },
    mounted() {
      var self=this;
      window.addEventListener("popstate", function(e) {
        if(self.$route.path=="/"){
          if(_.isWeChatApp()||_.isQiyeweixinApp()){
            self.$router.push({path:'/'});
            wx.closeWindow();
          }else{
            self.$router.push({path:'/'});
          }
        }
        if(self.$route.path=="/draft"){
          self.$router.push({path:'/'});
        }
        e.preventDefault();
      },false);
    },
    components: {
      dialog_mask,
      loading,
    }
  }
</script>

<style lang="scss">
  @import '../../assets/fonts/iconfont.css';
  @import '../../assets/css/style.css';
  @import './static/css/learn.scss';
</style>
