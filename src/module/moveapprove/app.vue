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
  import dialog_mask from '@/components/base/dialog_mask'; //弹窗组件
  import loading from '@/components/base/loading'; //加载中、操作成功提示组件（删除成功、提交成功）
  import wx from 'weixin-js-sdk';
  export default {
    name: 'app',
    data() {
      return {
        dataBase: dataBase,
      }
    },
    created(){
      this.$i18n.locale = "zh-CN";
    },
    mounted: function () {
      var self = this;
      window.addEventListener("popstate", function (e) {
        if (self.$route.path == "/") {
          if (_.isWeChatApp() || _.isQiyeweixinApp()) {
            wx.closeWindow();
          } else {
            self.$router.replace({
              path: '/'
            });
          }
        }
        if (self.$route.path == "/draft" || self.$route.path.indexOf('/my/')!=-1) {
          self.$router.replace({
            path: '/'
          });
        }
        e.preventDefault();
      }, false);
    },
    components: {
      dialog_mask,
      loading,
    }
  }

</script>

<style>
  @import '../../assets/css/style.css';
  .qwui-zh {
    z-index: 99;
    display: inline-block;
    position: fixed;
    right: 15px;
    top: 15px;
    background: #fff;
    width: 40px;
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
  }

</style>

