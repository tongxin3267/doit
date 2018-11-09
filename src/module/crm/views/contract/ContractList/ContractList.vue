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
                :isEllipsis="true"
                :rightDel="true"
            >
            </crm-list>
            <load-more 
                :loading="loadingMore" 
                :currPage="page" 
                :maxPage="maxPage"
            >
                <div class="member_tips">共 {{totalRows}}个合同 金额总计 {{totalMoney}}万元</div>
            </load-more>
            <no-record 
                :stepTop="true" 
                :hasRecord="noRecord" 
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">
                    还没有合同，马上<a :href="`${baseURL}/jsp/wap/crm/contract/contract_add.jsp`">新建一个</a>
                </p>
            </no-record>
        </div>
        <crm-fixed-nail path="/jsp/wap/crm/contract/contract_add.jsp" :isRouter="false"></crm-fixed-nail>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box'; 
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import AdvancedSearch from '@/components/base/AdvancedSearch/index';
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getContractList, readAll, delContract, getContractStatus, getContractType } from '../../../api/contract/getData';

export default {
    name: 'ContractList',
    components: {
        SearchBox,
        CrmList,
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
            listData: [],  // 列表配置    
            listParams: {  // 请求列表后台参数
                'tbCrmContractSearchVO.readStatus': '',
                'tbCrmContractSearchVO.submitStatus': 1,
                'tbCrmContractSearchVO.contractStatus': '',
                'tbCrmContractSearchVO.contractOwner': '',
                'tbCrmContractSearchVO.contractType': '',
                'tbCrmContractSearchVO.startSearchTime': '',
                'tbCrmContractSearchVO.endSearchTime': '',
                'tbCrmContractSearchVO.startQueryTime': '',
                'tbCrmContractSearchVO.endQueryTime': '',
                'tbCrmContractSearchVO.startContractAmount': '',
                'tbCrmContractSearchVO.endContractAmount': '',
                'tbCrmContractSearchVO.startPaymentAmount': '',
                'tbCrmContractSearchVO.endPaymentAmount': '',
                'tbCrmContractSearchVO.startNonPaymentAmount': '',
                'tbCrmContractSearchVO.endNonPaymentAmount': '',
                'tbCrmContractSearchVO.startDeelTime': '',
                'tbCrmContractSearchVO.endDeelTime': '',
                'tbCrmContractSearchVO.startCreateTime': '',
                'tbCrmContractSearchVO.endCreateTime': '',
                'tbCrmContractSearchVO.contractName': '',
                'tbCrmContractSearchVO.clientName': '',
                'tbCrmContractSearchVO.chargePerson': '',
                'tbCrmContractSearchVO.relater': '',
                'tbCrmContractSearchVO.createPerson': '',
                'tbCrmContractSearchVO.keyWord': ''
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
                    label: '发布状态',
                    key: 'tbCrmContractSearchVO.submitStatus',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1', relativeLabel: [3]}, { text: '草稿', value: '0'}]
                },
                {
                    label: '合同状态',
                    key: 'tbCrmContractSearchVO.contractStatus',
                    type: 'checkbox',
                    value: []
                },
                {
                    label: '合同归属',
                    key: 'tbCrmContractSearchVO.contractOwner',
                    type: 'radio',
                    show: true,
                    value: [
                                { text: '全部', value: ''},
                                { text: '我负责的', value: '0'},
                                { text: '我创建的', value: '1'},
                                { text: '我相关的', value: '2'},
                                { text: '待处理的', value: '3'},
                                { text: '已处理的', value: '4'},
                            ]
                }, 
                {
                    label: '合同类型',
                    key: 'tbCrmContractSearchVO.contractType',
                    type: 'checkbox',
                    value: []
                },
                {
                    label: '开始时间',
                    key: ['tbCrmContractSearchVO.startSearchTime', 'tbCrmContractSearchVO.endSearchTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '结束时间',
                    key: ['tbCrmContractSearchVO.startQueryTime', 'tbCrmContractSearchVO.endQueryTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '合同金额(元)',
                    key: ['tbCrmContractSearchVO.startContractAmount', 'tbCrmContractSearchVO.endContractAmount'],
                    type: 'interval'
                },
                {
                    label: '回款金额(元)',
                    key: ['tbCrmContractSearchVO.startPaymentAmount', 'tbCrmContractSearchVO.endPaymentAmount'],
                    type: 'interval'
                },
                {
                    label: '未回款金额(元)',
                    key: ['tbCrmContractSearchVO.startNonPaymentAmount', 'tbCrmContractSearchVO.endNonPaymentAmount'],
                    type: 'interval'
                },
                {
                    label: '签约时间',
                    key: ['tbCrmContractSearchVO.startDeelTime', 'tbCrmContractSearchVO.endDeelTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmContractSearchVO.startCreateTime', 'tbCrmContractSearchVO.endCreateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '合同标题',
                    key: 'tbCrmContractSearchVO.contractName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户名称',
                    key: 'tbCrmContractSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '负责人',
                    key: 'tbCrmContractSearchVO.chargePerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmContractSearchVO.relater',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmContractSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
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
            this.listParams['tbCrmContractSearchVO.keyWord'] = keyWord;
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

            getContractList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows, contractNum, allCount } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;
                    this.totalMoney = Math.round(allCount/10000 * 100)/100;

                    // 如果大于0,则显示未阅bar
                    if(contractNum > 0){
                        if(this.listParams['tbCrmContractSearchVO.readStatus'] === 0){
                            this.showReadBar = false;
                        }
                        else{
                            this.showReadBar = true;
                            this.readMsg = `${contractNum}条未阅合同信息`;
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
                            this.noRecord.title = '没有合同';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){      
                        list.map((item,idx) => {
                            // 设置状态标签的文字和样式
                            let approveClass = '', approveStatus = '';
                            approveStatus = item.approveStatus == '已退审'? '退审' : item.approveStatus;
                            if(item.approveStatus == '审批中'){
                                approveClass = 'status_blue';
                            }
                            else if(item.approveStatus == '已审批'){
                                approveClass = 'status_green';
                            }
                            else{
                                approveClass = item.approveClass;
                            }

                            let obj = {
                                id: item.id,
                                top: item.title,
                                showDel: item.submitStatus == 0? true : false,
                                showTab: item.isFree == 4? false : true,  // 如果isFress等于4，则不显示状态标签
                                tabClass: approveClass,
                                tabName: approveStatus,
                                mid: [
                                    {
                                        title: '',
                                        value: `${item.startTime} 至 ${item.endTime}`,
                                        valueColor: '#999'
                                    },
                                    {
                                        title: '合同金额(元) ',
                                        value: ` ${_.formatMoney(item.contractAmount,2)}`,
                                        titleColor: '#999',
                                        valueColor: '#F56262'
                                    },
                                    {
                                        title: '回款金额(元) ',
                                        value: `${_.formatMoney(item.paymentAmount,2)}`,
                                        titleColor: '#999',
                                        valueColor: '#F56262'
                                    }
                                ],
                                bottom: {
                                    isShowAvator: false,
                                    msg: { },
                                    data: [
                                        {
                                            title: '',
                                            value: item.clientName || '未填写',
                                            fontSize: '14px',
                                            valueColor: '#666'
                                        }
                                    ]
                                },
                                callBackVal: {status: item.submitStatus}
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
            location.href = status == 0? `${_.baseURL}/jsp/wap/crm/contract/contract_edit.jsp?id=${id}` : `${_.baseURL}/jsp/wap/crm/contract/contract_detail.jsp?id=${id}`
        },

        // 查看未阅信息
        checkReadMsg () {
            this.restData();
            this.resetSearchData();
            this.listParams['tbCrmContractSearchVO.readStatus'] = 0;
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
            // 获取合同状态
            this.getContractStatus();

            // 获取合同类型
            this.getContractType();

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
                if(key === 'tbCrmContractSearchVO.submitStatus'){
                    this.listParams[key] = 1;
                }
                else{
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
                let startSearchTime = searchValue['tbCrmContractSearchVO.startSearchTime'];
                let endSearchTime = searchValue['tbCrmContractSearchVO.endSearchTime']; 
                let startQueryTime = searchValue['tbCrmContractSearchVO.startQueryTime'];
                let endQueryTime = searchValue['tbCrmContractSearchVO.endQueryTime'];
                let createStartTime = searchValue['tbCrmContractSearchVO.startCreateTime'];
                let createEndTime = searchValue['tbCrmContractSearchVO.endCreateTime'];
                let startDeelTime = searchValue['tbCrmContractSearchVO.startDeelTime'];
                let endDeelTime = searchValue['tbCrmContractSearchVO.endDeelTime'];

                // 判断开始时间是否大于结束时间
                if(!this.compareDate(startSearchTime, endSearchTime, '结束时间不能早于开始时间')) return;
                if(!this.compareDate(startQueryTime, endQueryTime, '结束时间不能早于开始时间')) return;
                if(!this.compareDate(createStartTime, createEndTime, '创建开始时间不能大于结束时间')) return;
                if(!this.compareDate(startDeelTime, endDeelTime, '结束时间不能早于开始时间')) return;
                

                this.listParams = Object.assign({},this.listParams,searchValue);

                // 如果是草稿状态，则重置合同归属
                if(this.listParams['tbCrmContractSearchVO.submitStatus'] == 0){
                    this.listParams['tbCrmContractSearchVO.contractOwner'] = '';
                }
            }
            else{
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
            _.alert("提示","删除合同数据将无法恢复，请确定是否要删除？",{
                primaryBtn:{
                    name: "i18n.confirm", 
                    callBack: () => {
                        let obj = {
                            id:id
                        }

                        delContract(obj).then(res => {
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

        // 获取合同状态
        getContractStatus () {
            getContractStatus().then(res => {
                if(res.code == '0'){
                    let list = res.data.list;
                    if(list && list.length > 0){
                        this.setting[1].value = [];
                        list.map((item,idx) => {
                            let obj = {
                                text: item.name,
                                value: item.statusCode
                            }
                            this.setting[1].value.push(obj);
                        }); 
                    }
                    else{
                        this.setting[1].show = false;
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            });
        },

        // 获取合同类型
        getContractType () {
            getContractType().then(res => {
                if(res.code == '0'){
                    let list = res.data.typeList;
                    if(list && list.length > 0){
                        this.setting[3].value = [];
                        list.map((item,idx) => {
                            let obj = {
                                text: item.typeName,
                                value: item.id
                            }
                            this.setting[3].value.push(obj);
                        }); 
                    }
                    else{
                        this.setting[3].show = false;
                    }
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
                    label: '发布状态',
                    key: 'tbCrmContractSearchVO.submitStatus',
                    type: 'radio',
                    value: [{ text: '已提交', value: '1', relativeLabel: [3]}, { text: '草稿', value: '0'}]
                },
                {
                    label: '合同状态',
                    key: 'tbCrmContractSearchVO.contractStatus',
                    type: 'checkbox',
                    value: []
                },
                {
                    label: '合同归属',
                    key: 'tbCrmContractSearchVO.contractOwner',
                    type: 'radio',
                    show: true,
                    value: [
                                { text: '全部', value: ''},
                                { text: '我负责的', value: '0'},
                                { text: '我创建的', value: '1'},
                                { text: '我相关的', value: '2'},
                                { text: '待处理的', value: '3'},
                                { text: '已处理的', value: '4'},
                            ]
                }, 
                {
                    label: '合同类型',
                    key: 'tbCrmContractSearchVO.contractType',
                    type: 'checkbox',
                    value: []
                },
                {
                    label: '开始时间',
                    key: ['tbCrmContractSearchVO.startSearchTime', 'tbCrmContractSearchVO.endSearchTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '结束时间',
                    key: ['tbCrmContractSearchVO.startQueryTime', 'tbCrmContractSearchVO.endQueryTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '合同金额(元)',
                    key: ['tbCrmContractSearchVO.startContractAmount', 'tbCrmContractSearchVO.endContractAmount'],
                    type: 'interval'
                },
                {
                    label: '回款金额(元)',
                    key: ['tbCrmContractSearchVO.startPaymentAmount', 'tbCrmContractSearchVO.endPaymentAmount'],
                    type: 'interval'
                },
                {
                    label: '未回款金额(元)',
                    key: ['tbCrmContractSearchVO.startNonPaymentAmount', 'tbCrmContractSearchVO.endNonPaymentAmount'],
                    type: 'interval'
                },
                {
                    label: '签约时间',
                    key: ['tbCrmContractSearchVO.startDeelTime', 'tbCrmContractSearchVO.endDeelTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '创建时间',
                    key: ['tbCrmContractSearchVO.startCreateTime', 'tbCrmContractSearchVO.endCreateTime'],
                    type: 'date',
                    format: 'YYYY-MM-DD'
                },
                {
                    label: '合同标题',
                    key: 'tbCrmContractSearchVO.contractName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '客户名称',
                    key: 'tbCrmContractSearchVO.clientName',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '负责人',
                    key: 'tbCrmContractSearchVO.chargePerson',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '相关人',
                    key: 'tbCrmContractSearchVO.relater',
                    type: 'text',
                    placeholder: '请输入'
                },
                {
                    label: '创建人',
                    key: 'tbCrmContractSearchVO.createPerson',
                    type: 'text',
                    placeholder: '请输入'
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
@import './ContractList.scss'
</style>


