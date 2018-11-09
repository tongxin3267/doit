<template>
<div>
  <div class="qwui-separate_bar"></div>
  <div class="qwui-setting_detaildata">
        <div class="qwui-setting_inner_f_item" @click="showOrNot()">
            <i class="qwui-icon_fItem "></i>
            <span class="qwui-setting_item_title">{{$t('i18n.advancedSetting')}}</span>
            <span class="qwui-color_grey">
              <span class="qwui-tg_text">{{content}}</span>
              <a class="qwui-click_icon"  :class="{'qwui-click_icon_up': !isShow}"></a>
            </span>
        </div>
        <div class="qwui-setting_inner_f_item qwui-flexbox" v-if="isShow && dataDetailMsg.levelData.show">
            <span class="qwui-setting_item_title">{{$t('i18n.priority')}}</span>
            <div class="qwui-flexItem">
              <select v-model="priority" class="qwui-flexItem qwui-setting_item_select " >
                <option  v-for='(data, index) in dataDetailMsg.levelData.data' :value="data.id" >{{$t(data.level)}}</option>
              </select>
            </div>
        </div>
        <div class="qwui-setting_inner_f_item" v-for="(item, index) in dataDetailMsg.switchControl" v-if="isShow">
          <span class="qwui-setting_item_title">{{$t(item.content)}}</span>
          <div class="qwui-onOff_choose" :class="{'qwui-onOff_on': item.onOff, 'qwui-onOff': !item.onOff}" @click="clickOnOff(index)" ><span class="qwui-onOff_off"  :class="{'active': item.onOff}"></span></div>
        </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'advancedSetting',
  created:function(){
  },
  props:["dataDetailMsg"],
  data(){
    return {
        isShow: false,
        content: this.$t('i18n.expand'),
        priority: 0
    }
  },
  watch: {
    priority: function (val) {
      this.change();
    },
    "dataDetailMsg.option": function (val) { // 草稿编辑页面使用，传入草稿旧数据
      this.priority = val[0]?val[0]:'1';
      for(var i =1;i<6;i++){
        this.dataDetailMsg.switchControl[i-1].onOff = val[i] == '1'? true:false;
      }
    }
  },
  methods:{
    showOrNot(){
        this.isShow = !this.isShow;
        this.content = this.content === this.$t('i18n.expand')? this.$t('i18n.collapse'): this.$t('i18n.expand');
    },
    clickOnOff(index){
        let self = this;
        this.dataDetailMsg.switchControl[index].onOff = !this.dataDetailMsg.switchControl[index].onOff;
        self.change();
    },
    change () {
      var switch_control = [];
      this.dataDetailMsg.switchControl.forEach(function(e){
        e.onOff === true? switch_control.splice(switch_control.length, 0, 1): switch_control.splice(switch_control.length, 0, 0)
      });
      this.$emit("listenToChild", this.priority, switch_control);
    },
  }
}

</script>

<style type="text/css">
.qwui-flexItem {
  flex: 1;
}
.qwui-flexbox {
  display: flex;
}
.qwui-setting_detaildata{position:relative;padding-left:15px;background-color:#fff;}
.qwui-setting_detaildata .qwui-setting_inner_f_item{padding-left:0;line-height: 22px;}
.qwui-setting_detaildata .qwui-setting_inner_f_item:first-child:after{border:none;}
.qwui-setting_detaildata:after{
  content: '';
  position: absolute;
  left:0;
  bottom:0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.qwui-setting_item_title {
  display: -webkit-box;
  flex:1;
  padding-right: 45px;
  color: #333;
  font-size:16px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

}
.qwui-setting_item_select {
  width: 100%;
  padding-right: 20px;
  direction: rtl;
  font-size: 16px;
  color: #666666;
  -webkit-appearance:none;
  outline:none;
  border: none;
  background: url("../../assets/images/icon_arrow_d.png") no-repeat scroll right
  center transparent;
  background-size: 12px 8px;
}
.qwui-setting_inner_f_item {
  display: flex;
  position: relative;
  min-height: 19px;
  padding: 12px 15px;
  color: #333;
  font-size: 14px;
  background: #fff;
}
.qwui-setting_inner_f_item:after{
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
.qwui-click_icon {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 9px;
  height: 15px;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  background:0 0 url("../../assets/images/CSSSprites.png") no-repeat;
  background-size: 100px 100px;
}
.qwui-click_icon.qwui-click_icon_up{
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.qwui-icon_fItem {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
  background: 0 -20px url(../../assets/images/icon-fItem.png);
  background-size: 20px;
}
.qwui-tg_text{
  margin-right: 15px;
  font-size: 13px;
}
.qwui-onOff_off.active{
  left:50%;
}
.qwui-onOff_choose{
  display: block;
  position: absolute;
  right:15px;
  top:15px;
  height: 20px;
  width: 38px;
  border-radius: 10px;
  cursor: pointer;
}
.qwui-onOff {
  background: #bbb;
}
.qwui-onOff_on{
  background: #2f7dcd;
}
.qwui-onOff_off {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
}
.qwui-color_grey{ position: relative;float:right;color: #999;cursor: pointer; }
</style>
