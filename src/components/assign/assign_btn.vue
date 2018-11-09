<template>
  <div>
    <div class="qwui-assign_btn" @click="showAssignBox">
      <i class="icon_right" v-if="isWriteSign"></i>
    </div>
  </div>
</template>

<script>
  export default {
    name: "assign_btn",
    components: {},
    data() {
      return {}
    },
    props:{
      isWriteSign:{      // 是否有手写签名
        type: Boolean,
        default: false
      },
    },
    methods: {
      showAssignBox() {
        this.$emit('showAssignBox', true)
      },
    },
  }
</script>

<style scoped>
  .qwui-assign_btn {
    position: relative;
    height: 44px;
    margin: 20px 15px 0;
    border: 1px dashed #bbbbbb;
    background: #fff url("../../assets/images/ic_signed.png") no-repeat center;
    background-size: 60px 25px;
    cursor: pointer;
    border-radius: 2px;
  }

  .icon_right {
    position: absolute;
    top: 13px;
    right: 20px;
    width: 20px;
    height: 20px;
    background: url("../../assets/images/ic_right.png") no-repeat center;
    background-size: 20px;
  }
</style>
