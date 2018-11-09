<template>
<!-- 选项卡 -->

   <div class="qwui-crm_tab">
    <div class="crm-tab">
      <span class="qwui-crm_tab_nav" v-for="(item,index) in tabs" :class="{active:index == num}" @click="tab(index)" :key="index">
          {{item}}
      </span>
    </div>
    <div class="qwui-crm_tabCon">
     <div>
        <div class="qwui-crm_tabb_content">
          <span class="qwui-crm_tabb_content_span">{{briefingVO.lastAddBusinessNum}}</span>
          <p class="qwui-crm_tabb_content_lable">新增商机</p>
        </div>
        <div class="qwui-crm_tabb_content" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.businessTurnover}}</span>
          <p class="qwui-crm_tabb_content_lable">成交金额(万元)</p>
        </div>
        <div class="qwui-crm_tabb_content" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.totalFunnelNum}}</span>
          <p class="qwui-crm_tabb_content_lable">漏斗总值(万元)</p>
        </div>
        <div class="qwui-crm_tabb_content" >
          <span class="qwui-crm_tabb_content_span">{{briefingVO.expectTurnover}}</span>
          <p class="qwui-crm_tabb_content_lable">预计成交(万元)</p>
        </div>
      </div>
    </div>
  </div>



</template>

<script>
  import { getCountBriefing,getCompanyDetailList } from '../../api/client/getData'
  export default {
    name: 'crm_tab',
    data() {
      return{
        keyword:{
          startTime:'',
          endTime:''
        },
        tabs: ["本月", "本季","本年"],
        tabContents: [{}, {}, {}], //本季和本年, 用来判断是否以及获取过数据
        briefingVO: {
          businessTurnover: 0,
          expectTurnover: 0,
          lastAddBusinessNum: 0,
          totalFunnelNum: 0
        },
        num: 0,
        date: ''
      }
    },
    created() {
      this.initDate();
      this.getDataMonth();
    },
    methods: {
      initDate() {
        var date = new Date(),
        month = date.getMonth() + 1,
        strMonth = month >= 10? month: "0" + month;
        this.date = ''+date.getFullYear()+'-'+strMonth;
      },

      // 点击本月
      getDataMonth:function() {
        this.keyword.startTime = this.date;
        this.keyword.endTime = this.date;
        getCountBriefing(this.keyword, (data)=> {
          this.briefingVO = data.briefingVO;
          this.tabContents[0] = data.briefingVO;
        })
      },
      // 点击本季度
      getQuarterMonth:function() {// 获得季度开始月份跟结束月份
        var arr = this.date.split('-'),
            year = arr[0],
            month = arr[1],
            startMonth,
            endMonth;

        if(month <=3 ){
            startMonth = '01';
            endMonth = '03';
        }else if(3 < month && month <= 6){
            startMonth = '04';
            endMonth = '06';
        }else if(6 < month && month <= 9){
            startMonth = '07';
            endMonth = '09';
        }else{
            startMonth = '10';
            endMonth = '12';
        }
        this.keyword.startTime = year + '-'+ startMonth;
        this.keyword.endTime = year + '-'+ endMonth;
        return getCountBriefing(this.keyword, (data) => {
          this.tabContents[1] = data.briefingVO;
        });
      },
      // 点击本年
      getDataYear:function() {
        var arr = this.date.split('-');
        this.keyword.startTime = ''+arr[0]+'-01';
        this.keyword.endTime = ''+arr[0]+'-12';
        arr = null;
        return getCountBriefing(this.keyword, (data) => {
          this.tabContents[2] = data.briefingVO;;
        });
      },

      // tab栏切换判断
      tab:function(index) {
        this.num = index;
        // 判断缓存
        if (index === 0 || JSON.stringify(this.tabContents[index]) != "{}") {
          this.briefingVO = this.tabContents[index];
          return ;
        }
        if(index == 1){
          this.getQuarterMonth().then(() => {
            this.briefingVO = this.tabContents[index];
          });
        } else {
          this.getDataYear().then(() => {
            this.briefingVO = this.tabContents[index];
          });
        }

      }
    }
  }

</script>

<style type="text/css" scoped>
  .wrap{
    background:#fff;
  }
  .crm-tab{
    text-align: center;
    width:72%;
    margin:0 auto;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(66,194,126,1);
  }
  .crm-tab:first-child{
    border-left:none;
  }
  .qwui-crm_tab_nav{
    display:inline-block;
    width:33.3333%;
    height:33px;
    text-align: center;
    border-left:1px solid rgba(66,194,126,1);
    font:14px PingFangSC-Regular;
    color:rgba(66,194,126,1);
    line-height:32px;
    box-sizing: border-box;
    cursor:pointer;
  }
  .active{
    color:#fff;
    background:rgba(66,194,126,1)
  }
  .qwui-crm_tab{
    margin-top:18px;
  }
  .qwui-crm_tabtext{
    font-size:14px;
    font-family:PingFangSC-Regular;
    line-height: 30px;
  }
  .qwui-crm_tabb_content{
    float: left;
    width: 50%;
    text-align: center;
    margin: 30px 0 0 0;
  }
  .qwui-crm_tabb_content_lable{
    font-size:13px;
    font-family:PingFangSC-Regular;
    color:rgba(153,153,153,1);
    line-height:14px;
    margin-top:3px;
  }
  .qwui-crm_tabb_content_span{
    font-size:24px;
    font-family:PingFang-SC-Medium;
    color:rgba(51,51,51,1);
    line-height:25px;
  }
</style>
