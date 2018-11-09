import axios from 'axios';

// 获取crm首页营销数据
export function getMarketing(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getIndexDynamicsList.do').then((result) => {
    if(result.code=='0'){
      _.hideLoading('')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取首页会话消息数量
export function getMessageNum(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/chat/searMessageTotalNum.do').then(result => {
    if(result.code=='0'){
      _.hideLoading('')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取我的名片数据
export function getCard(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getMarketingCard.do').then((result) => {
    if(result.code=='0'){
      _.hideLoading('')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//提交我的名片编辑数据
export function submitCard(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/updateMarketingCard.do',
  {...data}).then((result) => {
    if(result.code=='0'){
      _.hideLoading('')
      _.tooltips_succeed('保存成功')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 获取群聊列表
export function getChatList(data, callBack) {
  _.showLoading('')
  axios.post(_.baseURL + '/portal/chat/getChatList.do', {...data}).then(result => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示', result.desc)
    }
  })
}

// 查询会话聊天记录
export function searchChatList(data, callBack) {
  _.showLoading('')
  axios.post(_.baseURL + '/portal/chatAction!ajaxSearch.action', {...data}).then(result => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示', result.desc)
    }
  })
}

// 获取小程序二维码
export function getSmallProgramQRcode(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getMiniProgramCode.do').then((result) => {
    _.hideLoading('');
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

// 获取营销动态列表
export function getMarketingDynamicList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getMoreDynamicsPage.do',{...data}).then((result) => {
      _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

// 查看管理员列表
export function getMangerList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/managesetting!getUserList.action',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//查询会话ID
export function getChatId(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/chat/addChat.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
