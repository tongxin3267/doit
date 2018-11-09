<template>
	<div
		class="submited"
		v-infinite-scroll="loadMore"
		infinite-scroll-disabled="busy"
		infinite-scroll-distance="10"
		infinite-scroll-immediate-check="false">
		<header>
			<home-head-nav
				:headrdata="headData"
				:footer-index="homeFooterList.nav_on" ></home-head-nav>
		</header>
		<div
			class="qwui-nav_box_fixed"
			:style="{ top: headData.show ? '100px' : '0' }">
			<search-bar
				:searchinput="searchBar"
				@listenToSearchBox="showMsgFromSearchBar" ></search-bar>
		</div>
		<submited-list
			:list="list"
			@deleteList="deleteList"></submited-list>
		<advanced-search ref="advancedSearch"
			v-show="advancedSearchShow"
			:setting="searchSetting"
			:cache-search-value="cacheSearchValue"
			@close="advancedSearchClose"
			@search="advancedSearch"></advanced-search>
		<load-more
			:busy="busy"
			:loading="loading"
			:showrecord="showrecord"
			@childevent="loadMore"
      :listCount="list.length"></load-more>
	</div>
</template>

<script>
import homeHeadNav from '@/components/home/home_head_nav.vue'
import submitedList from './submitedList.vue'
import { initHead, initRelevant ,submitSearch } from '../../api/list'
import { mixinTab } from './list'
import advancedSearch from '@/components/base/advancedSearch/index'

export default {
	mixins: [mixinTab],
	components:{
		submitedList,
		homeHeadNav,
		advancedSearch
	},
	data(){
		return {
			headData:dataBase.home.headData,
			homeFooterList:dataBase.home.homeFooterList,
			list:[],
			searchSetting: [
				{
					label: '表单标题',
					key: 'workOrderSearchVO.formTitle',
					type: 'text',
					placeholder: '请输入'
				},
				{
					label: '表单类型',
					key: 'workOrderSearchVO.isTask',
					type: 'radio',
					value: [{ text: '全部', value: ''}, { text: '普通单', value: '0'}, { text: '任务单', value: '1', relativeLabel: [3]}, { text: '审批单', value: '2', relativeLabel: [4, 6]}]
				},
				{
					label: '任务状态',
					key: 'workOrderSearchVO.auditStatus',
					type: 'radio',
					value: [{ text: '全部', value: ''}, { text: '未关闭', value: '0'}, { text: '已关闭', value: '-1'}],
					show: false
				},
				{
					label: '审批状态',
					key: 'workOrderSearchVO.auditStatus',
					type: 'radio',
					value: [{ text: '全部', value: ''}, { text: '审批中', value: '1'}, { text: '已审批', value: '2'}, { text: '退审', value: '3'}, { text: '关闭', value: '5'}],
					show: false
				},
				{
					label: '创建时间',
					key: ['workOrderSearchVO.createaStartTime', 'workOrderSearchVO.createaEndTime'],
					type: 'date'
				},
				{
					label: '审批时间',
					key: ['workOrderSearchVO.auditStartTime', 'workOrderSearchVO.auditEndTime'],
					type: 'date',
					show: false
				}
			]
		}
	},
	methods: {
		deleteList(index){ // 列表删除
			this.list.splice(index,1);
		},
		initList(isLoadMore) { // 初始化数据
			var _this = this,
				initFunction = initRelevant,
				setting = JSON.parse(JSON.stringify(this.setting)),
				searchValue = this.isSearch ? this.searchValue : setting;

			if(this.isSearch) {
				searchValue = Object.assign(searchValue, setting);
				initFunction = submitSearch;
			} else { // 不是高级搜索的情况下，加上必须的搜索字段
				searchValue.status = 1;
				searchValue.type = 1;
				searchValue.isTask = '';
				searchValue.taskStatus = '';
			}
			_.showLoading();
			initFunction(searchValue).then((res) => {
				_this.setList(res, isLoadMore);
			})
		}
	},
	created(){
		let _this = this;

		this.cache('submitedSearchValue');
		this.initList();
		this.searchBar.rightSpan.callback = function () {
			_this.advancedSearchShow = true;
		}
		this.$store.state.formBase.pageData.paramSearchType = 2;
		sessionStorage.setItem('pageData',JSON.stringify(this.$store.state.formBase.pageData));
	},
	beforeDestroy () { // 组件销毁前缓存高级搜索条件
		this.setStore('submitedSearchValue', this.searchValue);
	}
}
</script>

<style>
.submited {
	margin-top: 43px;
}
.submited .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
	transition: top .2s cubic-bezier(1.0, 0.5, 0.8, 1.0)
}

</style>
