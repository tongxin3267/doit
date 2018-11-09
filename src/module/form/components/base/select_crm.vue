<template>
  <div class="qwui-crm_select">
    <div class="select-crm-content">

      <div :style="{height:contentHeight+'px'}" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" class="clientList">
        <search_bar :searchinput="searchBar" v-on:listenToSearchBox="showMsgFromSearchBar"></search_bar>
        <div >
          <div v-for="item in list" class="qwui-user_item">
            <div class="qwui-user_item_inner" @click="selectThis(item)">
              <div class="qwui-user_select_icon" :class="{active:crmselected.idStr.indexOf(item.id)!=-1}"><i></i></div>
              <div class="avator"><img src="../../../../assets/images/touxiang02.png" alt="" class=""></div>
              <div class="title description_title flexItem">
                <p class="name">{{item.clientName}}</p>
                <div class="client-code">{{item.clientCode}}</div>
              </div>
            </div>
          </div>
        </div>
        <load_more :busy="busy" :loading="loading" :showrecord="showrecord" @childevent="loadMore"></load_more>
      </div>

     <!--底部按钮-->
      <div class="qwui-userOrDept_select_footer">
        <div class="qwui-userOrDept_select_footerBar">
          <div class="qwui-userOrDept_footer_flex"><a class="qwui-btn qwui-btn_default" @click="concel">取消</a></div>
          <div class="selected">
          </div>
          <div class="qwui-userOrDept_footer_flex"><a class="qwui-btn fr" @click="comfirm">确定</a></div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

  import search_bar from '@/components/base/search_box.vue';
  import load_more from '../base/load_more.vue'
  export default {
    components:{
      search_bar,
      load_more
    },
    data(){
      return {
        dataBase:dataBase,
        selectCrm:dataBase.selectCrm,
        url:_.baseURL+'/portal/clientAction!searchClientList.action',
        list:[],
        crmselected:{
          selectedList:[],
          idStr:'',
        },

        searchBar:{ //头部搜索框
          show:true,
          keyWord:'',
          rightSpan:{
            show:false,
            callback:null
          },
//          moreFunction:{
//            show:false,
//            option:[]
//          }
        },
        data:null,
        contentHeight:'',
        page:1,
        maxPage:'',
        busy:false,
        currPage:1,
        maxPage:0,
        keyWord:'',
        loading:false,
        pageSize:10
      }
    },
    computed:{
      showrecord(){
        this.list = this.list ||[];
        return this.list.length==0?true:false;
      }
    },
    created(){
      if(document.documentElement.clientHeight>0){
        this.contentHeight=document.documentElement.clientHeight;
      }else{
        this.contentHeight="auto";
      }
      this.data = this.selectCrm.data;
      this.selectStart(this.selectCrm.selectList);
    },
    methods: {
      selectThis(item){
        var id = item.id;
        var userselectedData = this.crmselected.selectedList;
        //删除人员
        if(this.crmselected.idStr.indexOf(id)!=-1){
          this.crmselected.idStr = this.crmselected.idStr.replace(id+"|","");
          for(var t = 0;t<userselectedData.length;t++){
            if(userselectedData[t].id==id){
              userselectedData.splice(t,1);
            }
          }
          //添加人员
        }else{
          this.crmselected.idStr+=id+"|";
          userselectedData.push(item);
        }
      },
      selectStart(data){
        for(var i=0;i<data.length;i++){
          this.crmselected.selectedList.push(data[i]);
          this.crmselected.idStr+=data[i].id+'|';
        }
      },
      showMsgFromSearchBar(value){
        this.page = 1;
        this.list = [];
        this.keyWord = value;
        this.initList();
      },
      loadMore(){
        this.initList();
      },
      initList(){
        _.showLoading();
        var _this = this;
        _.ajax({
          url: this.url,
          type: "POST",
          data: {
            userId:'',
            ctype:'',
            typeId:'',
            keyWord: this.keyWord,
            page: this.page,
            crmTypes:this.data.crmTypes,
            crmUserId: this.data.crmUserId,
            agentcode: 'form',
            workInfo:'',
          },
          success: function (result) {
            _.hideLoading();
            if (result.code == "0") {
              if (_this.list.length > 0) {
                _this.list = _this.list.concat(result.data.pageData);
              } else {
                _this.list = result.data.pageData||[];
              }

              _this.maxPage = result.data.maxPage;
              _this.currPage = result.data.currPage + 1;
              if (_this.currPage > _this.maxPage) {
                _this.busy = true;
              }else{
                _this.busy = false;
              }
            } else {
              _.alert('提示', result.desc);
            }
          }
        });
      },
      comfirm(){
        this.dataBase.selectCrm.confirm.call(this,this.crmselected);
        this.concel();
      },
      concel(){
        this.dataBase.selectCrm = {
          show:false,
            selectList:[],
            data:{
              crmUserId:'',
              crmTypes:''
            },
            confirm:null,
        }

      }
    }

  }
</script>
<style>
  .qwui-crm_select {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin: auto;
    background: #fff;
  }
  /*********/
  .qwui-user_item {
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    clear: both;
    background-color: white;
    overflow: hidden;
  }
  .qwui-user_item .qwui-user_item_inner {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding: 10px 15px;
  }
  .qwui-user_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
  }
  .qwui-user_item .avator img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  .description_title{
    line-height: 1.4;
    overflow: hidden;
  }
  .client-code{
    font-size: 13px;
    color: #999999;
    line-height: 1.5;
  }
  .select-crm-content{
    position: relative;
    width: 100%;
  }
  .clientList{
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .select-crm-footer{
    position: absolute;
    bottom: 0;
    padding: 0 3%;
    width: 94%;
    min-height: 50px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    background: #fff;
    z-index: 10;
  }
  .select-crm-footerBar{
    display: flex;
  }
  /*底部按钮*/
  .qwui-userOrDept_select_footer{
    position: absolute;
    bottom: 0;
    padding: 0 3%;
    width: 94%;
    min-height: 50px;
    box-sizing: content-box;
    background: #fff;
    z-index: 10;
  }
  .qwui-userOrDept_select_footer:before,.qwui-userOrDept_btn_tab:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-userOrDept_select_footerBar{
    display: flex;
  }
  .qwui-userOrDept_footer_flex{
    flex: 1;
  }
  .qwui-userOrDept_select_footer .selected {
    text-align: center;
    flex: 2;
  }
  .qwui-userOrDept_select_footer .selected p:first-child{
    margin-top: 5px;
    font-size: 12px;
    color: #999;
  }
  .qwui-userOrDept_select_footer .selected p:last-child{
    font-size: 14px;
    color: #586c94;
    cursor: pointer;
  }
  .qwui-userOrDept_select_footer .qwui-btn {
    position: relative;
    margin-top: 10px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 17px;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    display: block;
    cursor: pointer;
    background: #2F7DCD;
  }
  .qwui-userOrDept_select_footer .qwui-btn::after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    border: 1px solid #e5e5e5;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    box-sizing: border-box;
    border-radius: 10px;
  }
  .qwui-userOrDept_select_footer .qwui-btn_default {
    color: #333!important;
    background: #fbfafc!important;
  }
  .fr{
    float:right;
  }
</style>
