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
      <user_choose :selectconfig="dataBase.selectConfig"
									 v-if="dataBase.selectConfig.show"
									 :tabActive="dataBase.selectConfig.signIndex =='depts'?'dept':'group'"
									 :closeUser="dataBase.selectConfig.signIndex =='depts'"
									 :closeGroup="dataBase.selectConfig.signIndex =='depts'"
                   :closeDeptTab="true"
									 :closeAllTab="dataBase.selectConfig.signIndex =='depts'">
			</user_choose>

      <select_form v-if="dataBase.selectForm.show"></select_form>
    <!--<exit v-if="showTip"></exit>-->
  </div>
</template>
<script>
import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
//import exit from '@/components/base/exit';//首页退出提示
import user_choose from '@/components/base/user_or_dept_select.vue' //js导入
import select_form from './components/base/select_form.vue'
export default {
  name: 'app',
  data(){
    return {
      dataBase:dataBase,
      showTip:false,
    }
  },
  components:{
    dialog_mask,
    loading,
    user_choose,
    select_form
  },
  created:function(){
  }
}

</script>

<style>
  @import '../../assets/css/style.css';
  .qwui-checkbox-form i{
	  display: inline-block;
	  width: 16px;
	  height: 16px;
	  background: -32px 0 url(../../assets/images/icon_check.png) no-repeat;
	  background-size: cover;
	  margin-right: 10px;
	  vertical-align: text-bottom;
  }
  .qwui-checkbox-form i.active{
	  background: -48px 0 url(../../assets/images/icon_check.png) no-repeat;
	  background-size: cover;
  }
  .qwui-cardList {
    position: relative;
    padding-left: 15px;
    background-color: #fff;
  }
  .qwui-cardList_item {
    position: relative;
    padding: 10px 15px 10px 0;
    cursor: pointer;
  }
  .qwui-cardList_item:before {
	  content: " ";
	  position: absolute;
	  left: 0;
	  top: 0;
	  right: 0;
	  height: 1px;
	  border-bottom: 1px solid #e5e5e5;
	  color: #e5e5e5;
	  -webkit-transform-origin: 0 100%;
	  transform-origin: 0 100%;
	  -webkit-transform: scaleY(0.5);
	  transform: scaleY(0.5);
	  z-index: 2;
  }
  .qwui-cardList_item:first-child::before {
    border: none;
  }
  .qwui-icon-operate {
    position: absolute;
    top: 0;
    right: 0;
    width: 45px;
    height: 100%;
    background: url(../../assets/images/icon_more.png) no-repeat center;
    background-size: 3px;
  }
  .qwui-cardList_item .flexItem h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    max-height: 72px;
    color: #333;
    font-size: 16px;
    font-weight: normal;
    line-height: 1.4;
	word-break: break-all;
  }
  span.applyStatus{
    display: inline-block;
    line-height: 1;
    padding: 2px;
    margin-left: 10px;
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
    border-radius: 2px;
  }
  .qwui-cardList_item p {
    color: #999;
    font-size: 13px;
    line-height: 1.6;
  }
  .qwui-cardList .applyStatus {
    margin: -2px 5px 0 0;
  }
  .qwui-cardList_item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .flexbox {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  .flexItem {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
  }
  .qwui-cardList_img {
    margin-right: 10px;
    width: 40px;
    height: 40px;
  }
  span.applyStatus.blue{
    border: 1px solid #458be9;
    color: #458be9;
  }
  span.applyStatus.green{
    border: 1px solid #1aad19;
    color: #1aad19 ;
  }
  span.applyStatus.red{
    border: 1px solid #d64949;
    color:#e94f4f;
  }
  span.applyStatus.gray{
    border: 1px solid #999;
    color:#999;
  }
  span.applyStatus.orange{
    border: 1px solid #ff6000;
    color: #ff6000;
  }
  .none {
    display: none  !important;
  }

  .ku_arrow::after {
    content: "";
    position: absolute;
    color: #999999;
    right: 15px;
    top: 50%;
    width: 6px;
    height: 12px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    background: url(../../assets/images/icon-arrow.png) no-repeat;
    background-size: contain;
  }
  .ellipsis {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
  }
  .qwui-list_Toptitle {
        margin-bottom: 10px;
        background-color: #fff;
    }
  .qwui-list_Toptitle p {
      padding: 14px 15px;
      color: #333;
      font-size: 16px;
      line-height: 1;
  }
	.icon {
		display: flex;
		width: 1em; height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>
