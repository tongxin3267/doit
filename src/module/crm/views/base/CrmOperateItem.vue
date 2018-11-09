<template>
     <div class="qwui-title_detaildata" v-if="item.status">
      <div
          class="qwui-title_common_text qwui-border_bottom qwui-type"
          :class="{'qwui-title_address': item.showIcon}">
          <div class="qwui-item_mask" v-if="item.showMask || false" @click="clickItem(item.clickEvent)"></div>
          <h4 class="qwui-title_text">
            {{item.optionName}}
            <span class="qwui-title_tip" v-if="item.isMust == 1">*</span>
          </h4>

          <!-- select -->
          <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'select'">
            <select class="qwui-select" :value="value"  @input="handleInput($event)">
              <option selected="selected" value="">请选择</option>
              <option v-for="optionItem in item.list" :key="optionItem.id" :value="optionItem.id">
                {{optionItem.name}}
              </option>
            </select>
            <span class="qwui-click_icon qwui-click_icon_type_right"></span>
          </div>

          <!-- input -->
            <div class="qwui-title_inner_f_item qwui-flexItem" v-if="item.type === 'input'">
              <div class="qwui-input">
                <input
                    type="text"
                    :name="item.key"
                    v-storage="routerName"
                    :value="value"
                    @input="handleInput($event)"
                    class="item_title"
                    :maxlength="item.maxLength"
                    :placeholder="item.placeholder"
                    @blur="clickItem(item.clickEvent)">
                <span class="qwui-click_icon qwui-click_icon_type_right" v-if="item.showArrow || false"></span>
                <span class="qwui-address_icon" v-if="item.showIcon || false" @click="iconEvent(item.iconEvent)"></span>
                <p class="qwui-title_counter" v-show="titleNum > 0" v-if="item.showNumTip || false">
                  {{titleNum}}/{{item.maxLength}}
                </p><br>
                <span v-if="telRepeat" class="error">{{item.errorMsg}}</span>
              </div>

            </div>
            <slot v-if="item.isSlot || false"></slot>




          <!-- textarea -->
          <div class="qwui-tape_box" v-if="item.type === 'textarea'">
            <textarea
                class="item_content"
                :name="item.key"
                v-storage="routerName"
                :value="value"
                :maxLength="item.maxLength"
                @input="updateValue($event.target.value)"
                ref="input" cols="5" rows="1"
                :placeholder="item.placeholder">
            </textarea>
            <p class="qwui-dialog_textarea_counter" v-show="item.value">
              {{item.value|getLength}}/{{item.maxLength}}
            </p>
            <div class="more_function" v-show="templateObj.moreFunctions && templateObj.moreFunctions.length>0">
              <div class="icon-circular" @click="moreFunction(item)" v-for="item in templateObj.moreFunctions" :key="item.id">
                <i class="icon-circular-ic" ></i>
              </div>
              <div class="qwui-tape" :class="{'qwui-tape_play': isTaping}" @click="clickTape()"></div>
            </div>
          </div>

          <!-- 日期 -->
          <group class="qwui-flexItem" v-if="item.type === 'dateTime'">
            <datetime
                v-model="minuteListValueS"
                :clear-text="$t('i18n.today')"
                @on-clear="setTodayS" :format="format"
                @on-change="change"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')">
            </datetime>
          </group>
       </div>
     </div>
