<template>
    <div class="wrap qwui-activty_background">
      <header>
        <img class="qwui-activity_pic" :src="backgroundImg">
        <p class="qwui-activity_poster">企微云办公·越用越成功</p>
      </header>
      <section>
        <div class="qwui-activity_box">
          <div class="qwui-activity_box_input">
            <input v-model="phoneNumber"
                   type="text" class="qwui-activity_mobile" :class="{'qwui-activity_mobile_center':doInput}"
                   @focus="hidePhoneTip" placeholder="输入手机号码，领取方案">
          </div>
          <div class="qwui-activity_tip" v-show="showPhoneTip">
            <span class="qwui-activity_tip_text">
              <span class="qwui-activity_tip_dot"></span>
              请输入正确的电话号码
            </span>
          </div>
        </div>
        <div class="qwui-activity_button" @click="savePhoneClick">
          立即生成
        </div>
      </section>
      <!--选择公司规模弹框-->
      <dialog_mask_select :showDialogMask="showDialogMask" :userId="userId" @hideDialogMask="hideDialogMask"></dialog_mask_select>
    </div>
</template>

<script>
import dialog_mask_select from './select/dialog_mask_select';
import { addExperienceInfo } from "../api/getData";


  export default {
      data() {
        return {
          phoneNumber: '',//用户手机号码
          showPhoneTip: false,//手机号码没填时提示
          showDialogMask: false,//选择公司规模底部弹框
          doInput: false,//用户做输入操作
          isMobile: '',//从url获取到的isMobile参数
          corpId: '',//从url获取到的corpId
          userId: '',//用户的id
          wxUserId: '',//托管人账号
          backgroundImg: require("../../../assets/images/qwui-others_index.png")
        }
      },
      created() {
        this.isMobile = (_.getUrlParam("isMobile")+'').split("#")[0];
        this.corpId = _.getUrlParam("corp_id").split("#")[0];
        this.wxUserId = _.getUrlParam("wxUserId").split("#")[0];
        if(this.isMobile == 1){
          this.$router.push('scheme');
        }
      },
      methods: {
        savePhoneClick(){
          MtaH5.clickStat("summit");
          if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneNumber)) && !(/0\d{2,3}-\d{7,8}/.test(this.phoneNumber))){
            this.showPhoneTip = true;
          }else{
            var self = this;
            addExperienceInfo({"applicationPO.corpId": self.corpId,"applicationPO.mobile":self.phoneNumber,
                               "applicationPO.wxUserId":self.wxUserId},function(result){
                                self.userId = result.id;
                                self.showPhoneTip = false;
                                self.showDialogMask = true;
                              });
          }
        },
        hidePhoneTip(){
          this.showPhoneTip = false;
        },
        hideDialogMask(){
          this.showDialogMask = false;
        }
      },
      watch: {
        phoneNumber (val) {
          //监听用户输入手机号码操作
          if(val == ''){
            this.doInput = false;
          }else{
            this.doInput = true;
          }
        }
      },
      components: {
        dialog_mask_select
      },
  }
</script>

<style>
  .qwui-activty_background {
    position: absolute;
    height: 100%;
    background-color: #fff;
  }
  @media screen and (max-width: 1024px) {
    .qwui-activty_background {
      width: 100%;
    }
  }
  .qwui-activity_pic {
    width: 100%;
  }
  .qwui-activity_poster {
    margin-top: 13px;
    color: #666;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    line-height: 18px;
    text-align: center;
    letter-spacing: 1px;
  }
  .qwui-activity_box {
    width: 281px;
    height: 72px;
    margin: 44px auto 0px;
  }
  .qwui-activity_box_input {
    width: 281px;
    height: 40px;
    background: rgba(245,247,249,1);
    border-radius: 22px;
  }
  .qwui-activity_mobile {
    display: block;
    width: 176px;
    height: 40px;
    margin: 0 auto;
    font-size: 16px;
    font-family:PingFangSC-Medium;
    background: rgba(245,247,249,1);
  }
  .qwui-activity_mobile_center {
    text-align: center;
    font-weight: 700;
  }
  .qwui-activity_button {
    width: 281px;
    height: 40px;
    margin: 0px auto 0px;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    line-height: 40px;
    background-color: #4F8EFF;
    border-radius: 22px;
    box-shadow: 0px 5px 13px 0px rgba(109,183,251,0.46)
  }
  .qwui-activity_tip {
    text-align: center;
  }
  .qwui-activity_tip_dot {
    display: inline-block;
    width: 3px;
    height: 3px;
    margin-bottom: 3px;
    background-color: #F25F5F;
    border-radius: 50%;
  }
  .qwui-activity_tip_text {
    display: inline-block;
    height: 32px;
    line-height: 32px;
    font-size: 11px;
    color: #F25F5F;
    font-family: PingFangSC-Regular;
  }
</style>

