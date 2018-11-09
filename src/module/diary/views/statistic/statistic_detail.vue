<template>
  <div v-show="pageControl">
    <div v-if="isHasData">
      <!--  头部  -->
      <div class="qwui-statistic_detail_title">
        <span class="time">{{getFormatTime(date,rate)}}</span>
        <span class="description">{{typeName}}</span>
      </div>

      <!--  tab  -->
      <menu_tab :selectdata="detailNav" @listenTabChange="loadTabChange"></menu_tab>

      <!--  显示人员  -->
      <div class="qwui-user_select_item">
        <div class="qwui-user_select_list">
          <ul>
            <li v-for="(list,i) in (detailNav.index==0 ? submit.date : unSubmit.date)" v-if="i<15 || isExpand" class="qwui-statistic_person_list">
              <p class="img" @click.stop.prevent="showPersonDetail(list,$event.target)">
                <img :src="list.headPic!='0' && list.headPic!=''? list.headPic:defaultHeadPic" />
              </p>
              <p class="qwui-user_select_person">{{list.personName}}</p>
              <div class="qwui-ask_mask" v-if="list.askStatus == 1">请假</div>
            </li>
          </ul>
        </div>
        <div class="qwui-user_select_person_open" v-if="(detailNav.index==0 ? submit.personNum : unSubmit.unSubmitPersonNum)>15" @click="isExpand = !isExpand">
          <span>{{isExpand?'收起':'展开'}} {{detailNav.index==0 ? submit.personNum : unSubmit.unSubmitPersonNum}} 人</span>
          <a class="click_icon" :class="{'click_icon_up': isExpand}"></a>
        </div>
        <div v-if="(detailNav.index==0 ? submit.personNum : submit.unSubmitPersonNum) == 0">
          <p class="qwui-statistic_no_person">
            <span v-if="detailNav.index==0">没有提交人员</span>
            <span v-else>没有未提交人员</span>
          </p>
        </div>
      </div>

      <!--  底部按钮  -->
      <flow_button :buttondata="buttonConfig"></flow_button>
      <!--  底部按钮高度  -->
      <div class="qwui-statistic_detail_button_height" ></div>

      <!--个人信息-->
      <user_info ref="loadPersonalMsg" @getNewHeadPic="getNewHeadPic"></user_info>
    </div>
    <div v-else>
      <no_record :hasrecord="noRecord" ></no_record>
    </div>
  </div>
