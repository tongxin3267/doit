<template>
    <div class="crm_list_wrap">
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
                @delEvent="delItem"
            >
            </crm-list>
            <load-more 
                :loading="loadingMore" 
                :currPage="page" 
                :maxPage="maxPage"
            >
                <div class="member_tips">共 {{totalRows}}个商机 金额总计 {{totalMoney}}万元</div>
            </load-more>
            <no-record 
                :stepTop="true" 
                :hasRecord="noRecord" 
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">
                    还没有商机，马上<a :href="`${baseURL}/jsp/wap/crm/business/business_add.jsp?agentCode=crm`">新建一个</a>
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
        <crm-fixed-nail path="/jsp/wap/crm/business/business_add.jsp?agentCode=crm" :isRouter="false"></crm-fixed-nail>
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
import { getBusinessList, getBussinessStage, readAll, delBusiness } from '../../../api/business/getData';

const TAB_TYPE = ['allBusiness','toPerson','ccPerson','createPerson'];  // 底部tab类型

export default {
    name: 'BusinessList',
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
            footerNav: [  // 底部标签配置
                {
                    icon: 'crm-icon_base crm-icon_allBusiness_blue',
                    nav: '',
                    tab: '所有商机',
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
            listParams: {  // 请求列表后台参数
                'tbCrmBusinessSearchVO.title': '',
                'tbCrmBusinessSearchVO.clientName': '',
                'tbCrmBusinessSearchVO.businessStatus': '',
                'tbCrmBusinessSearchVO.businessType': '',
                'tbCrmBusinessSearchVO.toPerson': '',
                'tbCrmBusinessSearchVO.ccPerson': '',
                'tbCrmBusinessSearchVO.createPerson': '',
                'tbCrmBusinessSearchVO.deptName': '',
                'tbCrmBusinessSearchVO.startTime': '',
                'tbCrmBusinessSearchVO.endTime': '',
                'tbCrmBusinessSearchVO.updateStartTime': '',
                'tbCrmBusinessSearchVO.updateEndTime': '',
                'tbCrmBusinessSearchVO.startEstimateTime': '',
                'tbCrmBusinessSearchVO.endEstimateTime': '',
                'tbCrmBusinessSearchVO.status': 0,
                'tbCrmBusinessSearchVO.readStatus': 0,
                'tbCrmBusinessSearchVO.last': '',
                'tbCrmBusinessSearchVO.change': '',
                'searchType': 1
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
            readMsg: '',  // 未阅信息的数量
            showReadBar: false,  // 是否显示未阅bar条
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否显示新建提示
            activeIdx: 0,  // 底部tab当前idx
            setting: [  // 高级搜索配置列表
                {
                    label: '标题',
                    key: 'tbCrmBusinessSearchVO.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户名称',
                    key: 'tbCrmBusinessSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                }, 
                {
                    label: '商机阶段',
                    key: 'tbCrmBusinessSearchVO.businessStatus',
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
                    label: '商机类别',
                    key: 'tbCrmBusinessSearchVO.businessType',
                    type: 'checkbox',
                    show: false,
                    value: []
                },
                {
                    label: '负责人',
                    key: 'tbCrmBusinessSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmBusinessSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmBusinessSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmBusinessSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmBusinessSearchVO.startTime', 'tbCrmBusinessSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['tbCrmBusinessSearchVO.updateStartTime', 'tbCrmBusinessSearchVO.updateEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '结单时间',
                    key: ['tbCrmBusinessSearchVO.startEstimateTime', 'tbCrmBusinessSearchVO.endEstimateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '提交状态',
                    key: 'tbCrmBusinessSearchVO.status',
                    type: 'radio',
                    value: [{ text: '已提交', value: '0', relativeLabel: [13]}, { text: '草稿', value: '1'}]
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmBusinessSearchVO.readStatus',
                    type: 'radio',
                    show: true,
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                }
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
            totalMoney: 0,  // 商机总金额
            isFirst: true,  // 是否第一次进入路由
            baseURL: _.baseURL
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
            this.listParams['tbCrmBusinessSearchVO.title'] = keyWord;
            this.$set(this.cacheSearchValue, 'tbCrmBusinessSearchVO.title', keyWord);
            this.restData();
            this.getListData(true);
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getBusinessList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows, businessNum, allCount } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;
                    this.totalMoney = Math.round(allCount/10000 * 100)/100;

                    // 如果大于0,则显示未阅bar
                    if(businessNum > 0){
                        if(this.listParams['tbCrmBusinessSearchVO.readStatus'] === 2){
                            this.showReadBar = false;
                        }
                        else{
                            this.showReadBar = true;
                            this.readMsg = `${businessNum}条未阅商机信息`;
                        }   
                    }
                    else{
                        this.showReadBar = false;
                    }

                    // 如果总条数为0，则显示无记录
                    if(this.totalRows > 0){
                        this.showRecord = false;
                    }
                    else{
                        // 如果是搜索，则改变没有数据的提示图标和语句
                        if(isSearch){
                            this.noRecord.icon = 'qwui-icon_search';
                            this.noRecord.title = '没有商机';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){      
                        list.map((item,idx) => {
                            let obj = {
                                id: item.id,
                                top: item.title,
                                showDel: item.status == 1? true : false,
                                mid: [
                                    {
                                        title: '所属客户：',
                                        value: item.clientName
                                    },
                                    {
                                        title: '商机阶段：',
                                        value: item.stageName? `${item.stageName} (${item.winRate}%)` : ''
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
                                            title: '创建时间：',
                                            value: item.updateTime.slice(0,-3)
                                        }
                                    ]
                                },
                                callBackVal: {status: item.status}
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
        goDetail (id, callBackVal) {
            let { status } = callBackVal;
            if(status == '1'){
                location.href = `${_.baseURL}/jsp/wap/crm/business/business_edit.jsp?id=${id}`;
            }
            else{
                location.href =  _.baseURL+'/jsp/wap/crm/business/business_detail.jsp?id='+id+'&isBusiness=0&searchType=1&title='+this.listParams['tbCrmBusinessSearchVO.title']+
                                 '&clientName='+this.listParams['tbCrmBusinessSearchVO.clientName']+'&stage='+this.listParams['tbCrmBusinessSearchVO.businessStatus']+
                                 '&person='+encodeURI(encodeURI(this.listParams['tbCrmBusinessSearchVO.createPerson']))+'&dept='+this.listParams['tbCrmBusinessSearchVO.deptName']+
                                 '&startTime='+this.listParams['tbCrmBusinessSearchVO.startTime']+'&endTime='+this.listParams['tbCrmBusinessSearchVO.endTime']+
                                 '&search='+this.listParams['tbCrmBusinessSearchVO.status']+'&read='+this.listParams['tbCrmBusinessSearchVO.readStatus']+
                                 '&last='+this.listParams['tbCrmBusinessSearchVO.last']+'&change='+this.listParams['tbCrmBusinessSearchVO.change']+
                                 '&toPerson='+encodeURI(encodeURI(this.listParams['tbCrmBusinessSearchVO.toPerson']))+'&ccPerson='+encodeURI(encodeURI(this.listParams['tbCrmBusinessSearchVO.ccPerson']))+
                                 '&updateStartTime='+this.listParams['tbCrmBusinessSearchVO.updateStartTime']+'&updateEndTime='+this.listParams['tbCrmBusinessSearchVO.updateEndTime'];
            }   
        },

        // 查看未阅信息
        checkReadMsg () {
            this.restData();
            this.resetSearchData();
            this.listParams['tbCrmBusinessSearchVO.readStatus'] = 2;
            this.resetFooterTab();
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
            // 获取商机阶段
            this.getBussinessStage();

            // 请求列表数据
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
                if(key === 'tbCrmBusinessSearchVO.status'){
                    this.listParams[key] = 0;
                }
                else if(key === 'tbCrmBusinessSearchVO.readStatus'){
                    this.listParams[key] = 0;
                }
                else if(key === 'searchType'){
                    this.listParams[key] = 1;
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
            this.activeIdx = idx;
            this.restData();
            this.resetSearchData();

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
                if(index != '0'){
                    this.$set(this.cacheSearchValue, `tbCrmBusinessSearchVO.${TAB_TYPE[index]}`, '');
                }
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);
            
            // 更加底部tab类型改变搜索条件
            if(idx != '0'){
                this.listParams[`tbCrmBusinessSearchVO.${TAB_TYPE[idx]}`] = _.personName;
                this.$set(this.cacheSearchValue, `tbCrmBusinessSearchVO.${TAB_TYPE[idx]}`, _.personName);
            }
            this.getListData(true);
        },

        // 比较时间大小
        compareDate (startVal, endVal, tips) {
            let startTime = startVal || '';
            let endTime = endVal || '';

            // 开始时间不能大于结束时间
            if(Date.parse(startTime) > Date.parse(endTime)){
                _.alert('提示',tips);
                this.advancedShow = show;
                return false;
            }
            return true;
        },

        // 高级搜索
        search (searchValue) {
            let keyList = Object.keys(searchValue);

            // 没有返回数据，则重置数据
            if(keyList.length > 0){
                let updateStartTime = searchValue['tbCrmBusinessSearchVO.updateStartTime'];
                let updateEndTime = searchValue['tbCrmBusinessSearchVO.updateEndTime'];
                let createStartTime = searchValue['tbCrmBusinessSearchVO.startTime'];
                let createEndTime = searchValue['tbCrmBusinessSearchVO.endTime'];
                let estimateStartTime = searchValue['tbCrmBusinessSearchVO.startEstimateTime'];
                let estimateEndTime = searchValue['tbCrmBusinessSearchVO.endEstimateTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(updateStartTime, updateEndTime, '结束时间不能早于开始时间')) return;
                if(!this.compareDate(estimateStartTime, estimateEndTime, '结束时间不能早于开始时间')) return;
                

                this.listParams = Object.assign({},this.listParams,searchValue);

                // 如果是草稿状态，则重置未阅状态
                if(this.listParams['tbCrmBusinessSearchVO.status'] == 1){
                    this.listParams['tbCrmBusinessSearchVO.readStatus'] = 0;
                }
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

        // 删除列表项
        delItem (id) {
            _.alert("提示","确定删除商机？",{
                primaryBtn:{
                    name: "i18n.confirm", 
                    callBack: () => {
                        let obj = {
                            ids: id
                        }
                        
                        delBusiness(obj).then(res => {
                            if(res.code == '0'){
                                this.restData();
                                this.getListData(true);
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

        // 获取商机阶段和商机类型
        getBussinessStage () {
            getBussinessStage().then(res => {
                if(res.code == '0'){
                    let stageList = res.data.stageList;
                    let typeList = res.data.typeList;

                    // 渲染商机阶段
                    if(stageList && stageList.length > 0){
                        this.setting[2].value = [{text: '全部', value: ''}];
                        stageList.map((item,idx) => {
                            let obj = {
                                text: item.name,
                                value: item.stageCode.toString()
                            }
                            this.setting[2].value.push(obj);
                        }); 
                    }

                    // 渲染商机类别
                    if(typeList && typeList.length > 0){
                        typeList.map((item,idx) => {
                            let obj = {
                                text: item.name,
                                value: item.stageCode
                            }
                            this.setting[3].value.push(obj);
                        }); 
                        this.setting[3].show = true;
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 重置底部图标
        resetFooterTab () {
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allBusiness_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`    
            });
        },

        // 重置所有数据
        resetAllData () {
            this.restData();
            this.resetSearchData();
            this.searchBar = {  // 搜索框配置
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
            this.footerNav = [  // 底部标签配置
                {
                    icon: 'crm-icon_base crm-icon_allBusiness_blue',
                    nav: '',
                    tab: '所有商机',
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
            this.noRecord = {  // 无记录配置
                title: "",
                icon: "qwui-icon_text",
                text: ""
            },    
            this.loadingMore = false;  // 是否正在加载 
            this.maxPage = 0;
            this.totalRows = 0;
            this.hasMore = true;
            this.readMsg = '';
            this.showReadBar = false;
            this.showRecord = false;
            this.isSearch = false;
            this.activeIdx = 0;
            this.setting = [ 
                {
                    label: '标题',
                    key: 'tbCrmBusinessSearchVO.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户名称',
                    key: 'tbCrmBusinessSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                }, 
                {
                    label: '商机阶段',
                    key: 'tbCrmBusinessSearchVO.businessStatus',
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
                    label: '商机类别',
                    key: 'tbCrmBusinessSearchVO.businessType',
                    type: 'checkbox',
                    show: false,
                    value: []
                },
                {
                    label: '负责人',
                    key: 'tbCrmBusinessSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmBusinessSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmBusinessSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmBusinessSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmBusinessSearchVO.startTime', 'tbCrmBusinessSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '更新时间',
                    key: ['tbCrmBusinessSearchVO.updateStartTime', 'tbCrmBusinessSearchVO.updateEndTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '结单时间',
                    key: ['tbCrmBusinessSearchVO.startEstimateTime', 'tbCrmBusinessSearchVO.endEstimateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '提交状态',
                    key: 'tbCrmBusinessSearchVO.status',
                    type: 'radio',
                    value: [{ text: '已提交', value: '0', relativeLabel: [13]}, { text: '草稿', value: '1'}]
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmBusinessSearchVO.readStatus',
                    type: 'radio',
                    show: true,
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                }
            ],
            this.advancedShow = false;
            this.cacheSearchValue = {}
            this.totalMoney = 0;
        }
    }
}
</script>
<style lang="scss">
@import './BusinessList.scss';
</style>


