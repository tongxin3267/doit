<!--by zengjiaying 20180518-->
<template>
<div class="qwui-writeAssignBox">
  <div class="qwui-writeAssign">
    <div class="qwui-writeAssign_border">
      <p class="signed_tit" v-if="assignVipGold">请工整书写您的签名</p>
      <p class="signed_tips" v-if="!assignVipGold">手写签名仅VIP可用，请联系管理员升级</p>
      <div class="qwui-writeAssign_canvas" id="writeAssignCanvas"></div>
      <div class="qwui-btn_writeAssign">
        <div class="fl">
          <span class="btn_writeAssign btn_writeAssign_default" @click="clearCanvas">清除</span>
        </div>
        <div class="fr">
          <span class="btn_writeAssign btn_writeAssign_default" v-if="assignVipGold" @click="cancelCanvas">取消</span>
          <span class="btn_writeAssign btn_writeAssign_primary" v-if="assignVipGold"
                @click="saveCanvasToURL">保存</span>
          <span class="btn_writeAssign btn_writeAssign_primary" v-if="!assignVipGold" @click="cancelCanvas">返回</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import {isVipSilver} from '@/assets/js/vip-portal'
  const PAGEX = 26
  const PAGEY = 100
  export default {
    name: "qw_assign_box",
    props: {
      imgUrl: {
        type:String,
        default:''
      },
      isFree: {
        type: String
      }
    },
    data() {
      return {
        myEntity: {
          width: window.innerWidth-PAGEX,
          height: window.innerHeight-PAGEY,
        },
        ongoingTouches:[],      // 当前活动的触摸点
        canvasLeft:0,
        canvasTop:0,
        assignVipGold: false
      }
    },
    created() {
      if (this.isFree == "1") {    // 自由流程判断是否金卡VIP
        this.assignVipGold = isVipSilver(interfaceCode.INTERFACE_CODE_FORM);
      } else {
        this.assignVipGold = true;
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        // 创建离屏canvas
        this.myEntity.offscreenCanvas = document.createElement("canvas");
        this.myEntity.offscreenCanvas.width = this.myEntity.width;
        this.myEntity.offscreenCanvas.height = this.myEntity.height;
        this.myEntity.offscreenContext = this.myEntity.offscreenCanvas.getContext("2d");
        this.myEntity.offscreenContext.rect(0,0,this.myEntity.width,this.myEntity.height);
        this.myEntity.offscreenContext.fillStyle="#ffffff";
        this.myEntity.offscreenContext.fillRect(0,0,this.myEntity.width,this.myEntity.height);
        // 路径样式
        this.myEntity.offscreenContext.strokeStyle = "#000000";
        this.myEntity.offscreenContext.lineJoin = "round";
        this.myEntity.offscreenContext.lineCap = "round"
        this.myEntity.offscreenContext.lineWidth = 5;

        this.$nextTick(function () {
          let $canvasWrap = document.getElementById('writeAssignCanvas')
          $canvasWrap.appendChild(this.myEntity.offscreenCanvas)
          this.canvasLeft = $canvasWrap.offsetLeft
          this.canvasTop = $canvasWrap.offsetTop
          this.drawImage()
          this.startup()
        })
      },
      // 有签名，则绘制出来
      drawImage() {
        let self = this
        if(this.imgUrl.length<=7186) {return}
        let img = new Image()
        img.onload = function () {
          self.myEntity.offscreenContext.drawImage(img,0,0)
        }
        img.src = this.imgUrl
      },
      // 设置事件处理器
      startup() {
        let el = document.getElementsByTagName("canvas")[0];
        el.addEventListener("touchstart", this.handleStart, false);
        el.addEventListener("touchend", this.handleEnd, false);
        el.addEventListener("touchmove", this.handleMove, false);
      },
      // 跟踪触摸行为
      handleStart(e) {
        e.preventDefault()
        let touches = e.changedTouches      // 获取改变中的触摸点列表
        for(let i=0;i<touches.length;i++){
          let value = touches[i]
          this.ongoingTouches.push(value)
        }
      },
      // 对触摸行为的结束进行处理
      handleEnd(e) {
        e.preventDefault()
        let ctx = this.myEntity.offscreenContext
        let touches = e.changedTouches      // 获取改变中i的触摸点列表
        for(let i=0;i<touches.length;i++){
          ctx.beginPath();
          ctx.moveTo(this.ongoingTouches[i].clientX-this.canvasLeft , this.ongoingTouches[i].clientY-this.canvasTop)
          ctx.lineTo(touches[i].clientX-this.canvasLeft, touches[i].clientY-this.canvasTop)
          ctx.closePath();
          ctx.stroke();
          this.ongoingTouches.splice(i,1);
        }
      },
      // 当触摸移动时绘制
      handleMove(e) {
        e.preventDefault()
        let ctx = this.myEntity.offscreenContext
        let touches = e.changedTouches      // 获取改变中的触摸点列表
        for(let i=0;i<touches.length;i++){
          let idx = this.ongoingTouchIndexById(touches[i].identifier)
          ctx.beginPath();
          ctx.moveTo(this.ongoingTouches[idx].clientX-this.canvasLeft, this.ongoingTouches[idx].clientY-this.canvasTop)
          ctx.lineTo(touches[i].clientX-this.canvasLeft, touches[i].clientY-this.canvasTop);
          ctx.closePath();
          ctx.stroke();
          this.ongoingTouches.splice(idx, 1, touches[i]);
        }
      },
      // 清除画板
      clearCanvas() {
        this.myEntity.offscreenContext.clearRect(0,0,this.myEntity.width,this.myEntity.height)
        this.myEntity.offscreenContext.rect(0,0,this.myEntity.width,this.myEntity.height);
        this.myEntity.offscreenContext.fillStyle="#fff";
        this.myEntity.offscreenContext.fillRect(0,0,this.myEntity.width,this.myEntity.height);
      },
      // 查询正在进行的触摸行为
      ongoingTouchIndexById(idToFind) {
        for (let i=0; i<this.ongoingTouches.length; i++) {
          var id = this.ongoingTouches[i].identifier;
          if (id == idToFind) {
            return i;
          }
        }
        return -1;    // not found
      },
      // 保存签名
      saveCanvasToURL() {
        let imageUrl = this.myEntity.offscreenCanvas.toDataURL('image/png')
        let isWriteSign = true   // 是否有签名 false:没有
        if(imageUrl.length<=7186) {
          isWriteSign=false;
          _.tooltips_succeed('请输入签名', true, "", 3000);
          return
        }
        this.$emit('saveCanvasToURL',{imageUrl,isWriteSign})
      },
      // 取消签名
      cancelCanvas() {
        this.clearCanvas()
        this.$emit('cancelCanvas')
      }
    },
  }
