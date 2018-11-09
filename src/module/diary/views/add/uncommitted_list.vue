<template>
  <div>
    <div class="qwui-uncommitted_list" v-for="(item,index) in loadMore.padeConfig.pageData">
        <router-link :to="{name: 'add', query: { unCommitted: 1, diaryTypeId:item.diaryId, personId:item.personId, countDay:item.countDay.substring(0,10)}}">
        <div class="qwui-uncommitted_list_item">
              <p class="qwui-uncommitted_list_item_title">{{item.title?getFormatTitle(item.title, item.countDay):item.name}}</p>
              <p class="qwui-uncommitted_list_item_description">
                {{getFormatTime(item.countDay, item.rate)}}的[{{item.name}}]未提交
              </p>
        </div>
        </router-link>
    </div>
  <!--加载状态-->
  <load_more :loadmore="loadMore" describeWord="i18n.diaryTotal" @showMsgFromLoadMore="getData"></load_more>
  </div>
</template>
<script>
  import add from '../../js/add'
  import load_more from '@/components/base/load_more';
  import * as timeUtil from '../../../../assets/js/time-util';
  export default {
    data() {
      return {
        loadMore: add.unCommitted.loadMore,
        list:[],//补交列表
        ruleName: '',
        rate:0
      }
    },
    created:function () {
    },
    methods:{
      getData:function (val) {
      },
      //格式化标题
      getFormatTitle:function (title,day) {
        day=day.replace('-','/').replace('-','/').substring(0,19);
        return title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(day),"yyyyMMdd"));
      },
      //格式化时间
      getFormatTime:function(time, rate){
        var countDay = time.split(" ")[0];
        countDay = countDay.replace('-','/').replace('-','/');
        var currentDate = timeUtil.changeFormat(new Date(countDay),"yyyy-MM-dd").split("-");
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
    },
    components:{load_more}
  }
</script>
<style>
  .qwui-uncommitted_list_item{
    position: relative;
    overflow: hidden;
    padding: 10px 15px;
    line-height: 1.4;
    font-size: 16px;
    background-color: white;
  }
  .qwui-uncommitted_list_item:before{
    content: " ";
    position: absolute;
    left: -3%;
    top: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-uncommitted_list_item_title{color: #333;}
  .qwui-uncommitted_list_item_description{
    font-size: 13px;
    color: #999999;
    line-height: 1.5;
  }
</style>
