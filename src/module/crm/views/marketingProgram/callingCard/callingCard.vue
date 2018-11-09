<template>
  <div class="wrap" @click.stop.prevent>
    <div class="img-content">
      <div id="capture">
        <card :cardList='cardList'></card>
        <div class="border"></div>
        <div class="barcode-content">
          <img class="barcode" :src='wxappQrcodePath' width="120" height="120">
          <div class="tip">微信扫码或长按识别小程序码</div>
        </div>
      </div>
    </div>
    <!-- 截图图片存放 -->
    <transition name="slide-fade">
      <div class="mask-img" v-show='showCardImg'>
        <div class="mask-main">
          <img :src='baseULR' alt="" width="" height="" id="imgcapture">
        </div>
        <div class="tips">
          <span class="icon-top"></span>
          长按图片保存名片到相册，分享朋友圈选择该照片
        </div>
        <span class="mask-close" @click="cardImg">
            <i></i>
        </span>
      </div>
    </transition>

    <div class="share">
      <div class="share-item" @click="editCardLink">
        <div class="icon share-card"></div>
        <div class="text">编辑名片</div>
      </div>
      <div class="share-item" @click="saveImg">
        <div class="icon share-friends"></div>
        <div class="text">生成朋友圈分享图</div>
      </div>
      <!-- <div class="share-item">
        <div class="icon share-wechat" @click="shareLink"></div>
        <div class="text">发到微信</div>
      </div> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {images_upload} from '@/utils/uploadImages.js';
import html2canvas from 'html2canvas';
import card from './components/card'
import {getCard} from '../../../api/smallProgram/getBata.js'
import wx from 'weixin-js-sdk'
  export default {
    data() {
      return {
        cardList:{},//名片数据
        baseULR:'',//截图img的src
        showCardImg:false,//浮层截屏图片隐藏
        canvasFlag: true,//是否首次截屏
      }
    },
    components: {
      card,
    },
    created () {
      this.getCardData()
    },
    computed: {
      //跨域图片转同域
      wxappQrcodePath(){
        if(this.cardList.wxappQrcodePath){
          const wxappQrcodePath = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action?imgUrl=" + _.filterCompressURL(this.cardList.wxappQrcodePath)
          return wxappQrcodePath
        }
      },
    },
    methods: {
      //获取我的名片数据
      getCardData(){
        getCard((res) => {
          this.cardList = Object.assign({},this.cardList,res.card)
        })
      },
      //点击编辑名片页面
      editCardLink(){
        this.$router.push({path:'/editCard'})
      },
      //生成分享朋友圈图片
      saveImg(){
        if(this.canvasFlag){
          // 第一次生成图片，必须把滚动拉到顶端
          window.scroll(0, 0);
          this.capture('#capture',() => {
            this.canvasFlag = false
            this.cardImg()
          })
        }else{
          this.cardImg()
        }
      },
      //分享链接给朋友
      shareLink(){
        if(_.isQiyeweixinApp()){
          if(this.canvasFlag){
            this.capture('#capture',() => {
              this.canvasFlag = false
              //base64地址转线上地址再分享
              images_upload(this.baseULR,this.agent,(res) => {
                this.shareWechatMessage(res)
              })
            })
          }else{
            images_upload(this.baseULR,this.agent,(res) => {
              this.shareWechatMessage(res)
            })
          }
        }else{
          _.alert("提示","请在企业微信使用");
          return
        }
      },
      shareWechatMessage(res){
        wx.invoke(//自定义转发到微信
          "shareWechatMessage", {
              title: '', // 分享标题
              desc: '', // 分享描述
              link: window.location.href, // 分享链接
              imgUrl: _.filterCompressURL(res.imgurl) // 分享封面
          }, function(res) {
              if (res.err_msg == "shareWechatMessage:ok") {
              }
          }
        )
      },
      //点击关闭图片截图
      cardImg(){
        this.showCardImg = !this.showCardImg
      },
      // 根据window.devicePixelRatio获取像素比
      DPR(){
        if (window.devicePixelRatio && window.devicePixelRatio > 1) {
          return window.devicePixelRatio;
        }
        return 1;
      },
      //点击截图
      capture(selector,callBack){
        _.showLoading('')
        // 获取想要转换的 DOM 节点
        const dom = document.querySelector(selector)
        const domCSS = window.getComputedStyle(dom)
        // DOM 节点计算后宽高
        const width = parseInt(domCSS.width)
        const height = parseInt(domCSS.height)
        // 获取像素比
        const scaleBy = this.DPR()
        const canvas = document.createElement('canvas');
        // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
        canvas.width = width * scaleBy
        canvas.height = height * scaleBy
        // 设定 canvas css宽高为 DOM 节点宽高
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        //改变img图片大小
        const imgcapture = document.querySelector("#imgcapture")
        imgcapture.width = width
        imgcapture.height = height
        // 获取画笔
        const context = canvas.getContext('2d')
        // 将所有绘制内容放大像素比倍
        context.scale(scaleBy, scaleBy)
        const opts = {
          scale: scaleBy,
          canvas: canvas,
          width: width,
          height: height,
          useCORS: true // 【重要】开启跨域配置
        }
        html2canvas(dom,opts).then(canvas => {
          const context = canvas.getContext('2d')
          // document.body.appendChild(canvas)
          this.baseULR = canvas.toDataURL()
          _.hideLoading('')
          callBack()
        });
      },
    }
  }
</script>

<style scoped lang="scss">
@import '../../../crmBase.scss';
.img-content{
  margin: rem(20) rem(14) 0;
  .border{
    width: 100%;
    border: 1px dashed #E4E7ED;
  }
  .barcode-content{
    padding: rem(16) 0 rem(6);
    text-align: center;
    background:rgba(255,255,255,1);
    box-shadow:0 rem(2) rem(6) 0 rgba(227,228,232,0.3);
    border-radius:rem(4);
    .barcode{
      width: rem(120);
      height: rem(120);
      margin-bottom: rem(14);
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      border: 0;
    }
    .tip{
      @include content-item(18,18,#B2B9C8,13);
    }
  }
}
// 弹窗动画
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter,.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
/* 模糊弹窗 */
.mask-img{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgb(51, 51, 51);
  z-index: 10;
  .mask-main{
    position: absolute;
    top: 20px;
    left: rem(15);
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  .tips{
    position: absolute;
    bottom: 131px;
    width: 100%;
    @include content-item(20,20,#fff,14);
    .icon-top{
      display: inline-block;
      width: 13px;
      height: 13px;
      background: url('../../../../../assets/images/crm/icon-top.png');
      background-size: 100%;
    }
  }
  .mask-close{
    position: absolute;
    bottom: rem(20);
    left: 50%;
    i{
      position: absolute;
      bottom: 30px;
      width: rem(18);
      height: rem(18);
      margin-left: rem(-10);
      background: url('../../../../../assets/images/crm/crm_ico10.png');
      background-size: 100% 100%;
    }
  }
}
.share{
  display: flex;
  margin: rem(72) 0 rem(48);
  .share-item{
    flex: 1;
    text-align: center;
    color: #7A7C80;
    font-size: rem(13);
    .icon{
      width: rem(32);
      height: rem(32);
      margin: 0 auto;
      background: url('../../../../../assets/images/crm/crm_share.png') center no-repeat;
      background-size: 300%;
      &.share-card{
        background-position: 0 0;
      }
      &.share-friends{
        background-position: rem(-64) 0;
      }
      &.share-wechat{
        background-position: rem(-32) 0;
      }
    }
    .text{
      height: rem(18);
      line-height: rem(18);
      margin-top: rem(12);
    }
  }
}
</style>
