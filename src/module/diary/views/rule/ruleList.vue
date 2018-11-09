<template>
  <div>
    <div class="statistics_rule_wrap" v-if="powerPermission">
      <router-link class="statistics_rule"
                   v-for="item in rules"
                   :to="{ path: '/rule/settings/',
                          name: 'ruleSetting',
                          params: {ruleId: item.rule ? item.rule.id : '0', ruleName: item.name, diaryId: item.id}}"
                   :key="item.id">
        <div class="statistics_rule_type">{{item.name}}</div>
        <div class="rule_tip">提交频率：
          <span>{{getRate(item.rule)}}</span><span>{{getRange(item.personNum)}}</span></div>
        <span class="qwui-click_icon qwui-click_icon_right"></span>
      </router-link>
    </div>

    <!--没有权限-->
    <no_record v-else :hasRecord="noPermission"></no_record>

    <!--没有数据-->
    <no_record v-if="noListData.show" :hasRecord="noListData" ></no_record>
  </div>
</template>

<script>
  import noRecord from '@/components/base/noRecord'
  import { getRuleList } from "../../api/getData";

  const DATACONFIG = {
    1: '每天',               // 周期每天
    2: '每周',               // 周期每周
    3: '每月',               // 周期每月
  };
  const RANGECONFIG = {
    '-2': ' / 所有人',       // 范围：所有人
    '-3': ' / 本部门',       // 范围：本部门
  }

  export default {
    name: "rule-list",
    data(){
      return {
        rules: [],                  // 规则数据
        powerPermission: true,     // true: 默认有权限

        // 列表没有数据时的显示
        noListData:{
          show: false,
          icon: 'qwui-icon_text',
          title: '暂无数据',
          text: '联系管理员在后台添加日志类型'
        },
        // 没有权限的图标设置
        noPermission: {
          show: !this.powerPermission,
          icon: 'qwui-icon_permission',
          title: '暂无权限',
          text: '没有权限设置统计规则，请联系管理员',
        }
      }
    },
    mounted(){
      // 列表数据请求
      getRuleList( (result) => {
          this.rules=result.date
          this.powerPermission = result.powerPermission                      // 没有权限
          this.noListData.show = this.powerPermission && !this.rules        // 没有数据的显示
        }
      )
    },
    methods: {
      getRate(rule){
        if(!rule) {return '未设置';}
        return DATACONFIG[rule.rate]
      },
      getRange(personNum){
        if( personNum === -1 ) {return ''}  // 没有设置规则
        if(RANGECONFIG[personNum]) {return RANGECONFIG[personNum]}
        return ' / '+ personNum + '人'   // 特定对象人数
      }
    },
    components: {
      'no_record': noRecord
    }
  }
</script>

<style scoped>
  .statistics_rule_wrap {
    background-color: #fff;
  }
  .statistics_rule{
    display: block;
    position: relative;
    padding: 15px 15px 15px 0;
    margin-left: 15px;
  }
  .statistics_rule:after{
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .statistics_rule_type{
    width: 90%;
    margin-bottom: 5px;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
  .rule_tip {
    font-size: 14px;
    color: #999;
  }

</style>
