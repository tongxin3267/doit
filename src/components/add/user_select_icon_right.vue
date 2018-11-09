<template>
  <div>
    <div class="qwui-separate_bar"></div>
    <div class="qwui-detaildata">
        <div class="qwui-inner_f_item">
          <span class="qwui-f_item_title">{{$t('i18n.approver')}}</span>
          <p class="qwui-inner_selected_item" @click="selectPersonList('toPersonList')">
            <span class="qwui-inner_selected_num" v-show="toSelected && toTotalUser>0">{{$t('i18n.selected')}} {{toTotalUser}} {{$t('i18n.members')}}</span>
            <span class="qwui-click_icon qwui-click_icon_right"></span>
          </p>
        </div>
        <div class="qwui-inner_f_item">
          <span class="qwui-f_item_title">{{$t('i18n.cc')}}</span>
          <p class="qwui-inner_selected_item" @click="selectPersonList('ccPersonList')">
            <span class="qwui-inner_selected_num" v-show="ccSelected && ccTotalUser>0">{{$t('i18n.selected')}} {{ccTotalUser}} {{$t('i18n.members')}}</span>
            <span class="qwui-click_icon qwui-click_icon_right"></span>
          </p>
        </div>
    </div>
</div>

</template>

<script>
export default {
  name: 'separateBar',
  props:["selectconfig"],
  data(){
    return {
      toTotalUser:0,
      ccTotalUser:0,
    }
  },
  created:function(){
    this.selectconfig.show=false;
    this.selectconfig.signIndex="";
    this.selectconfig.selectList["toPersonList"].callBack.confirm = this.confirmSelect;
    this.selectconfig.selectList["ccPersonList"].callBack.confirm = this.confirmSelect;
  },
  computed:{
    toSelected(){
      this.countTotalUser("toPersonList",this.selectconfig.selectList["toPersonList"].userSelected,this.selectconfig.selectList["toPersonList"].deptSelected);
      return true;
    },
    ccSelected(){
      this.countTotalUser("ccPersonList",this.selectconfig.selectList["ccPersonList"].userSelected,this.selectconfig.selectList["ccPersonList"].deptSelected);
      return true;
    }
  },
  methods:{
    selectPersonList(type){
      this.selectconfig.show=true;
      this.selectconfig.signIndex=type;
    },
    confirmSelect(el,obj){ //确定选择
      this.$emit("selectPerson",el,obj);
    },
    //统计部门、人员的总数
    countTotalUser(type,user,dept){
      var totalUser=0;
      if(user && user.length>0){
        totalUser+=user.length;
      }
      if(dept && dept.length>0){
        for(var i=0;i<dept.length;i++){
          if(dept[i].totalUser>0){
            totalUser+=Number(dept[i].totalUser);
          }
        }
      }
      type=="toPersonList"? this.toTotalUser=totalUser:false;
      type=="ccPersonList"? this.ccTotalUser=totalUser:false;
    }
  }
}

</script>

<style type="text/css">
  .qwui-click_icon.qwui-click_icon_right{
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .qwui-inner_selected_item{
    position: relative;
    display: flex;
    flex: 1;
    font-size: 16px;
    color: #666;
    text-align: right;
    outline: none;
    border: none;
    cursor: pointer;
    -webkit-appearance: none;
  }
  .qwui-inner_selected_num{
    flex: 1;
    padding-right: 15px;
  }
.qwui-detaildata{padding-left:15px;background-color:#fff;}
.qwui-detaildata .qwui-inner_f_item{padding-left:0;line-height: 22px;}
.qwui-detaildata .qwui-inner_f_item:first-child:after{border:none;}
.qwui-f_item_title {
  margin-right: 10px;
  color: #333;
  font-size:16px;
}
.qwui-inner_f_item {
  display: flex;
  position: relative;
  min-height: 19px;
  padding: 12px 15px;
  color: #333;
  font-size: 14px;
  background: #fff;
}
.qwui-inner_f_item:after{
  content: '';
  position: absolute;
  left:0;
  top: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
</style>
