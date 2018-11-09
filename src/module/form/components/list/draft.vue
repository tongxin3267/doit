<template>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
			<div class="qwui-nav_box_fixed"><search_bar :searchinput="searchBar" v-on:listenToSearchBox="showMsgFromSearchBar"></search_bar></div>
        <draft_list :list="list" v-on:listenUpdateList="updateList" ></draft_list>
        <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
        <load_more :busy="busy" :loading="loading" :showrecord="showrecord" @childevent="loadMore" :listCount="list.length"></load_more>
    </div>
</template>

<script>
    import search_bar from '@/components/base/search_box.vue';
    import draft_list from './draft_list.vue';
    import load_more from '../base/load_more.vue'
    import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
    import dataBase from "../../dataBase";
    import { initRelevant } from '../../api/list'


    export default {
        components:{
        draft_list,
        search_bar,
        load_more,
        dialog_mask_bottom
        },
        data(){
            return {
                list:[],
                searchBar:{ //头部搜索框
                show:true,
                keyWord:'',
                rightSpan:{
                    show:false,
                    callback:null
                },
    //          moreFunction:{
    //            show:false,
    //            option:[]
    //          }
                },
                busy:false,
                currPage:1,
                maxPage:0,
                loading:false,
                setting: {
                    page: 1,
                    keyWord: '',
                    pageSize: 20,//默认10
                    status: 0,
                    type: 1,
                },
				dialogBottomConfig: dataBase.dialogBottomConfig,
            }
        },
        created() {
			dataBase.dialogBottomConfig.title = '确认删除该表单？';
			dataBase.dialogBottomConfig.btnConfig.length = 0;
			dataBase.dialogBottomConfig.btnConfig[0] = {title:" 删除", callBack: null, primary:true};
			dataBase.dialogBottomConfig.btnConfig[1] = {title:" 取消", callBack: null};
            this.initList();
        },
        computed:{
            showrecord(){
                this.list = this.list ||[];
                return this.list.length==0?true:false;
        }
        },
        methods:{
        //删除列表
            updateList(index){
                this.list.splice(index,1);
            },
            loadMore() {
            	if(this.list.length < this.setting.pageSize) return;
                this.setting.page++;
                this.loading = true;
                this.busy = true;
                this.initList();
            },
            initList() {
                var _this = this;
                var getDraft = initRelevant;
                _.showLoading();
                getDraft(_this.setting).then((res) => {
                    _this.setList(res);
                })
            },
            setList(res) { // 设置列表数据
                this.loading = false;
                _.hideLoading();
                if(res.code != "0") {
                    return _.alert('提示', res.desc);
                }else {
                    this.setting.page = res.data.currPage;
                    this.busy = this.setting.page == res.data.maxPage;
                    this.list =  this.list.length > 0 ? this.list.concat(res.data.pageData) : res.data.pageData;
                }

            },
            showMsgFromSearchBar(value){
                if(this.setting.keyWord == value) return;
                this.list = [];
                this.setting.page = 1;
                this.busy = false;
                this.setting.keyWord = value;
                this.initList();
            },
        },

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
