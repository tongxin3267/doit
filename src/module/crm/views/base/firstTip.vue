<template>
  <div class="qwui-mask">
	  <div class="qwui-mask_content">
	  	<img src="../../../../assets/images/crm/index_popup.png" class="qwui-tip_img">
	  	<div class="qwui-go" @click="enterMyCard">
	  		<span class="qwui-tip">详&nbsp细&nbsp了&nbsp解</span>
	  	</div>
      <div class="qwui-close">
        <img src="../../../../assets/images/crm/icon_btn_close.png" class="qwui-close_icon" @click="closeTip">
      </div>
	  </div>
  </div>
</template>

<script>
export default {
  name: '',
  methods:{
    closeTip(){
      this.$emit('closeTip');
    },
    enterMyCard(){
      this.$router.push({path: '/callingCard'});
    }
	}
}
</script>

<style lang="scss" scoped>
.qwui-mask {
	position: fixed;
	top:0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0,.4);
  z-index: 100;
}
.qwui-mask_content {
	position: absolute;
	top: 100px;
	left: 50%;
  overflow: hidden;
	transform: translate(-50%,0);
}
.qwui-tip_img {
	width: 321px;
	height: 268px;
}
.qwui-go {
	position: absolute;
  width: 217px;
	height: 36px;
	bottom: 24px;
	left: 50%;
	transform: translate(-50%,0);
	background-color: rgba(85,133,240,1);
	box-shadow:0px 8px 14px 0px rgba(85,133,240,0.3);
	border-radius:26px;
	text-align: center;
	line-height: 36px;
}
.qwui-tip {
	color: #fff;
	font-size: 15px;
	font-family:PingFangSC-Medium;
}
.qwui-close {
	position: absolute;
	top: 0px;
	right: 0px;
  padding: 5px;
  font-size: 0;
  .qwui-close_icon {
    width: 16px;
	  height: 16px;
  }
}
 
</style>


