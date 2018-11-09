<template>
  <div class="popupBg" v-show="childView.show">
    <div class="form-content">
      <div class="form-group" v-for="field in childSchema" v-show="isFieldVisible(field)">
        <div class="form-label" v-if="field._type!='SectionBreak'"><label class="control-label">{{ field.label }}</label><span v-show="field.validations&&field.validations.indexOf('presence')!=-1" class="colorRed"> *</span></div>
        <component v-bind:is="getFieldComponent(field)" :field="field"  @change="setChildValue"></component>
        <div class="help-block" :id="'msg'+field._id">
          <div v-if="field.help" >{{ field.help }}</div>
        </div>
      </div>
    </div>
    <div class="foot-tools">
      <button class="btn" style="marin-top:50px;" @click="hideView">取消</button>
      <button class="btn" style="marin-top:50px;" @click="setValue">确定</button>
    </div>
  </div>
</template>

<script>


import TextField from './fields/textField'
import TextAreaField from './fields/textAreaField'
import RadioButtonField from './fields/radioButtonField'
import CheckBoxField from './fields/checkBoxField'
import DropDownField from './fields/dropDownField'
import NumberField from './fields/numberField'
import EmailField from './fields/emailField'
import TelephoneField from './fields/telephoneField'
import CityField from './fields/cityField'
import MobileField from './fields/mobileField'
import EquationField from './fields/equationField'
import CascadeDropDown from './fields/cascadeDropDown'
import RatingField from './fields/ratingField'
import DateField from './fields/DateField'
import TimeField from './fields/TimeField'
import ImageField from './fields/imageField'
import ImageRadioButton from './fields/imageRadioButton'

import fieldMap from './data/fieldMap'
export default {
  components:{
    TextField,
    TextAreaField,
    RadioButtonField,
    CheckBoxField,
    DropDownField,
    NumberField,
    EmailField,
    TelephoneField,
    CityField,
    MobileField,
    EquationField,
    CascadeDropDown,
    RatingField,
    DateField,
    TimeField,
    ImageField,
    ImageRadioButton
  },
  data () {
    return {

    }
  },
  computed:{
    childView () {
      return this.$store.state.formBase.childView
    },
    childSchema (){
      return this.$store.state.formBase.childSchema
    },
  },
  mounted(){
  },
  methods:{
    isFieldVisible(){
      return true;
    },
    getFieldComponent(field){

      var component = fieldMap[field._type]||'textField'
      console.log(component);
      return  component;
    },
    hideView(){
      this.childView.show = false;//重置子表view
      this.$store.commit('resetChildView');
    },
    //change触发
    setChildValue(val){
      //点击确定才保存数据
      this.$store.commit('setChildValue',val)
    },
    //设置子表单的数据(编辑和新增数据)1. 修改this.field.value的值（就是state的data的schema），2.修改state的data的数据
    setValue(){
      //获取子表的数据
      var childSchema =  this.childSchema;
      //编辑表单的返回的数据
      var childData = {};
      childSchema.forEach(item =>{
        childData[item._id] = item.value;
      })
      console.log(childData);
      //获取父表的id，对子表单的数据修改
      var parentId = this.childView.parentId;
      var index = this.childView.index;
      var formData = this.$store.state.formBase.data;
      //父表单的数据,修改state的data //data和this.field.value同一个引用
      var old = formData[parentId]||[];
      if(index!=null){
        old[index]=childData;//修改(编辑)data的数据
      }else{
        old.push(childData);//新增数据
      }
      //重新设置父表单的数据
      this.$store.commit('setValue',{key:parentId,value:old});
      //重新渲染子表单的view显示(childField根据数据重新渲染)
      this.$root.EventBus.$emit('changeChildView');
      this.hideView();
    }
  },

}
</script>
<style>
  .popupBg{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 100;
    padding-bottom:50px;
    overflow-y:scroll;
    overflow-x:hidden;
  }
  .foot-tools{
    position:fixed;
    bottom:0;
  }

</style>
