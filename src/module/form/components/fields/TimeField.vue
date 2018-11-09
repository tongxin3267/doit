<template>
  <div class="field-content">
    <input class="text-field" :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}" type="text" :value="field.value"
           :disabled="field.readonly || field.disabled" readonly
           @click="showPlugin">
  </div>
</template>
<script>
	import {field_validation} from './validation.js'
  export default {
    props:['field'],
    data(){
      return{
      }
    },
    methods:{
      setValue(value){
        var key = this.field._id;
        this.$emit('change',{key,value});
        field_validation(this.field);
      },
      showPlugin () {
        var _this = this;
        var value = this.field.value;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          clearText:'清除',
          format: 'HH:mm',
          value: value,
          onConfirm (val) {
            _this.setValue(val);
          },
          onShow () {
          },
          onHide () {
          },
          onClear (){
            _this.setValue('')
          }

        })
      },
    }
  }
</script>
