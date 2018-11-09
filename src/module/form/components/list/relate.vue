<template>
    <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
						<div class="qwui-nav_box_fixed"><search-bar
							:searchinput="searchBar"
							@listenToSearchBox="showMsgFromSearchBar"></search-bar>
						</div>
            <select-card
                :selectdata="selectData"
                @listenTabChange="showMsgFromSelectCard"
                :top="43"
                :fixed="true"></select-card>
            <relate-list :list="list"></relate-list>
            <advanced-search ref="advancedSearch"
                v-show="advancedSearchShow"
                :setting="searchSetting"
                :cache-search-value="cacheSearchValue"
                @close="advancedSearchClose"
                @search="advancedSearch"></advanced-search>
            <load-more :busy="busy"
              :loading="loading"
              :showrecord="showrecord"
              :record-title="recordTitle"
              :record-text="recordText"
              @childevent="loadMore"
              :listCount="list.length"></load-more>
    </div>
</template>

<script>
import selectCard from '@/components/button/menu_tab_two'
import relateList from './relateList.vue'
import { initRelevant, relevantSearch } from '../../api/list'
import { mixinTab } from './list'
import advancedSearch from '@/components/base/advancedSearch/index'

export default {
    mixins: [mixinTab],
    components:{
        relateList,
        selectCard,
		advancedSearch
    },
    data(){
        return {
            list:[],
            isTask: 2,
            selectData: {
                index:0,
                nav:[
                {
                    content: '审批单',
                    data:{ //点击切换传递的数据
                        isTask: 2,
                    },
                },
                {
                    content: '任务单',
                    data:{ //点击切换传递的数据
                    isTask: 1,
                    },
                },
                {
                    content: '普通单',
                    data:{ //点击切换传递的数据
                    isTask: 0,
                    },
                }
                ]
            },
            searchSetting: [],
            searchSettingArr: [[0, 1, 2, 4, 5, 6, 7], [0, 1, 3, 4, 5, 6], [0, 1, 4, 5, 6]],
            searchSettingData: [
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
                    label: '审批状态',
                    key: 'workOrderSearchVO.auditStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '审批中', value: '1'}, { text: '已审批', value: '2'}, { text: "我经办的", value: "6"}, { text: '退审', value: '3'}, { text: '关闭', value: '5'}],
                },
                {
                    label: '任务状态',
                    key: 'workOrderSearchVO.auditStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '未关闭', value: '0'}, { text: '已关闭', value: '-1'}]
                },
                {
                    label: '部门',
                    key: 'workOrderSearchVO.departId',
                    type: 'selectDepart',
					deptRestriction: '1'
                },
                {
                    label: '创建人/提单人',
                    key: 'workOrderSearchVO.creatorId',
                    type: 'selectPerson',
					userRestriction: '1'
                },
                {
                    label: '创建时间',
                    key: ['workOrderSearchVO.createaStartTime', 'workOrderSearchVO.createaEndTime'],
                    type: 'date'
                },
                {
                    label: '审批时间',
                    key: ['workOrderSearchVO.auditStartTime', 'workOrderSearchVO.auditEndTime'],
                    type: 'date'
                }
            ]
        }
    },
    created() {
        var _this = this;
        this.cache('relateSearchValue' + this.isTask);
        this.initList();
        this.searchBar.rightSpan.callback = function () {
            _this.setSearchSetting(_this.searchSettingArr[_this.selectData.index]);
            _this.advancedSearchShow = true;
        }

		this.$store.state.formBase.pageData.paramSearchType = 4;
    },
    methods:{
        initList(isLoadMore){
            let _this = this,
                initFunction = initRelevant,
                setting = JSON.parse(JSON.stringify(this.setting)),
                searchValue = this.isSearch ? this.searchValue : this.setting;

            searchValue = Object.assign(searchValue, setting);
            searchValue.isTask = this.isTask;
            searchValue.type = 3;
            searchValue.status = 1;
            if(this.isSearch) {
                initFunction = relevantSearch;
            }

//            改变pageData的参数
			this.$store.state.formBase.pageData.paramSeniorSearch = 0;
			this.$store.state.formBase.pageData.paramIsTask = searchValue.isTask;
			this.$store.state.formBase.pageData.paramTitle = searchValue.keyWord;
			sessionStorage.setItem('pageData',JSON.stringify(this.$store.state.formBase.pageData));

            _.showLoading();
            initFunction(searchValue).then((res) => {
                _this.setList(res, isLoadMore)
            })
        },
        showMsgFromSelectCard(data){
            let oldKey = 'relateSearchValue' + this.isTask,
                newKey = 'relateSearchValue' + data.data.isTask;

            this.list = [];
            this.setting.page = 1;
            this.setStore(oldKey, this.searchValue)
            this.cache(newKey);
            this.isTask = data.data.isTask;
            this.busy = true;
            this.initList();
        },
        setSearchSetting(searchSetting) {
            let _this = this;
            this.searchSetting = [];
            searchSetting.forEach((item) => {
                _this.searchSetting.push(_this.searchSettingData[item])
            })
        }
    },
	beforeDestroy () { // 组件销毁前缓存高级搜索条
		this.setStore('relateSearchValue' + this.isTask, this.searchValue);
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
