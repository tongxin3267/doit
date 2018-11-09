<template lang="html">
  <p class="qwui-tweet_content_picture">
    <img :src="src"
      :alt="alt"
      :title="description"
    >

    <span v-text="description"
      v-if="description"
    ></span>
  </p>
</template>

<script>
import {
  notNullStringValidator
} from '@/utils/validator';

export default {
  name: "QwTweetContentPicture",
  props: {
    src: {
      type: String,
      required: true,
      validator: notNullStringValidator
    },
    alt: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.qwui-tweet_content_picture {
  margin-bottom: 10px;
  text-align: center;

  img {
    width: 100%;
  }

  span {
    display: inline-block;
    padding: 0 10px;
    line-height: 2em;
    border-bottom: 1px solid #ddd;
  }
}
</style>
