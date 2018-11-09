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
		<select-card
			:selectdata="selectData"
			@listenTabChange="showMsgFromSelectCard"
			:top="43"
			:fixed="true"></select-card>
		<relevant-list
			:list="list"
			v-if="selectData.index == 1" ></relevant-list>
		<open-list
			:list="list"
			v-if="selectData.index == 0"></open-list>
		<advancedSearch
			ref="advancedSearch"
			v-show="advancedSearchShow"
			:setting="searchSetting"
			:cacheSearchValue="cacheSearchValue"
			@close="advancedSearchClose"
			@search="advancedSearch"></advancedSearch>
		<load-more
			:busy="busy"
			:loading="loading"
			:showrecord="showrecord"
			:record-title="recordTitle"
			:record-text="recordText"
			@childevent="loadMore"
      :listCount="list.length"
    ></load-more>
	</div>
</template>

<script>
import selectCard from '@/components/button/menu_tab_two'
import openList from './openList'
import relevantList from './relevantList'
import { initHead, initOpen, outerRelevant } from '../../api/list'
import { mixinTab } from './list'
import advancedSearch from '@/components/base/advancedSearch/index'

export default {
	mixins: [mixinTab],
	components:{
		selectCard,
		openList,
		relevantList,
		advancedSearch
	},
	data(){
		return {
			list: [],
			selectData: {
				index:0,
				nav:[{ content: '外部单提醒' }, { content: '我相关的' }]
			},
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
					label: '创建时间',
					key: ['workOrderSearchVO.createaStartTime', 'workOrderSearchVO.createaEndTime'],
					type: 'date'
				}
			],
			recordText: '通过外部单可以查看组织外部人员提交的数据, 数据模板请在后台配置',
			recordTitle: '没有外部单'
		}
	},
	created() {
		var _this = this;
		this.searchBar.rightSpan.show = false;

		this.cache('openSearchValue')
		initHead().then((res) => {
			if(res.code != "0") {
				return _.alert('提示', res.desc)
			}
			_this.selectData.nav[1].content = '我相关的(' + res.data.outRelevantNum + ')'
		})
		this.initList();
		this.searchBar.rightSpan.callback = function () {
			_this.advancedSearchShow = true;
		}
	},
	methods:{
		initList(isLoadMore) { // 初始化列表数据
			var _this = this,
				initFunction = null,
				setting = JSON.parse(JSON.stringify(this.setting)),
				searchValue = this.isSearch && this.selectData.index == 1 ? this.searchValue : setting;
			switch(this.selectData.index) { // 判断请求内容的类型
				case 0:
					initFunction = initOpen;  // 外部单提醒
					this.$store.state.formBase.pageData.paramSearchType = 1;
					break;
				case 1:
					initFunction = outerRelevant; // 我相关的
					this.$store.state.formBase.pageData.paramSearchType = 0;
					break;
			}
			if(this.isSearch && this.selectData.index == 1) {
				searchValue = Object.assign(searchValue, setting);
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
		},
		showMsgFromSelectCard(){
			this.list = [];
			this.setting.page = 1;
			this.busy = true;
			switch(this.selectData.index) {
				case 0: this.searchBar.rightSpan.show = false;
						this.recordText = '通过外部单可以查看组织外部人员提交的数据,数据模板请在后台配置';
						break;
				case 1: this.recordText = '作为相关人或被@的外部单，显示在这里';
						this.searchBar.rightSpan.show = true;
						break;

			}
			this.initList();
		}
	},
	beforeDestroy () { // 组件销毁前缓存高级搜索条件
		this.setStore('openSearchValue', this.searchValue);
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
