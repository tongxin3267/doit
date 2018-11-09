function form_validation(schema) {
    //先清空提示
    for (var item of schema) {
        item.help = '';
    }
    var scroll = true;
    for (var item of schema) {
        var value = item.value;
        //验证显示的字段
        if(!item.show){
        	continue;
				}
        if (item.validations && item.validations.indexOf('presence') != -1 && !value) {
            item.help = '请填写' + item.label
            if (scroll) {
				scroll_height(item._id);
                scroll = false;
            }
        }
        //多选按钮必填验证
				if(item._type == 'CheckBox'){
					if (item.validations && item.validations.indexOf('presence') != -1 && (value.length == 0)) {
						item.help = '请填写' + item.label;
						if (scroll) {
							scroll_height(item._id);
							scroll = false;
						}
					}
				}
				//二级下拉框必填验证
			if(item._type == 'CascadeDropDown' && value){
				value = value.split('');
				let index = value.indexOf(':');
				value = value.slice(index+1);
				if (item.validations && item.validations.indexOf('presence') != -1 && (value.length == 0)) {
					item.help = '请填写' + item.label;
					if (scroll) {
						scroll_height(item._id);
						scroll = false;
					}
				}
			}

        //表情字符的验证
			if(value != '' && value != undefined){
        	var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/;
				  if(reg.test(value) === true){
        		item.help = '不支持特殊表情';
						if (scroll) {
							scroll_height(item._id);
							scroll = false;
						}
					}
			}
		//子表单的验证
		if(item._type === 'ChildField'|| item._type === 'FORMREFCustomerField' ){
			item.views && item.views.forEach(function(item){
				var _scroll = form_validation(item.fields);
				if(scroll){
					scroll = _scroll;
				}
			});
		}
        //区别不同字段的属性设置的值的作用(在单行文本，多行文本,多项选择不能多于和少爷多项)
        if (['TextField', 'TextArea', 'CheckBox'].indexOf(item._type) !== -1) {
            if (value && Number(item.minimum_length) && Number(item.minimum_length) > value.length) {
                item.help = item.label + '的值不能少于' + item.minimum_length + '个字符'
                if (item._type == 'CheckBox') {
                    item.help = item.label + '不能少于' + item.minimum_length + '个'
                }
                if (scroll) {
					scroll_height(item._id);
                    scroll = false;
                }
            }
            if (value && Number(item.maximum_length) && Number(item.maximum_length) < value.length) {
                item.help = item.label + '的值不能多于' + item.maximum_length + '个字符'
                if (item._type == 'CheckBox') {
                    item.help = item.label + '不能多于' + item.maximum_length + '个'
                }
                if (scroll) {
					scroll_height(item._id);
                    scroll = false;
                }
            }
        }
        //子表单填单数验证
			if(item._type== 'ChildField' && (item.minimum_length || item.maximum_length)) {
				if (Number(item.minimum_length) && Number(item.minimum_length) > value.length) {
					item.help = item.label + '的表单个数不能少于' + item.minimum_length + '个';
					if (scroll) {
						scroll_height(item._id);
						scroll = false;
					}
				}
				if (Number(item.maximum_length) && Number(item.maximum_length) < value.length) {
					item.help = item.label + '的表单个数不能多于' + item.maximum_length + '个';
					if (scroll) {
						scroll_height(item._id);
						scroll = false;
					}
				}
			}

        //数字字段最大值最小值验证
			if(item._type == "NumberField" && (item.range_max || item.range_min)){
				if(Number(item.range_min) > Number(value) || Number(item.range_max) < Number(value)){
					item.help ='请输入' + (item.range_min ? ('大于'+item.range_min) : '') + (item.range_max?('小于'+item.range_max):'') + '的值';
					if (scroll) {
						scroll_height(item._id);
						scroll = false;
					}
				}
			}

        if (item.validations.indexOf('presence') != -1 || value) {
            //身份证的验证
            if (item._type == "TextField" && item.validations && item.validations.indexOf('isCard') != -1) {
                var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (reg.test(value) === false) {
                    item.help = '身份证格式不正确'
                    if (scroll) {
						scroll_height(item._id);
                        scroll = false;
                    }
                }
            }
        }
        //邮箱验证
        if (item._type == "EmailField" && value != '' && value != undefined) {
            var reg = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
            if (reg.test(value) === false) {
                item.help = '输入的格式不正确或者输入了换行符'
                if (scroll) {
					scroll_height(item._id);
                    scroll = false;
                }
            }
        }
        //电话验证
				if (item._type == "TelephoneField" && value != '' && value != undefined) {
					var reg = /^(\+\d+(-|\s)?)?(\d+(-|\s)?)*\d+$/;
					if (reg.test(value) === false) {
						item.help = '输入的格式不正确或者输入了换行符'
						if (scroll) {
							scroll_height(item._id);
							scroll = false;
						}
					}
				}
			//手机验证（只验证手机电话号码）
			if (item._type == "MobileField" && value != '' && value != undefined) {
				var reg = /^(\+\d)?(-|\s)?1\d*$/;
				if (reg.test(value) === false) {
					item.help = '输入的格式不正确或者输入了换行符'
					if (scroll) {
						scroll_height(item._id);
						scroll = false;
					}
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
                    if (scroll) {
						scroll_height(item._id);
                        scroll = false;
                    }
                }
            }

            if (item.end_date) {
                var et = item.end_date.replaceAll("-", "/");
                var det = new Date(et);
                if (det.getTime() < dut.getTime()) {
                    item.help = item.label + "不能晚于" + item.end_date;
                    if (scroll) {
						scroll_height(item._id);
                        scroll = false;
                    }
                }
            }
        }
    }
    return scroll;
}
function scroll_height(id){
	setTimeout(function(){
		var top = document.getElementById('msg' + id).offsetTop - 80;
		document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
        window.pageYOffset = top;
	},50)

}
function filterData(store){
	var itemMap = JSON.stringify(store.state.formBase.data);
	var copyItemMap = JSON.parse(itemMap);
	//如果有显示逻辑字段，就删除数据
	if(store.state.formBase.relateMatch.length){
		store.state.formBase.schema.forEach(item =>{
			if(!item.show){
				delete copyItemMap[item._id];
			}
		})

	}
	return JSON.stringify(copyItemMap);
}
function fileSendata(val){
	var arr=[];
	val.forEach(function (item,index) {
		var file = val[index];
		arr[index] = file.id + ':' + file.url + ':' + file.fileName + ':' + file.fileExt + ':' + file.fileSizeStr;
	})
	return arr;
}
export {form_validation,filterData,fileSendata}
