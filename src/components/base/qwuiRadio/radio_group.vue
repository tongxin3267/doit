<template>
  <div class="radio_group"
       :class="{
          'in-line':inline
        }">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'qwui-group-radio',
    props: {
      //初始化复选框列表
      radio:{
        type:String
      },
      //是否一行展示
      inline: {
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        radioObj:this.radio
      }
    },
    watch:{
      radioObj:function(val){
        this.$emit('radio', val)
        Object.values(this.$children).forEach(function (e) {
          e.model = val
        })
      },
      radio:function(val){
        this.radioObj = val;
      }
    },
    methods:{
      handleChange(val){
        this.radioObj = val
      }
    }
  }
</script>
<style src="./radio.scss" lang="scss">
</style>
