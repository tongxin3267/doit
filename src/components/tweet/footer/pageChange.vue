<template lang="html">
  <div class="qwui-tweet-navs">
    <a href="javascript: void(0);"
      class="pre"
      @click="previous"
    >上一篇</a>
    <a href="javascript: void(0);"
      class="next"
      @click='next'
    >下一篇</a>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetPageChange',
  methods: {
    previous () {
      eventBus.$emit('tweet-previous');
    },
    next () {
      eventBus.$emit('tweet-next');
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin arrow-icon ($transform: 0deg) {
  content: "";
  display: inline-block;
  width: 10px;
  height: 15px;
  vertical-align: -2px;
  background: url(../img/CSSSprites.png);
  background-size: 101px 101px;
  -webkit-transform: rotate($transform);
  transform: rotate($transform);
}

.qwui-tweet-navs {
  line-height: 45px;
  overflow: hidden;

  a {
    color: #666;
  }

  .pre {
    float: left;

    &::before {
      @include arrow-icon(180deg);

      margin-right: 10px;
    }
  }

  .next {
    float: right;

    &::after {
      @include arrow-icon;

      margin-left: 10px;
    }
  }
}
</style>
