<template lang="html">
  <div class="qwui-audio" @click="toggle">
    <p class="qwui-audio_info"
      :class="{'qwui-audio_icon_played': played}"
      v-text="filename"
    ></p>
  </div>
</template>

<script>
export default {
  name: 'QwAudioMedia',
  props: {
    // 文件名
    filename: {
      type: String,
      required: true
    },
    // 文件源
    src: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ctx: undefined,
      played: false
    }
  },
  methods: {
    toggle () {
      if (this.played) {
        this.pause();
      } else {
        this.play();
      }
    },
    play () {
      this.ctx.play();
      this.played = true;
    },
    pause () {
      this.ctx.pause();
      this.ctx.currentTime = 0.0;
      this.played = false;
    }
  },
  created () {
    this.ctx = new Audio(this.src);
  }
}
</script>

<style lang="scss" src="./index.scss" scoped></style>
