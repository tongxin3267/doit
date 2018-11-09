<template lang="html">
  <div class="qwui-tweet_content_html" v-html="html"></div>
</template>

<script>
import {
  notNullStringValidator
} from '@/utils/validator';

export default {
  name: 'QwTweetContentHtml',
  props: {
    html: {
      type: String,
      required: true,
      validator: notNullStringValidator
    }
  }
}
</script>

<style lang="scss">
.qwui-tweet_content_html{
  width: 100%;

  img {
    margin: 5px 0;
    max-width: 100%;
    vertical-align: middle;
  }
}
</style>
