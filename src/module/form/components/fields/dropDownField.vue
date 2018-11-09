<template>
	<div class="field-content">
		<div class="drop-down" @click="setPopup(true)"  :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}">
			<span class="drop-down-label">{{map[field.value]?map[field.value]:(field.readonly || field.disabled)?'':'请选择'}}</span>
			<span class="drop-down-icon"></span>
		</div>
		<div class="bg-popop-list" v-if="showPopup" @click="setPopup(false)">
			<popupList
								 v-on:listenShow="setPopup"
								 v-on:getItem="setValue"
								 :field="field" ></popupList>
		</div>

	</div>
</template>
<script>
	import {field_validation} from './validation.js'
	import {setFieldShowHide} from '../../js/getData'
	import popupList from './popupList.vue'
	export default {
		props: ['field'],
		components: {
			popupList,
		},
		data() {
			return {
				showPopup:false,
				map:{}
			}
		},
		created() {
			this.field.choices.forEach(item=>{
				if(this.selectQuota[item._id]&&this.selectQuota[item._id].selectedNum>=item.quota){
					this.field.value = '';
				}
				this.map[item._id] = item.value;
			});
			if(this.field.value){
				this.setRelate(this.field.value);
			}
		},
		computed:{
			selectQuota(){
				return this.$store.state.formBase.selectQuota||{};
			}
		},
		methods: {
			setPopup(value){
				if(this.field.disabled||this.field.readonly) return ;
				this.showPopup = value ;
			},
			setValue(item){
				var key = this.field._id;
				if(item._id  == this.field.value){
					var val= '';
					this.$emit('change', {key, val})
				}else{
					var value = item._id;
					this.$emit('change', {key, value})
					this.setRelate(value);
				}
				field_validation(this.field);
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
						if (item._id == val) {
							showArry = relateIds;
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

<style scoped>
	.bg-popop-list {
	position: fixed;
	top: 0;
	right: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, .2);
	z-index: 11;
	}
</style>
