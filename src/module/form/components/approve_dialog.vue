<template>
  <div>
    <div class="approveDialog" v-if="approveDialogShow">
      <div class="selectBoxContent">
        <p class="chooseNodeListUI-top-title">会签</p>
        <p class="chooseNodeListUI-title">选择退回的节点 <span class="tip">*</span></p>
        <p class="selectNodeBox">
          请选择
          <span class="qwui-click_icon_right"> </span>
        </p>

        <p class="chooseNodeListUI-title">选择</p>
        <div class="selectAssignBox">
          <label class="item" v-if="isSign">
            <input type="radio" class="icon_check" name="sign">
            加会签 <span class="tip">（在当前节点中添加处理人）</span>
          </label>
          <label class="item">
            <input type="radio" class="icon_check" name="sign">
            加前签 <span class="tip">（在当前节点之前添加处理人）</span>
          </label>
          <label class="item">
            <input type="radio" class="icon_check" name="sign">
            加后签 <span class="tip">（在当前节点之后添加处理人）</span>
          </label>
        </div>

        <!--选择处理人-->
        <user_selected_group class="chooseNodeListUI"
                             title="选择处理人"
                             :mustChoose="true">
          <user_selected_item>
          </user_selected_item>
        </user_selected_group>

        <div class="qwui-dialog_textarea">
          <textarea cols="30" rows="2" :placeholder="approveTip" maxlength="200" v-model="approveText"></textarea>
          <p class="qwui-dialog_textarea_counter" @input="changeApproveTip">
            <span :class="{'active':approveText.length>190}">{{approveText.length}}</span>/200
          </p>
        </div>

      </div>
      <button_group :fixed="true">
        <qwui_button type="default" text="取消" @buttonClick="cancelDialog"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="confirmDialog"></qwui_button>
      </button_group>
    </div>
  </div>
</template>

<script>
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected'
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group'
  import user_selected_ranglist from '@/components/base/userOrDeptSelect/user_selected_ranglist'
  import {qwui_button, button_group} from '@/components/base/button'
  import audit_flow_api from "@/components/flow/api/getData.js";
  import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

  export default {
    components: {
      button_group,
      qwui_button,
      user_selected_item,
      user_selected_group,
      user_selected_ranglist,
    },
    name: "approve-dialog",
    props: {
    },
    data() {
      return {
        dataBase,
        approveText: '',          // 输入的文字
        approveTip: 'aa',         // 输入的提示语
      }
    },
    computed: {
      ...mapState({
        approveDialogShow: state => state.detail.approveDialogShow,
        detailData: state => (state.detail.detailData ?  state.detail.detailData.detail : null),     // 详情信息
        FlowAudit: state => state.detail.FlowAudit,       // 当前节点详细信息
        approveVo: state => state.detail.approveVo,       // 自由流程获取转审人员
      }),

      // 是否可以选择会签 1:是 0:否
      isSign() {
        return this.FlowAudit && this.FlowAudit.vo.isSign==1
      }
    },
    methods: {
      ...mapMutations([
        "updateDialogShow",
      ]),
      changeApproveTip() {      // 输入审批文字
        if(this.approveText.length>200) {
          this.approveText = this.approveText.splice(0,100)
        }
      },
      confirmDialog() {
        this.updateDialogShow(false)
      },
      cancelDialog() {
        this.updateDialogShow(false)
      },
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1024px) {
    .approveDialog{
      width: 740px;
      margin: auto;
    }
  }
  .approveDialog p{
    line-height: 1;
  }
  .approveDialog {
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #F5F5F5;
  }
  .selectBoxContent{
    position: absolute;
    top: 0;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
  }
  .chooseNodeListUI-top-title {
    font-size: 20px;
    margin: 25px 14px 0;
    color: #333;
  }
  .chooseNodeListUI-title {
    font-size: 16px;
    padding: 15px 15px 10px;
    color: #333;
  }
  .selectNodeBox {
    position: relative;
    font-size:16px;
    line-height: 1;
    padding: 14px 30px 10px 14px;
    box-sizing: border-box;
    margin: 0 15px 15px;
    border: 1px solid #e5e5e5;
    background-color: #fff;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qwui-click_icon_right {
    display: block;
    position: absolute;
    top: 50%;
    right: 15px;
    width: 9px;
    height: 15px;
    background:0 0 url("../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
    transform: translate(0,-50%);
  }
  .chooseNodeListUI .qwui-user_select_title{
    padding-top: 0;
    padding-bottom: 0;

  }
  .chooseNodeListUI .qwui-user_select_item{
    background-color: transparent;
  }
  .chooseNodeListUI .qwui-user_select_title:after, .qwui-user_select_charge:after {
    border: 0;
  }
  .chooseNodeListUI .qwui-user_select_add {
    margin-bottom: 20px;
  }
  .chooseNodeListUI .qwui-user_select_list{
    padding-bottom: 30px;
  }
  .selectTitle{
    position: absolute;
    top: 0;
    padding: 10px 15px;
    width: 100%;
    color: #333;
    font-size: 16px;
    background-color: #fff;
  }
  .selectContent{
    position: absolute;
    top: 54px;
    bottom: 60px;
    width: 100%;
    overflow-y: auto;
    background-color: #fff;
  }
  .selectContent::-webkit-scrollbar {
    width: 0;
  }
  .selectAssignBox {
    margin: 0 15px 25px;
  }
  .selectAssignBox .item {
    position: relative;
    display: block;
    font-size: 16px;
    padding: 14px 10px;
    line-height: 1;
    align-items: center;
    color: #333;
    background-color: #fff;
  }
  .selectAssignBox .item::after{
    content: " ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .selectAssignBox .tip {
    color: #999;
  }
  .icon_check{
    margin-right: 15px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px #ccc solid;
    -webkit-appearance: none;
  }
  .nodeItemContent p:nth-child(1){
    color: #333;
    font-size:16px;
  }
  .nodeItemContent p:nth-child(2){
    margin-top: 10px;
  }
  .qwui-dialog_textarea {
    background-color: #fff;
    margin: -20px 15px 0;
  }
  textarea {
    height: 130px;
  }
  .qwui-dialog_textarea_counter .active{
    color: red;
  }
  .tip {
    color: red;
  }
  .approveDialog .subTitle {
    font-size: 14px;
    color: #999;
  }
</style>
