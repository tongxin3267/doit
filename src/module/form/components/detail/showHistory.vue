<template>
	<div class="qwui-history-mark" @click="close">
		<div class="history-box" @click.stop="">
			<div class="history-title">
				[{{history.title}}]的修改轨迹
			</div>
			<div class="history-content"
				 v-for="item in historyList"
				 :key="item.id">
				<p>{{item.creatorName}}将[{{item.oldValue}}]修改成[{{item.newValue}}]</p>
				<span>{{item.createTime}}</span>
			</div>
		</div>
	</div>
</template>
<script>
	export default{
		props:['history'],
		computed:{
			historyList(){
				return this.history.eachOrbitList;
			}
		},
		methods:{
			close(){
				this.$emit('closeHistory')
			}
		}
	}
</script>
<style>
	.qwui-history-mark{
		position: fixed;
		z-index:12;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: rgba(0, 0, 0, 0.2);
		overflow: hidden;
	}
	.history-box{
		position: absolute;
		z-index:15;
		top: 50%;
		left: 15px;
		right: 15px;
		padding: 10px;
		background:#fff;
		border-radius: 5px;
		opacity: 1;
		-webkit-transform: translateY( -50%);
		transform: translateY(-50%);
	}
	.history-title{
		min-height: 27px;
		line-height:27px;
		font-size: 15px;
		border-bottom: 1px solid #e5e5e5;
	}
	.history-content {
		margin-top: 10px;
		min-height: 27px;
		font-size: 14px;
		line-height: 20px;
	}
	.history-content span{
		font-size: 12px;
	}
</style>
