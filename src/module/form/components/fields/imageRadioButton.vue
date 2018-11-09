
<template>
	<div class="field-content" >
		<div class="geo-field"
				 :class="{'readOnly':field.readonly || field.disabled || showMessage}">
			<span class="scan-msg">
				{{showMessage ? message : field.value}}
			</span>
			<i class="qwui-icon_del" v-if="showDelIcon" @click="clearInput"></i>
			<san_Code v-if="!(field.readonly || field.disabled)"
								:value="''"
								:showIcon="true"
								:type="'expresslist'"
								@backBarCode="getBarCode"></san_Code>
		</div>
	</div>
</template>
<script>
	import san_Code from '@/components/add/sanQRCode';
	export default {
		components:{
			san_Code
		},
		props:['field'],
		data(){
			return{
				isMobile: false,
				message:'网页版无法使用扫描'
			}
		},
		created() {
			//判断是否为手机端
			if (_.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp()) {
				this.isMobile = true;
			}
		},
		computed:{
			showDelIcon(){
				return this.isMobile && !this.field.disabled && this.field.value
			},
			showMessage(){
				return !this.isMobile && !this.field.disabled && !this.field.value;
			}
		},
		methods:{
//			setValue({target},field){
//				var key = field._id;
//				var value = target.value
//				console.log({key,value})
//				this.$emit('change',{key,value})
//			},
			//输入内容
			getBarCode(val){
				var key = this.field._id;
				var value = val;
				console.log({key,value});
				this.$emit('change',{key,value});
			},
			//清除输入内容
			clearInput(){
				this.getBarCode(null);
			}
		}
	}
</script>
<style scoped>
	.scan-msg{
		display: inline-block;
		width: 100%;
		padding: 6px 60px 6px 0;
		word-wrap: break-word;
		line-height: 1.2;
	}
	.qwui-icon_del{
		position: absolute;
		top: 0;
		bottom: 0;
		right: 55px;
		width: 14px;
		height: 14px;
		margin: auto;
		padding: 0;
		border:none;
	}
</style>
