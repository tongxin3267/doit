<template>
	<div class="field-content">
		<input v-if="!field.disabled" class="text-field" type="text" :value="field.value" :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
			   :disabled="field.disabled || field.readonly" :readonly="field.readonly"
			   @input="setValue($event,field)"
		     @blur="validate">
		<div v-else class="geo-field readOnly" ><p class="text-field-p" v-html="filterTextContent(field.value)"></p></div>
		<div class="help-block" v-show="field.validations&&field.validations.indexOf('iscapital')!=-1">{{'大写金额￥：'+ smallToBIG(field.value)}}</div>
	</div>
</template>
<script>
	import {convertCurrency} from '../../js/getData'
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
			smallToBIG(n){
				if(!n)return '';
				if(this.field.validations&&this.field.validations.indexOf('iscapital')!=-1){
					return convertCurrency(n);
				}
			},
			filterTextContent(str){
				if(!str)
					return str;
				else
					return str.indexOf('http')!=-1? _.checkURL(str,false):String(str)   //处理文本内容，剔除URL
			},
			validate(){
				field_validation(this.field);
			}

		}
	}
</script>
<style>
	.text-field-p{
		line-height: 22px;
		min-height: 22px;
		padding: 9px 0;
		word-break: break-all;
		word-wrap: break-word;
	}
</style>
