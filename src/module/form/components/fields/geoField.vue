<template>
	<div class="field-content">
		<div class="geo-field"
				 :class="{'readOnly':field.readonly || field.disabled || showMsg}"
				 @click="showMapfunc">
			<!--<span>此处插入定位图标</span>-->
			<span class="address">{{showMsg?message:address}}</span>
			<i v-if="showIcon" class="icon-geo" @click.stop="getPosition">
			</i>
		</div>
		<tencent-map v-if="showMap"
					:pos="field.value"
					:type="type"
					@positionData="setValue"
					@closeMap="close"
		>
		</tencent-map>
	</div>
</template>
<script>
	import tencentMap from '@/components/add/tencentMap.vue'
	export default {
		props: ['field'],
		components:{
			tencentMap,
		},
		data(){
			return {
				address:'',
				showMap:false,
				type:'',
				message:'网页版无法获取定位信息'
			}
		},
		created(){
			var _this = this;
			this.address = this.field.value?this.field.value.value:"";
		},
		computed:{
			showIcon(){
				return this.field.readonly || this.field.disabled?false:true
			},
			isMobile(){
				return _.isHefeixin() || _.isWeChatApp() || _.isQiyeweixinApp();
			},
			showMsg(){
				return !this.isMobile && !this.field.disabled && !this.field.value;
			}
		},

		methods: {
			showMapfunc(){
				if(this.field.readonly || this.field.disabled){
					this.type = 'showPosition'
					this.showMap =true;
				}
			},
			setValue(data){
				var key = this.field._id;
				var value = data
				console.log({key,value})
				this.$emit('change',{key,value})
				this.address = this.field.value.value
			},
			getPosition(){
				if(this.showMsg) return ;
				this.address = '正在获取定位...'
				this.type = 'getAddress';
				this.showMap = true;
			},
			close(){
				this.showMap = false;
			}
		},
	}
</script>
<style scoped>
	.address {
		padding-right: 40px;
		display: inline-block;
		line-height: 23px;
		vertical-align: middle;
	}
	.icon-geo {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-right: 12px;
    width: 22px;
    height: 22px;
    background: url(../../../../assets/images/form_icon_location.png) no-repeat;
    background-size: 100%;
    vertical-align: text-bottom;
    transform: translateY(-50%);
  }
	.icon-geo:before{
		content: " ";
		position: absolute;
		top: 50%;
		height: 16px;
		right: 34px;
		border-left: 1px solid #e5e5e5;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
		transform: translateY(-50%);
		z-index: 2;
	}
</style>
