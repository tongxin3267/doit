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
                <div class="operate_btn" @click="letterToggle">
                    <i class="letter_icon"></i>
                </div>
            </div>
            <ul class="letter_box" v-show="showLetter">
                <li 
                    class="letter_item" 
                    v-for="(item,idx) in letterArry" 
                    :key="idx"
                    @click="letterSearch(item)"
                >{{item}}</li>
            </ul>
        </div>
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
                <div class="member_tips">共 {{totalRows}}个联系人</div>
            </load-more>
            <no-record 
                :stepTop="true" 
                :hasRecord="noRecord" 
                v-show="showRecord"
            >
                <p class="no_data_tip" slot="tip" v-show="!isSearch">
                    还没有联系人，马上<a :href="`${baseURL}/jsp/wap/crm/contact/contact_add.jsp?agentCode=crm`">新建一个</a>
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
        <crm-fixed-nail path="/jsp/wap/crm/contact/contact_add.jsp?agentCode=crm" :isRouter="false"></crm-fixed-nail>
    </div>
</template>
<script>
import SearchBox from '@/components/base/search_box'; 
import NavFooter from '@/components/part/nav_footer';
import TabOne from '@/components/part/tab_one';
import LoadMore from '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import CrmList from '../../../components/CrmList/CrmList';
import CrmFixedNail from '../../../components/CrmFixedNail/CrmFixedNail';
import CrmReadBar from '../../../components/CrmReadBar/CrmReadBar';
import { getContactList, readAll } from '../../../api/contact/getData';

let TAB_TYPE = ['allContact','toPerson','ccPerson','createPerson'];  // 底部tab类型

export default {
    name: 'ContactList',
    components: {
        SearchBox,
        CrmList,
        NavFooter,
        TabOne,
        LoadMore,
        CrmFixedNail,
        CrmReadBar,
        NoRecord
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
                            name:'按联系人', 
                            placeholder:'按联系人搜索',
                            value: 0
                        },
                        {
                            name:'客户名称', 
                            placeholder:'按客户名称搜索',
                            value: 1
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
                    icon: 'crm-icon_base crm-icon_allContact_blue',
                    nav: '',
                    tab: '所有联系人',
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
            listParams: {  // 请求联系人列表后台参数
                targetUser: '',
                queryType: '',
                typeId: '',
                keyWord: '',
                ownerType: '',
                readStatus: ''
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
            readMsg: '',  // 未阅联系人的数量信息
            showReadBar: false,  // 是否显示未阅bar条
            showRecord: false,  // 是否显示没有记录提示
            isSearch: false,  // 是否显示新建提示
            activeIdx: 0,  // 底部tab当前idx
            oldVal: 0,  // 记录上一次旧的typeId
            showLetter: false,  // 是否显示字母表
            letterArry: ['A','B','C','D','E','F','G','H','I','J','K','L',  // 字母表
                        'M','N','O','P','Q','R','S','T','U','V','W','X',
                        'Y','Z','*'],
            isFirst: true,  // 是否第一次进入路由
            searchIndex: 0,  // 搜索标签索引
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
            // 如果val为真，则赋值给typeId
            if(this.oldVal != val){
                this.resetSearchData();
                this.listParams['typeId'] = val;
                this.searchIndex = val;
                this.activeIdx = 0;
            }

            this.listParams['keyWord'] = keyWord;
            this.restData();
            this.getListData(true);
            this.oldVal = val;
        },

        // 请求列表数据(isSearch: 是否为搜索)
        getListData (isSearch) {
            let obj = {
                ...this.listParams,
                page: this.page
            }
            this.loadingMore = true;
            this.isSearch = isSearch;

            getContactList(obj)
            .then(res => {
                if(res.code == '0'){
                    let list = res.data.pageData;
                    let { maxPage, totalRows, notReadCount } = res.data;

                    this.maxPage = maxPage;
                    this.totalRows = totalRows;
                    this.hasMore = this.page >= this.maxPage? false : true;
                    this.loadingMore = false;

                    // 如果大于0,则显示未阅bar
                    if(notReadCount > 0){
                        if(this.listParams['readStatus'] === 0){
                            this.showReadBar = false;
                        }
                        else{
                            this.showReadBar = true;
                            this.readMsg = `${notReadCount}条未阅联系人信息`;
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
                            this.noRecord.title = '没有联系人';
                            this.noRecord.text = '换一个关键字搜索';
                        }
                        this.showRecord = true;
                    }

                    // 有列表数据才渲染
                    if(list && list.length > 0){
                        list.map((item,idx) => {
                            let obj = {
                                id: item.id,
                                top: item.contactsName,
                                mid: [
                                    {
                                        title: '所属客户：',
                                        value: item.clientName
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

        // 加载更多联系人列表
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
            location.href = `${_.baseURL}/jsp/wap/crm/contact/contact_detail.jsp?id=${id}&isContact=0`;
        },

        // 查看未阅信息
        checkReadMsg () {
            this.restData();
            this.resetSearchData();
            this.listParams['readStatus'] = 0;

            // 重置底部图标
            this.activeIdx = 0;
            this.footerNav.map((item,index) => {
                item.icon = index === 0? 'crm-icon_base crm-icon_allContact_blue' : `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`    
            });
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
                if(key != 'typeId'){
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
                item.icon = `crm-icon_base crm-icon_${TAB_TYPE[index]}_gray`
            });
            this.$set(this.footerNav[idx],'icon',`crm-icon_base crm-icon_${TAB_TYPE[idx]}_blue`);
            
            // 更加底部tab类型改变搜索条件
            if(idx != 0){
                if(idx === 3){
                    this.listParams[`ownerType`] = 0;
                }
                else{
                    this.listParams[`ownerType`] = idx;
                }    
            }
            this.getListData(true);
        },

        // 按字母搜索
        letterSearch (letter) {
            this.listParams['keyWord'] = letter === '*'? '' : letter;
            this.restData();
            this.getListData(true);
            this.showLetter = false;
        },

        // 切换字母表
        letterToggle () {
            this.showLetter = !this.showLetter;
        },

        // 重置所有数据
        resetAllData () {
            this.restData();
            this.resetSearchData();
            this.listParams['typeId'] = '';
            this.searchBar = {
                show: true,
                keyWord: '',
                moreFunction:{
                    show: true,
                    option: [
                        {
                            name:'按联系人', 
                            placeholder:'按联系人搜索',
                            value: 0
                        },
                        {
                            name:'客户名称', 
                            placeholder:'按客户名称搜索',
                            value: 1
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
                    icon: 'crm-icon_base crm-icon_allContact_blue',
                    nav: '',
                    tab: '所有联系人',
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
            this.loadingMore =  false;
            this.maxPage = 0;
            this.totalRows = 0;
            this.hasMore = true;
            this.readMsg = '';
            this.showReadBar = false;
            this.showRecord = false;
            this.isSearch = false;
            this.activeIdx = 0;
            this.oldVal = 1;
            this.showLetter = false;
            this.searchIndex = 0;
        }
    }
}
</script>
<style lang="scss">
@import './ContactList.scss';
</style>





