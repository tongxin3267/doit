<template>
  <div class="qwui-user_select_charge_view" :class="customClass">
    <div class="qwui-user_select_top">
      <div class="qwui-user_cell_view">
        <p class="title">{{title}}
          <span class="qwui-required_mark" v-if="mustChoose">*</span>
        </p>
        <slot></slot>
        </div>
      <div class="qwui-user_cell_fr" v-show="loadLast?loadLast.show:false">
        {{loadLast?loadLast.name:""}}
        <div class="qwui-user_cell_switch" @click="getLastPick(loadLast)">
          <input type="checkbox" class="qwui-user_cell_input" :checked="loadLast?loadLast.isGetVal:false">
        </div>
      </div>
    </div>
    <div class="qwui-user_select_wap">
      <div class="qwui-user_select_list_view">
        <div class="qwui-user_content_wrap">
          <slot name="user_selected_item"></slot>
        </div>
        <slot name="qwui-user_select_person_open"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/utils/eventBus'
  export default {
    name: "user_selected_group",
    props:{
      title: '',
      customClass: String,
      mustChoose: {   // 是否必选，false：默认非必选
        type: Boolean,
        default: false,
      },
      loadLast: {     // 加载上一次
      },
    },
    data() {
      return {

      }
    },
    methods: {
      getLastPick:function (loadLastObj) {
        loadLastObj.isGetVal = !loadLastObj.isGetVal;
        this.$emit("confirmPick",loadLastObj.type, loadLastObj.isGetVal);
      },
    },
  }
</script>

<style scoped>
  .qwui-user_select_charge_view {
    margin-top: 10px;
    background-color: #fff;
  }
  .qwui-user_select_top{
    display: flex;
    position: relative;
    padding: 14px 15px;
    font-size: 13px;
    text-align: left;
  }
  .qwui-user_select_list_view {
    position: relative;
    overflow: hidden;
    margin: 0 0;
    padding: 0 0;
    font-size: 0;
  }
  .qwui-user_select_wap {
    padding:  0 0 0 15px;
  }
  .qwui-user_cell_fr{
    display: flex;
    text-align: right;
    color: #999;
  }
  .qwui-user_cell_view{
    flex: 1;
    font-size: 16px;
    line-height: 22px;
    color: #333;
  }
  .qwui-user_cell_switch{
    flex: 1;
    padding-left: 10px;
    font-size: 0;
  }
  .qwui-user_cell_input{
    position: relative;
    width: 40px;
    height: 22px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    cursor: pointer;
    appearance: none;
    transition: background-color 0.1s, border 0.1s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .qwui-user_cell_input:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 38px;
    height: 20px;
    border-radius: 15px;
    background-color: #FDFDFD;
    transition: -webkit-transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .qwui-user_cell_input:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 15px;
    background-color: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: -webkit-transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .qwui-user_cell_input:checked{
    border-color: #4C84C4;
    background-color: #4C84C4;
  }
  .qwui-user_cell_input:checked:before{
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  .qwui-user_cell_input:checked:after{
    -webkit-transform: translateX(18px);
    transform: translateX(18px);
  }
  .qwui-user_select_control {
    float: left;
    width: calc(100% - 60px);
    height: 87px;
  }
  .qwui-user_content_wrap {
    display: inline;
  }
  .qwui-user_flowNodeItemKeys{
    color: #666;
    line-height: 1.8;
    font-size:13px;
    padding-bottom: 10px;
  }
</style>
