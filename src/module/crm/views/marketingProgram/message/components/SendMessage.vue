<template>
  <div class="qwui-message_container">
    <img :src="message.headPic"
         width="42"
         height="42"
         alt="">
    <div class="qwui-message_content">{{message.content}}</div>
  </div>
</template>

<script>

export default {
  name: 'SendMessageComponent',
  props: {
    message: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  display: flex;
  margin: 20px -14px;
  flex-direction: row-reverse;
  img {
    border-radius: 50%;
  }
  .qwui-message_content {
    max-width: 285px;
    min-height: 40px;
    font-size: 14px;
    color: #FFF;
    box-sizing: border-box;
    background-color: #5585F0;
    margin-right: 12px;
    padding: 10px 18px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-left-radius: 20px;
    box-shadow: 0px 2px 6px 0px rgba(227, 228, 232, 0.3);
  }
}
</style>
