<template>
	<div class="field-content">
		<div v-if="field.disabled?true:users.length!=0"  class="relative-field">
			<div class="relative-list"
                v-for="item in users"
                :key="item.id"
                @click="showPersonDetail(item)">
				<span class="relative-list-itemicon"></span>{{item.personName}}
			</div>
		</div>
		<div v-if="!field.disabled" class="childForm-item-add"  @click="addPerson">点击添加</div>
	</div>
</template>
<script>
	import EventBus from '@/utils/eventBus';
	import {getMember} from '../../js/getData'
	export default {
		props: [ 'field' ],
		created () {
			var person = this.field.value||[];
			var users = [];
			person.forEach(item =>{
				var arr = item.split('_');
				users.push({
					userId:arr[0],
					personName:arr[1]
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
				this.$emit ('change', {key, value})
			},
			addPerson () {
				//将当前的人员给到选人控件
				var _this = this;
				dataBase.selectConfig.show = true;
				dataBase.selectConfig.signIndex = 'users';
				dataBase.selectConfig.selectList.users.callBack.confirm = function (id, data) {
					_this.users = data.user.data;
					var arry = [];
					for (var i = 0; i < _this.users.length; i++) {
						arry.push (_this.users[ i ].userId + '_' + _this.users[ i ].personName);
					}
					_this.field.value = arry;
					_this.setValue ();
					//更新人员控件的下一步处理人
					var flowNodeItemKeys = _this.$store.state.userSelected.flowNodeItemKeys
					if(flowNodeItemKeys.indexOf(_this.field._id)>-1){
						var ItemKeys = []
						ItemKeys = flowNodeItemKeys.split('|');
						if(flowNodeItemKeys){
							let users = [];
							let userItem = [];
							for(let i=0; i<ItemKeys.length; i++){
								var person = _this.$store.state.formBase.data[ItemKeys[i]] || [];
								userItem.push(...person);
								if(userItem){
									userItem.forEach(item =>{
										let arry = item.split('_');
										users.push(arry[0])
									});
								}
							}
							let ids = users.unique().join(',');
							ids&&getMember(ids, (res) => {
									_this.$store.commit('updateItemKeysSelected',res);
							});
						}
					}
				}
				dataBase.selectConfig.selectList.users.userSelected = this.users;
				//回调选中的人员
			},
			showPersonDetail:function (item){
				if(item.userId!=_.userId){
					EventBus.$emit("atThisPersonUtil",item,true);
				}
			},
		}
	}
</script>