</template>
<script>
  import statistic from '../../js/statistic'
  import menu_tab from '@/components/button/menu_tab_two';
  import flow_button from '@/components/button/flow_button';
  import * as timeUtil from '../../../../assets/js/time-util';
  import no_record from '@/components/base/no_record'
  import user_info from '@/components/detail/user_info_card';//个人信息
  export default {
    data() {
      return {
        detailNav: statistic.detail.detailNav,
        buttonConfig:statistic.detail.buttonConfig,
        noRecord:statistic.noRecord,
        submit:{}, //缓存接口的数据
        unSubmit:{},
        isLoadSubmit:false,//是否已经调用过请求接口
        isLoadUnSubmit:false,
        isExpand:false, //展开 收起
        ruleName: '', //当前路由的数据
        date:'',
        rate:'',
        typeName:'',
        currentDay:[],//缓存规则(上一页，下一页控制时间是需要)
        isHasData: true,//判断是否有数据,来控制显示
        pageControl:false,//在加载完数据之后页面再显示
        tempHeadPic:'',//缓存的头像点击元素
        defaultHeadPic: require('../../../../assets/images/touxiang02.png')//没有头像时的默认头像
      }
    },
    created:function () {
      var self = this;
      //赋值参数
      self.detailNav.index = self.$route.query.type;
      self.date = self.$route.query.date;
      self.typeName= self.$route.query.typeName;
      self.detailNav.nav.forEach(function (e) {
        e.data.ruleId = self.$route.query.ruleId;
        e.data.date = self.$route.query.date;
        //e.data.status = self.$route.query.rate;//这个status不知道用途
        e.num = '';
      })
      //加载数据
      self.getStatisticDetail();
      self.noRecord.operation.callBack = self.toSetRules;
    },
    methods:{
      //点击头像 显示详情
      showPersonDetail:function (data,e){
        this.$refs.loadPersonalMsg.showUserMessage(data,true);
        this.tempHeadPic = e;
      },
      //从user_info_card传来的新头像url
      getNewHeadPic:function (headPic) {
        this.tempHeadPic.src = (headPic&&headPic!="0")?headPic:this.tempHeadPic.src;
      },
      //跳转到规则设置
      toSetRules:function () {
        this.$router.push({
          path: '/rule',
        })
      },
      //赋值底部按钮
      setFlowButton:function (tempData) {
        if(tempData.pageStatus == 1){   //pageStatus：1代表没下一页 2代表没上一页 0代表正常 3代表都没有
          this.buttonConfig.defaultList =[{type:"default",name:'上一天', callBack:this.lastPage},{type:"default",name:'下一天', callBack:null, unOperation:true}]
        } else if(tempData.pageStatus == 2){
          this.buttonConfig.defaultList =[{type:"default",name:'上一天', callBack:null, unOperation:true},{type:"default",name:'下一天', callBack:this.nextPage}]
        } else if(tempData.pageStatus == 3){
          this.buttonConfig.defaultList =[{type:"default",name:'上一天', callBack:null, unOperation:true},{type:"default",name:'下一天', callBack:null, unOperation:true}]
        } else{
          this.buttonConfig.defaultList =[{type:"default",name:'上一天', callBack:this.lastPage},{type:"default",name:'下一天', callBack:this.nextPage}]
        }
        if(tempData.rate == 1){ //rate表示不同规则
          this.buttonConfig.defaultList[0].name='上一天';
          this.buttonConfig.defaultList[1].name = '下一天';
        } else if(tempData.rate == 2) {
          this.buttonConfig.defaultList[0].name='上一周';
          this.buttonConfig.defaultList[1].name = '下一周';
        } else if(tempData.rate == 3) {
          this.buttonConfig.defaultList[0].name='上一月';
          this.buttonConfig.defaultList[1].name = '下一月';
        }
        if(this.detailNav.index == 1){
          if(tempData.recordRemind == 1){
            this.buttonConfig.defaultList.splice(1, 0 , {type:"default",name:'提醒未提交', callBack:null, unOperation:true})
          }else {
            this.buttonConfig.defaultList.splice(1, 0 , {type:"default",name:'提醒未提交', callBack:this.sendRemind})
          }
        }
      },
      //上一页
      lastPage:function () {
        var temp = '';
        if(this.rate == 1){
          temp = this.getEveryDayData(this.date, "pre")
        } else if(this.rate == 2){
          temp = this.getWeekData(this.date, "pre")
        } else {
          temp = this.getMonthData(this.date, "pre")
        }
        this.$router.push({
          path: '/statisticDetail',
          query: { ruleId: this.$route.query.ruleId, date:temp, type:this.$route.query.type, typeName:this.$route.query.typeName}
        })
        location.reload();//重新加载
      },
      //下一页
      nextPage:function () {
        var temp = '';
        if(this.rate == 1){
          temp = this.getEveryDayData(this.date, "next")
        } else if(this.rate == 2){
          temp = this.getWeekData(this.date, "next")
        } else {
          temp = this.getMonthData(this.date, "next")
        }
        this.$router.push({
          path: '/statisticDetail',
          query: { ruleId: this.$route.query.ruleId, date:temp, type:this.$route.query.type, typeName:this.$route.query.typeName}
        })
        location.reload();
      },
      //获取每天上下一天
      getEveryDayData:function(dateTime,type){
        var date= dateTime.split(" ")[0];
        var currentSecond = Date.parse(date); //将日期转化为毫秒数
        var dayTime = 24*60*60*1000; //一天的毫秒数
        var dataDate = "";
        if(type == "pre"){
          dataDate = timeUtil.changeFormat(new Date(currentSecond - dayTime),"yyyy-MM-dd");
        }
        else if(type == "next"){
          dataDate = timeUtil.changeFormat(new Date(currentSecond + dayTime),"yyyy-MM-dd");
        }
        var tempArray = this.currentDay.split(",");
        for(var i=0;i<tempArray.length;i++){
          var date1 = new Date(dataDate);
          var week = date1.getDay();
          if(this.currentDay.indexOf(week)==-1){
            if(type == "pre"){
              date1 = new Date(Date.parse(date1) - dayTime);
            }else if(type == "next"){
              date1 = new Date(Date.parse(date1) + dayTime);
            }
            week = date1.getDay();
            dataDate = timeUtil.changeFormat(new Date(date1),"yyyy-MM-dd");
          }
        }
        return dataDate+" 00:00:00";
      },
      //获取每周上下一周
      getWeekData:function(dateTime,type){
        var date= dateTime.split(" ")[0];
        var currentSecond = Date.parse(date); //将日期转化为毫秒数
        var dayTime = 24*60*60*1000; //一天的毫秒数
        var dataDate = "";
        if(type == "pre"){
          dataDate = timeUtil.changeFormat(new Date(currentSecond - 7*dayTime),"yyyy-MM-dd");
        }
        else if(type == "next"){
          dataDate = timeUtil.changeFormat(new Date(currentSecond + 7*dayTime),"yyyy-MM-dd");
        }
        return dataDate+" 00:00:00";
      },
      //获取每月上下一个月
      getMonthData:function(dateTime,type){
        var date= dateTime.split(" ")[0];
        var currentDate = new Date(date);
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth()+1;
        var dataDate = "";
        if(type == "pre"){
          if(month - 1 <= 0){
            year--;
            month = 12;
          }
          else{
            month--;
          }
          dataDate = year+"-"+(month<10?"0"+month:month)+"-01";
        }
        else if(type == "next"){
          if(month + 1 > 12){
            year++;
            month = 1;
          }
          else{
            month++;
          }
          dataDate = year+"-"+(month<10?"0"+month:month)+"-01";
        }
        return dataDate+" 00:00:00";
      },

      //导入数据
      getStatisticDetail:function () {
        var self = this;
        _.showLoading();
        _.ajax({
          url: _.baseURL + statistic.detail.url,
          type: 'POST',
          data:self.detailNav.nav[self.detailNav.index].data,
          success: function (result) {
            self.pageControl = true;
            if (result.code == "0") {
              if(self.detailNav.index == 0){
                self.submit = result.data;
                self.isLoadSubmit = true;
              }else{
                self.unSubmit = result.data;
                self.isLoadUnSubmit = true;
              }
              if(result.data.currentDay){
                self.currentDay = result.data.currentDay;
              }
              self.rate = result.data.rate;
              self.setFlowButton(result.data);
              if(result.data.personNum == 0 && result.data.unSubmitPersonNum == 0){
                self.isHasData = false;
              } else{
                self.isHasData = true;
              }
              self.detailNav.nav[0].num = '('+result.data.personNum +')';
              self.detailNav.nav[1].num = '('+result.data.unSubmitPersonNum +')';
            } else {
              _.alert('提示', result.desc);
            }
            _.hideLoading();
          }
        })
      },
      //切换未提醒和已提醒
      loadTabChange:function(item,index){
        if((index == 0 && this.isLoadSubmit)||(index == 1 && this.isLoadUnSubmit)){
        }else {
          this.getStatisticDetail();
        }
        if(index == 0 && this.buttonConfig.defaultList.length == 3){
          this.buttonConfig.defaultList.splice(1,1)
        }else if(index == 1 && this.buttonConfig.defaultList.length == 2){
          if(this.submit.recordRemind == 1){
            this.buttonConfig.defaultList.splice(1, 0 , {type:"default",name:'提醒未提交', callBack:null, unOperation:true})
          }else {
            this.buttonConfig.defaultList.splice(1, 0 , {type:"default",name:'提醒未提交', callBack:this.sendRemind})
          }
        }
      },
      //提醒未提交
      sendRemind:function () {
        var self = this;
        _.ajax({
          url: _.baseURL + statistic.detail.sendRemindUrl,
          type: 'POST',
          data:{
            ruleId: self.$route.query.ruleId,
            date: self.$route.query.date,
            personIds: self.unSubmit.date.map(value=>{
              return value.userId
            }).join('|'),
          },
          success: function (result) {
            if (result.code == "0") {
              _.tooltips_succeed('已发送提醒');
              self.buttonConfig.defaultList.splice(1,1)
              self.buttonConfig.defaultList.splice(1, 0 , {type:"default",name:'提醒未提交', callBack:null, unOperation:true})
            } else {
              _.alert('提示', result.desc);
            }
          }
        })
      },
      //页面顶部信息：时间的转化
      getFormatTime:function(time, rate){
        var countDay = time.split(" ")[0];
        var currentDate = timeUtil.changeFormat(new Date(countDay),"yyyy/MM/dd").split("/");
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
    components:{menu_tab,flow_button,no_record,user_info}
  }

</script>
<style>
  .qwui-statistic_detail_title{
    position: relative;
    margin-bottom: 10px;
    padding: 12px 0 12px 12px;
    background-color: #fff;
  }
  .qwui-statistic_detail_title .time {
    font-size: 16px;
    color: #333;
  }
  .qwui-statistic_detail_title .description{
    display: inline-block;
    width: 140px;
    margin-left: 10px;
    font-size: 13px;
    color: #999;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: text-bottom;
  }
  .qwui-statistic_person_list{
    width:57px!important;
  }
  .qwui-statistic_no_person{
    text-align: center;
    line-height: 36px;
    color: #999999;
    background: #fff;
  }
  .qwui-ask_mask{
    position: absolute;
    top: 0;
    left: 6px;
    width: 45px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    color: #fff;
    background: rgba(0,0,0,0.5);
  }
  .qwui-statistic_detail_button_height{
    height:60px
  }
</style>
