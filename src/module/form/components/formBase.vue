<template>
	<div class="form-content form-bg">
		<div class="form-group" v-for="field in combineList" :key="field.id" v-show="field.show">
			<div class="form-label" v-if="field._type!='SectionBreak'">
				<label class="control-label">{{ field.label}}</label>
				<span v-show="field.validations&&field.validations.indexOf('presence')!=-1 && !field.disabled" class="colorRed"> *</span>
				<span class="form-label-icon fr icon-edit" v-if="field.fieldEdit" @click="setEdit" >
				</span>
				<span class="form-label-icon fr icon-history" v-if="field.history" @click="showHistory(field._id,field.label)"></span>
				<div class="field-notes" v-if="field.notes&&!(field._type=='RatingField'||field._type=='GeoField'||field._type=='RadioButton'||field._type=='CheckBox'||field._type=='ImageField'||field._type=='DropDown'||field._type=='CascadeDropDown'||field._type=='CityField'||field._type=='AccessoryField'||field._type=='ImageRadioButton'||field._type=='SectionBreak')">{{ field.notes }}</div>
			</div>
			<component v-bind:is="getFieldComponent(field)" :field="field" @change="setValue"></component>
			<div class="help-block colorRed" :id="'msg'+field._id" v-if="field.help">{{ field.help }}</div>
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
	import ImageCheckBox from './fields/imageCheckBox'
	import SectionBreak from './fields/sectionBreak'
	import CascadeDropDown from './fields/cascadeDropDown'
	import RatingField from './fields/ratingField'
	import ImageField from './fields/imageField'
	import AccessoryField from './fields/accessoryField'
	import ImageRadioButton from './fields/imageRadioButton'
	import MEMBERCustomerField from './fields/MEMBERCustomerField'
	import DEPTCustomerField from './fields/DEPTCustomerField'
	import CRMCustomerField from './fields/CRMCustomerField'
	import DateField from './fields/DateField'
	import DateTimeField from './fields/DateTimeField'
	import TimeField from './fields/TimeField'
	import ChildField from './fields/childField'
	import FORMREFCustomerField from './fields/FORMREFCustomerField'
	import GeoField from './fields/geoField'

	import fieldMap from './data/fieldMap'
	import {setReadonlyEdit} from '../js/getData'
	import {getHistory} from '../api/list'
	export default {
		name: 'formBase',
		components: {
			TextField,
			TextAreaField,
			RadioButtonField,
			CheckBoxField,
			DropDownField,
			NumberField,
			EmailField,
			TelephoneField,
			MobileField,
			CityField,
			EquationField,
			ImageCheckBox,
			SectionBreak,
			CascadeDropDown,
			RatingField,
			ImageField,
			AccessoryField,
			ImageRadioButton,
			MEMBERCustomerField,
			DEPTCustomerField,
			CRMCustomerField,
			DateField,
			DateTimeField,
			TimeField,
			ChildField,
			FORMREFCustomerField,
			GeoField,
		},
		data() {
			return {}
		},
		computed: {
			combineList() {
				return this.$store.state.formBase.schema
			},
			formData() {
				return this.$store.state.formBase.data
			},
		},


		methods: {
			setEdit(){
				this.$emit('showSaveBtn')
				setReadonlyEdit(this.$store,false);
			},
			getFieldComponent(field) {
				var component = fieldMap[field._type] || 'textField';
				return component;
			},
			setValue(val) {
				this.$store.commit('setValue', val);
				this.$emit('change',val)
			},
			showHistory(id,title){
				this.$emit("historyTitle",id,title)
			},
		},

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	/*表单title*/
	.form_title_box {
		padding:18px 14px 0;
		box-sizing: border-box;
	}
	.form-title-read{
		padding-bottom:	14px;
		font-size: 18px;
		border-bottom:1px solid #e5e5e5;
		line-height: 27px;
		word-break: break-all;
	}
	.form-title-edit {
		padding-bottom:	2px;
		font-size: 18px;
		border-bottom:1px solid #e5e5e5;
		line-height: 27px;
	}

	.form-title-read span.icon-title-edit {
		display: inline-block;
		width: 16px;
		height: 16px;
		margin: 3px 5px;
    background: url("../../../assets/images/icon_form_edit.png");
    background-size: cover;
		vertical-align: text-bottom;
	}

	.form-title-edit textarea,.form-title-edit .title_edit_textarea {
		width: 100%;
		min-height: 54px;
		border: none;
		font-size: 18px;
		line-height:27px;
		outline: none;
	}

	.form-bg {
		background: #fff;
	}

	/*表单详细描述内容*/
	.form-detail-box {
		margin-bottom:10px;
	}
	.form-detail-content {
		position: relative;
		padding: 14px 14px 23px;
		font-size:15px;
		color:#383838;
		line-height:23px;
		overflow: hidden;
	}
	.form-detail-content p * {
		max-width: 100%;
		vertical-align: middle;
	}
	.form-detail-content-blur {
		position: absolute;
		width: 100%;
		height: 69px;
		background: linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,1));
		transform: translateY(-69px);
	}
	.form-detail-content-toggle{
		width:100%;
		height: 58px;
		font-size: 14px;
		text-align: center;
		color: #a6a6a6;
		line-height:58px ;
	}
	.form-detail-content-toggle span {
		display: inline-block;
		width: 12px;
		height: 12px;
		margin: 0px 5px;
		background-size: cover;
		vertical-align: text-bottom;
	}
	.form-detail-content-toggle span.toggle-up {
		background:-11px 0  url('../../../assets/images/icon_form_arrow_toggle.png') no-repeat;
	}
	.form-detail-content-toggle span.toggle-down {
		background:0 0  url('../../../assets/images/icon_form_arrow_toggle.png') no-repeat;

	}

	.form-detail-content-height {
		height:92px;
	}
	/*input,textarea {*/
	/*caret-color: #007aff;*/
	/*caret-width:2px;*/
	/*}*/

	.colorRed {
		color: #fa3d29 !important;
	}
	.colorblue{
		color: #586c94;
	}
	.colorGray {
		color: #a6a6a6;
	}

	.form-group {
		padding: 0 14px;
	}

	.form-group * {
		box-sizing: border-box;
	}

	.form-content {
		background: #fff;
		padding-bottom: 15px;
        font-weight: normal;
		font-size:15px;
		font-family:PingFang-SC-Medium;
		color: #383838;
		line-height: 1.5;
	}

	.form-group .control-label {
		/*font-size:15px;*/
		/*font-family:PingFang-SC-Medium;*/
		/*color:rgba(56,56,56,1);*/
		/*line-height: 15px;*/
	}

	.form-content .form-label {
		padding: 24px 0 10px;
		line-height: 15px;
	}
	.form-label-icon {
		position: relative;
		margin-right: 10px;
		width: 18px;
		height: 18px;
	}
	.icon-history{
		background: url(../../../assets/images/icon_form_record.png) no-repeat;
		transform:translateY(-2px);

	}
  .icon-edit{
    background: url("../../../assets/images/icon_form_edit.png") no-repeat;
  }
	.field-content .icon-phone {
		display: inline-block;
		float: right;
		position: relative;
		top:-31px;
		right:12px;
		width: 22px;
		height: 22px;
		background: url(../../../assets/images/form_icon_phone.png) no-repeat center;
		background-size: cover;
		vertical-align: text-bottom;
	}
	.field-content .text-field {
		position: relative;
		width: 100%;
		height: 40px;
		font-size:15px;
		line-height: 1;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
		padding: 0 10px;
		overflow: hidden;
		overflow-x: scroll;
	}
	.field-content .teleShow{
		padding-right: 55px;
	}
	.field-content .geo-field {
		position: relative;
		width: 100%;
		min-height: 40px;
		font-size:15px;
		line-height: 40px;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
		padding: 0 10px;
		overflow: hidden;
	}
	.field-content .textarea-field {
		width: 100%;
		font-size:15px;
		background:#fff;
		border-radius: 4px ;
		border: 1px solid #e5e5e5;
		padding: 13px 8px 8px 12px;
	}
	.field-content .textarea-field .textarea_div_edit {
		outline:none;
		min-height: 75px;
		word-break: break-all;
	}
	.field-content input{
		color: #383838;
		-webkit-appearance: none;
	}
	input:disabled, textarea:disabled{
		-webkit-text-fill-color: #636363;
		-webkit-opacity: 1;
		color: #636363;
	}
	.field-content .readOnly  {
		background:#f5f5f5;
		border:none;
		color: #636363;
	}
	input.text-field:focus ,.textarea-field.focus{
		border:1px solid #479de6;
	}
	.field-content .text-field-help,
	.field-content input.text-field-help,
	.field-content .textarea-field.text-field-help {
		border:1px solid #fa3d29;
	}
	/*提示字体样式*/
	.field-notes {
		color: #a6a6a6;
		font-size: 12px;
		padding: 6px 0 0;
		line-height: 14px;
	}
	/*单选多选样式*/
	.choice-field-item {
		float: left;
		padding: 12px;
		border-radius: 4px;
	}

	.choice-field-item.row1 {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.choice-field-item.row2 {
		width: 50%;
	}

	.choice-field-item.row3 {
		width: 33%;
	}
	.choice-field-item.selected {
		background: #F7F7F7;
	}
  /*单选多选*/
  .choice-field-item i {
    display: inline-block;
    width: 16px;
    height: 18px;
    background: 0 0 url(../../../assets/images/icon_form_single-unselected.png) no-repeat;
    background-size: 100%;
    margin-right: 10px;
    vertical-align: text-bottom;
  }
  .checkbox-field-item.choice-field-item i{
    background: url(../../../assets/images/icon_form_check-unselected.png) no-repeat;
    background-size: 100%;
  }
  .choice-field-item i.active {
    background: url(../../../assets/images/icon_form_single-checked.png) no-repeat;
    background-size: 100%;
  }
  .checkbox-field-item.choice-field-item i.active {
    background: url(../../../assets/images/icon_form_check-checked.png) no-repeat;
    background-size: 100%;
  }
	/*下拉框样式*/
	.drop-down {
		position: relative;
		width: 100%;
		min-height: 42px;
		padding: 10px;
		font-size: 15px;
		color: #383838;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
	}
	.drop-down .drop-down-label {
		display: inline-block;
		margin-right:24px;
	}

	.drop-down .drop-down-icon {
		position: absolute;
		top: 50%;
		right: 0;
		width: 16px;
		height: 16px;
    margin-right: 12px;
    background:url(../../../assets/images/icon_form_subform-shrink.png) no-repeat center;
    background-size: 100%;
		transform: translateY(-50%);

	}
	/*分页线样式*/
	.section-field {
		margin-top: 24px;
		width: 100%;
		height: 1px;
		background: url(../../../assets/images/icon_form_line.png) repeat-x;
	}
	.section-field-label {
		padding: 10px 0;
		font-size:12px;
		line-height:14px;
		color: #a6a6a6;
	}
	/**/
	.relative-field {
    display: flex;
    flex-wrap: wrap;
    flex-direction:row;
		padding: 5px 7px 0;
		margin-bottom: 8px;
		min-height: 36px;
		color: #424549;
		font-size: 12px;
		background: #F5F5F5;
		border-radius: 4px;
		overflow-x: hidden;
	}

	.relative-list {
		display: inline-block;
		height:26px;
		overflow: hidden;
		padding: 0 10px ;
		margin: 0 5px 5px 0;
		line-height: 24px;
		border: 1px solid #ADD6F0;
		background: #E1EEFF;
		border-radius: 4px;
	}
	.relative-list-itemicon {
		display: inline-block;
		width: 9px;
		height: 10px;
		background:url(../../../assets/images/icon-form-related-customer.png) no-repeat;
		background-size: cover;
		margin-right: 5px;
	}

	.help-block {
		font-size: 12px;
		padding: 10px 0 0;
	}

	/*子表单*/
	.cf-cz {
		color: #586c94;
		line-height: 45px;
		text-align: center;
		height: 35px;
	}

	.fl {
		float: left;
		display: inline;
	}

	.fr {
		float: right;
		display: inline;
	}

	.inner-form-label {
		background: #f5f5f5;
		color: #999;
		padding: 13px 15px 6px 15px;
		border-bottom: 1px solid #479d16;
		position: relative;
	}

	.inner-form-v {
		padding: 12px 15px;
		position: relative;
		min-height: 19px;
	}

	.childForm-item {
		margin-bottom:7px;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
	}
	.childForm-item-font {
		font-size: 13px;
	}
	.cf-tit-box {
		padding: 0 12px;
		background-color: #f5f5f5;
		line-height: 40px;
		overflow: hidden;
		color: #383838;
	}
	.childForm-item-icon {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-size: cover;
		vertical-align: text-bottom;
	}
	.childForm-item-icon.icon-copy{
		margin:0 24px;
    background: url(../../../assets/images/icon_form_subform_copy.png) no-repeat;
    background-size: 100%;
	}
	.childForm-item-icon.icon-delete{
		margin-right:3px;
    height: 20px;
    background: url(../../../assets/images/icon_form_subform_delete.png) no-repeat;
    background-size: 95%;
  }
  .childForm-item-icon.icon-open{
    background: url(../../../assets/images/icon_form_subform-open.png) no-repeat;
    background-size: 50%;
  }
  .childForm-item-icon.icon-shrink{
    height: 15px;
    background: url(../../../assets/images/icon_form_subform-shrink.png) no-repeat;
    background-size: 100%;
  }
	.childForm-item-add {
		height:36px;
		font-size: 14px;
		line-height: 36px;
		text-align: center;
		border:1px dashed #dcdcdc;
		border-radius:4px ;
		overflow: hidden;
		color: #586c94;
	}

	.form-databox-table {
		overflow-x: auto;
	}

	.form-databox table th, .form-databox table td {
		padding: 2px 20px;
		color: #666;
		text-align: left;
		position: relative;
	}

	.form-databox table {
		min-width: 100%;
		position: relative;
	}

	.form-databox table th .widget-title {
		height: 32px;
		line-height: 32px;
		font-weight: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		z-index: 2;
		color: #999;
	}
	/*字体统计样式*/
	.font-count {
		padding-top:3px;
		font-size: 12px;
		text-align: right;
		color: #a6a6a6;
		line-height: 12px;
	}

	/*富文本样式*/
	#content em,#content i{
		font-style: italic;
	}
	#content ul li {
		list-style-type: none;
	}
	#content ul,
	#content ol {
		margin-top: 16px;
		margin-bottom: 16px;
		padding-left: 40px;
	}
	#content ul,#content ol,#content li{
		list-style-type: decimal;
	}
	#content td,#content td{border:1px solid #ddd;}
	#content table{max-width:100%!important;width: 100%!important}
	p#content *{max-width:100%!important;}
</style>
