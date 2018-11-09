<template>
  <section>
  <ul class="clientCheckList">
    <li v-for="(item,index) in pageData" class="qwui-list_item" >
      <div>
          <div class="qwui-list_item_content" v-if="listData.type === 'Client'" @click.stop.prevent="showPersonDetail(item)">
            <p class="qwui-list_item_title">{{item.clientName}}</p>
            <div class="qwui-list_remarks">
              <p class="qwui-list_item_charge" >
                <span><i class="qwui-icon_check qwui-icon_charge"></i>{{listData.topItem}}</span>
                <span v-if="item.chargePersonList.length>0" class="qwui-list_item_text">
                    <span v-if="item.chargePersonList.length>3">{{item.chargePersonList[0].personName}}等{{item.chargePersonList.length}}人</span>
                    <span v-for="(person,index) in item.chargePersonList" v-else>
                      {{person.personName}}
                    </span>
                </span>
                <span class="qwui-list_item_text"  v-else>-</span>
              </p>
              <p class="qwui-list_item_create" >
                <span><i class="qwui-icon_check qwui-icon_time"></i>{{listData.secondItem}}</span>
                <span class="qwui-list_item_text">{{item.createTime}}</span>
              </p>
              <p class="qwui-list_item_deal">
                <span><i class="qwui-icon_check qwui-icon_time" v-if="item.successTime == ''"></i><i class="qwui-icon_check qwui-icon_success" v-else></i>{{listData.lastItem}}</span>
                <span class="qwui-list_item_text" v-if="item.successTime == ''">-</span>
                <span class="qwui-list_item_text" v-else>{{item.successTime}}</span>
              </p>
              <div class="qwui-time_line"></div>
            </div>
          </div>
        <div class="qwui-list_item_content" v-else @click.stop.prevent="showContactDetail(item)">
          <p class="qwui-list_item_title">{{item.contactsName}}</p>
          <div class="qwui-list_remarks">
            <p class="qwui-list_item_charge" >
              <span><i class="qwui-icon_check qwui-icon_charge"></i>{{listData.topItem}}</span>
              <span v-if="item.chargePersonList.length>0" class="qwui-list_item_text">
               <span v-if="item.chargePersonList.length>3">{{item.chargePersonList[0].personName}}等{{item.chargePersonList.length}}人</span>
                <span v-for="(person,index) in item.chargePersonList" v-else>
                      {{person.personName}}
                </span>
              </span>
              <span class="qwui-list_item_text"  v-else>-</span>
            </p>
            <p class="qwui-list_item_create" >
              <span><i class="qwui-icon_check qwui-icon_time"></i>{{listData.secondItem}}</span>
              <span class="qwui-list_item_text">{{item.createTime}}</span>
            </p>
            <p class="qwui-list_item_deal">
              <span><i class="qwui-icon_check qwui-icon_client"></i>{{listData.lastItem}}</span>
              <span class="qwui-list_item_text">{{item.clientName}}</span>
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>

  <!--个人信息-->
  <user_info ref="loadPersonalMsg"></user_info>

  </section>
</template>
<script>
import user_info from '@/components/detail/user_info_card';//个人信息
import { getContactDetail,getClientDetail,checkSeaClient } from '../../api/check/getData';

