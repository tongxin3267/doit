<template>
    <div
        class="formlist"
        infinite-scroll-immediate-check="false"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
        <div class="qwui-nav_box_fixed">
            <search-bar
                :searchinput="searchBar"
                @listenToSearchBox="showMsgFromSearchBar"></search-bar>
        </div>
        <form-list :list="list"></form-list>
        <load-more
            :busy="busy"
            :loading="loading"
            :showrecord="showrecord"
            @childevent="loadMore"
            :listCount="list.length"></load-more>
    </div>
</template>

<script>
import searchBar from '@/components/base/search_box.vue';
import formList from './list/formList'
import { initForm } from '../api/list'
import loadMore from './base/load_more.vue'

export default {
    name: 'formlist',
    components:{
		searchBar,
		formList,
		loadMore
	},
    data() {
        return {
            list: [],
            searchBar:{ //头部搜索框
				show: true,
				keyWord: '',
				moreFunction: {
					show: true,
					option: [
                        {
							name: '名称',
							placeholder: '搜索名称'
						},
						{
							name: '分组',
							value: 'formtype'
						}
					]
				}
            },
            setting: { page: 1, keyWord: '', pageSize: 10 },
            busy: true,
			loading: false,
        }
    },
    created() {
        var _this = this;
        this.initList()
    },
    computed:{
		showrecord(){
			this.list = this.list || [];
			return this.list.length == 0 ? true : false;
        }
	},
    methods: {
        loadMore(){
			this.setting.page++;
			this.loading = true;
            this.busy = true;
            this.initList(true);
		},
        initList(isLoadMore) {
            var _this = this,
                searchValue = this.setting;
            searchValue.typeId = this.$route.query.typeId;
            searchValue.status = "";
            searchValue.type = "";

            _.showLoading()
            initForm(searchValue).then((res) => {
                _this.setList(res, isLoadMore)
            })
        },
        setList(res, isLoadMore) {
            this.loading = false;
            _.hideLoading();
            if(res.code != "0") {
                return _.alert('提示', res.desc);
            }
            this.busy = this.setting.page == res.data.maxPage;
            this.list = isLoadMore ? this.list.concat(res.data.pageData) : res.data.pageData;
        },
        showMsgFromSearchBar(keyWord, value){
            if(value == "formtype") {
                this.$router.push('/formtype');
            }
			if(keyWord == this.setting.keyWord) {
				return
			}
			this.list = [];
            this.setting.page = 1;
            this.setting.keyWord = keyWord;
            this.initList();
		}
    }

}
</script>

<style>
.formlist {
    margin-top: 43px;
}
.formlist .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}
</style>
