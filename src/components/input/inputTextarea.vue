<template>
  <div class="qwui-textarea_box">
    <slot name="prepend"></slot>
    <textarea class="qwui-textarea" ref="textarea" :autofocus="autofocus" :cols="cols" :rows="rows"
              :class="activeClass"
              :style="[inputStyle,textareaStyle]"
              :maxlength="maxLength"
              :placeholder="placeholder"
              :value="currentValue"
              @input="handleInput"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup.enter="keyUp"
              @click="textareaClick"
              @change="handleChange"
    ></textarea>
    <slot name="append"></slot>
  </div>
</template>
<script>
  import setTextareaHeight from './setTextareaHeight';
  export default {
    name: 'inputTextarea',
    data() {
      return {         //非聚焦
        textareaCalcStyle:{},                           //输入框高度
        currentValue: this.value === undefined || this.value === null? '': this.value,
      }
    },
    props: {
      value:String,
      maxLength:{
        type:Number,
        default:100,
      },
      minLength:{
        type:Number,
        default:0,
      },
      placeholder:{
        type:String,
        default:"",
      },
      cols:{
        type:Number,
        default:30,
      },
      rows:{
        type:Number,
        default:3,
      },
      activeClass:String,
      counter:{
        type:Boolean,
        default:false,
      },
      autofocus:{                     //自动聚焦
        type:Boolean,
        default:false,
      },
      inputStyle:{
        type: Object,
        default:function () {
          return {}
        }
      },
      autosize: {                     //开启自动适应或限制最大最小高度
        type: [Boolean, Object],
        default: false
      },
    },
    mounted() {
      this.resizeTextarea();
    },
    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      },
      "autofocus"(val){
        if(val){
          this.focus();
        }
      },
      "autosize"(val){
        this.resizeTextarea();
      }
    },
    computed:{
      textareaStyle(){
        return this.textareaCalcStyle;
      }
    },
    methods:{
      focus() {
        this.$refs.textarea.focus();
      },
      blur() {
        this.$refs.textarea.blur();
      },
      handleInput(event){
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
      },
      handleFocus(event){
        this.$emit('focus', event);
      },
      handleBlur(event){
        this.$emit('blur', event);
      },
      handleChange(event){
        this.$emit('change', event.target.value);
      },
      keyUp(){
        this.$emit("keyup",true);
      },
      textareaClick(event){
        this.$emit("click",event);
      },
      setCurrentValue(value){
        if (value === this.currentValue) return;
        this.$nextTick(function () {
          this.resizeTextarea();
        });
        if(value.length>this.maxLength){
          value=value.substring(0,this.maxLength);
        }
        this.currentValue=value;
      },
      resizeTextarea(){
        if (!this.autosize) {
          this.textareaCalcStyle = setTextareaHeight(this.$refs.textarea, this.rows, null);
          return;
        }
        const minRows = this.autosize.minRows;
        const maxRows = this.autosize.maxRows;
        this.textareaCalcStyle = setTextareaHeight(this.$refs.textarea, minRows, maxRows);
      },
    }
  }
</script>
<style scoped>
  .qwui-textarea_box{
    display: flex;
    flex: 1;
    font-size: 14px;
    color: #666;
    vertical-align: bottom;
  }
  .qwui-textarea{
    box-sizing: border-box;
  }
</style>
