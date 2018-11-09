<template>
  <div>
    <header class="qwui-enterprise_box_fixed">
      <search_box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search_box>
    </header>

    <div class="searchResult" :class="{active:!isPhone}" v-if="loadMore.padeConfig.pageData">
      <router-link class="resultItem qwui-border_bottom"
                   v-for="item in loadMore.padeConfig.pageData"
                   :key="item.id"
                   :to="{ path: '/detail/',
                          name: 'enterpriseDetail',
                          params: {corpId: item.corpId}, }">
        <!--  手机端样式开始  -->
        <div v-if="isPhone">
          <p class="resultTitle">{{item.orgName}}</p>
          <p class="resultId mgBottom">{{item.corpId}}</p>
          <p class="resultTip">
            {{ item.isVIP }} {{item.personMax ? '·'+item.personMax+'人' : ''}}
          </p>
          <span class="qwui-arrow_icon_right"></span>
        </div>
        <!--  手机端样式结束  -->

        <!--  PC端样式开始  -->
        <div v-else>
          <div class="listTitle">
            <p class="resultTitle">{{item.orgName}}</p>
            <div class="listTitleMsg">
              <p v-if="item.personMax">
                {{ item.isVIP }} {{' · '+item.personMax+'人'}}
                &nbsp|&nbsp剩余 · {{dealEndTime(item.vipEndTime)}}&nbsp天
              </p>
              <p v-else>{{ item.isVIP | noneMsg}}</p>
              <p>通讯录  ·  {{item.userSum | noneMsg}} 人</p>
              <p>关注  ·  {{item.validSum | noneMsg}} 人</p>
              <p @click.stop.prevent="showApp(item.agentName)">应用  ·  <span class="blue" >{{item.agentCount | noneMsg}}</span></p>
            </div>
            <p class="resultId">{{item.corpId}}</p>
          </div>
          <div class="listContent">
            <div class="listContentMsg">
              <p>联系人：{{item.contactName | noneMsg}}</p>
              <p>管理账户：{{item.userId | noneMsg}}</p>
              <p>手机：{{dealPhone(item.tel) | noneMsg}}</p>
              <p>邮箱：{{item.email | noneMsg}}</p>
              <p>企业规模：{{item.staffNumber | noneMsg}}</p>
            </div>
            <div class="listContentMsg">
              <p>VIP开通时间：{{item.vipStartTime | noneMsg}}</p>
              <p>VIP有效时间：{{item.vipEndTime | noneMsg}}</p>
              <p>接入全称：{{item.name | noneMsg}}</p>
              <p>接入时间：{{item.regisTime | noneMsg}}</p>
              <p>行业信息：{{item.industry | noneMsg}} - {{item.corpSubIndustry | noneMsg}}</p>
            </div>
          </div>
        </div>
        <!--  PC端样式结束  -->
      </router-link>
    </div>
    <loadMore :loadmore="loadMore" ref="loadMoreFun" @showMsgFromLoadMore="showMsgFromLoadMore"></loadMore>
  </div>
</template>

<script>
  import search_box from '@/components/base/search_box'
  import loadMore from '@/components/base/load_more';
  export default {
    name: "enterprise-list",
    data(){
      return {
        searchBar:{
          show:true,
          ridMask:true
        },
        loadMore:{      //加载更多组件
          url:_.isAndroid()||_.isIOS()?  //请求路径
            "/portal/publishcountPortalCtl/getCompany.do":
            "/portal/publishcountPortalCtl/getCompanyDetailList.do",
          pageIndexName:"page",
          data:{ //ajax入参数据
            page:1,
            keyWord: this.$route.query.keyWord
          },
          padeConfig:{
            currPage:"",
            maxPage:"",
            pageData:[],  //返回的列表数据
            totalRows:"",//数据总条数
          },
          hasRecord:{}
        },
        btnConfig:{
          primaryBtn:{name:"知道啦", callBack:null}, //主操作按钮
          defaultBtn:{name:"", callBack:null}, //次操作按钮
        },
        isPhone:_.isAndroid()||_.isIOS(), //判断是否是手机端，true为是
      }
    },
    computed: {
    },
    methods: {
      //显示应用详情
      showApp:function (agentName) {
        if(agentName) {
          _.alert('已托管应用', agentName, this.btnConfig)
        }
      },
      //请求列表数据
      resetRequestData:function (msg,i) {
        this.loadMore.data=msg.data;
        this.$refs.loadMoreFun.clearLoadFun();
      },
      //如果只有一条，直接跳到详情
      showMsgFromLoadMore:function(data){
        if(data && data.totalRows && data.totalRows == 1){
          this.$router.push({path: 'detail', name: 'enterpriseDetail', params: {corpId: data.pageData[0].corpId}})
        }
      },
      //搜索关键字
      showMsgFromSearchBox(val){
        this.loadMore.data.keyWord=val;
        this.resetRequestData(this.loadMore);
      },
      dealEndTime(time){//剩余天数
        time = time.substring(0,10);
        var d1 = Date.parse(time)
        var d2 = (new Date()).getTime()
        return (parseInt((d1-d2)/1000/60/60/24)+1>=0)?parseInt((d1-d2)/1000/60/60/24)+1:0
      },
      dealPhone(tel){//手机
        if(tel) {
          var str1 = tel.substring(0, 3)
          var str2 = tel.substring(3, 7)
          var str3 = tel.substring(7, 11)
          return str1 + ' ' + str2 + ' ' + str3
        }
        return ''
      }
    },
    filters:{
      noneMsg(val){
        if(!val){
          return '-'
        }
        return val
      }
    },
    components: {
      search_box,
      loadMore,

    }
  }
</script>

<style scoped>
  .searchResult {
    padding-left: 15px;
    padding-top: 40px;
    background-color: #fff;
  }
  .searchResult.active{
    padding-left: 30px;
  }
  .resultItem {
    display: block;
    padding: 18px 0 14px;
  }
  .resultTitle {
    padding-right: 30px;
    word-wrap: break-word;
    font-size: 16px;
    color: #333;
  }
  .resultId {
    font-size: 13px;
    color: #999;
  }
  .mgBottom{
    margin: 13px 0;
  }
  .resultTip {
    font-size: 13px;
    color: #666;
  }
  .listTitleMsg{
    display: inline-block;
    width: 100%;
    margin-bottom: 3px;
    font-size: 16px;
    color: #666;
  }
  .listTitle .resultTitle{
    margin-bottom: 8px;
    font-size:24px;
  }
  .listTitle .resultId{
    font-size:16px;
  }
  .listTitleMsg p{
    display: inline-block;
    margin-right:31px
  }
  .listContentMsg{
    display: inline-block;
    width:276px;
    margin-top: 14px;
    font-size: 14px;
    color:#999;
  }
  .listContentMsg p{
    margin-bottom: 2px;
  }
  .qwui-enterprise_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10
  }
  .blue {
    color: #307DCD!important;
  }
</style>
