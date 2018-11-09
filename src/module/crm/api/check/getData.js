import axios from 'axios'
//客戶查重
//客户查重接口
export function searchClientRepeat(params,callback) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/client/searchRepeatClientList.do',
    params
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
//联系人查重接口
export function searchContactRepeat(params,callback) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/client/searchRepeatContactsList.do',
    params
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
//获取客户详情
export function getClientDetail(params,callback) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/clientAction!getClientDetail.action',
    params
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result)
    }else {
      _.hideLoading('');
      callback(result)
      // _.alert('提示',result.desc)
    }
  })
}
//获取联系人详情
export function getContactDetail(params,callback) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!getContactDetail.action',
    params
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result)
    }else {
      _.hideLoading('');
      callback(result)
      // _.alert('提示',result.desc)
    }
  })
}
//验证是不是公海负责人
export function checkSeaClient(params,callback) {
  _.showLoading('')
  return axios.post(_.baseURL + '/portal/clientPoolAction!validPoolMgr.action',
    params
  ).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result)
    } else {
      _.hideLoading('');
      callback(result)
      // _.alert('提示',result.desc)
    }
  })
}
