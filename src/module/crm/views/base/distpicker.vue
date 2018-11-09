<template>
  <div>
    <div class="qwui-address_box">

      <group>
        <x-address @on-hide="logHide" @on-show="logShow" @input="inputDispicker" :title="title" v-model="value" :popup-title="$t('区域选择')" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择省市区" :show.sync="showAddress"></x-address>
        <span class="qwui-title_distpicker_tip" v-if="districtTipShow">*</span>
      </group>

    </div>
  </div>
</template>

<i18n>
select address:
  zh-CN: 选择地址
</i18n>

<script>
import { Group, XAddress, ChinaAddressV4Data, XButton, Cell, Value2nameFilter as value2name } from 'vux'

export default {
  components: {
    Group,
    XAddress,
    XButton,
    Cell
  },
  // props:['listenDistrictMust'],
  props:{
    listenDistrictMust:'',
    area:'',
  },
  data () {
    return {
      title: '区域',
      districtTipShow: false,
      value_0_1: [],
      value: [],
      value1:[],
      title2: '设置值',
      value2: ['天津市', '市辖区', '和平区'],
      value3: ['广东省', '中山市', '--'],
      values:[],
      addressData: ChinaAddressV4Data,
      value4: [],
      value5: ['广东省', '深圳 市', '南山区'],
      showAddress: false,
    }
  },
  mounted() {
    // this.value = ["440000","440100","440106"];
    let dataBasicList = this.listenDistrictMust.basicList;
    for(let i = 0;i<dataBasicList.length;i++){
      if(dataBasicList[i].optionName === '区域'){
        dataBasicList[i].isMust === '1'?  this.districtTipShow = true : this.districtTipShow = false;
      }
    }
  },
  // 监听区域改变
  watch:{
    // 市辖区跟区县有多个，需做处理
    area(newVal,oldVal){
      for(let i = 0;i<newVal.length;i++){
        for(let j = 0;j<this.addressData.length;j++){
            if(newVal[0] == this.addressData[j].name){
              this.values[0]=this.addressData[j].value
            }
            if(newVal[1] == '市辖区'){
              this.values[1]='500100';
            }else if(newVal[1] == this.addressData[j].name){
              this.values[1]=this.addressData[j].value
            }
            if(newVal[2] == this.addressData[j].name){
              this.values.push(this.addressData[j].value);
              if(this.values.length>3){
                this.value = this.values.slice(0,3)
              }
            }
        }
      }
    }
  },
  methods: {
    doShowAddress () {
      this.showAddress = true
      setTimeout(() => {
        this.showAddress = false
      }, 2000)
    },
    onShadowChange (ids, names) {
      this.$emit('distpickerName',ids,names);
    },
    changeData () {
      this.value2 = ['430000', '430400', '430407']
    },
    changeDataByLabels () {
      this.value2 = ['广东省', '广州市', '天河区']
    },
    changeDataByLabels2 () {
      this.value2 = ['广东省', '中山市', '--']
    },
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    logHide (str) {

    },
    logShow (str) {

    },
    // 选择区域点击确定时触发
    inputDispicker(val){
      for(let j = 0;j<val.length;j++){
        this.addressData.forEach((item) => {
          if(val[j]==item.value){
            this.value1.push(item.name)
          }
        })
      }
      this.$emit('inputDispicker',this.value1)
      this.value1 = []; // 每次将value1清空
    }
  }
}
</script>
<style lang="scss">
.qwui-address_box{
  padding-left:15px;
  background:#fff;
  .vux-popup-picker-placeholder{
    float: left !important;
    font-size: 16px;
    color:#333;
  }
  .qwui-title_distpicker_tip{
    position: absolute;
    top: .6rem;
    left: 2.4rem;
    color: red;
  }
  .vux-cell-primary {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }
  .weui-label{
    display: block;
    width: auto;
    font-size: 13px;
  }
  .weui-cell {
    padding: 10px 15px 32px 0px !important;
    position: relative;
    display: block !important;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .vux-popup-picker-value {
    float: left !important;
  }
  .weui-cells:after {
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    border-bottom:1px solid #e5e5e5 !important;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
  .weui-cell_access .weui-cell__ft:after{
    width: 9px;
    height: 9px;
    border-width: 1px 1px 0 0;
  }
}
</style>
