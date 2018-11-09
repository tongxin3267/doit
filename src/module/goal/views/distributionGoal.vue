<template>
  <div class="distribution_wrap wrap">
      <div class="success_tips" v-show="showTips">分配成功</div>
      <div class="top_wrap">
        <div class="tab_bar">
            <div class="tab_item flex_item" @click="pickTime">
                <div class="down_arrow select_item">{{timeData}}</div>
            </div>
            <div class="tab_item search_wrap" @click="searchMember">
                <div class="search_item">
                    <i class="ic_search"></i>
                    <span class="search_tips">成员名称</span>
                </div>
            </div>
        </div>
        <div class="data_show">
            <div class="data_left">
                <div class="data_progress">
                    <div class="ring-left"></div>
                    <div class="ring-right"></div>
                    <div class="rings-left" :style="{transform: 'rotateZ(' + (-leftDeg) + 'deg)', zIndex: leftDeg > 0? 6 : 2}"></div>
                    <div class="rings-right" :style="{transform: 'rotateZ(' + (-rightDeg) + 'deg)'}"></div>
                    <div class="ring-info">
                        <p class="rate_num">{{assignRate}}</p>
                        <p class="msg_title">已分配</p>
                    </div>
                </div>
            </div>
            <div class="data_right">
                <div>
                    <div class="mb20">
                        <p class="msg_title">目标总金额(元)</p>
                        <p class="msg_num">{{totalGoal | formatMoney}}</p>
                    </div>
                    <div>
                        <p class="msg_title">已分配目标(元)</p>
                        <p class="msg_num">{{assignGoal | formatMoney}}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div class="member_box">
          <div class="member_bar">
              <div class="bar_item mr20" @click="assignOperate('clear')">
                  <i class="clear_btn"></i>
                  <span>全部清空</span>
              </div>
              <div class="bar_item" @click="assignOperate('average')">
                  <i class="assign_btn"></i>
                  <span>平均分配</span>
              </div>
          </div>
          <div class="member_list_wrap" v-scroll="loadMore">
              <ul class="member_list">
                  <li class="list_item" v-for="(item,idx) in memberList" :key="idx">
                      <div class="mr8">
                          <img :src="item.headPic" class="avator">
                      </div>
                      <div class="member_name">
                          <p>{{item.memberName}}</p>
                      </div>
                      <div class="assign_box">
                          <div :class="{assign_num_wrap:item.isEdit}">
                              <input :class="{assign_num:true, assign_num_inputed:item.isEdit}" type="text"
                              v-model="item.goalAmount" @focus="editGoal(idx)" @blur="blurInput(idx)"
                              @input="changeGoal(idx,$event)" maxlength="8">
                              <i class="edit_btn" v-show="!item.isEdit"></i>
                          </div>
                      </div>
                  </li>
              </ul>
              <load-more :loading="loadingMore" :currPage="page" :maxPage="maxPage">
                  <div class="member_tips">共 {{totalRows}}个成员</div>
              </load-more>
          </div>
      </div>
      <div class="btn_wrap" v-show="showSureBtn">
          <div class="sure_btn" @click="sumbitGoal">确定</div>
      </div>
      <time-picker
          :data="pickData[0]"
          ref="picker"
          :selectedIndex="selectedIndex"
          @select="handleSelect(arguments)"
          cancelTxt="取消" confirmTxt="确定">
      </time-picker>
  </div>
