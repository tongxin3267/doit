import axios from 'axios'

// 获取首页类型的接口
export function getTypeData(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/partyconstructionPortalCtl/findPartyconstructionType.do',{}).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取轮播图，最多九条
export function getLoginPictures(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/partyconstructionPortalCtl/findShowPartyList.do',{
    showCount:3,
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

