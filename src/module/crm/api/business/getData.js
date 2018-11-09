import axios from 'axios';

// 获取商机列表数据
export function getBusinessList(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessAdvanced.action`, params);
}

// 获取商机阶段和商机类别
export function getBussinessStage(){
    return axios.post(`${_.baseURL}/portal/businessAction!getBusinessStage.action`);
} 

// 一键已阅
export function readAll(){
    return axios.post(`${_.baseURL}/portal/businessAction!updateAllReadStatus.action`);
}

// 删除商机
export function delBusiness(params){
    return axios.post(`${_.baseURL}/portal/businessAction!ajaxBatchDelete.action`, params);
}