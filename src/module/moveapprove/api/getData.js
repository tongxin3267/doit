import axios from 'axios'

// 获取模板
export function showTypeDict(callback) {
  _.showLoading('');
  axios.get(_.baseURL + '/portal/moveapproveAction!getMoveTemplate.action').then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.template);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 根据选择的模板id获取模板详情
export function getFlowTemplate(id, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/moveapproveAction!getTemplateById.action', {
    id: id
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.tbQyMoveapproveTemplatePO);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 获取配置信息
export function getConfig(callback) {
  axios.get(_.baseURL + '/portal/moveapproveAction!configInfo.action').then(function (result) {
    if (result.code === '0') {
      callback(result.data.config.orgId.replace(/-/g, ''));
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 加载上次审批人、相关人
export function getOldccOrTolist(type, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/moveapproveAction!getOldGivenList.action', {
    type: type
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.ccOrTolist);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 加载默认相关人
export function getccPersonList(taskType, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/moveapproveAction!getccPersonListByTemplateId.action', {
    templateType: taskType
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.cclist)
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 编辑获取历史信息
export function getTaskInfo(moveId, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/moveapproveAction!getMoveHistoryInfo.action', {
    moveId: moveId
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 获取审批详情信息
export function getMoveDetail(data) {
  _.showLoading();
  return axios.post(_.baseURL + '/portal/moveapprove/getMoveDetail.do', {
    ...data
  })
}

// 首页待办列表条数、草稿条数
export function getHomeDraftNum(data) {
  _.showLoading();
  return axios.post(_.baseURL + '/portal/moveapprove/getTodoAndDraftNum.do', {
    ...data
  })
}

//草稿列表
export function getMyDraftMoveList(data, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/moveapprove/myMove.do', {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      callback(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

//删除草稿列表
export function requestBatchDeleteList(data, callback) {
  _.showLoading("删除中...");
  axios.post(_.baseURL + '/portal/moveapproveAction!ajaxBatchDelete.action', {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      callback(result.data);
    } else {
      callback(null);
      _.alert('提示', result.desc);
    }
  })
}

export function commentListMore(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/moveapproveAction!listComment.action", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function addCommentList(data, cb) {                                      //新增评论
  axios.post(_.baseURL + "/portal/moveapprove/commitComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("评论成功");
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function deleteCommentList(data, cb) {                                  //删除评论
  _.showLoading("删除中...");
  axios.post(_.baseURL + "/portal/moveapproveAction!deleteComment.action", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
