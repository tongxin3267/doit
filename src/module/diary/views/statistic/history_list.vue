<template>
  <div>
  <!--历史日志-->
  <statistic_list :isHistory="true" :ruleName="ruleName" :historyData="loadMore.padeConfig.pageData" :rate="rate"></statistic_list>

  <!--加载状态-->
  <load_more :loadmore="loadMore" describeWord="i18n.diaryStatisticTotal" @showMsgFromLoadMore="getRate"></load_more>
  </div>
</template>
<script>
  import statistic from '../../js/statistic'
  import statistic_list from './statistic_list.vue'
  import load_more from '@/components/base/load_more';
  export default {
    data() {
      return {
        list: statistic.list,
        loadMore: statistic.history.loadMore,
        ruleName: '',
        rate:0
      }
    },
    created:function () {
      this.initHistory();
    },
    methods:{
      initHistory:function () {
        this.ruleName = this.$route.query.ruleName;
        this.loadMore.data.ruleId = this.$route.query.ruleId
      },
      getRate:function (val) {
        this.rate = val.rate;
      }
    },
    components:{statistic_list, load_more}
  }
</script>
