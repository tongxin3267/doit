<template>
  <div class="wrap goalDetail" @click="removeMask">
    <!-- 筛选头部start -->
    <div class="crm_goal_filter">
      <div class="crm_filter_wrap qwui-border_bottom">
        <div class="crm_filter_item" v-on:click.stop="pickTime">
          <div class="item_content_wrap">
            <div class="item_content has_list">
              <span>{{goalFilter.year}}</span>
              <i :class="[{arrow:true},arrowDirection_arr[0] == 'up'?'arrow_up': '']"></i>
            </div>
          </div>
        </div>
        <div class="crm_filter_item" v-on:click.stop="pickGoalType">
          <div class="item_content_wrap">
            <div class="item_content">
              <span>{{teamOrPersonName}}</span>
              <i :class="[{arrow:true},arrowDirection_arr[1] == 'up'?'arrow_up': '']"></i>
            </div>
          </div>
        </div>
        <div v-if="hasTeamList" class="crm_filter_item" v-on:click.stop="pickTeam">
          <div class="item_content_wrap">
            <div class="item_content has_list">
              <span class="teamName">{{teamName}}</span>
              <i :class="[{arrow:true},arrowDirection_arr[2] == 'up'?'arrow_up': '']"></i>
            </div>
          </div>
        </div>
        <div v-show="hasOperation" class="crm_operation" @click="openDialog">
          <i class="crm_opartion_icon"></i>
        </div>
      </div>
      <div class="crm-goal_filterListCon">
        <ul v-show="showTeamOrPersonList" class="filter_list qwui-border_bottom">
          <li v-for="item in goalType" :key="item.type"  class="list_item qwui-border_bottom" :class="{'active': goalFilter.teamOrPerson === item.type}" @click="selectTeamOrPerson(item.type)">
            <span class="item_text">{{item.typeName}}</span>
          </li>
          <!-- <li class="list_item qwui-border_bottom">个人目标</li> -->
        </ul>
        <ul v-show="showTeamList" class="filter_list qwui-border_bottom">
          <li v-for="item in personInfo.teamList" :key="item.id" class="list_item qwui-border_bottom" :class="{'active': goalFilter.defaultTeamId === item.id}" @click="selectTeam(item.id)"><span class="item_text">{{item.teamName}}</span></li>
        </ul>
      </div>

    </div>
    <!-- 筛选头部end -->

    <div class="crm_goal_container">
      <!-- 数据看板start -->
      <div class="crm_goal_dataBoard">
        <div class="dataBoard_item">
          <div class="title" v-on:click.stop="pickBCopiton">
            {{goalDetail.goalTypeName}}
            <i v-show="canChangeBC" :class="[{arrow:true},arrowDirection_arr[3] == 'up'?'arrow_up': '']"></i>
            <div v-show="showBCoption" class="title_selector_cont">
              <ul class="title_selectorList">
                <li v-for="item in goalTypeBC" :key="item.type" class="list_item qwui-border_bottom" :class="{'active':goalFilter.goalType === item.type}" @click.stop="selectBC(item.type)">{{item.typeName}}</li>
              </ul>
            </div>
          </div>

        </div>
        <div v-show="true" class="dataBoard_item goal_finish_item">
          <div class="goal_item">
            <p class="item_title">目标(元)</p>
            <p class="money">{{goalDetail.goalAmount | formatMoney}}</p>
          </div>
          <div class="finish_item">
            <p class="item_title">完成(元)</p>
            <p class="money">{{goalDetail.finishedAmount | formatMoney}}</p>
          </div>
        </div>
        <div class="dataBoard_item">
          <div class="progressbar">
            <div class="progressbar_inner" :style="{width:finishRate}"></div>
          </div>
        </div>
        <div class="dataBoard_item illustrates_item">
          <span class="finish_illustrates">完成：<span>{{goalDetail.completionRate || '0%'}}</span></span>
          <span class="rest_illustrates">剩余目标：<span>{{resetGoal | formatMoney}}元</span></span>
        </div>
      </div>
      <!-- 数据看板end -->

      <!-- 数据展示板块start -->
      <div class="crm_goal_dataShowPanel">
        <div class="illustrates">
          <div class="illustrates_left">
            <div class="goal_item">
              <p class="item_title">
                <span class="c666">{{currentType}}目标：</span><span>{{goalDetail.stageAmount | formatMoney}}元</span>
              </p>
            </div>
            <div class="finish_item">
              <p class="item_title">
                <span class="c666">{{currentType}}完成：</span><span>{{goalDetail.stageFinishedAmount | formatMoney}}元</span>
              </p>
            </div>  
          </div>
          <div v-show="hasOperation" class="illustrates_right">
            <span @click="goDetail">成员详情</span>
          </div>
        </div>
        <div>
          <x-chart :id="chart" :option="highChartsOption" ref="hightChart"></x-chart>
        </div>
        <div class="table_container">
          <table class="table">
            <tr>
              <th>时间</th>
              <th>目标（元）</th>
              <th>已完成（元）</th>
              <th>完成度</th>
            </tr>
            <tr v-for="(item,index) in tableData" :key="index">
              <td>{{item.stageName}}</td>
              <td>{{item.stageAmount | formatMoney}}</td>
              <td>{{item.finishedAmount | formatMoney}}</td>
              <td>{{item.completionRate}}</td>
            </tr>

          </table>


        </div>
      </div>
      <!-- 数据展示板块end -->
    </div>



    <dialog-mask :dialogConfig="dialogConfig"></dialog-mask>

    <timePicker
          :data="pickerOption[0]"
          ref="picker"
          @select="handleSelect(arguments)"
          :selectedIndex = 'defalutArr'
          @cancel="cancelPicker()"
          cancelTxt="取消" confirmTxt="确定">
    </timePicker>
    <div v-show="showOptionList" class="mask" @click="closeMask"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import timePicker from '@/components/picker/index';
  import dialogMask from '@/components/base/dialog_mask_bottom';
  import {getfilter,getGoalInfo} from "../api/getData";
  import XChart from './highcharts.vue'
  import index from 'vue';
  const YEAR = [
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
  ];
  const COUNT_QUARTERLY = '0'; // 目标统计——以季度为准
  const COUNT_MONTH = '1'; // 目标统计——以月度为准
  let userId = window._.userId;



  export default {
    data() {
      return {
        chart: 'chart',
        goalFilter: {
          year: 2018,
          teamOrPerson: '',
          defaultTeamId: '',
          goalType: '',
        },
        pickerOption: [
          [YEAR]
        ],
        goalType: [
          {
            typeName: '团队目标',
            type: 'team'
          },
          {
            typeName: '个人目标',
            type: 'person'
          }
        ],
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
        personInfo: {},
        goalDetail: {},
        defalutArr: [],
        arrowDirection_arr: ['down','down','down','down'],
        showOptionList: false,
        showTeamOrPersonList: false,
        showTeamList: false,
        showBCoption: false,
        canChangeBC: false,
        highChartsOption: {
          chart: {
            type: 'column'
          },
          credits: {
            enabled: false
          },
          title: {
              text: ''
          },
          xAxis: {
              type: 'category',
              title:{
						    text: '单位：月',
                            align: 'high'
				      },
              categories: [
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '10',
                  '11',
                  '12'
              ],
              tickLength: 0,
          },
          yAxis: [{
              min: 0,
              title: {
                  text: ''
              },
              visible: false
          }],
          legend: {
              shadow: false,
              enabled: false
          },
          tooltip: {
              enabled: false
          },
          plotOptions: {
              column: {
                  grouping: false,
                  shadow: false,
                  borderWidth: 0
              },
              series: {
                states: {
                  hover: {
                    enabled: false
                  }
                }
              }
          },
          series: [
              {
                  type: 'column',
                  name: '目标',
                  color: '#EFEFEF',
                  data: [],
                  pointPadding: 0.1,
                  borderWidth: 0,
                  borderRadius: 5,
                  pointWidth: 10,
              },
              {
                  name: '完成额',
                  color: '#468CEB',
                  type: 'column',
                  data: [],
                  pointWidth: 10,
                  pointPadding: 0.1,
                  borderWidth: 0,
                  borderRadius: 5,
                  zoneAxis: 'x',
                  zones: []
              }
          ],

        },
        countType: '1',
        goalId: '',
        dialogConfig: {    // 弹窗对话框
          show: false,
          title: '',  // 标题
          type: '',
          content: [],  // 中间自定义内容
          canClose: true,  // 是否由弹窗组件关闭窗口，true:确定按钮后自动关闭，
          btnConfig: [
            {
              title:"分配成员目标",
              callBack:() => {
                this.$router.push({
                  path: '/distributionGoal',
                  query:{
                    goalYear: this.goalFilter.year,
                    countType: this.countType,
                    goalId: this.goalId
                  }
                })
              }
            },
            {
              title:"取消",
              callBack:null
            }
          ]
        },
        tableData: []  // 表格数据
      }
    },
    computed: {
      defaultYearIndex() {
        let defaultIndex = 0;
        let defaultYear = this.goalFilter.year;
        let arr = [];
        YEAR.forEach((currentValue,index) => {
          if (defaultYear === currentValue['text'] ){
            defaultIndex = index;
          }
        })
        //return arr.push(defaultIndex);
        return defaultIndex;
      },
      teamOrPersonName() {
        let currentTeamOrPersonName = '团队目标';
        this.goalType.forEach((currentValue,index) => {
          if (currentValue.type === this.goalFilter.teamOrPerson) {
            currentTeamOrPersonName = currentValue.typeName;
          }
        })
        return currentTeamOrPersonName;
      },
      teamName() {
        let currentTeamName = '';
        let firstTeamId; //第一个团队id
        if(this.personInfo.teamList.length === 0){
          return '';
        }

        this.personInfo.teamList.forEach((currentValue,index) => {
          if(index === 0){
            firstTeamId =  currentValue.id;
          }
          if (currentValue.id === this.goalFilter.defaultTeamId) {
            currentTeamName = currentValue.teamName;
          }
        })
        if (currentTeamName === '') {

          this.personInfo.teamList.forEach((currentValue,index) => {
            if(currentValue.id === firstTeamId) {
              currentTeamName = currentValue.teamName;
            }
          })
          this.goalFilter.defaultTeamId = firstTeamId || ''
          localStorage.setItem('defaultTeamId', firstTeamId);
        }
        return currentTeamName;
      },
      resetGoal() {
        let goalAmount = this.goalDetail.goalAmount || 0;
        let finishedAmount = this.goalDetail.finishedAmount || 0;
        let restAmount = goalAmount - finishedAmount;
        restAmount = restAmount < 0 ? 0 : restAmount
        return restAmount;
      },
      hasOperation(){
        let isInchargeCurrentTeam = false;
        // 查看当前用户是否是当前的默认团队的负责人
        if(this.personInfo.teamList){
          this.personInfo.teamList.forEach((currentValue,index) => {
            if (currentValue.id === this.goalFilter.defaultTeamId) {
              isInchargeCurrentTeam = currentValue.inCharge;
            }
          })
        }
        let isTeamGoal = this.goalFilter.teamOrPerson === 'team';
        return isInchargeCurrentTeam &&  isTeamGoal;
      },
      hasTeamList() {
        let hasTeamList = false;
        if(this.personInfo.teamList) {
          hasTeamList = this.personInfo.teamList.length === 0 ? false : true;
        }
        return hasTeamList;
      },
      finishRate() {
        let formatedRate = this.goalDetail.completionRate || '0%' ; 
        if (formatedRate.indexOf('>') > -1) {
          let arr = formatedRate.split('>');
          formatedRate = arr[1];
        }
        return formatedRate;
      
      },
      currentType() {
        let typeName = this.countType == '1'? '本月' : '本季';
        return typeName;      
      }
    },
    created(){
      this.init();

    },
    mounted(){
      this.getHeaderInfo();
    },
    methods: {
      init() {
        let storage_userId = localStorage.getItem('crm_goalDetail_filter_storage');
        if (storage_userId) {
          // 不同个用户
          if (storage_userId !== userId) {
            localStorage.removeItem('defaultYear');
            localStorage.removeItem('teamOrPerson');
            localStorage.removeItem('defaultTeamId');
            localStorage.setItem('crm_goalDetail_filter_storage', userId);
          }
        } else {
          // 没有缓存
          localStorage.setItem('crm_goalDetail_filter_storage', userId);
        }



        // 设置默认年份 (若没有缓存时间设置默认年份为当前年份，有则为缓存年份)
        let currentYear = new Date().getFullYear();
        let ls_year = localStorage.getItem("defaultYear");
        let defaultYear = ls_year || currentYear;
        localStorage.setItem("defaultYear", defaultYear);
        this.goalFilter.year = defaultYear;
        let arr = [];
        arr.push(this.defaultYearIndex);
        this.defalutArr = arr;

        //设置查询团队目标还是个人目标
        let teamOrPerson = localStorage.getItem('teamOrPerson') || '';
        Vue.set(this.goalFilter, 'teamOrPerson', teamOrPerson);
        localStorage.setItem('teamOrPerson',teamOrPerson);


        //设置默认团队
        let defaultTeamId = localStorage.getItem("defaultTeamId");
        if (defaultTeamId) {
          Vue.set(this.goalFilter, 'defaultTeamId', defaultTeamId);
          localStorage.setItem('defaultTeamId', defaultTeamId);
        }
      },
      getHeaderInfo() {
        // 获取头部筛选条件
        let option = {
          data: {
            teamOrPerson: this.goalFilter.teamOrPerson
          },
          success: (result) => {
            this.personInfo = Object.assign({},result);
            let teamList = this.personInfo.teamList;

            //判断返回的是个人目标还是团队目标
            Vue.set(this.goalFilter,'teamOrPerson', result.selectGoal);
            localStorage.setItem("teamOrPerson",result.selectGoal);

            if(!this.goalFilter.defaultTeamId){

              if (teamList.length > 0) {
                let defaultTeam = teamList[0];
                let defalutTeamId = teamList[0].id;
                Vue.set(this.goalFilter, 'defaultTeamId',defalutTeamId);
              }
            }
            localStorage.setItem('defaultTeamId',this.goalFilter.defaultTeamId);
            this.getDetailInfo();
          }
        }
        getfilter(option);
      },
      getDetailInfo() {
        // 获取目标详情
        let option = {
          data: {
            teamId: this.goalFilter.defaultTeamId,
            goalType: this.goalFilter.goalType ,
            goalYear: this.goalFilter.year,
            teamOrPersonType: this.goalFilter.teamOrPerson
          },
          success: (result) => {
            // 默认值
            let defaultDetail = {
              goalAmount: '0',
              teamHasGoalType: '',
              goalTypeName: '商机赢单金额',
              completionRate: '0%',
              stageAmount: 0,
              stageFinishedAmount: 0,
              series: [
                  {
                      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      name: '已完成'
                  },
                  {
                      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      name: '目标'
                  }
              ],
              stageVOs: [
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'1月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'2月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'3月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'4月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'5月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'6月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'7月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'8月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'9月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'10月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'11月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'12月'}
              ],
              shareVOS: [
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'1月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'2月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'3月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'4月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'5月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'6月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'7月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'8月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'9月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'10月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'11月'},
                { completionRate: '0%', finishedAmount: 0,stageAmount: 0,stageName:'12月'}
              ],
              countType: COUNT_MONTH
            }
            let detail = result.detail || {};
            let goalTypeCount = 0;
            let goalTypeName = detail.goalTypeName;

            Vue.set(this,'goalDetail',Object.assign({},defaultDetail,detail));

            if(this.goalDetail.teamHasGoalType){
              goalTypeCount = this.goalDetail.teamHasGoalType.split(',').length;
              // this.canChangeBC = goalTypeCount > 1 ? true :false;
            }

            this.canChangeBC = goalTypeCount > 1 ? true :false;


            // 判断以月为单位 还是以季为单位
            let countTypeName = this.goalDetail.countType === COUNT_MONTH ? '月': '季';
            this.highChartsOption.xAxis.title.text = `单位：${countTypeName}`;


            this.tableData = this.goalFilter.teamOrPerson === 'person' ? this.goalDetail.shareVOS : this.goalDetail.stageVOs;

            




            this.highChartsOption.series[0].data = this.goalDetail.series[1].data;

            this.highChartsOption.series[1].data = this.goalDetail.series[0].data;
            let currentMonth = new Date().getMonth() + 1;
            let currentQuarter = this.getQuarter(currentMonth);
            let currentStep = this.goalDetail.countType === COUNT_MONTH ? currentMonth : currentQuarter;

            let zones = [{
                value: currentStep - 1,
                color: '#468CEB'
            },{
                value: currentStep,
                color: "#0F4497",
            }];


            this.highChartsOption.series[1].zones = zones;
            this.$refs.hightChart.inintChart();
            // 设置查询商机目标还是合同目标
            this.goalTypeBC.forEach((currentValue,index) => {
              if(currentValue.typeName === goalTypeName){
                Vue.set(this.goalFilter,'goalType',currentValue.type);
              }
            });
            this.countType = this.goalDetail.countType;
            this.goalId = this.goalDetail.id;

          }
        };
        getGoalInfo(option);
      },
      arrowReset(){
        this.arrowDirection_arr.forEach((currentValue,index) => {
          Vue.set(this.arrowDirection_arr, index, 'down');
        })
      },
      closeMask() {
        this.arrowReset();
        this.showOptionList = false;
        this.showTeamOrPersonList = false;
        this.showTeamList = false;
      },
      pickTime() {
        this.arrowReset();
        this.showBCoption = false
        this.showOptionList = false;
        this.showTeamOrPersonList = false;
        this.showTeamList = false;
        Vue.set(this.arrowDirection_arr,0,'up');
        // 显示picker
        this.$nextTick(function() {
          let pick = this.$refs.picker;
          pick.show();
        })
      },

      handleSelect(args){
        // 获取年份信息
        let year = args[2][0];
        if(year){
          this.goalFilter.year = year;
          localStorage.setItem('defaultYear',year);
        }
        Vue.set(this.arrowDirection_arr,0,'down');
        Vue.set(this.goalFilter, 'goalType', '');
        this.getDetailInfo();
      },
      cancelPicker(){
        Vue.set(this.arrowDirection_arr,0,'down');
      },


      pickGoalType(){
        // 选择目标类型
        if(this.arrowDirection_arr[1] === 'up'){
          this.showOptionList = false;
          this.showTeamOrPersonList = false;
          this.arrowReset();
        }else{
          this.showOptionList = true;
          this.showTeamOrPersonList = true;
          this.showTeamList = false;
          this.showBCoption = false;
          this.arrowReset();
          Vue.set(this.arrowDirection_arr,1,'up');
        }
      },
      selectTeamOrPerson(teamOrPerson) {
        // 设置当前是团队目标还是个人目标，加入缓存，关闭选项列表 请求头部筛选信息
        Vue.set(this.goalFilter,'teamOrPerson',teamOrPerson);
        localStorage.setItem('teamOrPerson',teamOrPerson);
        Vue.set(this.goalFilter, 'goalType', '');
        this.showTeamOrPersonList = false;
        this.showOptionList = false;
        this.arrowReset();
        this.getHeaderInfo();
        // this.getDetailInfo();
      },
      pickTeam(){
        if(this.arrowDirection_arr[2] === 'up'){
          this.showOptionList = false;
          this.showTeamList = false;
          this.arrowReset();
        } else {
          this.showTeamOrPersonList = false;
          this.showOptionList = true;
          this.showTeamList = true;
          this.showBCoption = false;
          this.arrowReset();
          Vue.set(this.arrowDirection_arr,2,'up');
        }

      },
      selectTeam(teamId){
        Vue.set(this.goalFilter,'defaultTeamId',teamId);
        localStorage.setItem('defaultTeamId',teamId);
        Vue.set(this.goalFilter, 'goalType', '');
        this.showTeamList = false;
        this.showOptionList = false;
        this.arrowReset();
        this.getDetailInfo();
      },
      pickBCopiton(){
        // 如果有2种类型的数据才让他选择
        if(this.arrowDirection_arr[3] === 'up'){
          this.showBCoption = false;
          this.arrowReset();
        } else {
          if(this.canChangeBC){
            Vue.set(this.arrowDirection_arr,3,'up');
            this.showBCoption = true;
          }
        }


      },
      removeMask() {
        this.showBCoption = false;
        this.arrowReset();
      },
      selectBC(type) {
        // 选择目标类型（商机、合同目标）
        Vue.set(this.goalFilter, 'goalType',type);
        this.getDetailInfo();
        this.showBCoption = false;
        this.arrowReset();
      },

      // 跳转成员目标详情
      goDetail(){
        this.$router.push({
          path: '/memberGoal',
          query:{
            goalYear: this.goalFilter.year,
            countType: this.countType,
            teamId: this.goalFilter.defaultTeamId,
            goalType: this.goalFilter.goalType
          }
        })
      },

      // 跳转成员目标分配
      openDialog(){
        this.dialogConfig.show = true;
        this.showOptionList = false;
        this.showTeamOrPersonList = false;
        this.showTeamList = false;
        this.showBCoption = false;
      },

      getQuarter(month) {
        let quarter = Math.floor((month % 3 === 0 ? (month /3):(month/3 + 1)));
        return quarter;
      }
    },
    components: {
      timePicker,
      XChart,
      dialogMask
    }
  }
