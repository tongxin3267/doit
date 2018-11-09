<template>
    <div
			v-infinite-scroll="loadMore"
			infinite-scroll-disabled="busy"
			infinite-scroll-distance="10"
			infinite-scroll-immediate-check="false">
			<div class="qwui-nav_box_fixed">
				<search_bar :searchinput="searchBar"
										v-on:listenToSearchBox="showMsgFromSearchBar"></search_bar>
			</div>
        <collection_list :list="list" :dialogBottomConfig="dialogBottomConfig" ></collection_list>
        <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
        <load_more :busy="busy"
          :loading="loading"
          :showrecord="showrecord"
          @childevent="loadMore"
          :listCount="list.length">
				</load_more>
    </div>
</template>

<script>

    import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
    import search_bar from '@/components/base/search_box.vue';
    import collection_list from './collection_list.vue'
    import load_more from '../base/load_more.vue'
    import { collection } from '../../api/list'

    export default {
        components:{
			search_bar,
			collection_list,
			dialog_mask_bottom,
			load_more,
        },
        data(){
            return {
                list:[],
                searchBar:{ //头部搜索框
                show:true,
                keyWord:'标题',
                rightSpan:{
                    show:false,
                    callback:null
                },
        //          moreFunction:{
        //            show:false,
        //            option:[]
        //          }
                },
        //        isGroup:true,
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

                dialogBottomConfig:{
                    show: false, //控制弹窗显示与否
                    title: "", //头部标题，设置为空的话不显示
                    btnConfig:[ //自定义弹框操作,可以设置回调函数
                        {title:"填写表单", callBack: null},//primary为true显示为红色，默认为灰色
                        {title:"查看明细数据", callBack: null},
                        {title:"取消收藏", callBack: null},
                        {title:" 取消", callBack: null}
                    ]
                }
            }
        },
        computed:{
        showrecord(){
            this.list = this.list ||[];
            return this.list.length==0?true:false;
        }
        },
        created(){
        this.initList();
        },
        methods:{
            loadMore() {
				if(this.list.length < this.setting.pageSize) return;
				this.setting.page++;
                this.loading = true;
                this.busy = true;
                this.initList();
            },

            initList() {
                var _this = this;
                _.showLoading();
                collection(_this.setting).then((res) => {
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
