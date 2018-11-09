<template>
    <div class="crm_list_wrap crm_pool_wrap">
        <div class="top_tips" v-show="topTips.show">
            <span>{{topTips.content}}</span>
        </div>
        <div class="crm_list_header">
            <div class="flex_box">
                <div class="search_bar_wrap">
                    <search-box
                        :searchinput="searchBar"
                        @listenToSearchBox="showMsgFromSearchBox"
                        ref="searchBox"
                    >
                    </search-box>
                </div>
                <div class="operate_btn" @click="openDialog" v-if="userType === 3">
                    <i class="dot_icon"></i>
                </div>
                <div class="operate_btn" @click="searchOpen">
                    <i class="hanber_icon"></i>
                </div>
            </div>
            <div class="pool_bar_wrap" v-if="userType === 2 || userType === 3">
                <div class="pool_bar" @click="poolToggle">
                    <span>{{currentPool}}</span>
                    <i class="down_arrow" v-show="!isOnePool"></i>
                </div>
                <div class="pool_list" v-show="showPoolList && !isOnePool">
                    <crm-select-list
                        :listData="poolListData"
                        :activeId="activeId"
                        @selectEvent="selectPool"
                    ></crm-select-list>
                </div>
            </div>
        </div>
        <advanced-search
            @search="search"
            @close="searchClose"
            :setting="setting"
            v-show="advancedShow"
            :cache-search-value="cacheSearchValue"
        ></advanced-search>
        <div
            class="crm_list_main"
            v-scroll="loadMore"
            ref="wrapMain"
            :class="{no_scroll:showPoolList}"
        >
            <div class="separate_line" v-if="userType === 2 || userType === 3"></div>
            <crm-list
                :listData="listData"
                :isEllipsis="true"
                :canSelect="true"
                :oneLine="oneLine"
                @selectEvent="selectEvent"
                @click="goDetail"
            >
            </crm-list>
            <load-more
                :loading="loadingMore"
                :currPage="page"
                :maxPage="maxPage"
            >
                <div class="member_tips">共 {{totalRows}}个客户</div>
            </load-more>
            <no-record
                :stepTop="true"
                :hasRecord="noRecord"
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">没有客户</p>
            </no-record>
        </div>
        <div v-show="showFooterBtn">
            <div class="footer_btn_wrap">
                <qwui-button
                    type="default"
                    text="取消"
                    @buttonClick="cancelSelect"
                ></qwui-button>
                <qwui-button
                    v-show="userType === 3"
                    type="primary"
                    text="分配"
                    @buttonClick="assignPoolClient"
                ></qwui-button>
                <qwui-button
                    v-show="userType === 2"
                    type="primary"
                    text="领取"
                    @buttonClick="receivePoolClient"
                ></qwui-button>
            </div>
        </div>
        <crm-fixed-nail
            :isRouter="false" 
            path="/jsp/wap/crm/territorialSea/territorialSea_add.jsp" 
            v-if="userType === 3"
        ></crm-fixed-nail>
        <div class="crm_list_mask" v-if="showPoolList" @click="closePoolList"></div>
        <dialog-mask-bottom :dialogConfig="dialogBottomConfig"></dialog-mask-bottom>
        <user-select
            :selectconfig="dataBase.selectConfig"
            :closeAllTab="true"
            :closeGroup="true"
            :closeDept="true"
            tabActive="user"
            userSelectType="onlyUser"
            v-if="dataBase.selectConfig.show"
            v-bind="userConfig"
        ></user-select>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
import QwuiButton from '@/components/base/button/button';
import DialogMaskBottom from '@/components/base/dialog_mask_bottom';
import UserSelect from '@/components/base/user_or_dept_select';
import CrmList from '../../../components/CrmList/CrmList';
import CrmSelectList from '../../../components/CrmSelectList/CrmSelectList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import { getPoolList, getClientPool, checekManage, receivePoolClient, assignPoolClient } from '../../../api/pool/getData';

const NOT_OPEN_POOL = 0;  // 没有开启公海
const NORMAL_USER = 1;  // 普通用户
const POOL_MEMBER = 2;  // 公海成员
const POOL_MANAGER = 3;  // 公海负责人


