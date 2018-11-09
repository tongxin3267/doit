function equation(data){
  var result = [];
  var ids = data.map(function(field){
    return field._id;
  });

  data.forEach(function(field){
    var equationPO = {};
    if('EquationField'== field._type){
      var calculator = field.calculator;
      if(calculator){
        var matchs = ids.filter(function(id){
          return calculator.indexOf(id)!=-1
        })
        equationPO.calculator = calculator;
        equationPO.matchs = matchs;
        equationPO.id = field._id;
        result.push(equationPO);
      }
    }
  })
  return result;
}
export {
  equation
}
