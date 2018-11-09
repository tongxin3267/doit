<template>
	<div class="qwui-pageNumber form-bg" v-if="unShowPageCtrl">
		<span>{{page}}</span>
		<div class="qwui-prev_page" @click="prev"> <div class=" childForm-item-icon icon-open icon-prev "></div>上一个表单</div>
		<div class="qwui-next_page" @click="next">下一个表单 <div class="childForm-item-icon icon-open icon-next"></div></div>
	</div>
</template>
<script>
	import { changePage } from '../../api/list.js'
	export default {
		data () {
			return {
				pageData:{},
				curPage:0,
				countPage:0,
			}
		},
		created(){
			this.pageData = JSON.parse(sessionStorage.getItem("pageData")||"{}");
			this.curPage = this.pageData.paramPagerNum;
			this.countPage = this.pageData.paramPageCount;
		},
		computed:{
			page(){
				return this.curPage + '/' + this.countPage;
			},
			unShowPageCtrl(){
				return this.pageData.paramSearchType != 2 &&
								JSON.stringify(this.pageData) != '{}' &&
								this.pageData.paramPagerNum &&
								this.pageData.paramPageCount
			}
		},
		methods:{
			next(){
				if(this.pageData.paramPagerNum>=this.pageData.paramPageCount){
					return _.alert('提示', '已经是最后一张表单了');
				}else{
					this.goChange(1);
				}
			},
			prev(){
				if(this.pageData.paramPagerNum <= 1){
					return _.alert('提示', '已经是第一张表单了');
				}else{
					this.goChange(-1);
				}
			},
			goChange(page) {
				var _this = this;
				this.pageData.paramPagerNum += page ;
				_.showLoading();
				changePage(this.pageData).then((res) => {
					this.curPage = this.pageData.paramPagerNum;
					_.hideLoading()
					if(res.code != "0"){
						return _.alert('提示', res.desc);
					}
					sessionStorage.setItem('pageData',JSON.stringify(_this.pageData))
					_this.$router.push({path: '/detail', query: {id: res.data.taskID}});
					_this.$emit('refreshFrom')
				})
			},
		},
	}
</script>
<style scoped>
	.qwui-pageNumber {
		padding: 10px 0 5px;
		height: 45px;
		line-height: 45px;
		color: #666;
		font-size: 14px;
		text-align: center;
	}
	.qwui-prev_page {
		float: left;
		padding-left: 14px;
		cursor: pointer;
	}
	.qwui-next_page {
		float: right;
		padding-right: 14px;
		cursor: pointer;
		text-align: right;
	}
	.icon-prev {
		transform: rotate(180deg);
		margin-right:2px;
	}
	.icon-next {
		margin-left:2px;
	}
</style>
