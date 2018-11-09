import axios from 'axios';

// 获取公海客户列表数据
export function getPoolList(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!searchClientAdvanced.action`, params);
}

// 获取公海池列表数据
export function getClientPool(){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!getMyClientPoolList.action`);
}

// 是否有公海池权限
export function checekManage(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!validPoolMgr.action`, params);
}

// 领取公海客户
export function receivePoolClient(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!receiveClient.action`, params);
}

// 分配公海客户
export function assignPoolClient(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!divideClientManager.action`, params);
}