</script>

<style scoped>
.c666{
  color: #666 !important;
}
.crm_goal_filter{
   position: absolute;
   top: 0;
   left: 0;
   z-index: 9;
   width: 100%;
   height: 4rem;
   background-color: #fff;
 }
 .crm_goal_filter .crm_filter_wrap{
   display: flex;
   display: -webkit-flex;
   height: 4rem;
 }
 .crm_goal_filter .crm_filter_wrap .crm_filter_item{
   flex: 1;
   text-align: center;
 }
 .crm_operation{
   width: 3.5rem;
   position: relative;
   display: flex;
   align-items: center;
   margin-left: 0.5rem;
   cursor: pointer;
 }

  .crm_operation::before{
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    height: 2rem;
    margin-top: -1rem;
    border-left: 1px solid #E5E5E5;
    transform: scaleX(0.5);
    transform-origin: 0 0;
  }
  .crm_operation .crm_opartion_icon{
    display: inline-block;
    height: 1.2rem;
    width: 1.8rem;
    margin: 0 1rem;
    background-image: url('../../../assets/images/icon_crmmb_more.png');
    background-size: 1.8rem 1.2rem;
    background-repeat: no-repeat;
  }

 .crm_goal_filter .item_content_wrap{
   display: flex;
   display: -webkit-flex;
   align-items: center;
   justify-content: center;
   height: 4rem;
   font-size: 1.2rem;
 }
 .crm_goal_filter .item_content_wrap .item_content{
    position: relative;
    display: inline-block;
    color: #333;
    box-sizing: border-box;
 }
 .crm_goal_filter .item_content .teamName{
   display: inline-block;
   overflow: hidden;
   white-space: nowrap;
   text-overflow: ellipsis;
   width: 6rem;
   vertical-align: bottom;
 }

 .crm_goal_container{
     overflow: auto;
     height: -webkit-fill-available;
     height: fill-available;
 }

 .crm_goal_container.overflow_hidden{
     overflow: hidden;
 }

 .item_content .arrow{
   display: inline-block;
   width: 1rem;
   height: 1rem;
   background-image: url('../../../assets/images/icon_down_gray.png');
   background-repeat: no-repeat;
   background-size: 1rem 0.7rem;
   background-position-y: center;
   margin-left: 3px;
 }

 .item_content .arrow_up{
   transform: rotate(180deg);
 }
 .crm-goal_filterListCon{
   max-height: 19rem;
   overflow: auto;
 }
 .crm-goal_filterListCon .filter_list{
   background-color: #fff;
   padding-left: 1.5rem;
 }

 .crm_goal_dataBoard .title_selectorList{
   background-color: #fff;
   padding-left: 1rem;
   box-shadow: 0px 2px 10px #ccc;
   border-radius: 3px;
 }

 .filter_list .list_item,
 .title_selectorList .list_item{
   display: flex;
   align-items: center;
   height: 3.5rem;
   color: #333;
   font-size: 1.2rem;
 }

  .filter_list .list_item:last-child::after,
  .title_selectorList .list_item:last-child::after{
    display: none;
  }

  .filter_list .list_item.active,
  .title_selectorList .list_item.active{
    color: #467DB9;
  }
  .filter_list .list_item.active::before{
    right: 1.65rem;
  }
  .title_selectorList .list_item.active::before{
    right: 0.65rem
  }

  .filter_list .list_item.active::before,
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


  .filter_list .list_item .item_text{
    width: 20rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .crm_goal_dataBoard{
    padding: 1rem 2rem;
    margin: 5rem 0 1rem;
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
    z-index: 9;
    top: 3rem;
    right: -8.5rem;
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
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    background: rgba(37, 38, 45, .4);
  }
  .progressbar{
    margin: 2.5rem 0 0;
    width: 100%;
    background-color: #EFEFEF;
    border-radius: 5px;
  }
  .progressbar .progressbar_inner{
    width: 2rem;
    height: 0.65rem;
    max-width: 100%;
    background-color: #468CEB;
    border-radius: 5px;
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
  .crm_goal_dataShowPanel{
    padding: 1rem 1.25rem;
    background-color: #fff;
  }
  .crm_goal_dataShowPanel .illustrates{
    display: flex;
    font-size: 1rem;
    color: #666;
  }
  .crm_goal_dataShowPanel .illustrates_left{
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .crm_goal_dataShowPanel .illustrates_left span{
    color: #333333;
  }
  .crm_goal_dataShowPanel .illustrates_right{
    color: #5077AA;
    cursor: pointer;
  }
  .crm_goal_dataShowPanel .illustrates_right::after{
    content: '';
    display: inline-block;
    background-image: url('../../../assets/images/icon_right_blue.png');
    width: 1rem;
    height: 1rem;
    margin-left: 0.2rem;
    background-size: 0.7rem 1rem;
    background-repeat: no-repeat;
    background-position: center;
    vertical-align: middle;
  }
  .crm_goal_dataShowPanel .table_container{
      margin-top: 1rem;
  }
  .crm_goal_dataShowPanel .table_container .table{
    width: 100%;
    border-collapse: collapse;
  }
  .crm_goal_dataShowPanel .table td{
    text-align: center;
  }

  .table,
  .table tr th,
  .table tr td {
    border:1px solid #E8E8E8;
  }
  .table tr th {
    background-color: #D8E2ED;
    color: #666666;
    font-size:1rem;
    font-weight: 400;
    line-height: 2.8rem;
  }
  .table tr td{
    line-height: 3rem;
    font-size: 1.2rem;
    color: #333;
  }
  .qwui-border_bottom:after {
    transform-origin: 0 0;
  }
.illustrates_left .item_title{
  display: flex;
  align-items: center;
}
</style>
