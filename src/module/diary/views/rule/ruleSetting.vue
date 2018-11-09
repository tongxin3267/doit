<template>
  <div>
    <div v-if="rule">
      <div class="statistics_title qwui-border_bottom">{{ruleName}}</div>
      <div class="qwui-detaildata">
        <div class="qwui-inner_f_item qwui-flexbox">
          <span class="qwui-item_title">提交周期</span>
          <i class="icon-problem" @click="submitRange()"></i>
          <div class="qwui-flexItem">
            <select class="qwui-flexItem qwui-item_select" v-model="rate" :disabled="rule.ruleId!=='0'">
              <option :value="index" v-for="(item,index) in rateRange">{{item}}</option>
            </select>
          </div>
        </div>

        <div class="qwui-inner_f_item qwui-flexbox" v-if="rate==1">
          <span class="qwui-item_title">工作日</span>
          <a href="javascript:;" class="qwui-inner_item mt15" @click="workDayShow = true">
            {{handleWorkDay}}
            <span class="qwui-click_icon qwui-click_icon_right"></span>
          </a>
        </div>

        <div class="qwui-inner_f_item qwui-flexbox">
          <span class="qwui-item_title">排除节假日</span>
          <i class="icon-problem" @click="excludeFestival()"></i>
          <div class="qwui-flexItem">
            <switch_button v-model="rule.isFestival">
            </switch_button>
          </div>
        </div>
        <rule_time :ruleId="rule.ruleId"></rule_time>
      </div>

      <p class="lastTimeTip">{{lastTimeTip}} 开始统计{{description(rate)}}日志提交情况</p>

      <div class="qwui-detaildata">
        <div class="qwui-inner_f_item qwui-flexbox">
          <span class="qwui-item_title">需提交的人员</span>
          <a href="javascript:;" class="qwui-inner_item mt15" @click="personSelectShow = true">
            {{handleRange}}
            <span class="qwui-click_icon qwui-click_icon_right"></span>
          </a>
        </div>
      </div>
      <div class="qwui-separate_bar"></div>
      <div class="qwui-detaildata">
        <div class="qwui-inner_f_item qwui-flexbox">
          <span class="qwui-item_title">提交截止前1小时自动提醒</span>
          <div class="qwui-inner_item">
            <switch_button v-model="rule.isRemind"></switch_button>
          </div>
        </div>
      </div>
      <div class="qwui-separate_bar"></div>
      <div class="qwui-detaildata qwui-border_bottom">
        <div class="qwui-inner_f_item qwui-flexbox">
          <span class="qwui-item_title">启用该规则</span>
          <div class="qwui-flexItem">
            <switch_button v-model="rule.status"></switch_button>
          </div>
        </div>
      </div>
      <div class="reSetBtn qwui-border_top qwui-border_bottom"
          :class="{disabled: rule.ruleId==='0'}"
          @click="handleResetRule">
        重置规则
      </div>

      <button_group>
        <qwui_button type="default" text="取消" @buttonClick="cancelSetting"></qwui_button>
        <qwui_button type="primary" text="确定" @buttonClick="submitRuleData"></qwui_button>
      </button_group>

      <select_person
        :boxShow.sync="personSelectShow"
        :options="rangeConfig"
        :checked="rang"
        @confirmSelected="confirmSelectPerson">
      </select_person>
    </div>

    <workDay_box
      :boxShow.sync="workDayShow"
      :checkedData="checkedWorkday"
      v-if="workDayShow"></workDay_box>

    <!--底部弹窗-->
    <dialog_mask_bottom :dialogConfig="dialogResetRule">
    </dialog_mask_bottom>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom';
  import switch_button from '@/components/form/switchBtn'
  import {qwui_button, button_group} from '@/components/base/button'
  import rule_time from './components/time'
  import workDay_box from './components/select_workDay'
  import select_person from './components/select_person'
  import { getRuleSetting,addDiaryRule,delDiaryRule,showTargetRange,getLegalDate } from '../../api/getData'

  // 提交人员范围
  const RANGECONFIG = {
    '1': '所有人',
    '2': '本部门',
    '3': '特定对象'
  }
  // 周期
  const RATERANG = {
      1: '每天',
      2: '每周',
      3: '每月',
  }
  // 描述
  const DESCRIPTION = {
    1: '当天',
    2: '当周',
    3: '当月',
  }
  // 星期
  const WEEK = {
    0: '周日',
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
  }
  const WORKDAY = {
    ...WEEK,
    '1,2,3,4,5': '周一至周五',
    '1,2,3,4,5,6': '周一至周六',
    '1,2,3,4,5,0': '周一至周五; 周日',
    '0,1,2,3,4,5': '周一至周五; 周日',
    '1,2,3,4,5,6,0': '周一至周日',
    '0,1,2,3,4,5,6': '周一至周日'
  }
  // 规则默认数据
  const DEFAULTRULE = {
    ruleId:'0',
    rate:1,
    status:0,
    personIds:'',
    deptIds:'',
    currentDay:'1,2,3,4,5',
    lastTime:1000,
    isFestival:0,
    isRemind:0,
    rang:2,
  }

  export default {
    name: "rule-setting",
    data(){
      return {
        dataBase,
        rule: null,
        initRuleId: this.$route.params.ruleId,
        ruleName: this.$route.params.ruleName,
        diaryId: this.$route.params.diaryId,
        workDayShow: false,         // 工作日选择
        personSelectShow: false,    // 选人
        dialogResetRule: { // 点状重置弹窗
          show: false,
          title: '重置规则会清空设置并删除所有统计历史数据，是否重置？',//头部标题
          btnConfig: [{
              primary: true,
              title: '确定重置',
              callBack: this.resetRule
            },
            {
              title: '取消',
            }]
        },
        ruleDescription:DESCRIPTION,
        rateRange: RATERANG,
        week: WEEK,
        rangeConfig:RANGECONFIG,
      }
    },
    computed: {
      ...mapGetters(['handleLastTime','handleCurrentDay','currentDay','lastTime','rang']),
      rate:{
        get() {
          return this.$store.state.rules.rate
        },
        set(val) {
          this.$store.commit('updateRate', val)
        }
      },

      // 提示语
      lastTimeTip() {
        let rateTip = ''
        if(this.rate!=1){
          rateTip = this.rateRange[this.rate]
        }
        return rateTip + this.handleCurrentDay + this.handleLastTime
      },

      // 星期
      handleWorkDay() {
        if(WORKDAY[this.currentDay]) {
          return WORKDAY[this.currentDay]
        }
        let arr = this.currentDay.split(',')
        let str = ''
        if(arr.length===1 && !WORKDAY[this.currentDay]){
          this.$store.commit('updateCurrentDay',1)
          return WORKDAY[1]
        }
        arr.forEach(function (val) {
          str += ' '+WORKDAY[val] + '；'
        })
        return str.slice(0,-1)
      },
      // 提交人员
      handleRange(){
        return RANGECONFIG[this.rang]
      },
      checkedWorkday() {
        return this.currentDay.split(',')
      }
    },
    mounted(){
      // 获取数据
      this.initData()
      this.handleRangeConfig()
      this.dataBase.selectConfig.selectList["ccPersonList"].deptSelectedShow = true
    },
    methods: {
      //显示 提交周期提示 弹框
      submitRange:function () {
        var content = "周期设置后不能修改，如需修改请重置规则";
        var btnConfig = {
          primaryBtn: {name: "知道了", callBack: null},
          defaultBtn: {name: "", callBack: null},
        }
        _.alert('提交周期', content, btnConfig)
      },

      //显示 排除节假日提示 弹框
      excludeFestival:function () {
        var content = "<div style='text-align:left'>" ;
        var btnConfig = {
          primaryBtn: {name: "知道了", callBack: null},
          defaultBtn: {name: "", callBack: null},
        }
        getLegalDate( new Date().getFullYear(), (result) =>{
          let l = result.legalYearDateList.length;
          if(l>0){
            result.legalYearDateList.forEach(function (e,index) {
              if(e.type == "2") {
                content += (e.dateName == '' ? "• " : "• " + e.dateName + "：") +
                  (e.dateType == "1" ? e.startTime : e.startTime + "至" + e.endTime) +
                  (index + 1 < l ? "<br />" : "</div>")
              }
            })
          } else {
            content = "后台暂未设置任何法定日期，请联系管理员设置"
          }
          _.alert('法定节假日及考勤规则排除日期', content, btnConfig)
        })
      },

      initData() {
        getRuleSetting( this.initRuleId, (result) =>{
          if(result.rule) {
            this.rule = result.rule
            this.rule.ruleId = this.initRuleId
          }else {
            this.rule = Object.assign({}, DEFAULTRULE)
          }
          if(result.ccPerson) {
            this.dataBase.selectConfig.selectList["ccPersonList"].userSelected = result.ccPerson
          }
          if(result.ccDept&&result.ccDept.length>0) {
            result.ccDept.forEach(function (e) {
              e.id = e.deptId;
            })
            this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected=result.ccDept
          }
          this.$store.commit('updateRate',this.rule.rate)
          this.$store.commit('updateRang',this.rule.rang)
          this.$store.commit('updateCurrentDay',this.rule.currentDay)
          this.$store.commit('updateLastTime',this.rule.lastTime)
        })
      },

      confirmSelectPerson() {
        let deptId = ''
        let personId = ''
        this.dataBase.selectConfig.selectList["ccPersonList"].deptSelected.forEach(function (item, index) {
          deptId += item.id+'|'
        })
        this.rule.deptIds = deptId.slice(0,-1)
        this.dataBase.selectConfig.selectList["ccPersonList"].userSelected.forEach(function (item, index) {
          personId += item.userId+'|'
        })
        this.rule.personIds = personId.slice(0,-1)
      },

      handleRangeConfig() {
        showTargetRange( (isVisitAll)=>{
          if(!isVisitAll){
            this.rangeConfig = {
              '2': '本部门',
              '3': '特定对象'
            }
          }
        })
      },
      handleResetRule() {
        if(this.rule.ruleId==='0') {return}
        this.dialogResetRule.show = true
      },
      // 重置规则
      resetRule() {
        this.dialogResetRule.show = false
        delDiaryRule(this.rule.ruleId,()=>{
          this.rule.ruleId = '0'
          this.initRuleId = '0'
          this.rule = Object.assign({},DEFAULTRULE)
          this.$store.commit('updateRate',DEFAULTRULE.rate)
          this.$store.commit('updateRang',DEFAULTRULE.rang)
          this.$store.commit('updateCurrentDay',DEFAULTRULE.currentDay)
          this.$store.commit('updateLastTime',DEFAULTRULE.lastTime)
        })
      },
      // 提交规则数据
      submitRuleData() {
        let self = this
        this.confirmSelectPerson()
        if(this.handleRange == '特定对象'&&!this.rule.personIds && !this.rule.deptIds) {
           _.alert('提示', '您未选择任何部门或人')
        }else{
          this.rule = {
            ruleId: this.rule.ruleId === '0' ? '' : this.rule.ruleId,
            diaryId: this.diaryId,
            rate: this.rate,
            rang: this.rang,
            currentDay: this.currentDay,
            lastTime: this.lastTime,
            status: this.rule.status,
            personIds: this.rule.personIds,
            deptIds: this.rule.deptIds,
            isFestival: this.rule.isFestival,
            isRemind: this.rule.isRemind,
          }
          addDiaryRule(this.rule, () => {
            setTimeout(function () {
              self.$router.go(-1)
            }, 1000)
          })
        }
      },
      // 取消设置
      cancelSetting() {
        this.$router.go(-1)
      },
      //规则描述
      description(val){
        return this.ruleDescription[val]?this.ruleDescription[val]:'当天'
      }
    },
    components: {
      switch_button,
      rule_time,
      qwui_button,
      button_group,
      workDay_box,
      select_person,
      dialog_mask_bottom
    }
  }
