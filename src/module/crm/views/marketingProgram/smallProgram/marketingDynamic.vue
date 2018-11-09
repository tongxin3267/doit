<template>
  <div class="wrap qwui-wrap" ref="wrapper">
    <scroll class="qwui-scroll_content"
            ref="scroll"
            :data="dynamicDate"
            :pullUpLoad="pullUpLoad"
            @pullingUp="onPullingUp">
      <div class="qwui-product_dynamic" v-for="(item,ind) in dynamicDate" :key="ind">
        <div class="qwui-dynamic_time">
		  <span class="qwui-time">{{item.time}}</span>
        </div>
	    <div class="qwui-product_dynamic_list">
        <qw-user-dynamic
          v-for="(item,ind) in item.dynamicsList"
          :key="ind"
          :userAvatar="item.customerAvatar"
          :userDo="item.description"
          :visitTime="item.createTime"
          @click.native="enterChatRoom(item.customerId)"></qw-user-dynamic>
	    </div>
	  </div>
    </scroll>
  </div>
</template>

<script>
import QwUserDynamic from './components/UserDynamic';
import { getMarketingDynamicList } from '../../../api/smallProgram/getBata.js';
import Scroll from '../../../components/scroll/scroll';
export default {
  data() {
    return {
      dynamicDate: [], //动态数据列表
      pullUpLoad: true, //开启scroll组件的上拉加载
      pageCurrent: 1, //当前页码
      pageMax: 0, //最大页码
      pageSize: 10 //一次请求几条数据
    }
  },
  components: {
    QwUserDynamic,
    Scroll
  },
  created(){
    this.getDynamicList({
        page: this.pageCurrent,
        pageSize: this.pageSize
    });
  },
  methods:{
    //获取动态列表数据
    getDynamicList(requestParam){
      getMarketingDynamicList(requestParam,(res) => {
        this.dynamicDate = this.dynamicDate.concat(res.pageData);
        this.pageMax = res.maxPage;
      });
    },
    //上拉加载时会触发的事件
    onPullingUp(){
      if(this.pageCurrent === this.pageMax){
        this.pullUpLoad = false;
        return;
      }
      this.pageCurrent++;
      this.getDynamicList({
        page: this.pageCurrent,
        pageSize: this.pageSize
      });
    },
    //跳转到会话页面
    enterChatRoom(userId){
      this.$router.push({path: '/chat',query:{openId: userId}});
    }
  }
}
</script>

<style scoped lang="scss">
.qwui-wrap {
  width: 100%;
  height: 100vh;
  font-family:PingFangSC-Regular;
  background-color: #fff;
}
.qwui-scroll_content{
  margin-top: 16px;
}
.qwui-dynamic_time {
  margin: 0 auto 12px;
  text-align: center;
}
.qwui-time {
  display: inline-block;
  height: 17px;
  padding: 1px 8px;
  line-height: 17px;
  text-align: center;
  color: #B2B9C8;
  font-size: 11px;
  border-radius: 22px;
  background-color: #F7F8FA;
}
.qwui-product_dynamic_list {
  padding: 0 18px 12px 15px;
}
</style>
