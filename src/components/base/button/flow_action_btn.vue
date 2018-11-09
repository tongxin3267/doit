<template>
    <div class="qwui-action-button-item" @click="actionButtonClick" v-show="show">
      <i :class="['iconfont',icon]"></i>
      <span class="text">{{text}}</span>
    </div>
</template>

<script>
  export default {
    name: "flow_action_btn",
    props: {
      text: String,
      icon: String,
      show: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {}
    },
    methods: {
      actionButtonClick(e) {
        this.$emit('actionButtonClick',e)
      }
    }
  }
</script>

<style scoped>
  .qwui-action-button-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }
  .iconfont{
    margin-right: 5px;
    font-size: 18px;
    color: rgba(166, 166, 166, 1);
  }
</style>
