<template>
  <div class="wrap">
    <div class="card-content">
      <card :cardList='cardList'></card>
    </div>
    <div class="editor">
      <div class="edit-item">
        <div class="text">头像</div>
        <div class="editDiv">
          <img :src="avatarURl" class="avatar">
          <span class="openFile"></span>
          <span class="edit-avatar">
            <input v-if="isMobile" @click.prevent="chooseImageFile($event)"  type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput"/>
            <input v-else @change="uploadImages" type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="cardInput"/>
          </span>
        </div>
      </div>
      <div class="edit-item">
        <div class="text">职位</div>
        <input type="text" class="editText" v-model="cardList.position">
      </div>
      <div class="edit-item">
        <div class="text">手机号</div>
        <input type="tel" class="editText" v-model="cardList.cellPhone">
      </div>
      <div class="edit-item">
        <div class="text">电话</div>
        <input type="tel" class="editText" v-model="cardList.phone">
      </div>
      <div class="edit-item">
        <div class="text">邮箱</div>
        <input type="email" class="editText" v-model="cardList.email">
      </div>
      <div class="edit-item">
        <div class="text">微信号</div>
        <input type="text" class="editText" v-model="cardList.wxNumber">
      </div>
      <div class="edit-item">
        <div class="text">公司地址</div>
        <!-- <input type="text" class="editText" v-model="cardList.companyLocation"> -->
        <textarea class="editText qwui-company_adress" v-model="cardList.companyLocation"></textarea>
      </div>
      <!-- v-model="avatar" -->
    </div>
    <div class="new-btn">
      <div class="btn defult-btn" @click="back">取消</div>
      <div class="btn primary-btn" @click="submitCardData">确定</div>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
import {qw_uploadImages,wx_chooseImage} from '@/utils/uploadImages.js';
import card from './components/card.vue';
import {getCard,submitCard} from '../../../api/smallProgram/getBata.js'
import { setTimeout } from 'timers';

let cardData = {}//保存编辑card的数据
  export default {
    data() {
      return {
        cardList:{},
        agent:'crm',
        isMobile:false,//默认不是手机端
        avatarURl:''
      }
    },
    components: {
      card,
    },
    created () {
      this.getCardData()
      // 判断是否手机终端setDataForWeixinValue
      if(_.isHefeixin()|| _.isWeChatApp()||_.isQiyeweixinApp()){
        this.isMobile=true;
      }
    },
    methods: {
      //获取我的名片数据
      getCardData(){
        getCard((res) => {
          this.cardList = Object.assign({},this.cardList,res.card)
          this.avatarURl = _.filterCompressURL(this.cardList.avatarPicPath)
        })
      },
      //PC上传图片
      uploadImages(event){
        qw_uploadImages(event,this.agent,(result) => {
          this.avatarURl = _.filterCompressURL(result.imgurl)
          this.$set(this.cardList,'avatarPicPath',result.imgurl)
        });
      },
      //微信端上传图片
      chooseImageFile(){
        wx_chooseImage(this.agent,(res) => {
          this.avatarURl = _.filterCompressURL(res[0])
          this.$set(this.cardList,'avatarPicPath',res[0])
        },1);
      },
      //返回上一页
      back(){
        this.$router.go(-1)
      },
      //验证邮箱格式、手机格式、电话
      checkType:function (string,type){
        if(type==1 && !/(^1[3|4|5|8|7][0-9]\d{4,8})$/.test(string)){
          return false;
        }
        if(type==2 && !/(^(\d{3,4}-?)?\d{7,8})$/.test(string)){
          return false;
        }
        if(type==3 && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(string)){
          return false;
        }
        return true;
      },
      //提交编辑卡片数据
      submitCardData(){
        if(this.cardList.cellPhone && !this.checkType(this.cardList.cellPhone,1)){
          _.alert("提示","请输入正确的手机号码");
          return
        }
        if(this.cardList.phone && !this.checkType(this.cardList.phone,2)){
          _.alert("提示","请输入正确的电话号码");
          return
        }
        if(this.cardList.email && !this.checkType(this.cardList.email,3)){
          _.alert("提示","请输入正确的邮箱");
          return
        }

        cardData = {
          'card.id':this.cardList.id,
          'card.position':this.cardList.position,
          'card.cellPhone':this.cardList.cellPhone,
          'card.phone':this.cardList.phone,
          'card.avatarPicPath':this.cardList.avatarPicPath,
          'card.companyLocation':this.cardList.companyLocation,
          'card.email':this.cardList.email,
          'card.wxNumber':this.cardList.wxNumber,
        }
        submitCard(cardData,(res) => {
          setTimeout(() => {
            this.$router.push({path:'/callingCard'})
          },1500)
        })
      }
    }
  }
</script>


<style scoped lang="scss">
@import '../../../crmBase.scss';
.card-content{
  margin: rem(16) rem(15) 0;
}
.editor{
  padding-top: rem(4);
  margin: rem(12) 0 rem(50);
  background:rgba(255,255,255,1);
  box-shadow:0 0 rem(4) 0 rgba(206,209,219,0.4);
  border-radius:rem(4);
  .edit-item{
    position: relative;
    display: flex;
    height: rem(48);
    line-height: rem(48);
    margin: 0 rem(15);
    color: #0A1735;
    font-size: rem(14);
    &::before{
      content: " ";
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      border-bottom: 1px solid #F7F8FA;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      z-index: 2;
    }
    .editDiv{
      position: relative;
      flex: 1;
      padding-top: rem(8);
      text-align: right;
      .openFile{
        position: absolute;
        top: 50%;
        right: 0;
        width: rem(16);
        height: rem(16);
        margin-top: rem(-8);
        background: url('../../../../../assets/images/crm/icon_go.png') center no-repeat;
        background-size: 100%;
      }
      .avatar{
        width: rem(32);
        height: rem(32);
        margin-right: rem(16);
        border-radius: 50%;
      }
      .edit-avatar{
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        z-index: 1;
        .cardInput{
          width: 50px;
          height: 48px;
          opacity: 0;
        }
      }
    }
    .text{
      flex: 1;
    }
    .editText{
      flex: 2;
      height: rem(20);
      line-height: rem(20);
      padding-top: rem(14);
      font-size: rem(14);
      font-family: 'PingFangSC-Regular';
      text-align: right;
    }
    .qwui-company_adress {
      resize: none;
      border: none;
      text-align: left;
    }
  }
}
.new-btn{
  position: fixed;
  display: flex;
  bottom: 0;
  width: 100%;
  z-index: 2;
  .btn{
    flex: 1;
    height: rem(50);
    line-height: rem(50);
    text-align: center;
    &.defult-btn{
      background: #fff;
      color: #7A7C80;
      font-size: rem(15);
    }
    &.primary-btn{
      background: #5077AA;
      color: #fff;
      font-size: rem(15);
    }
  }
}
</style>
