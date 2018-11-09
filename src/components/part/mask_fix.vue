<template>
  <div class="qwui-mask_fix_box" v-show="showMask" :class="animatedType">
    <div class="qwui-mask_fix_bg" :style="{opacity:modalExtent}" :class="['mask-model_'+modalColor]" v-if="modal" @click="modelClick"></div>
    <div class="qwui-mask_body maskBody" :class="[bodyColor,bodyPosition]" :style="baseStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default {
    name:"maskFix",
    props:{
      show:{
        type:Boolean,
        required:false,
        default:false
      },
      position:{
        type:String,
        required:false,
        default:"top"
      },
      colorType: {
        type: String,
        required:false,
        default: 'FFF'
      },
      animated:{
        type:String,
        required:false,
        default:"none"
      },
      modal:{                            //是否需要遮罩层
        type:Boolean,
        required:false,
        default:false
      },
      modalExtent:{                    //遮罩层透明度
        type:Number,
        default:1
      },
      modalColor:{                    //遮罩层的背景颜色
        type:String,
        default:"FFF"
      },

    },
    data() {
      return{
        maskBodyHeight:"",    //内容高度
        animatedObj:{
          "none": false,
          "outBottom": true,
          "inBottom": true,
          "outRight": true,
          "inRight": true,
        }
      }
    },
    mounted(){
       this.$nextTick(() => {
          this.maskBodyHeight=document.querySelector(".maskBody").clientHeight;
        });
    },
    computed: {
      showMask(){
        if(_.isWeChatApp() && this.animatedObj[this.animated]){
          return true;
        }
        this.$nextTick(() => {
          this.maskBodyHeight=document.querySelector(".maskBody").clientHeight;
        });
        return this.show;
      },
      animatedType(){
        return this.animatedObj[this.animated]? this.animated:"none";
      },
      bodyColor(){
        return 'qwui-color_'+this.colorType;
      },
      bodyPosition(){
        return this.position;
      },
      baseStyle(){
        let screenHeight=window.innerHeight;
        return {"maxHeight":screenHeight+'px'}
      }
    },
    methods:{
      modelClick(){
        this.$emit("modelClick",true);
      }
    }
  }
</script>
<style scoped>
  .qwui-mask_fix_box{
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    z-index: 6;
    overflow: hidden;
  }
  .qwui-mask_fix_bg{
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    background: #fff;
  }
  .qwui-mask_body{
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .qwui-mask_body.top{
    height: 100%;
  }
  .qwui-mask_body.bottom{
    position: absolute;
    bottom: 0px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-mask_fix_box{
      width: 740px;
    }
  }
  .qwui-color_FFF{
    background: #fff;
  }
  .qwui-color_F7F7F7{
    background:rgba(247,247,247,1);
  }
  .mask-model_rgba{
    background:rgba(0,0,0,.2);
  }
  .qwui-mask_fix_box.none{
    transform: translateY(0);
    transform: translateX(0);
  }
  .qwui-mask_fix_box.outBottom{
    transition:transform .3s;
    transform: translateY(100%);
  }
  .qwui-mask_fix_box.inBottom{
    transition:transform .5s;
    transform: translateY(0);
  }
  .qwui-mask_fix_box.outRight{
    transition:transform .3s;
    transform: translateX(100%);
  }
  .qwui-mask_fix_box.inRight{
    transition:transform .5s;
    transform: translateX(0);
  }
</style>
