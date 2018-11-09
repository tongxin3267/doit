<template lang="html">
  <div class="qwui-tweet_header">
    <qw-tweet-header-title
      class="qwui-tweet_title"
      :title="header.title"
      :tipsType="tipsType"
      :tipsContent="tipsContent"
    ></qw-tweet-header-title>

    <qw-tweet-header-info
      class="qwui-tweet_info"
      :datetime="header.datetime"
      :author="header.author"
    >
      <qw-tweet-header-author-function
        class="qwui-tweet_author_function"
        slot="after"
        :review="header.review"
        v-if="!isOpen && header.isAuthor"
      ></qw-tweet-header-author-function>
    </qw-tweet-header-info>
  </div>
</template>

<script>
/**
 * 文章头部 qw-tweet-header
 *
 * @param title(String, required): 标题
 * @param datetime(String, required): 发布日期
 * @param author(String, required): 作者名
 *
 */

import QwTweetHeaderTitle from './title';
import QwTweetHeaderInfo from './info';
import QwTweetHeaderAuthorFunction from './authorFunction';

export default {
  name: 'QwTweetHeader',
  components: {
    QwTweetHeaderTitle,
    QwTweetHeaderInfo,
    QwTweetHeaderAuthorFunction
  },
  props: {
    header: {
      type: Object,
      required: true,
      validator (header) {
        return typeof header.title === 'string' &&
          typeof header.datetime === 'string' &&
          typeof header.author === 'string' &&
          typeof header.review === 'boolean' &&
          typeof header.isAuthor === 'boolean';
      }
    },
    tweetCheck: {
      type: Object,
      required: true,
      validator (tweetCheck) {
        return typeof tweetCheck.show === 'boolean' &&
          typeof tweetCheck.status === 'number';
      }
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tipsType () {
      if (!this.tweetCheck.show) {
        return 'None';
      } else if (this.tweetCheck.status === 1 || this.tweetCheck.status === 0) {
        return 'Info';
      } else {
        return 'Warning';
      }
    },
    tipsContent () {
      if (this.tweetCheck.status === 0) {
        return '已通过';
      } else if (this.tweetCheck.status === 1) {
        return '待审核';
      } else {
        return '不通过';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_title {
  margin-bottom: 12px;
}
</style>
