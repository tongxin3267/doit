<template>
  <div class="qwui-check_header">
    <ul>
      <li class="qwui-check_box_list" v-for="(item,index) in pageData">
        <div class="qwui-list_check_box" v-if="listoperation.navOn">
          <label :for="item.id" class="qwui-check_box">
            <input type="checkbox"  v-model="checkList" :value="item.id" :id="item.id">
            <span ></span>
          </label>
        </div>
        <div class="qwui-list_item">
          <router-link :to="{name: 'detail', params: { expressId: item.id}, query: { expressId: item.id}}">
          <div class="qwui-list_item_content">
            <p class="qwui-list_item_title">{{item.title}}</p>
            <p class="qwui-list_remarks">
              <span class="qwui-list_user_name">{{item.content | contentFormat}}</span>
              <span class="qwui-list_user_name">{{item.content | contentFormat2}}</span>
            </p>
          </div>
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props:['listdata', 'listoperation'],
    data(){
      return {
        pageData:[],
        isChoose:false,
        checkList:[],
      }
    },
    watch: {
      'listdata.pageData':function(val) {
        this.pageData = val;
      },
      'listoperation.navOnChange':function(val) {
        this.checkList = [];
      },
      checkList:function (val) {
        this.$emit("listenToExpressList", val);
      }
    },
    filters: {
      contentFormat: function (val) {
        if(val) {
          return val.replace(/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g, ' ').split(" ")[0];
        }
      },
      contentFormat2(val){
        if(val) {
          return val.replace(/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g, ' ').split(" ")[1];
        }
      }
    }
  }
  </script>

<style type="text/css">
  .qwui-check_header{
    position: relative;
    background: #fff;
  }
  .qwui-check_box_list{
    display: flex;
    position: relative;
    margin-left: 15px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .qwui-check_header .qwui-list_item{
    flex:1;
    position: relative;
    font-size: 16px;
    line-height: 2.2;
    background-color:#fff;
    overflow: hidden;
  }
  .qwui-check_header:after,.qwui-check_box_list:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-check_box_list:last-child:after{border: none;}
  .qwui-check_header .qwui-list_item_content{
    padding: 15px 15px 15px 0;
    overflow: hidden;
  }
  .qwui-check_header .qwui-list_item_title{
    display: block;
    margin-bottom: 4px;
    line-height: 18px;
    font-size: 16px;
    color: #333;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    text-overflow: ellipsis;
  }
  .qwui-check_header .qwui-list_remarks{
    font-size: 13px;
    color: #999;
    line-height: 18px;
    overflow: hidden;
  }
  .qwui-list_remarks .qwui-list_user_name{
    display: inline-block;
    padding-right: 20px;
  }
  .qwui-list_check_box{
    position: relative;
    left: 0;
    bottom: 0;
    width: 30px;
  }
  .qwui-list_check_box input{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    visibility: hidden;
  }
.qwui-check_box{
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
  cursor: pointer;
  top: 0;
  bottom: 0;
  margin: auto;
}
.qwui-list_check_box span{
  position: absolute;
  width: 15px;
  height: 15px;
  top: 0;
  bottom: 0;
  border: 1px solid #cacaca;
  border-radius: 4px;
  background: #fff;
  margin: auto;
}

.qwui-check_box input:checked + span{
  background-color: #2f7dcd;
  border:1px solid #2f7dcd;
}

.qwui-check_box input:checked + span:after{
  content: '';
  width: 10px;
  height: 4px;
  position: absolute;
  top: 3px;
  left: 2px;
  border: 2px solid white;
  border-top: none;
  border-right: none;
  border-radius: 1px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
</style>
