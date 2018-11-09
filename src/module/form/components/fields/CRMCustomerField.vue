<template>
	<div class="field-content">
		<div v-if="field.disabled?true:users.length!=0" class="relative-field" >
			<div class="relative-list" v-for="item in users">
				<span class="relative-list-itemicon"></span>{{item.clientName}}
			</div>
		</div>
		<div v-if="!field.disabled"  class="childForm-item-add" @click="addCrm">点击添加</div>
	</div>
</template>
<script>
	export default {
		props: [ 'field' ],
		created () {
			var person = this.field.value||[];
			var users = [];
			person.forEach(item =>{
				var arr = item.split('_');
				users.push({
					id:arr[0],
					clientName:arr[1]
				})
			});
			this.users = users;
		},
		data () {
			return {
				users: []
			}
		},
		methods: {
			setValue () {
				var field = this.field;
				var key = field._id;
				var value = field.value;
				console.log ({key, value})
				this.$emit ('change', {key, value})
			},
			addCrm () {
				//将当前的人员给到选人控件
				var _this = this;
				dataBase.selectCrm.show = true;
				dataBase.selectCrm.confirm = function (data) {
					_this.users = data.selectedList;
					var arry = [];
					for (var i = 0; i < _this.users.length; i++) {
						arry.push (_this.users[ i ].id + '_' + _this.users[ i ].clientName);
					}
					_this.field.value = arry;
					_this.setValue ();
				}
				dataBase.selectCrm.selectList = this.users;
				dataBase.selectCrm.data.crmUserId = dataBase.config.userId;
				dataBase.selectCrm.data.crmTypes = this.field.crm_types.join (',')
				//回调选中的人员
			}
		}
	}
</script>
