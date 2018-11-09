import axios from 'axios'

// 打电话
export function getCall(corpId,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/dialToCompany.do',{
    corpId
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
    }else {
      _.hideLoading('');
      cb(result.code)
      _.alert('提示',result.desc)
    }
  })
}

// 企业详情
export function getCompanyDetail(corpId,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/getCompanyDetail.do',{
    corpId
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
     _.alert('提示',result.desc)
    }
  })
}

export function operationRemarks(experienceInfoPO,cb,failcb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/operationRemarks.do',{
    experienceInfoPO
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("操作成功");
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
      failcb()
    }
  })
}

//获取备注信息
export function getRemarkInfo(corpId,cb) {
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/getRemarkInfo.do',{
    corpId
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//修改备注信息
export function remarkInfo(experienceInfoPO,cb) {
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/remarkInfo.do',{
    experienceInfoPO
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.code)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//修改客户等级
export function classify(callInfoId,customerLevel,cb) {
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/classify.do',{
    callInfoId,customerLevel
  }).then(function (result) {
    if(result.code==='0'){
      cb()
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//客户退回公海
export function returnCustomer(corpId,cb) {
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/returnCustomer.do',{
    corpId
  }).then(function (result) {
    if(result.code==='0'){
      cb()
    }else {
      _.alert('提示',result.desc)
    }
  })
}
