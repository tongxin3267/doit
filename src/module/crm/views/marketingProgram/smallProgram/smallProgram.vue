<template>
  <div class="wrap qwui-wrap">
    <div class="qwui-wrap_top">
      <div class="qwui-marketing_description">
        <h2 class="qwui-marketing_title">营销助手小程序</h2>
        <p class="qwui-marketing_content">
          基于微信小程序，通过企业产品、官网和个人智能名片，打造多渠道的社会化营销体系，利用数据实时了解客户的行为喜好及购买意向，让你的营销变得更智能，助您低成本高效率获客。
        </p>
        <p class="qwui-marketing_content qwui-space">
          无需添加微信好友，即可和客户一对一聊天，轻松跟进潜在机会。
        </p>
      </div>
      <div class="qwui-marketing_description qwui-nopadding">
        <h2 class="qwui-marketing_title">使用步骤</h2>
        <ul class="qwui-marketing_step qwui-tips_line">
          <li class="qwui-marketing_step_tip" v-for="(item,ind) in useStep" :key="ind">
            <img class="qwui-marketing_step_img" :src="item.stepNum" alt="营销助手使用步骤">
            <p class="qwui-marketing_content">{{item.stepDes}}</p>
          </li>
        </ul>
      </div>
      <div v-if="showOpenFlag" class="qwui-marketing_qrcode">
        <img class="qwui-marketing_img" :src="qrCodeImg" alt="二维码相片">
      </div>
    </div>  
    <div v-if="showOpenFlag" class="qwui-marketing_button">长按图片保存</div>
    <router-link v-if="!showOpenFlag" class="qwui-marketing_button qwui-marketing_allow" :to="{path:'/openAuthority',query:{wxUserId:userId}}" tag="div">无使用权限 联系管理员开通
      <img class="qwui-allow_arrow" src="../../../../../assets/images/crm/icon_step_go.png" alt="">
    </router-link>
  </div>
</template>


<script>
import { getSmallProgramQRcode } from '../../../api/smallProgram/getBata.js';
  export default {
    data() {
      return {
        useStep:[
          {
            stepNum: require('../../../../../assets/images/crm/icon_step_tips1.png'),
            stepDes: '保存小程序二维码'
          },
          {
            stepNum: require('../../../../../assets/images/crm/icon_step_tips2.png'),
            stepDes: '微信扫码或长按识别小程序码识别小程序'
          },
          {
            stepNum: require('../../../../../assets/images/crm/icon_step_tips3.png'),
            stepDes: '转发企业产品、官网信息或个人名片给客户'
          },
          {
            stepNum: require('../../../../../assets/images/crm/icon_step_tips4.png'),
            stepDes: '依据智能系统挖掘的客户行为喜好，及时跟进'
          }],
        showOpenFlag: false, //控制是否展示二维码
        qrCodeImg: '', //二维码图片
        userId: '' //当前用户的id
      }
    },
    created(){
      //获取用户的id
      this.userId = this.$route.query.wxUserId;
    },
    methods:{
      //获取二维码图片数据
      getQRcode(){
        getSmallProgramQRcode((res) => {
          if(!res.isPermission){
            this.showOpenFlag = false;
            // 获取用户id,创建会话接口需要
            this.userId = res.wxUserId;
            return;
          }
            this.showOpenFlag = true;
            this.qrCodeImg = _.filterCompressURL(res.wxappQrcodePath);
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .qwui-wrap {
    display: flex;
    position: absolute;
    height: 100%;
    flex-direction: column;
  }
  @media screen and (max-width: 1023px) {
    .qwui-wrap{
      width: 100%;
    }
  }
  .qwui-wrap_top{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
  .qwui-marketing_description {
    padding: 15px 10px;
    background-color: #fff;
    border-bottom: 1px solid #F7F8FA;
  }
  .qwui-nopadding {
    padding-bottom: 0;
  }
  .qwui-marketing_title {
    margin-bottom: 16px;
    font-size: 16px;
    font-family:PingFangSC-Medium;
    color: #0A1735;
    line-height: 22px;
  }
  .qwui-marketing_content {
    font-size: 14px;
    font-family:PingFangSC-Regular;
    color: #7A7C80;
    line-height: 20px;
  }
  .qwui-space {
    margin-top: 8px;
  }
  .qwui-marketing_step {
    position: relative;
    .qwui-marketing_step_tip {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-family:PingFangSC-Regular;
      z-index: 1;
      .qwui-marketing_step_img {
        width: 12px;
        height: 12px;
        margin-right: 8px;
      }
    }
  }
  .qwui-tips_line::after {
    content: "";
    position: absolute;
    top: 11px;
    left: 5px;
    width: 1px;
    height: 100px;
    background-color: #D8E4FF;
  }
  .qwui-marketing_qrcode {
    position: relative;
    flex-grow: 1;
    background-color: #fff;
    box-shadow: 0 0 4px 0 rgba(206,209,219,0.4);
    border-radius: 8px 8px 0 0;
  }
  .qwui-marketing_img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 139px;
    transform: translate(-50%,-50%);
  }
  .qwui-marketing_button {
    width: 100%;
    height: 30px;
    font-size: 15px;
    font-family:PingFangSC-Medium;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #5077AA;
  }
  .qwui-marketing_allow {
    height: 49px;
    line-height: 49px;
    background-color: #B2B9C8;
  }
  .qwui-allow_arrow {
    width: 16px;
    height: 16px;
    vertical-align: text-bottom;
  }
</style>
