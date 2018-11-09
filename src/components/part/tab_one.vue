<template>
  <div class="qwui-footer_tab_item" @click="tabOneClick" :class="[activeFilter,defaultColor]">
    <span class="qwui-footer_tab_box">
      <i class="qwui-iconfont iconfont" :class="icon? icon:''"></i>
      <span class="qwui-footer_tab_num" v-if="num && num>0">{{num}}</span>
    </span>
    <p class="qwui-tab_text">{{tab}}</p>
  </div>
</template>
<script>
  export default {
    name: "TabOne",
    props:{
      tab:{
        type:String,
        required:true
      },
      icon:{
        type:String,
        required:true
      },
      index:{
        type:[String,Number],
        required:true
      },
      activeIndex:{
        type:[String,Number],
        required:true
      },
      num:{
        type:Number,
        required:false
      },
      defaultColor:{
        type:String,
        default:"icon-LightBlue"
      }
    },
    data() {
      return {
      }
    },
    computed:{
      activeFilter(){
        return this.index==this.activeIndex? 'active':"";
      }
    },
    methods:{
      tabOneClick(){
        if(this.index!=this.activeIndex){
          this.$emit("tabOneClick",true);
        }
      }
    }
  }
</script>
<style>
  .qwui-footer_tab_item{
    flex: 1;
    font-size: 0;
    color: #999;
    text-align: center;
    cursor: pointer;
  }
  .qwui-footer_tab_box{
    display: inline-block;
    position: relative;
  }
  .qwui-tab_text{
    text-align: center;
    color: #A3A3AC;
    font-size: 10px;
    line-height: 1.5;
  }
  .qwui-footer_tab_num{
    display: inline-block;
    position: absolute;
    top: -2px;
    right: -13px;
    padding: 2px 5px;
    min-width: 8px;
    border-radius: 18px;
    background-color: #EB5342;
    color: #FFF;
    line-height: 1.2;
    text-align: center;
    font-size: 12px;
    vertical-align: middle;
  }
  .qwui-iconfont{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    width: 27px;
    height: 27px;
  }
  /*浅蓝色*/
  .qwui-footer_tab_item.active.icon-LightBlue{
    color: #1BA4EB;
  }
  .qwui-footer_tab_item.active.icon-LightBlue .qwui-tab_text{
    color: #1BA4EB;
  }
  /*天蓝色*/
  .qwui-footer_tab_item.active.icon-skyBlue .iconfont{
    color: #45A8F5;
  }
  .qwui-footer_tab_item.active.icon-skyBlue .qwui-tab_text{
    color: #45A8F5;
  }
     /*深蓝色的*/
  .qwui-footer_tab_item.active.icon-NavyBlue {
    color:#387AC9;
  }
  .qwui-footer_tab_item.active.icon-NavyBlue .qwui-tab_text{
    color:#387AC9;
  }
  .qwui-footer_tab_item.active
  .qwui-icon_footer{
    display: inline-block;
    width: 27px;
    height: 27px;
    background: url(../../assets/images/ic_reimindex.png) no-repeat;
    background-size: 108px 108px;
  }

  /*我的***/
  .qwui-icon_tab1{
    background-position: 0 0;
  }
  .qwui-footer_tab_item.active .qwui-icon_tab1{
    background-position: 0 -27px;
  }

  /* crm图标 */
  .crm-icon_base{
      display: inline-block;
      width: 27px;
      height: 27px;
      background: #ccc;
      background: url(../../assets/images/crm/icon_tabCrm.png);
      background-size: 189px 54px;
  }
  .crm-icon_allClient_gray{
      background-position: 0 0;
  }
  .crm-icon_allClient_blue{
      background-position: 0 -27px;
  }
  .crm-icon_toPerson_gray{
      background-position: -27px 0;
  }
  .crm-icon_toPerson_blue{
      background-position: -27px -27px;
  }
  .crm-icon_ccPerson_gray{
      background-position: -54px 0;
  }
  .crm-icon_ccPerson_blue{
      background-position: -54px -27px;
  }
  .crm-icon_createPerson_gray{
      background-position: -81px 0;
  }
  .crm-icon_createPerson_blue{
      background-position: -81px -27px;
  }
  .crm-icon_allContact_gray{
      background-position: -135px 0;
  }
  .crm-icon_allContact_blue{
      background-position: -135px -27px;
  }
  .crm-icon_allVisit_gray{
      background-position: -162px 0;
  }
  .crm-icon_allVisit_blue{
      background-position: -162px -27px;
  }
  .crm-icon_allBusiness_gray{
      background-position: -108px 0;
  }
  .crm-icon_allBusiness_blue{
      background-position: -108px -27px;
  }
</style>
