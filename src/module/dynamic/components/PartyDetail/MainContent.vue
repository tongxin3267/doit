<!--
  详情页面主体内容
  依赖组件：
    1. AuthorFunction
-->

<template lang="html">
  <div id="qwjs-mainContent">
    <!-- 标题 -->
    <div class="qwui-mainContent_title">
      <h1 v-text="title"></h1>
      <p v-if="isShowDetailInfo"
        class="qwui-mainContent_detail_info"
      >
        <span v-text="datetime"
          v-if="isShowDatetime"
        ></span>
        <span v-text="author"
          v-if="isShowAuthor"
        ></span>
        <span v-if="isShowAuthorFunction">
          <a href="javascript: void(0)"
            @click="toCopyPage"
          >复制</a>
          <a href="javascript: void(0)"
            @click="toEditePage"
          >编辑</a>
          <a href="javascript: void(0)"
            v-if="isCheckout"
            @click="closeCheckout"
          >关闭查阅</a>
          <a href="javascript: void(0)"
            v-else
            @click="openCheckout"
          >开启查阅</a>
        </span>
      </p>
      <div class="qwui-mainContent_cover"
        v-if="isShowCover"
      >
        <img :src="cover" alt="封面">
      </div>
      <qw-audio-media :filename="audioFilename"
        :src="audioSource"
        v-if="isShowAudio"
      ></qw-audio-media>
    </div>

    <!-- 主要内容 -->
    <div class="qwui-mainContent_content">
      <div v-html="content"></div>
    </div>

    <!-- 尾部信息 -->
    <div class="qwui-mainContent_tail"
      v-if="isShowTailInfo"
    >
      <p>
        <span class="qwui-mainContent_labels"
          v-if="isShowLabel"
        >
          <i class="qwui-mainContent_icon_label"></i>
          <span v-for="_label in labels"
            :key="_label"
            v-if="isShowLabels"
            v-text="_label"
          ></span>
          <span v-else-if="isShowOnlyLabel"
            v-text="label"
          ></span>
        </span>
        <a href="javascript: void(0)"
          class="qwui-mainContent_reading"
          v-if="isShowReading"
          @click="toReadDetail"
        >
          已阅(<span v-text='reading'></span>)
        </a>
      </p>

      <qw-file-media class="qwui-mainContent_file"
        :fileList="fileList"
        v-if="isShowFileList"
      ></qw-file-media>
    </div>

    <!-- 功能区域 -->
    <div class="qwui-mainContent_function">
      <!-- 点赞 -->
      <div class="qwui-mainContent_subscribe"
        v-if="isShowSubscribe"
      >
        <a href="javascript: void(0)"
          :class="{'qwui-mainContent_subscribed': isSubscribe}"
          @click="toggleSubscribe"
        >
          <i class="qwui-mainContent_icon_subscribe"></i>
        </a>
        <div class="qwui-mainContent_subscribeList"
          v-if="isShowSubscribeList"
        >
          <p>
            <i class="qwui-mainContent_icon_subscribe"></i>
            <span v-text="subscribeCount"></span>赞
          </p>
          <p class="qwui-mainContent_subscribe_name">
            <span
              v-for="name in subscribeList"
              :key="name"
              v-text="name"
            ></span>
            <slot name="subscribeName"></slot>
          </p>
        </div>
      </div>

      <!-- 导航 -->
      <div class="navs">
        <a href="javascript: void(0);"
          class="pre"
          @click="toPreDetail"
        >上一篇</a>
        <a href="javascript: void(0);"
          class="next"
          @click='toNextDetail'
        >下一篇</a>
      </div>
    </div>
  </div>
</template>

<script>
import QwAudioMedia from '@/components/visualization/AudioMedia';
import QwFileMedia from '@/components/visualization/FileMedia';

