<template>
  <div style="position: absolute;bottom: 0;width: 100%;">
    <div class="footerButton qwui-border_top">
      <div class="buttonLeft" @click="cancelSelected">取消</div>
      <div class="content" @click="showSelectedItem">
        <p class="title">已选择</p>
        <p class="subTitle">{{subTitle}}</p>
      </div>
      <div class="buttonRight" @click="confirmSelected">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QwTreeButton",
  props: {
    subTitle: String
  },
  data() {
    return {

    }
  },
  methods: {
    confirmSelected() {
      this.$emit('confirmSelected')
    },
    cancelSelected() {
      this.$emit('cancelSelected')
    },
    showSelectedItem() {
      this.$emit('showSelectedItem')
    }
  }
}
</script>

<style scoped>
  .footerButton {
    position: fixed;
    display: flex;
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    overflow: hidden;
    z-index: 10;
  }
  @media screen and (min-width: 1024px){
    .footerButton {
      width: 740px;
      margin: 0 auto;
    }
  }
  .footerButton .buttonLeft {
    float: left;
    background-color: #FBFAFC;
    color: #333;
  }
  .footerButton .buttonRight {
    float: right;
    background-color: #2F7DCD;
    color: #fff;
  }
  .footerButton .buttonLeft, .footerButton .buttonRight {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-radius: 2px;
  }
  .footerButton .buttonLeft:after, .footerButton .buttonRight:after {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 2px;
    transform: scale(0.5);
    transform-origin: top left;
  }
  .footerButton .buttonLeft:after {
    border: 1px solid #D6D5D6;
  }
  .footerButton .content {
    flex: 2;
    text-align: center;
  }
  .footerButton .title {
    font-size: 12px;
    line-height: 1;
    color: #999;
  }
  .footerButton .subTitle{
    font-size: 14px;
    line-height: 16px;
    color: #586c94;
  }
</style>
