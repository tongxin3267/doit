<template>
  <div class="qwui-user_show_box" v-show="showPerson">
    <div class="qwui-user_select_charge" v-show="item.show" v-for="(item,index) in userselect">
      <div class="qwui-user_select_title">{{$t(item.title)}}<span class="person_num" v-if="item.num">{{userTitleType(item)}}</span></div>
      <div class="qwui-user_select_item qwui-user_show_scroll" :style="styleHeight">
        <div class="qwui-user_select_list">
          <ul>
            <li v-for="(list,i) in item.userSelected">
              <p class="img" @click.stop.prevent="showPersonDetail(item,list)" :class="{'active':list.headPic=='0'||list.headPic==''}">
                <img v-if="list.headPic!='0' && list.headPic!=''" :src="list.headPic"  alt="">
              </p>
              <p class="qwui-user_select_person">{{list.personName}}</p>
            </li>
          </ul>
        </div>
        <div class="qwui-user_footer_height"></div>
      </div>
      <div class="qwui-user_btn">
        <a class="qwui-user_btn_back" @click="showPersonBack(item)">{{$t('i18n.returnBack')}}</a>
      </div>
    </div>
  </div>
</template>
<script>
  import EventBus from '@/utils/eventBus';
  export default {
    name: 'userShow',
    props:{
      userselect:Object
    },
    data() {
      return {
        styleHeight:{}//页面高度
      }
    },
    created:function () {
      if(document.documentElement.clientHeight>0){
        this.styleHeight={
          height:document.documentElement.clientHeight-40+'px'
        }
      }
    },
    watch:{
      "userselect.toPersonList.show":function (val) {
        this.showRelatived(val);
      },
      "userselect.ccPersonList.show":function (val) {
        this.showRelatived(val);
      }
    },
    computed:{
      showPerson(){
        if(this.userselect.toPersonList || this.userselect.ccPersonList){
            return this.userselect.toPersonList.show || this.userselect.ccPersonList.show;
        }
        return false;
      }
    },
    methods:{
      showRelatived(val){
        if(val){
          document.getElementsByTagName("body")[0].style.cssText = "overflow-y: hidden;";
          document.body.style.cssText = "overflow-y: hidden;";
        }else{
          document.getElementsByTagName("body")[0].style.cssText = "";
          document.body.style.cssText = "";
        }
        document.body.scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
        window.scroll(0, document.documentElement.scrollTop||document.body.scrollTop);
      },
      userTitleType:function(item){
        if(item.num && item.num>=0){
          return '('+item.num+')';
        }
        return "";
      },
      showPersonBack:function (item) {
        item.show=!item.show;
      },
      showPersonDetail:function (item,list){
        if(list.userId!=_.userId){
          EventBus.$emit("showPersonUtil",item,list);
        }
      }
    }
  }
</script>
<style>
  .qwui-user_show_box{
    position: fixed;
    z-index: 9;
    top: 0;
    left:0;
    bottom: 0;
    width: 100%;
    background: #fff;
    overflow: hidden;
  }
  .qwui-user_show_scroll{
    overflow-y: scroll;
  }
  .qwui-user_btn{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 8px 15px;
    background: #fff;
  }
  .qwui-user_btn:before{
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    box-sizing: border-box;
  }
  .qwui-user_btn_back{
    display: block;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    color: rgba(51,51,51,1);
    text-align: center;
    text-decoration: none;
    background: rgba(251,250,252,1);
    line-height: 44px;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
  }
  .qwui-user_footer_height{
    height: 60px;
  }
  .qwui-user_btn_back:after{
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
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 10px;
  }
</style>
