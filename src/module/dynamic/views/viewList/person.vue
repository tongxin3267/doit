<template lang="html">
  <li class="qwui-person">
    <span class="date" v-text="date"></span>
    <img :src="_avator" alt="头像">
    <span class="name" v-text="name"></span>
  </li>
</template>

<script>
import defaultAvator from '../../img/touxiang02.png';

export default {
  name: 'QwViewListPerson',
  props: {
    avator: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  computed: {
    _avator () {
      if (this.avator === '0') {
        return defaultAvator;
      } else {
        return this.avator;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-person {
  height: 50px;
  line-height: 50px;
  background-color: white;
  font-size: 16px;
  padding-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    position: relative;
    top: 6px;
    float: left;
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 5px;
    overflow: hidden;
  }

  .date {
    float: right;
    margin-right: 10px;
    color: #bbb;
    font-size: 12px;
  }
}
</style>
