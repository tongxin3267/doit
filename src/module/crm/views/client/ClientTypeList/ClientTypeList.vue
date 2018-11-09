<template>
    <div class="crm_list_wrap">
        <div class="crm_list_header">
            <search-box 
                :searchIndex="1"
                :searchinput="searchBar"
                @listenToSearchBox="showMsgFromSearchBox"
                ref="searchBox"
            >
            </search-box>
        </div>
        <div class="crm_list_main" v-scroll="loadMore" ref="wrapMain">
            <div class="crm_typeList_wrap">
                <qw-return-back
                    v-show="prevParentId.length"
                    @returnBack="returnBack"
                >
                </qw-return-back>
                <div :class="{tree_wrap: childListData.length > 0 && listData.length > 0}">
                    <qw-tree-item
                        :options="listData"
                        :config="parentConfig"
                        @clickTreeItem="clickTreeItem"
                    >
                    </qw-tree-item>
                </div>
                <qw-tree-item
                    :options="childListData"
                    :config="childConfig"
                    @clickTreeItem="clickTreeItem"
                >
                </qw-tree-item>
                <no-record 
                    :stepTop="true" 
                    :hasRecord="noRecord" 
                    v-show="showRecord"
                ></no-record>
            </div>
            <load-more 
                :loading="loadingMore" 
                :currPage="page" 
                :maxPage="maxPage"
            >
                <div class="member_tips">已没有更多</div>
            </load-more>
        </div>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box'; 
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import QwTreeItem from "@/components/tree/treeItem";
import QwTreeButton from "@/components/tree/treeButton";
import QwReturnBack from "@/components/tree/treeReturnBack";
import QwTreeList from "@/components/tree/treeList";
import listAvator from '@/assets/images/crm/ic_crm_ctype.png';
import avator from '@/assets/images/touxiang02.png';
import { getClientTypeList, getChildTypeList } from '../../../api/client/getData';
import treeListVue from '../../../../demo/tree/treeList.vue';

const PARENT_CONFIG = {  // 父级配置
                id: 'id',
                title: 'typeName',
                checkType: '',
                headPic: listAvator,
                parentId: 'parentId',
            }

const CHILD_CONFIG = {  // 子级配置
                id: 'id',
                title: 'clientName',
                checkType: '',
                headPic: 'headPic',
                defaultHeadPic: avator,
                parentId: 'parentId',
                subTitle:'personName'
            }

