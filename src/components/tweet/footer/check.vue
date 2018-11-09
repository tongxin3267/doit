<template lang="html">
  <div class="qwui-tweet_check">
    <p>动态审核</p>

    <div v-if="status === 0" class="qwui-tweet_check_success">
      <a href="javascript: void(0)">{{ auditPerson }}已审核通过</a>
    </div>

    <div v-else-if="status === 1">
      <a href="javascript: void(0)"
        class="not-pass"
        @click="notPass"
      >不通过</a>
      <a href="javascript: void(0)"
        class="pass"
        @click="pass"
      >通过</a>
    </div>

    <div v-else class="qwui-tweet_check_success">
      <a href="javascript: void(0)">{{ auditPerson }}审核不通过</a>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus';

export default {
  name: 'QwTweetCheck',
  props: {
    status: {
      type: Number,
      required: true
    },
    auditPerson: {
      type: String,
      default: ''
    }
  },
  methods: {
    notPass () {
      eventBus.$emit('tweet-check-not-pass');
    },
    pass () {
      eventBus.$emit('tweet-check-pass');
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_check {
  margin-top: 20px;
  color: #888;
  font-size: 14px;

  div {
    text-align: center;
  }

  p {
    margin-bottom: 10px;
  }

  a {
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 16px;
    line-height: 44px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }

  .qwui-tweet_check_success a {
    color: #ccc;
    background-color: #fdfcfd;
  }

  .not-pass {
    color: #333;
    background-color: #fbfafc;
    width: 48%;
    margin-right: 1%;
  }

  .pass {
    color: #fff;
    background-color: #2F7DCD;
    width: 48%;
  }
}
</style>
