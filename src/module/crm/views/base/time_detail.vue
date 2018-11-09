<template>
  <div class="qwui-time_detaildata">
    <div class="qwui-time_item">
      <div class="qwui-title_common_text">填写日期<span class="qwui-title_tip">*</span></div>
        <group class="qwui-flexItem">
          <datetime v-model="minuteListValueS" 
          :clear-text="$t('i18n.today')" 
          @on-clear="setTodayS" format="YYYY-MM-DD HH:mm" 
          @on-change="change"  
          year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分" 
          :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
          </datetime>
        </group>
    </div>
  </div>
</template>

<script>
import Datetime from 'vux/src/components/datetime';
import Group from 'vux/src/components/group';
import * as timeUtil from '@/assets/js/time-util';


export default {
  name: 'timeDetail',
  props:["dataDetailMsg"],
  data(){
    return {
        minuteListValueS: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm'),
        minuteListValueE: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd') + ' 22:00',
        resetLimitDate: ''
    }
  },
  watch: {
    dataDetailMsg: function (val) { // 草稿编辑页面使用，传入草稿旧数据
      this.minuteListValueS = val[0].substring(0,16);
      this.minuteListValueE = val[1].substring(0,16);
    },
    minuteListValueS: function (val) {
      this.resetLimitDate = val.substring(0,10);
    }
  },
  components:{Datetime, Group},
  methods: {
    change (value) {
      this.$emit("listenToChild", this.minuteListValueS, this.minuteListValueE)
    },
    setDate (value) {
      let now = new Date()
      let cmonth = now.getMonth() + 1
      let day = now.getDate()
      let hour = now.getHours()
      let minute = now.getMinutes()
      if (cmonth < 10) cmonth = '0' + cmonth
      if (day < 10) day = '0' + day
      if (hour < 10) hour = '0' + hour
      if (minute < 10) minute = '0' + minute
      return now.getFullYear() + '-' + cmonth + '-' + day + ' ' + hour + ':' + minute
    },
    setTodayS (value) {
       this.minuteListValueS = this.setDate();
    },
    setTodayE (value) {
       this.minuteListValueE = this.setDate();
    }
  }
}

</script>

<style type="text/css">
.qwui-time_detaildata{padding-left:15px;background-color:#fff;}
.qwui-title_common_text{
  font-size: 13px;
  color: #666;
  font-weight: 500;
}
.qwui-time_item{
  position: relative;
  min-height: 19px;
  padding: 0;
  color: #333;
  font-size: 14px;
  line-height: 22px;
  background: #fff;
  padding: 10px 14px 0 0;
}
.qwui-time_item:after{
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
.qwui-title_tip{
  color: #FF1515;
}
.vux-cell-value {
  color: #999;
  float: left;
}
.vux-no-group-title{
  margin: 0!important;
}
.weui-cells .weui-cell{
  padding-left: 0!important;
}
.weui-cells:before{
  border-top: none!important;
}
.weui-cells:after{
  border-bottom: none!important;
}
.weui-cells{
  font-size: 16px!important;
}
.qwui-time_item:first-child:after{
  border: none;
}
.vux-no-group-title p{
    font-size: 13px;
    color: #666;
    font-weight: 500;
}
.qwui-title_time_tip{
  color: red;
  float: left;
  position: absolute;
  top: .92rem;
  left: 4.35rem;
}
.weui-cell_access .weui-cell__ft:after {
    display:none !important;
}
</style>
