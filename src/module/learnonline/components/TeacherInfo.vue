<!-- 讲师信息组件 -->
<template lang="html">
  <div class="qwui-teacher flex_box">
    <div class="face_wrap">
      <img :src="getFaceUrl(headPic)">
    </div>
    <div class="teacher_con flex_item">
      <div>
        <span class="teacher_name">{{userName}}</span>
        <span class="teacher_state">{{position}}</span>
      </div>
      <p class="teacher_info">{{content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeacherInfo',
  props: {
    // 头像
    headPic: {
      type: String,
      required: true,
      default: '',
    },
    // 名称
    userName: {
      type: String,
      required: true,
      default: '',
    },
    // 职位
    position: {
      type: String,
      required: true,
      default: '',
    },
    // 简介
    content: {
      type: String,
      required: true,
      default: '',
    }
  },
  methods: {
    getFaceUrl(url) {
      return url ? (url.includes('http') ? url : _.compressURL + url) : url;
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-teacher{
  padding: 10px 0;
  .face_wrap{
    width: 36px;
    height: 36px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #00a3cf;
    }
  }
  .teacher_con{
    margin-left: 15px;
    font-size: 14px;
    color: #666;
    .teacher_name{
      padding-right: 10px;
      font-size: 16px;
    }
    .teacher_state{
      font-size: 14px;
      color: #999;
    }
    .teacher_info{
      margin-top: 5px;
    }
  }
}
</style>
