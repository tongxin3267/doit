<template>
  <div class="mainStyle">
    <header class="qwui-nav_box_fixed">
      <div>
        <span class="pramTitle">数据源：</span>
        <select v-model="dataSource" class="dataSource">
          <option value="MAIN_READONLY">主库(只读)</option>
          <option value="CRM_READONLY">CRM库(只读)</option>
          <option value="FORM_READONLY">表单库(只读)</option>
          <option value="CHECKWORK_READONLY">考勤库(只读)</option>
        </select>
      </div>
      <textarea
        @keydown.enter.shift.prevent = "showResult()"
        v-model="sql"
        type="text"
        placeholder="输入SQL查询语句,shift+Enter键快速查询"
        class="searchTextarea"></textarea>
      <span class="searchBtn" @click="showResult">
        <span class="searchIcon"></span>
      </span>
    </header>
    <div class="resultStyle" v-if="listNum" v-for="(value,index) in listArr">
      <div class="searchResult">
        <p class="sqlStyle">
          <span class="pramTitle">SQL语句:</span>
          <span>{{sqlArr[index]}}</span>
        </p>
        <span class="pramTitle">共有{{value.length}}条数据</span>
        <span class="showHide" @click="showHide(index)">{{showArr[index]?'折叠':'展开'}}列表>></span>
        <span class="delData" @click="delResult(index)">×</span>
        <div class="tableStyle">
          <table class="tableContent" v-show="showArr[index]">
            <thead>
            <tr class="trStyle">
              <th v-for="(value, key) in value[0]">{{key}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in value">
              <td v-for="items in item">{{items | isTime}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {getSelectResult} from '../api/getData';
  import * as timeUtil from '../../../../src/assets/js/time-util';
  export default {
    name: "selectList",
    data(){
      return {
        dataSource: 'MAIN_READONLY',//数据源
        sql:'',//sql语句
        sqlArr:[],//sql语句数组
        listArr:[],//列表数据
        listNum:0,//列表数量
        showArr:[],//列表展示与隐藏
      }
    },
    created(){
      if (this.$route.params.sql){
        this.dataSource = this.$route.params.dataSource;
        this.sql = this.$route.params.sql;
      }
      this.showResult();
    },
    methods: {
      showResult(){
        let self = this;
        if (this.sql){
          getSelectResult(this.dataSource,this.sql,function (list) {
            self.sqlArr.unshift(self.sql);
            self.listArr.unshift(list);
            self.listNum += 1;
            self.showArr.splice(0,0,true);
          })
        }
      },
      delResult(index){
        this.listArr.splice(index,1);
        this.showArr.splice(index,1);
        this.listNum -= 1;
      },
      showHide(index){
        this.showArr.splice(index,1,!this.showArr[index]);
      }
    },
    filters:{
      isTime:function (items) {
        if (items && items.time){
          return timeUtil.changeFormat(new Date(items.time),'yyyy-MM-dd hh:mm:ss');
        }else {
          return items;
        }
      }
    }
  }
</script>

<style scoped>
  .mainStyle{
    padding-top: 130px;
  }
  .pramTitle{
    font-size: 16px;
    font-weight:bold;
  }
  .dataSource{
    margin-bottom: 3px;
    width: 100px;
    height: 20px;
    line-height: 20px;
    font-size: 16px;
  }
  .sqlStyle{
    margin:0 30px 10px 0;
    word-wrap:break-word
  }
  .tableStyle{
    width: 100%;
    overflow-x: auto;
  }
  .tableStyle::-webkit-scrollbar{
    width: 8px;
    height: 8px;
  }
  .tableStyle::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: #8e8e8e;
  }
  .tableStyle::-webkit-scrollbar-track{
    border: 1px #eeeeee solid;
    border-radius: 10px;
    background: #eeeeee;
  }
  .tableContent{
    margin-top: 5px
  }
  .trStyle{
    background: #eee;
  }
  .resultStyle{
    padding:0 10px;
  }
  .searchResult {
    position: relative;
    margin: 30px auto;
    padding: 10px;
    width: 100%;
    overflow-x: auto;
    background-color: #fff;
    border:1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .searchResult table{
    border-collapse: collapse;
  }
  .searchResult td,.searchResult th{
    word-wrap:break-word;
    text-align: left;
    height: 45px;
    padding:0 5px;
    border:1px solid #ccc
  }
  .searchTextarea {
    min-height: 100px;
    width: 100%;
    padding: 10px 55px 10px 10px;
    font-size: 14px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }
  .searchBtn {
    position: absolute;
    right: 10px;
    top: 78px;
    width: 45px;
    height: 48px;
    line-height: 45px;
    text-align: center;
    border-radius: 4px;
    background-color: #5077AA;
    cursor: pointer;
  }
  .searchIcon {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    background: url("../../../assets/images/ic_search_sm.png");
    background-size:cover;
  }
  .qwui-nav_box_fixed{
    min-height: 130px;
    position: fixed;
    padding: 0 10px;
    top: 0;
    width: 100%;
    z-index: 10;
    border-bottom: 1px solid #ddd;
    background: #f0f0f0;
    box-sizing: border-box;
  }
  @media screen and (min-width: 1024px){
    .qwui-nav_box_fixed{width: 100% !important;}
    .searchTextarea{width: 100% !important;}
  }
  .delData{
    position: absolute;
    top: 3px;
    right: 5px;
    width: 30px;
    height: 30px;
    line-height: 27px;
    text-align: center;
    font-size: 30px;
    border-radius: 50%;
    background: #ddd;
    color: #fff;
    cursor: pointer;
  }
  .delData:hover{
    background: #ccc;
  }
  .showHide{
    margin-left: 10px;
    font-size: 14px;
    color: #2F7DCD;
    cursor: pointer;
  }
</style>
