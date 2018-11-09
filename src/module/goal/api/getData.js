import axios from 'axios'

export function getfilter({data,success}) {
    _.showLoading('');

    axios.post(_.baseURL+ '/portal/crm/goal/ajaxGoalTeamInit.do',{...data})
        .then((result) => {
            if (result.code === '0') {
                _.hideLoading('');
                success(result.data)
            }else{
                _.hideLoading('');
                _.alert('提示',result.desc);
            }
        })
}


export function getGoalInfo({data,success}) {
    _.showLoading('');
    axios.post(_.baseURL+ '/portal/crm/goal/ajaxSearchGoalDetail.do',{...data})
        .then((result) => {
            if (result.code === '0') {
                _.hideLoading('');
                success(result.data)
            }else{
                _.hideLoading('');
                _.alert('提示',result.desc);
            }
        })
}

// 获取分配目标详情
export function getGoalDetail(goalId, stage, callback){
    _.showLoading('');
    axios.post(`${_.baseURL}/portal/crm/goal/shareGoalDetail.do`,{
        goalId,
        stage
    }).then(res => {
        _.hideLoading('');
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取成员分页列表
export function getMemberList(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/ajaxSearchShare.do`,{
        goalId: obj.goalId,
        stage: obj.stage,
        countType: obj.countType,
        personName: obj.personName || '',
        page: obj.page,
        pageSize: obj.pageSize || 10,
        flag: obj.flag
    }).then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 分配成员目标
export function assignGoal(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/shareGoal.do`,{
        goalId: obj.goalId,
        stage: obj.stage,
        dataJson: obj.dataJson,
        batch: obj.batch
    }).then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取负责的团队列表
export function getTeamList(obj, callback){
    _.showLoading('');
    axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`,{...obj})
    .then(res => {
        _.hideLoading('');
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取成员目标
export function getMemberGoal(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/getMemberGoal.do`,{...obj})
    .then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

