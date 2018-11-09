<template>
  <div class="field-content">
    <input class="text-field"
		   :class="{'text-field-help':field.help,'readOnly':field.readonly||field.disabled,'teleShow':field.readonly}"
		   type="tel"
		   :value="field.value"
           :disabled="field.readonly || field.disabled"
					 @input="setValue($event,field)"
			 		 @blur="validate"
		>
		<i v-if="field.disabled && isMobile && field.value" class="icon-phone" @click.stop="callUp"></i>
  </div>
</template>
<script>
	import {field_validation} from './validation.js'
  export default {
    props:['field'],
    data(){
      return{
				isMobile: false
      }
    },
    methods:{
      setValue({target},field){
        var key = field._id;
        var value = target.value;
        this.$emit('change',{key,value});
      },
			callUp () {
				window.location.href = 'tel://' + this.field.value.replaceAll('-|\\s','');
			},
			validate(){
				field_validation(this.field);
			}
    },
		created: function () {
			if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
				this.isMobile = true;
			}
		}
  }
</script>
