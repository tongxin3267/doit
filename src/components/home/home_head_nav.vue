<template>
  <div class="qwui-home_head">

    <!--头部菜单垫高块-->
    <div class="qwui-nav_box_height" v-if="footerIndex == 0"></div>

    <!--搜索框垫高块-->
    <div class="qwui-search_box_height" v-if="headrdata.searchBar.show"></div>

    <!--头部菜单-->
    <div class="qwui-nav_box_fixed">
      <transition name="slide-fade">
        <div class="qwui-nav_box" v-if="headrdata.show && footerIndex == 0">
          <div class="qwui-nav_box_content" v-for="item in headrdata.nav">
            <router-link :to="item.url">
              <div class="qwui-nav_box_radius">
                <i class="qwui-nav_box_icon" :class="item.class"></i>
              </div>
              <p class="qwui-nav_box_text">{{$t(item.text)}}<span v-if="item.num">({{item.num}})</span></p>
            </router-link>
          </div>
        </div>
      </transition>

      <!--搜索框-->
      <search_box :searchinput="headrdata.searchBar" v-on:listenToSearchBox="showMsgFromSearchBox" v-if="headrdata.searchBar.show"></search_box>
    </div>
  </div>
</template>

<script>
  import search_box from '@/components/base/search_box';

  export default {
    name: 'home_head',
    props:{
      headrdata:Object,
      footerIndex:Number
    },
    data(){
      return {
      }
    },
    methods:{
      // 这里是搜索框的返回keyWord
      showMsgFromSearchBox:function (keyWord, val) {
        this.$emit("getSearchRequest", keyWord, val);
      },
    },
    components:{
      search_box
    }
  }

</script>

<style type="text/css">
  .qwui-home_head .qwui-nav_box_height{
    height: 100px;
  }
  .qwui-home_head .qwui-search_box_height{
    height: 43px;
  }
  .qwui-home_head .qwui-nav_box_fixed{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10
  }
  .qwui-home_head .qwui-nav_box{
    display: flex;
    width: 100%;
    height: 100px;
    background-color: #5077AA;
  }
  .qwui-home_head .qwui-nav_box_content{
    flex: 1;
    padding: 15px 0 10px;
    text-align: center;
  }
  .qwui-home_head .qwui-nav_box_content a{
    display: block;
  }
  .qwui-home_head .qwui-nav_box_radius{
    width: 50px;
    height: 50px;
    margin:auto;
    border-radius: 100%;
    background: #fff;
  }
  .qwui-home_head .qwui-nav_box_text{
    margin-top: 10px;
    line-height: 1;
    color: #fff;
  }
  .qwui-home_head .qwui-nav_box_icon{
    display: block;
    width: 22px;
    height: 22px;
    margin: 0 auto;
    padding-top: 28px;
  }
  .qwui-home_head .qwui-nav_box .ic_add{
    background: url(../../assets/images/ic_new1.png) center no-repeat;
    background-size: 22px 22px;
  }
  .qwui-home_head .qwui-nav_box .ic_draft{
    background: url(../../assets/images/ic_draft1.png) center no-repeat;
    background-size: 22px 22px;
  }
  .qwui-home_head .qwui-nav_box .ic_favourite{
    background: url(../../assets/images/ic_favourite.png) center no-repeat;
    background-size: 22px 22px;
  }
  .qwui-home_head .slide-fade-enter-active {
    transition: all .2s ease;
  }
  .qwui-home_head .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .qwui-home_head .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    margin-top: -100px;
    opacity: 0;
  }
</style>
