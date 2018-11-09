<template lang="html">
  <span class="qwui-tweet_labels"
    v-text="labelText"
  ></span>
</template>

<script>
export default {
  name: 'QwTweetLables',
  props: {
    labels: {
      type: Array,
      required: true
    }
  },
  computed: {
    labelText () {
      return this.labels.join(', ');
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-tweet_labels {
  color: #888;
  font-size: 13px;

  &::before {
    content: "";
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 10px;
    width: 14px;
    height: 14px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTExIDc5LjE1ODMyNSwgMjAxNS8wOS8xMC0wMToxMDoyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjk1N0U3OEFDNDlCNjExRTc4NkYxQjFCOTg5OTBCOEUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjk1N0U3OEFENDlCNjExRTc4NkYxQjFCOTg5OTBCOEUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTU3RTc4QUE0OUI2MTFFNzg2RjFCMUI5ODk5MEI4RTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OTU3RTc4QUI0OUI2MTFFNzg2RjFCMUI5ODk5MEI4RTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5diM6TAAABj0lEQVR42ryWu0oDQRSGk3VBQSsbi9jbCkGw0Qews7DXjRA1Gi/Y+BZeorKJtaCVWER8BCGF4ivoG2iRQtb/yBkZB5OZOTvJgY/Nbfaby7+TKaZpWshRq+AKjDj+/joaouynpMI1llH7fVC0sJVHSLIWtz0Axz6N4xwyGtmJb2+jgLIyeAaf4BZM5hmhWjNajz1wanxPwbkD0/x+BXyARDJCm4yqpMlUzUmm1EVG9Q7ejM+efIWJo4zqCyyDF9AFN+DQZw0TDgjJdsGZw9R3wKwkpRKZrUp8nYr7yOqgEUBG9zwCGbiPhiBr6TmIjYAUBiT7XZp4gDJ1zz85oCmd5150OdYhZXUzdCSs8tDHQBssBJQ1/nssMk06AR6E0orL0qiU6tJxgbTCba050B8LJW16Stc12Y4tdOZOQ9INQ7pokTU12blkazOl7R5SXbbtIuv3b6GkaQ+pKbsIcaYh6Sa/rrJ0CcxwR7xlLkcMU/oIRqUy1zONkqpppmsNXEp2BtdDVMaHWbq+SmVU3wIMAOLQbXx7PFRdAAAAAElFTkSuQmCC);
    background-size: 100% 100%;
    background-position: center center;
  }
}
</style>