export default {
  name: 'QwMainContent',
  components: {
    QwAudioMedia,
    QwFileMedia
  },
  props: {
    // 标题
    title: {
      type: String,
      required: true
    },
    // 发布日期
    datetime: {
      type: String,
      default: () => undefined,
      validator (value) {
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
      }
    },
    // 作者
    author: {
      type: String,
      default: () => undefined
    },
    // 是否为原作者
    isAuthor: {
      type: Boolean,
      default: false
    },
    // 是否开启查阅
    isCheckout: {
      type: Boolean,
      default: true
    },
    // 封面
    cover: {
      type: String,
      default: () => undefined
    },
    // 音频文件名
    audioFilename: {
      type: String,
      default: () => undefined
    },
    audioSource: {
      type: String,
      default: () => undefined
    },
    // 主题内容
    content: {
      type: String, // html
      required: true
    },
    // 多标签标签
    labels: {
      type: Array,
      default: () => undefined,
      validator (arr) {
        return arr.every(label => {
          return label && typeof label === 'string';
        });
      }
    },
    // 单标签
    label: {
      type: String,
      default: () => undefined
    },
    // 已阅人数
    reading: {
      type: Number,
      default: () => undefined
    },
    // 文件列表
    fileList: {
      type: Array,
      default: () => undefined,
      validator (arr) {
        return arr.every(file => {
          return (file.filename && typeof file.filename === 'string') &&
            (file.preview && typeof file.preview === 'string') &&
            (file.src && typeof file.src === 'string') &&
            (file.size && typeof file.src === 'string') &&
            (file.ext && typeof file.ext === 'string');
        });
      }
    },
    // 是否已点赞
    isSubscribe: {
      type: Boolean,
      default: () => undefined
    },
    // 点赞人数
    subscribeCount: {
      type: Number,
      default: () => undefined
    },
    // 点赞人姓名
    subscribeList: {
      type: Array,
      default: () => undefined,
      validator (arr) {
        return arr.every(name => {
          return name && typeof name === 'string';
        });
      }
    }
  },
  computed: {
    filesCount () {
      return this.fileList ? this.fileList.length : 0;
    },
    // 判断是否显示
    isShowDetailInfo () {
      return this.isShowDatetime || this.isShowAuthor;
    },
    isShowDatetime () {
      return this.datetime !== undefined;
    },
    isShowAuthor () {
      return this.author !== undefined && this.author !== '';
    },
    isShowAuthorFunction () {
      return this.isShowAuthor && this.isAuthor;
    },
    isShowCover () {
      return this.cover !== undefined && this.cover !== '';
    },
    isShowAudio () {
      return this.audioSource !== undefined && this.audioSource !== '';
    },
    isShowLabel () {
      return this.isShowLabels || this.isShowOnlyLabel;
    },
    isShowLabels () {
      return this.labels !== undefined && this.labels.length > 0
    },
    isShowOnlyLabel () {
      this.label !== undefined && this.label !== ''
    },
    isShowReading () {
      return this.reading !== undefined && this.reading > 0;
    },
    isShowFileList () {
      return this.filesCount > 0;
    },
    isShowTailInfo () {
      return this.isShowLabels || this.isShowReading;
    },
    isShowSubscribe () {
      return this.isSubscribe !== undefined;
    },
    isShowSubscribeList () {
      return this.subscribeCount !== undefined && this.subscribeCount > 0;
    }
  },
  methods: {
    /**
     * 事件触发
     */
    // 请求复制页面
    toCopyPage () {
      this.$emit('toCopyPage');
    },
    // 请求编辑页面
    toEditePage () {
      this.$emit('toEditePage');
    },
    // 关闭查阅
    closeCheckout () {
      this.$emit('closeCheckout');
    },
    // 开启查阅
    openCheckout () {
      this.$emit('openCheckout');
    },
    // 改变点赞状态
    toggleSubscribe () {
      this.$emit('toggleSubscribe');
    },
    // 获取已阅详情
    toReadDetail () {
      this.$emit('toReadDetail');
    },
    // 到上一篇
    toPreDetail () {
      this.$emit('toPreDetail');
    },
    // 到下一篇
    toNextDetail () {
      this.$emit('toNextDetail');
    }
  }
};
</script>

<style src="../../scss/mainContent.scss" lang="scss" scoped></style>
