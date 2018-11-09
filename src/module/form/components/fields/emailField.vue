<template>
  <div class="field-content">
    <input class="text-field" type="text"
		   :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
		   :value="field.value"
		   :disabled="field.disabled||field.readonly"
		   @input="setValue($event,field)"
			 @blur="validate">
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
		setValue({target},field){
			var key = field._id;
			var value = target.value
			value = value.trim();
			console.log({key,value})
			this.$emit('change',{key,value})
		},
		validate(){
			field_validation(this.field);
		}
	}
}
</script>
