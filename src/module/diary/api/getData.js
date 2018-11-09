import axios from 'axios'

// 获取规则列表
export function getRuleList(callback) {
  _.showLoading('')
  axios.get(_.baseURL+'/portal/diaryAction!getPersonChargeDiary.action').then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 获取规则设置
export function getRuleSetting(ruleId,callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/diaryAction!searchDiaryRule.action',{
    ruleId: ruleId
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 重置规则
export function delDiaryRule(ruleId,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/diaryAction!delDiaryRule.action',{
    ruleId
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      _.tooltips_succeed("重置成功");
      cb()
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 提交规则设置
export function addDiaryRule(data,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/diaryAction!addDiaryRule.action',{
    ...data
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      _.tooltips_succeed("新增成功");
      cb()
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//设置默认需要提交人员
export function showTargetRange(cb) {
  axios.post(_.baseURL+'/portal/departmentAction!getVisitAllUserPermission.action',{
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data.isVisitAll)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取法定假日
export function getLegalDate(year,cb) {
  axios.post(_.baseURL+'/portal/legaldate/getYearDateListByYear.do',{
    year
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
