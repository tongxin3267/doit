function getDefaultData(data){
  var result = {};
  data.forEach(function(field){
    if(['TextField','TextArea'].indexOf(field._type) != -1){
      if(field.predefined_value){
        result[field._id] = field.predefined_value
      }
    }else if(['RadioButton','DropDown'].indexOf(field._type) != -1){
      field.choices.forEach(function(choice){
        if(choice.selected) {
          result[field._id] = choice._id;
        }
      })

    }else if(['CheckBox'].indexOf(field._type) != -1){
      var value = []
      field.choices.forEach(function(choice){
        if(choice.selected) {
          value.push(choice._id);
        }
      })
      result[field._id] = value;
    }else if(['CityField'].indexOf(field._type) != -1){
      result[field._id] = { province:"广东省", city:"广州市", area:"海珠区"};//
    }else if('CascadeDropDown'== field._type){
      result[field._id] = {key:'fo6f58fb16ef02465a85f831dadf0b524e',val:'AA2'};
    }else if('RatingField'== field._type){
      result[field._id] = 0;
    }

  })
  return result;
}
export {
  getDefaultData
}
