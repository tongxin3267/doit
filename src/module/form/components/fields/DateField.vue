<template>
  <div class="field-content">

    <input class="text-field" type="text"  :value="value"
		   :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
           :disabled="field.disabled||field.readonly" readonly
           @click="showPlugin">
  </div>
</template>
<script>
	import {field_validation} from './validation.js'
  export default {
    props:['field'],
    data(){
      return{
        value:''
      }
    },
    created(){
      this.value = this.field.value||'';
    },
    methods:{
      setValue(value){
        var key = this.field._id;
        this.value = value;
        this.$emit('change',{key,value});
        field_validation(this.field);
      },
      showPlugin () {
        var _this = this;
        var value = this.value;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          clearText:'清除',
          format: 'YYYY-MM-DD',
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
