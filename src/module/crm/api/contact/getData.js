import axios from 'axios'
// 获取联系人列表
export function getContactList(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!searchContact.action`,params);
}

// 一键已阅
export function readAll(){
  return axios.post(`${_.baseURL}/portal/contactsAction!updateAllReadStatus.action`);
}

// 新增编辑联系人input框加载请求
export function getContactsItem(cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!getOptionItem.action',
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
// 编辑页面数据请求
export function getContactHistoryInfo(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!getContactHistoryInfo.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 所属客户列表请求
export function searchClientList(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/clientAction!searchClientList.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
// 新增联系人
export function addContact(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!ajaxAdd.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
// 编辑联系人
export function updateContact(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!ajaxUpdate.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 加载上次联系人
export function getOldGivenList(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!getOldGivenList.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 联系人联系电话重复判断接口
export function queryMobileRepeat(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/contactsAction!queryMobileRepeat.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 详情页接口
export function getClientDetail(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!searchClientAdvanced.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      cb(result.desc)
    }
  })
}
// 验证手机号重复
export function getValidPhone(params,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!validPhone.action',
  params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.code)
    }else{
      _.alert('提示',result.desc,'确定')
      cb(result.code)
    }
  })
}

// 获取当前用户的信息
export function addUserTo(params){
  return axios.post(`${_.baseURL}/portal/contactAction!findUserInfoByUserId.action`,params);
}



