<template>

    <!--头部菜单-->
    <div class="qwui-nav_box_fixed">
        <div class="qwui-nav_box">
          <div class="qwui-nav_box_content" v-for="(item,idx) in headrdata.nav" :key="idx" @click="linkUrl(item)">
              <div class="qwui-nav_box_radius">
                <i class="qwui-nav_box_tip" v-if="item.value != ''">{{item.value}}</i>
                <i class="qwui-nav_box_icon" :class="item.class">
                </i>
              </div>
              <span class="qwui-nav_box_text">{{item.text}}</span>
          </div>
          <div class="qwui-nav_box_create" v-on:click="show = !show"><P class="qwui-nav_box_text">新建</P></div>
          <transition name="slide-fade">
              <div class="qwui-add_nav" v-if="show">
                <div class="qwui-add_main">
                  <p class="qwui-add_main_title">创建新的</p>
                  <div class="qwui-add_main_clearfix">
                  <div class="qwui-nav_box_content add_content" v-for="(item,idx) in headrdata.addnav" :key="idx" @click="linkUrl(item)">
                    <div class="qwui-nav_box_radius">
                      <i class="qwui-nav_box_icon" :class="item.class">
                      </i>
                    </div>
                    <span class="qwui-nav_box_text">{{item.text}}</span>
                  </div>
                </div>
                </div>
                <span class="qwui-add_close" v-on:click="show = false">
                    <i></i>
                </span>
              </div>
          </transition>
        </div>
    </div>
</template>

<script>
import { getCrmBriefing } from '../../api/client/getData'
export default {
  name: 'crm_head_nav',
  components:{
  },

  props:{
    headrdata:Object,
  },
  data(){
    return {
      isShow: false,
      headData:this.headrdata,
      show: false,
      logVO:{}
    }
  },
  mounted() {
    getCrmBriefing((data) => {
      var arr = [];// arr是返回数据的对象转成的数组
      var temp = [];// temp存储返回的参数
      for (let i in data.logVO) {
          temp.push(data.logVO[i])
          arr.push(i);
      }
      var len = arr.length;
      for(let i = 0;i<len;i++){
        if(this.headData.nav[i].name){//把有name值得参数循环出来
          for(let j = 0;j<this.headData.nav.length;j++){
            if(arr[j]===this.headData.nav[i].name){
              this.headData.nav[i].value=temp[j]
            }
            if(this.headData.nav[i].value!=0||this.headData.nav[i].value!=''){
              this.isshow = true
            }
          }
        }
      }
    });
  },
  methods:{
    linkUrl(item){
      if (item.url.includes('jsp')) {
        location.href = _.baseURL + item.url;
      } else {
        this.$router.push({path: item.url});
      }
    }
  }
  }

</script>

<style>

  /* 头部导航栏 */
   .qwui-nav_box_height{
    height: 100px;
  }
   .qwui-nav_box_fixed{
    width: 100%;
    z-index: 10
  }
   .qwui-nav_box{
    display: inline-block;
    width: 100%;
    height: 100%;
    padding-top: 25.875px;
    background-color: #5077AA;
  }
   .qwui-nav_box_content{
    display:inline-block;
    flex: 1;
    width:25%;
    padding: 20px 0 10px;
    text-align: center;
  }
   .add_content{
    width:33.33%;
  }
   .qwui-nav_box_content a{
    display: block;
  }
   .qwui-nav_box_radius{
    position: relative;
    margin:auto;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: #fff;
  }
   .qwui-nav_box_text{
    display:inline-block;
    height:15px;
    margin-top:10px;
    line-height:15px;
    font-size:1.3rem;
    font-family:PingFangSC-Regular;
    color:rgba(255,255,255,1);
    }
   .qwui-nav_box_tip{
    position: absolute;
    top: -.8rem;
    left: 2.5rem;
    padding: .3rem .5rem;
    color: #fff;
    font-style: normal;
    text-align: center;
    font-size: 1.5rem;
    line-height: 1.3rem;
    background-color: #ff3333;
    border-radius: 3.45rem;
    }
   .qwui-nav_box_icon{
    display: block;
    width: 27px;
    height: 27px;
  }
   .qwui-nav_box_create{
    width:100px;
    height:36px;
    margin:20px auto 24px auto;
    text-align:center;
    border-radius:18px;
    border:1px solid rgba(224,234,244,1);
    cursor:pointer;
  }
   .qwui-nav_box .ic_sea{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmghc.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_customer{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmkh.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_contact{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmlxr.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_visit{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmbf.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_bussiness{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmsj.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_agreenment{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmht.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_data{
    position: absolute;
    top: 11px;
    left: 11px;
    background: url(../../../../assets/images/crm/icon_home_crmsjkb.png) center no-repeat;
    background-size: 100% 100%;
  }
   .qwui-nav_box .ic_check{
      position: absolute;
      top: 11px;
      left: 11px;
      background: url(../../../../assets/images/crm/icon_home_crmcc.png) center no-repeat;
      background-size: 100% 100%;
    }
   .slide-fade-enter-active {
    transition: all .2s ease;
  }
   .slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
   .slide-fade-enter, .slide-fade-leave-to {
    margin-top: -100px;
    opacity: 0;
  }
  /* 模糊弹窗 */
  .qwui-add_nav{
    position: fixed;
    left: 0px;
    bottom: 0px;
    width: 100%;
    height: 100%;
    background-color: rgb(51, 51, 51);
    opacity: 0.961;
    z-index: 110;
  }
  .qwui-add_nav .qwui-add_close i{
    position: absolute;
    display: block;
    margin-left: -.35rem;
    bottom: 1.2rem;
    left: 50%;
    width: 1.5rem;
    height: 1.5rem;
    background: url(../../../../assets/images/crm/crm_ico10.png);
    background-size: 100% 100%;
  }
  /* 弹窗动画 */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(100%);
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .qwui-add_nav .qwui-add_main{
    position: absolute;
    top:50%;
    width: 100%;
    transform: translateY(-50%);
  }
  .qwui-add_nav .qwui-add_main_title{
    padding-bottom: 1.5rem;
    font-size: 1.5rem;
    color: #fff;
    text-align: center;
  }
  .qwui-add_close{
    position: absolute;
    display: block;
    bottom: 1.2rem;
    left: 50%;
    margin-left: -.35rem;
    font-size: 1.5rem;
    color:#fff;
  }
  .qwui-add_main_clearfix{
    padding: 1.5rem .9rem;
  }
</style>
