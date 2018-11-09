<template>
	<div class="qwui-cardList">
		<router-link
			v-for="(item,index) in list"
			:key="item.id"
			@click.native="setPagerNum(index)"
			tag="div"
			:to="{name: 'detail', query: { id: item.id}}"
			class="qwui-cardList_item flexbox">
			<div class="qwui-cardList_img">
				<img
					:src="item.headPic"
					@error="noFind">
			</div>
			<div class="flexItem">
				<h3>{{item.instanceTitle}}</h3>
				<p>{{isTask(item.isTask) + '·' + timeStr(item.createaTime) + ' ' + item.personName}}</p>
				<p>{{currentNodestr(item.currentNode)}}</p>
			</div>
		</router-link>
	</div>
</template>

<script>
	import { mixinList } from './list'

	export default {
		mixins: [mixinList],
		props:['list']
	}
</script>

<style>
	.qwui-cardList {
		position: relative;
		padding-left: 15px;
		background-color: #fff;
	}
	.qwui-cardList_item {
		position: relative;
		padding: 10px 15px 10px 0;
		cursor: pointer;
	}
	.qwui-icon-operate {
		position: absolute;
		top: 0;
		right: 0;
		width: 45px;
		height: 100%;
		background: url(../../../../assets/images/icon_more.png) no-repeat center;
		background-size: 3px;
	}
	.qwui-cardList_item img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	.flexbox {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}
	.qwui-cardList_img {
		margin-right: 10px;
		width: 40px;
		height: 40px;
	}
</style>
