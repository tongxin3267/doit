<template>
    <div class="crm_list_wrap">
        <div class="crm_list_header">
            <div class="flex_box">
                <div class="search_bar_wrap">
                    <search-box
                        :searchIndex="searchIndex"
                        :searchinput="searchBar"
                        @listenToSearchBox="showMsgFromSearchBox"
                        ref="searchBox"
                    >
                    </search-box>
                </div>
                <div class="operate_btn" @click="searchOpen">
                    <i class="hanber_icon"></i>
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
        <div class="crm_list_main" v-scroll="loadMore" ref="wrapMain">
            <crm-read-bar 
                v-show="showReadBar" 
                :readMsg="readMsg"
                @checkReadMsg="checkReadMsg"
                @signRead="signRead"
            >
            </crm-read-bar>
            <crm-list 
                :listData="listData" 
                @click="goDetail"
            >
            </crm-list>
            <load-more 
                :loading="loadingMore" 
                :currPage="page" 
                :maxPage="maxPage"
            >
                <div class="member_tips">共 {{totalRows}}个成员</div>
            </load-more>
            <no-record 
                :stepTop="true" 
                :hasRecord="noRecord" 
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">
                    还没有客户，马上<router-link to="/clientOperate">新建一个</router-link>
                </p>
            </no-record>
        </div>
        <div class="crm_list_footer">
            <nav-footer>
                <tab-one 
                    v-for="(navItem,idx) in footerNav" 
                    :key="idx" 
                    v-bind="navItem" 
                    :activeIndex="activeIdx"
                    @tabOneClick="tabOneClick(idx)"
                >
                </tab-one>
            </nav-footer>
        </div>
        <crm-fixed-nail path="/clientOperate"></crm-fixed-nail>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box'; 
import NavFooter from '@/components/part/nav_footer';
import TabOne from '@/components/part/tab_one';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getClientList, getNotReadNum, readAll, getBussinessStage, getContractStatus } from '../../../api/client/getData';

const PROVINCE_CODE_GD = 440000;  // 广东省码
const CITY_CODE_GZ = 440100;  // 广州市码
const TAB_TYPE = ['allClient','toPerson','ccPerson','createPerson'];  // 底部tab类型