export default {
  name: 'client_check_list',
  props:["loadmore" ],
  components: {
    user_info
  },
  data() {
    return {
    }
  },
  computed:{
    pageData(){
      if(this.loadmore.padeConfig.pageData){
        return this.loadmore.padeConfig.pageData;
      }
    },
    listData(){
      if(this.loadmore.listConfig){
        return this.loadmore.listConfig;
      }
    },
  },
  created(){
  },
  methods: {
    //点击头像 显示详情
    showPersonDetail:function (item){
      if(item.userId){
        if(item.chargePersonList.length>0){
          let params={
            id:item.userId
          };
          //有负责人，则跳到客户详情
          getClientDetail(params,(data) => {
            if(data.code==='0'){
              //有查阅权限，跳到客户详情页面
              location.href = _.baseURL+'/jsp/wap/crm/client/client_detail.jsp?id=' + item.userId;
            }else{
              //有负责人，但没有查阅权限的人可点击整块打开第一个负责人的名片
              if(item.chargePersonList[0].userId){
                let creator={
                  userId:item.chargePersonList[0].userId,
                };
                this.$refs.loadPersonalMsg.showUserMessage(creator,true);
              }
            }
          });
        }else{
          //没有负责人，是公海客户，判断有无查阅权限
              //有查阅权限，跳到公海客户详情页面
              if(item.poolId == 0 ){
                //默认公海，都有查阅权限
                location.href = _.baseURL+'/jsp/wap/crm/territorialSea/territorialSea_detail.jsp?id=' + item.userId;
              }else{
                //非默认公海，通过调用接口判断是否有权限
                let params={
                  poolId:item.poolId,
                };
                checkSeaClient(params,(res) => {
                //没有负责人且没有查阅权限
                  if(res.data.hasPermission){
                    location.href = _.baseURL+'/jsp/wap/crm/territorialSea/territorialSea_detail.jsp?id=' + item.userId;
                  }else{
                    _.alert('提示',"该客户属于公海池客户，没有负责人，可前往指定公海池领取")
                  }
                });
              }
        }
      }
    },
    showContactDetail:function(item){
      let params={
        id:item.userId
      };
      getContactDetail(params,(data) => {
        if(data.code==='0'){
          //有查阅权限，跳到联系人详情页面
          location.href = _.baseURL+'/jsp/wap/crm/contact/contact_detail.jsp?id=' + item.userId;
        }else{
          if(item.chargePersonList.length>0){
          //没有查阅权限但有负责人，打开第一个负责人的名片
            if(item.chargePersonList[0].userId){
              let creator={
                userId:item.chargePersonList[0].userId,
              };
              this.$refs.loadPersonalMsg.showUserMessage(creator,true);
            }
          }else{
          //没有负责人且没有查阅权限
          _.alert('提示',"该客户属于公海池客户，没有负责人，可前往指定公海池领取")
          }
        }
      });
    }
  },
}
</script>
<style lang="scss" scoped>
  .qwui-list_item {
    width:100%;
    height:181px;
    box-sizing: border-box;
    padding: 15px 15px 0 15px;
    background:rgba(245,245,245,1);
  }
  .qwui-list_item_content{
    margin: auto;
    height:166px;
    background:rgba(255,255,255,1);
    border-radius:5px;
  }
  .qwui-list_item_title{
    height:49px;
    padding: 0 15px;
    font-size:16px;
    font-family:PingFangSC-Regular;
    color:rgba(54,64,74,1);
    line-height:50px;
    border-bottom: 1px solid #F6F6F6;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .qwui-list_remarks{
    padding: 0 15px;
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(132,138,144,1);

  }
  .qwui-list_item_charge,.qwui-list_item_create,.qwui-list_item_deal{
    display: flex;
    justify-content: space-between;
    line-height:38px;
    height:38px;
  }
  .qwui-list_item_text{
    width:60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: right;
  }
  .qwui-icon_check{
    width:18px;
    height:18px;
    display: inline-block;
    background-size: cover;
    vertical-align: middle;
    margin-right: 15px;
  }
  .qwui-icon_charge{
    background: url(../../../../assets/images/crm/icon_check_charge.png) center no-repeat;
  }
  .qwui-icon_time{
    background: url(../../../../assets/images/crm/icon_check_time.png) center no-repeat;
  }
  .qwui-icon_client{
    background: url(../../../../assets/images/crm/icon_check_client.png) center no-repeat;
  }
  .qwui-icon_success{
    background: url(../../../../assets/images/crm/icon_check_success.png) center no-repeat;
  }
  .qwui-time_line{
    height:30px;
    width:1px;
    background:rgba(246,246,246,1);
    position: relative;
    left:9px;
    bottom:52px;
  }
</style>
