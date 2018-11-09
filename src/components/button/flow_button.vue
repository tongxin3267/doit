<template>
  <div class="qwui-btn_box" :class="{active:classes}" v-if="buttonList">
    <div class="qwui-btn_tab">
      <span class="qwui-btn qwui-btn_default" v-if="index<3" :class="{'active':buttondata.primaryList.length==0 && buttondata.defaultList.length==1,
      'unoperation':item.unOperation}" v-for="(item,index) in buttondata.defaultList" @click.stop.prevent="buttonClick(item)">{{$t(item.name)}}</span>
      <span class="qwui-btn qwui-btn_primary" v-if="index==0"
            v-for="(item,index) in buttondata.primaryList" @click.stop.prevent="buttonClick(item)">{{$t(item.name)}}</span>
    </div>
  </div>
</template>
<script>
  export default{
    name: "flowButton",
    props:['buttondata'],
    data(){
      return {
      }
    },
    computed: {
      buttonList(){
        if(this.buttondata && (this.buttondata.primaryList || this.buttondata.defaultList)){
          return this.buttondata.primaryList.length || this.buttondata.defaultList.length;
        }
        return false;
      },
      classes:function(){
        if(this.buttondata && this.buttondata.class){
          return this.buttondata.class=="active"? true:false;
        }
        return false;
      }
    },
    methods:{
      buttonClick:function(item){
        if(item.callBack){
          item.callBack(item.value?item.value:'0');
        }
      }
    }
  }

</script>
<style>
  .qwui-btn_box{
    position: relative;
    width: 100%;
    bottom: 0;
    z-index: 3;
  }
  .qwui-btn_box.active{
    position: fixed;
    background: #fff;
  }
  .qwui-btn_tab{
    display: flex;
    padding: 8px 15px;
  }
  .qwui-btn{
    position: relative;
    display: block;
    flex: 1;
    box-sizing: border-box;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #fff;
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    cursor: pointer;
  }
  .qwui-btn.qwui-btn_primary{
    color:rgba(255,255,255,1);
    background:rgba(47,125,205,1);
  }
  .qwui-btn.qwui-btn_default{
    margin-right: 15px;
    color:rgba(51,51,51,1);
    background:rgba(251,250,252,1);
  }
  .qwui-btn.qwui-btn_default:last-child{
    margin-right: 0;
  }
  .qwui-btn.qwui-btn_default.active{
    margin-right: 0;
  }
  .qwui-btn.qwui-btn_default.unoperation{
    color:#bbb;
  }
  .qwui-btn_box.active:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .qwui-btn_default:after{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 199%;
    height: 200%;
    border: 1px solid #e5e5e5;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }
</style>
