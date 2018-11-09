<template>
  <div class="qwui-loading_mask" v-show="show">
    <div class="qwui-loading">
      <div class="qwui-loading_box">
        <div class="qwui-loading_icon_loading" v-if="filterLoading">
          <span></span><span></span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div v-else :class="filterIcon"></div>
        <p class="qwui-loading_tips">{{$t(this.text)}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loading',
    props: {
      show:Boolean,
      icon:String,
      text:String
    },
    data() {
      return {
        dataBase:dataBase
      }
    },
    computed:{
      filterLoading(){
        return this.icon=='icon_loading'? true:false;
      },
      filterIcon(){
        return this.icon? this.icon:"";
      }
    }
  }
</script>
<style>
  .qwui-loading_mask{
    position: fixed;
    z-index:12;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
  }
  .qwui-loading{
    position: absolute;
    z-index:100;
    top: 50%;
    left: 50%;
    min-width: 84px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.6);
    border-radius: 5px;
    opacity: 1;
  }
  .qwui-loading_box{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  @-webkit-keyframes fade{
    from{opacity:1;}
    to{opacity:0.1;}
  }
  .qwui-loading_icon_ok{
    display: inline-block;
    position: relative;
    width: 36px;
    height: 30px;
    margin-top: 11px;
    background: url(../../assets/images/icon_ok.png) center no-repeat;
    background-size: contain;
  }
  .qwui-loading_icon_loading{
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    margin-top: 11px;
  }
  .qwui-loading .qwui-loading_icon_loading span{
    position: absolute;
    top: 40%;
    left: 45%;
    width: 10%;
    height: 30%;
    -webkit-animation: fade 1s linear infinite;
    -webkit-border-radius: 10px;
    background: #fff;
    opacity: 0;
  }
  .qwui-loading_icon_loading span:nth-child(1){-webkit-transform:rotate(0deg) translate(0,-142%);-webkit-animation-delay:0s;}
  .qwui-loading_icon_loading span:nth-child(2){-webkit-transform:rotate(30deg) translate(0,-142%);-webkit-animation-delay:-0.9167s;}
  .qwui-loading_icon_loading span:nth-child(3){-webkit-transform:rotate(60deg) translate(0,-142%);-webkit-animation-delay:-0.833s;}
  .qwui-loading_icon_loading span:nth-child(4){-webkit-transform:rotate(90deg) translate(0,-142%);-webkit-animation-delay:-0.75s;}
  .qwui-loading_icon_loading span:nth-child(5){-webkit-transform:rotate(120deg) translate(0,-142%);-webkit-animation-delay:-0.667s;}
  .qwui-loading_icon_loading span:nth-child(6){-webkit-transform:rotate(150deg) translate(0,-142%);-webkit-animation-delay:-0.5833s;}
  .qwui-loading_icon_loading span:nth-child(7){-webkit-transform:rotate(180deg) translate(0,-142%);-webkit-animation-delay:-0.5s;}
  .qwui-loading_icon_loading span:nth-child(8){-webkit-transform:rotate(210deg) translate(0,-142%);-webkit-animation-delay:-0.41667s;}
  .qwui-loading_icon_loading span:nth-child(9){-webkit-transform:rotate(240deg) translate(0,-142%);-webkit-animation-delay:-0.333s;}
  .qwui-loading_icon_loading span:nth-child(10){-webkit-transform:rotate(270deg) translate(0,-142%);-webkit-animation-delay:-0.25s;}
  .qwui-loading_icon_loading span:nth-child(11){-webkit-transform:rotate(300deg) translate(0,-142%);-webkit-animation-delay:-0.1667s;}
  .qwui-loading_icon_loading span:nth-child(12){-webkit-transform:rotate(330deg) translate(0,-142%);-webkit-animation-delay:-0.0833s;}

  .qwui-loading_tips{
    flex: 1;
    margin: 11px;
    font-size: 13px;
    color:rgba(255,254,254,1);
    line-height: 21px;
    white-space: nowrap;
    word-break: keep-all;
  }
</style>
