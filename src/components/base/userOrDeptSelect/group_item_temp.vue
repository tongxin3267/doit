<template>
  <div>
    <div class="qwui-dept_item" v-for="item in message">
      <div class="qwui-dept_item_inner" @click="selectThis(item.id)">
        <div class="qwui-user_select_icon" :class="{active:selectdata.idStr.indexOf(item.id)!=-1}">
          <i></i>
        </div>
        <div class="avator org">
          <img src="" alt="">
        </div>
        <div class="title flexItem">
          <p class="name">{{item.tagName}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'groupItemTemp',
    props: ['message', 'selectdata', 'userselected','type'],
    data(){
      return{
        dataBase:dataBase,
        "getUserForTag":"/portal/tagAction!searchTagGroupRefPage.action",//获取标签下的人员数据，
        "getUserForGroup":"/portal/selectUserAction!getUserGroupPerson.action",//获取群组下的人员数据，
        userselectedData:null,//已选人员数据
        userselectedIdStr:null,//已选人员id字符串
        selectdataStr:null,//已选择群组集合字符串
        index:"",//当前选中群组的下标
        parameter:{
          "agentCode":dataBase.wxqyh_uploadfile.agent
        }
      }
    },
    created: function () {
    },
    methods: {
      //选择群组
      selectThis: function (id) {
        var data = this.message;//群组列表数据
        var isCache = false;//判断是否已加载群组内人员数据
        this.userselectedData = this.userselected.data;//已选人员数据
        this.userselectedIdStr = this.userselected.idStr;//已选人员id字符串
        this.selectdataStr = this.selectdata.idStr;//已选择群组集合字符串
        for(var i=0;i<data.length;i++){
          if(data[i].id==id){
            this.index = i;
            if(data[i].person){
              isCache = true;
            }
            break;
          }
        }
        if(!isCache){//没有群组人员缓存数据
          var url = '';
          if(this.type=="tag"){
            url = this.getUserForTag;
            delete this.parameter.groupId;
            this.parameter.tagId=id;
          }else{
            url = this.getUserForGroup;
            delete this.parameter.tagId;
            this.parameter.groupId=id;
          }

          this.dataRequest(url,this.parameter,this.type,false);
        }else{
          var userList = data[this.index].person;
          if(userList.length>0){
            if(this.selectdataStr.indexOf(id)!=-1){
              delete this.selectdata.data[id];
              this.selectdataStr = this.selectdataStr.replace(id+"|","");
              for(var i=0;i<userList.length;i++){
                var personId = userList[i].userId;
                this.userselectedIdStr = this.userselectedIdStr.replace(personId+"|","");
                for(var t = 0;t<this.userselectedData.length;t++){
                  if(this.userselectedData[t].userId==personId){
                    this.userselectedData.splice(t,1);
                  }
                }
                if(this.selectdataStr!=""){
                  for(var v in this.selectdata.data){
                    if(this.selectdata.data[v].idStr.indexOf(personId)!=-1){
                      delete this.selectdata.data[v];
                      this.selectdataStr = this.selectdataStr.replace(v+"|","");
                    }
                  }
                }
              }
            }else{
              this.selectdataStr+=id+"|";
              this.selectdata.data[id]=data[this.index];
              if(this.userselectedData.length!=0){
                for(var i=0;i<userList.length;i++){
                  if(this.userselectedIdStr.indexOf(userList[i].userId)==-1){
                    this.userselectedData.push(userList[i]);
                    this.userselectedIdStr+=userList[i].userId+"|";
                  }
                }
              }else{
                for(var i=0;i<userList.length;i++){
                  this.userselectedData.push(userList[i]);
                  this.userselectedIdStr+=userList[i].userId+"|";
                }
              }
            }
          }else{
            _.alert('i18n.notice','i18n.noContact')
          }
          this.userselected.idStr = this.userselectedIdStr;
          this.selectdata.idStr = this.selectdataStr;
        }
      },
      showSelectData:function(userList,type){
        if(type=="tag"){
          userList=userList.list;
        }else{
          userList = userList.pageData;
        }
        if(userList&&userList.length>0){
          this.message[this.index].person=userList;
          this.message[this.index].idStr='';
          if(type=="tag"){
            this.selectdataStr+=this.parameter.tagId+"|";
            this.selectdata.data[this.parameter.tagId]=this.message[this.index];
          }else{
            this.selectdataStr+=this.parameter.groupId+"|";
            this.selectdata.data[this.parameter.groupId]=this.message[this.index];
          }
          if(this.userselectedData.length!=0){
            for(var i=0;i<userList.length;i++){
              this.message[this.index].idStr+=userList[i].userId+"|";//群组内人员id拼接字符串
              if(this.userselectedIdStr.indexOf(userList[i].userId)==-1){
                this.userselectedData.push(userList[i]);
                this.userselectedIdStr+=userList[i].userId+"|";
              }
            }
          }else{
            for(var i=0;i<userList.length;i++){
              this.message[this.index].idStr+=userList[i].userId+"|";//群组内人员id拼接字符串
              this.userselectedData.push(userList[i]);
              this.userselectedIdStr+=userList[i].userId+"|";
            }
          }
        }else{
          _.alert('i18n.notice','i18n.noContact')
        }
        this.userselected.idStr = this.userselectedIdStr;
        this.selectdata.idStr = this.selectdataStr;
      },
      dataRequest: function (url, data, type, async) {
        var self = this
        var asyncs = async == false ? false : true;
        var list = null;
        _.ajax({
          url: _.baseURL + url,
          type: "post",
          data: data,
          dataType: "json",
          async: asyncs,
          success: function (result) {
            if ("0" == result.code) {
              list = result.data;
              self.showSelectData(list,type);
            } else {
              _.alert('i18n.notice', result.desc);
            }
          }
        });
        return list;
      }
    }
  }
</script>

<style type="text/css">
  .qwui-dept_item {
    position: relative;
    overflow: hidden;
    font-size: 16px;
    background-color: white;
    line-height: 2.2;
    clear: both;
  }
  .qwui-dept_item:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .qwui-dept_item_inner {
    display: flex;
    padding: 10px 15px;
  }


  .qwui-dept_item .avator {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    min-width: 38px;
    background: url(../../../assets/images/dept_ico.jpg) no-repeat;
    background-size: 100%;
  }

  .qwui-dept_item .title {
    flex: 1;
  }

  .qwui-dept_item p {
    line-height: 20px;
  }

  .qwui-dept_item p:last-child {
    font-size: 13px;
    color: #999;
  }
</style>

