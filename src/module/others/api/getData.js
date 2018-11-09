import axios from 'axios'

//保存用户信息
export function addExperienceInfo(data,cb) {
  _.showLoading('加载中')
  axios.post(_.baseURL+'/portal/experienceapplication/expappAction!addExperienceInfo.action',data).then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