</template>
<script>
import timePicker from '@/components/picker/index';
import loadMore from '@/components/list/load_more';
import { getGoalDetail, getMemberList, assignGoal } from '../api/getData';
import avator from '@/assets/images/touxiang02.png';
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
export default {
    data() {
        return {
            pickData: [
                [Month]
            ],
            timeData: '2018年1月',
            selectedIndex: [0],
            totalGoal: 0,  // 目标总金额
            assignGoal: 0,   // 已分配目标
            assignRate: '0%',  // 分配率
            goalId: '',  // 目标Id
            stage: 1,  // 月份或季度
            countType: 1,  // 统计类型: 1月份 0季度
            personName: '',  // 成员名称
            isOperate: false,  // 是否点击了平均分配和全部清空
            memberList: [],   // 成员列表数据
            goalAmount: 0,  // 成员目标数
            totalRows: 0,  // 总成员数
            page: 1,  // 当前页数
            loadingMore: false,  // 是否正在加载
            maxPage: 0,  // 最大页数
            hasMore: true,  // 是否还有数据
            batch: 0,  //分配状态: 0普通 1全部清空 2平均分配
            rightDeg: 0,  // 进度条右半角度
            leftDeg: 0,  // 进度条左半角度
            showTips: false,  // 显示成功tips
            showSureBtn: false,  // 是否显示确定按钮
            oldGoal: 0,  // 编辑前的目标数值
            diffGoal: 0  // 编辑前后目标的差值
        }
    },
    components: {
        timePicker,
        loadMore
    },
    methods: {
        // 初始化时间
        initDate(){
            let currentDate = new Date();
            let currentYear = this.goalYear;
            let currentMonth = currentDate.getMonth();

            if(this.countType == 1){
                this.pickData = [[Month]];
                this.selectedIndex = [currentMonth];
                this.timeData = `${currentYear}年${currentMonth + 1}月`;
                this.stage = currentMonth + 1;
            }
            else{
                let quarterVal = this.getQuarter(currentMonth + 1);
                this.pickData = [[Quarter]];
                this.selectedIndex = [quarterVal - 1];
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
            this.$nextTick(function() {
                let pick = this.$refs.picker;
                pick.show();
            });
        },

        // 时间选择器确认
        handleSelect(args) {
            this.timeData = `2018年${args[2][0]}`;
            this.stage = args[1][0] + 1;
            this.resetData();
        },

        // 计算进度条角度
        computeDeg(rate){
            if(rate < 50){
                let deg = 360 *  (rate / 100);
                this.rightDeg = deg;
                this.leftDeg = 0;
            }
            else if(rate >= 50 && rate < 100){
                let deg = 360 *  (rate / 100) - 180;
                this.rightDeg = 180;
                this.leftDeg = deg;
            }
            else{
                this.rightDeg = 180;
                this.leftDeg = 180;
            }
        },

        // 获取分配目标详情
        getGoalDetail(){
            getGoalDetail(this.goalId , this.stage ,res => {
                if(res.detail){
                    let { stageAmount, hasSharedAmount, sharedRate } = res.detail;
                    let rate = parseInt(sharedRate.split('%')[0]);
                    this.totalGoal = stageAmount;
                    this.assignGoal = hasSharedAmount;
                    this.assignRate = sharedRate;
                    this.computeDeg(rate);
                }
            })
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
                        goalAmount: this.isOperate? this.goalAmount : item.goalAmount,
                        isEdit: false
                    }
                    arr.push(dataObj);
                });
                this.memberList = this.memberList.concat(arr);
                this.totalRows = res.page.totalRows;
                this.maxPage  = res.page.totalPages;
                this.hasMore = res.page.currentPage >= res.page.totalPages? false : true;
            })
        },

        // 编辑成员目标
        editGoal(idx){
            this.memberList[idx].isEdit = true;
            this.oldGoal = this.memberList[idx].goalAmount;
        },

        // 目标相差值改变，已分配金额和百分比随之变化
        computedDiff(){
            let rate = 0;
            this.assignGoal = Number(this.assignGoal) + this.diffGoal;
            rate = this.totalGoal > 0? ((this.assignGoal / this.totalGoal) * 100).toFixed(1) : 0;
            this.assignRate = rate > 100? '100%' : `${rate}%`;
            this.computeDeg(rate);
        },

        // 离开光标
        blurInput(idx){
            this.memberList[idx].isEdit = false;
            this.diffGoal = this.memberList[idx].goalAmount - this.oldGoal;
            this.computedDiff();
        },

        // 加载更多成员列表
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
        },

        // 提交目标分配
        sumbitGoal(){
            let obj = {
                goalId: this.goalId,
                stage: this.stage,
                batch: this.batch
            }

            // 拼接json
            let jsonObj = {};
            let arr = [];
            this.memberList.map((item,idx) => {
                let dataObj = {
                    userId: item.userId,
                    goalAmount: item.goalAmount
                }
                arr.push(dataObj);
            });
            jsonObj.list = arr;
            obj.dataJson = JSON.stringify(jsonObj);

            assignGoal(obj, res => {
                this.alertTips();
                this.resetData();
            })
        },

        // 平均分配或全部清空
        assignOperate(type){
            this.isOperate = true;
            if(type == 'average'){
                let val = this.totalGoal / this.totalRows;
                let fixedVal = parseInt(val);
                let rate = 0;

                this.batch = 2;
                // 如果总目标不等于0，才计算平均分配
                if(this.totalGoal != 0){
                    this.goalAmount = this.oldGoal = fixedVal;
                    this.assignGoal = fixedVal * this.totalRows;
                    rate = ((this.assignGoal / this.totalGoal) * 100).toFixed(1);
                    this.assignRate = rate > 100? '100%' : `${rate}%`;
                    this.computeDeg(rate);
                }
            }
            else{
                this.goalAmount = this.oldGoal = this.assignGoal = 0;
                this.assignRate = '0%';
                this.batch = 1;
                this.computeDeg(0);  // 重置已分配和已分配率为0
            }
            this.memberList.map((item,idx) => {
                item.goalAmount = this.goalAmount;
            });
        },

        // 改变目标
        changeGoal(idx,e){
            // 只允许输入数字
            let val = e.target.value.replace(/[^\d.]/g,'');

            // 只能为一个小数点
            val = val.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
            this.memberList[idx].goalAmount = val;
        },

        // 重置
        resetData(){
            this.getGoalDetail();
            this.page = 1;
            this.batch = 0;
            this.isOperate = false;
            this.memberList = [];
            this.getMemberList();
        },

        // 搜索成员
        searchMember(){
            this.$router.push({
                path: '/searchMember',
                query: {
                    stage: this.stage,
                    goalId: this.goalId,
                    countType: this.countType
                }
            });
        },

        // 成功tips
        alertTips(){
            this.showTips = true;
            setTimeout(() => {
                this.showTips = false;
            },800)
        }

    },
    created() {
        let { goalYear, countType, goalId } = this.$route.query;
        this.goalYear = goalYear;
        this.countType = countType;
        this.goalId = goalId;
        if(goalId){  // 只有goalId的时候才显示确定按钮
            this.showSureBtn = true;
        }
        this.initDate();
        this.getGoalDetail();
        this.getMemberList();
    },
    mounted() {
        // 计算成员列表高度
        this.$nextTick(function() {
            let windowHeight = document.documentElement.clientHeight;
            let wrapHeight = Number(getComputedStyle(document.querySelector(".top_wrap")).height.split('px')[0]);
            let barHeight = Number(getComputedStyle(document.querySelector(".member_bar")).height.split('px')[0]);
            let btnWrapHeight = Number(getComputedStyle(document.querySelector(".btn_wrap")).height.split('px')[0]);
            document.querySelector(".member_list_wrap").style.height = windowHeight - (wrapHeight + barHeight + btnWrapHeight + 10) + 'px';
        });
    }
}
</script>
<style scoped>
.pr15{
    padding-right: 1.25rem;
}
.mb20{
    margin-bottom: 1.67rem;
}
.mr8{
    margin-right: 0.67rem;
}
.mr20{
    margin-right: 1.67rem;
}
.c666{
    color: #666;
}
.flex_item{
    flex: 1;
}
.distribution_wrap{
    font-size: 1.2rem;
    color: #333;
}
.tab_bar{
    position: relative;
    display: flex;
    margin-bottom: 0.83rem;
    background: #fff;
}
.tab_bar:after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.tab_item{
    display: flex;
    align-items: center;
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
    margin-top: -5px;
    width: 1rem;
    height: 1rem;
    background: url('../../../assets/images/icon_down_gray.png') no-repeat center;
   background-size: 1rem 0.7rem;
}
.select_item{
    position: relative;
    padding-right: 1.5rem;
    max-width: 10.12rem;
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
.data_show{
    display: flex;
    margin-bottom: 0.83rem;
    height: 13.33rem;
    background: #fff;
}
.data_progress{
    position: relative;
    height: 130px;
    width: 130px;
}
.ring-left{
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 120px;
    border: 5px solid #EFEFEF;
    border-radius: 115px 0 0 115px;
    border-right: none;
    z-index: 3;
}
.ring-right{
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 120px;
    border: 5px solid #EFEFEF;
    border-radius: 0 115px 115px 0;
    border-left: none;
    z-index: 5;
}
.rings-left{
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 120px;
    border: 5px solid #1ABEAC;
    border-radius: 115px 0 0 115px;
    border-right: none;
    transform-origin: right center;
}
.rings-right{
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 120px;
    border: 5px solid #1ABEAC;
    border-radius: 0 115px 115px 0;
    border-left: none;
    z-index: 4;
    transform-origin: left center;
}
.ring-info{
    position: absolute;
    top: 45px;
    left: 0;
    width: 100%;
    text-align: center;
}
.data_left,
.data_right{
    display: flex;
    align-items: center;
    flex: 1;
}
.data_left{
    margin-right: 2rem;
    justify-content: flex-end;
}
.msg_title{
    font-size: 1rem;
    color: #999;
}
.msg_num{
    font-size: 2rem;
}
.rate_num{
    font-size: 1.5rem;
    color: #1ABEAC;
}
.member_bar{
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding: 0 1.25rem;
    height: 3.5rem;
    line-height: 3.5rem;
    background: #fff;
}
.member_bar::after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: 1px;
    background: #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.bar_item{
    font-size: 1rem;
    color: #666;
    cursor: pointer;
}
.bar_item i{
    display: inline-block;
    margin-top: -2px;
    width: 1rem;
    height: 1rem;
    vertical-align: middle;
}
.clear_btn{
    background: url('../../../assets/images/ic_empty.png') no-repeat center;
    background-size: 100%;
}
.assign_btn{
    background: url('../../../assets/images/ic_average.png') no-repeat center;
    background-size: 100%;
}
.member_list_wrap{
    overflow-y: auto;
    box-sizing: border-box;
}
.member_list{
    padding: 0 1.25rem;
    background: #fff;
    overflow: hidden;
}
.member_list li{
    padding: 0.83rem 0;
}
.member_list li:first-child{
    margin-top: 0.83rem;
}
.member_list li:last-child{
    margin-bottom: 0.83rem;
}
.btn_wrap{
    padding: 0.67rem 1.25rem;
    height: 5rem;
    background: #fff;
    box-sizing: border-box;
}
.list_item{
    position: relative;
    display: flex;
}
.avator{
    display: block;
    width: 2.17rem;
    height: 2.17rem;
    border-radius: 3px;
}
.member_name{
    display: flex;
    align-items: center;
}
.member_name p{
    width: 17.5rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.assign_box{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: auto;
    width: 40%;
}
.edit_btn{
    display: inline-block;
    margin: -2px 0 0 0.5rem;
    width: 1rem;
    height: 1rem;
    background: url('../../../assets/images/ic_edit.png') no-repeat center;
    background-size: 100%;
    vertical-align: middle;
}
.sure_btn{
    height: 3.67rem;
    line-height: 3.67rem;
    font-size: 1.42rem;
    text-align: center;
    color: #fff;
    border-radius: 5px;
    background: #2F7DCD;
}
.member_tips{
    color: #999;
    text-align: center;
}
.assign_num{
    padding-bottom: 0.1rem;
    width: 6.5rem;
    font-size: 1.2rem;
    font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
    color: #666;
    text-align: right;
    border-radius: 0;
}
.assign_num_inputed{
    padding-bottom: 0.3rem;
    color: #333;
    text-align: left;
}
.assign_num_wrap{
    position: relative;
}
.assign_num_wrap:after{
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 3;
    width: 100%;
    height: 1px;
    background: #ddd;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
.success_tips{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 3rem;
    line-height: 3rem;
    color: #FFAC61;
    text-align: center;
    background: #FFF9E5;
}
</style>


