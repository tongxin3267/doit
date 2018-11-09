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
                <div class="member_tips">共 {{totalRows}}个拜访</div>
            </load-more>
            <no-record
                :stepTop="true"
                :hasRecord="noRecord"
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">
                    还没有拜访，马上<a :href="`${baseURL}/jsp/wap/crm/outsideworkinfo/outsideworkinfo_add.jsp?appId=1&agentCode=crm`">新建一个</a>
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
        <crm-fixed-nail path="/jsp/wap/crm/outsideworkinfo/outsideworkinfo_add.jsp?appId=1&agentCode=crm" :isRouter="false"></crm-fixed-nail>
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
import { getVisitList, getNotReadNum, readAll, delVisit } from '../../../api/visit/getData';

const TAB_TYPE = ['allVisit','toPerson','ccPerson','createPerson'];  // 底部tab类型

export default {
    name: 'VisitList',
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
                    icon: 'crm-icon_base crm-icon_allVisit_blue',
                    nav: '',
                    tab: '所有拜访',
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
            listParams: {  // 请求拜访列表后台参数
                'tbCrmOutsideSearchVO.clientName': '',
                'tbCrmOutsideSearchVO.title': '',
                'tbCrmOutsideSearchVO.content': '',
                'tbCrmOutsideSearchVO.toPerson': '',
                'tbCrmOutsideSearchVO.ccPerson': '',
                'tbCrmOutsideSearchVO.deptName': '',
                'tbCrmOutsideSearchVO.address': '',
                'tbCrmOutsideSearchVO.createPerson': '',
                'tbCrmOutsideSearchVO.startDate': '',
                'tbCrmOutsideSearchVO.endDate': '',
                'tbCrmOutsideSearchVO.startTime': '',
                'tbCrmOutsideSearchVO.endTime': '',
                'tbCrmOutsideSearchVO.status': 1,
                'tbCrmOutsideSearchVO.readStatus': 0,
                'tbCrmOutsideSearchVO.outworkId': '',
                'tbCrmOutsideSearchVO.last': '',
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
                    label: '客户名称',
                    key: 'tbCrmOutsideSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '标题',
                    key: 'tbCrmOutsideSearchVO.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '内容',
                    key: 'tbCrmOutsideSearchVO.content',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '负责人',
                    key: 'tbCrmOutsideSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmOutsideSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmOutsideSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '地址',
                    key: 'tbCrmOutsideSearchVO.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmOutsideSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '拜访时间',
                    key: ['tbCrmOutsideSearchVO.startDate', 'tbCrmOutsideSearchVO.endDate'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmOutsideSearchVO.startTime', 'tbCrmOutsideSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '提交状态',
                    key: 'tbCrmOutsideSearchVO.status',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1', relativeLabel: [12]}, { text: '草稿', value: '0'}]
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmOutsideSearchVO.readStatus',
                    type: 'radio',
                    show: true,
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                }
            ],
            advancedShow: false,  // 是否显示高级搜索
            cacheSearchValue: {},  // 高级搜索缓存
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
            this.listParams['tbCrmOutsideSearchVO.title'] = keyWord;
            this.$set(this.cacheSearchValue, 'tbCrmOutsideSearchVO.title', keyWord);
            this.restData();
            this.getListData(true);
        },

        // 请求拜访列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page,
                status: this.listParams['tbCrmOutsideSearchVO.status']
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getVisitList(obj)
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
                            this.noRecord.title = '没有拜访记录';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){

                        list.map((item,idx) => {
                            let obj = {
                                id: item.id,
                                top: item.outworkTitle,
                                showDel: item.status == 0? true : false,
                                mid: [
                                    {
                                        title: '拜访客户：',
                                        value: item.clientName || '未填写'
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
                                            value: item.outworkTime.slice(0,-3)
                                        }
                                    ]
                                },
                                callBackVal: {status: item.status, clientId: item.clientId}
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

        // 加载更多拜访列表
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

        // 跳转拜访详情
        goDetail (id, callBackVal) {
            let { status, clientId } = callBackVal;
            if(status != 0){
                location.href = clientId? `${_.baseURL}/jsp/wap/crm/outsideworkinfo/outsideworkinfo_detail.jsp?id=${id}` : `${_.baseURL}/jsp/wap/outsideworkinfo/outsideworkinfo_detail.jsp?id=${id}`;
            }
            else{
                location.href = `${_.baseURL}/jsp/wap/crm/outsideworkinfo/outsideworkinfo_edit.jsp?id=${id}&status=${status}&source=list&appId=1`;
            }
        },

        // 查看拜访未阅信息
        checkReadMsg () {
            this.restData();
            this.resetSearchData();
            this.listParams['tbCrmOutsideSearchVO.readStatus'] = 2;
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
            // 获取未阅信息数量
            this.getNotReadNum();

            // 请求拜访列表数据
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
                if(key === 'tbCrmOutsideSearchVO.status'){
                    this.listParams[key] = 1;
                }
                else if(key === 'tbCrmOutsideSearchVO.readStatus'){
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
            this.getNotReadNum();

            // 变换tab图标
            this.footerNav.map((item,index) => {
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`;
                if(index != '0'){
                    this.$set(this.cacheSearchValue, `tbCrmOutsideSearchVO.${TAB_TYPE[index]}`, '');
                }
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);

            // 更加底部tab类型改变搜索条件
            if(idx != '0'){
                this.listParams[`tbCrmOutsideSearchVO.${TAB_TYPE[idx]}`] = _.personName;
                this.$set(this.cacheSearchValue, `tbCrmOutsideSearchVO.${TAB_TYPE[idx]}`, _.personName);
            }
            this.getListData(true);
        },

        // 获取未阅信息数量
        getNotReadNum () {
            getNotReadNum().then(res => {
                if(res.code == '0'){
                    let { notvisitNum } = res.data;

                    // 如果大于0,则显示未阅bar
                    if(notvisitNum > 0){
                        this.showReadBar = true;
                        this.readMsg = `${notvisitNum}条未阅拜访信息`;
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
                let outsideStartTime = searchValue['tbCrmOutsideSearchVO.startDate'];
                let outsideEndTime = searchValue['tbCrmOutsideSearchVO.endDate'];
                let createStartTime = searchValue['tbCrmOutsideSearchVO.startTime'];
                let createEndTime = searchValue['tbCrmOutsideSearchVO.endTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(outsideStartTime, outsideEndTime, '拜访开始时间不能大于结束时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;

                this.listParams = Object.assign({},this.listParams,searchValue);

                // 如果是草稿状态，则重置未阅状态
                if(this.listParams['tbCrmOutsideSearchVO.status'] == 0){
                    this.listParams['tbCrmOutsideSearchVO.readStatus'] = 0;
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
            _.alert("提示","确定删除拜访单？",{
                primaryBtn:{
                    name: "i18n.confirm",
                    callBack: () => {
                        let obj = {
                            ids: id
                        }

                        delVisit(obj).then(res => {
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

        // 重置底部图标
        resetFooterTab () {
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allVisit_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`
            });
        },

        // 重置所有数据
        resetAllData () {
            this.restData();
            this.resetSearchData();
            this.searchBar = {
                show: true,
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
            this.footerNav = [
                {
                    icon: 'crm-icon_base crm-icon_allVisit_blue',
                    nav: '',
                    tab: '所有拜访',
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
            this.noRecord = {
                title: "",
                icon: "qwui-icon_text",
                text: ""
            }
            this.loadingMore = false;
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
                    label: '客户名称',
                    key: 'tbCrmOutsideSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '标题',
                    key: 'tbCrmOutsideSearchVO.title',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '内容',
                    key: 'tbCrmOutsideSearchVO.content',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '负责人',
                    key: 'tbCrmOutsideSearchVO.toPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmOutsideSearchVO.ccPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '部门',
                    key: 'tbCrmOutsideSearchVO.deptName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '地址',
                    key: 'tbCrmOutsideSearchVO.address',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmOutsideSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '拜访时间',
                    key: ['tbCrmOutsideSearchVO.startDate', 'tbCrmOutsideSearchVO.endDate'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmOutsideSearchVO.startTime', 'tbCrmOutsideSearchVO.endTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '提交状态',
                    key: 'tbCrmOutsideSearchVO.status',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1', relativeLabel: [12]}, { text: '草稿', value: '0'}]
                },
                {
                    label: '阅读状态',
                    key: 'tbCrmOutsideSearchVO.readStatus',
                    type: 'radio',
                    show: true,
                    value: [{ text: '全部', value: '0'}, { text: '已阅', value: '1'}, { text: '未阅', value: '2'}]
                }
            ],
            this.advancedShow = false;
            this.cacheSearchValue = {}
        }
    }
}
</script>
<style lang="scss">
@import './VisitList.scss';
</style>


