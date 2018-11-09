<template>
	<div class="qwui-cardList" >
		<div class="qwui-cardList_item flexbox"
				 v-for="(item,index) in list"
				 :key="item.id">
			<router-link :to="{name: 'add', query: { id: item.id}}" class="flexItem pr15">
				<h3>{{item.title}}</h3>
				<p class="ellipsis2">{{item.formName}}</p>
			</router-link>
			<i class="qwui-icon-operate showActionSheet" @click="oprateData(item.id,index)"></i>
		</div>
	</div>
</template>

<script>

	export default {
		props:['list','dialogBottomConfig'],
		data(){
			return {
				//
			}
		},

		created(){
		},
		computed:{

		},
		methods:{
			oprateData(id,index){
				var _this = this;
				//判断当前表单是否被收藏
				this.dialogBottomConfig.btnConfig[2].title = _this.list[index].text? _this.list[index].text:'取消收藏';

				this.dialogBottomConfig.show = true;
				this.dialogBottomConfig.btnConfig[0].callBack = function(){
					_this.$router.push({'name':'add',query:{ id: id }})
				};
				this.dialogBottomConfig.btnConfig[1].callBack = function(){
					_this.$router.push({'name':'detailData',query: { id:id ,type:'collectionDetail'}})
				};
				this.dialogBottomConfig.btnConfig[2].callBack = function(){
					_this.dialogBottomConfig.show = false;
					_.ajax({
						url:_.baseURL+"/portal/portalForm/formCollection.do",
						type:"post",
						data:{
							"id":id
						},
						dataType:"json",
						success:function(result){
							if(result.code=="1"){
								_this.list.splice(index,1);
								_.tooltips_succeed('移除成功', true);
							}
						},
					})
				};
			}
		}


	}
</script>

<style scoped>
  .pr15{
    padding-right: 15px;
  }
</style>
