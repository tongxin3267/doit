<template>
<div class="main">
  <div class="searchBox">
    <h1 class="searchTitle">企业信息查询</h1>
    <div class="searchItem">
      <input
        v-model="keyWord"
        class="searchInput"
        type="text"
        placeholder="输入CorpID、手机号码或名称关键字" @keyup.enter="search()">
      <span class="searchBtn" @click="search">
        <img class="searchIcon" src="../../../assets/images/ic_search_sm.png">
      </span>
    </div>
    <p class="noResultTip" v-if="noResultShow">没有找到相关记录，请重试</p>
  </div>
</div>

</template>

<script>
  import { getCompany,getCompanyDetailList } from '../api/getData'

  export default {
    name: "enterprise-search",
    data(){
      return {
        keyWord:'',
        List: null,
        noResultShow: false,
       }
    },
    created(){
      _.hideLoading()
      this.search()
    },
    watch: {
    },
    methods: {
      search() {
        if(this.keyWord===''){ return }
        let self = this
        if(_.isAndroid()||_.isIOS()) {
          getCompany(this.keyWord, function (list) { //手机端
            if (!list) {
              self.noResultShow = true
              return
            }
            if (list.length === 1) {
              self.$router.push({path: 'detail', name: 'enterpriseDetail', params: {corpId: list[0].corpId}})
              return
            }
            if (list.length > 1) {
              self.$router.push({path: '/list', name: 'enterpriseList', query: {keyWord: self.keyWord}})
            }
          })
        } else {
          getCompanyDetailList(this.keyWord, function (list) {
            if (!list) {
              self.noResultShow = true
              return
            }
            if (list.length === 1) {
              self.$router.push({path: 'detail', name: 'enterpriseDetail', params: {corpId: list[0].corpId}})
              return
            }
            if (list.length > 1) {
              self.$router.push({path: '/list', name: 'enterpriseList', query: {keyWord: self.keyWord}})
            }
          })
        }
      },
    },
    components: {
    }
  }
</script>

<style scoped>
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
  .searchInput {
    width: 100%;
    padding: 10px 55px 10px 10px;
    height: 45px;
    line-height: 45px;
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
    top: 0;
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
