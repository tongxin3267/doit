<template>
  <div class="qwui-btn_box" :class="{active:fixed}">
    <div class="qwui-btn_tab">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default{
    name: "buttonGroup",
    props:{
      fixed: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
      }
    },
  }

</script>
<style scoped>
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
</style>
