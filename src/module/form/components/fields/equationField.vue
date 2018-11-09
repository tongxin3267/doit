<template>
  <div class="field-content">
    <input class="text-field" type="number"
		   :class="{'readOnly':field.readonly || field.disabled}"
		   :readonly="field.readonly"
		   :value="fieldValue"
		   :disabled="field.disabled||field.readonly"
		   @blur="setValue($event,field)">
	  <div class="help-block" v-show="field.validations&&field.validations.indexOf('iscapital')!=-1">{{'大写金额￥：'+ smalltoBIG(field.value)}}</div>
  </div>
</template>
<script>
	import {convertCurrency} from '../../js/getData'
  export default {
    props:['field'],
    data(){
      return{
      }
    },
		computed:{
			fieldValue(){
//				if(typeof(this.field.value) == 'number'){
					var accurate_num = this.field.accurate_num;
					if (accurate_num != 0) {
						if (accurate_num < 0) {
							accurate_num = 0;
						}
						this.field.value = Number(this.field.value).toFixed(accurate_num);
					}
					return  this.field.value;
//				}else {
//					return  this.field.value;
//				}
			}
		},
    methods:{
      setValue({target},field){
        var key = field._id;
        var value = target.value
				var accurate_num = this.field.accurate_num;
				if (accurate_num != 0) {
					if (accurate_num < 0) {
						accurate_num = 0;
					}
					value = Number(value).toFixed(accurate_num);
				}
//				value = Number(value)
				target && (target.value = value);
        this.$emit('change',{key,value})
      },
		smalltoBIG(n){
			if(!n)return '';
			if(this.field.validations&&this.field.validations.indexOf('iscapital')!=-1){
				return convertCurrency(n);
			}
		},
    }
  }
</script>
