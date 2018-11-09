<template lang="html">
  <h1 class="qwui-tweet_header_title">
    <span v-text="title"></span>
    <i class="qwui-tweet_header_title_tips"
      v-if="isShowTips"
      v-text="tipsContent"
      :class="{
        'qwui-tweet_header_title_tipsInfo': isTipsInfo,
        'qwui-tweet_header_title_tipsWarning': isTipsWarning
      }"
    ></i>
  </h1>
</template>

<script>
/**
 * 头部标题 qw-tweet-header-title
 *
 * @param title(String, required): 标题
 *
 * @slot before: 前缀
 * @slot after: 后缀
 *
 */

import {
  notNullStringValidator
} from '@/utils/validator';

export default {
  name: 'QwTweetHeaderTitle',
  props: {
    // 标题
    title: {
      type: String,
      required: true,
      validator: notNullStringValidator
    },
    // 提示类型
    tipsType: {
      type: String,
      default: 'None'
    },
    // 提示内容
    tipsContent: {
      type: String,
      default: ''
    }
  },
  computed: {
    isShowTips () {
      return this.tipsType !== 'None';
    },
    isTipsInfo () {
      return this.tipsType === 'Info';
    },
    isTipsWarning () {
      return this.tipsType === 'Warning';
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_header_title {
  color: #333;
  font-size: 20px;
  font-weight: normal;

  .qwui-tweet_header_title_tips {
    display: inline-block;
    margin-left: 5px;
    padding: 0 3px;
    color: #1aad19;
    font-size: 12px;
    border-radius: 3px;
    border: 1px solid #1aad19;

    &.qwui-tweet_header_title_tipsInfo {
      color: #1aad19;
      border: 1px solid #1aad19;
    }

    &.qwui-tweet_header_title_tipsWarning {
      color: #d64949;
      border: 1px solid #d64949;
    }
  }
}
</style>
