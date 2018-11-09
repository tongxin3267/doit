<template>
  <i v-if="isMobile || showIcon" click="barCode" class="qwui-icon_faQrcode" @click="clickCode"></i>
</template>
<script>
  import wx from 'weixin-js-sdk';
  export default {
    props:{
      value:{
      type: String,
      required: true
      },
      type:{
        type: String,
        required: false
      },
			showIcon:{
      	type:Boolean,
				default:false
			}
    },
    data() {
      return {
        isMobile: false,
      }
    },
    created: function () {
      if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
        this.isMobile = true;
      }
    },
    methods: {
      clickCode() {
        if (_.isHefeixin()) {
          this.getQRContent('getQRContentBackFunc');
        } else {
          var self=this;
          wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              if (self.type == "expresslist") {//快递单据扫描
                result=self.value+result+ '\n';
                if (result.length > 500) {
                  return;
                }
                self.$emit("backBarCode",result);
              }
            }
          });
        }
      },
      /**
       * 调取扫一扫接口
       * @param {Object} backFunc
       */
      getQRContent(backFunc){
        var d = {};
        d.backFunc = backFunc;
        if(_.isAndroid()){
          window.WebContainer.getQRContent(JSON.stringify(d));
        }else{
          navigator.WebContainer.getQRContent(JSON.stringify(d));
        }
      },
      getQRContentBackFunc(backJson) {
        var obj = JSON.parse(backJson);
        if (obj.status == '1') {
          var scanContent = obj.content;
          this.$emit("backBarCode",scanContent);
        } else {
          _.alert("",'未获取到扫码内容');
        }
      }
    }
  }
</script>
<style>
	/*.qwui-icon_faQrcode{*/
	/*position: relative;*/
	/*top: 0;*/
	/*bottom:0;*/
	/*margin: auto;*/
	/*width: 32px;*/
	/*height: 32px;*/
	/*background: url(../../assets/images/icon_Code_QR.png) no-repeat;*/
	/*!*background: url(../../assets/images/form_icon_scavenging.png) no-repeat;*!*/
	/*background-size: cover;*/
	/*}*/
	.qwui-icon_faQrcode{
		display: inline-block;
		position: absolute;
		top:50%;
		right:0;
		margin-right:12px;
		width: 22px;
		height: 22px;
		background: url(../../assets/images/form_icon_scavenging.png) no-repeat center;
		background-size: cover;
		vertical-align: text-bottom;
		transform: translateY(-50%);
	}
	.qwui-icon_faQrcode:before{
		content: " ";
		position: absolute;
		top: 50%;
		height: 16px;
		right: 34px;
		border-left: 1px solid #e5e5e5;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
		transform: translateY(-50%);
		z-index: 2;
	}

</style>
