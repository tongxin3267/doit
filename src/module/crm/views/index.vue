<template>
  <div class="wrap" :style="{height:userOrDeptContentHeight+'px'}">

    <!--头部菜单栏以及搜索栏,getSearchRequest:监听搜索事件-->
  	<header>
  		<crm-head-nav :headrdata="headData"></crm-head-nav>
    </header>

    <section>
      <div v-show="smallProgramFlag">
        <div class="marketing">
          <div class="marketing-title">营销助手</div>
          <div class="marketing-flex">
            <router-link to="/message" tag="div" class="marketing-content message">
              <div class="message-position">
                消息
                <div class="message-icon"
                      v-show='marketingNum'>
                  <span>{{marketingNum}}</span>
                </div>
              </div>
            </router-link>
            <!-- <router-link to="/smallProgram" tag="div" class="marketing-content program">我的小程序</router-link> -->
            <router-link to="/callingCard" tag="div" class="marketing-content card">我的名片</router-link>
          </div>
        </div>
        <!-- 营销动态列表 -->
        <!-- <div class="marketing-events" style="display:none;"> -->
        <div class="marketing-events" v-show="marketingList && marketingList.length > 0">
          <div class="content">
            <div class="events">营销动态</div>
            <router-link class="more" to="/marketingDynamic" tag="div">更多<span></span></router-link>
          </div>
          <div class="marketing-list" v-for="(item,index) in marketingList" :key="index">
            <img class="avatar" :src="customerAvatar(item.customerAvatar)">
            <div class="descript">{{item.description}}</div>
            <div class="time">{{item.createTime}}</div>
          </div>
        </div>
      </div>
      <crm-tab :tabData="tabData"></crm-tab>
    </section>
    <first-tip v-if="showFirstTip" @closeTip="closeTip"></first-tip>
  </div>
</template>

<script>
import crm_head_nav from './base/crm_head_nav';
import crm_tab from './base/crm_tab';
import FirstTip from './base/firstTip';
import { getMarketing,getMessageNum,getCard } from '../api/smallProgram/getBata.js'
const userVisitRecord = 'userVisitRecord';//存储用户是否首次使用的key值
const firstSpecifyId = 'ww76540ea8781f31c5';//指定用户ID
const SecondSpecifyId = 'wx07ad350b0dfd7747';//指定用户ID


