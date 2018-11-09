import axios from 'axios'

export function getSelectResult(dataSource,sql,cb) {
  _.showLoading('');
  axios.post(_.baseURL+'/portal/sqlPortalCtl/schSql.do',{
    dataSource,
    sql
  }).then(function (result) {
    if (result.code == '0'){
      _.hideLoading();
      cb(result.data.sqlResult)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  }).catch(function (error) {
    _.alert(error);
    _.hideLoading();
  })
}