</script>

<style>
  .mt15 {
    margin-right: 15px;
  }
  .statistics_title{
    font-size: 16px;
    padding: 15px;
    color: #333;
  }
  .lastTimeTip {
    position: relative;
    width: 100%;
    font-size: 13px;
    padding: 10px 0 22px 15px;
    color: #999;
    background-color: #f5f5f5;
    box-sizing: border-box;
  }
  .lastTimeTip:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .lastTimeTip:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .reSetBtn {
    font-size: 16px;
    text-align: center;
    padding: 12px 0;
    margin-top: 30px;
    margin-bottom: 38px;
    background-color: #fff;
    cursor: pointer;
  }
  .reSetBtn.disabled {
    color: #999;
    cursor: default;
    pointer-events: none;
  }

  .qwui-detaildata{padding-left:15px;background-color:#fff;}
  .qwui-detaildata .qwui-inner_f_item:first-child:after{border:none;}
  .qwui-item_title {
    margin-right: 10px;
    color: #333;
    font-size:16px;
  }
  .qwui-inner_f_item {
    position: relative;
    line-height: 22px;
    min-height: 19px;
    padding: 12px 15px 12px 0;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
  .qwui-inner_f_item:after{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-inner_item {
    font-size: 16px;
    flex: 1;
    color: #666;
    text-align: right;
  }
  .qwui-click_icon {
    display: block;
    position: absolute;
    top: 0;
    right: 15px;
    bottom: 0;
    margin: auto;
    width: 9px;
    height: 15px;
    background:0 0 url("../../../../assets/images/CSSSprites.png") no-repeat;
    background-size: 100px 100px;
  }
</style>
