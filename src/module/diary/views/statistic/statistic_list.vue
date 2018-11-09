<template>
  <div v-show="loadFinished">
    <div v-if="powerPermission && isHasRecord">
    <div class="qwui-statistic_top_msg_height" ></div>
    <div class="qwui-statistic_top_msg" >
      <i class="qwui-illustrate_icon" v-if="!isHistory" @click="showStatisticIllustrate(true)"></i>
      <span class="qwui-illustrate" :class="{'qwui-history': isHistory}" @click="showStatisticIllustrate(!isHistory)">{{titleMsg}}</span>
      <span class="qwui-rule" v-if="!isHistory" @click="toRules">统计规则</span>
    </div>
    <div class="qwui-statistic_list" v-for="(item, index) in list">
      <!--   首页显示   -->
      <div class="qwui-statistic_list_title" v-if="!isHistory">
        <span class="qwui-statistic_list_time" >{{getFormatTime(item.recordCountDay, item.rate)}}</span>
        <span class="qwui-statistic_list_description">{{item.name}}</span>
        <p class="qwui-statistic_list_time_interval" v-if="item.rate == 2">{{getMondayAndSunday(item.recordCountDay)}}</p>
        <a class="qwui-statistic_list_show_history" @click="loadHistory(item.id,item.name)">历史</a>
      </div>
      <!--   历史显示   -->
      <div v-else class="qwui-statistic_list_title">
        <span class="qwui-statistic_list_time">{{getFormatTime(item.countDay, rate)}}</span>
        <span class="qwui-statistic_list_description" v-if="rate == 2">{{getMondayAndSunday(item.countDay)}}</span>
      </div>
      <div class="qwui-statistic_list_content">
        <span  class="qwui-statistic_list_url" @click="isHistory?toDetail(item.ruleId,item.countDay,0,item.name):toDetail(item.id,item.recordCountDay,0,item.name)">
          <p class="qwui-statistic_list_statistics_msg" v-if="!isHistory">{{item.recordSubmit}}</p>
          <p class="qwui-statistic_list_statistics_msg" v-else>{{item.submit}}</p>
          <span>已提交</span>
        </span>
        <span  class="qwui-statistic_list_url" @click="isHistory?toDetail(item.ruleId,item.countDay,1,item.name):toDetail(item.id,item.recordCountDay,1,item.name)">
          <p class="qwui-statistic_list_statistics_msg" v-if="!isHistory">{{item.recordUnSubmit}}</p>
          <p class="qwui-statistic_list_statistics_msg" v-else>{{item.unSubmit}}</p>
          <span>未提交</span>
        </span>
      </div>
    </div>
  </div>
    <!--   没有权限查看日志统计  -->
    <div v-if="!powerPermission">
      <no_record :hasrecord="noPermission"></no_record>
    </div>
    <!--   日志统计没有数据  -->
    <div v-if="!isHasRecord">
      <no_record :hasrecord="noRecord"></no_record>
    </div>
  </div>
