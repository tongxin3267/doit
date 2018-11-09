import axios from 'axios';

// 获取合同回款详情
export function getContractRepayDetail(boardSearchData,callBack){
    _.showLoading('')
    axios.post(_.baseURL+'/portal/contract/searchContractRepayDetail.do',{
        ...boardSearchData
    }).then((result) => {
        if(result.code=='0'){
        _.hideLoading('')
        callBack(result.data)
        }else{
            _.hideLoading('');
            _.alert('提示',result.desc)
        }
    })
}