</script>

<style scoped>
  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .signed_tit {
    padding-top: 10px;
    margin: 0 15px;
    font-size: 14px;
    color: #999;
  }

  .signed_tips {
    margin: 0 15px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #D17437;
    background-color: #FDF9DB;
  }

  .qwui-writeAssignBox {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    padding: 5px;
    box-sizing: border-box;
    background-color: #7a7a7a;
  }

  .qwui-writeAssign {
    width: 100%;
    height: 100%;
    padding: 5px;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: #fff;
  }

  .qwui-writeAssign_border {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px #bbb dashed;
    border-radius: 5px;
  }

  .qwui-writeAssign_canvas {
    box-sizing: border-box;
  }

  .qwui-btn_writeAssign {
    position: absolute;
    bottom: 10px;
    padding: 0 15px;
    width: 100%;
    box-sizing: border-box;
  }

  .btn_writeAssign {
    display: inline-block;
    position: relative;
    padding: 0 20px;
    line-height: 30px;
    font-size: 16px;
    border-radius: 5px;
  }

  .btn_writeAssign:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }

  .btn_writeAssign_default {
    color: #333;
    background-color: #FBFAFC;
  }

  .btn_writeAssign_default:after {
    border: 1px solid #D6D5D6;
  }

  .btn_writeAssign_primary {
    color: #fff;
    background-color: #2F7DCD;
  }

  .btn_writeAssign_primary:after {
    border: 1px solid #0D68C6;
  }
</style>
