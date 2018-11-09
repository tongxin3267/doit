<template>
  <div>
    <div class="qwui-nav_footer_height"></div>
    <div class="qwui-nav_footer_fix qwui-border_top">
      <slot></slot>
    </div>
  </div>
</template>
<style>
  .qwui-nav_footer_height{
    height: 49px;
  }
  .qwui-nav_footer_fix{
    position: fixed;
    z-index: 2;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    padding-top: 5px;
    background-color: #FFF;
  }

</style>