export default {
  name: 'index',
  components:{
    "crm-head-nav":crm_head_nav,
    "crm-tab":crm_tab
  },
  data(){
    return {
      headData:dataBase.crm.headData,//头部
      tabData:dataBase.crm.tabData,
      marketingNum:0,//消息数量
      marketingList:[],//营销动态列表
      showFirstTip: false,//首次使用提示框开关
      routeFlag:true,//路由守卫开关
      smallProgramFlag:false,//是否打开营销小程序入口
    }
  },
  created:function(){
    //判断屏幕高度
    if(document.documentElement.clientHeight>0){
        this.userOrDeptContentHeight = document.documentElement.clientHeight;
    }else{
      this.userOrDeptContentHeight = "auto";
    }
    _.hideLoading();
    this.getMarketingDate()
    this.getMessageNum()

    //应用打开后只会执行一次
    wxqyhConfig.ready(() => {
      //获取用户id,判断是否展示营销小程序入口
      let targetId = wxqyhConfig.orgConfigInfo.corpId;
      if(targetId === firstSpecifyId || targetId === SecondSpecifyId){
        this.$store.commit('changeShowFlag',true);
        this.smallProgramFlag = true;
        this.firstVisit();
      }
    });

    if(this.getShowFlag){
      this.smallProgramFlag = true;
    }
  },
  methods: {
    // 拼接图片数据
    customerAvatar(customerAvatar){
      return _.filterCompressURL(customerAvatar);
    },
    //请求营销数据
    getMarketingDate(){
      getMarketing((result) => {
        this.marketingList = result.dynamicsList
      })
    },
    //获取消息数目
    getMessageNum(){
      getMessageNum(res => {
        this.marketingNum = res.count
      })
    },
    //关闭首次使用提示框
    closeTip(){
      this.showFirstTip = false;
    },
    //记录用户是否第一次访问crm
    firstVisit(){
      //判断浏览器是否有保存这个key值,如果有则说明不是第一次访问,否则打开提示框
      if(!localStorage.getItem(userVisitRecord)){
        this.showFirstTip = true;
        localStorage.setItem(userVisitRecord,'visited');
      }else{
        this.showFirstTip = false;
      }
    }
  },
  components:{
    "crm-head-nav":crm_head_nav,
    "crm-tab":crm_tab,
    FirstTip
  },
  computed:{
    getShowFlag(){
     return this.$store.state.miniprogram.showFlag;
   }
  },
  beforeRouteLeave(to,from,next){
    if(to.path === '/callingCard'){
      if(!this.routeFlag){
        next();
        return;
      }
      //调用请求接口,判断用户是否有权限进入我的名片
      //如果有,进入我的名片页面,否则进入开通权限页面
		  getCard((res) => {
        this.routeFlag = false;
        if(!res.isPermission){
          next({path:'/smallProgram',query:{wxUserId:res.wxUserId}});
        }else{
          next({path:'/callingCard'});
        }
      });
    }else{
      next();
    }
	}
}
</script>
<style lang="scss" scoped>
@import '../crmBase.scss';
.wrap{
  overflow-y:auto;
}
.marketing{
  padding: 0 rem(15);
  background: #fff;
  .marketing-title{
    padding: rem(32) 0 rem(16) 0;
    line-height: rem(22);
    color: #0A1735;
    font-size: rem(16)
  }
  .marketing-flex{
    display: flex;
    .marketing-content{
      flex:1;
      width: 105px;
      height: 66px;
      padding: 22px 0;
      margin-right: 15px;
      border-radius: 4px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      box-sizing: border-box;
      &.message{
        position: relative;
        background: url('../../../assets/images/crm/crm_news.png') center no-repeat;
        background-size: cover;
        .message-position{
          position: absolute;
          top: 34%;
          right: 48%;
          transform: translateX(50%);
          .message-icon{
            position: relative;
            display: inline-block;
            width: 22px;
            height: 12px;
            line-height: 13px;
            background: #fff;
            border-radius: 6px;
            font-size: 11px;
            color: #6E9BFF;
            &:before{
              position: absolute;
              top: 9px;
              left: 2px;
              content: '';
              width: 0;
              height: 0;
              border-color: transparent #fff;
              border-width: 0 0 6px 6px;
              border-style: solid;
            }
          }
        }
      }
      &.program{
        background: url('../../../assets/images/crm/crm_program.png') center no-repeat;
        background-size: cover;
      }
      &.card{
        margin-right: 0;
        background: url('../../../assets/images/crm/crm_card.png') center no-repeat;
        background-size: cover;
      }
    }

  }
}
.marketing-events{
  padding: 0 rem(15);
  background: #fff;
  .content{
    height: rem(18);
    line-height: rem(18);
    padding: rem(16) 0 rem(12);
    color: #7A7C80;
    font-size: rem(13);
    .events{
      float: left;
    }
    .more{
      position: relative;
      float: right;
      padding-left: rem(40);
      margin-right: rem(16);
      span{
        position: absolute;
        top: rem(1);
        width: rem(16);
        height: rem(16);
        background: url('../../../assets/images/crm/icon_go.png') center no-repeat;
        background-size: 100%;
      }
    }
  }
  .marketing-list{
    position: relative;
    padding: rem(4) 0 rem(4) rem(44);
    .avatar{
      position: absolute;
      top: 0;
      left: 0;
      width: rem(28);
      height: rem(28);
      margin-top: rem(8);
      border-radius: 50%;
    }
    .descript{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @include content-item(20,20,#0A1735,14);
    }
    .time{
      @include content-item(17,17,#B2B9C8,12);
    }
  }
}
</style>

