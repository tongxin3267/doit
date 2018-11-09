<template lang="html">
  <div class="qwui-tweet_content_text" v-text="text"></div>
</template>

<script>
export default {
  name: 'QwTweetContentText'
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">

</style>
