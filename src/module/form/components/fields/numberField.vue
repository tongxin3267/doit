<template>
    <div class="field-content">
         <input class="text-field"
			   type="number"
			   :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
               :value="field.value"
               :disabled="field.readonly||field.disabled"
               @blur="setValue($event),validate()">
        <!--@input="setValue($event,field)"-->
		<div class="help-block" v-show="field.validations&&field.validations.indexOf('iscapital')!=-1">{{'大写金额￥：'+ smalltoBIG(field.value)}}</div>
	</div>
</template>
<script>
    import {calculator,convertCurrency} from '../../js/getData'
		import {field_validation} from './validation.js'
    export default {
        props://['field','isChildField'],
            {
                field: {
                    type: Object,
                    required: true
                },
                isChildField: {
                    type: Boolean,
                    default: false
                },

            },
        data() {
            return {}
        },
        created(){
        },
        mounted(){
            if(this.field.value){
                this.setCalculator();
            }
        },
        methods: {
			smalltoBIG(n){
				if(!n)return '';
				if(this.field.validations&&this.field.validations.indexOf('iscapital')!=-1){
					return convertCurrency(n);
				}
			},
//            setAccurate({target}, field) {
//                var value = target.value;
//                var key = field._id;
//                var accurate_num = field.accurate_num;
//                if (accurate_num) {
//                    if (accurate_num < 0) {
//                        accurate_num = 0;
//                    }
//                    value = Number(value || '').toFixed(accurate_num)
//                }
//                this.$emit('change', {key, value});
//            },
            setValue({target}) {
                var key = this.field._id;
								var value = target?target.value:this.field.value;
                if(value){
									var accurate_num = this.field.accurate_num;
									if (accurate_num != 0) {
										if (accurate_num < 0) {
											accurate_num = 0;
										}
										value =Number(value).toFixed(accurate_num)
									}
//									value = Number(value)
								}
								target && (target.value = value);
                this.$emit('change', {key, value});
                this.setCalculator();
            },
            //设置计算式的值
            setCalculator() {
				//不是详情页进行计算式计算
				if(this.$route.path === '/detail')return;

                var field = this.field;
                //判断是否有计算式要计算
                var _this = this;
                var store = this.$store;
                var formData = {};
                var equationMatch = null;
                var equationList = null;
                //子表单的计算式
                if (this.isChildField) {
                    equationList = this.$parent.equationList;
                    equationMatch = this.$parent.equationMatch;
                    var index = this.$parent.index;
                    var parentId = this.$parent.$parent.field._id;
                    formData = this.$store.state.formBase.data[parentId][index];
                    //父表单的计算式
                } else {
                    formData = this.$store.state.formBase.data;
                    equationList = this.$store.state.formBase.equation;
                    equationMatch = this.$store.state.formBase.equationMatch
                }

                if (equationMatch.indexOf(field._id) != -1) {
                    equationList.forEach(function (item) {
                        if (item.matchs.indexOf(field._id) != -1) {
                            var calculatorStr = item.calculator;
                            var obj = {};
                            item.matchs.forEach(function (i) {
                                obj[i] = formData[i] || 0;
                            });
                            var result = calculator(obj, calculatorStr);
                            _this.$emit('change', {key: item.id, value: result});
                        }
                    })
                }
            },
					validate(){
						field_validation(this.field);
					}
        },
		watch:{
			'field.value': function () { //监听数字变化
				this.setValue({})
			},
		}
    }
</script>
<style scoped>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button{
		-webkit-appearance: none !important;
		margin: 0;
	}
	input[type="number"]{
		-moz-appearance:textfield;
	}
</style>
