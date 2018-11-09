<template>
	<div class="field-content">
		<div class="field-city drop-down" :class="{'text-field-help':field.help,readOnly:field.disabled||field.readonly}" @click="showAddress = true" >
			<span class="qwui-form-city" :class="{colorGray:showMessage}">
				{{showMessage ? placeholder : isCurAddress}}
			</span>
			<span class="childForm-item-icon fr drop-down-icon">
			</span>
		</div>
		<x-address v-show="false"
								@on-hide="setValue"
							 @on-show="isShow()"
							 :title="title"
							 :dataNum="dataNum"
							 :list="addressData"
							 @on-shadow-change="onShadowChange"
							 :show.sync="showAddress"
		>
		</x-address>
	</div>
</template>
<script>
  import {field_validation} from './validation.js'
	import XAddress from './x-address'
	export default {
		props: [ 'field' ],
		components: {
			XAddress,
		},
		data () {
			return {
				dataNum:3,//1:省  2：省市  3：省市区  4：省市区街道
				title:'',
				showAddress: false,
				curAddress: [],
				tempAddress:[],
				addressData:[],
				placeholder:'请选择地址'
			}
		},
		created () {
			this.addressData = ChinaAddressV4Data
			this.curAddress = this.field.value? this.field.value.split(':'):[];//默认值
		},
		computed:{
      isCurAddress(){
      	return this.field.value? this.field.value.split(':').join(' '):'';//默认值
			},
			showMessage(){
      	return !this.field.value && !this.field.disabled
			}
		},
		methods: {
			onShadowChange(ids, names){
				this.tempAddress = names;
			},
			setValue(str){
				var key = this.field._id;
				if(str){
					var value = this.tempAddress.join(':')
					this.$emit ('change', {key, value})
				};
        field_validation(this.field);
			},
			isShow(){
				if(this.field.disabled||this.field.readonly){
					this.showAddress = false;
				}
			}
		}
	}
</script>

<style scoped>
	.qwui-form-city{
		display: inline-block;
		width: 100%;
		padding-right: 16px;
		word-wrap: break-word;
		line-height: 1;
	}
</style>