export default {
    name: 'PoolList',
    components: {
        SearchBox,
        CrmList,
        LoadMore,
        CrmFixedNail,
        NoRecord,
        AdvancedSearch,
        QwuiButton,
        CrmSelectList,
        DialogMaskBottom,
        UserSelect
    },
    data () {
        return {
            dataBase:dataBase,
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: false,
                    option: [
                        {
                            name:'标题',
                            placeholder:'搜索标题'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },
            listData: [],  // 列表配置
            listParams: {  // 请求列表后台参数
                'searchValue.poolId': '',
                'searchValue.title': '',
                'searchValue.clientCode': '',
                'searchValue.backTimes': '',
                'searchValue.industry': '',
                'searchValue.area': '',
                'searchValue.address': '',
                'searchValue.ccPerson': '',
                'searchValue.createPerson': '',
                'searchValue.startTime': '',
                'searchValue.endTime': '',
                'searchValue.startUpdateTime': '',
                'searchValue.endUpdateTime': ''
            },
            noRecord:{  // 无记录配置
                title: "",
                icon: "qwui-icon_text",
                text: ""
            },
            loadingMore: false,  // 是否正在加载
            page: 1,  // 当前页数
            maxPage: 0,  // 最大页数
            totalRows: 0,  // 总成员数
            hasMore: true,  // 是否有更多数据
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否显示新建提示
            setting: [  // 高级搜索配置列表
                {
                    label: '客户名称',
                    key: 'searchValue.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户编码',
                    key: 'searchValue.clientCode',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '退回次数',
                    key: 'searchValue.backTimes',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户行业',
                    key: 'searchValue.industry',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户区域',
                    key: 'searchValue.area',
                    type: 'address'
                },
                {
                    label: '客户地址',
                    key: 'searchValue.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'searchValue.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'searchValue.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['searchValue.startTime', 'searchValue.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['searchValue.startUpdateTime', 'searchValue.endUpdateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                }
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
            showFooterBtn: false,  // 是否显示底部按钮
            showPoolList: false,  // 是否显示公海列表
            poolPage: 1,  // 公海池列表当前页数
            poolListData: [],  // 公海池列表数据
            activeId: 0,  // 当前选中的公海池idx
            currentPool: '',  // 当前选中的公海池名称
            userType: NORMAL_USER,  // 当前用户类型
            dialogBottomConfig: {  // 列表操作弹窗设置
                show: false,
                title: '',
                btnConfig: [
                    {title:" 公海回收站", callBack: this.goRecycleBin},
                    {title:" 取消", callBack: null}
                ]
            },
            isOnePool: false,  // 是否只有一个公海
            oneLine: false,  // 是否点击一行可以触发选择框
            clientIds: '',  // 选中的公海客户ids
            topTips: {  // topTips相关
                show: false,
                content: ''
            },
            isFirst: true  // 是否第一次进入路由
        }
    },
    computed: {
        userConfig () {  // 选人配置相关
            return {
                    userListUrl: `/portal/clientPoolAction!getPoolMember.action?poolId=${this.listParams['searchValue.poolId']}`,
                    keyWordSearchUrl: `/portal/clientPoolAction!getPoolMember.action?poolId=${this.listParams['searchValue.poolId']}`,
                    letterSearchUrl: `/portal/clientPoolAction!getPoolMember.action?poolId=${this.listParams['searchValue.poolId']}`
            }
        }
    },
    created () {
        // 初始化
        this.init();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 如果是首页进入，强制刷新页面
            if(from.name === 'home' || from.name === 'homeTest'){
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
            if(this.userType != NOT_OPEN_POOL){
                this.listParams['searchValue.title'] = keyWord;
                this.$set(this.cacheSearchValue, 'searchValue.title', keyWord);
                this.restData();
                this.getListData(true);
            }
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getPoolList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;

                    // 如果总条数为0，则显示无记录
                    if(this.totalRows > 0){
                        this.showRecord = false;
                    }
                    else{
                        // 如果是搜索，则改变没有数据的提示图标和语句
                        if(isSearch){
                            this.noRecord.icon = 'qwui-icon_search';
                            this.noRecord.title = '没有客户';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){
                        list.map((item,idx) => {
                            let obj = {
                                id: item.id,
                                top: item.clientName,
                                canSelect: true,
                                mid: [],
                                bottom: {
                                    isShowAvator: false,
                                    msg: { },
                                    data: [
                                        {
                                            title: '创建时间 ',
                                            value: item.createTime.split(' ')[0],
                                        },
                                        {
                                            title: '退回次数 ',
                                            value: item.backTimes
                                        }
                                    ]
                                }
                            };
                            this.listData.push(obj);
                        });
                    }
                }
                else{
                    _.alert('提示',res.desc);
                }
            })
        },

        // 加载更多列表
        loadMore (el) {
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight >= scrollHeight - 10){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getListData();
                }
            }
        },

        // 跳转详情
        goDetail (id) {
            location.href = `${_.baseURL}/jsp/wap/crm/territorialSea/territorialSea_detail.jsp?type=0&id=${id}`;
        },

        // 初始化数据
        init () {
            // 初始化选人
            this.resetSelectPerson();

            // 获取公海池列表
            this.getClientPool();
        },

        // 重置列表数据
        restData () {
            this.page = 1;
            this.listData = [];
        },

        // 重置搜索条件
        resetSearchData () {
            for(let key in this.listParams){
                if(key != 'searchValue.poolId'){
                    this.listParams[key] = '';
                }
            }

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
        },

        // 比较时间大小
        compareDate (startVal, endVal, tips) {
            let startTime = startVal || '';
            let endTime = endVal || '';

            // 开始时间不能大于结束时间
            if(Date.parse(startTime) > Date.parse(endTime)){
                _.alert('提示',tips);
                this.advancedShow = true;
                return false;
            }
            return true;
        },

        // 高级搜索
        search (searchValue) {
            let keyList = Object.keys(searchValue);

            // 没有返回数据，则重置数据
            if(keyList.length > 0){
                let createStartTime = searchValue['searchValue.startTime'];
                let createEndTime = searchValue['searchValue.endTime'];
                let updateStartTime = searchValue['searchValue.startUpdateTime'];
                let updateEndTime = searchValue['searchValue.endUpdateTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(updateStartTime, updateEndTime, '结束时间不能早于开始时间')) return;

                // 判断区域是否存在
                if(searchValue['searchValue.area']){
                    this.listParams['searchValue.area'] = searchValue['searchValue.area'].text; 
                    delete searchValue['searchValue.area'];
                }

                this.listParams = Object.assign({},this.listParams,searchValue);
            }
            else{
                this.resetSearchData();
            }

            // 只有开启公海后才执行
            if(this.userType != NOT_OPEN_POOL){
                this.restData();
                this.getListData(true);
            }
        },

        // 关闭高级搜索
        searchClose () {
            this.advancedShow = false;
        },

        // 打开高级搜索
        searchOpen () {
            this.advancedShow = true;
        },

        // 选择列表项函数
        selectEvent (selectList) {
            // 有选中才显示底部按钮
            if(selectList.length > 0){
                this.showFooterBtn = true;
                this.clientIds = selectList.join(',');
            }
            else{
                this.showFooterBtn = false;
                this.clientIds = '';
            }
        },

        // 取消选择
        cancelSelect () {
            this.listData.map((item,idx) => {
                this.$set(this.listData[idx], 'isSelect', false);
            });
            this.showFooterBtn = false;
        },

        // 公海列表开关
        poolToggle () {
            // 只有一个公海时不能点击
            if(!this.isOnePool){
                this.showPoolList = !this.showPoolList;
            }
        },

        // 获取公海池列表
        getClientPool () {
            getClientPool().then(res => {
                if(res.code == '0'){
                    let list = res.data.allPoolList;

                    if(!res.data.isUsingCrmPool){  // 没有开启公海
                        this.userType = NOT_OPEN_POOL;
                        this.noRecord.icon = 'qwui-icon_text';
                        this.noRecord.title = '暂无记录';
                        this.noRecord.text = '可联系管理员在后台开启公海';
                        this.showRecord = true;
                    }
                    else if(res.data.isNormalUser){  // 普通用户
                        this.userType = NORMAL_USER;
                        this.noRecord.icon = 'qwui-icon_text';
                        this.noRecord.title = '没有客户';
                        this.noRecord.text = '';
                        this.showRecord = true;
                    }
                    else{
                        if(list && list.length > 0){
                            // 获取缓存的公海
                            let storagePool = localStorage.getItem('selectPool')? JSON.parse(localStorage.getItem('selectPool')) : '';
                            let isExist = false;

                            list.map((item,idx) => {
                                let obj = {
                                    id: item.id,
                                    title: item.poolName,
                                }
                                this.poolListData.push(obj);

                                // 判断缓存的公海是否存在
                                if(storagePool.poolId === item.id){
                                    isExist = true;
                                }
                            });

                            // 若缓存的公海存在，则默认选中
                            if(isExist){
                                this.currentPool = storagePool.poolName;
                                this.listParams['searchValue.poolId'] = this.activeId = storagePool.poolId;
                            }
                            else{
                                this.currentPool = this.poolListData[0].title;
                                this.listParams['searchValue.poolId'] = this.activeId = this.poolListData[0].id;
                            }


                            // 只有一个公海
                            this.isOnePool = list.length === 1? true : false;

                            // 获取角色权限
                            this.checekManage();
                        }
                    }
                }
                else{
                    _.alert('提示',res.desc);
                }
            });
        },

        // 选中公海
        selectPool (id, title) {
            let obj = {
                poolId: id,
                poolName: title
            }

            this.showPoolList = false;
            this.currentPool = title;
            this.listParams['searchValue.poolId'] = id;
            this.showFooterBtn = false;
            this.restData();
            this.checekManage();

            // 缓存当前选择的公海
            localStorage.setItem('selectPool', JSON.stringify(obj));
        },

        // 隐藏公海池列表
        closePoolList () {
            this.showPoolList = false;
        },

        // 是否有公海权限
        checekManage () {
            let obj = {
                poolId: this.listParams['searchValue.poolId']
            }
            checekManage(obj).then(res => {
                if(res.code == '0'){
                    // 如果有权限，则为公海负责人。否则为公海成员
                    this.userType = res.data.hasPermission? POOL_MANAGER : POOL_MEMBER;
                    this.oneLine = this.userType === POOL_MEMBER? true : false;

                    // 请求列表数据
                    this.getListData();
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 打开底部选择栏
        openDialog () {
            this.dialogBottomConfig.show = true;
        },

        // topTips提示
        tips_alert (content) {
            this.topTips.show = true;
            this.topTips.content = content;
            setTimeout(() => {
                this.topTips.show = false;
            },3000);
        },

        // 领取公海客户
        receivePoolClient () {
            let obj = {
                poolId: this.listParams['searchValue.poolId'],
                clientIds: this.clientIds
            }
            receivePoolClient(obj).then(res => {
                if(res.code == '0'){
                    this.tips_alert('领取成功，可在我负责的客户中查看编辑');
                    this.showFooterBtn = false;
                    this.restData();
                    this.getListData();
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 分配公海客户
        assignPoolClient () {
            this.dataBase.selectConfig.show = true;
        },

        // 初始化选人
        resetSelectPerson () {
            this.dataBase.selectConfig.signIndex = 'toPersonList';
            this.dataBase.selectConfig.selectList["toPersonList"].userRestriction = '1';
            this.dataBase.selectConfig.selectList["toPersonList"].callBack.confirm = this.confirmUser;
        },

        // 跳转到公海回收站
        goRecycleBin () {
            location.href = `${_.baseURL}/jsp/wap/crm/territorialSea/territorialSea_recycleBin.jsp`;
        },

        // 选人确定回调函数
        confirmUser (el, obj) {
            let userId = obj.user.data[0].userId || '';
            let params = {
                poolId: this.listParams['searchValue.poolId'],
                clientIds: this.clientIds,
                userId: userId
            }
            assignPoolClient(params).then(res => {
                if(res.code == '0'){
                    this.tips_alert('分配成功');
                    this.showFooterBtn = false;
                    this.restData();
                    this.getListData();
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 重置所有数据
        resetAllData () {
            this.restData();
            this.resetSearchData();
            this.searchBar = {
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: false,
                    option: [
                        {
                            name:'标题',
                            placeholder:'搜索标题'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            }
            this.noRecord = {
                title: "",
                icon: "qwui-icon_text",
                text: ""
            },
            this.loadingMore = false;
            this.maxPage = 0;
            this.totalRows = 0;
            this.hasMore = true;
            this.showRecord = false;
            this.isSearch = false;
            this.setting = [
                {
                    label: '客户名称',
                    key: 'searchValue.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户编码',
                    key: 'searchValue.clientCode',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '退回次数',
                    key: 'searchValue.backTimes',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户行业',
                    key: 'searchValue.industry',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户区域',
                    key: 'searchValue.area',
                    type: 'address'
                },
                {
                    label: '客户地址',
                    key: 'searchValue.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'searchValue.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'searchValue.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['searchValue.startTime', 'searchValue.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['searchValue.startUpdateTime', 'searchValue.endUpdateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                }
            ];
            this.advancedShow = false;
            this.cacheSearchValue = {}
            this.showFooterBtn = false;
            this.showPoolList = false;
            this.poolPage = 1;
            this.poolListData = [];
            this.activeId = 0;
            this.currentPool = '';
            this.userType = NORMAL_USER;
            this.dialogBottomConfig = {
                show: false,
                title: '',
                btnConfig: [
                    {title:" 公海回收站", callBack: this.goRecycleBin},
                    {title:" 取消", callBack: null}
                ]
            },
            this.isOnePool = false;
            this.oneLine = false;
            this.clientIds = '';
            this.topTips = {
                show: false,
                content: ''
            }
        }
    }
}
</script>
<style lang="scss">
@import './PooList.scss'
</style>


