import axios from 'axios';

// 获取合同列表数据
export function getContractList(params){
    return axios.post(`${_.baseURL}/portal/contractAction!searchContractAdvanced.action`, params);
}

// 一键已阅
export function readAll(){
    return axios.post(`${_.baseURL}/portal/contractAction!updateAllReadStatus.action`);
}

// 删除合同
export function delContract(params){
    return axios.post(`${_.baseURL}/portal/contractAction!deleteContract.action`, params);
}

// 获取合同状态
export function getContractStatus(){
    return axios.post(`${_.baseURL}/portal/contractAction!getContractStatusList.action`);
}

// 获取合同类型
export function getContractType(){
    return axios.post(`${_.baseURL}/portal/contractAction!getTypeList.action`);
}