</template>
<script>
import time_detail from './time_detail';
import Datetime from 'vux/src/components/datetime';
import Group from 'vux/src/components/group';
import * as timeUtil from '@/assets/js/time-util';
import { getValidClientName,getValidPhone  } from '../../api/client/getData'
export default {
  name: "CrmOperateItem",
  components: {
    time_detail,
    Datetime,
    Group
  },
   // 过滤器
  filters: {
    // 获取textarea的value长度
    getLength(value) {
      return value? value.length: '';
    }
  },
  props: {
    log:'',
    item:{},
    dataDetailMsg:{
      type:Object
    },
    value: {
        type: String,
        default: ''
    },
    editTimeVal:'',
    birthEditTimeVal:'',
    telRepeatMsg:'',
  },
  data(){
    return {
      status: true,
      format:'YYYY-MM-DD HH:mm',
      // minuteListValueS: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd hh:mm'),
      minuteListValueS: '请输入日期',
      minuteListValueE: timeUtil.changeFormat(new Date(), 'yyyy-MM-dd') + ' 22:00',
      resetLimitDate: '',
      address: 'fhdsak',
      keyword:{
        clientName: ''
      },
      params:{
      'tbCrmClientInfoPO.phone':'',
      },
      isMust:1,
      errorShow: false,//判断用户是否存在
      telRepeat: false,//判断电话是否重复
      timeData: [],
      clientDetail: this.clientDetail,
      nav: dataBase.client.clientDetail.nav,
      isShow: true,
      height:300,
      isTaping: false,
      messageNum: 0,//输入框的字数
      templateObj:this.dataDetailMsg,
      routerName: ''
    }
  },
  created () {
    // 获取当前路由名字
    let arr = Object.keys(this.$router.history.current.query);
    // 如果是编辑页则不缓存
    this.routerName = arr.length > 0? '' : this.$router.history.current.name;
    // 判断生日是年月日，其他自定义字段的时间都是默认
    this.item.format ? this.format = this.item.format : this.format = 'YYYY-MM-DD HH:mm'
  },
  mounted() {
    this.$emit('listenToNowTime',this.minuteListValueS);
  },
  computed:{
    titleNum:function () {//标题字数
     return this.item.value.length
    },
    remarkTitleNum:function () {//备注字数
      return this.templateObj.textRemarkTitle.length
    },
    contentNum:function () {//内容字数
      return this.templateObj.content.length
    },
  },
  watch:{
    editTimeVal(newVal,oldVal){
      if(this.item.optionName != '生日' && this.item.type == 'dateTime'){
        this.minuteListValueS = newVal
      }
    },
    birthEditTimeVal(newVal,oldVal){
      if(this.item.optionName == '生日' && this.item.type == 'dateTime'){
        this.minuteListValueS = newVal
      }
    },
    dataDetailMsg: function (val) { // 草稿编辑页面使用，传入草稿旧数据
      this.minuteListValueS = val[0].substring(0,16);
      this.minuteListValueE = val[1].substring(0,16);
    },
    minuteListValueS: function (val) {
      this.resetLimitDate = val.substring(0,10);
    },
    'templateObj.content':function (val) {
      this.$emit("content",val);
    },
    telRepeatMsg(newVal,oldVal){
      if(newVal){
        this.telRepeat = true
      }else{
        this.telRepeat = false;
      }
    }
  },
  methods:{
    // 判断客户是否重命名
    checkClientName(val) {
      this.keyword.clientName = this.item.value;
      getValidClientName(this.keyword, (data)=> {
        data.isRepeat?this.errorShow = true:this.errorShow = false;
      })
    },

    checkPhoneValue(){
      // 判断联系电话红字出现
      if(this.item.optionName == '联系电话'){
        this.params['tbCrmClientInfoPO.phone']=this.item.value;
        return getValidPhone(this.params,(desc) => {
          desc.length>0 ? this.telRepeat = true : this.telRepeat = false;
        })
      }
    },

    change (value) {
      // this.format = 'YYYY-MM-DD';
      this.$emit('listenToTime',value,this.item)
      this.item.value = value;
      // this.$emit('listenToTime',value)
    },
    // 时间判断，客户编码应用
    setDate (valuevalue) {
      let now = new Date()
      let cmonth = now.getMonth() + 1
      let day = now.getDate()
      let hour = now.getHours()
      let minute = now.getMinutes()
      if (cmonth < 10) cmonth = '0' + cmonth
      if (day < 10) day = '0' + day
      if (hour < 10) hour = '0' + hour
      if (minute < 10) minute = '0' + minute
      return now.getFullYear() + '-' + cmonth + '-' + day + ' ' + hour + ':' + minute
    },

    setTodayS (value) {
       this.minuteListValueS = this.setDate();
    },

    setTodayE (value) {
       this.minuteListValueE = this.setDate();
    },

    //时间插件
    showMsgFromTimeDetail:function (startTime, endTime) {
      this.commitDraft.draftFormData['tbQyHomeworkPO.homeworkStart'] = startTime + ':00';
    },

    moreFunction:function(item){ //更多功能
      this.$emit("moreFunction",item);
    },

    setTitle:function () { //选择了option后自动赋值 内容 标题
      var data=null;
      if(this.templateObj.templateTypeId!=""){
        var templateList=this.templateObj.templateType;
        for (var i = 0; i < templateList.length; i++) {
          if (this.templateObj.templateTypeId== templateList[i].id) {
            this.templateObj.title=templateList[i].title?
              templateList[i].title.replace("xxx", _.personName).replace("yyyyMMdd", timeUtil.changeFormat(new Date(),"yyyyMMdd")):
              this.templateObj.title;
            data=templateList[i];
            if(this.templateObj.content && templateList[i].content){
              this.alertReplace(templateList[i]);
            }else{
              templateList[i].content? this.templateObj.content=templateList[i].content:"";
            }
            break;
          }
        }
      }
      this.$emit("listenToChild",data);
    },

    clickTape(){
      this.isTaping = !this.isTaping;
    },

    updateValue:function (value) { //监听textarea控件
      if(value.length<=0){
        this.$refs.input.value=value.substring(0,this.maxLength);
      }
      var len = 0;
      for (var i = 0; i < value.length; i++) {
        var a = value.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        }
        else {
          len += 1;
        }
      }
      if(len/32>=3){
        this.$refs.input.rows=(len/32)>20? 20:len/32;
      }else{
        this.$refs.input.rows=3;
      }
      this.$emit('input',value);
    },

    // input事件
    handleInput (e) {
        this.$emit('input',e.target.value);
    },

    // 点击箭头项
    clickItem (clickEvent) {
        // 存在回调函数才执行
        if(clickEvent){
            clickEvent();
        }
    },

    // 点击icon
    iconEvent (iconEvent) {
        // 存在回调函数才执行
        if(iconEvent){
            iconEvent();
        }
    }
  },

}

