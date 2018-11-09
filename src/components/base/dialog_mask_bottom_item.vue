<template>
  <a class="qwui-dialog_bottom_btn qwui-dialog_bottom_btn_default"
     :class="className"  @click="dialogBtnClick">{{name}}</a>
</template>

<script>
  export default {
    name: "dialog_mask_item",
    props: {
      name: String,
      className: String,
    },
    data() {
      return {

      }
    },
    methods: {
      dialogBtnClick() {
        this.$emit('dialogBtnClick')
      }
    }
  }
</script>

<style scoped>
  .qwui-overlay{
    opacity: 1;
  }
  .qwui-mask{
    position: fixed;
    z-index: 10;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.2);
  }
  .qwui-dialog_bottom_header{
    position: relative;
    padding: 18px 0;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .qwui-dialog_bottom_header:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }
  .qwui-dialog_bottom{
    position: fixed;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 80%;
    margin: 0 auto;
    border-radius: 3px;
    text-align: center;
    background-color: #fff;
    overflow: hidden;
  }
  .qwui-dialog_bottom_btn_default{
    color:rgba(51,51,51,1);
  }
  .qwui-dialog_bottom_title {
    font-size: 14px;
    color: grey;
    font-weight: 400;
    line-height: 28px;
  }
  .qwui-dialog_bottom_footer {
    position: relative;
    line-height: 48px;
    font-size: 14px;
    background: #F6F6F6;
  }
  .qwui-dialog_bottom_btn {
    display: block;
    background: white;
    position: relative;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    color:rgba(51,51,51,1);
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    cursor: pointer;
  }
  .qwui-dialog_bottom_btn_primary{
    color:red;
  }
  .qwui-dialog_bottom_footer .qwui-dialog_bottom_btn:last-child:after{
    border: none!important;
  }
  .qwui-dialog_bottom_btn:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    color: #D5D5D6;
    transform-origin: 0 0;
    transform: scaleY(0.5);
  }

</style>
