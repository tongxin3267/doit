<template lang="html">
  <p class="qwui-tweet_header_info">
    <slot name="before"></slot>

    <span class="qwui-tweet_datetime"
      v-text="datetime"
    ></span>

    <slot name="between"></slot>

    <span class="qwui-tweet_author"
      v-text="author"
    ></span>

    <slot name="after"></slot>
  </p>
</template>

<script>
/**
 * 文章基本信息 qw-tweet-header-info
 *
 * @param datetime(String, required): 发布日期
 * @param author(String, required): 作者名
 *
 * @slot before: 前缀
 * @slot between: 日期和作者名之间
 * @slot after: 后缀
 *
 */

import {
  datetimeValidator,
  notNullStringValidator
} from '@/utils/validator';

export default {
  name: 'QwTweetHeaderInfo',
  props: {
    // 发布日期
    datetime: {
      type: String,
      required: true,
      validator: datetimeValidator
    },
    // 作者名
    author: {
      type: String,
      required: true,
      validator: notNullStringValidator
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_header_info {
  color: #888;
  font-size: 14px;

  span {
    display: inline-block;
    margin-right: 10px;
  }
}
</style>
