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
  name: 'ReceiveMessageComponent',
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  display: flex;
  margin: 20px 14px;
  img {
    border-radius: 50%;
  }
  .qwui-message_content {
    max-width: 285px;
    min-height: 40px;
    font-size: 14px;
    color: #343434;
    box-sizing: border-box;
    background-color: #fff;
    margin-left: 12px;
    padding: 10px 18px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0px 2px 6px 0px rgba(227, 228, 232, 0.3);
  }
}
</style>