</script>

<style lang="scss">
  .pr60{
    padding-right: 60px;
  }
  .error{
    line-height: 20px;
    min-height: 20px;
    font-size:13px;
    color:rgba(255,21,21,1);
  }
  .qwui-select{
    width:100%;
    background:none;
    border:none;
    position:relative;
    padding: 10px 20px 0 0;
    font-size:15px
  }
  .qwui-title_detaildata{background-color:#fff;}
  .qwui-title_detaildata .qwui-type{
    cursor:pointer;
  }
  .qwui-click_icon{
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
    background: 0 0 url(../../../../assets/images/CSSSprites.png) no-repeat;
    background-size: 100px 100px;
  }
  .qwui-click_icon.qwui-click_icon_type_right{
    top: -50%;
    position: absolute;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  .qwui-title_detaildata .qwui-title_inner_f_item{
    display: flex;
    padding-left:0;
    line-height: 22px;
    align-items: flex-end;
    position: relative;
  }
  .qwui-title_detaildata .qwui-title_inner_f_item:first-child:after{border:none;}
  .qwui-title_item_title {
    margin-right: 10px;
    color: #333;
    font-size:16px;
  }
  .qwui-title_detaildata .qwui-title_common_text{
    padding: 10px 14px 10px 0px;
  }
  .qwui-title_common_text .qwui-title_text{
    font-size: 13px;
    color: #666;
    font-weight: 500;
  }
  .qwui-title_common_text .qwui-address_icon{
    background: url(../../../../assets/images/crm/mapMarker_blue.png) no-repeat;
    background-size: 20px 20px;
    background-position: center;
    width: 48px;
    height: 30px;
    line-height: 30px;
    top: 50%;
    margin-top: -15px;
    position: absolute;
    top: 2px;
    right: 0;
    border-left: 1px solid #dadada;
    cursor: pointer;
  }
  .qwui-title_address{
    padding-right: 0 !important;
  }
  .qwui-title_common_text .qwui-title_tip{
    color: red;
  }
  .qwui-title_item_select {
    width: 100%;
    padding-right: 20px;
    direction: rtl;
    font-size: 16px;
    color: #666666;
    -webkit-appearance:none;
    outline:none;
    border: none;
    background: url("../../../../assets/images/icon_arrow_d.png") no-repeat scroll right
    center transparent;
    background-size: 12px 8px;
  }
  .qwui-title_item_select.active{
    padding-right: 0;
    background: #f5f5f5;
  }
  .qwui-title_inner_f_item {
    position: relative;
    min-height: 19px;
    padding-top: 8.5px;
    color: #333;
    font-size: 14px;
    background: #fff;
  }
   .qwui-tape_box:after{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-bottom:none;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .qwui-flexItem {
    flex: 1;
  }
  img{max-width:100%;vertical-align:middle;}
  .qwui-tape{
    position: relative;
    display: none;
    width: 35px;
    height: 35px;
    margin-top: 5px;
    line-height: 35px;
    text-align: center;
    float: right;
    border-radius: 50%;
    clear: both;
    cursor: pointer;
    background:-20px 5px  url("../../../../assets/images/tapeNoPlay.jpg") no-repeat;
    background-size: 60px;
  }
  .qwui-tape_play{
    background:-20px 5px  url("../../../../assets/images/tapePlay.gif") no-repeat;
    background-size: 60px;
  }
  .qwui-title_inner_f_item .item_title{
    float: left;
    flex: 1;
    color: #333;
    width:85%;
    font: normal 16px -apple-system-font,"Helvetica Neue","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  }
  .qwui-title_counter{
    float: right;
    line-height: 27px;
    color: #B2B2B2;
  }
  .qwui-tape_box .item_content{
    width: 100%;
    min-height: 140px;
    max-height: 300px;
    font-size: 16px;
    color: #333;
    border: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .qwui-tape_box{
    position: relative;
    min-height: 19px;
    padding: 12px 15px 40px 0;
    color: #333;
    font-size: 14px;
    line-height: 22px;
    background: #fff;
  }
  .qwui-tape_box .more_function{
    display: inline;
    float: right;
  }
  .icon-circular{
    display: inline-block;
    position: relative;
    width: 35px;
    height: 35px;
    margin:0 10px 5px 0;
    line-height: 35px;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .icon-circular::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 200%;
    height: 200%;
    border: 1px solid #999;
    border-radius: 50%;
    transform: scale(0.5);
    -webkit-transform: scale(0.5);
    transform-origin: 0 0;
    -webkit-transform-origin: 0 0;
    box-sizing: border-box;
  }
  .icon-circular-ic {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../../../../assets/images/icon-circular.png') no-repeat 0 0;
    background-size: 20px;
    vertical-align: middle;
  }
  .select_bg_grey {
    display: flex;
    background-color: #f5f5f5;
  }
  .qwui-tape_box {
    padding: 12px 0 0 0;
  }
  .qwui-tape_box .item_content {
    min-height: 0;
  }
  .weui-cell {
    padding: 0px 15px 32px 0px !important;
    position: relative;
    display: block !important;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .vux-no-group-title {
    margin-top: 0 !important;
  }
  .weui-cells:before {
    border-top: 0 !important;
}
.qwui-title_detaildata .weui-cell_access .weui-cell__ft:after {
    display:none !important;
}
.vux-cell-value {
  color: #999;
  float: left;
}
.qwui-border_bottom:after{
  transform-origin: 0 0;
}
.qwui-item_mask{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}
.qwui-dialog_textarea_counter {
    color: #B2B2B2;
    text-align: right;
    vertical-align: top;
}
.qwui-input{
  width:100%;
}
</style>
