<template>
	<div class="field-content">
		<div class="textarea-field"
			 :class="{'text-field-help':field.help, 'text-field-focus':focus,readOnly:field.disabled || field.readonly }">
			<div v-if="!(field.disabled||field.readonly)" class="textarea_div_edit" @focus="focus=true" contenteditable="true"
				 	@blur="setValue($event),validate()" @input="countLength($event) "
					 v-html="filterTextContent(field.value)"
			>
			</div>
			<div v-else class="textarea_div_edit asdasd"
					 v-html="filterTextContent(field.value)"
					 contenteditable="false"
			>
			</div>
			<p class="font-count" v-if="field.disabled||field.readonly?false:fieldVal" :class="{colorRed:fieldVal == field.maximum_length}">{{fieldVal}}/{{ field.maximum_length }}</p>
		</div>
	</div>
</template>
<script>
	import {field_validation} from './validation.js'
	export default {
		props: [ 'field' ],
		data () {
			return {
				focus: false,
				fieldVal: 0
			}
		},
		created () {
			this.fieldVal = this.field.value ? this.field.value.length : 0;
		},
		mounted () {
		},
		methods: {
			setValue ({target}) {
				var key = this.field._id;
				var value = target.innerText
				value = value.trim ();
				this.$emit ('change', {key, value})
				this.focus = false;
			},
			countLength ({target}) {
				this.fieldVal = target.innerText.length
				if (target.innerText.length > this.field.maximum_length) {
					this.fieldVal = this.field.maximum_length;
					target.innerText = target.innerText.slice (0, this.field.maximum_length)
					target.blur();
				}
			},
			filterTextContent(str){
				if(!str) return str;
				else {
					str = str.replace(/\n\r|\n|\r/g,"<br>")
					return str.indexOf('http')!=-1&&this.field.disabled? _.checkURL(str,false):str   //处理文本内容，剔除URL
				}
			},
			validate(){
				field_validation(this.field);
			}
		},
	}
</script>
<style scoped>

	.text-field-focus {
		border: 1px solid #479de6;
	}



</style>
