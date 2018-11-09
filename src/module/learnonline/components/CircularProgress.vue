<!-- 环形进度组件 -->
<template lang="html">
  <canvas :id="'cir_' + targetId" :width="size" :height="size"></canvas>
</template>

<script>
export default {
  name: 'QWCircularProgress',
  props: {
    // 对应canvas类名
    targetId: {
      type: String,
      required: true
    },
    // 进度（0 - 100）
    proGress: {
      type: Number,
      required: true
    },
    // 环形整体大小（px）
    size: {
      type: Number,
      default: 45
    },
    // 环形颜色
    color: {
      type: String,
      default: '#45A8F5',
    },
    // 环形边框宽度（px）
    borderSize: {
      type: Number,
      default: 3
    },
    // 是否图形中间加入文字，如果有，传入 font: {text: '这是文字内容', fontStyle: '14px PingFangSC-Regular', color: '#45A8F5'}
    font: {
      type: Object,
      required: false
    }
  },
  watch: {
    // 监听进度，进度变化则重新渲染
    proGress() {
      this.draw();
    }
  },
  mounted() {
    this.draw(true);
  },
  methods: {
    // 兼容retina屏幕（iphone）
    getPixelRatio(context) {
        var backingStore = context.backingStorePixelRatio
        || context.webkitBackingStorePixelRatio
        || context.mozBackingStorePixelRatio
        || context.msBackingStorePixelRatio
        || context.oBackingStorePixelRatio
        || context.backingStorePixelRatio || 1;
        return (window.devicePixelRatio || 1) / backingStore;
    },
    // canvas渲染方法
    draw(isFirst) {
      this.$nextTick(() => {
        const LENGS = this.size / 2;
        const canvas = document.getElementById('cir_' + this.targetId);
        const ctx = canvas.getContext('2d');
        const num = (this.proGress / 100).toFixed(2);

        // 兼容像素比不为1的屏幕，使其不模糊
        if(isFirst) {
          let pixel = this.getPixelRatio(ctx);
          canvas.style.width = canvas.width + 'px';
          canvas.style.height = canvas.height + 'px';
          canvas.width = this.size * pixel;
          canvas.height = this.size * pixel;
          // 放大倍数
          ctx.scale(pixel, pixel);
        }

        ctx.fillStyle = "#ddd";
        ctx.beginPath();
        ctx.arc(LENGS, LENGS, LENGS, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(LENGS, LENGS);
        ctx.lineTo(LENGS, 0);
        ctx.arc(LENGS, LENGS, LENGS, - 1/2 * Math.PI, (2 * num - .5) * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(LENGS, LENGS, LENGS - this.borderSize, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if(this.font) {
          ctx.font = this.font.fontStyle || '400 14px PingFangSC-Regular';
          ctx.fillStyle = this.font.color;
          ctx.textAlign='center';
          ctx.textBaseline='middle';
          ctx.fillText(this.font.text, LENGS, LENGS);
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
