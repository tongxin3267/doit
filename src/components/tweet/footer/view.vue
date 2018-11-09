<template lang="html">
  <a href="javascript: void(0);"
    class="qwui-tweet-view"
    @click="getViewList"
  >已阅({{ viewCount }})</a>
</template>

<script>
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetView',
  props: {
    viewCount: {
      type: Number,
      required: true
    }
  },
  methods: {
    getViewList () {
      eventBus.$emit('tweet-view-list');
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet-view {
  margin-left: 10px;
  color: #576b95;
  font-size: 13px;
}
</style>