export default {
    name: 'ClientList',
    components: {
        SearchBox,
        CrmList,
        NavFooter,
        TabOne,
        LoadMore,
        CrmFixedNail,
        CrmReadBar,
        NoRecord,
        AdvancedSearch
    },
    data () {
        return {        
            searchBar: {  // 搜索框配置
                show: true,  //搜索框，默认显示
                keyWord: '',
                moreFunction:{
                    show: true,
                    option: [
                        {
                            name:'名称', 
                            placeholder:'按客户名称搜索'
                        },
                        {
                            name:'类别', 
                            placeholder:'按客户类别搜索',
                            value: 'clientType'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            },
            footerNav: [  // 底部标签配置
                {
                    icon: 'crm-icon_base crm-icon_allClient_blue',
                    nav: '',
                    tab: '所有客户',
                    index: 0
                },
                {
                    icon: 'crm-icon_base crm-icon_toPerson_gray',
                    nav: '',
                    tab: '我负责的',
                    index: 1
                },
                {
                    icon: 'crm-icon_base crm-icon_ccPerson_gray',
                    nav: '',
                    tab: '我相关的',
                    index: 2
                },
                {
                    icon: 'crm-icon_base crm-icon_createPerson_gray',
                    nav: '',
                    tab: '我创建的',
                    index: 3
                }

            ],        
            listData: [],  // 列表配置    
            listParams: {  // 请求客户列表后台参数
                'tbCrmClientSearchVO.clientName': '',
                'tbCrmClientSearchVO.clientCode': '',
                'tbCrmClientSearchVO.clientType': '',
                'tbCrmClientSearchVO.telPhone': '',
                'tbCrmClientSearchVO.industry': '',
                'contact_province_code': PROVINCE_CODE_GD,
                'contact_city_code': CITY_CODE_GZ,
                'fullAddress': '',
                'tbCrmClientSearchVO.province': '',
                'tbCrmClientSearchVO.city': '',
                'tbCrmClientSearchVO.area': '',
                'tbCrmClientSearchVO.country': '',
                'tbCrmClientSearchVO.address': '',
                'tbCrmClientSearchVO.readStatus': 0,
                'tbCrmClientSearchVO.isWin': '',
                'tbCrmClientSearchVO.outsideStartTime': '',
                'tbCrmClientSearchVO.outsideEndTime': '',
                'tbCrmClientSearchVO.startNum': '',
                'tbCrmClientSearchVO.endNum': '',
                'tbCrmClientSearchVO.businessStatus': '',
                'tbCrmClientSearchVO.contractStatus': '',
                'tbCrmClientSearchVO.businessStartNum': '',
                'tbCrmClientSearchVO.businessEndNum': '',
                'tbCrmClientSearchVO.contractStartNum': '',
                'tbCrmClientSearchVO.contractEndNum': '',
                'tbCrmClientSearchVO.toPerson': '',
                'tbCrmClientSearchVO.ccPerson': '',
                'tbCrmClientSearchVO.createPerson': '',
                'tbCrmClientSearchVO.deptName': '',
                'tbCrmClientSearchVO.startTime': '',
                'tbCrmClientSearchVO.endTime': '',
                'tbCrmClientSearchVO.editStartTime': '',
                'tbCrmClientSearchVO.editEndTime': '',
                'tbCrmClientSearchVO.queryType': '',
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
            readMsg: '',  // 未阅客户的数量信息
            showReadBar: false,  // 是否显示未阅bar条
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否显示新建提示
            activeIdx: 0,  // 底部tab当前idx
            setting: [  // 高级搜索配置列表
                {
                    label: '客户名称',
                    key: 'tbCrmClientSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户编码',
                    key: 'tbCrmClientSearchVO.clientCode',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户类别',
                    key: 'tbCrmClientSearchVO.clientType',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '联系电话',
                    key: 'tbCrmClientSearchVO.telPhone',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户行业',
                    key: 'tbCrmClientSearchVO.industry',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户区域',
                    key: 'tbCrmClientSearchVO.area',
                    type: 'address'
                },
                {
                    label: '客户地址',
                    key: 'tbCrmClientSearchVO.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmClientSearchVO.readStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                },
                {
                    label: '拜访时间',
                    key: ['tbCrmClientSearchVO.outsideStartTime', 'tbCrmClientSearchVO.outsideEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '拜访次数',
                    key: ['tbCrmClientSearchVO.startNum', 'tbCrmClientSearchVO.endNum'],
                    type: 'interval'
                },
                {
                    label: '商机阶段',
                    key: 'tbCrmClientSearchVO.businessStatus',
                    type: 'radio',
                    value: [
                                { text: '全部', value: ''},
                                { text: '初步交流', value: '0'}, 
                                { text: '需求沟通', value: '1'}, 
                                { text: '商务沟通', value: '2'}, 
                                { text: '签约交款', value: '3'},
                                { text: '商务失败', value: '4'}
                            ]
                },
                {
                    label: '合同状态',
                    key: 'tbCrmClientSearchVO.contractStatus',
                    type: 'checkbox',
                    show: false,
                    value: []
                },
                {
                    label: '商机单数',
                    key: ['tbCrmClientSearchVO.businessStartNum', 'tbCrmClientSearchVO.businessEndNum'],
                    type: 'interval'
                },
                {
                    label: '合同单数',
                    key: ['tbCrmClientSearchVO.contractStartNum', 'tbCrmClientSearchVO.contractEndNum'],
                    type: 'interval'
                },
                {
                    label: '负责人',
                    key: 'tbCrmClientSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmClientSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmClientSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmClientSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmClientSearchVO.startTime', 'tbCrmClientSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['tbCrmClientSearchVO.editStartTime', 'tbCrmClientSearchVO.editEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                }
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
            searchIndex: 0,  // 搜索标签索引
            isFirst: true  // 是否第一次进入路由
        }
    },
    created () {
        // 初始化
        this.init();
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 如果是首页或者客户类型页进入，强制刷新页面
            if(from.name === 'home' || from.name === 'clientTypeList' || from.name === 'homeTest'){
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
            if(val === 'clientType'){
                this.searchIndex = 1;
                this.$router.push('/clientTypeList'); 
                return;
            }
            this.listParams['tbCrmClientSearchVO.clientName'] = keyWord;
            this.$set(this.cacheSearchValue, 'tbCrmClientSearchVO.clientName', keyWord);
            this.restData();
            this.getListData(true);
        },

        // 请求客户列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getClientList(obj)
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
                                mid: [
                                    {
                                        title: '客户类别：',
                                        value: item.typeNames || '无'
                                    }
                                ],
                                bottom: {
                                    isShowAvator: true,
                                    msg: {
                                        avatorUrl: item.headPic,
                                        avatorName: item.personName
                                    },
                                    data: [
                                        {
                                            title: '更新时间：',
                                            value: item.updateTime.slice(0,-3)
                                        }
                                    ]
                                }
                            };
                            this.listData.push(obj);
                        });
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
                    this.getListData();
                }
            }
        },

        // 跳转客户详情
        goDetail (id) {
            location.href = `${_.baseURL}/jsp/wap/crm/client/client_detail.jsp?id=${id}&isClient=0`;
        },

        // 查看客户未阅信息
        checkReadMsg () {
            this.restData();
            this.resetSearchData();
            this.listParams['tbCrmClientSearchVO.readStatus'] = 2; 
            this.resetFooterTab()
            this.getListData(true);
            this.showReadBar = false;
        },

        // 标记为已阅
        signRead () {
            _.alert("提示","确认将所有未阅标记成已阅",{
                primaryBtn:{
                    name: "i18n.confirm", 
                    callBack: () => {
                        readAll().then(res => {
                            if(res.code == '0'){
                                this.showReadBar = false;
                                _.tooltips_succeed('操作成功');
                            }
                            else{
                                _.alert('提示',res.desc);
                            }
                        });
                    }
                },
                defaultBtn:{
                    name: "i18n.cancel", 
                    callBack: null
                }, 
            });
        },

        // 初始化数据
        init () {
            // 获取未阅客户信息数量
            this.getNotReadNum();

            // 获取商机阶段
            this.getBussinessStage();

            // 获取合同状态
            this.getContractStatus();

            // 请求客户列表数据
            this.getListData();
        },

        // 重置列表数据
        restData () {
            this.page = 1;
            this.listData = [];
        },

        // 重置搜索条件
        resetSearchData () {
            for(let key in this.listParams){
                if(key === 'contact_province_code'){
                    this.listParams[key] = PROVINCE_CODE_GD;
                }
                else if(key === 'contact_city_code'){
                    this.listParams[key] = CITY_CODE_GZ;
                }
                else if(key === 'tbCrmClientSearchVO.readStatus'){
                    this.listParams[key] = 0;
                }
                else{
                    this.listParams[key] = '';
                }                
            }

            // 清除搜索框内容
            this.$refs.searchBox.clearInput();
        },

        // 点击底部tab
        tabOneClick (idx) {
            // tab类型数组
            this.activeIdx = idx;
            this.restData();
            this.resetSearchData();
            this.getNotReadNum();

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
                if(index != 0){
                    this.$set(this.cacheSearchValue, `tbCrmClientSearchVO.${TAB_TYPE[index]}`, '');
                }
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);
            
            // 更加底部tab类型改变搜索条件
            if(idx != '0'){
                this.$set(this.listParams, `tbCrmClientSearchVO.${TAB_TYPE[idx]}`, _.personName);
                this.$set(this.cacheSearchValue, `tbCrmClientSearchVO.${TAB_TYPE[idx]}`, _.personName);
            }
            this.getListData(true);
        },

        // 获取未阅客户信息数量
        getNotReadNum () {
            getNotReadNum().then(res => {
                if(res.code == '0'){
                    let { notReadClientNum } = res.data;

                    // 如果大于0,则显示未阅bar
                    if(notReadClientNum > 0){
                        this.showReadBar = true;
                        this.readMsg = `${notReadClientNum}条未阅客户信息`;
                    }
                    else{
                        this.showReadBar = false;
                    }
                }
                else{
                    _alert('提示', res.desc);
                }
            });
        },

        // 获取商机阶段
        getBussinessStage () {
            getBussinessStage().then(res => {
                if(res.code == '0'){
                    let stageList = res.data.stageList;
                    if(stageList && stageList.length > 0){
                        this.setting[10].value = [{text: '全部', value: ''}];
                        stageList.map((item,idx) => {
                            let obj = {
                                text: item.name,
                                value: item.stageCode.toString()
                            }
                            this.setting[10].value.push(obj);
                        }); 
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 获取合同状态
        getContractStatus () {
            getContractStatus().then(res => {
                if(res.code == '0'){
                    let statusList = res.data.list;
                    if(statusList && statusList.length > 0){
                        statusList.map((item,idx) => {
                            let obj = {
                                text: item.name,
                                value: item.statusCode
                            }
                            this.setting[11].value.push(obj);
                        });
                        this.setting[11].show = true;
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
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
                let outsideStartTime = searchValue['tbCrmClientSearchVO.outsideStartTime'];
                let outsideEndTime = searchValue['tbCrmClientSearchVO.outsideEndTime'];
                let createStartTime = searchValue['tbCrmClientSearchVO.startTime'];
                let createEndTime = searchValue['tbCrmClientSearchVO.endTime'];
                let updateStartTime = searchValue['tbCrmClientSearchVO.startTime'];
                let updateEndTime = searchValue['tbCrmClientSearchVO.startTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(outsideStartTime, outsideEndTime, '拜访开始时间不能大于结束时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(updateStartTime, updateEndTime, '更新开始时间不能大于结束时间')) return;

                // 判断区域是否存在
                if(searchValue['tbCrmClientSearchVO.area']){
                    let address = searchValue['tbCrmClientSearchVO.area'].text.split(' ');
                    this.listParams['fullAddress'] = searchValue['tbCrmClientSearchVO.area'].text;
                    this.listParams['tbCrmClientSearchVO.province'] = address[0];
                    this.listParams['tbCrmClientSearchVO.city'] = address[1]; 
                    this.listParams['tbCrmClientSearchVO.area'] = address[2];  
                    delete searchValue['tbCrmClientSearchVO.area'];
                }

                this.listParams = Object.assign({},this.listParams,searchValue);
            }
            else{
                this.resetFooterTab();
                this.resetSearchData();
            }
            this.restData();
            this.getListData(true);
        },

        // 关闭高级搜索
        searchClose () {
            this.advancedShow = false;
        },

        // 打开高级搜索
        searchOpen () {
            this.advancedShow = true;
        },

        // 重置底部图标
        resetFooterTab () {
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allClient_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`    
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
                    show: true,
                    option: [
                        {
                            name:'名称', 
                            placeholder:'按客户名称搜索'
                        },
                        {
                            name:'类别', 
                            placeholder:'按客户类别搜索',
                            value: 'clientType'
                        }
                    ]
                },
                rightSpan: {
                    show: false,
                    callback: null
                }
            }
            this.footerNav = [
                {
                    icon: 'crm-icon_base crm-icon_allClient_blue',
                    nav: '',
                    tab: '所有客户',
                    index: 0
                },
                {
                    icon: 'crm-icon_base crm-icon_toPerson_gray',
                    nav: '',
                    tab: '我负责的',
                    index: 1
                },
                {
                    icon: 'crm-icon_base crm-icon_ccPerson_gray',
                    nav: '',
                    tab: '我相关的',
                    index: 2
                },
                {
                    icon: 'crm-icon_base crm-icon_createPerson_gray',
                    nav: '',
                    tab: '我创建的',
                    index: 3
                }

            ]         
            this.noRecord = {  
                title: "",
                icon: "qwui-icon_text",
                text: ""
            }   
            this.loadingMore = false; 
            this.maxPage =  0;
            this.totalRows = 0;
            this.hasMore = true;
            this.readMsg = '';
            this.showReadBar = false;
            this.showRecord = false;
            this.isSearch = false;
            this.activeIdx = 0;
            this.setting = [ 
                {
                    label: '客户名称',
                    key: 'tbCrmClientSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户编码',
                    key: 'tbCrmClientSearchVO.clientCode',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户类别',
                    key: 'tbCrmClientSearchVO.clientType',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '联系电话',
                    key: 'tbCrmClientSearchVO.telPhone',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户行业',
                    key: 'tbCrmClientSearchVO.industry',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户区域',
                    key: 'tbCrmClientSearchVO.area',
                    type: 'address'
                },
                {
                    label: '客户地址',
                    key: 'tbCrmClientSearchVO.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmClientSearchVO.readStatus',
                    type: 'radio',
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                },
                {
                    label: '拜访时间',
                    key: ['tbCrmClientSearchVO.outsideStartTime', 'tbCrmClientSearchVO.outsideEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '拜访次数',
                    key: ['tbCrmClientSearchVO.startNum', 'tbCrmClientSearchVO.endNum'],
                    type: 'interval'
                },
                {
                    label: '商机阶段',
                    key: 'tbCrmClientSearchVO.businessStatus',
                    type: 'radio',
                    value: [
                                { text: '全部', value: ''},
                                { text: '初步交流', value: '0'}, 
                                { text: '需求沟通', value: '1'}, 
                                { text: '商务沟通', value: '2'}, 
                                { text: '签约交款', value: '3'},
                                { text: '商务失败', value: '4'}
                            ]
                },
                {
                    label: '合同状态',
                    key: 'tbCrmClientSearchVO.contractStatus',
                    type: 'checkbox',
                    show: false,
                    value: []
                },
                {
                    label: '商机单数',
                    key: ['tbCrmClientSearchVO.businessStartNum', 'tbCrmClientSearchVO.businessEndNum'],
                    type: 'interval'
                },
                {
                    label: '合同单数',
                    key: ['tbCrmClientSearchVO.contractStartNum', 'tbCrmClientSearchVO.contractEndNum'],
                    type: 'interval'
                },
                {
                    label: '负责人',
                    key: 'tbCrmClientSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmClientSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmClientSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmClientSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmClientSearchVO.startTime', 'tbCrmClientSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['tbCrmClientSearchVO.editStartTime', 'tbCrmClientSearchVO.editEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                }
            ];
            this.advancedShow = false;
            this.cacheSearchValue = {};
            this.searchIndex = 0;
        }
    }
}
</script>
<style lang="scss">
@import './ClientList.scss';
</style>


