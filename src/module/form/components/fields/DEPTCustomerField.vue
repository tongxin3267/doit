<template>
	<div class="field-content">
		<div v-if="field.disabled?true:depts.length!=0" class="relative-field">
			<div class="relative-list" v-for="item in depts">
				<span class="relative-list-itemicon"></span> {{item.departmentName}}
			</div>
		</div>
		<div v-if="!field.disabled" class="childForm-item-add" @click="addDept">点击添加</div>
	</div>
</template>
<script>
	export default {
		props: ['field'],
		created () {
			var deptlist = this.field.value||[];
			var depts = [];
			deptlist.forEach(item =>{
				var arr = item.split('_');
				depts.push({
					id:arr[0],
					departmentName:arr[1]
				})
			});
			this.depts = depts;
		},
		data() {
			return {
				depts: []
			}
		},
		methods: {
			setValue() {
				var field = this.field;
				var key = field._id;
				var value = field.value;
				console.log({key, value})
				this.$emit('change', {key, value})
			},
			addDept() {
				//将当前的人员给到选人控件
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'depts';
				dataBase.selectConfig.selectList.depts.callBack.confirm = function (id, data) {
					console.log(data)
					_this.depts = data.dept.data;
					var arry = [];
					for (var i = 0; i < _this.depts.length; i++) {
						arry.push(_this.depts[i].id + '_' + _this.depts[i].departmentName);
					}
					_this.field.value = arry;
					_this.setValue();
				}
				dataBase.selectConfig.selectList.depts.deptSelected = this.depts;
				//回调选中的人员
			}
		}
	}
</script>
