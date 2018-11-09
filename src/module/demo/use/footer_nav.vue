<template>
    <div>
        <div class="qwui-tabbar reim_tabbar">
            <a @click="changeFooterNav(item,i)" v-for="(item,i) in footernavdata.nav" class="qwui-tabbar-item" :class="{'qwui-bar-item_on':footernavdata.nav_on==i}">
                <span class="qwui-tabbar-span">
                    <div alt="" class="qwui-ic_reimindex" :class="item.class"></div>
                    <span class="qwui-badge active" v-if="item.num">{{item.num}}</span>
                </span>
                <p class="qwui-tabbar-label">{{item.text}}</p>
            </a>
        </div>
    </div>
</template>

<script>
export default {
  name: 'footer_nav',
  created:function(){

  },
  props:["footernavdata"],
  data(){
    return {

    }
  },
  methods:{
    changeFooterNav(item,i){
      this.footernavdata.nav_on = i;
      if(item.callBack){
        item.callBack(item,i);
      }
    }
  }
}

</script>

<style type="text/css">
	/*底部导航tab开始*/
.qwui-tabbar {
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    background-color: #FFF;
    z-index: 9;
}
.qwui-tabbar-item {
    display: block;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    padding: 5px 0 0;
    font-size: 0;
    color: #999;
    text-align: center;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.qwui-tabbar-span{
    display: inline-block;
    position: relative;
}
.qwui-tabbar-item.qwui-bar-item_on .qwui-tabbar-label{
    color:#4C87CE;
}
.qwui-badge {
    display: inline-block;
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
.qwui-badge.active{
    position: absolute;
    top: -2px;
    right: -13px;
}
.qwui-tabbar-label {
    text-align: center;
    color: #A3A3AC;
    font-size: 10px;
    line-height: 1.5;
}

.qwui-ic_reimindex{
    display: inline-block;
    width: 27px;
    height: 27px;
    background: url(../../../assets/images/ic_reimindex.png) center no-repeat;
    background-size: 108px 108px;
}


/*我的***/
.qwui-tabbar-item .ic_tabar1{
    background-position: 0 0;
}
/*待我审批*/
.qwui-tabbar-item .ic_tabar2{
    background-position: -27px 0;
}
/*我相关的*/
.qwui-tabbar-item .ic_tabar3{
    background-position: -54px 0;
}
/*我的报销*/
.qwui-tabbar-item .ic_tabar4{
    background-position: -81px 0;
}
.qwui-bar-item_on .ic_tabar1{
    background-position: 0 -27px;
}
.qwui-bar-item_on .ic_tabar2{
    background-position: -27px -27px;
}
.qwui-bar-item_on .ic_tabar3{
    background-position: -54px -27px;
}
.qwui-bar-item_on .ic_tabar4{
    background-position: -81px -27px;
}
/*底部导航tab结束*/
</style>
