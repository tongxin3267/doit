
//ziton_liu
//2018-7-19
//字段验证

function field_validation(item){
	item.help = '';
	var value = item.value;

	//必填验证
	if (item.validations && item.validations.indexOf('presence') != -1 && !value) {
		item.help = '请填写' + item.label;
	}
	//多选按钮必填验证（较特殊）
	if(item._type == 'CheckBox'){
		if (item.validations && item.validations.indexOf('presence') != -1 && (value.length == 0)) {
			item.help = '请填写' + item.label;
		}
	}
	//二级下拉框必填验证
	if(item._type == 'CascadeDropDown' && value){
		value = value.split(':');
		if (item.validations && item.validations.indexOf('presence') != -1 && !value[1]) {
			item.help = '请填写' + item.label;
		}
	}

	//表情字符的验证
	if(value != '' && value != undefined){
		var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
		if(reg.test(value) === true){
			item.help = '不支持特殊表情';
		}
	}

	//区别不同字段的属性设置的值的作用(在单行文本，多行文本,多项选择不能多于和少爷多项)
	if (['TextField', 'TextArea', 'CheckBox'].indexOf(item._type) !== -1) {
		if (value && Number(item.minimum_length) && Number(item.minimum_length) > value.length) {
			item.help = item.label + '的值不能少于' + item.minimum_length + '个字符'
			if (item._type == 'CheckBox') {
				item.help = item.label + '不能少于' + item.minimum_length + '个';
			}
		}
		if (value && Number(item.maximum_length) && Number(item.maximum_length < value.length)) {
			item.help = item.label + '的值不能多于' + item.maximum_length + '个字符'
			if (item._type == 'CheckBox') {
				item.help = item.label + '不能多于' + item.maximum_length + '个';
			}

		}
	}
	//子表单填写数量验证
	if(item._type== 'ChildField' && (item.minimum_length || item.maximum_length)) {
		if (Number(item.minimum_length) && Number(item.minimum_length) > value.length) {
			item.help = item.label + '的表单个数不能少于' + item.minimum_length + '个';
		}
		if (Number(item.maximum_length) && Number(item.maximum_length) < value.length) {
			item.help = item.label + '的表单个数不能多于' + item.maximum_length + '个';
		}
	}
	//数字字段最大值最小值验证
	if(item._type == "NumberField" && (item.range_max || item.range_min)){
		if(Number(item.range_min) > Number(value) || Number(item.range_max) < Number(value)){
			item.help ='请输入' + (item.range_min ? ('大于'+item.range_min) : '') + (item.range_max?('小于'+item.range_max):'') + '的值';
		}
	}

	if (item.validations.indexOf('presence') != -1 || value) {
		//身份证的验证
		if (item._type == "TextField" && item.validations && item.validations.indexOf('isCard') != -1) {
			var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
			if (reg.test(value) === false) {
				item.help = '身份证格式不正确';
			}
		}
	}
	//邮箱验证
	if (item._type == "EmailField" && value != '' && value != undefined) {
		var reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(value) === false) {
			item.help = '输入的格式不正确或者输入了换行符';
		}
	}
	//电话验证
	if (item._type == "TelephoneField" && value != '' && value != undefined) {
		var reg = /^(\+\d+(-|\s)?)?(\d+(-|\s)?)*\d+$/;
		if (reg.test(value) === false) {
			item.help = '输入的格式不正确或者输入了换行符';
		}
	}
	//手机验证（只验证手机电话号码）
	if (item._type == "MobileField" && value != '' && value != undefined) {
		var reg = /^(\+\d)?(-|\s)?1\d*$/;
		if (reg.test(value) === false) {
			item.help = '输入的格式不正确或者输入了换行符';
		}
	}
	//日期的起始时间和结束时间验证
	if (item._type == 'DateField' && value != '' && value != undefined) {
		var ut = value.replaceAll("-", "/");
		var dut = new Date(ut);
		if (item.start_date) {
			var bt = item.start_date.replaceAll("-", "/");
			var dbt = new Date(bt);
			if (dbt.getTime() > dut.getTime()) {
				item.help = item.label + '不能早于' + item.start_date;
			}
		}
		if (item.end_date) {
			var et = item.end_date.replaceAll("-", "/");
			var det = new Date(et);
			if (det.getTime() < dut.getTime()) {
				item.help = item.label + "不能晚于" + item.end_date;
			}
		}
	}
}
export {
	field_validation
}
