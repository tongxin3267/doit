import axios from 'axios'

// 获取搜索框的切换选项
export function getDynamicType(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getDynamicType.action',{
    isForSelect: 0,
    belongAgent: dataBase.wxqyh_uploadfile.agent
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

//获取页面标题
export function getTitle(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/application/application!ajaxIsTrustAgentForPortal.action',{
    agentCode:dataBase.wxqyh_uploadfile.agent,
    belongAgent: dataBase.wxqyh_uploadfile.agent
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

//获取动态审核数量
export function getDynamicNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getDynamicAuditCount.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
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

//获取评论审核数量
export function getCommentNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getCommentAuditCount.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
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

//获取我发布的数量
export function getMyPublishNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getMyPublishCountInfo.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
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

//查询后台设置是否可以一键已阅
export function markUnreadPower(callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!ajaxViewBatchReadState.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//一键已阅
export function markUnread(callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!batchRead.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('标记成功')
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除草稿
export function deleteDraft(id, callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!batchDel.action',{
    ids:id,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('删除成功')
    }else {
      _.alert('提示',result.desc)
    }
    callback(result)
  })
}

//通过或删除评论
export function passComment(id, status, callback) {
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!auditComment.action',{
    ids:id,
    isPassReview:status,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
//通过动态
export function passDynamic(id, status, callback) {
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!auditDynamic.action',{
    ids:id,
    isPassReview:status,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
