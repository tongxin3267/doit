<template lang="html">
  <ul class="qwui-tweet_header_authorFunction">
    <!-- <li class="qwui-tweet_copy"
      @click="tweetCopy"
    >
      <a href="javascript: void(0)">复制</a>
    </li>

    <li class="qwui-tweet_edite"
      @click="tweetEdite"
    >
      <a href="javascript: void(0)">编辑</a>
    </li> -->

    <li class="qwui-tweet_review"
      @click="tweetReview"
    >
      <a href="javascript: void(0)"
        v-if="review"
      >关闭查阅</a>
      <a href="javascript: void(0)"
        v-else
      >开启查阅</a>
    </li>
  </ul>
</template>

<script>
/**
 * 作者功能 qw-tweet-header-author-function
 * （注：以后将会拆分成三个按钮组件）
 *
 * @param review(Boolean): 是否查阅
 *
 * Action:
 * 1. tweet-copy: 复制
 * 2. tweet-edite: 编辑
 * 3. tweet-review: 查阅
 *
 */
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetHeaderAuthorFunction',
  props: {
    review: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    tweetCopy () {
      eventBus.$emit('tweet-copy');
    },
    tweetEdite () {
      eventBus.$emit('tweet-edite');
    },
    tweetReview () {
      eventBus.$emit('tweet-review');
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_header_authorFunction {
  display: inline-block;

  & li{
    display: inline;

    a {
      margin-right: 5px;
      color: #576b95;
    }
  }
}
</style>
