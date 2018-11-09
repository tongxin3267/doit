<template>
<div>
  <div class="qwui-my" v-show="footerTab.nav_on == 1">
    <div class="bg_img"></div>
    <div class="content">
      <div class="head">
        <div class="pic">
          <img :src="headPic"/>
        </div>
        <div class="name">{{userName}}</div>
      </div>
      <div class="more">
        <div class="function" v-for="item in content">
          <span class="description">
            <i :class="item.class"></i>
            {{item.description}}
          </span>
          <span class="link">敬请期待<i></i></span>
        </div>
      </div>
    </div>
  </div>
  <div class="qwui-login" v-show="footerTab.nav_on == 0">
    <div class="img_box">
      <div v-if="tempSrc[0]&&tempSrc[0].coverImage!=''" :style="{background:'url('+tempSrc[0].coverImage+') center no-repeat'}"
           @click="toDetail(0)">
        <span>{{tempSrc[0].title}}</span>
      </div>
      <div v-else class="default_pic_1" @click="toDetail(0)">
        <span v-if="tempSrc[0]&&tempSrc[0].title!=''">{{tempSrc[0].title}}</span>
      </div>
      <div v-if="tempSrc[1]&&tempSrc[1].coverImage!=''" :style="{background:'url('+tempSrc[1].coverImage+') center no-repeat'}"
           class="bg_img_1" @click="toDetail(1)">
        <span>{{tempSrc[1].title}}</span>
      </div>
      <div v-else class="default_pic_2 bg_img_1" @click="toDetail(1)">
        <span v-if="tempSrc[1]&&tempSrc[1].title!=''">{{tempSrc[1].title}}</span>
      </div>
      <div v-if="tempSrc[2]&&tempSrc[2].coverImage!=''" :style="{background:'url('+tempSrc[2].coverImage+') center no-repeat'}"
           class="bg_img_2" @click="toDetail(2)">
        <span>{{tempSrc[2].title}}</span>
      </div>
      <div v-else class="default_pic_3 bg_img_2" @click="toDetail(2)">
        <span v-if="tempSrc[2]&&tempSrc[2].title!=''">{{tempSrc[2].title}}</span>
      </div>
    </div>
    <div class="img_box_slider">
      <div class="span_list">
        <div :class="{'active':index==i}" v-for="i in 3"></div>
      </div>
    </div>
    <div class="menu">
      <div class="itemList" v-for="item in menu">
        <div class="item" v-for="i in item" @click="toIndex(i)">
          <div class="pic">
            <div class="img" :class="['position-'+i.val]"></div>
          </div>
          <p>{{i.text}}</p>
        </div>
      </div>
    </div>
  </div>
  <footer-tab :footerNavData="footerTab" @click="clickFooter"></footer-tab>
</div>
</template>
<script>
  import footerTab from './login/footer.vue'
  import login from '../js/login'
  import {getTypeData, getLoginPictures} from '../api/getData'
  export default {
    data(){
      return{
        content:[
          {
            description:"我的档案",
            class:"doc"
          },
          {
            description:"缴纳党费",
            class:"pay"
          }
        ],
        menu:{
          1:[{text:"党建要闻",val:1,id:''},{text:"党内公示",val:2,id:''},{text:"通知公告",val:3,id:''}],
          2:[{text:"政策法规",val:4,id:''},{text:"三会一课",val:5,id:''},{text:"专题教育",val:6,id:''}],
        },
        footerTab:login.footer,
        index:1,
        userName:_.personName,
        headPic:_.headPic,
        tempSrc:''
      }
    },
    created:function () {
      var _this = this;
      _this.intervalId = setInterval(() => {
        _this.index < 3 ? (_this.index += 1) : (_this.index=1);
      }, 6000);
      this.getLoginData();
      this.getPictures();
    },
    watch:{
      'footerTab.nav_on':function (val) {
        var _this = this;
        if(val == 0){
          _this.index = 1;
          _this.intervalId = setInterval(() => {
            _this.index < 3 ? (_this.index += 1) : (_this.index=1);
          }, 6000)
        }else{
          clearInterval(_this.intervalId)
        }
      }
    },
    methods:{
      //首页的类型
      getLoginData:function () {
        getTypeData( (result) =>{
          let temp = result.typeList
          this.menu[1].forEach(function (e,index) {
            e.id = temp[index]
          })
          this.menu[2].forEach(function (e,index) {
            e.id = temp[index+3]
          })
        })
      },
      //首页轮播图
      getPictures:function () {
        getLoginPictures( (result) =>{
          result.articleSummaryList.forEach(function (e) {
            e.coverImage != '' ? (e.coverImage = (_.compressURL+ e.coverImage).replace('/compress/', '/')):''
          })
          this.tempSrc = result.articleSummaryList;
        })
      },
      //轮播图跳到详情
      toDetail:function (index) {
        if(this.tempSrc[index]) {
          this.$router.push({
            path: '/partyDetail',
            query: {id: this.tempSrc[index].id, page: index + 1}
          })
        }
      },
      clickFooter:function (val) {
      },
      toIndex:function (i) {
        this.$router.push({
          path: '/index',
          query:{ id:i.id, name:i.text}
        })
      }
    },
    components:{footerTab}
  }
</script>
<style src="../scss/login.scss" lang="scss">
</style>
