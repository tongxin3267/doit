<template>
  <div class="main">
  <div class="searchBox">
  <h1 class="searchTitle">企微研发数据查询</h1>
  <div class="searchItem">
    <span class="dataSourceTitle">数据源：</span>
    <select v-model="dataSource" class="dataSourceStyle" id="">
      <option value="MAIN_READONLY">主库(只读)</option>
      <option value="CRM_READONLY">CRM库(只读)</option>
      <option value="FORM_READONLY">表单库(只读)</option>
      <option value="CHECKWORK_READONLY">考勤库(只读)</option>
  </select>
  <textarea
      @keydown.enter.shift.prevent="search"
      v-model="keyWord"
      class="searchTextarea"
      type="text"
      placeholder="输入SQL查询语句,shift+Enter键快速查询"
      ></textarea>
  <span class="searchBtn" @click="search">
    <span class="searchIcon"></span>
  </span>
  </div>
  <p class="noResultTip" v-if="noEnterShow">请输入查询语句</p>
  </div>
  </div>

</template>

<script>

  export default {
    name: "select-home",
    data(){
      return {
        dataSource:'MAIN_READONLY',
        keyWord:'',
        List: null,
        noEnterShow: false,
      }
    },
    created(){
      _.hideLoading()
    },
    methods: {
      search() {
        if (!this.keyWord){
          this.noEnterShow = true;
          return;
        }

        //路由传参
        this.$router.push({
          path:'list',
          name:'selectList',
          params: {dataSource:this.dataSource,sql:this.keyWord}
        });
      }
    }
  }
</script>

<style scoped>
  .dataSourceTitle{
    font-size: 20px;
    font-weight:bold;
  }
  .dataSourceStyle{
    margin-bottom: 5px;
    width: 100px;
    height: 25px;
    line-height: 25px;
    font-size: 16px;
  }
  .searchBox {
    padding: 0 20px;
  }
  .searchTitle {
    font-size:30px;
    margin-top: 156px;
    margin-bottom: 40px;
    text-align: center;
    color:#5077AA;
    font-weight: 500;
  }
  .searchTextarea {
    width: 100%;
    padding: 10px 55px 10px 10px;
    height: 100px;
    /*line-height: 45px;*/
    font-size: 18px;
    box-sizing: border-box;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  .searchItem {
    position: relative;
  }

  .searchBtn {
    position: absolute;
    right: 0;
    top: 90px;
    width: 45px;
    height: 45px;
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
  .noResultTip {
    font-size: 16px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    margin-top: 5px;
    color: #333;
    background-color: #EBEBEB;
    border-radius: 4px;
  }
</style>
