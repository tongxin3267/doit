<template>
  <div class="qwui-action-button" :class="customClass">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "flow_action_btn_group",
    props: {
      customClass: String,
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .qwui-action-button {
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    display: flex;
    line-height: 50px;
    height: 50px;
    vertical-align: middle;
    background-color: #fff;
  }
  .qwui-action-button:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  @media screen and (min-width: 1024px) {
    .qwui-action-button {
      width: 740px;
      margin: 0 auto;
    }
  }
</style>
