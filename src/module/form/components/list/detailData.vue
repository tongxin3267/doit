<template>
    <div class="detailData"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
        <div class="qwui-nav_box_fixed">
            <search-bar
                :searchinput="searchBar"
                @listenToSearchBox="showMsgFromSearchBar"></search-bar>
        </div>
        <div class="qwui-list_Toptitle">
            <p class="ellipsis">{{formName}}</p>
        </div>
        <detail-list :list="list"></detail-list>
        <button-group :fixed="true" v-if="canDownLoad">
            <qwui-button type="primary" text="下载当前明细" @buttonClick="showCondition = true"></qwui-button>
        </button-group>
        <download-condition v-show="showCondition"
            :type="isTask == 3 ? 1 : 0"
            :id="id"
            :keyWord="setting.keyWord"
            @close="showCondition = false"></download-condition>
        <advanced-search
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
import { wordOrderMxList, outerMxList } from '../../api/list'
import detailList from './detailList'
import { mixinTab } from './list'
import advancedSearch from '@/components/base/advancedSearch/index'
import qwuiButton from '@/components/base/button/button'
import buttonGroup from '@/components/base/button/button_group'
import downloadCondition from './detailDownLoadCondition'

export default {
    mixins: [mixinTab],
    name: 'detailData',
    components: {
        detailList,
		advancedSearch,
        buttonGroup,
        downloadCondition,
        qwuiButton
    },
    data() {
        return {
            showCondition: false,
            canDownLoad: 0,
            formName: '',
            list: [],
            id: this.$route.query.id, // 当前表单的id
            isTask: this.$route.query.isTask, // 当前表单的类型
            searchSetting: [], // 当前高级搜索配置
            searchSettingArr: [[0, 1, 5, 6, 7], [0, 1, 4, 5, 6, 7], [0, 1, 2, 3, 5, 6, 7, 8], [0, 1, 7]], // 高级搜索配置数据，不同表单类型，不同配置
            searchSettingData: [ // 高级搜索配置数据
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
                    label: '数据范围',
                    key: 'workOrderSearchVO.meRange',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '我创建的', value: '3'}, { text: '我负责的', value: '1'}, { text: '我相关的', value: '2'}]
                },
                {
                    label: '审批状态',
                    key: 'workOrderSearchVO.auditStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: ''}, { text: '审批中', value: '1'}, { text: '已审批', value: '2'}, { text: '退审', value: '3'}, { text: '关闭', value: '5'}],
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
        this.initList();
        this.setSearchSetting(this.searchSettingArr[this.isTask]); // 配置高级搜索配置
        this.searchBar.rightSpan.callback = function () {
            _this.advancedSearchShow = true;
        }
    },
    methods: {
        initList(isLoadMore) {
            var _this = this,
                initFunction = null,
                setting = JSON.parse(JSON.stringify(this.setting)),
                searchValue = this.isSearch ? this.searchValue : this.setting;

            if(this.isTask == 3) { // 判断明细数据的表单类型，并对应更改搜索内容以及接口
                searchValue.id = this.id;
                initFunction = outerMxList;
            } else {
                searchValue.definitionVersionsId = this.id;
                initFunction = wordOrderMxList;
            }
            if(this.isSearch) { // 高级搜索需要把setting结合一起搜索
                searchValue = Object.assign(searchValue, setting);
            }
            _.showLoading();
            initFunction(searchValue).then((res) => { // 请求数据
                _this.setList(res, isLoadMore);
                _this.formName = res.data.formName;
                _this.canDownLoad = res.data.isWxDownloadMx
            })
        },
        setSearchSetting(searchSetting) {
            let _this = this;
            this.searchSetting = [];
            searchSetting.forEach((item) => {
                _this.searchSetting.push(_this.searchSettingData[item])
            })
        }
    }
}
</script>

<style scoped>
.detailData {
	margin: 43px 0 60px 0;
    position: relative;
}
.detailData .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}
</style>