export default {
    name: 'ClientTypeList',
    components: {
        SearchBox,
        LoadMore,
        NoRecord,
        QwTreeItem,
        QwTreeButton,
        QwReturnBack,
        QwTreeList
    },
    data () {
        return {        
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction: {
                    show: true,
                    option: [
                        {
                            name:'名称', 
                            placeholder:'按客户名称搜索',
                            value: 'clientList'
                        },
                        {
                            name:'类别', 
                            placeholder:'按客户类别搜索'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },      
            listData: [],  // 父级列表配置 
            childListData: [],  // 子级列表配置   
            listParams: {  // 请求客户列表后台参数
                pId: 0,
                keyWord: ''
            }, 
            noRecord:{  // 无记录配置
                title: "",
                icon: "qwui-icon_text",
                text: "无记录"
            },    
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数  
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
            hasMore: true,  // 是否有更多数据
            isSearch: false,  // 是否显示新建提示
            showRecord: false,  // 是否显示没有记录提示
            parentConfig: PARENT_CONFIG,  // 父级配置
            childConfig: CHILD_CONFIG,  // 子级配置
            prevParentId: [],  // 上一级父id
            treeListShow: false,  // 显示列表
            isFirst: true  // 是否第一次进入路由
        }
    },
    created () {
        // 初始化
        this.init();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 如果是客户列表进入，强制刷新页面
            if(from.name === 'clientList'){
                if(!vm.isFirst){
                    vm.resetAllData();
                    vm.init();
                }
            } 
            vm.isFirst = false; 
            vm.$nextTick(() => {
                vm.$refs.wrapMain.scrollTop = to.meta.scrollY || 0;
            });
        });
    },
    beforeRouteLeave (to, from, next) {
        // 记录滚动位置
        from.meta.scrollY = this.$refs.wrapMain.scrollTop;
        next();
    },
    mounted () {
        // 计算列表高度
        this.$nextTick(() => {
            let windowHeight = document.documentElement.clientHeight;
            document.querySelector(".crm_list_wrap").style.height = `${windowHeight}px`;
        });  
    },
    methods: {
        // 搜索框回调函数
        showMsgFromSearchBox (keyWord, val) {
            // 如果现在名称，则跳转到客户列表
            if(val === 'clientList'){
                this.$router.push('/clientList');
            }

            this.listParams['keyWord'] = keyWord;
            this.restData();
            this.prevParentId.length > 0? this.getChildList(true) : this.getParentList(true);
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getParentList (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            
            this.loadingMore = true;
            this.isSearch = isSearch;

            getClientTypeList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;

                    // 如果总条数为0，则显示无记录
                    if(list.length > 0){
                        this.showRecord = false;
                    }
                    else{
                        // 如果是搜索，则改变没有数据的提示图标和语句
                        if(isSearch){
                            this.noRecord.icon = 'qwui-icon_search';
                            this.noRecord.title = '没有记录';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){
                        this.treeListShow = true;
                        this.listData = this.listData.concat(list);     
                    }
                }
                else{
                    _alert('提示',res.desc);
                }
            })
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getChildList (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            
            this.loadingMore = true;
            this.isSearch = isSearch;

            getChildTypeList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let typeList = res.data.typeList;
                    let { maxPage, totalRows } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;

                    // 有列表数据才渲染
                    if(list && list.length > 0){
                        this.showRecord = false;
                        this.treeListShow = true;
                        this.childListData = this.childListData.concat(list);            
                    }

                    // 只有为第一页的时候，才渲染含有子级列表的选项
                    if(this.page === 1){
                        if(typeList && typeList.length > 0){
                            this.showRecord = false;
                            this.treeListShow = true;
                            this.listData = this.listData.concat(typeList);
                        }
                    }
                    
                    // 如果两个列表的数据都为0，才显示无记录
                    if(this.childListData.length === 0 && this.listData.length === 0){
                        // 如果是搜索，则改变没有数据的提示图标和语句
                        if(isSearch){
                            this.noRecord.icon = 'qwui-icon_search';
                            this.noRecord.title = '没有记录';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }
                }
                else{
                    _alert('提示',res.desc);
                }
            })
        },

        // 加载更多客户列表
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight >= scrollHeight - 10){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getChildList();
                }
            }
        },

        // 初始化数据
        init () {
            // 请求客户列表数据
            this.getParentList();
        },

        // 重置列表数据
        restData () {
            this.page = 1;
            this.listData = [];
            this.childListData = [];
        },

        // 点击列表项
        clickTreeItem (payload) {
            // 改变搜索框的标签
            this.searchBar.moreFunction.option = [
                {
                    name:'类别/客户', 
                    placeholder:'按类别/客户名称搜索',
                },
                {
                    name:'拜访次数', 
                    placeholder:'按客户拜访次数搜索'
                },
                {
                    name:'联系电话', 
                    placeholder:'按联系电话搜索'
                },
                {
                    name:'按负责人', 
                    placeholder:'按负责人搜索'
                }
            ]
            
            if(payload.parentId){
                this.listParams['pId'] = payload.id;
                this.prevParentId.push(payload.id);
                this.restData();
                this.getChildList();
            }
            else{
                location.href = `${_.baseURL}/jsp/wap/crm/client/client_detail.jsp?id=${payload.id}&isClient=1&isManager=1`
            }
        },

        // 重置搜索条件
        resetSearchData () {
            this.listParams['keyWord'] = '';

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
        },

        // 返回上一级
        returnBack () {
            let length = '';

            this.restData();
            this.resetSearchData();
            this.prevParentId.pop();
            length = this.prevParentId.length;
            this.listParams['pId'] = this.prevParentId[length - 1];

            // 如果prevParentId数组长度为0，则为第一级
            if(this.prevParentId.length > 0){
                this.getChildList();
            }
            else{
                // 改变搜索框的标签
                this.searchBar.moreFunction.option = [
                    {
                        name:'名称', 
                        placeholder:'按客户名称搜索',
                        value: 'clientList'
                    },
                    {
                        name:'类别', 
                        placeholder:'按客户类别搜索'
                    }
                ]
                this.getParentList();
            }
        },

        // 重置所有数据
        resetAllData () {
            this.restData();
            this.resetSearchData();
            this.searchBar = { 
                show: true, 
                keyWord: '',
                moreFunction: {
                    show: true,
                    option: [
                        {
                            name:'名称', 
                            placeholder:'按客户名称搜索',
                            value: 'clientList'
                        },
                        {
                            name:'类别', 
                            placeholder:'按客户类别搜索'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            }       
            this.listParams = { 
                pId: 0,
                keyWord: ''
            }
            this.noRecord = { 
                title: "",
                icon: "qwui-icon_text",
                text: "无记录"
            }    
            this.loadingMore = false;
            this.maxPage = 0;
            this.totalRows = 0;
            this.hasMore = true;
            this.isSearch = false;
            this.showRecord = false;
            this.prevParentId = [];
            this.treeListShow = false;
        }
    }
}
</script>
<style lang="scss">
@import './ClientTypeList.scss';
</style>





