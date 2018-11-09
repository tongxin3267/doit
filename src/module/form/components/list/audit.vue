<template>
	<div
		v-infinite-scroll="loadMore"
		infinite-scroll-disabled="busy"
		infinite-scroll-distance="10"
		infinite-scroll-immediate-check="false">
		<div class="qwui-nav_box_fixed">
			<search-bar
				:searchinput="searchBar"
				@listenToSearchBox="showMsgFromSearchBar"></search-bar>
		</div>
		<audit-list :list="list"></audit-list>
		<advanced-search
			ref="advancedSearch"
			v-show="advancedSearchShow"
			:setting="searchSetting"
			:cache-search-value="cacheSearchValue"
			@close="advancedSearchClose"
			@search="advancedSearch"></advanced-search>
		<load-more
			:busy="busy"
			:loading="loading"
			:showrecord="showrecord"
			:record-title="recordTitle"
			:record-text="recordText"
			@childevent="loadMore"
      :listCount="list.length"></load-more>
	</div>
</template>

<script>
import auditList from './auditList.vue';
import { initTodo, todoSearch } from '../../api/list.js'
import { mixinTab } from './list'
import advancedSearch from '@/components/base/advancedSearch/index'

export default {
	mixins:[mixinTab],
	components:{
		auditList,
		advancedSearch
	},
	data(){
		return {
			list: [],
			searchSetting: [
				{
					label: '表单标题',
					key: 'workOrderSearchVO.formTitle',
					type: 'text',
					placeholder: '请输入'
				},
				{
					label: '阅读状态',
					key: 'workOrderSearchVO.commentStatus',
					type: 'radio',
					value: [{ text: '全部', value: ''}, { text: '已阅', value: 'HAS_READ'}, { text: '未阅', value: 'HAS_NOT_READ'}]
				},
				{
					label: '表单类型',
					key: 'workOrderSearchVO.isTask',
					type: 'radio',
					value: [{ text: '全部', value: ''}, { text: '普通单', value: '0'}, { text: '任务单', value: '1'}, { text: '审批单', value: '2'}]
				},
				{
					label: '部门',
					key: 'workOrderSearchVO.departId',
					type: 'selectDepart',
					deptRestriction: '1'
				},
				{
					label: '创建时间',
					key: ['workOrderSearchVO.createaStartTime', 'workOrderSearchVO.createaEndTime'],
					type: 'date'
				},
			]
		}
	},
	methods:{
		initList(isLoadMore){
			var _this = this,
				initFunction = initTodo,
				setting = JSON.parse(JSON.stringify(this.setting)),
				searchValue = this.isSearch ? this.searchValue : setting;

			if(this.isSearch) {
				searchValue = Object.assign(searchValue, setting);
				initFunction = todoSearch;
			}
			//            改变pageData的参数
			this.$store.state.formBase.pageData.paramSeniorSearch = 0;
			this.$store.state.formBase.pageData.paramIsTask = searchValue.isTask;
			this.$store.state.formBase.pageData.paramTitle = searchValue.keyWord;
			sessionStorage.setItem('pageData',JSON.stringify(this.$store.state.formBase.pageData));

			_.showLoading();
			initFunction(searchValue).then((res) => {
				_this.setList(res, isLoadMore);
			})
		}
	},
	created() {
		var _this = this;

		this.cache('auditSearchValue');
		this.initList();
		this.searchBar.rightSpan.callback = function () {
			_this.advancedSearchShow = true;
		}
		this.$store.state.formBase.pageData.paramSearchType = 3;
	},
	beforeDestroy () { // 组件销毁前缓存高级搜索条件
		this.setStore('auditSearchValue', this.searchValue);
	}

}
</script>

<style scoped>
	.qwui-nav_box_fixed{
		position: fixed;
		z-index: 9;
		width: 100%;
	}
	.qwui-cardList{
		padding-top: 44px;
	}
</style>
