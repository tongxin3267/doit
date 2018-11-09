<template>
  <div class="qwui-learn_list_item clearfix" @click="enterCourseDetail">
    <div class="item_img_wrap">
      <img
        class="item_img"
        :src="getCoverUrl(item.subjectCover)"
        v-picfix
      >
    </div>
    <!-- 进度圈 -->
    <slot name="rate"></slot>

    <p class="item_subjectName" :class="{endStudy: endStudy}">{{item.subjectName}}</p>
    <slot name="section"></slot>
  </div>
</template>

<script>
  export default {
  name: 'QwCourseItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    hiddenEndClass: { //是否不添加已结束样式 默认不添加
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data(){
    return {
      // 有隐藏标识就不添加已结束样式，否则一切非2为已结束的课程，添加样式
      endStudy: this.hiddenEndClass? false: this.item.courseState != 2,
    };
  },
  methods:{

    // 进入课程详情页  判断是否已结束，已结束禁止进入
    enterCourseDetail() {
      if (this.item.courseState && this.item.courseState != 2) { //已结束的课程不用跳转
        return;
      }
      this.item.courseId? this.$router.push({name: 'course_detail', query: {id: this.item.courseId}}):
      this.item.subjectId? this.$router.push({name: 'mall_detail', query: {id: this.item.subjectId}}):
      this.$router.push({name: 'course_detail', query: {id: this.item.id}});
    },

    // 得到正确的封面图URL
    getCoverUrl(url) {
      return url ? _.compressURL + url : url;
    }
  }
};

</script>

<style lang="scss" scoped>
@import '../static/css/mixin.scss';
.qwui-learn_list_item {
  position: relative;
  height: 64px;
  padding: 12px 15px;

  .item_img_wrap {
    @include cover-wrap('../../../assets/images/default_bg.png');
    float: left;
    width: 115px;
    height: 64px;
    padding-top: 0;
    margin-right: 10px;
    background-size: 100%;
    border-radius: 5px;
    overflow: hidden;
    .item_img{
      display: block;
      max-width: 100%;
      height: auto;
      margin: auto;
    }
  }
  .item_subjectName {
    padding-top: 1px;
    height: 38px;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    color: #333;

    /*多行文本溢出省略*/
    word-wrap: break-word;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .endStudy {
    color: #999;
  }
}
</style>