</template>
<script>
import statistic from '../../js/statistic'
import * as timeUtil from '../../../../assets/js/time-util';
import no_record from '@/components/base/no_record'
export default {
  props:["isHistory","ruleName","historyData", "rate"],
  data() {
    return {
      titleMsg: '',
      indexList:[],
      noPermission:statistic.noPermission,
      noRecord:statistic.noRecord,
      powerPermission:true, //是否拥有权限查看统计日志
      isHasRecord:true,//是否有数据
      loadFinished:false,//加载完再显示界面
    }
  },
  components:{no_record},
  created:function () {
    if(this.isHistory){
      this.loadFinished = true;
    }else{
      this.loadStatisticList();
    }
    this.titleMsg = this.ruleName?this.ruleName:'统计说明';
    this.noRecord.operation.callBack = this.toRules;
  },
  computed: {
    list:function() {
      if(this.isHistory){
        return this.historyData
      }else{
        return this.indexList
      }
    },
  },
  methods:{
    //显示 统计说明弹窗
    showStatisticIllustrate:function (signal) {
      if(signal) {
        var content = "<div style='text-align:left'>按规则的提交频率，系统自动统计数据"+"<br />" +
          "• 工作日/每天：每天凌晨3点统计"+"<br />" +
          "• 每周：每周一凌晨3点统计"+"<br />" +
          "• 每月：每月一号凌晨3点统计</div>";
        var btnConfig = {
          primaryBtn: {name: "知道了", callBack: null},
          defaultBtn: {name: "", callBack: null},
        }
        _.alert('统计更新说明', content, btnConfig)
      }
    },
    //跳转到统计详情
    toDetail:function (id, time,type,name) {
      this.$router.push({
        path: '/statisticDetail',
        query: { ruleId: id, date:time, type:type, typeName:name}
      })
    },
    loadHistory:function(id, name){
      this.$router.push({
        path: '/historyList',
        query: { ruleId: id, ruleName:name}
      })
    },
    //跳转到规则页面
    toRules:function () {
      this.$router.push({
        path: '/rule',
      })
    },
    //首页：初始化统计列表
    loadStatisticList:function () {
      var self = this;
      _.showLoading();
      _.ajax({
        url: _.baseURL + statistic.list.url,
        type: 'POST',
        success: function (result) {
          if (result.code == "0") {
            self.indexList = result.data.data;
            self.powerPermission = result.data.powerPermission;
            self.isHasRecord = (result.data.data && result.data.data.length == 0)?false:true;
          } else {
            _.alert('提示', result.desc);
          }
          self.loadFinished = true;
          _.hideLoading();
        }
      })
    },
    getFormatTime:function(time, rate){
      var countDay = time.split(" ")[0];
      var currentDate = countDay.substring(0,10).split("-");
      var weekNum = "";
      if(rate == 1){
        return parseInt(currentDate[1])+"月"+parseInt(currentDate[2])+"日";
      }
      else if(rate == 2){
        weekNum = this.getWeekNumber(currentDate[0],currentDate[1],currentDate[2]);
        return "第"+weekNum+"周";
      }
      else if(rate == 3){
        return currentDate[0]+"年"+parseInt(currentDate[1])+"月";
      }
    },
    //获取某年的某天是第几周
    getWeekNumber:function(y, m, d) {
      var now = new Date(y, m - 1, d),
          year = now.getFullYear(),
          month = now.getMonth(),
          days = now.getDate();
      //那一天是那一年中的第多少天
      for (var j = 0; j < month; j++) {
        days += this.getMonthDays(year, j);
      }
      //那一年第一天是星期几
      var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

      var week = null;
      days -= (7 - yearFirstDay + 1);
      week = Math.ceil(days / 7) + 1;
      return week;
    },
    //判断年份是否为闰年
    isLeapYear:function(year) {
      return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
    },
    //获取某一年份的某一月份的天数
    getMonthDays:function(year, month) {
      return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (this.isLeapYear(year) ? 29 : 28);
    },
    //获取当前日期的周一和周日
    getMondayAndSunday:function(date){
      date=date.replace('-','/').replace('-','/').substring(0,19);//适配ios，ios旧版本无法识别日期中的'-'
      var currentDate = new Date(date);
      var currentSecond = Date.parse(date); //将日期转化为毫秒数
      var week = currentDate.getDay();
      var dayTime = 24*60*60*1000; //一天的毫秒数
      var Sunday = "";
      var Monday = "";
      var lastDate = "";
      if((7-week)%7 == 0){
        Sunday = timeUtil.changeFormat(currentDate,"yyyy/MM/dd").split("/");
        Monday = timeUtil.changeFormat(new Date(currentSecond-6*dayTime),"yyyy/MM/dd").split("/");
      }
      else{
        Sunday = timeUtil.changeFormat(new Date(currentSecond+(7-week)*dayTime),"yyyy/MM/dd").split("/");
        Monday = timeUtil.changeFormat(new Date(currentSecond-(week-1)*dayTime),"yyyy/MM/dd").split("/");
      }
      lastDate = parseInt(Monday[1]) + "月" + parseInt(Monday[2]) + "日 - " + parseInt(Sunday[1]) + "月" + parseInt(Sunday[2]) + "日";

      return lastDate;
    },
  }
}
</script>
<style>
.qwui-statistic_top_msg_height{
    height:44px
  }
.qwui-statistic_top_msg{
  position: fixed;
  z-index: 10;
  top: 0;
  height: 44px;
  width: 100%;
  background-color: #F5F5F5;
}
.qwui-illustrate{
  position: absolute;
  left: 36px;
  top: 16px;
  font-size: 13px;
  color: #999;
  cursor: pointer;
}
.qwui-history{
  left:14px;
}
.qwui-illustrate_icon{
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 16px 0 0 14px;
  background: url('../../../../assets/images/ic_illustrate.png')center no-repeat;
  background-size: 18px 18px;
  cursor: pointer;
}
.qwui-rule{
  display: inline-block;
  position: absolute;
  top: 15px;
  right: 10px;
  font-size: 14px;
  color:#586C94;
  cursor: pointer;
}
.qwui-statistic_list{
    margin-bottom: 10px;
    background: #fff;
  }
.qwui-statistic_list_title:before{
  content: " ";
  position: absolute;
  left: -3%;
  top: 0;
  right: 0;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.qwui-statistic_list_title{
  position: relative;
  margin-left: 3%;
  padding: 12px 0;
}
.qwui-statistic_list_time{
  font-size: 16px;
  color: #333;
}
.qwui-statistic_list_description{
  display: inline-block;
  position: relative;
  top:1px;
  width: 140px;
  margin-left: 10px;
  font-size: 13px;
  color: #999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: text-bottom;
}
.qwui-statistic_list_time_interval{
  font-size: 12px;
  color: #999;
}
.qwui-statistic_list_show_history{
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10px;
  height: 17px;
  margin: auto;
  font-size: 13px;
  color: #576b95;
  cursor: pointer;
}
.qwui-statistic_list_content{
  position: relative;
  padding: 12px 0;
  overflow: hidden;
  font-size: 14px;
  color:#999;
}
.qwui-statistic_list_url{
  display: block;
  float: left;
  width: 50%;
  box-sizing: border-box;
  border-right: 1px solid #e5e5e5;
  text-align: center;
  cursor: pointer;
}
.qwui-statistic_list_url:last-child{
  border:none;
}
.qwui-statistic_list_statistics_msg{
  margin-bottom: 5px;
  line-height: 22px;
  font-size: 22px;
  color: #333;
}
.qwui-statistic_list_title:after{
  content: '';
  position: absolute;
  left:0;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.qwui-statistic_list_content:after{
  content: '';
  position: absolute;
  left:0;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
</style>
