<template lang="html">
  <div class="qwui-tweet">
    <qw-tweet-header
      class="qwui-tweet_header"
      :header="header"
      :tweetCheck="tweetCheck"
      :isOpen="isOpen"
    ></qw-tweet-header>

    <qw-tweet-content
      class="qwui-tweet_content"
      :content="content"
    ></qw-tweet-content>

    <qw-tweet-footer
      class="qwui-tweet_footer"
      :footer="footer"
      :tweetCheck="tweetCheck"
      :isOpen="isOpen"
    ></qw-tweet-footer>
  </div>
</template>

<script>
import Vue from 'vue';
import QwTweetHeader from './header';
import QwTweetContent from './content';
import QwTweetFooter from './footer';
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweet',
  components: {
    QwTweetHeader,
    QwTweetContent,
    QwTweetFooter
  },
  props: {
    header: {
      type: Object,
      required: true
    },
    content: {
      type: Object,
      required: true
    },
    footer: {
      type: Object,
      required: true
    },
    tweetCheck: {
      type: Object,
      required: true
    },
    detail: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  created () {
    // 绑定事件
    // 复制按钮被点击
    eventBus.$on('tweet-copy', () => {
      this.$emit('tweet-copy');
    });

    // 编辑按钮被点击
    eventBus.$on('tweet-edite', () => {
      this.$emit('tweet-edite');
    });

    // 查阅按钮被点击
    eventBus.$on('tweet-review', () => {
      this.$emit('tweet-review');
    });

    // 获取已阅人员页面
    eventBus.$on('tweet-view-list', () => {
      this.$emit('tweet-view-list');
    });

    // 改变点赞状态
    eventBus.$on('tweet-subscribe', () => {
      this.$emit('tweet-subscribe');
    });

    // 跳转到上一篇
    eventBus.$on('tweet-previous', () => {
      this.$emit('tweet-previous');
    });

    // 跳转到下一篇
    eventBus.$on('tweet-next', () => {
      this.$emit('tweet-next');
    });

    // 审核通过
    eventBus.$on('tweet-check-pass', () => {
      this.$emit('tweet-check-pass');
    });

    // 审核不通过
    eventBus.$on('tweet-check-pass', () => {
      this.$emit('tweet-check-not-pass');
    });
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet {
  padding: 25px 15px;
  background-color: white;

  .qwui-tweet_header {
    margin-bottom: 16px;
  }
}
</style>
