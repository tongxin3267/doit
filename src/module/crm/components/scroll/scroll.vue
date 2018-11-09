<template>
  <div ref="wrapper"
       class="list-wrapper">
    <div class="scroll-content">
      <div style="padding:1px 0;" ref="listWrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import getRect from './getRect.js'
const COMPONENT_NAME = 'scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  name: COMPONENT_NAME,
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    },
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    listenBeforeScroll: {
      type: Boolean,
      default: false
    },
    listenScrollEnd: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    scrollbar: {
      type: null,
      default: false
    },
    pullDownInitTop: {
      type: Number,
      default: -20
    },
    pullDownRefresh: {
      type: null,
      default: false
    },
    pullUpLoad: {
      type: null,
      default: false
    },
    startY: {
      type: Number,
      default: 0
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    freeScroll: {
      type: Boolean,
      default: false
    },
    mouseWheel: {
      type: Boolean,
      default: false
    },
    bounce: {
      default: true
    },
    zoom: {
      default: false
    }
  },
  data() {
    return {
      isPullingDown: false,
      isPullUpLoad: false,
      pullUpDirty: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  },
  destroyed() {
    this.$refs.scroll && this.$refs.scroll.destroy()
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) {
        return
      }
      if (this.$refs.listWrapper && this.pullUpLoad) {
        this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper)
          .height + 1}px`
      }
      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        scrollbar: this.scrollbar,
        pullDownRefresh: this.pullDownRefresh,
        pullUpLoad: this.pullUpLoad,
        startY: this.startY,
        freeScroll: this.freeScroll,
        mouseWheel: this.mouseWheel,
        bounce: this.bounce,
        zoom: this.zoom
      }
      this.scroll = new BScroll(this.$refs.wrapper, options)
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
        })
      }
      if (this.listenScrollEnd) {
        this.scroll.on('scrollEnd', pos => {
          this.$emit('scroll-end', pos)
        })
      }
      if (this.listenBeforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScrollStart')
        })
        this.scroll.on('scrollStart', () => {
          this.$emit('scroll-start')
        })
      }
      if (this.pullDownRefresh) {
        this._initPullDownRefresh()
      }
      if (this.pullUpLoad) {
        this._initPullUpLoad()
      }
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    scrollToEnd() {
      this.scroll &&
        this.scroll.maxScrollY &&
        this.scrollTo(0, this.scroll.maxScrollY)
    },
    destroy() {
      this.scroll.destroy()
    },
    forceUpdate(dirty) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this.scroll.finishPullDown()
        this.refresh()
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        this.refresh()
      } else {
        this.refresh()
      }
    },
    _initPullDownRefresh() {
      this.scroll.on('pullingDown', () => {
        this.isPullingDown = true
        this.$emit('pullingDown')
      })
    },
    _initPullUpLoad() {
      this.scroll.on('pullingUp', () => {
        this.isPullUpLoad = true
        this.$emit('pullingUp')
      })
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    },
    isPullingDown() {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    },
    pullUpLoad() {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    }
  }
}
</script>

<style lang="scss">
.list-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: #fff;

  .scroll-content {
    position: relative;
    z-index: 1;
  }

  .list-content {
    position: relative;
    z-index: 10;
    background: #fff;

    .list-item {
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      padding-left: 20px;
      border-bottom: 1px solid #e5e5e5;
    }
  }
}

.pullup-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
