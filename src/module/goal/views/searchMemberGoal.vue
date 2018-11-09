<template>
    <div class="wrap">
        <search-box :searchinput="searchBar" @listenToSearchBox="showMsgFromSearchBox"></search-box>
        <div class="member_list_wrap" v-scroll="loadMore">
            <ul class="member_list">
                <li is="memberItem" v-for="(item,idx) in memberList" :key="idx" :item="item"></li>
            </ul>
            <no-record :hasrecord="noRecord"></no-record>
            <load-more :loading="loadingMore" :currentRows="page" :maxPage="maxPage">
                <div class="member_tips">共 {{totalRows}}个成员</div>
            </load-more>
        </div>
    </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import loadMore from '@/components/list/load_more';
import noRecord from '@/components/base/no_record';
import memberItem from './parts/memberItem';
import { getMemberList } from '../api/getData';
import avator from '@/assets/images/touxiang02.png';
export default {
    data(){
        return {
            searchBar:{
                show:true,  //搜索框，默认显示
                keyWord:'',
                moreFunction:{
                    show:false,
                    option:[
                        {name:'标题', callback:null, placeholder:'搜索标题'}
                    ]
                }
            },
            personName: '',  // 搜索内容
            memberList: [],   // 成员已完成列表数据
            totalRows: 0,  // 已完成总成员数
            page: 1,  // 已完成当前页数
            loadingMore: false,  // 是否正在加载
            maxPage: 0,  // 已完成最大页数
            hasMore: true,  // 已完成是否还有数据
            noRecord:{  // 无记录配置
                show:false,
                title:"没有搜索到结果",
                icon:"qwui-icon_search",
                text:"",
                operation:{
                    text:"",
                    callBack:null
                }
            }
        }
    },
    components: {
        searchBox,
        loadMore,
        memberItem,
        noRecord
    },
    methods: {
        // 初始化
        init(){
            let { countType, goalId, stage } = this.$route.query;
            this.countType = countType;
            this.goalId = goalId;
            this.stage = stage;
        },

        //搜索关键字
        showMsgFromSearchBox(keyWord, val){
            this.personName = keyWord;
            this.resetData();
            this.getMemberList();
        },

        // 获取成员列表
        getMemberList(){
            let obj = {
                goalId: this.goalId,
                stage: this.stage,
                countType: this.countType,
                personName: this.personName,
                page: this.page,
                pageSize: 20
            }
            this.loadingMore = true;
            getMemberList(obj, res => {
                let list = res.page.pageData;
                let arr = [];
                this.loadingMore = false;
                list.map((item,idx) => {
                    let dataObj = {
                        userId: item.userId,
                        headPic: item.headPic != '0'? item.headPic : avator,
                        memberName: item.userName,
                        goalAmount: item.goalAmount,
                        goalFinishedAmount: item.finishedAmount,
                        finishRate: item.completionRate
                    }
                    let rate = Number(item.completionRate.split('%')[0]);

                    if(rate < 50){
                        let deg = 360 *  (rate / 100);
                        dataObj.rightDeg = deg;
                        dataObj.leftDeg = 0;
                    }
                    else if(rate >= 50 && rate < 100){
                        let deg = 360 *  (rate / 100) - 180;
                        dataObj.rightDeg = 180;
                        dataObj.leftDeg = deg;
                    }
                    else{
                        dataObj.rightDeg = 180;
                        dataObj.leftDeg = 180;
                    }
                    arr.push(dataObj);
                });

                this.memberList = this.memberList.concat(arr);
                this.totalRows = res.page.totalRows;
                this.maxPage  = res.page.totalPages;
                this.hasMore = res.page.currentPage >= res.page.totalPages? false : true;

                // 显示没有数据提醒
                this.noRecord.show = this.totalRows > 0?  false : true;
            })
        },

        // 重置
        resetData(){
            this.page = 1;
            this.memberList = [];
        },

        // 加载更多
        loadMore(el){
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;

            if(scrollTop + offsetHeight == scrollHeight){
                if(this.hasMore && !this.loadingMore){
                    this.page++;
                    this.getMemberList();
                }
            }
        }
    },
    created(){
        _.hideLoading();
        this.init();
    },
    mounted () {
        // 计算成员列表高度
        let windowHeight = document.documentElement.clientHeight;
        document.querySelector(".member_list_wrap").style.height = windowHeight - 43 + 'px';
    }
}
</script>
<style scoped>
.c999{
    color: #999;
}
.c666{
    color: #666;
}
.mt5{
    margin-top: 0.42rem;
}
.member_list{
    padding-left: 1.25rem;
    background: #fff;
}
.member_tips{
    color: #999;
    text-align: center;
}
.member_list_wrap{
    overflow: auto;
}
.qwui-no_record_box{
    margin-top: -98px;
}
</style>


