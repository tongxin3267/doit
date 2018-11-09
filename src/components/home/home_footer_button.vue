<template>
  <div class="qwui-footer_input_box">
    <div class="qwui-footer_height"></div>
    <div class="qwui-footer_tabbar qwui-border_top">
      <div class="qwui-footer_tabbar_item" @click="footerNavClick(footernavdata.text)">
        <slot></slot>
        <p style="display: inline-block;">{{footernavdata.text}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'footer_nav',
    props:["footernavdata"],
    data(){
      return {
      }
    },
    methods:{
      footerNavClick(text){
        this.$emit("footerNavMsg",text);
      }
    }
  }

</script>

<style type="text/css">
  .qwui-footer_input_box{
    position: relative;
  }
  .qwui-footer_height{
    height:50px
  }
  .qwui-footer_tabbar {
    display: flex;
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }
  .qwui-footer_tabbar_item {
    display: block;
    flex: 1;
    font-size: 16px;
    color: #434343;
    text-align: center;
    line-height: 49px;
  }
</style>
