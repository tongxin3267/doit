<template>
  <div class="memberGoal_wrap" @click="resetBCoption">
    <div class="tab_bar">
        <div class="tab_item flex_item" @click="selectTeam">
            <div :class="{down_arrow:true, up_arrow:arrowArr[0], select_item:true}">{{teamName}}</div>
        </div>
        <div class="tab_item flex_item" @click="pickTime">
            <div :class="{down_arrow:true, up_arrow:arrowArr[1], select_item:true}">{{timeData}}</div>
        </div>
        <div class="tab_item search_wrap" @click="searchMember">
            <div class="search_item">
                <i class="ic_search"></i>
                <span class="search_tips">成员名称</span>
            </div>
        </div>
        <ul class="teamList" v-show="showTeam">
            <li :class="{active:idx == teamSelectIdx}" v-for="(item,idx) in teamList" :key="idx" @click="confirmTeam(item.id,idx)">
                <div class="team_item">{{item.teamName}}</div>
            </li>
        </ul>
    </div>
    <div class="main_wrap" v-scroll="loadMore">
        <div class="crm_goal_dataBoard mt10">
            <div class="dataBoard_item">
                <div class="title" @click.stop = "pickBCopiton">{{goalType == 0? '商机赢单金额' : '合同签约金额'}}
                    <i v-show="canChangeBC" :class="{arrow:true,arrow_up:arrowArr[2]}"></i>
                    <div v-show="canChangeBC && showBCOption" class="title_selector_cont">
                        <ul class="title_selectorList">
                            <li v-for="item in goalTypeBC" :key="item.type"
                            :class="{'list_item':true, 'qwui-border_bottom':true, 'active':goalType == item.type}"
                            @click.stop="selectBC(item.type)">{{item.typeName}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-show="true" class="dataBoard_item goal_finish_item">
                <div class="goal_item">
                    <p class="item_title">目标(元)</p>
                    <p class="money">{{stageAmount | formatMoney}}</p>
                </div>
                <div class="finish_item">
                    <p class="item_title">完成(元)</p>
                    <p class="money">{{finAmount | formatMoney}}</p>
                </div>
            </div>
            <div class="dataBoard_item">
                <div class="progressbar">
                    <div class="progressbar_inner" :style="{width:finishRate}"></div>
                </div>
            </div>
            <div class="dataBoard_item illustrates_item">
                <span class="finish_illustrates">完成：<span>{{completionRate}}</span></span>
                <span class="rest_illustrates">剩余目标：<span>{{resetGoal | formatMoney}}元</span></span>
            </div>
        </div>
        <div class="member_list_wrap mt10">
            <div class="container">
                <div class="menuTab_wrap" ref="menuTab">
                    <menu-tab :menudata="menuData"></menu-tab>
                </div>
            </div>
            <div v-show="flag == 1">
                <ul class="member_list">
                    <li is="memberItem" v-for="(item,idx) in finishList" :key="idx" :item="item"></li>
                </ul>
                <load-more :loading="loadingMore" :currentRows="finPage" :maxPage="finMaxPage">
                  <div class="member_tips">共 {{finTotalRows}}个成员</div>
                </load-more>
            </div>
            <div v-show="flag == 0">
                <ul class="member_list">
                    <li is="memberItem" v-for="(item,idx) in unFinishList" :key="idx" :item="item"></li>
                </ul>
                <load-more :loading="loadingMore" :currPage="unFinPage" :maxPage="unFinMaxPage">
                  <div class="member_tips">共 {{unFinTotalRows}}个成员</div>
                </load-more>
            </div>
        </div>
    </div>
    <div class="mask" v-show="showTeam" @click="hideTeam"></div>
    <time-picker
        :data="pickData[0]"
        ref="picker"
        :selectedIndex="selectedIndex"
        @select="handleSelect(arguments)"
        @cancel="cancelPicker()"
        cancelTxt="取消" confirmTxt="确定">
      </time-picker>
  </div>
</template>
<script>
import timePicker from '@/components/picker/index';
import menuTab from '@/components/button/menu_tab';
import loadMore from '@/components/list/load_more';
import memberItem from './parts/memberItem';
import avator from '@/assets/images/touxiang02.png';
import { getTeamList, getMemberList, getMemberGoal } from '../api/getData';
const Year = [
    {text: '2018'},
    {text: '2019'},
    {text: '2020'},
    {text: '2021'},
    {text: '2022'},
    {text: '2023'},
    {text: '2024'},
    {text: '2025'},
    {text: '2026'},
    {text: '2027'},
    {text: '2028'},
    {text: '2029'},
    {text: '2030'},
]
const Month = [
    {text: '1月'},
    {text: '2月'},
    {text: '3月'},
    {text: '4月'},
    {text: '5月'},
    {text: '6月'},
    {text: '7月'},
    {text: '8月'},
    {text: '9月'},
    {text: '10月'},
    {text: '11月'},
    {text: '12月'}
];
const Quarter = [
    {text: '第1季度'},
    {text: '第2季度'},
    {text: '第3季度'},
    {text: '第4季度'}
];
const COUNT_QUARTERLY = '0'; // 目标统计——以季度为准
const COUNT_MONTH = '1'; // 目标统计——以月度为准
const STATUS_BUSINESS = '0'; // 目标类型——商机赢单类型
const STATUS_CONTRACT = '1'; // 目标类型——合同签约金额
export default {
    data(){
        return {
            pickData: [
                [Year,Month]
            ],
            timeData: '2018年1月',
            selectedIndex: [0],
            goalId: 'd0872546289f437c9fec2aa8be2ff25a',  // 目标Id
            stage: 1,  // 月份或季度
            countType: 1,  // 统计类型: 1月份 0季度
            finishList: [],   // 成员已完成列表数据
            unFinishList: [],   // 成员未完成列表数据
            finTotalRows: 0,  // 已完成总成员数
            unFinTotalRows: 0,  // 未完成总成员数
            finPage: 1,  // 已完成当前页数
            unFinPage: 1,  // 未完成当前页数
            loadingMore: false,  // 是否正在加载
            finMaxPage: 0,  // 已完成最大页数
            unFinMaxPage: 0,  // 未完成最大页数
            finHasMore: true,  // 已完成是否还有数据
            unFinHasMore: true,  // 未完成是否还有数据
            teamList: [],  // 团队名称
            teamId: '',  // 当前团队id
            teamName: '',  // 当前团队名称
            showTeam: false,  // 是否显示团队列表,
            showBCOption: false, // 是否显示商机、合同类型选项
            arrowArr: [false, false, false],  // 箭头状态 true:向上 false:向下
            teamSelectIdx: 0,  // 当前选中的团队
            menuData: { //tab菜单切换
                show:false,
                navNum:0,
                navBar:[
                    {
                        name: "i18n.completed",
                        num: "",
                        data: {type:"0"},
                        callBack: res => {
                            this.flag = 1;
                        }
                    },
                    {
                        name: "i18n.uncompleted",
                        num: "",
                        data: {type:"1"},
                        callBack: res => {
                            this.flag = 0;

                            // 若没有点击过未完成tab则加载数据
                            if(!this.clickUnfinTab){
                                this.getMemberList();
                                this.clickUnfinTab = true;
                            }
                        }
                    },
                ],
            },
            flag: 1,  // 成员列表状态:0 未完成，1已完成
            clickUnfinTab: false,  //是否点击了未完成
            goalYear: '',  // 目标年份
            goalType: '0',  // 目标类型  0商机 ，1合同
            changeTeam: false,  // 是否改变团队
            goalTypeBC: [
                {
                    typeName: '商机赢单金额',
                    type: 0
                },
                {
                    typeName: '合同签约金额',
                    type: 1
                }
            ],
            goalDetail: {},  // 目标详情
            canChangeBC: false, // 是否能切换目标类型（商机目标、合同目标）
            finAmount: 0,  // 阶段目标金额
            stageAmount: 0,  // 阶段完成金额
            completionRate: '0%', //阶段完成百分比
        }
    },
    components: {
        timePicker,
        menuTab,
        loadMore,
        memberItem
    },
    computed: {
        // 剩余目标
        resetGoal() {
            let goalAmount = this.stageAmount || 0;
            let finishedAmount = this.finAmount || 0;
            let restAmount = goalAmount - finishedAmount;
            restAmount = restAmount < 0 ? 0 : restAmount
            return restAmount;
        },

        // 完成率进度条
        finishRate() {
            let formatedRate = this.completionRate || '0%' ; 
            if (formatedRate.indexOf('>') > -1) {
            let arr = formatedRate.split('>');
            formatedRate = arr[1];
            }
            return formatedRate;
        
        }
    },
    methods: {
        // 初始化
        init(){
            let { goalYear, countType, teamId, goalType } = this.$route.query;
            this.goalYear = goalYear;
            this.countType = countType;
            this.goalType = goalType;
            this.teamId = teamId;
            this.initDate();
            this.getTeamList();
            this.getMemberGoal();
        },

        // 初始化时间
        initDate(){
            let currentDate = new Date();
            let currentYear = this.goalYear;
            let currentMonth = currentDate.getMonth();
            let currentYearIdx = 0;

            // 获取当前年份的索引值
            Year.map((item, idx) => {
                if(item.text == currentYear){
                    currentYearIdx = idx;
                }
            })

            if(this.countType == 1){
                this.pickData = [[Year,Month]];
                this.selectedIndex = [currentYearIdx, currentMonth];
                this.timeData = `${currentYear}年${currentMonth + 1}月`;
                this.stage = currentMonth + 1;
            }
            else{
                let quarterVal = this.getQuarter(currentMonth + 1);
                this.pickData = [[Year,Quarter]];
                this.selectedIndex = [currentYearIdx, quarterVal - 1];
                this.timeData = `${currentYear}年第${quarterVal}季度`;
                this.stage = quarterVal;
            }
        },

        // 获取当前季度
        getQuarter(month){
            let quarterVal;

            if(month <= 3){
                quarterVal = 1;
            }
            else if(month > 3 && month <= 6){
                quarterVal = 2;
            }
            else if(month > 6 && month <= 9){
                quarterVal = 3;
            }
            else if(month > 9 && month <= 12){
                quarterVal = 4;
            }

            return quarterVal;
        },

        // 打开时间选择器
        pickTime() {
            this.showTeam = false;
            this.arrowArr = [false,false,false];
            this.arrowArr[1] = true;
            this.changeTeam = false;

            this.$nextTick(function() {
                let pick = this.$refs.picker;
                pick.show();
            });
        },

        // 时间选择器确认
        handleSelect(args) {
            this.arrowArr = [false,false,false];
            this.timeData = `${args[2][0]}年${args[2][1]}`;
            this.stage = args[1][1] + 1;
            this.goalYear = args[2][0];
            this.resetData();
            this.getMemberGoal();
        },

        // 获取团队列表
        getTeamList(){
            let arr = [];
            let obj = {
                pageSize: 20
            }
            getTeamList(obj, res => {
                if(res.pageData){
                    let list = res.pageData;
                    list.map((item,idx) => {
                        let obj = {
                            id: item.id,
                            teamName: item.teamName,
                        }

                        // 默认选中传入的团队
                        if(item.id == this.teamId){
                            this.teamSelectIdx = idx;
                            this.teamName = item.teamName;
                        }
                        arr.push(obj);
                    })
                }
                this.teamList = arr;
            })
        },

        // 点击团队列表的tab
        selectTeam(){
            this.showTeam = !this.showTeam;
            this.arrowArr = [false,false,false];
            this.arrowArr[0] = this.showTeam;
            this.changeTeam = true;
        },

        // 关闭时间选择器
        cancelPicker(){
            this.arrowArr = [false,false,false];
        },

        // 隐藏团队列表
        hideTeam(){
            this.arrowArr = [false,false,false];
            this.showTeam = false;
            this.changeTeam = false;
        },

        // 确认选择团队
        confirmTeam(id,idx){
            this.teamSelectIdx = idx;
            this.showTeam = false;
            this.teamId = id;
            this.teamName = this.teamList[idx].teamName;
            this.arrowArr[0] = this.showTeam;
            this.goalType = '';
            this.stage = '';
            this.resetData();
            this.getMemberGoal();
        },

        // 获取成员列表
        getMemberList(){
            let obj = {
                goalId: this.goalId,
                stage: this.stage,
                countType: this.countType,
                flag: this.flag
            }
            let currentFlag = this.flag;
            obj.page = this.flag == 1? this.finPage : this.unFinPage
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

                if(currentFlag == 1){
                    this.finishList = this.finishList.concat(arr);
                    this.finTotalRows = res.page.totalRows;
                    this.finMaxPage  = res.page.totalPages;
                    this.finHasMore = res.page.currentPage >= res.page.totalPages? false : true;
                }
                else{
                    this.unFinishList = this.unFinishList.concat(arr);
                    this.unFinTotalRows = res.page.totalRows;
                    this.unFinMaxPage  = res.page.totalPages;
                    this.unFinHasMore = res.page.currentPage >= res.page.totalPages? false : true;
                }
            })
        },

        // 加载更多
        loadMore(el){
            let scrollTop = el.scrollTop;
            let offsetHeight = el.offsetHeight;
            let scrollHeight = el.scrollHeight;
            let bodyWidth = getComputedStyle(document.querySelector("body")).width;

            // tab吸附效果
            if(scrollTop >= 196){
                this.$refs.menuTab.style.position = 'fixed';
                document.querySelector('.menuTab_wrap').style.width = bodyWidth;
            }
            else{
                this.$refs.menuTab.style.position =	'static';
                document.querySelector('.menuTab_wrap').style.width = 'auto';
            }

            if(scrollTop + offsetHeight == scrollHeight && scrollTop != 0){
                if(this.flag == 1){
                    if(this.finHasMore && !this.loadingMore){
                        this.finPage++;
                        this.getMemberList();
                    }
                }
                else{
                    if(this.unFinHasMore && !this.loadingMore){
                        this.unFinPage++;
                        this.getMemberList();
                    }
                }
            }
        },

        // 重置数据
        resetData(){
            this.menuData.navNum = 0;
            this.clickUnfinTab = false;
            this.unFinishList = this.finishList = [];
            this.unFinPage = this.finPage = 1;
            this.flag = 1;
            this.unFinHasMore = this.finHasMore = true;
        },

        // 搜索成员
        searchMember(){
            this.$router.push({
                path: '/searchMemberGoal',
                query: {
                    stage: this.stage,
                    goalId: this.goalId,
                    countType: this.countType
                }
            });
        },

        // 获取成员详情信息
        getMemberGoal(){
            // 如果选择其他团队后stage和goalType变空
            let obj = {
                goalYear: this.goalYear,
                stage: this.stage,
                goalType: this.goalType,
                teamId: this.teamId
            }
            getMemberGoal(obj, res => {
                let goalDetail;
                let teamHasGoalType = '';  // 团队的目标类型（商机、合同）
                let currentStage = '';
                let defaultDetail = {
                    id: '',
                    goalAmount: '0',  //目标金额
                    goalTypeName: '商机赢单金额',
                    countType: this.countType,  //季度
                }
                if(res.detail){
                    goalDetail = res.detail.goal;
                    teamHasGoalType = res.detail.teamHasGoalType;
                    currentStage = res.detail.stage.stage;
                    this.finAmount = res.detail.stage.finishedAmount ;
                    this.stageAmount = res.detail.stage.stageAmount;
                    this.completionRate = res.detail.stage.completionRate;
                }else {
                    goalDetail = {};
                    this.countType = 1;
                    currentStage = new Date().getMonth() + 1;
                }

                this.$set(this,'goalDetail', Object.assign({}, defaultDetail, goalDetail));
                this.goalId = this.goalDetail.id;
                this.countType = this.goalDetail.countType;

                // 统计拥有多少个类型的目标
                let goalTypeCount = 0;
                if(teamHasGoalType){
                    goalTypeCount = teamHasGoalType.split(',').length;
                }
                this.canChangeBC = goalTypeCount > 1 ? true : false;

                // 只有选择其他团队时候才判断时间类型
                if(this.changeTeam){
                    if(this.countType == 1){
                        this.pickData = [[Year,Month]];
                        this.selectedIndex.splice(1, 1, currentStage - 1);
                        this.timeData = `${this.goalYear}年${currentStage}月`;
                        this.stage = currentStage;
                    }
                    else{
                        this.pickData = [[Year,Quarter]];
                        this.selectedIndex.splice(1, 1, currentStage - 1);
                        this.timeData = `${this.goalYear}年第${currentStage}季度`;
                        this.stage = currentStage;
                    }
                }
                this.getMemberList();
            })
        },

        // 选择统计类型
        pickBCopiton() {
            if(this.arrowArr[2]){
                this.showBCOption = false;
                this.arrowArr = [false,false,false];
            }
            else {
                if(this.canChangeBC){
                    this.arrowArr.splice(2,1,true);
                    this.showBCOption = true;
                }
            }
        },

        // 收起统计类型选择
        resetBCoption(){
            this.showBCOption = false;
            this.arrowArr.splice(2,1,false);
        },

        // 选择统计类型
        selectBC(type) {
            this.goalType = type;
            this.stage = '';
            this.changeTeam = true;
            this.resetData();
            this.resetBCoption();
            this.getMemberGoal();
        }
    },
    created () {
        _.hideLoading();
        this.init();
    },
    mounted() {
        this.$nextTick(() => {
            let windowHeight = document.documentElement.clientHeight;
            let barHeight = Number(getComputedStyle(document.querySelector(".tab_bar")).height.split('px')[0]);
            document.querySelector(".mask").style.height = `${windowHeight}px`;
            document.querySelector(".main_wrap").style.height = `${windowHeight - barHeight}px`;
        })
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
.mt10{
    margin-top: 0.83rem
}
.tab_bar:after, .teamList li:after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.memberGoal_wrap{
    font-size: 1.2rem;
    color: #333;
}
.tab_bar{
    position: relative;
    z-index: 11;
    display: flex;
    background: #fff;
}
.tab_item{
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
    height: 3.75rem;
    text-align: center;
}
.down_arrow{
    position: relative;
    display: inline-block;
}
.down_arrow:after{
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    display: inline-block;
    margin-top: -6px;
    width: 1rem;
    height: 1rem;
    background: url('../../../assets/images/icon_down_gray.png') no-repeat center;
   background-size: 1rem 0.7rem;
}
.up_arrow.down_arrow:after{
    transform: rotate(180deg);
}
.select_item{
    position: relative;
    padding-right: 1.5rem;
    max-width: 9.12rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
}
.ic_search{
    display: inline-block;
    margin-right: 0.25rem;
    width: 1rem;
    height: 1rem;
    background: url('../../../assets/images/ic_search.png') no-repeat center;
    background-size: 100%;
}
.search_tips{
    font-size: 1.08rem;
    color: #bbb;
}
.search_item{
    position: relative;
    width: 100%;
}
.search_item:after{
    content: '';
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    width: 1px;
    height: 1.34rem;
    background: #ddd;
    transform: scaleX(0.5);
    transform-origin: 0 0;
}
.search_wrap{
    width: 10.42rem;
}
.teamList{
    position: absolute;
    top: 3.75rem;
    left: 0;
    padding-left: 1.25rem;
    width: 100%;
    max-height: 19rem;
    background: #fff;
    overflow: auto;
    box-sizing: border-box;
}
.teamList li{
    position: relative;
    height: 3.5rem;
    line-height: 3.5rem;
}
.teamList li:last-child:after{
    content: normal;
}
.team_item{
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.teamList li.active::before{
    content: '';
    position: absolute;
    right: 2.5rem;
    top: 50%;
    margin-top: -4px;
    width: 1.08rem;
    height: 0.75rem;
    background: url('../../../assets/images/ic_right.png') no-repeat;
    background-size: 1.08rem 0.75rem;
}
.mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 10;
}
.main_wrap{
    overflow: auto;
}
.member_list{
    padding-left: 1.25rem;
    background: #fff;
}
.member_tips{
    color: #999;
    text-align: center;
}
.menuTab_wrap{
    top: 45px;
    z-index: 6;
    width: 100%;
    background: #fff;
}
.container{
    height: 50px;
}
.crm_goal_dataBoard{
    padding: 1rem 2rem;
    background-color: #fff;
    text-align: center;
}
.crm_goal_dataBoard .dataBoard_item:first-child {
    position: relative;
  }
  .crm_goal_dataBoard .title{
    display: inline-block;
    position: relative;
    font-size: 1.42rem;
  }
  .crm_goal_dataBoard .title .arrow{
    content: '';
    position: absolute;
    top: 50%;
    right: -1.5rem;
    margin-top: -0.35rem;
    width: 1rem;
    height: 0.7rem;
    background-image: url('../../../assets/images/icon_down_gray.png');
    background-repeat: no-repeat;
    background-size: 1rem 0.7rem;
  }
  .crm_goal_dataBoard .title .arrow.arrow_up{
    transform: rotate(180deg);
  }
  .crm_goal_dataBoard .title_selector_cont{
    position: absolute;
    width: 11rem;
    z-index: 100;
    top: 3rem;
    right: -8.5rem;
  }
  .crm_goal_dataBoard .title_selectorList{
   background-color: #fff;
   padding-left: 1rem;
   box-shadow: 0px 2px 10px #ccc;
   border-radius: 3px;
 }
  .goal_finish_item{
    margin-top: 2rem;
    display: flex;
  }
  .goal_finish_item .goal_item,
  .goal_finish_item .finish_item{
    flex: 1
  }
  .goal_item{
    position: relative;
  }
  .goal_finish_item .item_content{
    display: inline-block;
  }
  .goal_item::after{
    content: ' ';
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    border-left: 1px solid #E5E5E5;
    transform: scaleX(0.5);
    transform-origin: 0 0;
  }
  .goal_finish_item .goal_item .item_title,
  .goal_finish_item .finish_item .item_title{
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    margin-bottom: 0.5rem;
  }
  .goal_item .item_title::before,
  .finish_item .item_title::before{
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 5px;

  }
  .goal_item .item_title::before{
    background-color: #1ABEAC;
  }
  .finish_item .item_title::before{
    background-color: #468CEB;
  }

  .goal_finish_item .goal_item .money,
  .goal_finish_item .finish_item .money{
    font-size: 2rem;
    color: #333;
    max-width: 13rem;
    word-break: break-all;
    margin: 0 auto;
    text-align: center;
  }
  .progressbar{
    margin: 2.5rem 0 0;
    width: 100%;
    background-color: #EFEFEF;
    border-radius: 5px
  }
  .progressbar .progressbar_inner{
    width: 2rem;
    height: 0.65rem;
    max-width: 100%;
    background-color: #468CEB;
    border-radius: 5px;
  }
  .title_selectorList::before {
    border-color: transparent #ececec transparent transparent;
    border-style: solid;
    border-width: 8px;
    content: "";
    font-size: 20px;
    left: 35px;
    position: absolute;
    top: -16px;
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
  }
  .title_selectorList .list_item.active::before{
    content: '';
    position: absolute;
    top: 50%;
    margin-top: -4px;
    width: 13px;
    height: 9px;
    background-image: url('../../../assets/images/ic_right.png');
    background-size: 13px 9px;
  }
  .title_selectorList::after {
    background: #fff;
    content: '';
    height: 10px;
    width: 10px;
    left: 38px;
    position: absolute;
    top: -5px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .title_selectorList .list_item{
   display: flex;
   align-items: center;
   height: 3.5rem;
   color: #333;
   font-size: 1.2rem;
 }
 .title_selectorList .list_item.active{
    color: #467DB9;
 }
 .title_selectorList .list_item.active::before{
    right: 0.65rem
 }
 .dataBoard_item.illustrates_item{
    display: flex;
    line-height: 1.2rem;
    height: 1.2rem;
    margin-top: .5rem;
    color: #666666;
    font-size: 1rem;
  }
 .illustrates_item .finish_illustrates,
  .illustrates_item .rest_illustrates{
    flex: 1;
  }
  .illustrates_item .finish_illustrates{
    text-align: left;
  }
  .illustrates_item .rest_illustrates{
    text-align: right;
  }
  .illustrates_item .finish_illustrates span{
    color: #468CEB;
  }
  .illustrates_item .rest_illustrates span{
    color: #1ABEAC;
  }
  .qwui-border_bottom:after {
      transform-origin: 0 0;
  }
</style>


