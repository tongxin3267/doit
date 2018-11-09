<template lang="html">
  <div class="qwui-tweet_content_box">
    <!-- 封面 -->
    <qw-tweet-content-picture
      class="qwui-tweet_cover"
      :src="cover.src"
      :alt="cover.alt"
      v-if="cover"
    ></qw-tweet-content-picture>

    <!-- 音乐播放器 -->
    <qw-tweet-content-music
      class="qwui-tweet_music"
      :src="music.src"
      :filename="music.filename"
      v-if="music"
    ></qw-tweet-content-music>

    <!-- 主体内容 -->
    <qw-tweet-content-html
      class="qwui-tweet_content"
      :html="content.content"
    ></qw-tweet-content-html>
  </div>
</template>

<script>
import QwTweetContentPicture from './picture';
import QwTweetContentMusic from './music';
import QwTweetContentHtml from './html';

export default {
  name: 'QwTweetContent',
  components: {
    QwTweetContentPicture,
    QwTweetContentMusic,
    QwTweetContentHtml
  },
  props: {
    content: {
      type: Object,
      required: true,
      validator (content) {
        return typeof content.content === 'string' &&
          (content.cover === undefined || typeof content.cover === 'object') &&
          (content.music === undefined || typeof content.music === 'object');
      }
    }
  },
  computed: {
    cover () {
      return this.content.cover;
    },
    music () {
      return this.content.music;
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_content_box {
  font-size: 16px;
}
</style>
