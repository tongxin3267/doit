<template lang="html">
  <div class="qwui-third_part">
    <p>{{ text }}</p>
    <p>...</p>
  </div>
</template>

<script>
export default {
  name: 'QwThirdPart',
  props: {
    link: {
      type: String,
      required: true
    },
    text: {
      type: String,
      default: '企微云平台正在为您导航'
    }
  },
  created () {
    setTimeout(() => {
      window.location.href = this.link;
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.qwui-third_part {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  padding-top: 165px;
  text-align: center;
  font-size: 20px;
  background-color: #f5f5f5;
}
</style>
