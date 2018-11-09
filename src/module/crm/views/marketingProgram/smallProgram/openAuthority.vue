<template>
  <div class="wrap qwui-wrap">
    <scroll class="qwui-scroll_content"
        ref="scroll"
        :data="userList"
        :pullUpLoad="pullUpLoad"
        @pullingUp="onPullingUp">
    <p class="qwui-contact_admin">联系管理员开通使用权限</p>
    <ul class="qwui-contact_list">
      <li class="qwui-list_detail" v-for="(item,ind) in userList" :key="ind" @click="openConversation(item.wxUserId)">
        <img class="qwui-user_avatar" :src="item.headPic" alt="">
        <span class="qwui-user_name">{{item.qyUserName}}</span>
        <button class="qwui-contact_btn">
            <img class="qwui-contact_btn_img" :src="concatImg" alt="">
        </button>
      </li>
    </ul>
    </scroll>
  </div>
</template>

<script>
import { getMangerList } from '../../../api/smallProgram/getBata.js';
import Scroll from '../../../components/scroll/scroll';
import wx from 'weixin-js-sdk';
export default {
  name: '',
  data() {
    return {
      userList: [], //管理员列表
      concatImg: require('../../../../../assets/images/crm/icon_concat_wechat.png'), //微信图案
      pullUpLoad: true, //开启scroll组件的上拉加载
      pageCurrent: 1, //当前页码
      pageMax: 0, //最大页码
      pageSize: 10 //一次请求几条数据
    }
  },
  components: {
    Scroll
  },
  created(){
    this.getMangerListData({
        page: this.pageCurrent,
        pageSize: this.pageSize,
        needNotNull: 1
    });
    //获取用户的id
    this.wxUserId = this.$route.query.wxUserId;
  },
  methods:{
    //获取管理员列表数据
    getMangerListData(requestParam){
      getMangerList(requestParam,(res) => {
        this.userList = this.userList.concat(res.pageData);
        this.pageMax = res.maxPage;
      });
    },
    //上拉加载时会触发的事件
    onPullingUp(){
      //当前页码跟最大页码相同,不再请求
      if(this.pageCurrent === this.pageMax){
        this.pullUpLoad = false;
        return;
      }
      this.pageCurrent++;
      this.getMangerListData({
        page: this.pageCurrent,
        pageSize: this.pageSize,
        needNotNull: 1
      });
    },
    //打开企业微信的会话页面
    openConversation(adminId){
      if(!_.isQiyeweixinApp()){
        _.alert('提示','微信暂不支持此功能,请在企业微信使用');
        return;
      }
      wx.openEnterpriseChat({
        userIds: adminId + ';' + this.wxUserId,
        groupName: '',
        success: function(res){},
        fail:function(res){
          if(res.errMsg.indexOf('function not exist') > -1){
            _.alert('提示','版本过低请升级');
          }
        }
      });
    }
  }
}
</script>

<style scoped lang="scss">
    .qwui-wrap{
        height: 100vh;
    }
    .qwui-contact_admin {
        padding: 12px 0;
        text-align: center;
        font-size: 13px;
        font-family:PingFangSC-Regular;
        line-height: 18px;
        color: #B2B9C8;
        background-color: #F7F8FA;
    }
    .qwui-scroll_content{
        background-color: #F7F8FA;
    }
    .qwui-contact_list {
        .qwui-list_detail {
            position: relative;
            display: flex;
            align-items: center;
            padding: 12px 0 12px 15px;
            border-bottom: 1px solid #F7F8FA;
            background-color: #fff;
            &:last-child {
                border-bottom: none;
            }
        }
    }
    .qwui-user_avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    .qwui-user_name {
        margin-left: 12px;
        font-size: 16px;
        font-family:PingFangSC-Medium;
        color: #0A1735;
    }
    .qwui-contact_btn {
        position: absolute;
        top: 50%;
        right: 14px;
        border: none;
        background-color: transparent;
        transform: translateY(-50%);
        .qwui-contact_btn_img {
            width: 34px;
            height: 34px;
        }
    }
</style>
