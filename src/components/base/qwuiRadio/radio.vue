<template>
  <label class="radio"
         :class="{
            'disabled':disabled
          }"
         :for="label">
    <span class="radio_input">
      <input type="radio"
             v-model="model"
             :value="label"
             :id="label"
             :disabled="disabled">
      <span></span>
    </span>
    <slot></slot>
  </label>
</template>
<script type="text/javascript">
  /**
   * radio组件, 一般以组的形式调用
   * @example
   * <qwui-group-radio inline :radio="radio" @radio="radioReturn">
       <qwui-radio label="有时风轻">有时风轻</qwui-radio>
       <qwui-radio label="逢尘化雪" disabled>逢尘化雪</qwui-radio>
       <qwui-radio label="雀茶青瓦">雀茶青瓦</qwui-radio>
    </qwui-group-radio>
   */
  export default {
    name: 'qwui-radio',
    props:{
      //复选框内容，识别标签
      label:{
        type:String
      },
      //是否可修改
      disabled: {
        type:Boolean
      }
    },
    data() {
      return {
        model:this.$parent.radioObj
      }
    },
    watch:{
      model:function (val) {
        this.$parent.handleChange(val)
      }
    },
  }
</script>
<style src="./radio.scss" lang="scss">
</style>
