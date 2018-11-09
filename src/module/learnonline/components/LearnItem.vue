<!-- 必学课选学课直播等列表项组件 -->
<template lang="html">
  <li class="qwui-learn_item">
    <router-link :to="toRoute">
    <div :class="['list_cover', coverClassCom]">
      <div class="cover_wrap" ref="cover_wrap">
        <img
          class="cover"
          v-if="getCoverUrl(itemCover) != ''"
          :src="getCoverUrl(itemCover)"
          v-picfix
        />
      </div>

      <!-- 封面下方的插槽 -->
      <slot name="cover_info"></slot>
    </div>
    <h2 class="list_title ellipsis">{{itemName}}</h2>

    <!-- 底部的状态插槽 -->
    <slot name="item_status"></slot>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'QWLearnItem',
  props: {
    // 封面
    itemCover: {
      type: String,
      required: true,
    },
    // 名称
    itemName: {
      type: String,
      required: true,
      default: '',
    },
    // 点击跳转的路由对象
    toRoute: {
      type: Object,
      required: true,
      default: {},
    },
    // 默认样式
    coverClass: {
      type: String,
      required: false,
      default: 'livelist_type'
    }
  },
  computed: {
    coverClassCom() {
      return this.itemCover == ''? this.coverClass: '';
    }
  },
  methods: {
    // 得到正确的封面图URL
    getCoverUrl(url) {
      return url ? _.compressURL + url : url;
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../static/css/mixin.scss';

.qwui-learn_item {
  flex: 0 0 48%;
  min-width: 0;
  padding: 10px 0;
  .list_cover {
    @include cover-wrap('');
    border-radius: 5px;
    margin-bottom: 8px;
    .cover_info {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding-top: 20%;
      background: linear-gradient(to top, rgba(0,0,0,.1), rgba(0,0,0,0));
    }
  }
  .livelist_type {
    background-image: url('../../../assets/images/ic-bg.png');

  }
  .courselist_type {
    background-image: url('../../../assets/images/default_bg.png');
  }
  .list_title {
    margin-bottom: 4px;
    color: #333;
    font-weight: normal;
    font-size: 15px;
  }
}
</style>
