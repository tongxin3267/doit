import axios from 'axios';

// 获取拜访列表
export function getVisitList(params){
    return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!searchOutsideAdvanced.action`,params);
}

// 一键已阅
export function readAll(){
    return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!updateAllReadStatus.action`);
}

// 获取未阅信息
export function getNotReadNum(){
    return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!countNotRead.action`);
}

// 删除拜访
export function delVisit(params){
    return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!ajaxBatchDelete.action`, params);
}