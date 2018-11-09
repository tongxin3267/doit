<template>
	<div class="field-content">
		<div class="field-bcolor clearfix">
			<div class="choice-field-item checkbox-field-item"
					 v-for="choice in field.choices" @click="ontouch(choice._id,choice.quota)"
					 :class="{row1:1==field.line_row,row2:2==field.line_row,row3:3==field.line_row,
					 colorGray:selectQuota[choice._id]&&selectQuota[choice._id].selectedNum>=choice.quota}"

			>
				<i :class="{active:field.value.indexOf(choice._id)!=-1}"></i>{{choice.value}}
				<span v-if="selectQuota[choice._id]&&selectQuota[choice._id].selectedNum>=choice.quota">(选项名额已空)</span>
			</div>
		</div>
		<!--<label v-for="choice in field.choices">-->
		<!--<input type="checkbox" :value="choice._id" v-model="field.value" :checked="field.value.indexOf(choice._id) != -1" @change="setValue($event,field)">-->
		<!--{{choice.value}}-->
		<!--</label>-->
	</div>
</template>
<script>
	import {field_validation} from './validation.js'
	import {setFieldShowHide} from '../../js/getData'
	export default {
		props: ['field'],
		data() {
			return {}
		},
		created() {
			this.field.value = this.field.value || []
			this.field.choices.forEach(choice =>{
				if(this.selectQuota[choice._id]&&this.selectQuota[choice._id].selectedNum>=choice.quota){
					if(this.field.value.indexOf(choice._id) != -1){
						this.field.value.splice( this.field.value.indexOf(choice._id), 1 );
					}
				}
			})
			if(this.field.value.length){
				this.setRelate(this.field.value);
			}
		},
		computed:{
			selectQuota(){
				return this.$store.state.formBase.selectQuota||{};
			},
		},
		methods: {
			setValue(value) {
				var key = this.field._id;
				this.$emit('change', {key, value})
				this.setRelate(value);
				field_validation(this.field);
			},
			ontouch(val,num) {
				this.field.help = '';
				if (this.field.disabled||this.field.readonly) {
					return;
				}
				var quota = this.selectQuota;
				if(quota){
					var info = quota[val];
					if(info&&info.selectedNum >= Number(num)){
						this.field.help = '选项名额已空';
						return;
					}
				}
				var arry = this.field.value;
				if (arry.indexOf(val) == -1) {
					arry.push(val)
				} else {
					arry.remove(val);
				}
				this.setValue(arry);

			},
			setRelate(val) {
				//判断是否是显示逻辑字段,如果是显示逻辑设置的字段
				var relateMatch = this.$store.state.formBase.relateMatch;
				var relateMap = this.$store.state.formBase.relateMap;
				var relateAllMap = this.$store.state.formBase.relateAllMap;
				var formData = this.$store.state.formBase.data;
				if (relateMatch.indexOf(this.field._id) != -1) {
					//显示和隐藏字段,通过choices获取显示字段
					var showArry = [];
					var hideArry = [];
					this.field.choices.forEach(function (item) {
						var relateIds = item.relate_show_ids || [];
						if (val.indexOf(item._id) != -1) {
							relateIds.forEach(function (i) {
								showArry.push(i);
							})
						} else {
							relateIds.forEach(function (i) {
								hideArry.push(i);
							})
						}
					});
					var obj = {};

					function showRecursion(arry) {
						var newArry = [];
						arry.forEach(function (item) {
							newArry.push(item);
						});
						for (var key in relateMap) {
							if (arry.indexOf(key) != -1) {
								//显示的值有数据
								var selectValue = formData[key];
								if (selectValue && typeof selectValue == 'string') {
									newArry = newArry.concat(showRecursion(relateAllMap[selectValue]))
								} else if (selectValue instanceof Array && selectValue.length) {
									selectValue.forEach(function (i) {
										newArry = newArry.concat(showRecursion(relateAllMap[i]))
									})
								}

							}
						}
						return newArry;
					}

					var newShowArry = showRecursion(showArry);
					//显示字段
					newShowArry.forEach(function (i) {
						obj[i] = true;
					});

					function hideRecursion(arry) {
						var newArry = [];
						arry.forEach(function (item) {
							newArry.push(item);
						});
						for (var key in relateMap) {
							if (arry.indexOf(key) != -1) {
								newArry = newArry.concat(hideRecursion(relateMap[key]))
							}
						}
						return newArry;
					}

					var newHideArry = hideRecursion(hideArry);
					newHideArry.forEach(function (i) {
						obj[i] = false;
					});
					//隐藏字段
					setFieldShowHide(this.$store, obj);
				}
			}
		}
	}
</script>
